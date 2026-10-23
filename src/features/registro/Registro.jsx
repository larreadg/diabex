import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Alert from '@/components/Alert'
import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import RielDelDia from '@/components/RielDelDia'
import { IconoCheuron, IconoDescarga } from '@/components/iconos'
import { useAuth } from '@/context/AuthContext'
import { obtenerMedicionesDeHoy } from '@/features/registro/datos'
import HojaExportar from '@/features/registro/HojaExportar'
import HojaMedicion from '@/features/registro/HojaMedicion'
import { aFilaDelRiel } from '@/features/registro/presentacion'
import { mensajeDeError } from '@/lib/errores'
import { fechaDeHoy } from '@/lib/fechas'

/**
 * Momentos de control habituales en tipo 1. Se muestran sólo cuando todavía no
 * hay nada cargado: son un estado vacío que enseña cuándo conviene medir, no
 * una agenda que haya que cumplir.
 */
const MOMENTOS_SUGERIDOS = [
  { hora: '07:00', titulo: 'Al despertar', detalle: 'En ayunas, antes de desayunar.' },
  { hora: '12:30', titulo: 'Antes del almuerzo', detalle: 'La referencia para calcular el bolo.' },
  { hora: '16:00', titulo: 'Media tarde', detalle: 'Útil si hubo ejercicio o una corrección.' },
  { hora: '20:00', titulo: 'Antes de la cena', detalle: 'Cierra la tarde y abre la noche.' },
  { hora: '23:00', titulo: 'Antes de dormir', detalle: 'Evita irte a la cama fuera de rango.' },
]

function useMedicionesDeHoy() {
  const { user } = useAuth()
  const userId = user?.id

  const [mediciones, setMediciones] = useState([])
  const [cargando, setCargando] = useState(Boolean(userId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    let activo = true

    obtenerMedicionesDeHoy(userId)
      .then((datos) => {
        if (activo) setMediciones(datos)
      })
      .catch((err) => {
        if (activo) setError(mensajeDeError(err))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [userId])

  function quitar(id) {
    setMediciones((previas) => previas.filter((m) => m.id !== id))
  }

  return { mediciones, cargando, error, quitar }
}

export default function Registro() {
  const { mediciones, cargando, error, quitar } = useMedicionesDeHoy()
  const [elegida, setElegida] = useState(null)
  const [exportando, setExportando] = useState(false)
  const hayMediciones = mediciones.length > 0
  const enRango = mediciones.filter((m) => m.nivel === 'en_rango').length

  return (
    <>
      <EncabezadoPantalla
        fecha={fechaDeHoy()}
        titulo="Tu día, medición por medición"
        bajada="Anotá tus valores a medida que los tomás. Cada control queda con el contexto en el que lo hiciste."
      />

      <section aria-labelledby="titulo-dia">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 id="titulo-dia" className="text-base font-extrabold text-slate-900">
            {hayMediciones ? 'Controles de hoy' : 'Cuándo conviene medir'}
          </h2>
          {hayMediciones ? (
            <p className="cifras text-sm text-slate-500">
              {mediciones.length} {mediciones.length === 1 ? 'control' : 'controles'} · {enRango} en
              rango
            </p>
          ) : null}
        </div>

        {cargando ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4" aria-hidden="true">
                <span className="block h-3.5 w-12 shrink-0 rounded bg-slate-200" />
                <span className="block h-3.5 flex-1 rounded bg-slate-100" />
              </div>
            ))}
            <span role="status" className="sr-only">
              Cargando tus mediciones…
            </span>
          </div>
        ) : null}

        {!cargando && error ? <Alert tipo="error">{error}</Alert> : null}

        {!cargando && !error ? (
          <>
            {hayMediciones ? (
              <RielDelDia
                momentos={mediciones.map(aFilaDelRiel)}
                etiqueta="Controles de hoy"
                onAbrir={(fila) => setElegida(mediciones.find((m) => m.id === fila.clave))}
              />
            ) : (
              <>
                <p className="mb-5 text-slate-600 text-pretty">
                  Todavía no anotaste ningún control hoy. Estos son los momentos en los que suele
                  servir más:
                </p>
                <RielDelDia momentos={MOMENTOS_SUGERIDOS} etiqueta="Momentos sugeridos" />
              </>
            )}
          </>
        ) : null}
      </section>

      {/* Las dos miradas hacia atrás van juntas, como filas de una misma
          lista: el calendario para revisar y el PDF para llevar. */}
      <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Link
          to="/registro/historial"
          className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-marca-600"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Ver mis mediciones por fecha
            </span>
            <span className="mt-0.5 block text-sm text-slate-600">
              Un calendario con todo lo que anotaste.
            </span>
          </span>
          <IconoCheuron className="h-4 w-4 shrink-0 text-slate-400" />
        </Link>

        <button
          type="button"
          onClick={() => setExportando(true)}
          className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-marca-600"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-900">Exportar en PDF</span>
            <span className="mt-0.5 block text-sm text-slate-600">
              Elegí las fechas y bajá un informe para tu equipo de salud.
            </span>
          </span>
          <IconoDescarga className="h-5 w-5 shrink-0 text-marca-700" />
        </button>
      </div>

      <section className="mt-6 border-t border-slate-200 pt-6">
        <Link
          to="/registro/nuevo"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-marca-800 px-4 text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-800 active:scale-[0.99] motion-reduce:transition-none"
        >
          Anotar una medición
        </Link>
        <p className="mt-2.5 text-center text-sm text-slate-500 text-pretty">
          Te hacemos unas preguntas cortas y después anotás el valor de tu glucómetro.
        </p>
      </section>

      <HojaMedicion
        medicion={elegida}
        onCerrar={() => setElegida(null)}
        onBorrada={quitar}
      />

      <HojaExportar abierta={exportando} onCerrar={() => setExportando(false)} />
    </>
  )
}
