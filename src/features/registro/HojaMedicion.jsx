import { useState } from 'react'

import Alert from '@/components/Alert'
import Hoja from '@/components/Hoja'
import { IconoTacho } from '@/components/iconos'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { borrarMedicion } from '@/features/registro/datos'
import { horaDe } from '@/features/registro/presentacion'
import { mensajeDeError } from '@/lib/errores'
import { fechaLarga } from '@/lib/fechas'
import { ETIQUETAS, NIVELES } from '@/lib/glucosa'

function Dato({ etiqueta, children }) {
  if (!children) return null
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-slate-200 py-2.5">
      <dt className="text-sm text-slate-600">{etiqueta}</dt>
      <dd className="text-right text-sm font-semibold text-slate-900">{children}</dd>
    </div>
  )
}

/**
 * Detalle de un control ya anotado, y el único lugar desde donde se puede
 * borrar. El borrado vive acá y no como un ícono en cada fila del riel: es
 * irreversible, y un tacho siempre visible en una lista se toca sin querer.
 */
export default function HojaMedicion({ medicion, onCerrar, onBorrada }) {
  const { user } = useAuth()
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')

  const abierta = Boolean(medicion)
  const estilo = abierta ? NIVELES[medicion.nivel] : null

  async function borrar(cerrar) {
    setError('')
    setBorrando(true)
    try {
      await borrarMedicion(user.id, medicion.id)
      onBorrada(medicion.id)
      cerrar()
    } catch (err) {
      setError(mensajeDeError(err))
      setBorrando(false)
      setConfirmando(false)
    }
  }

  return (
    <Hoja
      abierta={abierta}
      etiqueta="Detalle del control"
      onCerrar={() => {
        setConfirmando(false)
        setError('')
        setBorrando(false)
        onCerrar()
      }}
    >
      {(cerrar) => {
        const fecha = new Date(medicion.medido_en)

        return (
          <>
            <p className="text-sm text-slate-600 first-letter:uppercase">
              {fechaLarga(fecha)} · {horaDe(medicion)}
            </p>

            <p className={`mt-3 text-sm font-bold ${estilo.texto}`}>{estilo.etiqueta}</p>
            <p className="cifras mt-0.5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {medicion.glucosa_mg_dl}
              </span>
              <span className="text-base font-medium text-slate-600">mg/dL</span>
            </p>

            <dl className="mt-5">
              <Dato etiqueta="Momento">{ETIQUETAS.momento[medicion.momento]}</Dato>
              <Dato etiqueta="Respecto de la comida">
                {medicion.relacion_comida
                  ? ETIQUETAS.relacion_comida[medicion.relacion_comida]
                  : null}
              </Dato>
              <Dato etiqueta="Actividad física">
                {ETIQUETAS.actividad[medicion.actividad]}
              </Dato>
              <Dato etiqueta="Calorías de la última comida">
                {medicion.calorias == null ? null : `${medicion.calorias} kcal`}
              </Dato>
              <Dato etiqueta="Te sugerimos">{medicion.recomendacion_titulo}</Dato>
            </dl>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <Alert tipo="error">{error}</Alert>

              {confirmando ? (
                <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    ¿Borrar este control de {medicion.glucosa_mg_dl} mg/dL?
                  </p>
                  <p className="mt-1 text-sm text-red-800 text-pretty">
                    No se puede deshacer. Vas a tener que volver a anotarlo.
                  </p>

                  {/* Apilados y no lado a lado: en un teléfono angosto "Sí,
                      borrar" se parte en dos líneas, y así cada botón queda
                      del ancho completo. */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => borrar(cerrar)}
                      disabled={borrando}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 text-sm font-bold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-70"
                    >
                      {borrando ? <Spinner className="h-4 w-4" /> : null}
                      {borrando ? 'Borrando…' : 'Sí, borrar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(false)}
                      disabled={borrando}
                      className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:opacity-70"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmando(true)}
                    className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 text-left text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    <IconoTacho className="h-5 w-5 text-red-700" />
                    Borrar esta medición
                  </button>
                  <p className="mt-1.5 text-sm text-slate-500 text-pretty">
                    Sólo si la cargaste con un valor equivocado. Un control borrado no se recupera.
                  </p>
                </>
              )}
            </div>
          </>
        )
      }}
    </Hoja>
  )
}
