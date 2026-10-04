import { claveLocal } from '@/lib/fechas'
import { supabase } from '@/lib/supabase'

const FUNCION = 'daily-nutrition-plan'

/**
 * Un error de una edge function llega con el cuerpo sin leer, adentro de
 * `error.context`. Si no lo abrimos perdemos el `codigo`, que es lo que nos
 * dice si falta el perfil o si el asistente no respondió.
 *
 * Lo dejamos en `error.code` porque es la propiedad que mira `mensajeDeError`.
 */
async function conElCuerpoAbierto(error) {
  const respuesta = error?.context
  if (!(respuesta instanceof Response)) return error

  try {
    const cuerpo = await respuesta.json()
    const armado = new Error(cuerpo?.error ?? error.message)
    armado.code = cuerpo?.codigo
    armado.estado = respuesta.status
    return armado
  } catch {
    // Cuerpo vacío o ya consumido: el error original sigue sirviendo.
    return error
  }
}

/**
 * Pide el plan de comidas de hoy.
 *
 * El día y el desfase horario los pone el cliente: la función corre en UTC y
 * acá el offset es -3. Sin mandarlos, un pedido de las 21:00 armaría el plan
 * de mañana con los controles de hoy.
 *
 * La función genera el plan una sola vez por día y guarda el resultado, así
 * que llamarla de nuevo no cuesta nada: devuelve el mismo plan con
 * `cacheado: true`.
 *
 * @returns {Promise<{dia: string, cacheado: boolean, plan: object, generado_en: string|null}>}
 */
export async function obtenerPlanDelDia() {
  const ahora = new Date()

  const { data, error } = await supabase.functions.invoke(FUNCION, {
    body: {
      dia: claveLocal(ahora),
      desfaseMinutos: ahora.getTimezoneOffset(),
    },
  })

  if (error) throw await conElCuerpoAbierto(error)
  return data
}
