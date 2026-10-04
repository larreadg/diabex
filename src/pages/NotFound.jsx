import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-5xl font-bold text-marca-800">404</p>
      <h1 className="text-xl font-semibold text-slate-900">No encontramos esta página</h1>
      <p className="text-sm text-slate-600">Puede que el enlace esté mal escrito o ya no exista.</p>
      <Link
        to="/"
        className="mt-2 rounded-xl bg-marca-800 px-5 py-3 text-sm font-semibold text-white hover:bg-marca-900"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
