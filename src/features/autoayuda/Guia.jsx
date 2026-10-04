import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import { IconoFlechaIzquierda } from '@/components/iconos'
import { guiaPorSlug, NOTA_LEGAL } from '@/features/autoayuda/guias'

/**
 * Una guía de Autoayuda, para leer.
 *
 * Es texto largo y nada más: sin riel, sin tarjetas y sin nada que tocar. La
 * medida de línea se limita a `max-w-prose` porque en una tablet una línea de
 * ancho completo se vuelve incómoda de seguir.
 */

/** El único lugar donde una guía usa color, y siempre con su título al lado. */
function Seccion({ titulo, parrafos, lista, urgente }) {
  const contenido = (
    <>
      <h2
        className={`text-base font-extrabold ${urgente ? 'text-red-800' : 'text-slate-900'}`}
      >
        {titulo}
      </h2>

      {parrafos?.map((parrafo) => (
        <p
          key={parrafo}
          className={`mt-2 text-pretty ${urgente ? 'text-sm text-red-800' : 'text-slate-600'}`}
        >
          {parrafo}
        </p>
      ))}

      {lista?.length ? (
        <ul className={`mt-3 flex flex-col gap-2 ${urgente ? '' : 'border-t border-slate-200 pt-3'}`}>
          {lista.map((item) => (
            <li
              key={item}
              className={`flex gap-2.5 text-sm text-pretty ${urgente ? 'text-red-800' : 'text-slate-600'}`}
            >
              <span
                aria-hidden="true"
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${urgente ? 'bg-red-600' : 'bg-marca-600'}`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )

  if (urgente) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">{contenido}</section>
    )
  }

  return <section>{contenido}</section>
}

/** Un slug que no existe: se dice, y se ofrece la vuelta. No se redirige en silencio. */
function NoExiste() {
  return (
    <>
      <EncabezadoPantalla
        titulo="No encontramos esa guía"
        bajada="Puede que haya cambiado de dirección. Estas son todas las que tenemos."
      />
      <Link
        to="/autoayuda"
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-marca-800 px-4 text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-800 active:scale-[0.99] motion-reduce:transition-none"
      >
        Ver todas las guías
      </Link>
    </>
  )
}

export default function Guia() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const guia = guiaPorSlug(slug)

  // Si la guía se abre desde el final del índice, el navegador conserva el
  // scroll y la lectura empezaría por la mitad del artículo.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!guia) return <NoExiste />

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/autoayuda')}
        className="-mx-2 mb-3 flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
      >
        <IconoFlechaIzquierda className="h-4 w-4" />
        Autoayuda
      </button>

      <article className="max-w-prose">
        <EncabezadoPantalla titulo={guia.titulo} bajada={guia.entrada} />

        <div className="flex flex-col gap-8">
          {guia.secciones.map((seccion) => (
            <Seccion key={seccion.titulo} {...seccion} />
          ))}
        </div>

        <p className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500 text-pretty">
          {NOTA_LEGAL}
        </p>
      </article>
    </>
  )
}
