const ESTILOS = {
  error: 'border-red-200 bg-red-50 text-red-800',
  exito: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

export default function Alert({ tipo = 'error', children }) {
  if (!children) return null

  return (
    <p
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm ${ESTILOS[tipo] ?? ESTILOS.info}`}
    >
      {children}
    </p>
  )
}
