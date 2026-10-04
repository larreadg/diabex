// Guarda a dónde quería ir el usuario antes de salir hacia Google, para
// devolverlo ahí cuando vuelve al callback.
const CLAVE = 'diabex.destino'

export function guardarDestino(destino) {
  try {
    sessionStorage.setItem(CLAVE, destino)
  } catch {
    // Modo privado o storage bloqueado: no es crítico, se cae a "/".
  }
}

export function tomarDestino() {
  try {
    const destino = sessionStorage.getItem(CLAVE)
    sessionStorage.removeItem(CLAVE)
    // Sólo rutas internas: evita redirigir a un sitio externo.
    if (destino && destino.startsWith('/') && !destino.startsWith('//')) return destino
  } catch {
    // Ignorado a propósito.
  }
  return '/'
}
