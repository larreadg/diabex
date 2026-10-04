import { useEffect, useRef, useState } from 'react'

// Tiene que coincidir con la duración de .hoja.cerrando en index.css.
const DURACION_CIERRE = 200

/**
 * Hoja que sube desde abajo. Usa <dialog> nativo, así el foco queda atrapado
 * adentro y Escape funciona sin código extra.
 *
 * La entrada y la salida se animan con keyframes (ver index.css) en vez de
 * transiciones disparadas por una clase: el estado base de la hoja es
 * "visible", así que si la animación no corre, se ve igual.
 *
 * `children` es una función que recibe `cerrar`: lo que va adentro suele
 * necesitar cerrar la hoja con su animación después de hacer lo suyo.
 */
export default function Hoja({ abierta, etiqueta, onCerrar, children }) {
  const dialogo = useRef(null)
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    const el = dialogo.current
    if (!el || !abierta) return

    el.showModal()
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflowPrevio
      if (el.open) el.close()
      setCerrando(false)
    }
  }, [abierta])

  function cerrar() {
    if (cerrando) return
    setCerrando(true)
    setTimeout(() => onCerrar(), DURACION_CIERRE)
  }

  if (!abierta) return null

  return (
    <dialog
      ref={dialogo}
      aria-label={etiqueta}
      onCancel={(e) => {
        // Escape: lo frenamos para poder animar la salida y cerrar nosotros.
        e.preventDefault()
        cerrar()
      }}
      // Red de seguridad: si el diálogo se cierra por cualquier otra vía,
      // el estado de React y el scroll del body se sincronizan igual.
      onClose={onCerrar}
      onClick={(e) => {
        // Sólo el área oscura de alrededor cierra; la hoja no.
        if (e.target === dialogo.current) cerrar()
      }}
      className={`hoja fixed inset-0 z-[var(--z-hoja)] m-0 flex h-full max-h-full w-full max-w-full flex-col justify-end bg-slate-900/40 p-0 backdrop:bg-transparent ${
        cerrando ? 'cerrando' : ''
      }`}
    >
      <div className="hoja-panel max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)]">
        {/*
          El asa es además el botón de cerrar. Con <dialog>, el foco entra en
          el primer elemento enfocable: que sea "cerrar" y no una acción con
          consecuencias evita accidentes a quien navega con teclado.
        */}
        <button
          type="button"
          autoFocus
          onClick={cerrar}
          className="flex min-h-11 w-full items-center justify-center rounded-t-3xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-marca-600"
        >
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-slate-300" />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="mx-auto w-full max-w-2xl px-5 pb-5">{children(cerrar)}</div>
      </div>
    </dialog>
  )
}
