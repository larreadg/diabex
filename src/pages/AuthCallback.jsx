import { Link, Navigate, useLocation } from 'react-router-dom'

import Alert from '@/components/Alert'
import AuthLayout from '@/components/AuthLayout'
import { PantallaCargando } from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { tomarDestino } from '@/lib/destino'
import { mensajeDeErrorOAuth } from '@/lib/errores'

/**
 * Pantalla intermedia a la que Google devuelve al usuario.
 * El cliente de Supabase canjea el código de la URL por una sesión solo
 * (`detectSessionInUrl`); acá únicamente mostramos el estado y redirigimos.
 */
function leerError(location) {
  const query = new URLSearchParams(location.search)
  // Según el flujo, el error puede venir en el query o en el fragmento.
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''))

  return {
    error: query.get('error') ?? hash.get('error'),
    codigo: query.get('error_code') ?? hash.get('error_code'),
    descripcion: query.get('error_description') ?? hash.get('error_description'),
  }
}

export default function AuthCallback() {
  const { autenticado, cargando } = useAuth()
  const location = useLocation()

  const mensaje = mensajeDeErrorOAuth(leerError(location))

  if (mensaje) {
    return (
      <AuthLayout
        titulo="No pudimos ingresar"
        pie={
          <Link to="/login" className="font-semibold text-marca-700 hover:text-marca-900">
            Volver al inicio de sesión
          </Link>
        }
      >
        <Alert tipo="error">{mensaje}</Alert>
      </AuthLayout>
    )
  }

  if (cargando) return <PantallaCargando mensaje="Completando tu ingreso…" />

  if (autenticado) return <Navigate to={tomarDestino()} replace />

  return (
    <Navigate
      to="/login"
      replace
      state={{ aviso: '', error: 'No pudimos completar el ingreso con Google. Probá de nuevo.' }}
    />
  )
}
