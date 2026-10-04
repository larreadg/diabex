import { ETIQUETAS, NIVELES } from '@/lib/glucosa'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export function horaDe(medicion) {
  return HORA.format(new Date(medicion.medido_en))
}

/**
 * Una medición guardada, con la forma que espera <RielDelDia>.
 * La comparten la pantalla de hoy y la del historial, para que un control se
 * lea igual en los dos lados.
 */
export function aFilaDelRiel(medicion) {
  const contexto = [
    ETIQUETAS.momento[medicion.momento],
    medicion.relacion_comida ? ETIQUETAS.relacion_comida[medicion.relacion_comida] : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    clave: medicion.id,
    hora: horaDe(medicion),
    titulo: contexto,
    // El nivel se dice con palabras y no sólo con el color del nodo.
    detalle: `${NIVELES[medicion.nivel]?.etiqueta ?? ''} · ${ETIQUETAS.actividad[medicion.actividad]}`,
    valor: `${medicion.glucosa_mg_dl} mg/dL`,
    nivel: medicion.nivel,
  }
}

/** Agrupa mediciones por día local. Devuelve un Map de "AAAA-MM-DD" → mediciones. */
export function agruparPorDia(mediciones, claveLocal) {
  const porDia = new Map()

  for (const medicion of mediciones) {
    const clave = claveLocal(new Date(medicion.medido_en))
    const delDia = porDia.get(clave)
    if (delDia) delDia.push(medicion)
    else porDia.set(clave, [medicion])
  }

  return porDia
}
