// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { withSupabase } from 'jsr:@supabase/server@^1'
import { createClient } from 'jsr:@supabase/supabase-js@^2'

/**
 * daily-nutrition-plan — el plan de comidas del día.
 *
 * Toma el perfil del usuario autenticado (peso, altura, edad) y sus mediciones
 * de glucosa de HOY, y le pide al modelo un plan por momento del día.
 *
 * Se invoca una vez por día: el plan queda guardado en `planes_alimentacion` y
 * las visitas siguientes leen esa fila en vez de volver a pagar una generación.
 *
 * Dos límites que no se cruzan, los mismos de `recomendaciones.js`:
 *
 * 1. Diabex NUNCA sugiere una dosis de insulina. Es indicación médica y
 *    equivocarse tiene consecuencias graves. Va en el prompt y además se
 *    verifica sobre la respuesta, porque un modelo puede desobedecer.
 * 2. Diabex no diagnostica. Sugiere qué comer; la conclusión clínica es del
 *    equipo de salud.
 */

/** Lo que manda el cliente. Todo opcional: hay valores por defecto razonables. */
interface ReqPayload {
  /** "AAAA-MM-DD" del día que vive la persona (`claveLocal()` en el frontend). */
  dia?: string
  /** `new Date().getTimezoneOffset()`: minutos a sumarle a la hora local para llegar a UTC. */
  desfaseMinutos?: number
}

/**
 * Un modelo chico alcanza de sobra: esto es redacción con datos acotados, no
 * razonamiento. `gpt-4o-mini` no gasta tokens de razonamiento, así que el costo
 * por plan es predecible y bajo. Si querés algo todavía más barato, `gpt-5-nano`
 * con `reasoning: { effort: "minimal" }` también sirve; se cambia con la
 * variable OPENAI_MODEL, sin tocar este archivo.
 */
const MODELO_POR_DEFECTO = 'gpt-4o-mini'

/** Tope de salida: un plan de cinco comidas entra holgado. Acota el costo. */
const MAXIMO_TOKENS_SALIDA = 1200

/** UTC-3, la zona de la región. Sólo se usa si el cliente no manda la suya. */
const DESFASE_POR_DEFECTO = 180

const MOMENTOS = ['desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena'] as const

/** Las etiquetas de `lib/glucosa.js`, repetidas acá porque la función no ve `src/`. */
const ETIQUETAS: Record<string, Record<string, string>> = {
  actividad: {
    ninguna: 'sin actividad',
    leve: 'actividad leve',
    moderada: 'actividad moderada',
    alta: 'actividad alta',
  },
  momento: {
    ayuno: 'en ayunas',
    desayuno: 'desayuno',
    media_manana: 'media mañana',
    almuerzo: 'almuerzo',
    merienda: 'merienda',
    cena: 'cena',
  },
  relacion_comida: {
    antes: 'antes de comer',
    despues_1_2h: '1 a 2 h después de comer',
    despues_3h: 'más de 3 h después de comer',
  },
  nivel: {
    hipoglucemia_grave: 'hipoglucemia grave',
    hipoglucemia: 'hipoglucemia',
    bajo: 'por debajo del objetivo',
    en_rango: 'en objetivo',
    alto: 'por encima del objetivo',
    muy_alto: 'muy alto',
  },
}

/**
 * El esquema del plan. Con `strict: true` el modelo no puede devolver otra
 * forma, así que la pantalla no tiene que defenderse de un JSON inventado.
 * `hora`, `titulo` y `detalle` son justo lo que consume `RielDelDia`.
 */
const ESQUEMA_PLAN = {
  type: 'object',
  additionalProperties: false,
  required: ['resumen', 'comidas', 'notas'],
  properties: {
    resumen: {
      type: 'string',
      description: 'Una o dos oraciones sobre cómo viene el día y qué prioriza el plan.',
    },
    comidas: {
      type: 'array',
      description: 'Los cinco momentos del día, en orden.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['momento', 'hora', 'titulo', 'detalle', 'opciones'],
        properties: {
          momento: { type: 'string', enum: MOMENTOS },
          hora: { type: 'string', description: 'Hora sugerida, formato de 24 h: 08:00.' },
          titulo: { type: 'string', description: 'Qué comer, en pocas palabras.' },
          detalle: { type: 'string', description: 'Una oración con la porción o el porqué.' },
          opciones: {
            type: 'array',
            description: 'Dos o tres alternativas equivalentes, con alimentos de la región.',
            items: { type: 'string' },
          },
        },
      },
    },
    notas: {
      type: 'array',
      description: 'Hasta tres avisos generales del día: hidratación, actividad, horarios.',
      items: { type: 'string' },
    },
  },
} as const

const INSTRUCCIONES = `Sos el asistente de alimentación de Diabex, una app de seguimiento diario para personas con diabetes tipo 1.

Armás el plan de comidas de HOY a partir del perfil de la persona y de sus mediciones de glucosa del día.

Reglas que no se negocian:
- NUNCA sugieras una dosis de insulina, ni una cantidad de unidades, ni un ajuste de basal o de bomba. Es indicación médica. Si el contexto parece pedirlo, decí que eso lo define su equipo de salud.
- No diagnostiques ni interpretes clínicamente. Sugerís qué comer, no qué le pasa.
- No recomiendes suplementos, medicación ni ayunos.
- Esto es diabetes tipo 1: nada de "revertir la diabetes", nada de bajar de peso como objetivo, nada de tipo 2.

Cómo escribís:
- Español rioplatense, de vos: "anotá", "tenés", "sumá", "elegí".
- Alimentos comunes y accesibles de la región.
- Directo y corto. Sin emojis, sin markdown, sin signos de exclamación.
- Hablás de porciones concretas y de carbohidratos en gramos, que es lo que la persona cuenta todos los días.
- Si hubo hipoglucemia hoy, el plan la tiene en cuenta. Si hubo valores muy altos, priorizás comidas de bajo índice glucémico y lo decís sin dramatizar.
- Si todavía no hay mediciones del día, armás un plan base equilibrado y no inventás datos que no tenés.

Devolvés siempre los cinco momentos, en orden: desayuno, media mañana, almuerzo, merienda y cena.`

const CABECERAS_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function responder(cuerpo: unknown, status = 200) {
  return Response.json(cuerpo, { status, headers: CABECERAS_CORS })
}

/**
 * Los límites del día local, como instantes UTC.
 *
 * Mismo cuidado que en `lib/fechas.js`: si se tomara el día UTC, un control de
 * las 21:00 caería en el día siguiente y el plan de mañana arrancaría leyendo
 * lo de anoche.
 */
function limitesDelDia(dia: string, desfaseMinutos: number) {
  const inicio = Date.parse(`${dia}T00:00:00.000Z`) + desfaseMinutos * 60_000
  return {
    desde: new Date(inicio).toISOString(),
    hasta: new Date(inicio + 24 * 60 * 60_000).toISOString(),
  }
}

/** "AAAA-MM-DD" del día en curso para ese desfase. */
function diaLocal(desfaseMinutos: number) {
  return new Date(Date.now() - desfaseMinutos * 60_000).toISOString().slice(0, 10)
}

/** La hora "HH:MM" con la que la persona vivió esa medición. */
function horaLocal(medidoEn: string, desfaseMinutos: number) {
  return new Date(Date.parse(medidoEn) - desfaseMinutos * 60_000).toISOString().slice(11, 16)
}

/** Edad en años cumplidos, o null. La misma cuenta que `lib/salud.js`. */
function edadEnAnios(fechaISO: string | null, hoy: Date) {
  if (!fechaISO) return null

  const nacimiento = new Date(`${fechaISO}T00:00:00Z`)
  if (Number.isNaN(nacimiento.getTime())) return null

  let anios = hoy.getUTCFullYear() - nacimiento.getUTCFullYear()
  const yaCumplio =
    hoy.getUTCMonth() > nacimiento.getUTCMonth() ||
    (hoy.getUTCMonth() === nacimiento.getUTCMonth() && hoy.getUTCDate() >= nacimiento.getUTCDate())
  if (!yaCumplio) anios -= 1

  return anios >= 0 && anios < 130 ? anios : null
}

function imc(pesoKg: number, alturaCm: number) {
  const metros = alturaCm / 100
  const valor = pesoKg / (metros * metros)
  return valor > 5 && valor < 100 ? valor.toFixed(1) : null
}

/** El contexto que ve el modelo. Texto plano: es más barato y se lee en los logs. */
function armarPrompt(
  perfil: { peso_kg: number; altura_cm: number; fecha_nacimiento: string | null },
  mediciones: Record<string, unknown>[],
  dia: string,
  desfaseMinutos: number,
) {
  const edad = edadEnAnios(perfil.fecha_nacimiento, new Date())
  const indice = imc(Number(perfil.peso_kg), Number(perfil.altura_cm))

  const datos = [
    `Peso: ${perfil.peso_kg} kg`,
    `Altura: ${perfil.altura_cm} cm`,
    edad !== null ? `Edad: ${edad} años` : null,
    indice ? `IMC: ${indice}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const filas = mediciones.map((m) => {
    const partes = [
      horaLocal(String(m.medido_en), desfaseMinutos),
      `${m.glucosa_mg_dl} mg/dL`,
      ETIQUETAS.nivel[String(m.nivel)] ?? String(m.nivel),
      ETIQUETAS.momento[String(m.momento)] ?? String(m.momento),
      m.relacion_comida ? ETIQUETAS.relacion_comida[String(m.relacion_comida)] : null,
      ETIQUETAS.actividad[String(m.actividad)] ?? String(m.actividad),
      m.calorias ? `${m.calorias} kcal` : null,
    ].filter(Boolean)

    return `- ${partes.join(' · ')}`
  })

  const controles = filas.length ? filas.join('\n') : 'Todavía no cargó ninguna medición hoy.'

  return `Fecha de hoy: ${dia}

Perfil:
${datos}

Controles de glucosa de hoy (el objetivo es 80-130 mg/dL antes de comer o en ayunas, y 70-180 mg/dL entre 1 y 2 h después):
${controles}

Armá el plan de comidas de hoy para esta persona.`
}

/**
 * El último cortafuego contra el límite que más importa.
 *
 * El prompt ya lo prohíbe, pero un modelo puede desobedecer y acá una
 * desobediencia es una dosis mal sugerida. Si el plan habla de insulina en
 * cantidades, no se muestra: mejor un error que una indicación inventada.
 */
function sugiereDosis(plan: unknown) {
  const texto = JSON.stringify(plan).toLowerCase()

  const hablaDeInsulina =
    texto.includes('insulina') || texto.includes('basal') || texto.includes('bolo')
  if (!hablaDeInsulina) return false

  return /\d+(?:[.,]\d+)?\s*(?:unidades?\b|u\.?i\.?\b|ui\b)/.test(texto)
}

/** El texto que devolvió la API de respuestas, sin importar la forma exacta. */
function textoDeLaRespuesta(data: any): string {
  if (typeof data.output_text === 'string' && data.output_text) return data.output_text

  return (
    data.output
      ?.flatMap((item: any) => item.content ?? [])
      ?.filter((item: any) => item.type === 'output_text')
      ?.map((item: any) => item.text)
      ?.join('\n') ?? ''
  )
}

console.info('daily-nutrition-plan lista')

export default {
  fetch: withSupabase({ auth: ['publishable', 'secret'] }, async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CABECERAS_CORS })
    }

    try {
      // 1. Quién pide. El cliente se arma con el token del usuario, así que
      //    todas las consultas de abajo pasan por RLS: desde acá no hay forma
      //    de leer el perfil ni las mediciones de otra persona.
      const autorizacion = req.headers.get('Authorization') ?? ''
      if (!autorizacion) {
        return responder({ error: 'Falta el token de sesión', codigo: 'sin_sesion' }, 401)
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: autorizacion } } },
      )

      const { data: sesion, error: errorSesion } = await supabase.auth.getUser()
      if (errorSesion || !sesion?.user) {
        return responder({ error: 'Sesión inválida', codigo: 'sin_sesion' }, 401)
      }
      const usuarioId = sesion.user.id

      // 2. De qué día hablamos. Lo decide el reloj del dispositivo, no el del
      //    servidor: la función corre en UTC.
      const cuerpo: ReqPayload = await req.json().catch(() => ({}))

      const desfaseMinutos = Number.isFinite(cuerpo.desfaseMinutos as number)
        ? Math.trunc(cuerpo.desfaseMinutos as number)
        : DESFASE_POR_DEFECTO

      if (Math.abs(desfaseMinutos) > 840) {
        return responder({ error: 'Desfase horario inválido', codigo: 'desfase_invalido' }, 400)
      }

      const dia = /^\d{4}-\d{2}-\d{2}$/.test(cuerpo.dia ?? '')
        ? cuerpo.dia!
        : diaLocal(desfaseMinutos)

      // 3. ¿Ya está hecho el de hoy? Se genera una vez por día: si existe, se
      //    devuelve sin tocar la API paga.
      const { data: guardado, error: errorGuardado } = await supabase
        .from('planes_alimentacion')
        .select('plan, generado_en')
        .eq('usuario_id', usuarioId)
        .eq('dia', dia)
        .maybeSingle()

      if (errorGuardado) throw errorGuardado

      if (guardado) {
        return responder({
          dia,
          cacheado: true,
          plan: guardado.plan,
          generado_en: guardado.generado_en,
        })
      }

      // 4. Sin peso y altura no hay nada serio que sugerir.
      const { data: perfil, error: errorPerfil } = await supabase
        .from('perfiles')
        .select('peso_kg, altura_cm, fecha_nacimiento')
        .eq('id', usuarioId)
        .maybeSingle()

      if (errorPerfil) throw errorPerfil

      if (!perfil?.peso_kg || !perfil?.altura_cm) {
        return responder(
          {
            error: 'Falta completar el peso y la altura en el perfil',
            codigo: 'perfil_incompleto',
          },
          422,
        )
      }

      // 5. Los controles del día que vivió la persona.
      const { desde, hasta } = limitesDelDia(dia, desfaseMinutos)

      const { data: mediciones, error: errorMediciones } = await supabase
        .from('mediciones')
        .select('medido_en, glucosa_mg_dl, actividad, momento, relacion_comida, calorias, nivel')
        .eq('usuario_id', usuarioId)
        .gte('medido_en', desde)
        .lt('medido_en', hasta)
        .order('medido_en', { ascending: true })
        .limit(40)

      if (errorMediciones) throw errorMediciones

      // 6. La consulta al modelo.
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
      if (!openaiApiKey) {
        console.error('OPENAI_API_KEY no encontrada')
        return responder({ error: 'OPENAI_API_KEY no está configurada', codigo: 'sin_clave' }, 500)
      }

      const modelo = Deno.env.get('OPENAI_MODEL') ?? MODELO_POR_DEFECTO

      const respuesta = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelo,
          instructions: INSTRUCCIONES,
          input: armarPrompt(perfil as any, mediciones ?? [], dia, desfaseMinutos),
          max_output_tokens: MAXIMO_TOKENS_SALIDA,
          text: {
            format: {
              type: 'json_schema',
              name: 'plan_alimentacion',
              strict: true,
              schema: ESQUEMA_PLAN,
            },
          },
        }),
      })

      const data = await respuesta.json()

      if (!respuesta.ok) {
        console.error('Error OpenAI:', data)
        return responder(
          {
            error: 'Error al consultar el modelo',
            codigo: 'modelo_no_responde',
            detalle: data?.error?.message ?? null,
          },
          502,
        )
      }

      let plan: unknown
      try {
        plan = JSON.parse(textoDeLaRespuesta(data))
      } catch {
        console.error('Respuesta sin JSON válido:', data)
        return responder({ error: 'El modelo no devolvió un plan legible', codigo: 'plan_ilegible' }, 502)
      }

      if (sugiereDosis(plan)) {
        console.error('Plan descartado: mencionaba dosis de insulina', plan)
        return responder(
          { error: 'El plan generado no cumple las reglas de Diabex', codigo: 'plan_rechazado' },
          502,
        )
      }

      // 7. Guardar. Un insert y no un upsert: la restricción única de la tabla
      //    es lo que hace que sea uno por día de verdad. Si dos pestañas piden
      //    a la vez, la segunda choca (23505) y lee el que ya quedó en vez de
      //    pisarlo.
      const { data: fila, error: errorAlta } = await supabase
        .from('planes_alimentacion')
        .insert({ usuario_id: usuarioId, dia, plan, modelo })
        .select('plan, generado_en')
        .single()

      if (errorAlta?.code === '23505') {
        const { data: existente } = await supabase
          .from('planes_alimentacion')
          .select('plan, generado_en')
          .eq('usuario_id', usuarioId)
          .eq('dia', dia)
          .single()

        return responder({
          dia,
          cacheado: true,
          plan: existente?.plan ?? plan,
          generado_en: existente?.generado_en ?? null,
        })
      }

      if (errorAlta) throw errorAlta

      return responder({
        dia,
        cacheado: false,
        plan: fila.plan,
        generado_en: fila.generado_en,
      })
    } catch (error) {
      console.error('Error interno:', error)
      return responder(
        {
          error: error instanceof Error ? error.message : 'Error interno desconocido',
          codigo: 'error_interno',
        },
        500,
      )
    }
  }),
}
