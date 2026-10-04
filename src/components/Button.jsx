import Spinner from '@/components/Spinner'

const VARIANTES = {
  primario:
    'bg-marca-800 text-white hover:bg-marca-900 focus-visible:outline-marca-800 disabled:bg-marca-300',
  secundario:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400 disabled:text-slate-400',
}

export default function Button({
  variante = 'primario',
  cargando = false,
  children,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || cargando}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {cargando ? <Spinner /> : null}
      {children}
    </button>
  )
}
