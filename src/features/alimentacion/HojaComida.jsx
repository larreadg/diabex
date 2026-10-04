import Hoja from '@/components/Hoja'
import { MOMENTOS } from '@/features/alimentacion/presentacion'

/**
 * Detalle de una comida del plan: lo que no entra en la fila del riel.
 *
 * Las opciones viven acá y no en el riel a propósito. Cinco comidas con tres
 * alternativas cada una son quince líneas: en un teléfono eso deja de ser un
 * plan y pasa a ser una lista que hay que leer entera para encontrar la de las
 * 13:00. La fila muestra la sugerencia, y quien quiera cambiarla la toca.
 */
export default function HojaComida({ comida, onCerrar }) {
  const abierta = Boolean(comida)

  return (
    <Hoja abierta={abierta} etiqueta="Detalle de la comida" onCerrar={onCerrar}>
      {() => (
        <>
          <p className="cifras text-sm text-slate-600">
            {MOMENTOS[comida.momento] ?? 'Comida'} · {comida.hora}
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 text-balance">
            {comida.titulo}
          </h2>

          {comida.detalle ? (
            <p className="mt-2 text-slate-600 text-pretty">{comida.detalle}</p>
          ) : null}

          {comida.opciones?.length ? (
            <section className="mt-6" aria-labelledby="titulo-opciones">
              <h3 id="titulo-opciones" className="text-base font-extrabold text-slate-900">
                Si preferís cambiarla
              </h3>
              <ul className="mt-1">
                {comida.opciones.map((opcion) => (
                  <li
                    key={opcion}
                    className="border-t border-slate-200 py-3 text-sm text-slate-600 text-pretty first:mt-2"
                  >
                    {opcion}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </Hoja>
  )
}
