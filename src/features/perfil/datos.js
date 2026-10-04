import { supabase } from '@/lib/supabase'

const COLUMNAS = 'id, nombre, fecha_nacimiento, peso_kg, altura_cm, actualizado_en'

/** Devuelve el perfil del usuario, o null si todavía no lo completó. */
export async function obtenerPerfil(userId) {
  const { data, error } = await supabase
    .from('perfiles')
    .select(COLUMNAS)
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Crea o actualiza el perfil. Un upsert y no un insert + update porque la fila
 * se identifica por el id del usuario: o existe o no, nunca hay duplicados.
 */
export async function guardarPerfil(userId, valores) {
  const { data, error } = await supabase
    .from('perfiles')
    .upsert({ id: userId, ...valores }, { onConflict: 'id' })
    .select(COLUMNAS)
    .single()

  if (error) throw error
  return data
}
