import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import Button from '@/components/Button'
import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import RielDelDia from '@/components/RielDelDia'
import { IconoFlechaDerecha, IconoFlechaIzquierda } from '@/components/iconos'
import { useAuth } from '@/context/AuthContext'
import { obtenerMedicionesDelMes } from '@/features/registro/datos'
import HojaMedicion from '@/features/registro/HojaMedicion'
import { aFilaDelRiel, agruparPorDia } from '@/features/registro/presentacion'
import { mensajeDeError } from '@/lib/errores'
import { claveLocal, estructuraDelMes, fechaLarga, nombreDeMes } from '@/lib/fechas'
import { NIVELES } from '@/lib/glucosa'

// Semana de lunes a domingo, como se lee el calendario acá.
const DIAS = [
  { corto: 'L', largo: 'lunes' },
  { corto: 'M', largo: 'martes' },
  { corto: 'M', largo: 'miércoles' },
  { corto: 'J', largo: 'jueves' },
  { corto: 'V', largo: 'viernes' },
  { corto: 'S', largo: 'sábado' },
  { corto: 'D', largo: 'domingo' },
]

// Más de esto no entra en una celda de teléfono. El detalle del día los muestra
// todos igual, así que los puntos comunican "cómo vino el día", no cuántos.
const PUNTOS_VISIBLES = 6

/**
 * Carga las mediciones del mes. El estado guarda a qué mes pertenece lo que
 * tiene: "estoy cargando" se deduce de comparar ese mes con el pedido, en vez
 * de encender una bandera dentro del efecto.
 *
 * Mientras carga devuelve una lista vacía y no la del mes anterior: si no, el
 * calendario nuevo se pintaría un instante con los puntos del mes viejo.
 */
function useMedicionesDelMes(anio, mes) {
  const { user } = useAuth()
  const userId = user?.id

  const [intento, setIntento] = useState(0)
  const [estado, setEstado] = useState({ clave: null, mediciones: [], error: '' })

  const clave = `${anio}-${mes}-${intento}`
  const cargando = Boolean(userId) && estado.clave !== clave

  useEffect(() => {
    if (!userId) return
    let activo = true

    obtenerMedicionesDelMes(userId, anio, mes)
      .then((datos) => {
        if (activo) setEstado({ clave, mediciones: datos, error: '' })
      })
      .catch((err) => {
        if (activo) setEstado({ clave, mediciones: [], error: mensajeDeError(err) })
      })

    return () => {
      activo = false
    }
  }, [userId, anio, mes, clave])

  function quitar(id) {
    setEstado((previo) => ({ ...previo, mediciones: previo.mediciones.filter((m) => m.id !== id) }))
  }

  return {
    mediciones: cargando ? [] : estado.mediciones,
    cargando,
    error: cargando ? '' : estado.error,
    reintentar: () => setIntento((n) => n + 1),
    quitar,
  }
}

/** Los controles del día, como una fila de puntos del mismo color que el riel. */
function PuntosDelDia({ mediciones }) {
  if (!mediciones?.length) {
    return <span className="mt-1 block h-1.5" aria-hidden="true" />
  }

  return (
    <span className="mt-1 flex h-1.5 justify-center gap-[2px]" aria-hidden="true">
      {mediciones.slice(0, PUNTOS_VISIBLES).map((medicion) => (
        <span
          key={medicion.id}
          className={`h-1.5 w-1.5 rounded-full ${NIVELES[medicion.nivel]?.punto ?? 'bg-marca-600'}`}
        />
      ))}
    </span>
  )
}

function Calendario({ anio, mes, porDia, seleccionada, onSeleccionar, claveDeHoy }) {
  const { cantidadDeDias, desplazamiento } = estructuraDelMes(anio, mes)
  const celdas = [
    ...Array.from({ length: desplazamiento }, () => null),
    ...Array.from({ length: cantidadDeDias }, (_, i) => i + 1),
  ]

  const semanas = []
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7))

  return (
    <table className="w-full table-fixed border-separate border-spacing-y-1">
      <thead>
        <tr>
          {DIAS.map((dia, i) => (
            <th key={i} scope="col" className="pb-2 text-xs font-semibold text-slate-500">
              <abbr title={dia.largo} className="no-underline">
                {dia.corto}
              </abbr>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {semanas.map((semana, s) => (
          <tr key={s}>
            {semana.map((dia, d) => {
              if (dia === null) return <td key={d} />

              const fecha = new Date(anio, mes, dia)
              const clave = claveLocal(fecha)
              const delDia = porDia.get(clave)
              const esHoy = clave === claveDeHoy
              const elegida = clave === seleccionada
              const futura = clave > claveDeHoy

              return (
                <td key={d} className="text-center align-top">
                  <button
                    type="button"
                    disabled={futura}
                    onClick={() => onSeleccionar(clave)}
                    aria-current={esHoy ? 'date' : undefined}
                    aria-pressed={elegida}
                    aria-label={`${fechaLarga(fecha)}. ${
                      delDia
                        ? `${delDia.length} ${delDia.length === 1 ? 'control' : 'controles'}`
                        : 'Sin controles'
                    }`}
                    // El día elegido se marca con un anillo y no con un relleno
                    // oscuro: sobre azul lleno, los puntos azules desaparecen y
                    // se pierde justo la información que la celda tiene que dar.
                    className={`mx-auto flex h-11 w-full max-w-11 flex-col items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 ${
                      elegida ? 'bg-marca-50 ring-2 ring-marca-700 ring-inset' : ''
                    } ${futura ? 'text-slate-400' : 'text-slate-700'} ${
                      !futura && !elegida ? 'hover:bg-slate-100' : ''
                    }`}
                  >
                    <span className={`cifras text-sm ${esHoy ? 'font-extrabold' : 'font-medium'}`}>
                      {dia}
                    </span>
                    <PuntosDelDia mediciones={delDia} />
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Historial() {
  const navigate = useNavigate()
  const hoy = new Date()
  const claveDeHoy = claveLocal(hoy)

  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth())
  const [seleccionada, setSeleccionada] = useState(claveDeHoy)

  const { mediciones, cargando, error, reintentar, quitar } = useMedicionesDelMes(anio, mes)
  const [elegida, setElegida] = useState(null)
  const porDia = agruparPorDia(mediciones, claveLocal)

  const delDiaElegido = porDia.get(seleccionada) ?? []
  const diasConControles = porDia.size
  // No hay datos en el futuro, así que no se navega hacia adelante.
  const esMesActual = anio === hoy.getFullYear() && mes === hoy.getMonth()

  function cambiarMes(salto) {
    const destino = new Date(anio, mes + salto, 1)
    setAnio(destino.getFullYear())
    setMes(destino.getMonth())
    // Si el mes de destino es el actual, queda elegido hoy; si no, ninguno.
    const vaAlMesActual =
      destino.getFullYear() === hoy.getFullYear() && destino.getMonth() === hoy.getMonth()
    setSeleccionada(vaAlMesActual ? claveDeHoy : '')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/registro')}
        className="-mx-2 mb-3 flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
      >
        <IconoFlechaIzquierda className="h-4 w-4" />
        Volver
      </button>

      <EncabezadoPantalla
        titulo="Mis mediciones por fecha"
        bajada="Tocá un día para ver los controles que anotaste. Los días en blanco son días sin controles."
      />

      <section aria-label="Calendario de controles">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => cambiarMes(-1)}
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
          >
            <IconoFlechaIzquierda className="h-5 w-5" />
            <span className="sr-only">Mes anterior</span>
          </button>

          <h2
            aria-live="polite"
            className="text-base font-extrabold text-slate-900 first-letter:uppercase"
          >
            {nombreDeMes(anio, mes)}
          </h2>

          <button
            type="button"
            onClick={() => cambiarMes(1)}
            disabled={esMesActual}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            <IconoFlechaDerecha className="h-5 w-5" />
            <span className="sr-only">Mes siguiente</span>
          </button>
        </div>

        {error ? (
          <div className="flex flex-col gap-4">
            <Alert tipo="error">{error}</Alert>
            <Button variante="secundario" onClick={reintentar}>
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <div className={cargando ? 'opacity-40 transition-opacity' : 'transition-opacity'}>
              <Calendario
                anio={anio}
                mes={mes}
                porDia={porDia}
                seleccionada={seleccionada}
                onSeleccionar={setSeleccionada}
                claveDeHoy={claveDeHoy}
              />
            </div>

            <p role="status" className="mt-3 text-sm text-slate-500">
              {cargando
                ? 'Cargando el mes…'
                : diasConControles === 0
                  ? 'Sin controles anotados este mes.'
                  : `${diasConControles} ${diasConControles === 1 ? 'día' : 'días'} con controles · ${mediciones.length} en total.`}
            </p>
          </>
        )}
      </section>

      {seleccionada && !error ? (
        <section aria-labelledby="titulo-dia-elegido" className="mt-8 border-t border-slate-200 pt-6">
          <h2
            id="titulo-dia-elegido"
            className="mb-5 text-base font-extrabold text-slate-900 first-letter:uppercase"
          >
            {fechaLarga(new Date(`${seleccionada}T00:00:00`))}
          </h2>

          {delDiaElegido.length > 0 ? (
            <RielDelDia
              momentos={delDiaElegido.map(aFilaDelRiel)}
              etiqueta="Controles de ese día"
              onAbrir={(fila) => setElegida(delDiaElegido.find((m) => m.id === fila.clave))}
            />
          ) : (
            <p className="text-slate-600 text-pretty">
              {cargando ? 'Buscando…' : 'No anotaste controles este día.'}
            </p>
          )}
        </section>
      ) : null}

      <HojaMedicion medicion={elegida} onCerrar={() => setElegida(null)} onBorrada={quitar} />
    </>
  )
}
