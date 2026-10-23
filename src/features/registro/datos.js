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

// PostgREST corta cada respuesta en 1000 filas por defecto. Un año de
// controles puede pasarse de eso, y un informe que se queda sin los últimos
// meses sin avisar es peor que uno que tarda un poco más.
const FILAS_POR_PAGINA = 1000

/**
 * Mediciones entre dos días locales, ambos incluidos, de la más temprana a la
 * más reciente. `desde` y `hasta` son medianoches locales (`desdeClave()`): los
 * límites se arman acá en hora local y recién después se pasan a instantes.
 */
export async function obtenerMedicionesEntre(userId, desde, hasta) {
  const inicio = new Date(desde)
  inicio.setHours(0, 0, 0, 0)
  const fin = new Date(hasta)
  fin.setHours(23, 59, 59, 999)

  const todas = []
  for (let pagina = 0; ; pagina += 1) {
    const { data, error } = await supabase
      .from('mediciones')
      .select(COLUMNAS)
      .eq('usuario_id', userId)
      .gte('medido_en', inicio.toISOString())
      .lte('medido_en', fin.toISOString())
      // El id desempata dos controles del mismo instante: sin un orden total,
      // una fila podría repetirse o perderse entre una página y la siguiente.
      .order('medido_en', { ascending: true })
      .order('id', { ascending: true })
      .range(pagina * FILAS_POR_PAGINA, (pagina + 1) * FILAS_POR_PAGINA - 1)

    if (error) throw error
    todas.push(...(data ?? []))
    if (!data || data.length < FILAS_POR_PAGINA) return todas
  }
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
