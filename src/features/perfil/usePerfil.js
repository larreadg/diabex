import { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { obtenerPerfil } from '@/features/perfil/datos'
import { mensajeDeError } from '@/lib/errores'

/**
 * Carga el perfil del usuario. Cada pantalla que lo necesita lo pide por su
 * cuenta: son pantallas distintas, nunca están una al lado de la otra, así que
 * no vale la pena montar una caché para esto.
 *
 * `perfil` es null cuando el usuario todavía no lo completó, que es un estado
 * normal y no un error.
 */
export default function usePerfil() {
  const { user } = useAuth()
  const userId = user?.id

  // Arranca cargando sólo si hay a quién consultar: así el efecto no tiene que
  // corregir el estado apenas monta.
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(Boolean(userId))
  const [error, setError] = useState('')
  // Cambiarlo vuelve a disparar el efecto: es el botón de reintentar.
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!userId) return
    let activo = true

    obtenerPerfil(userId)
      .then((datos) => {
        if (activo) setPerfil(datos)
      })
      .catch((err) => {
        if (activo) setError(mensajeDeError(err))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [userId, intento])

  function reintentar() {
    setError('')
    setCargando(true)
    setIntento((n) => n + 1)
  }

  return { perfil, cargando, error, reintentar }
}
