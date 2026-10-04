export default function Separador({ texto = 'o' }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">{texto}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  )
}
