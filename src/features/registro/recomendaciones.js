/**
 * Motor de recomendaciones.
 *
 * Es una función pura `(medicion) → recomendación`: no toca la UI, no lee
 * estado y no pega a la red. Cambiar las reglas es cambiar este archivo solo.
 *
 * Dos límites que no se cruzan, y conviene que sigan así:
 *
 * 1. Diabex NUNCA sugiere una dosis de insulina. Eso es indicación médica y
 *    equivocarse tiene consecuencias graves.
 * 2. Diabex no diagnostica. Muestra el valor, en qué banda cae y qué conviene
 *    hacer; la conclusión clínica es del equipo de salud.
 *
 * Las indicaciones de abajo son las de manejo habitual en diabetes tipo 1
 * (regla del 15 para la hipoglucemia, control de cetonas cuando está muy alto).
 * Antes de salir a producción conviene que las revise el equipo clínico.
 */

export const NOTA_LEGAL =
  'Estas sugerencias son generales. Las indicaciones de tu equipo de salud siempre tienen prioridad, y Diabex nunca te va a decir cuánta insulina aplicarte.'

/** El ejercicio sigue bajando la glucosa horas después de terminarlo. */
const HUBO_EJERCICIO = (actividad) => actividad === 'moderada' || actividad === 'alta'

function paraHipoglucemiaGrave({ actividad }) {
  return {
    titulo: 'Tratá esta hipoglucemia ahora',
    acciones: [
      'Tomá 15 g de azúcar de absorción rápida: medio vaso de jugo o gaseosa común, o 3 pastillas de glucosa.',
      'Volvé a medir en 15 minutos. Si seguís por debajo de 70, repetí la toma.',
      'Si estás confundido, mareado o te cuesta tragar, pedí ayuda a alguien ahora mismo.',
      ...(HUBO_EJERCICIO(actividad)
        ? ['Después de ejercitar, la glucosa puede seguir bajando varias horas: volvé a medir antes de dormir.']
        : []),
    ],
  }
}

function paraHipoglucemia({ actividad }) {
  return {
    titulo: 'Estás en hipoglucemia',
    acciones: [
      'Tomá 15 g de azúcar de absorción rápida y esperá 15 minutos.',
      'Volvé a medir. Si seguís por debajo de 70, repetí.',
      'Cuando te recuperes, si falta más de una hora para tu próxima comida, sumá algo con carbohidratos de absorción lenta.',
      ...(HUBO_EJERCICIO(actividad)
        ? ['El ejercicio de hoy puede seguir bajándote la glucosa: medí de nuevo antes de dormir.']
        : []),
    ],
  }
}

function paraBajo({ actividad, relacion_comida }) {
  const acciones = ['Todavía no es hipoglucemia, pero estás cerca del límite. Tenelo a mano.']

  if (relacion_comida === 'antes') {
    acciones.push('Vas a comer ahora, así que es esperable que suba.')
  } else {
    acciones.push('Si falta para tu próxima comida, conviene que midas de nuevo en un rato.')
  }

  if (HUBO_EJERCICIO(actividad)) {
    acciones.push('Con la actividad que hiciste, el riesgo de que siga bajando es mayor.')
  }

  return { titulo: 'Un poco por debajo de tu objetivo', acciones }
}

function paraEnRango({ relacion_comida }) {
  const acciones = [
    relacion_comida === 'despues_1_2h'
      ? 'Tu glucosa después de comer quedó dentro del objetivo.'
      : 'Tu glucosa está dentro del objetivo para este momento.',
    'Seguí con tu rutina habitual.',
  ]

  return { titulo: 'Tu glucosa está en tu objetivo', acciones }
}

function paraAlto({ momento, relacion_comida, actividad }) {
  const acciones = []

  if (relacion_comida === 'despues_1_2h') {
    acciones.push('Después de comer es normal que suba, pero este valor pasó tu objetivo. Anotá qué comiste: ayuda a encontrar el patrón.')
  } else if (momento === 'ayuno') {
    acciones.push('En ayunas, un valor alto puede tener que ver con tu insulina basal o con el aumento de glucosa de la madrugada. Registralo para revisarlo con tu médico.')
  } else {
    acciones.push('Estás por encima de tu objetivo para este momento del día.')
  }

  acciones.push('Tomá agua.')

  if (actividad === 'ninguna') {
    acciones.push('Una caminata suave puede ayudar a bajarlo.')
  }

  acciones.push('Volvé a medir en un par de horas para ver si baja.')

  return { titulo: 'Por encima de tu objetivo', acciones }
}

function paraMuyAlto() {
  return {
    titulo: 'Tu glucosa está muy alta',
    acciones: [
      'Si tenés tiras de cetonas, medite ahora.',
      'Tomá agua para hidratarte.',
      'No hagas ejercicio hasta que baje: con cetonas altas, el ejercicio empeora el cuadro.',
      'Si tenés cetonas, vomitás, te duele el abdomen o te cuesta respirar, contactá a tu equipo de salud sin esperar.',
      'Volvé a medir en una hora.',
    ],
  }
}

const POR_NIVEL = {
  hipoglucemia_grave: paraHipoglucemiaGrave,
  hipoglucemia: paraHipoglucemia,
  bajo: paraBajo,
  en_rango: paraEnRango,
  alto: paraAlto,
  muy_alto: paraMuyAlto,
}

/**
 * @param {{nivel: string, actividad: string, momento: string, relacion_comida: string|null}} medicion
 * @returns {{titulo: string, acciones: string[]}}
 */
export function recomendarPara(medicion) {
  const armar = POR_NIVEL[medicion.nivel]
  if (!armar) {
    return {
      titulo: 'Anotamos tu medición',
      acciones: ['Consultá el valor con tu equipo de salud.'],
    }
  }
  return armar(medicion)
}
