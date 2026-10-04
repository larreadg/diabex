import { NIVELES } from '@/lib/glucosa'

/**
 * El riel del día: el elemento propio de Diabex.
 *
 * La diabetes tipo 1 no se vive como una lista de tarjetas sino como una
 * secuencia: despertar, comer, medir, corregir, dormir. El riel convierte esa
 * secuencia en estructura visible, con la hora a la izquierda y un nodo por
 * momento. El nodo hueco ya dice "acá todavía no hay nada", así que no hace
 * falta repetir "sin datos" en cada fila.
 *
 * Lo comparten Registro, Historial y Alimentación; Autoayuda no lo usa a
 * propósito, porque leer una guía no tiene hora.
 *
 * El color del nodo nunca va solo: cuando hay un nivel, la fila también lo
 * dice con palabras.
 *
 * Si se pasa `onAbrir`, cada fila se vuelve tocable y abre su detalle. Sin esa
 * prop el riel es sólo lectura, que es lo que necesita el plan de comidas.
 *
 * @param {{clave?: string, hora: string, titulo: string, detalle?: string, valor?: string, nivel?: string}[]} momentos
 */
export default function RielDelDia({ momentos, etiqueta, onAbrir }) {
  return (
    <ol aria-label={etiqueta} className="cifras">
      {momentos.map((momento, i) => {
        const { hora, titulo, detalle, valor, nivel, clave } = momento
        const estilo = nivel ? NIVELES[nivel] : null
        const cargado = Boolean(valor)

        const contenido = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              {onAbrir ? (
                <span className="text-sm font-semibold text-slate-900">{titulo}</span>
              ) : (
                <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
              )}
              {cargado ? (
                <span className={`shrink-0 text-sm font-bold ${estilo?.texto ?? 'text-marca-800'}`}>
                  {valor}
                </span>
              ) : null}
            </div>
            {detalle ? <p className="mt-0.5 text-sm text-slate-600">{detalle}</p> : null}
          </>
        )

        return (
          <li key={clave ?? `${hora}-${titulo}-${i}`} className="group grid grid-cols-[3.25rem_1rem_1fr]">
            <span className="pt-0.5 text-right text-sm font-medium text-slate-500">{hora}</span>

            <span className="relative flex justify-center">
              <span
                aria-hidden="true"
                className={`relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full ${
                  cargado
                    ? (estilo?.punto ?? 'bg-marca-600')
                    : 'border-[1.5px] border-slate-300 bg-slate-50'
                }`}
              />
              <span
                aria-hidden="true"
                className="absolute top-4 bottom-0 left-1/2 w-px -translate-x-1/2 bg-slate-200 group-last:hidden"
              />
            </span>

            <div className="pb-6 pl-2 group-last:pb-0">
              {onAbrir ? (
                <button
                  type="button"
                  onClick={() => onAbrir(momento)}
                  className="-mx-2 w-[calc(100%+1rem)] rounded-lg px-2 py-1 text-left transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                >
                  {contenido}
                </button>
              ) : (
                contenido
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
