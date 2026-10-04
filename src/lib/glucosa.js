/**
 * Clasificación de un valor de glucosa. Todo en mg/dL, que es la unidad que se
 * usa en la región.
 *
 * Diabex es exclusivamente para diabetes tipo 1, así que las bandas son las de
 * tipo 1 y no una versión genérica.
 *
 * Son funciones puras a propósito: la UI no decide nada de esto, y cambiar las
 * reglas no obliga a tocar ninguna pantalla.
 *
 * OJO: estos son los valores de referencia habituales. El rango objetivo se
 * personaliza por paciente, así que el paso siguiente es leerlo del perfil en
 * vez de usar estas constantes.
 */

/** Umbrales que no dependen del momento del día. */
export const LIMITES = {
  /** Por debajo de esto, la hipoglucemia es grave. */
  hipoglucemiaGrave: 54,
  /** Por debajo de esto, hay hipoglucemia. */
  hipoglucemia: 70,
  /** Por encima de esto, el valor es muy alto y conviene revisar cetonas. */
  muyAlto: 250,
  /** Mínimo y máximo que aceptamos como carga válida. */
  minimoCargable: 20,
  maximoCargable: 900,
}

/**
 * El objetivo cambia según cuándo se mide: después de comer es esperable un
 * pico que antes de comer sería alto. Sin este dato no se puede clasificar un
 * valor intermedio.
 */
export function objetivoPara(relacionComida) {
  if (relacionComida === 'despues_1_2h') return { min: 70, max: 180 }
  return { min: 80, max: 130 }
}

/** @returns {'hipoglucemia_grave'|'hipoglucemia'|'bajo'|'en_rango'|'alto'|'muy_alto'} */
export function clasificar(valor, relacionComida) {
  if (valor < LIMITES.hipoglucemiaGrave) return 'hipoglucemia_grave'
  if (valor < LIMITES.hipoglucemia) return 'hipoglucemia'
  if (valor > LIMITES.muyAlto) return 'muy_alto'

  const objetivo = objetivoPara(relacionComida)
  if (valor < objetivo.min) return 'bajo'
  if (valor > objetivo.max) return 'alto'
  return 'en_rango'
}

/**
 * Cómo se muestra cada nivel.
 *
 * El color nunca va solo: siempre acompaña a una etiqueta de texto. Y se usan
 * sólo dos colores de alerta (ámbar y rojo), no un semáforo en cada elemento:
 * el azul de marca es el estado normal.
 */
export const NIVELES = {
  hipoglucemia_grave: {
    etiqueta: 'Hipoglucemia grave',
    urgente: true,
    texto: 'text-red-800',
    fondo: 'bg-red-50',
    borde: 'border-red-200',
    punto: 'bg-red-600',
  },
  hipoglucemia: {
    etiqueta: 'Hipoglucemia',
    urgente: true,
    texto: 'text-red-800',
    fondo: 'bg-red-50',
    borde: 'border-red-200',
    punto: 'bg-red-600',
  },
  bajo: {
    etiqueta: 'Por debajo de tu objetivo',
    urgente: false,
    texto: 'text-amber-800',
    fondo: 'bg-amber-50',
    borde: 'border-amber-200',
    punto: 'bg-amber-600',
  },
  en_rango: {
    etiqueta: 'En tu objetivo',
    urgente: false,
    texto: 'text-marca-800',
    fondo: 'bg-marca-50',
    borde: 'border-marca-100',
    punto: 'bg-marca-600',
  },
  alto: {
    etiqueta: 'Por encima de tu objetivo',
    urgente: false,
    texto: 'text-amber-800',
    fondo: 'bg-amber-50',
    borde: 'border-amber-200',
    punto: 'bg-amber-600',
  },
  muy_alto: {
    etiqueta: 'Muy alto',
    urgente: true,
    texto: 'text-red-800',
    fondo: 'bg-red-50',
    borde: 'border-red-200',
    punto: 'bg-red-600',
  },
}

/** Etiquetas legibles de las respuestas del cuestionario. */
export const ETIQUETAS = {
  actividad: {
    ninguna: 'Sin actividad',
    leve: 'Actividad leve',
    moderada: 'Actividad moderada',
    alta: 'Actividad alta',
  },
  momento: {
    ayuno: 'En ayunas',
    desayuno: 'Desayuno',
    media_manana: 'Media mañana',
    almuerzo: 'Almuerzo',
    merienda: 'Merienda',
    cena: 'Cena',
  },
  relacion_comida: {
    antes: 'Antes de comer',
    despues_1_2h: '1 a 2 h después',
    despues_3h: 'Más de 3 h después',
  },
}
