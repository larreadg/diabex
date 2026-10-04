/**
 * El contenido de Autoayuda.
 *
 * Son guías fijas y versionadas, no texto generado en cada visita: quien abre
 * "Hipoglucemia" a las tres de la mañana necesita el mismo texto de siempre, el
 * que revisó el equipo clínico, y no la redacción de hoy. Por eso viven en el
 * repo, se revisan en un diff y no necesitan ni tabla ni red.
 *
 * Los dos límites de siempre, acá también: ninguna guía sugiere una dosis de
 * insulina y ninguna diagnostica. La de factor de corrección explica el
 * concepto y dice, con todas las letras, que el número lo define el equipo de
 * salud.
 *
 * OJO: el contenido sigue las pautas de manejo habituales en diabetes tipo 1
 * (regla del 15, control de cetonas, pesquisa anual). Antes de salir a
 * producción tiene que revisarlo el equipo clínico, igual que
 * `features/registro/recomendaciones.js`.
 *
 * Forma de una sección:
 *   { titulo, parrafos?: string[], lista?: string[], urgente?: boolean }
 * `urgente` es el único lugar donde una guía usa color, y va acompañado del
 * título que dice lo mismo en palabras.
 */

export const NOTA_LEGAL =
  'Estas guías son material de orientación general para diabetes tipo 1. No reemplazan a tu equipo de salud, y sus indicaciones siempre tienen prioridad sobre lo que leas acá.'

export const GUIAS = [
  {
    slug: 'hipoglucemia',
    titulo: 'Hipoglucemia',
    resumen: 'Cómo reconocerla y qué hacer en los primeros minutos.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['hipo', 'bajon', 'bajoneada', 'azucar baja', 'glucosa baja', 'desmayo', 'mareo', 'urgencia'],
    entrada:
      'Hipoglucemia es tener la glucosa por debajo de 70 mg/dL. Es la urgencia más frecuente de la diabetes tipo 1 y la que más conviene tener resuelta de antemano, porque cuando pasa no es el mejor momento para ponerse a pensar.',
    secciones: [
      {
        titulo: 'Cómo se siente',
        parrafos: [
          'Los síntomas más comunes son temblor, sudor frío, hambre repentina, palpitaciones, irritabilidad y visión borrosa. No siempre aparecen todos ni en el mismo orden.',
          'Con los años, algunas personas dejan de sentirlos: es lo que se llama hipoglucemia inadvertida. Si te está pasando, es una de las cosas más importantes que podés contarle a tu equipo.',
        ],
      },
      {
        titulo: 'La regla del 15',
        parrafos: [
          'Es el procedimiento estándar y funciona: 15 gramos de azúcar de absorción rápida, esperar 15 minutos, volver a medir. Si seguís por debajo de 70, repetís.',
        ],
        lista: [
          'Medio vaso (150 ml) de jugo de fruta o gaseosa común.',
          'Tres pastillas de glucosa.',
          'Una cucharada sopera de azúcar disuelta en agua.',
          'Un sachet de miel.',
        ],
      },
      {
        titulo: 'Qué no sirve para cortarla',
        parrafos: [
          'El chocolate, el alfajor y el helado tienen grasa, y la grasa retrasa la absorción del azúcar justo cuando necesitás que sea rápida. Sirven después, no durante.',
          'La gaseosa light no tiene azúcar: no corta nada. Vale la pena revisar qué versión tenés guardada en la mochila.',
        ],
      },
      {
        titulo: 'Cuando ya te recuperaste',
        parrafos: [
          'Si falta más de una hora para tu próxima comida, sumá algo con carbohidratos de absorción lenta para que no vuelva a bajar: una fruta con yogur, unas galletitas de agua, un pan chico.',
          'Anotá el episodio. Una hipoglucemia suelta es un dato; tres en la misma franja horaria es un patrón, y un patrón se corrige.',
        ],
      },
      {
        titulo: 'Cuándo es una urgencia',
        urgente: true,
        parrafos: [
          'Si la persona está confundida, no puede tragar o perdió la conciencia, no hay que darle nada por boca: se corre riesgo de que se ahogue.',
          'Ahí va glucagón, si hay, y se llama a emergencias. Conviene que al menos una persona de tu casa o de tu trabajo sepa dónde está el glucagón y cómo se aplica, antes de que haga falta.',
        ],
      },
    ],
  },

  {
    slug: 'ejercicio-y-glucosa',
    titulo: 'Ejercicio y glucosa',
    resumen: 'Qué pasa antes, durante y varias horas después.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['deporte', 'gimnasio', 'gym', 'entrenar', 'entrenamiento', 'correr', 'running', 'pesas', 'futbol', 'natacion', 'bicicleta', 'actividad fisica'],
    entrada:
      'El ejercicio es una de las mejores cosas que podés hacer por vos, y también una de las que más mueve la glucosa. Lo que confunde es que no siempre la mueve para el mismo lado.',
    secciones: [
      {
        titulo: 'Antes de empezar',
        parrafos: ['Medí. El valor que ves cambia qué conviene hacer.'],
        lista: [
          'Por debajo de 100 mg/dL: sumá carbohidratos antes de arrancar.',
          'Entre 100 y 250 mg/dL: es el rango cómodo para empezar.',
          'Por encima de 250 mg/dL: medite cetonas si tenés tiras. Con cetonas presentes, el ejercicio empeora el cuadro en vez de mejorarlo.',
        ],
      },
      {
        titulo: 'Por qué a veces sube',
        parrafos: [
          'El ejercicio aeróbico sostenido (correr, nadar, bicicleta) tiende a bajar la glucosa. El ejercicio intenso y corto (pesas, sprints, un partido competitivo) puede subirla, porque la adrenalina le pide al hígado que libere glucosa.',
          'Las dos cosas son normales. No es que hiciste algo mal: es que hiciste un tipo distinto de esfuerzo.',
        ],
      },
      {
        titulo: 'El efecto dura mucho más que la sesión',
        parrafos: [
          'Los músculos siguen reponiendo glucógeno durante horas. El riesgo de hipoglucemia sigue elevado hasta 24 horas después, y la franja más delicada es la noche siguiente a un entrenamiento fuerte.',
          'Si entrenaste de tarde, medí antes de dormir. Es la medición que más veces evita un susto.',
        ],
      },
      {
        titulo: 'Lo que conviene tener encima',
        lista: [
          'Azúcar de absorción rápida, siempre, aunque sea una caminata corta.',
          'Agua.',
          'Algo que te identifique como persona con diabetes tipo 1, si entrenás solo.',
        ],
      },
      {
        titulo: 'Lo que sí ajusta tu equipo',
        parrafos: [
          'Los cambios de insulina alrededor del ejercicio (basal, bolo previo, temporales de bomba) los define tu equipo de salud con tus datos. Lo que te toca a vos es juntar esos datos: anotá qué hiciste, cuánto duró y cómo venía tu glucosa antes y después.',
        ],
      },
    ],
  },

  {
    slug: 'alcohol',
    titulo: 'Alcohol',
    resumen: 'Por qué baja la glucosa, y por qué el riesgo llega horas después.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['tomar', 'birra', 'cerveza', 'fernet', 'vino', 'trago', 'previa', 'salida', 'boliche', 'joda', 'borrachera', 'resaca', 'fiesta'],
    entrada:
      'Salir a tomar algo es parte de la vida de cualquier adulto, y esta guía no está acá para desaconsejártelo. Está para contarte que el alcohol le hace a la glucosa lo contrario de lo que casi todo el mundo supone, y que el momento peligroso no es mientras tomás.',
    secciones: [
      {
        titulo: 'El alcohol baja la glucosa',
        parrafos: [
          'Entre otras cosas, tu hígado fabrica glucosa y la va soltando a lo largo del día. Cuando hay alcohol en sangre, deja todo eso de lado y se dedica a metabolizarlo: mientras está ocupado con eso, no produce glucosa.',
          'El resultado es que la glucosa baja, y sigue bajando mientras el hígado siga trabajando. No importa cuántos carbohidratos tenga el trago: ese efecto está igual.',
        ],
      },
      {
        titulo: 'El riesgo real es a las seis de la mañana',
        parrafos: [
          'La hipoglucemia por alcohol no suele aparecer mientras estás tomando. Aparece entre seis y doce horas después, cuando el hígado todavía está ocupado y vos ya estás durmiendo.',
          'Por eso es la situación en la que más gente se despierta con una hipoglucemia sin haber sentido nada venir, o directamente no se despierta. Casi todo lo que sigue apunta a ese momento y no a la salida.',
        ],
      },
      {
        titulo: 'Qué hace cada bebida',
        lista: [
          'Cerveza, sidra y tragos dulces traen carbohidratos: primero suben la glucosa y después la caída llega igual. Es una subida que engaña.',
          'Los destilados solos o con gaseosa light casi no tienen carbohidratos: bajan sin subir antes, así que la caída empieza de más arriba de lo que creés.',
          'El vino seco queda en el medio, más cerca de los destilados.',
          'Ninguna opción evita la baja tardía. Cambia el camino, no el destino.',
        ],
      },
      {
        titulo: 'Antes y durante',
        lista: [
          'No tomes con el estómago vacío. Comer con carbohidratos mientras tomás es lo que más amortigua la caída.',
          'Medí más seguido que de costumbre, aunque te sientas bien.',
          'Tomá agua entre trago y trago: la deshidratación distorsiona los valores y empeora el día siguiente.',
          'Si además vas a bailar varias horas, sumale el efecto del ejercicio. Los dos bajan la glucosa y se potencian.',
          'Que alguien de los que están con vos sepa que tenés diabetes tipo 1 y dónde tenés el azúcar.',
        ],
      },
      {
        titulo: 'Antes de acostarte',
        parrafos: [
          'Es la medición que más importa de toda la noche. Comé algo con carbohidratos de absorción lenta antes de dormir, aunque el valor te parezca cómodo: lo que viene después es una bajada larga.',
          'Si tomaste bastante, poné una alarma para medir de madrugada. Es molesto una noche y evita el episodio que nadie ve.',
        ],
      },
      {
        titulo: 'Por qué los demás pueden no darse cuenta',
        urgente: true,
        parrafos: [
          'Una hipoglucemia y una borrachera se parecen demasiado: torpeza, habla arrastrada, confusión, sudor. La gente de alrededor tiende a leer lo segundo y dejarte dormir, que es exactamente lo contrario de lo que hace falta.',
          'Además, el glucagón funciona pidiéndole al hígado que libere glucosa guardada, y con alcohol en sangre el hígado no responde igual: puede no hacer efecto. Acá prevenir vale más que en cualquier otra situación.',
          'Si alguien con diabetes tipo 1 que tomó no se puede mantener despierto, está confundido y no mejora después de tomar azúcar, o vomita sin parar, se llama a emergencias y se avisa que tiene diabetes tipo 1.',
        ],
      },
      {
        titulo: 'Al día siguiente',
        parrafos: [
          'El efecto puede durar hasta veinticuatro horas, así que la vigilancia no termina al despertarte. Seguí midiendo más seguido durante la mañana y comé algo aunque no tengas ganas.',
          'Si te pasó una hipoglucemia esa noche, anotala con su hora. Es de los datos que más le sirven a tu equipo, y el que menos gente cuenta en la consulta.',
        ],
      },
    ],
  },

  {
    slug: 'dias-de-enfermedad',
    titulo: 'Días de enfermedad',
    resumen: 'Fiebre, vómitos y cetonas: el plan de esos días.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['gripe', 'fiebre', 'vomitos', 'nauseas', 'diarrea', 'enfermo', 'infeccion', 'angina', 'resfrio', 'descompuesto', 'cetoacidosis', 'urgencia'],
    entrada:
      'Una gripe, una angina o una infección urinaria suben la glucosa aunque estés comiendo menos que de costumbre. El cuerpo libera hormonas de estrés y eso empuja los valores para arriba. Son los días en los que más hay que mirar y menos ganas se tienen.',
    secciones: [
      {
        titulo: 'Tené el plan antes de necesitarlo',
        parrafos: [
          'Tu equipo de salud te tiene que haber dado un plan de días de enfermedad. El punto central de todos esos planes es el mismo: la insulina no se suspende por no estar comiendo. El cuerpo la sigue necesitando, y sin ella aparecen las cetonas.',
          'Si no tenés ese plan escrito, pedilo en la próxima consulta. Buscarlo con 39 de fiebre es tarde.',
        ],
      },
      {
        titulo: 'Qué hacer esos días',
        lista: [
          'Medí más seguido de lo habitual: cada tres o cuatro horas, también de noche.',
          'Tomá líquido de forma constante, en sorbos chicos y frecuentes.',
          'Si no podés comer sólido, reemplazá los carbohidratos por líquidos con azúcar (caldo, gelatina, jugo).',
          'Medite cetonas si tu glucosa pasa 250 mg/dL o si tenés vómitos, aunque el valor no sea alto.',
        ],
      },
      {
        titulo: 'Cetonas: qué son y por qué importan',
        parrafos: [
          'Cuando falta insulina, el cuerpo quema grasa para obtener energía y produce cetonas. Acumuladas, acidifican la sangre: eso es la cetoacidosis, y es una urgencia.',
          'Tener tiras de cetonas en casa y saber que no vencieron es parte del plan.',
        ],
      },
      {
        titulo: 'Cuándo llamar sin esperar',
        urgente: true,
        lista: [
          'Vómitos que no paran y no te dejan retener líquido.',
          'Cetonas moderadas o altas.',
          'Respiración agitada o aliento con olor dulce.',
          'Dolor abdominal fuerte.',
          'Confusión o mucha somnolencia.',
        ],
      },
    ],
  },

  {
    slug: 'burnout-de-la-diabetes',
    titulo: 'Burnout de la diabetes',
    resumen: 'Cuando medir se vuelve una carga.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['cansancio', 'agotamiento', 'hartazgo', 'harto', 'desgaste', 'abandonar', 'desmotivacion', 'bajar los brazos', 'salud mental', 'psicologo'],
    entrada:
      'La diabetes tipo 1 no se toma vacaciones: son decisiones todos los días, varias veces por día, sin pausa y sin aplausos. Que en algún momento eso agote no es una falla de carácter. Tiene nombre y le pasa a la mayoría.',
    secciones: [
      {
        titulo: 'Cómo se ve desde adentro',
        lista: [
          'Dejar de medir, o medir y no mirar el número.',
          'Anotar de memoria al final del día, o directamente no anotar.',
          'Postergar la consulta médica.',
          'Enojo o hartazgo cada vez que aparece el tema.',
          'Sensación de que por más que hagas todo bien, los números hacen lo que quieren.',
        ],
      },
      {
        titulo: 'Bajar el piso en vez de abandonar',
        parrafos: [
          'Lo que suele fallar es la exigencia de hacerlo todo perfecto: cuando no se puede sostener, se abandona entero. Sirve más definir un piso mínimo que puedas cumplir en la peor semana, aunque sea muy poco.',
          'Una sola medición por día sostenida durante meses vale más que siete durante diez días y ninguna después.',
        ],
      },
      {
        titulo: 'El número no es una nota',
        parrafos: [
          'No hay glucemias buenas ni malas, hay datos. Un 240 no dice que fallaste: dice que algo pasó, y el trabajo es averiguar qué.',
          'Sacarle la carga moral al número es, para mucha gente, lo que hace posible volver a medir.',
        ],
      },
      {
        titulo: 'Cuándo buscar ayuda',
        parrafos: [
          'Si esto dura semanas, si aparece angustia, desánimo persistente o te cuesta sostener lo mínimo, es motivo de consulta legítimo. Muchos equipos de diabetes tienen psicólogos que trabajan específicamente con esto, y pedirlo no es una exageración.',
        ],
      },
    ],
  },

  {
    slug: 'ansiedad-antes-de-medir',
    titulo: 'Ansiedad antes de medir',
    resumen: 'Bajar la carga emocional del número.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['miedo', 'angustia', 'nervios', 'pinchazo', 'glucometro', 'evitar medir', 'postergar', 'salud mental', 'psicologo'],
    entrada:
      'Hay gente que posterga la medición porque le tiene miedo al resultado. Suena raro dicho así, pero es frecuente: el número se vive como una calificación, y nadie quiere rendir examen seis veces por día.',
    secciones: [
      {
        titulo: 'Por qué pasa',
        parrafos: [
          'Durante años el entorno le pone adjetivos a los valores: "te portaste bien", "te fue mal", "estás alto otra vez". El resultado es que el glucómetro deja de ser un instrumento y pasa a ser un juez.',
          'A eso se suma que un valor fuera de rango muchas veces no tiene una causa evidente, y no encontrarla se siente como culpa.',
        ],
      },
      {
        titulo: 'Qué ayuda',
        lista: [
          'Cambiar la pregunta: en vez de "¿me fue bien?", preguntate "¿qué me dice esto y qué hago ahora?".',
          'Medir a propósito en el momento que más evitás. Casi siempre el número es menos terrible que la espera.',
          'Respirar antes y después. Treinta segundos alcanzan para que la medición deje de ser un sobresalto.',
          'Separar el momento de medir del momento de analizar. Primero anotás, después mirás el conjunto.',
        ],
      },
      {
        titulo: 'Anotá lo que salió, no lo que te gustaría',
        parrafos: [
          'Un registro maquillado le sirve menos a tu equipo que uno incompleto, porque los ajustes se hacen sobre esos números. Los valores altos son justamente los que dan la información útil.',
        ],
      },
      {
        titulo: 'Cuándo consultar',
        parrafos: [
          'Si la ansiedad te lleva a saltear mediciones, a evitar las consultas o aparece antes de cada control, contalo. Es un problema tratable y bastante común.',
        ],
      },
    ],
  },

  {
    slug: 'dormir-mejor',
    titulo: 'Dormir mejor',
    resumen: 'Rutinas de noche cuando la glucosa no colabora.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['sueño', 'noche', 'nocturna', 'insomnio', 'pesadillas', 'madrugada', 'descanso', 'despertar', 'siesta'],
    entrada:
      'La noche es el único tramo largo del día en el que nadie está mirando. Por eso una rutina corta antes de dormir rinde más que cualquier otra cosa que hagas con la glucosa.',
    secciones: [
      {
        titulo: 'La medición de antes de dormir',
        parrafos: [
          'Es la que más veces evita un problema. Si estás bajo, no te acuestes sin comer algo: el sueño no te va a avisar.',
          'Si entrenaste esa tarde, esa medición es todavía más importante, porque el efecto del ejercicio sigue activo varias horas.',
        ],
      },
      {
        titulo: 'Señales de una hipoglucemia nocturna',
        lista: [
          'Despertarte transpirado o con la ropa húmeda.',
          'Pesadillas o sueño muy agitado.',
          'Dolor de cabeza al levantarte.',
          'Amanecer con la sensación de no haber descansado nada.',
        ],
      },
      {
        titulo: 'El fenómeno del alba',
        parrafos: [
          'De madrugada el cuerpo libera hormonas que preparan el despertar, y eso sube la glucosa entre las 4 y las 8 de la mañana. No es algo que hayas comido: es fisiología.',
          'Si te pasa seguido, anotá varias mañanas seguidas en ayunas y llevá esos datos a la consulta. Es información que sirve.',
        ],
      },
      {
        titulo: 'Lo aburrido también cuenta',
        parrafos: [
          'Dormir poco aumenta la resistencia a la insulina del día siguiente, así que una mala noche se paga con números más altos al otro día.',
          'Horario parecido todos los días, menos pantalla en la última hora y nada de cafeína a la tarde. No es glamoroso, pero es lo que funciona.',
        ],
      },
    ],
  },

  {
    slug: 'conteo-de-carbohidratos',
    titulo: 'Conteo de carbohidratos',
    resumen: 'Estimar porciones sin pesar cada plato.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['carbos', 'hidratos', 'raciones', 'porciones', 'gramos', 'etiquetas', 'contar', 'comida', 'plato', 'balanza', 'indice glucemico'],
    entrada:
      'Contar carbohidratos es la herramienta que más cambia el control del día a día. La buena noticia es que después de un tiempo se hace de ojo, y bastante bien.',
    secciones: [
      {
        titulo: 'Qué se cuenta',
        parrafos: [
          'Se cuentan los carbohidratos: pan, arroz, fideos, papa, choclo, frutas, azúcar, leche y yogur. La carne, el huevo, el queso duro, el aceite y la mayoría de las verduras de hoja no aportan una cantidad que mueva la aguja.',
          'La proteína y la grasa no se cuentan, pero sí cambian la velocidad: una comida grasosa entra más lento y estira el pico durante horas.',
        ],
      },
      {
        titulo: 'Equivalencias para tener en la cabeza',
        lista: [
          'Una rebanada de pan de molde: unos 15 g.',
          'Una fruta mediana: unos 15 g.',
          'Un vaso de leche (200 ml): unos 12 g.',
          'Una taza de arroz o fideos cocidos: unos 45 g.',
          'Una papa mediana: unos 30 g.',
        ],
      },
      {
        titulo: 'Leer una etiqueta sin trampa',
        parrafos: [
          'Buscá "hidratos de carbono" y, sobre todo, mirá a qué porción corresponde ese número. Muchos envases declaran por 30 gramos de producto cuando nadie come 30 gramos.',
          'El renglón de azúcares está incluido dentro del total: no se suma aparte.',
        ],
      },
      {
        titulo: 'Cómo se calibra el ojo',
        parrafos: [
          'Pesá durante dos o tres semanas lo que comés habitualmente, mirando el plato antes de pesarlo y anotando cuánto creías que era. Después de un mes la estimación pasa a ser razonablemente buena y podés guardar la balanza para las comidas nuevas.',
        ],
      },
      {
        titulo: 'La cuenta que no hacemos acá',
        parrafos: [
          'La relación entre carbohidratos e insulina la define tu equipo de salud, y es personal: cambia entre personas y hasta entre momentos del día de la misma persona. Diabex te ayuda a contar los carbohidratos, no a convertirlos en unidades.',
        ],
      },
    ],
  },

  {
    slug: 'factor-de-correccion',
    titulo: 'Factor de corrección',
    resumen: 'Cuánto baja tu glucosa cada unidad de insulina.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['sensibilidad', 'corregir', 'correccion', 'bolo', 'insulina activa', 'apilar', 'stacking', 'ratio', 'unidades'],
    entrada:
      'El factor de corrección, o factor de sensibilidad, es cuántos mg/dL te baja la glucosa una unidad de insulina rápida. Esta guía explica el concepto para que entiendas lo que tu equipo te indicó. No es una calculadora.',
    secciones: [
      {
        titulo: 'Diabex no calcula tu corrección',
        urgente: true,
        parrafos: [
          'No vas a encontrar acá un campo donde ponés tu glucosa y sale un número de unidades, ni ahora ni más adelante. Una dosis de insulina es una indicación médica, y equivocarse tiene consecuencias graves e inmediatas.',
          'Tu factor lo define tu equipo de salud y lo revisa con tus datos. Lo que sigue es para entenderlo, no para reemplazarlo.',
        ],
      },
      {
        titulo: 'Qué significa el número',
        parrafos: [
          'Si tu equipo te dijo que tu factor es 50, quiere decir que una unidad de insulina rápida te baja la glucosa alrededor de 50 mg/dL. Un factor más alto significa que sos más sensible a la insulina.',
          'Es un promedio, no una ley: el mismo factor puede comportarse distinto en distintos momentos.',
        ],
      },
      {
        titulo: 'Por qué cambia',
        lista: [
          'La hora del día: mucha gente es más resistente a la mañana.',
          'El ejercicio reciente, que aumenta la sensibilidad durante horas.',
          'Una infección o un cuadro de estrés, que la reducen.',
          'Cambios de peso.',
          'El momento del ciclo menstrual.',
        ],
      },
      {
        titulo: 'Insulina activa: el error más común',
        parrafos: [
          'La insulina rápida sigue trabajando entre tres y cinco horas después de aplicada. Si corregís un valor alto y a la hora volvés a corregir porque todavía no bajó, las dos dosis se superponen.',
          'Esa superposición es la causa más frecuente de hipoglucemia evitable. Antes de corregir encima de una corrección, mirá cuánto hace que aplicaste la anterior.',
        ],
      },
      {
        titulo: 'Lo que sí podés hacer vos',
        parrafos: [
          'Registrar. Un factor se ajusta mirando qué pasó después de cada corrección, y eso sólo se puede hacer si los datos están anotados con su hora y su contexto. Llevá tu registro a la consulta.',
        ],
      },
    ],
  },

  {
    slug: 'control-anual',
    titulo: 'Control anual',
    resumen: 'Los estudios que van una vez al año, en una lista.',
    // Lo que alguien escribiría en el buscador y no está en el texto.
    claves: ['estudios', 'analisis', 'laboratorio', 'hba1c', 'hemoglobina glicosilada', 'glicosilada', 'fondo de ojo', 'retinopatia', 'riñon', 'tiroides', 'celiaquia', 'turnos', 'chequeo', 'vacunas'],
    entrada:
      'Casi todo lo que se controla una vez al año no da síntomas mientras todavía es fácil de tratar. Por eso se busca antes de que moleste. Esta es la lista para tener a mano cuando pidas los turnos.',
    secciones: [
      {
        titulo: 'Varias veces al año',
        lista: [
          'Hemoglobina glicosilada (HbA1c): cada tres a seis meses.',
          'Presión arterial: en cada consulta.',
          'Revisión de los sitios de inyección: en cada consulta.',
        ],
      },
      {
        titulo: 'Una vez al año',
        lista: [
          'Fondo de ojo con pupila dilatada.',
          'Función renal: creatinina en sangre y albuminuria en orina.',
          'Perfil lipídico.',
          'Función tiroidea (TSH), que en tipo 1 se altera más seguido que en la población general.',
          'Examen de los pies, con evaluación de la sensibilidad.',
          'Control odontológico.',
          'Vacunación antigripal.',
        ],
      },
      {
        titulo: 'Según tu caso',
        parrafos: [
          'La pesquisa de celiaquía, la evaluación de la vitamina B12 y algunos estudios cardiológicos dependen de tu historia. Preguntá cuáles te corresponden a vos en vez de asumir que la lista es igual para todos.',
        ],
      },
      {
        titulo: 'Un truco que funciona',
        parrafos: [
          'Elegí un mes del año y hacé todo ahí, siempre el mismo. Atarlo a una fecha que ya te acordás (tu cumpleaños, el inicio de clases) evita el año en que se pasó sin que nadie lo note.',
        ],
      },
    ],
  },
]

/**
 * Los grupos del índice. Referencian slugs en vez de repetir títulos: el
 * contenido de una guía vive en un solo lugar.
 */
export const GRUPOS = [
  {
    titulo: 'Para entender',
    bajada: 'Lo que conviene tener claro antes de que pase.',
    slugs: ['hipoglucemia', 'ejercicio-y-glucosa', 'alcohol', 'dias-de-enfermedad'],
  },
  {
    titulo: 'Para sentirte mejor',
    bajada: 'Convivir con la diabetes también cansa.',
    slugs: ['burnout-de-la-diabetes', 'ansiedad-antes-de-medir', 'dormir-mejor'],
  },
  {
    titulo: 'Herramientas',
    bajada: 'Cuentas que se hacen todos los días.',
    slugs: ['conteo-de-carbohidratos', 'factor-de-correccion', 'control-anual'],
  },
]

const POR_SLUG = new Map(GUIAS.map((guia) => [guia.slug, guia]))

export function guiaPorSlug(slug) {
  return POR_SLUG.get(slug) ?? null
}

/**
 * Sin acentos y en minúsculas.
 *
 * Nadie escribe "días de enfermedad" con tilde en un buscador, y quien busca
 * "correccion" tiene que encontrar "corrección". Es la diferencia entre un
 * buscador que sirve y uno que obliga a adivinar cómo se escribió el título.
 */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * El texto de una guía separado en tres campos, porque no todos valen igual.
 *
 * Buscar en el cuerpo entero es lo que hace que "cetonas" encuentre la guía de
 * días de enfermedad aunque la palabra no esté en el título. Pero si todo pesa
 * lo mismo, esa misma búsqueda devuelve primero la de ejercicio, que las
 * menciona al pasar. El peso es lo que ordena.
 */
const PESOS = { nombre: 3, temas: 2, cuerpo: 1 }

function camposDe(guia) {
  const secciones = guia.secciones.flatMap((seccion) => [
    seccion.titulo,
    ...(seccion.parrafos ?? []),
    ...(seccion.lista ?? []),
  ])

  return {
    nombre: normalizar(guia.titulo),
    temas: normalizar([guia.resumen, ...(guia.claves ?? [])].join(' ')),
    cuerpo: normalizar([guia.entrada, ...secciones].join(' ')),
  }
}

// El índice se arma una sola vez, al importar el módulo. Son diez guías: no
// hace falta nada más elaborado que esto, y cada tecleada sale gratis.
const INDICE = new Map(GUIAS.map((guia) => [guia.slug, camposDe(guia)]))

/** Cuánto pesa un término en una guía, o 0 si no aparece en ningún campo. */
function puntajeDe(campos, termino) {
  if (campos.nombre.includes(termino)) return PESOS.nombre
  if (campos.temas.includes(termino)) return PESOS.temas
  if (campos.cuerpo.includes(termino)) return PESOS.cuerpo
  return 0
}

/**
 * Las guías que coinciden con la consulta, de la más pertinente a la que menos.
 *
 * Con varias palabras se piden todas ("alcohol noche" trae sólo lo que menciona
 * las dos): es lo que espera cualquiera que agrega una palabra para achicar el
 * resultado, y no al revés.
 *
 * Una consulta vacía devuelve todas, así la pantalla no necesita un caso
 * especial para decidir qué mostrar.
 */
export function buscarGuias(consulta) {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (!terminos.length) return GUIAS

  return GUIAS.map((guia, orden) => {
    const campos = INDICE.get(guia.slug)
    const puntajes = terminos.map((termino) => puntajeDe(campos, termino))

    return {
      guia,
      orden,
      // Falta alguno de los términos: la guía no entra.
      puntaje: puntajes.includes(0) ? 0 : puntajes.reduce((a, b) => a + b, 0),
    }
  })
    .filter((fila) => fila.puntaje > 0)
    // A igual puntaje manda el orden del índice, para que el resultado no
    // cambie de lugar entre una búsqueda y otra.
    .sort((a, b) => b.puntaje - a.puntaje || a.orden - b.orden)
    .map((fila) => fila.guia)
}
