import { useId } from 'react'

/**
 * Grupo de opciones excluyentes.
 *
 * Son radios de verdad (no botones con estado): así funcionan las flechas del
 * teclado, el lector de pantalla los anuncia como grupo y el formulario los
 * envía solo. Lo que se estiliza es el <span>, guiado por el estado del input.
 *
 * Dos formas:
 * - `fila`: fichas que se acomodan solas. Para opciones cortas y sin explicar.
 * - `columna`: filas de ancho completo con su descripción. Para las preguntas
 *   del cuestionario, donde cada opción necesita un ejemplo.
 *
 * @param {{valor: string, etiqueta: string, detalle?: string}[]} opciones
 */
export default function GrupoOpciones({
  etiqueta,
  ayuda,
  opciones,
  valor,
  onChange,
  nombre,
  orientacion = 'fila',
}) {
  const idGenerado = useId()
  const grupo = nombre ?? idGenerado
  const idAyuda = ayuda ? `${grupo}-ayuda` : undefined
  const enColumna = orientacion === 'columna'

  return (
    <fieldset aria-describedby={idAyuda}>
      <legend
        className={
          enColumna
            ? 'mb-1 text-xl font-extrabold tracking-tight text-slate-900 text-balance'
            : 'mb-1.5 text-sm font-medium text-slate-700'
        }
      >
        {etiqueta}
      </legend>

      {ayuda ? (
        <p id={idAyuda} className={enColumna ? 'mb-4 text-slate-600' : 'mb-2 text-xs text-slate-500'}>
          {ayuda}
        </p>
      ) : null}

      <div className={enColumna ? 'flex flex-col gap-2.5' : 'flex flex-wrap gap-2'}>
        {opciones.map((opcion) => (
          <label key={opcion.valor} className={`cursor-pointer ${enColumna ? 'block' : ''}`}>
            <input
              type="radio"
              name={grupo}
              value={opcion.valor}
              checked={valor === opcion.valor}
              onChange={() => onChange(opcion.valor)}
              className="peer sr-only"
            />

            {enColumna ? (
              <span className="flex min-h-14 flex-col justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 transition-colors peer-checked:border-marca-800 peer-checked:bg-marca-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-marca-600">
                <span className="text-base font-semibold text-slate-900 peer-checked:text-marca-900">
                  {opcion.etiqueta}
                </span>
                {opcion.detalle ? (
                  <span className="mt-0.5 text-sm text-slate-600 text-pretty">{opcion.detalle}</span>
                ) : null}
              </span>
            ) : (
              <span className="flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors peer-checked:border-marca-800 peer-checked:bg-marca-800 peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-marca-600">
                {opcion.etiqueta}
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
