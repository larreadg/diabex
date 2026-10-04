import { useId } from 'react'

export default function TextField({ label, ayuda, className = '', ...props }) {
  const idGenerado = useId()
  const id = props.id ?? idGenerado
  const idAyuda = ayuda ? `${id}-ayuda` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={idAyuda}
        className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-marca-500 focus:ring-2 focus:ring-marca-500/30 focus:outline-none disabled:bg-slate-100"
        {...props}
      />
      {ayuda ? (
        <p id={idAyuda} className="mt-1.5 text-xs text-slate-500">
          {ayuda}
        </p>
      ) : null}
    </div>
  )
}
