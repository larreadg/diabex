const FORMATO_LARGO = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const FORMATO_DIA = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' })
const FORMATO_MES = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })

/** "lunes, 15 de septiembre" — la pantalla lo capitaliza con CSS. */
export function fechaDeHoy(fecha = new Date()) {
  return FORMATO_LARGO.format(fecha)
}

export function fechaLarga(fecha) {
  return FORMATO_LARGO.format(fecha)
}

export function diaYMes(fecha) {
  return FORMATO_DIA.format(fecha)
}

/** "septiembre de 2026" */
export function nombreDeMes(anio, mes) {
  return FORMATO_MES.format(new Date(anio, mes, 1))
}

/**
 * Clave "AAAA-MM-DD" según el reloj del dispositivo.
 *
 * OJO: no usar toISOString() para esto. Convierte a UTC, y en UTC-3 una
 * medición de las 21:00 cae al día siguiente. Las mediciones se agrupan por el
 * día que vivió la persona, no por el día UTC.
 */
export function claveLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

/** Cuántos días tiene el mes y en qué columna arranca, con la semana de lunes a domingo. */
export function estructuraDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  return {
    cantidadDeDias: new Date(anio, mes + 1, 0).getDate(),
    // getDay() da 0 para domingo; acá la semana empieza el lunes.
    desplazamiento: (primero.getDay() + 6) % 7,
  }
}

/** Primer y último instante del mes, en hora local, listos para consultar. */
export function limitesDelMes(anio, mes) {
  return {
    desde: new Date(anio, mes, 1, 0, 0, 0, 0),
    hasta: new Date(anio, mes + 1, 0, 23, 59, 59, 999),
  }
}
