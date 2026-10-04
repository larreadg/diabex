/** Cálculos derivados del perfil. Nada de esto se guarda: se recalcula siempre. */

/** Edad en años cumplidos, o null si la fecha no sirve. */
export function edadEnAnios(fechaISO) {
  if (!fechaISO) return null

  const nacimiento = new Date(`${fechaISO}T00:00:00`)
  if (Number.isNaN(nacimiento.getTime())) return null

  const hoy = new Date()
  let anios = hoy.getFullYear() - nacimiento.getFullYear()

  // Si todavía no llegó el cumpleaños de este año, resta uno.
  const yaCumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate())
  if (!yaCumplio) anios -= 1

  return anios >= 0 && anios < 130 ? anios : null
}

/** IMC con un decimal, o null si falta o no cierra alguno de los dos datos. */
export function imc(pesoKg, alturaCm) {
  const peso = Number(String(pesoKg).replace(',', '.'))
  const altura = Number(alturaCm)

  if (!(peso > 0) || !(altura > 0)) return null

  const metros = altura / 100
  const valor = peso / (metros * metros)

  return valor > 5 && valor < 100 ? valor.toFixed(1) : null
}

/**
 * ¿Alcanza el perfil para armar recomendaciones de alimentación?
 * Sin peso y altura no hay nada serio que sugerir. El tipo de diabetes no se
 * pregunta: Diabex es exclusivamente para tipo 1.
 */
export function perfilCompleto(perfil) {
  return Boolean(perfil?.peso_kg && perfil?.altura_cm)
}
