/** Encabezado común de cada pestaña: título, bajada y, si aplica, la fecha. */
export default function EncabezadoPantalla({ titulo, bajada, fecha }) {
  return (
    <header className="mb-6">
      {fecha ? (
        <p className="mb-1 text-sm font-medium text-marca-700 first-letter:uppercase">{fecha}</p>
      ) : null}
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 text-balance">
        {titulo}
      </h1>
      {bajada ? <p className="mt-1.5 text-slate-600 text-pretty">{bajada}</p> : null}
    </header>
  )
}
