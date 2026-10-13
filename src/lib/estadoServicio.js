import { claveLocal, desdeClave, diasEntre, fechaLarga } from '@/lib/fechas'

/*
 * El estado se lee de un JSON en tiempo de ejecución y no de una variable de
 * entorno: lo que entra en el build queda precargado por el service worker, y
 * en la app instalada el cambio no llegaría hasta que la persona acepte la
 * actualización. Este archivo no está en la precarga ni en `runtimeCaching`,
 * así que sale siempre de la red.
 */
const RUTA = '/estado-servicio.json'
const CLAVE_DE_DIA = /^\d{4}-\d{2}-\d{2}$/
const NORMAL = { fase: 'normal' }

/**
 * Sin conexión, sin archivo o con un JSON roto devuelve `null`, y eso es
 * "servicio normal". Netlify responde index.html a cualquier ruta que no
 * exista, así que borrar el archivo también apaga el aviso.
 */
export async function leerEstadoServicio() {
  try {
    const respuesta = await fetch(RUTA, { cache: 'no-store' })
    if (!respuesta.ok) return null
    return await respuesta.json()
  } catch {
    return null
  }
}

/**
 * Fase del servicio para hoy, función pura.
 *
 * Entre `desde` y `fechaLimite` (inclusive) es `aviso`, y la opacidad baja un
 * escalón por día hasta llegar a `opacidadMinima` el último. Al día siguiente
 * de la fecha límite es `restringido`, con la opacidad mínima.
 */
export function calcularEstado(config, ahora = new Date()) {
  if (!config?.activo) return NORMAL
  if (!CLAVE_DE_DIA.test(config.desde ?? '') || !CLAVE_DE_DIA.test(config.fechaLimite ?? '')) {
    return NORMAL
  }

  const hoy = desdeClave(claveLocal(ahora))
  const desde = desdeClave(config.desde)
  const limite = desdeClave(config.fechaLimite)
  if (hoy < desde) return NORMAL

  const reemplazarFecha = (texto = '') => texto.replaceAll('{fecha}', fechaLarga(limite))

  // Por debajo de 0.5 el texto secundario deja de ser legible, y en esta app
  // ese texto puede ser un valor de glucosa.
  const minima = Math.min(1, Math.max(0.5, Number(config.opacidadMinima) || 0.7))

  if (hoy > limite) {
    return {
      fase: 'restringido',
      opacidad: minima,
      titulo: config.restriccion?.titulo ?? '',
      texto: reemplazarFecha(config.restriccion?.texto),
    }
  }

  const totalDias = diasEntre(desde, limite) + 1
  const diaActual = diasEntre(desde, hoy) + 1

  return {
    fase: 'aviso',
    opacidad: 1 - ((1 - minima) * diaActual) / totalDias,
    titulo: config.aviso?.titulo ?? '',
    texto: reemplazarFecha(config.aviso?.texto),
  }
}
