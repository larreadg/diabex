import { limitesDelMes } from '@/lib/fechas'
import { supabase } from '@/lib/supabase'

const COLUMNAS =
  'id, medido_en, glucosa_mg_dl, actividad, momento, relacion_comida, calorias, nivel, recomendacion_titulo'

/** Desde las 00:00 de hoy, en hora local del dispositivo. */
function comienzoDeHoy() {
  const inicio = new Date()
  inicio.setHours(0, 0, 0, 0)
  return inicio.toISOString()
}

/** Mediciones de hoy, de la más temprana a la más reciente. */
export async function obtenerMedicionesDeHoy(userId) {
  const { data, error } = await supabase
    .from('mediciones')
    .select(COLUMNAS)
    .eq('usuario_id', userId)
    .gte('medido_en', comienzoDeHoy())
    .order('medido_en', { ascending: true })

  if (error) throw error
  return data ?? []
}

/**
 * Mediciones de un mes completo, de la más temprana a la más reciente.
 * Los límites se arman en hora local y se mandan como instantes: así el mes
 * que se consulta es el mes que ve la persona, no el mes UTC.
 */
export async function obtenerMedicionesDelMes(userId, anio, mes) {
  const { desde, hasta } = limitesDelMes(anio, mes)

  const { data, error } = await supabase
    .from('mediciones')
    .select(COLUMNAS)
    .eq('usuario_id', userId)
    .gte('medido_en', desde.toISOString())
    .lte('medido_en', hasta.toISOString())
    .order('medido_en', { ascending: true })

  if (error) throw error
  return data ?? []
}

/**
 * Guarda una medición. `medido_en` lo pone la base con su propio reloj: el del
 * teléfono puede estar desfasado y acá la hora importa.
 */
export async function guardarMedicion(userId, medicion) {
  const { data, error } = await supabase
    .from('mediciones')
    .insert({ usuario_id: userId, ...medicion })
    .select(COLUMNAS)
    .single()

  if (error) throw error
  return data
}

/**
 * Borra un control cargado por error.
 *
 * El filtro por usuario es redundante con la política de RLS, que ya impide
 * tocar filas ajenas. Va igual: si algún día alguien afloja la política, el
 * cliente no se convierte en el agujero.
 */
export async function borrarMedicion(userId, id) {
  const { error } = await supabase
    .from('mediciones')
    .delete()
    .eq('id', id)
    .eq('usuario_id', userId)

  if (error) throw error
}
