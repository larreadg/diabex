import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import { IconoCheuron, IconoCruz, IconoLupa } from '@/components/iconos'
import { buscarGuias, GRUPOS, guiaPorSlug } from '@/features/autoayuda/guias'

/**
 * Índice de Autoayuda. Rompe el riel del día a propósito: acá no hay horas,
 * hay temas. Filas separadas por líneas finas en vez de tarjetas, para que se
 * lea como un índice y no como un tablero.
 *
 * Con el campo de búsqueda vacío se ven los grupos, que es la forma de mirar
 * todo lo que hay. Apenas se escribe algo los grupos se van y queda una sola
 * lista de resultados: repartir tres resultados en tres grupos los esconde, y
 * quien busca ya sabe qué está buscando.
 */

/** Una fila del índice. La misma se usa navegando y buscando. */
function FilaGuia({ guia }) {
  return (
    <li className="border-b border-slate-200">
      <Link
        to={`/autoayuda/${guia.slug}`}
        className="-mx-2 flex min-h-14 w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-3.5 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-marca-600"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">{guia.titulo}</span>
          <span className="mt-0.5 block text-sm text-slate-600 text-pretty">{guia.resumen}</span>
        </span>
        <IconoCheuron className="h-4 w-4 shrink-0 text-slate-400" />
      </Link>
    </li>
  )
}

export default function Autoayuda() {
  // La consulta vive en la URL para que al volver de una guía siga escrita.
  // Con `replace` no deja una entrada de historial por cada tecla: si no, el
  // botón de atrás tendría que deshacer la búsqueda letra por letra.
  const [parametros, setParametros] = useSearchParams()
  const consulta = parametros.get('q') ?? ''

  function buscar(texto) {
    const siguientes = new URLSearchParams(parametros)
    if (texto) siguientes.set('q', texto)
    else siguientes.delete('q')
    setParametros(siguientes, { replace: true })
  }

  const buscando = consulta.trim().length > 0
  const resultados = useMemo(() => buscarGuias(consulta), [consulta])

  return (
    <>
      <EncabezadoPantalla
        titulo="Autoayuda"
        bajada="Guías cortas, apoyo emocional y herramientas prácticas para el día a día."
      />

      <form role="search" className="mb-6" onSubmit={(evento) => evento.preventDefault()}>
        <label htmlFor="buscar-guia" className="sr-only">
          Buscar una guía por título o por tema
        </label>

        <div className="relative">
          <IconoLupa className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-500" />

          <input
            id="buscar-guia"
            type="search"
            value={consulta}
            onChange={(evento) => buscar(evento.target.value)}
            placeholder="Buscar: hipoglucemia, cetonas, alcohol…"
            // El navegador dibuja su propia cruz en los campos de búsqueda: la
            // sacamos para no tener dos, y porque la nuestra llega a 44 px.
            className="block min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-12 pl-11 text-base text-slate-900 placeholder:text-slate-500 focus:border-marca-500 focus:ring-2 focus:ring-marca-500/30 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />

          {buscando ? (
            <button
              type="button"
              onClick={() => buscar('')}
              className="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-marca-600"
            >
              <IconoCruz className="h-4 w-4" />
              <span className="sr-only">Limpiar la búsqueda</span>
            </button>
          ) : null}
        </div>
      </form>

      {buscando ? (
        <section aria-labelledby="titulo-resultados">
          {/* aria-live y no role="status": un role le pisaría el de encabezado
              al h2, y el conteo tiene que seguir siendo el título de la lista. */}
          <h2 id="titulo-resultados" aria-live="polite" className="text-sm text-slate-600">
            {resultados.length === 0
              ? `Ninguna guía menciona “${consulta}”`
              : `${resultados.length} ${resultados.length === 1 ? 'guía' : 'guías'} para “${consulta}”`}
          </h2>

          {resultados.length > 0 ? (
            <ul className="mt-3 border-t border-slate-200">
              {resultados.map((guia) => (
                <FilaGuia key={guia.slug} guia={guia} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600 text-pretty">
              Probá con una palabra más corta, o con el síntoma en vez del nombre técnico: “bajón”,
              “vómitos”, “cansancio”.
            </p>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-8">
          {GRUPOS.map((grupo) => (
            <section key={grupo.titulo} aria-labelledby={`grupo-${grupo.titulo}`}>
              <h2 id={`grupo-${grupo.titulo}`} className="text-base font-extrabold text-slate-900">
                {grupo.titulo}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{grupo.bajada}</p>

              <ul className="mt-3 border-t border-slate-200">
                {grupo.slugs.map((slug) => {
                  const guia = guiaPorSlug(slug)
                  return guia ? <FilaGuia key={slug} guia={guia} /> : null
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
