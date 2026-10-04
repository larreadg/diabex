import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { guardarDestino } from '@/lib/destino'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

async function googleHabilitado() {
  try {
    const respuesta = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
    if (!respuesta.ok) return true // Ante la duda, dejamos seguir el flujo normal.

    const settings = await respuesta.json()
    return settings?.external?.google !== false
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // `cargando` es true hasta que sabemos si hay o no una sesión guardada.
  // Evita que las rutas protegidas redirijan a /login durante ese instante.
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return
      setSession(data.session)
      setCargando(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSession(nuevaSesion)
      setCargando(false)
    })

    return () => {
      activo = false
      subscription.unsubscribe()
    }
  }, [])

  const registrarse = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }, [])

  const iniciarSesion = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  /**
   * Ingreso con Google. Sirve tanto para entrar como para crear la cuenta:
   * si el email no existe todavía, Supabase crea el usuario en el momento.
   * Esta llamada saca al usuario del sitio (va a Google) y lo devuelve a
   * /auth/callback, así que normalmente no retorna.
   */
  const iniciarSesionConGoogle = useCallback(async (destino = '/') => {
    // Si el provider no está habilitado, Supabase responde con un JSON crudo en
    // su propio dominio y el usuario nunca vuelve a la app. Lo chequeamos antes
    // para poder mostrar el error acá, en español.
    if (!(await googleHabilitado())) {
      throw { code: 'provider_disabled', message: 'Unsupported provider: provider is not enabled' }
    }

    guardarDestino(destino)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Muestra el selector de cuentas en vez de entrar con la última usada.
        queryParams: { prompt: 'select_account' },
      },
    })

    if (error) throw error
  }, [])

  const cerrarSesion = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      autenticado: Boolean(session),
      cargando,
      registrarse,
      iniciarSesion,
      iniciarSesionConGoogle,
      cerrarSesion,
    }),
    [session, cargando, registrarse, iniciarSesion, iniciarSesionConGoogle, cerrarSesion],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// El hook vive junto al provider a propósito: es la API pública del contexto.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>.')
  }
  return contexto
}
