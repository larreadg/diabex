import { LIMITES } from '@/lib/glucosa'

/**
 * Las franjas de la barra de distribución, en el orden en que se leen: de
 * más bajo a más alto. Las dos hipoglucemias van juntas porque en el informe
 * importa cuántas hubo, y el detalle de cada una está en la tabla.
 *
 * `tono` no es un color sino el papel que cumple: lo traduce el PDF. Así la
 * regla de "dos colores de alerta y el azul como normal" vive en un solo lado.
 */
export const FRANJAS = [
  {
    clave: 'hipoglucemia',
    niveles: ['hipoglucemia_grave', 'hipoglucemia'],
    etiqueta: 'Hipoglucemia',
    detalle: `menos de ${LIMITES.hipoglucemia}`,
    tono: 'urgente',
  },
  {
    clave: 'bajo',
    niveles: ['bajo'],
    etiqueta: 'Debajo del objetivo',
    detalle: null,
    tono: 'fuera',
  },
  {
    clave: 'en_rango',
    niveles: ['en_rango'],
    etiqueta: 'En tu objetivo',
    detalle: null,
    tono: 'normal',
  },
  {
    clave: 'alto',
    niveles: ['alto'],
    etiqueta: 'Encima del objetivo',
    detalle: null,
    tono: 'fuera',
  },
  {
    clave: 'muy_alto',
    niveles: ['muy_alto'],
    etiqueta: 'Muy alto',
    detalle: `más de ${LIMITES.muyAlto}`,
    tono: 'urgente',
  },
]

/** Qué papel cumple un nivel guardado en el informe. */
export function tonoDe(nivel) {
  return FRANJAS.find((franja) => franja.niveles.includes(nivel))?.tono ?? 'normal'
}

/**
 * Números del período. Se calculan sobre el `nivel` que quedó guardado con
 * cada control, no reclasificando: el informe tiene que contar lo mismo que
 * la persona vio en la app en su momento.
 */
export function resumir(mediciones) {
  const valores = mediciones.map((m) => m.glucosa_mg_dl)
  const cantidad = valores.length

  const franjas = FRANJAS.map((franja) => {
    const n = mediciones.filter((m) => franja.niveles.includes(m.nivel)).length
    return { ...franja, cantidad: n, proporcion: cantidad ? n / cantidad : 0 }
  })

  return {
    cantidad,
    promedio: cantidad ? Math.round(valores.reduce((a, b) => a + b, 0) / cantidad) : null,
    minimo: cantidad ? Math.min(...valores) : null,
    maximo: cantidad ? Math.max(...valores) : null,
    enObjetivo: franjas.find((f) => f.clave === 'en_rango').proporcion,
    hipoglucemias: franjas.find((f) => f.clave === 'hipoglucemia').cantidad,
    franjas,
  }
}

/**
 * Porcentajes enteros que suman 100. Redondear cada uno por su lado puede dar
 * 99 o 101, y en una barra que dice "esto es todo" eso se nota.
 */
export function porcentajesEnteros(proporciones) {
  const crudos = proporciones.map((p) => p * 100)
  const enteros = crudos.map(Math.floor)
  const total = proporciones.some((p) => p > 0) ? 100 : 0
  let faltan = total - enteros.reduce((a, b) => a + b, 0)

  const porResto = crudos
    .map((valor, i) => ({ i, resto: valor - Math.floor(valor) }))
    .sort((a, b) => b.resto - a.resto)

  for (const { i } of porResto) {
    if (faltan <= 0) break
    enteros[i] += 1
    faltan -= 1
  }
  return enteros
}
