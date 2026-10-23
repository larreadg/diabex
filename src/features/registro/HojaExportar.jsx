import { useState } from 'react'

import Alert from '@/components/Alert'
import Button from '@/components/Button'
import GrupoOpciones from '@/components/GrupoOpciones'
import Hoja from '@/components/Hoja'
import TextField from '@/components/TextField'
import { useAuth } from '@/context/AuthContext'
import { obtenerPerfil } from '@/features/perfil/datos'
import { obtenerMedicionesEntre } from '@/features/registro/datos'
import { mensajeDeError } from '@/lib/errores'
import { claveLocal, desdeClave, diasEntre, textoDelRango } from '@/lib/fechas'
import { edadEnAnios } from '@/lib/salud'

const RANGOS = [
  { valor: '7', etiqueta: '7 días' },
  { valor: '14', etiqueta: '14 días' },
  { valor: '30', etiqueta: '30 días' },
  { valor: '90', etiqueta: '90 días' },
  { valor: 'otro', etiqueta: 'Otras fechas' },
]

// Un año entra cómodo en el PDF. Más que eso es una tabla de decenas de
// páginas que nadie va a leer en una consulta.
const DIAS_MAXIMOS = 366

function haceDias(n) {
  const fecha = desdeClave(claveLocal(new Date()))
  fecha.setDate(fecha.getDate() - n)
  return fecha
}

/** El rango elegido como dos medianoches locales, o el motivo por el que no sirve. */
function rangoElegido(opcion, desdeOtro, hastaOtro) {
  if (opcion !== 'otro') {
    return { desde: haceDias(Number(opcion) - 1), hasta: haceDias(0), problema: '' }
  }

  if (!desdeOtro || !hastaOtro) return { problema: 'Elegí las dos fechas.' }
  const desde = desdeClave(desdeOtro)
  const hasta = desdeClave(hastaOtro)
  if (desde > hasta) return { problema: 'La fecha de inicio tiene que ser anterior a la de fin.' }
  if (diasEntre(desde, hasta) + 1 > DIAS_MAXIMOS) {
    return { problema: 'El informe abarca hasta un año. Elegí un rango más corto.' }
  }
  return { desde, hasta, problema: '' }
}

/**
 * Elegir un rango de fechas y bajar el informe en PDF.
 *
 * El PDF se arma en el teléfono, con lo que ya está en Supabase: no hay un
 * servidor que lo genere ni un archivo que quede guardado en ningún lado.
 */
export default function HojaExportar({ abierta, onCerrar }) {
  const { user } = useAuth()
  const [opcion, setOpcion] = useState('30')
  const [desdeOtro, setDesdeOtro] = useState(() => claveLocal(haceDias(29)))
  const [hastaOtro, setHastaOtro] = useState(() => claveLocal(haceDias(0)))
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState('')

  const hoy = claveLocal(new Date())
  const { desde, hasta, problema } = rangoElegido(opcion, desdeOtro, hastaOtro)
  const dias = problema ? 0 : diasEntre(desde, hasta) + 1

  function cambiar(accion) {
    return (valor) => {
      setError('')
      setListo('')
      accion(valor)
    }
  }

  async function descargar() {
    setError('')
    setListo('')
    setGenerando(true)

    try {
      const [mediciones, perfil] = await Promise.all([
        obtenerMedicionesEntre(user.id, desde, hasta),
        // Sin perfil el informe sale igual, sólo sin nombre ni edad: no vale
        // la pena frenar la descarga por eso.
        obtenerPerfil(user.id).catch(() => null),
      ])

      if (mediciones.length === 0) {
        setError('No anotaste controles entre esas fechas. Probá con un rango más amplio.')
        return
      }

      let descargarInforme
      try {
        ;({ descargarInforme } = await import('@/features/registro/informe/generarPdf'))
      } catch {
        setError('No pudimos preparar el PDF. Revisá tu conexión y volvé a intentar.')
        return
      }

      await descargarInforme({
        mediciones,
        desde,
        hasta,
        nombre: perfil?.nombre?.trim() || '',
        edad: edadEnAnios(perfil?.fecha_nacimiento),
      })
      setListo(
        `Listo: bajamos el informe con ${mediciones.length} ${
          mediciones.length === 1 ? 'control' : 'controles'
        }.`,
      )
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Hoja
      abierta={abierta}
      etiqueta="Exportar mediciones en PDF"
      onCerrar={() => {
        setError('')
        setListo('')
        onCerrar()
      }}
    >
      {() => (
        <>
          <h2 className="text-base font-extrabold text-slate-900">Exportar en PDF</h2>
          <p className="mt-1 text-sm text-slate-600 text-pretty">
            Un informe en A4 con tus valores, cómo se repartieron y el detalle de cada control.
            Listo para llevar a la consulta.
          </p>

          <div className="mt-5">
            <GrupoOpciones
              etiqueta="Qué período"
              opciones={RANGOS}
              valor={opcion}
              onChange={cambiar(setOpcion)}
            />
          </div>

          {opcion === 'otro' ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <TextField
                label="Desde"
                type="date"
                value={desdeOtro}
                max={hastaOtro || hoy}
                onChange={(e) => cambiar(setDesdeOtro)(e.target.value)}
              />
              <TextField
                label="Hasta"
                type="date"
                value={hastaOtro}
                min={desdeOtro || undefined}
                max={hoy}
                onChange={(e) => cambiar(setHastaOtro)(e.target.value)}
              />
            </div>
          ) : null}

          <p className="cifras mt-4 text-sm text-slate-600" aria-live="polite">
            {problema ? (
              <span className="font-semibold text-red-800">{problema}</span>
            ) : (
              <>
                <span className="font-semibold text-slate-900">{textoDelRango(desde, hasta)}</span>
                {' · '}
                {dias} {dias === 1 ? 'día' : 'días'}
              </>
            )}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <Alert tipo="error">{error}</Alert>
            <Alert tipo="exito">{listo}</Alert>
            <Button onClick={descargar} cargando={generando} disabled={Boolean(problema)}>
              {generando ? 'Armando el PDF…' : 'Descargar PDF'}
            </Button>
          </div>
        </>
      )}
    </Hoja>
  )
}
