import { useEffect, useState } from 'react'

import { obtenerPlanDelDia } from '@/features/alimentacion/datos'
import { mensajeDeError } from '@/lib/errores'

/**
 * Trae el plan de comidas de hoy desde la edge function.
 *
 * `habilitado` existe para no gastar un viaje al servidor cuando ya sabemos
 * que va a fallar: sin peso y altura en el perfil la función devuelve 422, y
 * esa pantalla se resuelve del lado del cliente con lo que ya cargó `usePerfil`.
 *
 * La primera llamada del día genera el plan y puede tardar varios segundos;
 * las siguientes leen el plan guardado y vuelven enseguida. Por eso la pantalla
 * avisa qué está pasando en vez de mostrar un esqueleto mudo.
 */
export default function usePlanDelDia(habilitado) {
  const [respuesta, setRespuesta] = useState(null)
  const [error, setError] = useState('')
  // Cambiarlo vuelve a disparar el efecto: es el botón de reintentar.
  const [intento, setIntento] = useState(0)

  // Derivado y no estado: "está cargando" es exactamente "corresponde pedir el
  // plan y todavía no llegó ni el plan ni el error". Tenerlo como estado
  // obligaría a un setState dentro del efecto y a una renderización de más.
  const cargando = habilitado && !respuesta && !error

  useEffect(() => {
    if (!habilitado) return
    let activo = true

    obtenerPlanDelDia()
      .then((datos) => {
        if (activo) setRespuesta(datos)
      })
      .catch((err) => {
        if (activo) setError(mensajeDeError(err))
      })

    return () => {
      activo = false
    }
  }, [habilitado, intento])

  function reintentar() {
    setError('')
    setIntento((n) => n + 1)
  }

  return {
    plan: respuesta?.plan ?? null,
    generadoEn: respuesta?.generado_en ?? null,
    cargando,
    error,
    reintentar,
  }
}
