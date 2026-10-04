import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import Button from '@/components/Button'
import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import TextField from '@/components/TextField'
import { IconoFlechaIzquierda } from '@/components/iconos'
import { useAuth } from '@/context/AuthContext'
import { guardarPerfil } from '@/features/perfil/datos'
import usePerfil from '@/features/perfil/usePerfil'
import { mensajeDeError } from '@/lib/errores'
import { edadEnAnios, imc } from '@/lib/salud'

// Diabex es exclusivamente para diabetes tipo 1, así que no se pregunta el
// tipo: preguntarlo sugeriría que la app también sirve para otros, y es una
// respuesta más en un formulario que conviene corto.

const hoyISO = () => new Date().toISOString().slice(0, 10)

/** Fila de la tabla → campos del formulario (todos texto, como los inputs). */
function aFormulario(perfil) {
  return {
    nombre: perfil?.nombre ?? '',
    fecha_nacimiento: perfil?.fecha_nacimiento ?? '',
    peso_kg: perfil?.peso_kg == null ? '' : String(perfil.peso_kg),
    altura_cm: perfil?.altura_cm == null ? '' : String(perfil.altura_cm),
  }
}

/** Campos del formulario → tipos que espera la tabla. */
function aValoresDeTabla(form) {
  const numero = (texto) => {
    const limpio = String(texto).replace(',', '.').trim()
    return limpio === '' ? null : Number(limpio)
  }

  return {
    nombre: form.nombre.trim() || null,
    fecha_nacimiento: form.fecha_nacimiento || null,
    peso_kg: numero(form.peso_kg),
    altura_cm: form.altura_cm.trim() === '' ? null : Math.round(Number(form.altura_cm)),
  }
}

function validar({ peso_kg, altura_cm, fecha_nacimiento }) {
  if (peso_kg !== null && !(peso_kg > 0 && peso_kg < 500)) {
    return 'El peso tiene que estar entre 1 y 500 kg.'
  }
  if (altura_cm !== null && !(altura_cm > 0 && altura_cm < 300)) {
    return 'La altura tiene que estar entre 1 y 300 cm.'
  }
  if (fecha_nacimiento && fecha_nacimiento > hoyISO()) {
    return 'La fecha de nacimiento no puede ser futura.'
  }
  return ''
}

function Esqueleto() {
  return (
    <div className="flex flex-col gap-5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2" aria-hidden="true">
          <span className="block h-3.5 w-28 rounded bg-slate-200" />
          <span className="block h-12 rounded-xl bg-slate-100" />
        </div>
      ))}
      <span role="status" className="sr-only">
        Cargando tu perfil…
      </span>
    </div>
  )
}

/**
 * El formulario monta recién con el perfil ya cargado, así que puede tomarlo
 * como estado inicial. Sin efecto que copie datos de una capa a la otra.
 */
function Formulario({ perfil }) {
  const { user } = useAuth()
  const [form, setForm] = useState(() => aFormulario(perfil))
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  function cambiar(campo, valor) {
    setForm((previo) => ({ ...previo, [campo]: valor }))
    // El aviso de "guardado" deja de ser cierto apenas se toca algo.
    setGuardado(false)
  }

  async function handleSubmit(evento) {
    evento.preventDefault()

    const valores = aValoresDeTabla(form)
    const problema = validar(valores)
    if (problema) {
      setError(problema)
      return
    }

    setError('')
    setGuardando(true)

    try {
      await guardarPerfil(user.id, valores)
      setGuardado(true)
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  const edad = edadEnAnios(form.fecha_nacimiento)
  const indice = imc(form.peso_kg, form.altura_cm)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Alert tipo="error">{error}</Alert>
      {guardado ? <Alert tipo="exito">Listo, guardamos tus datos.</Alert> : null}

      <TextField
        label="¿Cómo querés que te llamemos?"
        name="nombre"
        value={form.nombre}
        onChange={(e) => cambiar('nombre', e.target.value)}
        placeholder="Tu nombre"
        autoComplete="given-name"
        maxLength={60}
      />

      <TextField
        label="Fecha de nacimiento"
        type="date"
        name="fecha_nacimiento"
        value={form.fecha_nacimiento}
        onChange={(e) => cambiar('fecha_nacimiento', e.target.value)}
        max={hoyISO()}
        ayuda={edad === null ? undefined : `${edad} años.`}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Peso (kg)"
          name="peso_kg"
          inputMode="decimal"
          value={form.peso_kg}
          onChange={(e) => cambiar('peso_kg', e.target.value)}
          placeholder="78"
          autoComplete="off"
        />
        <TextField
          label="Altura (cm)"
          name="altura_cm"
          inputMode="numeric"
          value={form.altura_cm}
          onChange={(e) => cambiar('altura_cm', e.target.value)}
          placeholder="176"
          autoComplete="off"
        />
      </div>

      {indice === null ? null : (
        <p className="cifras -mt-2 text-sm text-slate-500">
          Índice de masa corporal: <span className="font-semibold text-slate-700">{indice}</span>
        </p>
      )}

      <Button type="submit" cargando={guardando} className="mt-1">
        {guardando ? 'Guardando…' : 'Guardar mis datos'}
      </Button>

      <p className="text-sm text-slate-500 text-pretty">Sólo vos podés ver y editar estos datos.</p>
    </form>
  )
}

export default function Perfil() {
  const { perfil, cargando, error, reintentar } = usePerfil()
  const navigate = useNavigate()
  const location = useLocation()

  function volver() {
    // location.key es 'default' cuando esta es la primera pantalla del
    // historial: ahí no hay a dónde volver, así que mandamos a la app.
    if (location.key === 'default') navigate('/registro', { replace: true })
    else navigate(-1)
  }

  return (
    <>
      <button
        type="button"
        onClick={volver}
        className="-mx-2 mb-3 flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
      >
        <IconoFlechaIzquierda className="h-4 w-4" />
        Volver
      </button>

      <EncabezadoPantalla
        titulo="Mi perfil"
        bajada="Con estos datos ajustamos las recomendaciones de alimentación y la lectura de tus mediciones."
      />

      {cargando ? <Esqueleto /> : null}

      {!cargando && error ? (
        <div className="flex flex-col gap-4">
          <Alert tipo="error">{error}</Alert>
          <Button variante="secundario" onClick={reintentar}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {!cargando && !error ? <Formulario perfil={perfil} /> : null}
    </>
  )
}
