import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import Button from '@/components/Button'
import GrupoOpciones from '@/components/GrupoOpciones'
import TextField from '@/components/TextField'
import { IconoFlechaIzquierda } from '@/components/iconos'
import { useAuth } from '@/context/AuthContext'
import { guardarMedicion } from '@/features/registro/datos'
import { NOTA_LEGAL, recomendarPara } from '@/features/registro/recomendaciones'
import { mensajeDeError } from '@/lib/errores'
import { LIMITES, NIVELES, clasificar, objetivoPara } from '@/lib/glucosa'

const ACTIVIDAD = [
  { valor: 'ninguna', etiqueta: 'Ninguna', detalle: 'Estuviste en reposo o haciendo cosas de escritorio.' },
  { valor: 'leve', etiqueta: 'Leve', detalle: 'Caminata o estiramientos cortos.' },
  { valor: 'moderada', etiqueta: 'Moderada', detalle: 'Trote, bici o limpieza a ritmo tranquilo.' },
  { valor: 'alta', etiqueta: 'Alta', detalle: 'Baile intenso, correr o algún deporte.' },
]

const MOMENTO = [
  { valor: 'ayuno', etiqueta: 'En ayunas', detalle: 'Recién te levantás y todavía no comiste nada.' },
  { valor: 'desayuno', etiqueta: 'Desayuno', detalle: '1ra comida del día.' },
  { valor: 'media_manana', etiqueta: 'Media mañana', detalle: '2da comida.' },
  { valor: 'almuerzo', etiqueta: 'Almuerzo', detalle: '3ra comida.' },
  { valor: 'merienda', etiqueta: 'Merienda', detalle: '4ta comida.' },
  { valor: 'cena', etiqueta: 'Cena', detalle: '5ta comida.' },
]

const RELACION = [
  { valor: 'antes', etiqueta: 'Antes de comer', detalle: 'Todavía no empezaste.' },
  { valor: 'despues_1_2h', etiqueta: '1 a 2 horas después', detalle: 'Es cuando la glucosa llega a su pico.' },
  { valor: 'despues_3h', etiqueta: 'Más de 3 horas después', detalle: 'La comida ya casi no influye.' },
]

const VACIO = { actividad: '', momento: '', relacion_comida: '', calorias: '' }

/**
 * Los pasos dependen de las respuestas: en ayunas no hay comida de referencia,
 * así que no se pregunta ni la relación ni las calorías.
 *
 * Mientras no se eligió el momento se asume el camino largo, así el contador no
 * arranca prometiendo menos pasos de los que probablemente haya.
 */
function pasosPara(momento) {
  if (momento === 'ayuno') return ['actividad', 'momento', 'glucosa']
  return ['actividad', 'momento', 'relacion', 'calorias', 'glucosa']
}

function Progreso({ indice, total }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= indice ? 'bg-marca-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500">
        Paso {indice + 1} de {total}
      </p>
    </div>
  )
}

function Resultado({ valor, nivel, recomendacion, relacionComida, estadoGuardado, onReintentar }) {
  const estilo = NIVELES[nivel]
  const objetivo = objetivoPara(relacionComida)

  return (
    <div className="pantalla flex flex-col gap-6">
      <section
        className={`rounded-2xl border p-5 ${estilo.borde} ${estilo.fondo}`}
        aria-labelledby="titulo-resultado"
      >
        <p className={`text-sm font-bold ${estilo.texto}`}>{estilo.etiqueta}</p>
        <p className="cifras mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">{valor}</span>
          <span className="text-base font-medium text-slate-600">mg/dL</span>
        </p>
        <p className="cifras mt-2 text-sm text-slate-600">
          Tu objetivo para este momento: {objetivo.min} a {objetivo.max} mg/dL.
        </p>
      </section>

      <section aria-labelledby="titulo-recomendacion">
        <h2
          id="titulo-recomendacion"
          className="text-xl font-extrabold tracking-tight text-slate-900 text-balance"
        >
          {recomendacion.titulo}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {recomendacion.acciones.map((accion) => (
            <li key={accion} className="flex gap-3 text-slate-700 text-pretty">
              <span
                aria-hidden="true"
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${estilo.punto}`}
              />
              {accion}
            </li>
          ))}
        </ul>
      </section>

      <p className="border-t border-slate-200 pt-4 text-sm text-slate-500 text-pretty">
        {NOTA_LEGAL}
      </p>

      <div className="flex flex-col gap-3">
        {estadoGuardado === 'error' ? (
          <div className="flex flex-col gap-3">
            <Alert tipo="error">No pudimos guardar esta medición.</Alert>
            <Button variante="secundario" onClick={onReintentar}>
              Reintentar
            </Button>
          </div>
        ) : null}

        <Link
          to="/registro"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-marca-800 px-4 text-base font-bold text-white transition-colors hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-800"
        >
          Listo
        </Link>

        <p role="status" className="text-center text-sm text-slate-500">
          {estadoGuardado === 'guardando' ? 'Guardando tu medición…' : null}
          {estadoGuardado === 'guardado' ? 'Medición guardada.' : null}
        </p>
      </div>
    </div>
  )
}

export default function NuevaMedicion() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [respuestas, setRespuestas] = useState(VACIO)
  const [indice, setIndice] = useState(0)
  const [glucosa, setGlucosa] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)
  const [estadoGuardado, setEstadoGuardado] = useState('inactivo')

  const contenedor = useRef(null)
  const pasos = pasosPara(respuestas.momento)
  const pasoActual = pasos[Math.min(indice, pasos.length - 1)]

  // Al cambiar de paso, el foco va al contenido nuevo: sin esto, quien usa
  // teclado o lector de pantalla se queda parado en el paso anterior.
  // preventScroll porque enfocar arrastra el scroll y deja la pregunta y el
  // progreso fuera de la pantalla; el salto al tope lo damos nosotros.
  useEffect(() => {
    contenedor.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [indice, resultado])

  function elegir(campo, valor) {
    setError('')
    setRespuestas((previo) => {
      const siguiente = { ...previo, [campo]: valor }
      // En ayunas no aplican, y la base rechaza la fila si vienen cargados.
      if (campo === 'momento' && valor === 'ayuno') {
        siguiente.relacion_comida = ''
        siguiente.calorias = ''
      }
      return siguiente
    })
    // Un respiro para que se vea qué se eligió antes de pasar al siguiente.
    setTimeout(() => setIndice((i) => i + 1), 180)
  }

  function atras() {
    setError('')
    if (indice === 0) navigate('/registro')
    else setIndice((i) => i - 1)
  }

  async function guardar(medicion, titulo) {
    setEstadoGuardado('guardando')
    try {
      await guardarMedicion(user.id, { ...medicion, recomendacion_titulo: titulo })
      setEstadoGuardado('guardado')
    } catch (err) {
      console.error('No se pudo guardar la medición:', mensajeDeError(err))
      setEstadoGuardado('error')
    }
  }

  function verResultado(evento) {
    evento.preventDefault()

    const valor = Number(glucosa.trim())
    if (!Number.isInteger(valor) || valor < LIMITES.minimoCargable || valor > LIMITES.maximoCargable) {
      setError(
        `Escribí el número entero que te dio el glucómetro, entre ${LIMITES.minimoCargable} y ${LIMITES.maximoCargable} mg/dL.`,
      )
      return
    }

    const relacionComida = respuestas.momento === 'ayuno' ? null : respuestas.relacion_comida
    const nivel = clasificar(valor, relacionComida)

    const medicion = {
      glucosa_mg_dl: valor,
      actividad: respuestas.actividad,
      momento: respuestas.momento,
      relacion_comida: relacionComida,
      calorias: respuestas.calorias.trim() === '' ? null : Math.round(Number(respuestas.calorias)),
      nivel,
    }

    const recomendacion = recomendarPara(medicion)

    // El resultado se muestra enseguida y el guardado va por detrás: si hay un
    // problema de red, la persona igual ve su valor y qué hacer.
    setResultado({ medicion, recomendacion })
    guardar(medicion, recomendacion.titulo)
  }

  if (resultado) {
    return (
      <Resultado
        valor={resultado.medicion.glucosa_mg_dl}
        nivel={resultado.medicion.nivel}
        recomendacion={resultado.recomendacion}
        relacionComida={resultado.medicion.relacion_comida}
        estadoGuardado={estadoGuardado}
        onReintentar={() => guardar(resultado.medicion, resultado.recomendacion.titulo)}
      />
    )
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={atras}
          className="-mx-2 flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
        >
          <IconoFlechaIzquierda className="h-4 w-4" />
          {indice === 0 ? 'Cancelar' : 'Atrás'}
        </button>
      </div>

      <Progreso indice={Math.min(indice, pasos.length - 1)} total={pasos.length} />

      <div ref={contenedor} tabIndex={-1} key={pasoActual} className="pantalla focus:outline-none">
        {pasoActual === 'actividad' ? (
          <GrupoOpciones
            orientacion="columna"
            etiqueta="¿Hiciste actividad física en las últimas 2 horas?"
            ayuda="El ejercicio sigue moviendo tu glucosa varias horas después de terminarlo."
            nombre="actividad"
            opciones={ACTIVIDAD}
            valor={respuestas.actividad}
            onChange={(valor) => elegir('actividad', valor)}
          />
        ) : null}

        {pasoActual === 'momento' ? (
          <GrupoOpciones
            orientacion="columna"
            etiqueta="¿Con qué comida se relaciona este control?"
            nombre="momento"
            opciones={MOMENTO}
            valor={respuestas.momento}
            onChange={(valor) => elegir('momento', valor)}
          />
        ) : null}

        {pasoActual === 'relacion' ? (
          <GrupoOpciones
            orientacion="columna"
            etiqueta="¿Estás midiendo antes o después de esa comida?"
            ayuda="Es el dato que define tu objetivo: después de comer se acepta un valor más alto."
            nombre="relacion_comida"
            opciones={RELACION}
            valor={respuestas.relacion_comida}
            onChange={(valor) => elegir('relacion_comida', valor)}
          />
        ) : null}

        {pasoActual === 'calorias' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setIndice((i) => i + 1)
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 text-balance">
                ¿Cuántas calorías tenía tu última comida, más o menos?
              </h1>
              <p className="mt-1 text-slate-600 text-pretty">
                Una estimación alcanza. Si no tenés idea, podés saltearlo.
              </p>
            </div>

            <TextField
              label="Calorías aproximadas"
              name="calorias"
              inputMode="numeric"
              value={respuestas.calorias}
              onChange={(e) => setRespuestas((p) => ({ ...p, calorias: e.target.value }))}
              placeholder="600"
              autoComplete="off"
              ayuda="kcal"
            />

            <Button type="submit">Continuar</Button>

            <button
              type="button"
              onClick={() => {
                setRespuestas((p) => ({ ...p, calorias: '' }))
                setIndice((i) => i + 1)
              }}
              className="min-h-11 text-sm font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
            >
              Prefiero no estimarlo
            </button>
          </form>
        ) : null}

        {pasoActual === 'glucosa' ? (
          <form onSubmit={verResultado} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 text-balance">
                Hacé el control con tu glucómetro
              </h1>
              <p className="mt-1 text-slate-600 text-pretty">
                Cuando tengas el resultado, escribilo acá tal como aparece en la pantalla.
              </p>
            </div>

            <Alert tipo="error">{error}</Alert>

            <TextField
              label="Tu nivel de glucosa"
              name="glucosa"
              inputMode="numeric"
              value={glucosa}
              onChange={(e) => {
                setGlucosa(e.target.value)
                setError('')
              }}
              placeholder="120"
              autoComplete="off"
              autoFocus
              ayuda="En mg/dL, el número exacto."
            />

            <Button type="submit">Ver mi resultado</Button>
          </form>
        ) : null}
      </div>
    </>
  )
}
