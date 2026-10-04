import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Aviso de que hay una versión nueva de Diabex.
 *
 * El service worker se registra con `prompt` y no con `autoUpdate` justamente
 * para que exista este cartel: con actualización automática la página se
 * recarga sola cuando el worker nuevo toma el control, y eso puede pasar con el
 * cuestionario de una medición a medio llenar. Acá la recarga la pide la
 * persona, cuando no está en el medio de algo.
 *
 * Se apoya sobre la barra de pestañas y una hoja abierta lo tapa (`--z-aviso`
 * está por debajo de `--z-hoja`): mientras hay un diálogo, nada le compite.
 */
export default function AvisoActualizacion() {
  const {
    needRefresh: [hayVersionNueva, marcarVista],
    updateServiceWorker,
  } = useRegisterSW()

  if (!hayVersionNueva) return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-[var(--z-aviso)] px-4 pb-3 md:bottom-0 md:pb-4"
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/10">
        <p className="min-w-0 flex-1 text-sm text-slate-600 text-pretty">
          Hay una versión nueva de Diabex.
        </p>

        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="min-h-11 shrink-0 rounded-lg bg-marca-800 px-4 text-sm font-bold text-white transition-colors hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-800"
        >
          Actualizar
        </button>

        <button
          type="button"
          onClick={() => marcarVista(false)}
          className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}
