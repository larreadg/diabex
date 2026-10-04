/** Nombres de los momentos del plan. Sólo se muestran en el detalle. */
export const MOMENTOS = {
  desayuno: 'Desayuno',
  media_manana: 'Media mañana',
  almuerzo: 'Almuerzo',
  merienda: 'Merienda',
  cena: 'Cena',
}

/**
 * Una comida del plan con la forma que espera <RielDelDia>.
 *
 * El título es qué comer y no el nombre del momento: la hora de la izquierda y
 * el orden del riel ya dicen que las 08:00 son el desayuno, y repetirlo gasta
 * la línea que sirve para lo único que la persona vino a leer.
 *
 * Las opciones no entran acá: viven en la hoja que abre la fila.
 */
export function aFilaDelPlan(comida) {
  return {
    clave: comida.momento,
    hora: comida.hora,
    titulo: comida.titulo,
    detalle: comida.detalle,
  }
}

/** "Generado a las 07:12" — para que se vea que el plan es de hoy y no de ayer. */
const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export function horaDeGeneracion(generadoEn) {
  if (!generadoEn) return ''
  const fecha = new Date(generadoEn)
  return Number.isNaN(fecha.getTime()) ? '' : HORA.format(fecha)
}
