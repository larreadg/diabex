import { useEffect, useRef, useState } from 'react'

import { IconoAviso } from '@/components/iconos'
import { calcularEstado, leerEstadoServicio } from '@/lib/estadoServicio'

/**
 * Aviso de pago pendiente de los servicios. Envuelve toda la app: durante el
 * plazo muestra una banda arriba y atenúa el contenido un poco más cada día;
 * pasada la fecha límite abre un modal que no se puede cerrar ni esquivar,
 * en ninguna ruta, hasta que se desactive en el JSON.
 *
 * Se configura en `public/estado-servicio.json`. Para sacarlo: `"activo": false`
 * y deploy.
 */
export default function AvisoServicio({ children }) {
  const [config, setConfig] = useState(null)

  // Se vuelve a leer cada vez que la app vuelve al frente: así un cambio en el
  // archivo llega sin recargar, y una app que quedó abierta de un día para el
  // otro pasa a la fase que corresponde.
  useEffect(() => {
    let vigente = true
    const actualizar = () =>
      leerEstadoServicio().then((leido) => {
        if (vigente) setConfig(leido)
      })
    const alVolver = () => {
      if (document.visibilityState === 'visible') actualizar()
    }

    actualizar()
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      vigente = false
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])

  const estado = calcularEstado(config)
  const opacidad = estado.fase === 'normal' ? 1 : estado.opacidad

  // La forma del árbol no cambia entre fases: si `children` cambiara de
  // padre, React desmontaría las rutas al llegar el JSON y se perdería, por
  // ejemplo, un cuestionario a medio llenar.
  return (
    <>
      {estado.fase === 'aviso' && <Banda titulo={estado.titulo} texto={estado.texto} />}

      <div style={opacidad < 1 ? { opacity: opacidad } : undefined}>{children}</div>

      {estado.fase === 'restringido' && (
        <ModalRestriccion titulo={estado.titulo} texto={estado.texto} />
      )}
    </>
  )
}

function Banda({ titulo, texto }) {
  return (
    <div role="status" className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex w-full max-w-2xl items-start gap-3 px-4 py-3">
        <IconoAviso className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="min-w-0 text-sm text-amber-950 text-pretty">
          <span className="font-semibold">{titulo}</span>
          {titulo && texto && <span aria-hidden="true"> · </span>}
          {texto}
        </p>
      </div>
    </div>
  )
}

/**
 * Modal sin salida: no tiene botón de cerrar, Escape no hace nada y tocar
 * afuera tampoco. `showModal()` deja inerte todo lo de atrás, así que la app se
 * ve pero no se puede usar.
 */
function ModalRestriccion({ titulo, texto }) {
  const dialogo = useRef(null)

  useEffect(() => {
    const el = dialogo.current
    if (!el) return

    el.showModal()
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflowPrevio
      if (el.open) el.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="restriccion-titulo"
      aria-describedby="restriccion-texto"
      onCancel={(e) => e.preventDefault()}
      className="modal-servicio fixed inset-0 z-[var(--z-hoja)] m-0 flex h-full max-h-full w-full max-w-full items-center justify-center bg-slate-900/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop:bg-transparent"
    >
      <div className="modal-servicio-panel w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/20">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
          <IconoAviso className="h-4 w-4 text-amber-700" />
          Pago pendiente
        </p>

        <h1
          id="restriccion-titulo"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 text-balance"
        >
          {titulo}
        </h1>
        <div id="restriccion-texto">
          <p className="mt-3 text-sm text-slate-600 text-pretty">{texto}</p>
          <p className="mt-3 text-sm text-slate-600 text-pretty">
            Tus datos están guardados: no se borró ninguna medición.
          </p>
        </div>
      </div>
    </dialog>
  )
}
