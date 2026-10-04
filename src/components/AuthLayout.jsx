import Logo from '@/components/Logo'

/** Marco común para las pantallas de login y registro. */
export default function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-14" />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">{titulo}</h1>
          {subtitulo ? <p className="mt-2 text-sm text-slate-600">{subtitulo}</p> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>

        {pie ? <div className="mt-6 text-center text-sm text-slate-600">{pie}</div> : null}
      </div>
    </div>
  )
}
