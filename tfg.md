# Guía del trabajo de grado — Diabex

Guía para escribir el libro del trabajo de grado a partir de este proyecto.
No es el libro: es la estructura, qué va en cada parte y el material real de
Diabex para llenarla.

**Cómo leer este archivo.** Hay dos registros distintos y conviene no
mezclarlos:

- El texto normal te habla a vos: qué poner, qué evitar, qué tenés que decidir.
- Los bloques marcados con **`» Para el libro:`** están redactados en registro
  académico y se pueden copiar casi tal cual, ajustando lo que corresponda.

**Antes de escribir una línea**, conseguí el reglamento de tu institución. La
estructura de abajo es la habitual en trabajos de grado en español, pero cada
colegio tiene su formato de carátula, su sistema de citas y su extensión
mínima. Si el reglamento dice otra cosa que esta guía, manda el reglamento.

---

## 0. Decisiones que tenés que tomar primero

| Decisión | Por qué importa | Sugerencia |
| --- | --- | --- |
| Sistema de citas | Cambia cómo escribís cada referencia | APA 7ª edición, que es el más usado |
| Extensión | Define cuánto desarrollar cada capítulo | Preguntá el mínimo y apuntá 20 % arriba |
| Individual o grupal | Cambia la redacción (primera persona plural) | — |
| Tipo de investigación | Define el Capítulo III | Proyecto factible / investigación aplicada |

Sobre la persona gramatical: el trabajo se escribe **en impersonal o en plural**
("se desarrolló", "se implementó", "en el presente trabajo se propone"), nunca
en primera persona del singular. Y en **pasado** para lo que hiciste, en
**presente** para lo que el sistema hace.

---

## Estructura completa

```
PRELIMINARES
  Carátula
  Dedicatoria                        (opcional)
  Agradecimientos                    (opcional)
  Índice general
  Índice de tablas y figuras
  Resumen
CAPÍTULO I — EL PROBLEMA
  1.1 Planteamiento del problema
  1.2 Formulación del problema
  1.3 Objetivos
  1.4 Justificación
  1.5 Alcance y limitaciones
CAPÍTULO II — MARCO TEÓRICO
  2.1 Antecedentes
  2.2 Bases teóricas
  2.3 Bases legales
  2.4 Definición de términos básicos
CAPÍTULO III — MARCO METODOLÓGICO
  3.1 Tipo y diseño de investigación
  3.2 Metodología de desarrollo
  3.3 Herramientas y tecnologías
  3.4 Técnicas de recolección de información
CAPÍTULO IV — DESARROLLO DE LA PROPUESTA
  4.1 Análisis de requerimientos
  4.2 Diseño del sistema
  4.3 Implementación
  4.4 Pruebas
CAPÍTULO V — RESULTADOS Y CONCLUSIONES
  5.1 Resultados obtenidos
  5.2 Conclusiones
  5.3 Recomendaciones y trabajo futuro
REFERENCIAS BIBLIOGRÁFICAS
ANEXOS
```

Extensión orientativa para un trabajo de grado de nivel medio técnico:

| Parte | Páginas |
| --- | --- |
| Preliminares | 5-7 |
| Capítulo I | 6-8 |
| Capítulo II | 15-20 |
| Capítulo III | 6-8 |
| Capítulo IV | 20-30 |
| Capítulo V | 5-7 |
| Referencias | 2-3 |
| Anexos | libre |

El Capítulo IV es el corazón del trabajo: es donde mostrás lo que construiste.
Si te queda más corto que el marco teórico, algo está mal balanceado.

---

## PRELIMINARES

### Resumen

Media página, sin citas, sin siglas sin explicar. Cuatro movimientos: qué
problema hay, qué hiciste, cómo lo hiciste, qué obtuviste. Se escribe **último**,
cuando ya está todo lo demás.

> **» Para el libro:**
>
> La diabetes mellitus tipo 1 exige un autocontrol diario y sostenido que
> incluye la medición frecuente de la glucemia capilar, el conteo de
> carbohidratos y el registro del contexto en que cada medición se realiza. La
> discontinuidad de ese registro priva al equipo de salud de la información que
> necesita para ajustar el tratamiento. El presente trabajo tiene como objetivo
> desarrollar una aplicación web progresiva orientada exclusivamente a personas
> con diabetes tipo 1, que reduzca la fricción del registro diario y ofrezca
> orientación alimentaria y material de apoyo. Se aplicó una metodología de
> desarrollo incremental sobre una arquitectura de aplicación de página única
> construida con React y Vite, con persistencia en PostgreSQL a través de la
> plataforma Supabase y aislamiento de datos por usuario mediante políticas de
> seguridad a nivel de fila. Se implementaron tres módulos funcionales —registro
> de mediciones, plan de alimentación y material de autoayuda—, se integró un
> modelo de lenguaje para la generación del plan diario y se desplegó la
> solución como aplicación instalable con capacidad de funcionamiento sin
> conexión. El sistema resultante clasifica cada medición según las bandas de
> referencia correspondientes al momento del día y registra la recomendación
> mostrada, sin sugerir en ningún caso dosis de insulina ni emitir
> diagnósticos, límites que se establecieron como restricciones de diseño no
> negociables.
>
> **Palabras clave:** diabetes tipo 1, aplicación web progresiva, automonitoreo
> glucémico, React, Supabase, accesibilidad web.

---

## CAPÍTULO I — EL PROBLEMA

### 1.1 Planteamiento del problema

Se escribe de lo general a lo particular, en tres o cuatro movimientos:

1. **Contexto amplio**: qué es la diabetes tipo 1, a cuánta gente afecta.
   Necesitás datos con fuente: Federación Internacional de Diabetes (Atlas de
   la Diabetes), OMS, y si conseguís cifras nacionales, mejor.
2. **El problema concreto**: el autocontrol diario es la carga real. No es la
   enfermedad en abstracto, es medir varias veces por día durante décadas.
3. **Por qué las soluciones actuales no alcanzan**: el registro en papel se
   pierde y se completa de memoria; las apps existentes suelen ser genéricas
   para "diabetes" y saturadas de gráficos.
4. **La consecuencia**: sin registro fiel, el equipo de salud ajusta a ciegas.

Dos cosas que conviene dejar establecidas acá, porque sostienen todo el
trabajo:

> **» Para el libro:**
>
> Cabe destacar que la diabetes tipo 1 y la diabetes tipo 2, aun compartiendo
> denominación, constituyen condiciones de origen y manejo distintos. La primera
> es una enfermedad autoinmune en la que el páncreas deja de producir insulina,
> se manifiesta con frecuencia en la infancia o la adolescencia y requiere
> administración externa de insulina desde el diagnóstico y de por vida. La
> segunda se asocia a una resistencia progresiva a la insulina y admite, en sus
> etapas iniciales, abordajes basados en cambios de hábitos. Las aplicaciones
> que agrupan ambas condiciones bajo una interfaz común tienden a adoptar el
> vocabulario y los objetivos de la segunda, que es la más prevalente, lo cual
> resulta inadecuado para el usuario con diabetes tipo 1.

> **» Para el libro:**
>
> Un segundo aspecto a considerar es la forma en que se almacena el dato
> glucémico. El registro de rangos o categorías —"alto", "150 a 180"— en lugar
> del valor exacto impide el cálculo posterior de promedios, del tiempo en rango
> y de la evolución en el tiempo, información que constituye precisamente el
> insumo de la consulta médica.

### 1.2 Formulación del problema

Una pregunta, en una oración.

> **» Para el libro:**
>
> ¿De qué manera una aplicación web progresiva diseñada específicamente para
> personas con diabetes tipo 1 puede facilitar el registro diario de las
> mediciones de glucosa y ofrecer orientación alimentaria y material de apoyo,
> sin incurrir en la sugerencia de dosis de insulina ni en la emisión de
> diagnósticos?

### 1.3 Objetivos

**Regla:** cada objetivo arranca con un verbo en infinitivo y tiene que ser
verificable. Si no se puede decir "esto se cumplió" o "no se cumplió", está mal
escrito. Nada de "optimizar", "mejorar la calidad de vida" o "concientizar":
no se miden.

Los objetivos específicos, sumados, tienen que dar el general. Ni más ni menos.

> **» Para el libro:**
>
> **Objetivo general**
>
> Desarrollar una aplicación web progresiva para el seguimiento diario de
> personas con diabetes tipo 1, que permita registrar mediciones de glucosa con
> su contexto, obtener orientación alimentaria personalizada y acceder a
> material de apoyo.
>
> **Objetivos específicos**
>
> 1. Identificar las necesidades de registro del autocontrol glucémico y los
>    rangos de referencia aplicables a la diabetes tipo 1.
> 2. Diseñar una interfaz de usuario orientada a dispositivos móviles que
>    cumpla con los criterios de accesibilidad WCAG 2.1 en nivel AA.
> 3. Implementar un mecanismo de autenticación y persistencia de datos que
>    garantice el aislamiento de la información entre usuarios.
> 4. Desarrollar un módulo de registro que clasifique automáticamente cada
>    medición según su valor y el momento del día en que fue tomada.
> 5. Integrar un modelo de lenguaje para la generación de un plan de
>    alimentación diario a partir del perfil del usuario y sus mediciones.
> 6. Desplegar la solución como aplicación instalable con capacidad de
>    funcionamiento sin conexión.
> 7. Verificar que el sistema no sugiera dosis de insulina ni emita
>    diagnósticos en ninguna de sus funcionalidades.

Fijate que los siete son comprobables: se abre la app y se verifica. El
séptimo, además, se puede demostrar con código, que es lo más fuerte que podés
mostrar en una defensa.

### 1.4 Justificación

Tres planos, un párrafo cada uno:

- **Social**: a quién le sirve y por qué. Adolescentes y adultos jóvenes con
  DM1, que son usuarios expertos en su condición y a la vez los que más
  abandonan el registro.
- **Técnico**: por qué esta solución y no otra. Una PWA no requiere pasar por
  una tienda de aplicaciones, se instala desde el navegador, funciona sin
  conexión y se actualiza sin que el usuario haga nada.
- **Académico/personal**: qué integra el trabajo de lo aprendido en el BTI
  (programación, bases de datos, diseño de interfaces, seguridad).

### 1.5 Alcance y limitaciones

Acá se gana credibilidad. Un trabajo que declara con precisión lo que **no**
hace se defiende mejor que uno que promete de más.

> **» Para el libro:**
>
> **Alcance.** El sistema desarrollado comprende el registro manual de
> mediciones de glucemia capilar con su contexto, su clasificación según bandas
> de referencia, la consulta del historial por fecha, la generación diaria de un
> plan de alimentación orientativo y el acceso a un conjunto de guías de apoyo.
> Está destinado exclusivamente a personas con diabetes tipo 1.
>
> **Limitaciones.** El sistema no realiza lectura automática desde glucómetros
> ni desde sistemas de monitoreo continuo: la carga es manual. No sugiere dosis
> de insulina ni realiza cálculos de corrección, por decisión de diseño
> fundamentada en el apartado 4.3.5. No emite diagnósticos ni reemplaza la
> consulta médica. El contenido clínico incorporado sigue pautas de manejo de
> uso habitual, pero no fue sometido a validación por un equipo de salud, por lo
> que el sistema debe considerarse un prototipo funcional y no un producto apto
> para uso clínico. Finalmente, no se realizaron pruebas con usuarios reales
> con diabetes tipo 1, lo que constituye la principal limitación metodológica
> del trabajo.

**Ojo con esto.** Esa última limitación es real y no conviene esconderla: si un
miembro del tribunal pregunta "¿lo probaste con pacientes?" y ya está escrito
que no, quedás parado; si no está escrito, parece que lo ocultaste.

---

## CAPÍTULO II — MARCO TEÓRICO

El error más común acá es copiar una enciclopedia de diabetes. **Regla:** si un
concepto no se usa después en el Capítulo IV, no va. Todo lo que expliques tiene
que volver a aparecer.

### 2.1 Antecedentes

Tres a cinco trabajos o sistemas previos. Para cada uno: qué es, qué hace, y
—lo importante— **en qué se diferencia del tuyo**.

Candidatos: mySugr, Glucose Buddy, Diabetes:M, y alguna app de la región. Para
cada una, el mismo análisis: son genéricas para diabetes, o ponen el tablero de
métricas como pantalla de inicio, o sí calculan bolos de insulina (y ahí entra
la diferencia de tu enfoque). Buscá también trabajos de grado similares en
repositorios universitarios; citar uno o dos suma.

Cerrá el apartado con un párrafo que diga qué hueco deja ese conjunto y cómo
tu trabajo lo aborda.

### 2.2 Bases teóricas

Estructurá en dos bloques: el dominio y la tecnología.

**A. El dominio: diabetes tipo 1**

| Tema | Qué desarrollar | Dónde se usa después |
| --- | --- | --- |
| Definición y fisiopatología | Autoinmune, destrucción de células beta, insulinodependencia | Cap. I, Cap. IV |
| Diferencia con tipo 2 | Origen, edad, tratamiento | Justifica la decisión de producto |
| Automonitoreo glucémico | Qué es, con qué frecuencia, unidades (mg/dL) | Módulo de registro |
| Rangos objetivo | 80-130 mg/dL preprandial, 70-180 mg/dL posprandial (1-2 h) | `lib/glucosa.js` |
| Tiempo en rango y HbA1c | Qué miden, por qué el valor exacto importa | Justifica el modelo de datos |
| Hipoglucemia | Definición (< 70 mg/dL), síntomas, regla del 15 | Recomendaciones y guías |
| Hiperglucemia y cetoacidosis | Riesgo, cetonas | Recomendaciones |
| Conteo de carbohidratos | Qué es, para qué sirve | Guías de autoayuda |

Fuentes para citar: American Diabetes Association (*Standards of Care in
Diabetes*, edición del año que uses), Federación Internacional de Diabetes,
OMS, y guías del ministerio de salud de tu país si existen. **Citá la edición
del año**: las recomendaciones se actualizan.

**B. La tecnología**

| Tema | Qué desarrollar |
| --- | --- |
| Aplicación web vs. nativa vs. híbrida | Cuadro comparativo, justifica elegir web |
| Aplicación web progresiva (PWA) | Definición, criterios de instalabilidad, manifiesto, *service worker* |
| *Service worker* y estrategias de caché | Ciclo de vida, precarga, *cache-first* vs. *network-first* |
| Aplicación de página única (SPA) | Enrutado del lado del cliente |
| React y el modelo de componentes | Componente, estado, propiedades, *hooks* |
| *Backend as a Service* (BaaS) | Definición, ventajas y dependencia del proveedor |
| PostgreSQL y RLS | Modelo relacional, políticas a nivel de fila |
| Autenticación con JWT y OAuth 2.0 | Flujo, token, expiración |
| Modelos de lenguaje | Qué son, *prompt*, salida estructurada, alucinación |
| Accesibilidad web | WCAG 2.1, contraste, áreas táctiles, navegación por teclado |
| Diseño *mobile first* | Definición y diferencia con "diseño adaptable" |

El tema de **alucinación en modelos de lenguaje** desarrollalo bien: es lo que
justifica el mecanismo de verificación del Capítulo IV, y es uno de los puntos
más interesantes que tenés para defender.

### 2.3 Bases legales

**Atención, esto verificalo vos.** No cites ninguna norma sin haber visto el
texto vigente: la numeración cambia y una cita legal equivocada es de lo peor
que puede aparecer en un tribunal. Buscá en el portal oficial de legislación de
tu país y confirmá número, año y que siga vigente.

Lo que tenés que buscar, por categoría:

1. **Protección de datos personales**, con foco en datos sensibles. Los datos
   de salud casi siempre están en una categoría especial con requisitos más
   estrictos. En Argentina la referencia es la Ley 25.326; en Paraguay revisá
   la ley general de protección de datos personales vigente y el artículo de
   la Constitución Nacional sobre *habeas data*.
2. **Historia clínica y confidencialidad**: si aplica a un sistema que no es
   del ámbito sanitario formal.
3. **Software como producto médico**: acá está lo interesante. Un software que
   calcula una dosis suele entrar en la categoría de producto médico y quedar
   sujeto a registro ante la autoridad sanitaria. Buscá el marco de tu país y,
   como referencia internacional, el documento de la IMDRF sobre *Software as a
   Medical Device*.
4. **Derechos de autor** del software y licencias de las bibliotecas usadas
   (React, MIT; Tailwind, MIT; etcétera).

El punto 3 es el que convierte una restricción de diseño en un argumento
legal, y vale la pena desarrollarlo:

> **» Para el libro:**
>
> La decisión de excluir toda sugerencia de dosificación no responde
> únicamente a un criterio de prudencia clínica, sino que delimita la
> naturaleza regulatoria del sistema. Los marcos normativos vigentes en materia
> de productos médicos tienden a incluir dentro de su alcance al software
> destinado a calcular o recomendar dosis de medicación, lo que implicaría
> requisitos de registro, validación y vigilancia que exceden el marco de un
> trabajo de grado. Al restringirse a mostrar el valor registrado, la banda en
> que se ubica y pautas generales de manejo, el sistema se mantiene fuera de esa
> categoría.

### 2.4 Definición de términos básicos

Glosario en orden alfabético. Sólo términos que efectivamente usás.

Mínimo: **cetoacidosis**, **cetonas**, **glucemia capilar**, **HbA1c**,
**hiperglucemia**, **hipoglucemia**, **insulina basal**, **insulina bolo**,
**mg/dL**, **posprandial**, **preprandial**, **tiempo en rango**, **API**,
**endpoint**, **JWT**, **manifiesto web**, **PWA**, **RLS**, **service
worker**, **SPA**, **token**, **WCAG**.

---

## CAPÍTULO III — MARCO METODOLÓGICO

### 3.1 Tipo y diseño de investigación

> **» Para el libro:**
>
> El presente trabajo se enmarca en la modalidad de proyecto factible, en tanto
> consiste en la elaboración de una propuesta viable orientada a resolver un
> problema concreto. Por su finalidad se clasifica como investigación aplicada,
> dado que se orienta a la utilización de conocimientos existentes para la
> resolución de una necesidad práctica. Según su diseño, corresponde a una
> investigación no experimental de campo, con apoyo documental para la
> construcción del marco teórico y de los criterios clínicos incorporados al
> sistema.

Ajustá la terminología a la que usa tu institución: algunas hablan de
"investigación tecnológica" o "desarrollo experimental".

### 3.2 Metodología de desarrollo

Se aplicó un enfoque **incremental e iterativo**. No lo digas en abstracto:
mostrá los incrementos reales, que es lo que hace creíble el apartado.

| Incremento | Qué se incorporó |
| --- | --- |
| 1 | Estructura del proyecto, sistema de diseño y autenticación |
| 2 | Perfil del paciente y persistencia con RLS |
| 3 | Módulo de registro: cuestionario, clasificación e historial |
| 4 | Módulo de alimentación con generación asistida por modelo de lenguaje |
| 5 | Módulo de autoayuda con buscador |
| 6 | Conversión a aplicación web progresiva y despliegue |

Cada incremento terminó con una versión ejecutable. Eso es lo que distingue un
proceso iterativo de uno en cascada, y conviene decirlo explícitamente.

### 3.3 Herramientas y tecnologías

Tabla con **versión y justificación**. La justificación es lo que se evalúa;
la lista sola no dice nada.

| Herramienta | Versión | Función | Por qué |
| --- | --- | --- | --- |
| React | 18.3 | Biblioteca de interfaz | Modelo de componentes, ecosistema maduro |
| Vite | 8.3 | Empaquetador y servidor de desarrollo | Arranque rápido, soporte nativo de PWA |
| Tailwind CSS | 4.3 | Estilos por utilidades | Consistencia mediante fichas de diseño |
| React Router | 6.30 | Enrutado del lado del cliente | Estándar de facto para SPA |
| Supabase | — | Autenticación y base de datos | PostgreSQL gestionado con RLS incorporada |
| PostgreSQL | 15 | Motor de base de datos | Relacional, con seguridad a nivel de fila |
| vite-plugin-pwa | 1.3 | Generación del *service worker* | Integra Workbox con el empaquetador |
| Deno | — | Entorno de las funciones de borde | Requerido por Supabase Edge Functions |
| OpenAI API | gpt-4o-mini | Generación del plan alimentario | Costo bajo y salida estructurada |
| Netlify | — | Alojamiento y despliegue | Despliegue continuo, HTTPS automático |
| oxlint | 1.81 | Análisis estático | Detección temprana de errores |
| Git | — | Control de versiones | — |

Verificá las versiones contra `package.json` antes de entregar.

### 3.4 Técnicas de recolección de información

Sé honesto acá. Lo que efectivamente usaste:

- **Revisión documental**: guías clínicas para los rangos y las pautas de
  manejo; documentación técnica oficial para las decisiones de implementación.
- **Análisis de aplicaciones existentes**: revisión de soluciones comparables
  para identificar patrones a adoptar y a evitar.
- **Observación del propio proceso de desarrollo**: registro de decisiones de
  diseño y su fundamento.

Si hiciste una encuesta o entrevistaste a alguien con DM1 o a un profesional,
ponelo acá y el instrumento en anexos: sube mucho el nivel del trabajo. Si no
lo hiciste, no lo inventes.

---

## CAPÍTULO IV — DESARROLLO DE LA PROPUESTA

El capítulo más importante. Va con muchas figuras: diagramas, capturas,
fragmentos de código. **Toda figura y toda tabla llevan número y epígrafe, y
se mencionan en el texto** ("como se observa en la Figura 12").

### 4.1 Análisis de requerimientos

**Requerimientos funcionales.** Numerados, verificables, redactados como "El
sistema debe…".

| Código | Requerimiento |
| --- | --- |
| RF-01 | El sistema debe permitir crear una cuenta con correo y contraseña |
| RF-02 | El sistema debe permitir el ingreso mediante cuenta de Google |
| RF-03 | El sistema debe mantener la sesión iniciada entre visitas |
| RF-04 | El sistema debe permitir registrar el perfil: nombre, fecha de nacimiento, peso y altura |
| RF-05 | El sistema debe solicitar el contexto de la medición antes del valor |
| RF-06 | El sistema debe almacenar el valor exacto de glucosa en mg/dL |
| RF-07 | El sistema debe clasificar la medición según su valor y el momento del día |
| RF-08 | El sistema debe mostrar una recomendación acorde a la clasificación |
| RF-09 | El sistema debe almacenar la recomendación mostrada junto con la medición |
| RF-10 | El sistema debe mostrar las mediciones del día en curso |
| RF-11 | El sistema debe permitir consultar las mediciones de cualquier fecha |
| RF-12 | El sistema debe permitir eliminar una medición cargada erróneamente |
| RF-13 | El sistema no debe permitir editar una medición existente |
| RF-14 | El sistema debe generar un plan de alimentación diario |
| RF-15 | El sistema debe generar dicho plan una sola vez por día y por usuario |
| RF-16 | El sistema debe ofrecer guías de apoyo consultables |
| RF-17 | El sistema debe permitir buscar guías por título o por tema |
| RF-18 | El sistema debe poder instalarse en el dispositivo |

**Requerimientos no funcionales.**

| Código | Requerimiento |
| --- | --- |
| RNF-01 | La interfaz debe diseñarse primero para pantallas de 390 px de ancho |
| RNF-02 | Las áreas táctiles deben medir al menos 44 píxeles |
| RNF-03 | El contraste debe alcanzar 4,5:1 en texto normal y 3:1 en texto grande |
| RNF-04 | Ningún estado debe comunicarse únicamente mediante color |
| RNF-05 | Un usuario no debe poder acceder a datos de otro usuario |
| RNF-06 | La clave secreta del proveedor no debe residir en el cliente |
| RNF-07 | El sistema debe permitir la consulta del material de apoyo sin conexión |
| RNF-08 | El sistema no debe sugerir dosis de insulina en ninguna circunstancia |
| RNF-09 | El sistema no debe emitir diagnósticos |
| RNF-10 | Toda animación debe tener alternativa bajo `prefers-reduced-motion` |

Fijate que RF-13 está redactado en negativo a propósito, y que conviene
justificarlo en el texto: una medición es un hecho con su fecha, no un campo
que se corrige; si el valor está mal, se borra y se carga de nuevo.

### 4.2 Diseño del sistema

**4.2.1 Arquitectura general.** Diagrama de tres capas:

```
┌──────────────────────────────────────────────┐
│  CLIENTE (navegador)                         │
│  React SPA + Service Worker + Caché          │
└───────────────┬──────────────────────────────┘
                │ HTTPS
┌───────────────┴──────────────────────────────┐
│  SUPABASE                                     │
│  ┌─────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Auth   │  │ PostgreSQL │  │Edge        │ │
│  │  (JWT)  │  │  + RLS     │  │Function    │ │
│  └─────────┘  └────────────┘  └─────┬──────┘ │
└──────────────────────────────────────┼───────┘
                                       │
                               ┌───────┴───────┐
                               │  OpenAI API   │
                               └───────────────┘
```

Explicá por qué el cliente nunca habla directo con OpenAI: la clave de la API
quedaría expuesta en el navegador. La función de borde actúa de intermediario
y es el único lugar donde esa clave existe.

**4.2.2 Modelo de datos.** Diagrama entidad-relación con las tres tablas, y
después el diccionario de datos campo por campo (nombre, tipo, restricción,
descripción).

| Tabla | Filas por usuario | Contenido |
| --- | --- | --- |
| `perfiles` | 1 | Nombre, fecha de nacimiento, peso, altura |
| `mediciones` | N | Valor, contexto, clasificación y recomendación mostrada |
| `planes_alimentacion` | 1 por día | Plan generado, modelo usado, fecha de generación |

Desarrollá las restricciones (`CHECK`) como decisiones de diseño, no como
detalle técnico: la que obliga a que una medición en ayunas no tenga relación
con la comida expresa una regla del dominio dentro de la base de datos.

**4.2.3 Diseño de la interfaz.** Acá van:

- El sistema de fichas de diseño: paleta, tipografía (una sola familia,
  escala de tres escalones), curva de animación única.
- La decisión de tres pestañas, con Registro en el centro por ser la acción
  diaria y quedar al alcance del pulgar.
- El "riel del día" como elemento propio: por qué una secuencia con horas
  representa mejor la vivencia de la DM1 que una grilla de tarjetas.
- Las decisiones de accesibilidad, con el fundamento de cada una.

Un ejemplo que se defiende muy bien en el tribunal:

> **» Para el libro:**
>
> En el calendario del historial, el día seleccionado se señala mediante un
> anillo perimetral y no mediante un relleno de color. La razón es funcional:
> cada celda muestra puntos que indican las mediciones registradas y su banda,
> y el punto correspondiente a "en objetivo" comparte el azul institucional. Un
> relleno azul sólido haría desaparecer justamente la información que la celda
> debe comunicar.

**4.2.4 Diseño de la navegación.** Diagrama de las doce rutas y sus guardas
(públicas, protegidas, sin guarda).

### 4.3 Implementación

**4.3.1 Estructura del proyecto.** El árbol de directorios con la regla de
organización: un módulo por pestaña en `features/`, y un componente sube a
`components/` sólo cuando lo usa más de un módulo.

**4.3.2 Clasificación de la glucemia.** El núcleo lógico del sistema.
Implementado como funciones puras, sin interfaz, en un módulo separado.

> **» Para el libro:**
>
> La clasificación se implementó como un conjunto de funciones puras, es decir,
> funciones cuyo resultado depende únicamente de sus argumentos y que no
> producen efectos sobre el estado de la aplicación. Esta decisión permite
> modificar los criterios clínicos sin alterar ninguna pantalla y facilita la
> verificación del comportamiento del sistema.
>
> El aspecto determinante de la clasificación es que el rango objetivo depende
> del momento en que se realiza la medición: entre 80 y 130 mg/dL antes de
> comer o en ayunas, y entre 70 y 180 mg/dL entre una y dos horas después de una
> comida. En consecuencia, un valor de 160 mg/dL se encuentra por encima del
> objetivo si fue tomado antes de comer, y dentro del objetivo si fue tomado
> una hora después. Por esta razón el cuestionario solicita el contexto antes
> del valor: sin ese dato, la clasificación sería imposible.

Incluí el código de `clasificar()` como figura. Es corto y se lee solo.

**4.3.3 El cuestionario de carga.** Explicá el flujo por pasos y la
ramificación: en ayunas no hay comida de referencia, así que se omiten dos
preguntas y el recorrido pasa de cinco pasos a tres.

**4.3.4 Manejo de fechas y zona horaria.** Este apartado te distingue. Es un
error sutil, real, y la solución se explica en dos párrafos:

> **» Para el libro:**
>
> La agrupación de mediciones por día presentó una dificultad no evidente. La
> conversión de una fecha a formato ISO produce su representación en tiempo
> universal coordinado (UTC). Dado que la zona horaria local corresponde a
> UTC-3, una medición registrada a las 21:00 se convierte en las 00:00 del día
> siguiente en UTC, y quedaría archivada en una fecha que el usuario no vivió.
>
> Para evitarlo se centralizó la construcción de fechas en un único módulo, en
> el cual la clave de agrupación se obtiene a partir de los componentes locales
> de la fecha y no de su representación universal. El mismo criterio se aplicó
> en la función de borde, que se ejecuta en un servidor configurado en UTC: el
> cliente transmite el día local y su desfase horario, y el servidor reconstruye
> los límites correspondientes.

**4.3.5 Seguridad y aislamiento de datos.** Desarrollá tres capas:

1. **Autenticación**: JWT emitido por Supabase, renovación automática, OAuth
   2.0 para el ingreso con Google.
2. **Autorización**: políticas RLS por `auth.uid()` en las tres tablas. El
   punto conceptual importante: la clave publicable es pública por diseño, de
   modo que **RLS no es una capa más de seguridad, es la única** que separa los
   datos de un paciente de los de otro.
3. **Gestión de secretos**: la clave de OpenAI reside únicamente en el entorno
   de la función de borde; el cliente de Supabase dentro de esa función se
   construye con el token del usuario y no con la clave de servicio, de modo
   que las consultas siguen atravesando RLS.

Mostrá una política como figura. Son tres líneas y se entienden.

**4.3.6 Integración del modelo de lenguaje.** Describí el flujo completo de la
función de borde: autenticación, verificación de plan existente, lectura del
perfil, lectura de mediciones del día, construcción del prompt, llamada con
esquema de salida estructurada, verificación, persistencia.

Tres decisiones para justificar:

- **Por qué un modelo económico.** La tarea es redacción sobre datos acotados,
  no razonamiento complejo. Un modelo mayor multiplicaría el costo sin mejorar
  el resultado.
- **Por qué se genera una vez por día.** Cada generación tiene costo. El plan
  se almacena y las visitas siguientes lo recuperan. La restricción de unicidad
  `(usuario_id, dia)` en la base de datos es lo que hace cumplir la regla: no
  depende de una condición en el código.
- **Por qué se verifica la respuesta.** Y acá está lo mejor que tenés:

> **» Para el libro:**
>
> Las restricciones impuestas al sistema se expresaron en las instrucciones
> enviadas al modelo, pero no se confió su cumplimiento exclusivamente a ellas.
> Los modelos de lenguaje generan texto de forma probabilística y pueden
> apartarse de las instrucciones recibidas, fenómeno conocido como alucinación.
> En este dominio, un apartamiento de esa naturaleza equivale a sugerir una
> dosis de medicación.
>
> Por ese motivo se incorporó una verificación programática sobre la respuesta
> recibida: antes de persistir o mostrar el plan, el sistema examina su
> contenido y lo descarta si menciona insulina asociada a una cantidad. El
> criterio adoptado fue que las instrucciones al modelo proponen, pero el código
> dispone. Un fallo de esta verificación produce un mensaje de error, resultado
> preferible a la exhibición de una indicación no autorizada.

**4.3.7 Material de apoyo.** Justificá por qué las guías **no** se generan con
el modelo, que es el contrapunto del apartado anterior y demuestra criterio:

> **» Para el libro:**
>
> A diferencia del plan alimentario, el material de apoyo se implementó como
> contenido fijo y versionado. La razón es la naturaleza de su uso: quien
> consulta la guía sobre hipoglucemia lo hace, con frecuencia, durante un
> episodio. En ese contexto, el texto debe ser estable, previsible y
> verificable, y no el resultado de una generación distinta en cada consulta.
> Un contenido variable resulta aceptable en una sugerencia orientativa y
> desaconsejable en material de consulta durante una urgencia.

Describí también el buscador: normalización de acentos, palabras clave por
guía y ponderación por campo (título, tema, cuerpo), con el ejemplo de por qué
sin ponderación la búsqueda de "cetonas" devolvía primero una guía que las
menciona al pasar.

**4.3.8 Conversión a PWA.** Manifiesto, iconos (incluida la variante
recortable y el concepto de zona segura), *service worker*, estrategia de
precarga y la decisión de **no** almacenar en caché ninguna respuesta de la
base de datos:

> **» Para el libro:**
>
> Se excluyó deliberadamente del almacenamiento en caché toda respuesta
> proveniente de la base de datos. En un sistema de seguimiento de salud, la
> presentación de un valor almacenado previamente como si correspondiera al
> momento actual induce a error de manera más severa que la ausencia de
> información. En condiciones de falta de conectividad, la aplicación muestra
> los estados de error previstos en cada pantalla.

**4.3.9 Despliegue.** Proceso de construcción y publicación, redirección para
aplicaciones de página única, configuración de las URL de redirección de
autenticación.

### 4.4 Pruebas

Presentá lo que **realmente** hiciste, en tabla. No inventes pruebas unitarias
si no las escribiste; hay material suficiente sin eso.

| Tipo | Qué se verificó | Resultado |
| --- | --- | --- |
| Análisis estático | Ejecución de oxlint sobre todo el código | Sin advertencias |
| Verificación de contenido | Integridad de las guías, ausencia de referencias rotas | 10 guías, 47 secciones, sin errores |
| Pruebas de búsqueda | 18 consultas con resultado esperado, incluida ordenación | Todas correctas |
| Verificación de restricción ética | Ausencia de cantidades de insulina en todo el contenido | Sin coincidencias |
| Prueba funcional del *backend* | Respuesta de la función de borde ante petición sin sesión | 401 con código `sin_sesion` |
| Prueba de *service worker* | Carga de la aplicación con el servidor detenido | Aplicación operativa desde caché |
| Prueba de aislamiento | Ausencia de respuestas de la base de datos en caché | Ninguna entrada almacenada |

Cada fila con su evidencia en anexos: captura de consola, salida del comando.

---

## CAPÍTULO V — RESULTADOS Y CONCLUSIONES

### 5.1 Resultados obtenidos

Empezá con el producto: capturas de las pantallas principales, comentadas.
Después las métricas verificables:

| Indicador | Valor |
| --- | --- |
| Archivos de código fuente | 51 |
| Líneas de código | 4 769 |
| Módulos funcionales | 4 |
| Rutas de navegación | 12 |
| Componentes reutilizables | 19 |
| Tablas con RLS activa | 3 |
| Guías de apoyo | 10, en 47 secciones |
| Líneas de la función de borde | 479 |
| Tamaño del paquete (comprimido) | ~139 KB |
| Recursos en precarga | 11 (~504 KB) |

Cerrá con una tabla que enfrente cada objetivo específico con el resultado que
lo cumple. Es lo que el tribunal busca, y si está armada, la defensa se vuelve
mucho más simple.

| Objetivo | Resultado | Evidencia |
| --- | --- | --- |
| OE-1 | Rangos de referencia implementados | Apartado 4.3.2 |
| OE-2 | Interfaz accesible | Apartado 4.2.3, RNF-01 a RNF-04 |
| OE-3 | Aislamiento por usuario | Apartado 4.3.5 |
| OE-4 | Clasificación automática | Apartado 4.3.2 |
| OE-5 | Plan generado por modelo | Apartado 4.3.6 |
| OE-6 | Aplicación instalable | Apartado 4.3.8 |
| OE-7 | Restricciones verificadas | Apartado 4.4 |

### 5.2 Conclusiones

Una por objetivo específico, más dos o tres generales. **No se introduce
información nueva en las conclusiones** y no se repite el resumen: se
interpreta lo obtenido.

Ideas fuertes que tenés disponibles:

- La especialización en un solo tipo de diabetes no restringe el producto: lo
  define. Permite que el vocabulario, los rangos y las recomendaciones sean
  precisos en lugar de aplicables a promedios.
- Determinar qué **no** debe hacer un sistema puede ser una decisión de diseño
  tan relevante como determinar qué debe hacer. El límite de no sugerir dosis
  configuró la arquitectura, el modelo de datos y hasta el mecanismo de
  verificación del modelo de lenguaje.
- La integración de un modelo de lenguaje en un dominio sensible exige
  verificación programática de su salida. Las instrucciones son una condición
  necesaria pero no suficiente.
- Las decisiones aparentemente menores —el manejo de la zona horaria, el
  contraste de un texto de ayuda, el color del día seleccionado— determinan si
  el sistema es utilizable en la práctica.

### 5.3 Recomendaciones y trabajo futuro

Separá en dos.

**Recomendaciones** (para quien retome el trabajo):

- Someter el contenido clínico a revisión por un equipo de salud antes de
  cualquier uso real.
- Realizar pruebas de usabilidad con personas con diabetes tipo 1.

**Trabajo futuro:**

- Rango objetivo personalizado por paciente, tomado del perfil en lugar de
  constantes.
- Gráficos de evolución y cálculo del tiempo en rango.
- Exportación de un informe para la consulta médica.
- Importación desde glucómetros o sistemas de monitoreo continuo.
- Notificaciones de recordatorio.
- Ampliación del material de apoyo.

---

## REFERENCIAS BIBLIOGRÁFICAS

Orden alfabético por apellido. Sólo lo que citaste en el texto: si no aparece
citado, no va en la lista.

Formato APA 7 para los casos que vas a necesitar:

```
Sitio web con autor institucional:
  American Diabetes Association. (2024). Standards of care in diabetes—2024.
  Diabetes Care, 47(Supplement 1). https://doi.org/...

Documentación técnica:
  Meta Open Source. (s.f.). React documentation. Recuperado el 17 de septiembre
  de 2026, de https://react.dev

Libro:
  Apellido, N. (Año). Título del libro en cursiva (edición). Editorial.

Norma legal (verificá el formato que pide tu institución):
  Ley N.º 25.326 de Protección de los Datos Personales. Boletín Oficial de la
  República Argentina, 2 de noviembre de 2000.
```

Mínimo razonable: 15 a 20 referencias, con equilibrio entre fuentes clínicas y
técnicas. **Toda cita en el texto tiene su entrada acá, y toda entrada acá
aparece citada en el texto.** Es lo primero que se revisa.

---

## ANEXOS

| Anexo | Contenido |
| --- | --- |
| A | Manual de usuario, con capturas paso a paso |
| B | Guion de instalación y despliegue |
| C | Diccionario de datos completo |
| D | Código de los módulos principales |
| E | Migraciones SQL |
| F | Evidencia de las pruebas (capturas y salidas) |
| G | Instrumentos de recolección, si hubo |

---

## Errores que se pagan caro

1. **Marco teórico que no vuelve.** Si explicaste qué es un *service worker*,
   el Capítulo IV tiene que usar ese concepto. Todo lo demás, afuera.
2. **Objetivos no verificables.** "Mejorar la calidad de vida" no se comprueba
   y no se puede concluir sobre eso.
3. **Figuras sin numerar ni mencionar.** Toda figura lleva "Figura N." y
   aparece nombrada en el texto.
4. **Citar sin leer.** Si citás una guía clínica, tenés que poder decir de
   dónde sacaste el rango.
5. **Prometer lo que no hiciste.** Si no hubo pruebas con usuarios, va en
   limitaciones. El tribunal lo va a preguntar igual.
6. **Capturas ilegibles.** Tomalas en resolución alta y recortadas.
7. **Índice desactualizado.** Regeneralo al final, con los números de página
   definitivos.
8. **Mezclar tiempos verbales.** Pasado para lo que hiciste, presente para lo
   que el sistema hace.

---

## Orden sugerido de escritura

No se escribe de adelante para atrás. Este orden ahorra reescrituras:

1. Capítulo IV (lo tenés fresco y es el que más material tiene)
2. Capítulo III (se desprende del IV)
3. Capítulo II (ya sabés qué conceptos hace falta explicar)
4. Capítulo I (con todo lo anterior, el problema se formula mejor)
5. Capítulo V
6. Resumen
7. Índices, referencias y anexos
8. Revisión completa de principio a fin

---

## Preguntas probables del tribunal

Tené la respuesta preparada para estas:

- ¿Por qué sólo diabetes tipo 1?
- ¿Por qué no calcula la dosis de insulina? ¿Qué pasaría si la calculara?
- ¿Cómo garantizás que un usuario no vea los datos de otro?
- La clave de Supabase está en el navegador. ¿Eso no es un problema?
- ¿Qué pasa si el modelo de lenguaje responde algo incorrecto?
- ¿Por qué las guías no las genera la inteligencia artificial?
- ¿Qué pasa si el usuario se queda sin conexión?
- ¿Por qué no se puede editar una medición?
- ¿Lo probaste con personas con diabetes?
- ¿Qué harías distinto si empezaras de nuevo?

Las tres primeras y la quinta son las que más van a preguntar. Practicá esas.

---

## Nota sobre la honestidad del trabajo

Dos cosas que conviene declarar de forma explícita en el libro:

1. **El contenido clínico no está validado.** Sigue pautas de manejo de uso
   habitual, pero ningún profesional lo revisó. Va en limitaciones y en las
   recomendaciones.
2. **Si usaste asistencia de inteligencia artificial durante el desarrollo**,
   fijate qué dice el reglamento de tu institución. Cada vez más
   reglamentos exigen declararlo, y declararlo no resta mérito: lo que se
   evalúa es que entiendas y puedas defender cada decisión del sistema.
   Ocultarlo, en cambio, sí puede invalidar el trabajo.
