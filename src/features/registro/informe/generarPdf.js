/**
 * El informe de glucosa en PDF, A4 vertical.
 *
 * Este módulo se importa con `import()` recién cuando la persona toca
 * "Descargar": jsPDF y las fuentes pesan más que el resto de la app junta, y
 * nadie tiene que bajarlos para anotar un control.
 *
 * Se dibuja con primitivas y no se "imprime" una pantalla: así el texto queda
 * seleccionable, el archivo pesa poco y se ve igual en cualquier visor.
 */
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

import { agruparPorDia, horaDe } from '@/features/registro/presentacion'
import { claveLocal, desdeClave, diasEntre, fechaLarga, textoDelRango } from '@/lib/fechas'
import { ETIQUETAS, LIMITES, NIVELES } from '@/lib/glucosa'

import { porcentajesEnteros, resumir, tonoDe } from './resumen'
import fuenteExtraBold from './fuentes/Manrope-ExtraBold.ttf?url'
import fuenteRegular from './fuentes/Manrope-Regular.ttf?url'
import fuenteSemiBold from './fuentes/Manrope-SemiBold.ttf?url'

// Los mismos valores que los tokens de index.css: el PDF no ve Tailwind.
const COLOR = {
  marca50: '#eef7fd',
  marca100: '#d6ecfa',
  marca200: '#b0daf5',
  marca600: '#0071b9',
  marca700: '#005b96',
  marca800: '#004682',
  marca900: '#0a3868',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  blanco: '#ffffff',
}

/**
 * Los dos colores de alerta y el azul como estado normal, igual que en la app.
 * En el PDF también vale que el color nunca va solo: cada punto y cada franja
 * tienen su etiqueta escrita, y la tabla dice la banda con palabras. Un
 * informe impreso en blanco y negro se tiene que poder leer igual.
 */
const TONOS = {
  normal: { punto: COLOR.marca600, texto: COLOR.marca800 },
  fuera: { punto: '#d97706', texto: '#92400e' },
  urgente: { punto: '#dc2626', texto: '#991b1b' },
}

// Geometría de la página, en milímetros.
const ANCHO = 210
const ALTO = 297
const MARGEN = 16
const CONTENIDO = ANCHO - MARGEN * 2
const DERECHA = ANCHO - MARGEN
const PIE = ALTO - 12

// El logo horizontal es de 720 × 220. Con un alias jsPDF lo guarda una sola
// vez aunque aparezca en todas las páginas.
const PROPORCION_LOGO = 220 / 720
const ALIAS_LOGO = 'logo-diabex'

const NUMERO = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })
const DIA_SEMANA = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric' })
const DIA_BARRA_MES = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'numeric' })
const GENERADO = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function mayuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

async function bajarBytes(url) {
  const respuesta = await fetch(url)
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${url}`)
  return new Uint8Array(await respuesta.arrayBuffer())
}

/** jsPDF recibe las fuentes en base64. Por partes: `apply` con 90 KB de argumentos revienta la pila. */
function aBase64(bytes) {
  let binario = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binario += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  }
  return btoa(binario)
}

/**
 * Manrope, la misma tipografía de la app. Con las fuentes que trae jsPDF los
 * acentos y la ñ dependen del visor; con una TTF embebida salen siempre.
 *
 * jsPDF y autoTable sólo conocen "normal" y "bold", así que el SemiBold va como
 * una familia aparte para las etiquetas.
 */
async function cargarFuentes(doc) {
  const [regular, semi, extra] = await Promise.all(
    [fuenteRegular, fuenteSemiBold, fuenteExtraBold].map(bajarBytes),
  )
  doc.addFileToVFS('Manrope-Regular.ttf', aBase64(regular))
  doc.addFont('Manrope-Regular.ttf', 'Manrope', 'normal')
  doc.addFileToVFS('Manrope-ExtraBold.ttf', aBase64(extra))
  doc.addFont('Manrope-ExtraBold.ttf', 'Manrope', 'bold')
  doc.addFileToVFS('Manrope-SemiBold.ttf', aBase64(semi))
  doc.addFont('Manrope-SemiBold.ttf', 'ManropeSemi', 'normal')
}

/** Escribe con una sola llamada fuente, tamaño y color: así ningún texto hereda el estilo del anterior. */
function escribir(doc, texto, x, y, { peso = 'regular', tamano = 9, color = COLOR.slate900, ...opciones } = {}) {
  if (peso === 'semi') doc.setFont('ManropeSemi', 'normal')
  else doc.setFont('Manrope', peso === 'extra' ? 'bold' : 'normal')
  doc.setFontSize(tamano)
  doc.setTextColor(color)
  doc.text(texto, x, y, opciones)
}

/** Ancho de un texto con un estilo dado, sin dejar ese estilo puesto. */
function anchoDe(doc, texto, peso, tamano) {
  if (peso === 'semi') doc.setFont('ManropeSemi', 'normal')
  else doc.setFont('Manrope', peso === 'extra' ? 'bold' : 'normal')
  doc.setFontSize(tamano)
  return doc.getTextWidth(texto)
}

/** Etiqueta en versalitas espaciadas, alineada a la izquierda o a la derecha. */
function rotulo(doc, texto, x, y, { color = COLOR.slate500, alinear = 'izquierda', tamano = 6.8 } = {}) {
  const espacio = 0.35
  const ancho = anchoDe(doc, texto, 'semi', tamano) + espacio * (texto.length - 1)
  const desde = alinear === 'derecha' ? x - ancho : x
  escribir(doc, texto, desde, y, { peso: 'semi', tamano, color, charSpace: espacio })
}

function linea(doc, x1, y1, x2, y2, color = COLOR.slate200, grosor = 0.25) {
  doc.setDrawColor(color)
  doc.setLineWidth(grosor)
  doc.line(x1, y1, x2, y2)
}

function encabezado(doc, { logo, rango, generado }) {
  const anchoLogo = 40
  doc.addImage(logo, 'PNG', MARGEN, 13, anchoLogo, anchoLogo * PROPORCION_LOGO, ALIAS_LOGO)

  rotulo(doc, 'INFORME DE GLUCOSA', DERECHA, 16.5, { color: COLOR.marca700, alinear: 'derecha' })
  escribir(doc, rango, DERECHA, 22.5, { peso: 'extra', tamano: 11, align: 'right' })
  escribir(doc, `Generado el ${generado}`, DERECHA, 27, {
    tamano: 7.5,
    color: COLOR.slate500,
    align: 'right',
  })

  linea(doc, MARGEN, 33, DERECHA, 33)
}

/** Las páginas siguientes llevan una versión chica: alcanza para saber de quién es la hoja suelta. */
function encabezadoDeContinuacion(doc, { logo, rango, nombre }) {
  const anchoLogo = 24
  doc.addImage(logo, 'PNG', MARGEN, 11, anchoLogo, anchoLogo * PROPORCION_LOGO, ALIAS_LOGO)
  escribir(doc, nombre ? `${nombre} · ${rango}` : rango, DERECHA, 16.2, {
    tamano: 7.5,
    color: COLOR.slate500,
    align: 'right',
  })
  linea(doc, MARGEN, 21, DERECHA, 21)
}

function persona(doc, { nombre, edad, dias, cantidad }) {
  escribir(doc, nombre || 'Mis controles de glucosa', MARGEN, 44, { peso: 'extra', tamano: 20 })

  const datos = [
    edad != null ? `${edad} años` : null,
    'Diabetes tipo 1',
    `${dias} ${dias === 1 ? 'día' : 'días'}`,
    `${cantidad} ${cantidad === 1 ? 'control' : 'controles'}`,
  ].filter(Boolean)
  escribir(doc, datos.join('  ·  '), MARGEN, 50.5, { tamano: 9, color: COLOR.slate600 })
}

/**
 * Los cuatro números del período, en un panel con divisiones finas. No son
 * cuatro tarjetas: es una sola franja que se lee de izquierda a derecha.
 */
function cifras(doc, resumen, dias, y) {
  const alto = 27
  doc.setFillColor(COLOR.slate50)
  doc.roundedRect(MARGEN, y, CONTENIDO, alto, 2.5, 2.5, 'F')

  const [enObjetivo] = porcentajesEnteros([resumen.enObjetivo])
  const enRango = resumen.franjas.find((f) => f.clave === 'en_rango').cantidad

  const columnas = [
    {
      rotulo: 'PROMEDIO',
      valor: String(resumen.promedio),
      unidad: 'mg/dL',
      nota: `Entre ${resumen.minimo} y ${resumen.maximo} mg/dL`,
    },
    {
      rotulo: 'EN TU OBJETIVO',
      valor: `${enObjetivo} %`,
      nota: `${enRango} de ${resumen.cantidad} controles`,
      color: COLOR.marca800,
    },
    {
      rotulo: 'HIPOGLUCEMIAS',
      valor: String(resumen.hipoglucemias),
      nota: `Menos de ${LIMITES.hipoglucemia} mg/dL`,
      // El rojo acompaña al número, que ya dice cuántas hubo: no lo reemplaza.
      color: resumen.hipoglucemias > 0 ? TONOS.urgente.texto : COLOR.slate900,
    },
    {
      rotulo: 'CONTROLES',
      valor: String(resumen.cantidad),
      nota: `${NUMERO.format(resumen.cantidad / dias)} por día en promedio`,
    },
  ]

  const ancho = CONTENIDO / columnas.length
  columnas.forEach((columna, i) => {
    const x = MARGEN + ancho * i + 5
    if (i > 0) linea(doc, MARGEN + ancho * i, y + 5, MARGEN + ancho * i, y + alto - 5)

    rotulo(doc, columna.rotulo, x, y + 7.5)
    escribir(doc, columna.valor, x, y + 17, {
      peso: 'extra',
      tamano: 19,
      color: columna.color ?? COLOR.slate900,
    })
    if (columna.unidad) {
      const desplazamiento = anchoDe(doc, columna.valor, 'extra', 19) + 1.2
      escribir(doc, columna.unidad, x + desplazamiento, y + 17, {
        tamano: 8,
        color: COLOR.slate600,
      })
    }
    escribir(doc, columna.nota, x, y + 22.5, { tamano: 7.2, color: COLOR.slate500 })
  })

  return y + alto
}

function tituloDeSeccion(doc, titulo, bajada, y) {
  escribir(doc, titulo, MARGEN, y, { peso: 'extra', tamano: 11 })
  if (bajada) escribir(doc, bajada, MARGEN, y + 5, { tamano: 7.8, color: COLOR.slate600 })
  return y + (bajada ? 9 : 5)
}

/**
 * La barra de distribución: una sola barra partida en franjas, de lo más bajo
 * a lo más alto, con la leyenda abajo diciendo cada una con palabras.
 */
function distribucion(doc, resumen, y) {
  y = tituloDeSeccion(doc, 'Cómo se repartieron tus valores', null, y)

  const alto = 6
  const separacion = 0.7
  const presentes = resumen.franjas.filter((f) => f.cantidad > 0)
  const disponible = CONTENIDO - separacion * (presentes.length - 1)
  let x = MARGEN
  for (const franja of presentes) {
    const ancho = Math.max(disponible * franja.proporcion, 1.2)
    doc.setFillColor(TONOS[franja.tono].punto)
    doc.roundedRect(x, y, ancho, alto, 1, 1, 'F')
    x += ancho + separacion
  }

  const porcentajes = porcentajesEnteros(resumen.franjas.map((f) => f.proporcion))
  const anchoLeyenda = CONTENIDO / resumen.franjas.length
  const yLeyenda = y + alto + 6
  resumen.franjas.forEach((franja, i) => {
    const xl = MARGEN + anchoLeyenda * i
    const tono = TONOS[franja.tono]
    doc.setFillColor(tono.punto)
    doc.circle(xl + 1.2, yLeyenda - 1.1, 1.1, 'F')
    escribir(doc, franja.etiqueta, xl + 3.6, yLeyenda, { peso: 'semi', tamano: 7.8 })
    escribir(doc, `${porcentajes[i]} %`, xl + 3.6, yLeyenda + 5, {
      peso: 'extra',
      tamano: 10,
      color: franja.cantidad ? tono.texto : COLOR.slate500,
    })
    const nota = [`${franja.cantidad} ${franja.cantidad === 1 ? 'control' : 'controles'}`, franja.detalle]
      .filter(Boolean)
      .join(' · ')
    escribir(doc, nota, xl + 3.6, yLeyenda + 9, { tamano: 6.8, color: COLOR.slate500 })
  })

  return yLeyenda + 10
}

/**
 * Qué días llevan etiqueta en el eje. Hasta 12 rótulos: más que eso en 166 mm
 * se pisan. Se cuenta desde el último día para que "hoy" quede siempre rotulado.
 */
function diasRotulados(dias) {
  const paso = [1, 2, 3, 7, 14, 28, 56].find((p) => Math.ceil(dias / p) <= 12) ?? Math.ceil(dias / 12)
  const rotulados = []
  for (let i = dias - 1; i >= 0; i -= paso) rotulados.unshift(i)
  return rotulados
}

/**
 * La evolución: un punto por control sobre el tiempo, con la franja de
 * 70 a 180 mg/dL de fondo. Un solo eje y una sola serie; el color de cada
 * punto es su banda, que la barra de arriba ya explicó con palabras.
 */
function evolucion(doc, mediciones, resumen, desde, dias, y) {
  y = tituloDeSeccion(
    doc,
    'Evolución en el período',
    'Cada punto es un control, con el color de su banda. La franja celeste marca de 70 a 180 mg/dL.',
    y,
  )

  const area = { x: MARGEN + 11, y: y + 3, ancho: CONTENIDO - 11, alto: 56 }
  const minimo = resumen.minimo < 40 ? 20 : 40
  const maximo = Math.max(300, Math.ceil((resumen.maximo + 20) / 50) * 50)
  const yDe = (valor) => {
    const acotado = Math.min(Math.max(valor, minimo), maximo)
    return area.y + area.alto - ((acotado - minimo) / (maximo - minimo)) * area.alto
  }

  const inicio = desdeClave(claveLocal(desde)).getTime()
  const fin = new Date(inicio)
  fin.setDate(fin.getDate() + dias)
  const xDe = (instante) => area.x + ((instante - inicio) / (fin.getTime() - inicio)) * area.ancho

  // La franja objetivo amplia, de fondo. Es contexto, no dato: va tenue.
  doc.setFillColor(COLOR.marca50)
  doc.rect(area.x, yDe(180), area.ancho, yDe(70) - yDe(180), 'F')
  linea(doc, area.x, yDe(180), area.x + area.ancho, yDe(180), COLOR.marca200, 0.2)
  linea(doc, area.x, yDe(70), area.x + area.ancho, yDe(70), COLOR.marca200, 0.2)

  doc.setLineDashPattern([0.8, 0.8], 0)
  linea(doc, area.x, yDe(LIMITES.muyAlto), area.x + area.ancho, yDe(LIMITES.muyAlto), COLOR.slate300, 0.2)
  doc.setLineDashPattern([], 0)

  for (const valor of [70, 180, LIMITES.muyAlto, maximo]) {
    escribir(doc, String(valor), area.x - 2, yDe(valor) + 1, {
      tamano: 6.8,
      color: COLOR.slate500,
      align: 'right',
    })
  }

  // Un día separado del otro por una línea casi invisible: deja leer "qué
  // pasó el martes" sin que la grilla compita con los puntos.
  const dia = (i) => {
    const fecha = new Date(inicio)
    fecha.setDate(fecha.getDate() + i)
    return fecha
  }
  if (dias > 1 && dias <= 62) {
    for (let i = 1; i < dias; i += 1) {
      const x = xDe(dia(i).getTime())
      linea(doc, x, area.y, x, area.y + area.alto, COLOR.slate100, 0.2)
    }
  }
  linea(doc, area.x, area.y + area.alto, area.x + area.ancho, area.y + area.alto, COLOR.slate300, 0.25)

  const yEje = area.y + area.alto + 4.2
  if (dias === 1) {
    for (let hora = 0; hora <= 24; hora += 3) {
      escribir(doc, `${String(hora).padStart(2, '0')} h`, xDe(inicio + hora * 3_600_000), yEje, {
        tamano: 6.8,
        color: COLOR.slate500,
        align: 'center',
      })
    }
  } else {
    const formato = dias <= 10 ? DIA_SEMANA : DIA_BARRA_MES
    for (const i of diasRotulados(dias)) {
      const mediodia = dia(i)
      mediodia.setHours(12)
      escribir(doc, formato.format(dia(i)), xDe(mediodia.getTime()), yEje, {
        tamano: 6.8,
        color: COLOR.slate500,
        align: 'center',
      })
    }
  }

  // El anillo blanco separa dos controles que caen casi en el mismo lugar.
  // Va como un disco de fondo y no como trazo ('FD'): algunos visores corren
  // el trazo de un círculo chico respecto de su relleno.
  for (const medicion of mediciones) {
    const x = xDe(new Date(medicion.medido_en).getTime())
    const y = yDe(medicion.glucosa_mg_dl)
    doc.setFillColor(COLOR.blanco)
    doc.circle(x, y, 1.3, 'F')
    doc.setFillColor(TONOS[tonoDe(medicion.nivel)].punto)
    doc.circle(x, y, 0.95, 'F')
  }

  return yEje + 2
}

// Alto de la franja con el nombre del día, en mm.
const ALTO_DIA = 7.4

/**
 * Filas de la tabla, una por control.
 *
 * El nombre del día no es una fila aparte sino una franja dibujada arriba de
 * su primer control, dentro de la misma fila. Con `rowPageBreak: 'avoid'` eso
 * garantiza que nunca quede "Jueves, 24 de septiembre" solo al pie de una
 * página y sus controles en la siguiente.
 */
function filasDeLaTabla(mediciones) {
  const filas = []
  for (const [clave, delDia] of agruparPorDia(mediciones, claveLocal)) {
    const promedio = Math.round(delDia.reduce((a, m) => a + m.glucosa_mg_dl, 0) / delDia.length)
    const dia = {
      titulo: mayuscula(fechaLarga(desdeClave(clave))),
      resumen: `${delDia.length} ${delDia.length === 1 ? 'control' : 'controles'} · promedio ${promedio} mg/dL`,
    }

    delDia.forEach((medicion, i) => {
      filas.push([
        { content: horaDe(medicion), dia: i === 0 ? dia : null },
        String(medicion.glucosa_mg_dl),
        { content: NIVELES[medicion.nivel]?.etiqueta ?? '', nivel: medicion.nivel },
        ETIQUETAS.momento[medicion.momento] ?? '',
        medicion.relacion_comida ? ETIQUETAS.relacion_comida[medicion.relacion_comida] : '',
        ETIQUETAS.actividad[medicion.actividad] ?? '',
      ])
    })
  }
  return filas
}

/** El centro vertical del texto de una celda, descontando la franja del día si la tiene. */
function centroDelTexto(celda) {
  const arriba = celda.padding('top')
  return celda.y + arriba + (celda.height - arriba - celda.padding('bottom')) / 2
}

function tabla(doc, mediciones, y) {
  y = tituloDeSeccion(doc, 'Detalle de controles', null, y)

  autoTable(doc, {
    startY: y,
    // Arriba deja lugar al encabezado chico de las páginas siguientes.
    margin: { top: 27, bottom: 22, left: MARGEN, right: MARGEN },
    theme: 'plain',
    showHead: 'everyPage',
    rowPageBreak: 'avoid',
    head: [['Hora', 'Valor (mg/dL)', 'Banda', 'Momento', 'Respecto de la comida', 'Actividad']],
    body: filasDeLaTabla(mediciones),
    // La banda va completa en una línea: partida en dos, cada fila duplica
    // su alto y un mes de controles se vuelve el doble de páginas.
    columnStyles: {
      0: { cellWidth: 14 },
      1: { cellWidth: 22, font: 'Manrope', fontStyle: 'bold', textColor: COLOR.slate900 },
      2: { cellWidth: 47 },
      3: { cellWidth: 27 },
      4: { cellWidth: 36 },
      5: { cellWidth: 32 },
    },
    styles: {
      font: 'Manrope',
      fontStyle: 'normal',
      fontSize: 8,
      textColor: COLOR.slate700,
      cellPadding: { top: 1.7, bottom: 1.7, left: 2, right: 2 },
      lineColor: COLOR.slate200,
      lineWidth: { bottom: 0.2 },
      valign: 'bottom',
    },
    headStyles: {
      font: 'ManropeSemi',
      fontStyle: 'normal',
      fontSize: 7.2,
      textColor: COLOR.slate500,
      lineColor: COLOR.slate300,
      lineWidth: { bottom: 0.3 },
      cellPadding: { top: 1.5, bottom: 2, left: 2, right: 2 },
    },
    didParseCell(data) {
      if (data.section !== 'body') return
      const empiezaElDia = Boolean(data.row.raw[0]?.dia)

      // Toda la fila se corre hacia abajo para dejarle lugar a la franja.
      data.cell.styles.cellPadding = {
        top: 1.7 + (empiezaElDia ? ALTO_DIA : 0),
        bottom: 1.7,
        left: data.column.index === 2 ? 5.6 : 2,
        right: 2,
      }

      if (data.cell.raw?.nivel) {
        data.cell.styles.font = 'ManropeSemi'
        data.cell.styles.textColor = TONOS[tonoDe(data.cell.raw.nivel)].texto
      }
    },
    didDrawCell(data) {
      if (data.section !== 'body') return
      const crudo = data.cell.raw

      if (crudo?.dia) {
        const { x, y: yCelda } = data.cell
        doc.setFillColor(COLOR.marca50)
        doc.rect(x, yCelda, CONTENIDO, ALTO_DIA, 'F')
        const base = yCelda + ALTO_DIA / 2 + 1.1
        escribir(doc, crudo.dia.titulo, x + 2, base, {
          peso: 'extra',
          tamano: 8.2,
          color: COLOR.marca900,
        })
        escribir(doc, crudo.dia.resumen, x + CONTENIDO - 2, base, {
          tamano: 7.5,
          color: COLOR.marca700,
          align: 'right',
        })
      }

      if (crudo?.nivel) {
        doc.setFillColor(TONOS[tonoDe(crudo.nivel)].punto)
        doc.circle(data.cell.x + 3, centroDelTexto(data.cell) - 0.05, 1, 'F')
      }
    },
  })

  return doc.lastAutoTable.finalY
}

function notaFinal(doc, y) {
  const texto =
    'Este informe resume los controles que anotaste en Diabex entre esas fechas. Cada valor se ' +
    'clasificó con el objetivo de referencia: de 80 a 130 mg/dL antes de comer o en ayunas, y de ' +
    '70 a 180 mg/dL entre 1 y 2 horas después de comer. No es un diagnóstico ni reemplaza la ' +
    'indicación de tu equipo de salud: si tu objetivo personal es otro, leelo con ese objetivo en mente.'

  doc.setFont('Manrope', 'normal')
  doc.setFontSize(7.5)
  const renglones = doc.splitTextToSize(texto, CONTENIDO - 10)
  const alto = 10 + renglones.length * 3.4

  if (y + 8 + alto > PIE - 6) {
    doc.addPage()
    y = 27
  } else {
    y += 8
  }

  doc.setFillColor(COLOR.slate50)
  doc.roundedRect(MARGEN, y, CONTENIDO, alto, 2.5, 2.5, 'F')
  rotulo(doc, 'SOBRE ESTE INFORME', MARGEN + 5, y + 6.5)
  escribir(doc, renglones, MARGEN + 5, y + 11.5, {
    tamano: 7.5,
    color: COLOR.slate600,
    lineHeightFactor: 1.45,
  })
}

function pies(doc, { nombre, rango, logo }) {
  const total = doc.getNumberOfPages()
  for (let pagina = 1; pagina <= total; pagina += 1) {
    doc.setPage(pagina)
    if (pagina > 1) encabezadoDeContinuacion(doc, { logo, rango, nombre })

    linea(doc, MARGEN, PIE - 4.5, DERECHA, PIE - 4.5)
    escribir(doc, ['Diabex', nombre, 'Informe de glucosa'].filter(Boolean).join(' · '), MARGEN, PIE, {
      tamano: 7,
      color: COLOR.slate500,
    })
    escribir(doc, `Página ${pagina} de ${total}`, DERECHA, PIE, {
      tamano: 7,
      color: COLOR.slate500,
      align: 'right',
    })
  }
}

/**
 * Arma el informe y lo descarga.
 *
 * @param {object} opciones
 * @param {object[]} opciones.mediciones  Ordenadas de la más temprana a la más reciente.
 * @param {Date} opciones.desde           Medianoche local del primer día.
 * @param {Date} opciones.hasta           Medianoche local del último día.
 * @param {string} [opciones.nombre]
 * @param {number|null} [opciones.edad]
 */
export async function descargarInforme({ mediciones, desde, hasta, nombre, edad }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })

  const [logo] = await Promise.all([bajarBytes('/logo-diabex.png'), cargarFuentes(doc)])

  const dias = diasEntre(desde, hasta) + 1
  const rango = textoDelRango(desde, hasta)
  const generado = GENERADO.format(new Date())
  const resumen = resumir(mediciones)

  doc.setProperties({
    title: `Informe de glucosa · ${rango}`,
    subject: 'Controles de glucosa anotados en Diabex',
    author: nombre || 'Diabex',
    creator: 'Diabex',
  })

  encabezado(doc, { logo, rango, generado })
  persona(doc, { nombre, edad, dias, cantidad: resumen.cantidad })

  let y = cifras(doc, resumen, dias, 57)
  y = distribucion(doc, resumen, y + 11)
  y = evolucion(doc, mediciones, resumen, desde, dias, y + 10)
  y = tabla(doc, mediciones, y + 10)
  notaFinal(doc, y)
  pies(doc, { nombre, rango, logo })

  doc.save(`diabex-glucosa-${claveLocal(desde)}-al-${claveLocal(hasta)}.pdf`)
}
