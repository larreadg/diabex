# Diabex

App de seguimiento diario **exclusivamente para diabetes tipo 1**. React 18 +
Vite, Tailwind v4, Supabase (Auth + Postgres), React Router v6.

Que sea sólo tipo 1 no es un detalle de contenido: define el producto. No se
pregunta el tipo de diabetes en ningún formulario, y las bandas de glucosa, las
recomendaciones y el vocabulario son los de tipo 1. Si aparece un selector de
tipo de diabetes en un diseño, está mal.

Contexto de producto y decisiones de diseño: `PRODUCT.md`.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # servir el build
npm run lint     # oxlint
```

Antes de dar por terminado un cambio: `npm run lint && npm run build`.

## Idioma del código

**Todo se escribe en castellano**: nombres de componentes, variables,
funciones, props, comentarios, rutas y texto de la interfaz. `Registro`, no
`Log`. `cargando`, no `loading`. Las únicas excepciones son la API de React y
de las librerías (`useState`, `className`, `onClick`) y los archivos que ya
existían con nombre en inglés (`AppLayout`, `ProtectedRoute`, `TextField`).

Los comentarios explican **por qué**, no qué. El código ya dice qué hace.

Español rioplatense en la interfaz: "anotá", "tenés", "ingresá".

## Mobile first, en serio

La app se usa casi siempre en un teléfono. Eso no es un breakpoint, es el punto
de partida:

- Se diseña primero para ~390 px de ancho y recién después se agregan
  variantes `md:` para pantallas grandes.
- Lo que el usuario hace todos los días va al alcance del pulgar: abajo, no
  arriba.
- Las áreas táctiles son de 44 px o más.
- El área segura del teléfono se respeta con `env(safe-area-inset-bottom)`.
  `index.html` tiene `viewport-fit=cover` para que esa variable exista.
- La altura va con `min-h-dvh`, nunca `min-h-screen` (en móvil la barra del
  navegador aparece y desaparece).

## Arquitectura

```
src/
├── components/   # Reutilizables entre módulos: layouts, TabBar, RielDelDia, formularios
├── context/      # AuthContext + hook useAuth()
├── features/     # Un módulo por pestaña: alimentacion, registro, autoayuda, perfil
├── lib/          # supabase.js (cliente único), errores.js, destino.js, fechas.js
├── pages/        # Pantallas fuera del shell: Login, CrearCuenta, AuthCallback, NotFound
├── App.jsx       # Definición de rutas
└── main.jsx      # Punto de entrada
```

El alias `@` apunta a `src/`.

Un componente vive en `components/` sólo si lo usa más de un módulo. Si es
propio de una pestaña, va en su carpeta de `features/`.

## Rutas

| Ruta | Acceso | Qué es |
| --- | --- | --- |
| `/login` | sólo sin sesión | Ingreso |
| `/crear-cuenta` | sólo sin sesión | Alta de cuenta |
| `/auth/callback` | sin guardas | Vuelta desde Google |
| `/` | con sesión | Redirige a `/registro` |
| `/alimentacion` | con sesión | Pestaña 1 |
| `/registro` | con sesión | Pestaña 2 (la de entrada) |
| `/registro/nuevo` | con sesión | Cuestionario diario |
| `/registro/historial` | con sesión | Calendario de mediciones por fecha |
| `/autoayuda` | con sesión | Pestaña 3: el índice de guías |
| `/autoayuda/:slug` | con sesión | Una guía, para leer |
| `/perfil` | con sesión | Fuera de la barra: se llega desde la hoja de cuenta |

**Cuidado con `/registro`.** Es la pestaña de mediciones, no el alta de cuenta.
El alta vive en `/crear-cuenta` justamente para no chocar con ella.

## Navegación

Tres pestañas, ni una más: Alimentación, Registro, Autoayuda. Registro va en el
medio porque es la acción de todos los días.

El array `PESTANAS` en `src/components/TabBar.jsx` es la única fuente de verdad
de la navegación. Si cambia, cambia también el bloque de rutas de `App.jsx` (el
orden tiene que coincidir: el indicador deslizante usa el índice).

El perfil y el cierre de sesión **no** son una pestaña: viven en la hoja de
cuenta (`HojaCuenta.jsx`), que se abre desde el avatar del encabezado y lleva a
`/perfil`.

En una ruta que no es ninguna de las tres (como `/perfil`), la barra no marca
ninguna pestaña activa. `useIndiceActivo` devuelve `-1` y el indicador se
desvanece: la barra sigue sirviendo para volver, pero no dice que estás en un
lugar donde no estás.

En `md:` y más ancho la barra inferior se oculta y las pestañas suben al
encabezado (`PestanasEscritorio`). Es responsive estructural, no tipografía
fluida.

## Sistema visual

Los tokens viven en `@theme` dentro de `src/index.css` y se usan como cualquier
utilidad de Tailwind.

| Token | Valor | Uso |
| --- | --- | --- |
| `marca-800` | `#004682` | Acciones primarias, avatar, azul del logo |
| `marca-600` | `#0071b9` | Indicador de pestaña activa |
| `marca-700` | `#005b96` | Texto de acento (fecha, pestaña activa) |
| `marca-500` | `#008bdd` | Foco en formularios |
| `ease-salida` | `cubic-bezier(0.22, 1, 0.36, 1)` | La única curva de la app |

Fondo `slate-50`, superficies `white`, texto `slate-900` / `slate-600`.
No hay semáforo rojo/amarillo/verde: es anti-referencia explícita.

**Tipografía**: Manrope, una sola familia, cargada desde Google Fonts en
`index.html`. Escala de tres escalones, respetala:

- `text-2xl font-extrabold tracking-tight` → título de pantalla (h1)
- `text-base font-extrabold` → título de sección (h2)
- `text-sm font-semibold` → título de ítem (h3)
- `text-sm text-slate-600` → texto corrido

La clase `.cifras` activa números de ancho fijo. Usala en cualquier columna de
horas o de valores.

**z-index**: nunca un número suelto. La escala está en `:root` de `index.css`
(`--z-sticky`, `--z-tabbar`, `--z-hoja`) y se usa con `z-[var(--z-tabbar)]`.

## Glucosa y recomendaciones

Tres archivos, ninguno con UI adentro:

| Archivo | Qué hace |
| --- | --- |
| `lib/glucosa.js` | Umbrales, objetivo según el momento, `clasificar()` y cómo se muestra cada nivel |
| `features/registro/recomendaciones.js` | `recomendarPara(medicion)`, función pura |
| `features/registro/datos.js` | Lectura y alta en Supabase |
| `features/registro/presentacion.js` | Medición → fila del riel, y agrupado por día |
| `features/registro/HojaMedicion.jsx` | Detalle de un control, y el único lugar desde donde se borra |
| `features/registro/HojaExportar.jsx` | Elegir un rango de fechas y bajar el informe en PDF |
| `features/registro/informe/resumen.js` | Números del período y franjas de la barra, función pura |
| `features/registro/informe/generarPdf.js` | Dibuja el informe A4 con jsPDF y lo descarga |

Reglas que no se negocian:

- **Diabex nunca sugiere una dosis de insulina.** Es indicación médica y
  equivocarse tiene consecuencias graves.
- **Diabex no diagnostica.** Muestra el valor, su banda y qué conviene hacer.
- **Se guarda el valor exacto en mg/dL, nunca un rango.** La banda se deriva en
  código. Guardar el número permite promedios, tiempo en rango y evolución;
  guardar "150-180" tira esa información para siempre.
- **El objetivo depende del momento**: 80-130 mg/dL antes de comer o en ayunas,
  70-180 mg/dL entre 1 y 2 h después. Por eso el cuestionario pregunta si el
  control es antes o después: sin ese dato un valor intermedio no se puede
  clasificar.
- Cada medición guarda el `nivel` y el título de la recomendación que se mostró,
  para poder auditar después qué se le dijo a la persona y cuándo.

Los umbrales de `lib/glucosa.js` son los de referencia habituales. El rango
objetivo se personaliza por paciente: el paso siguiente es leerlo del perfil en
vez de usar constantes.

## El informe en PDF

Desde Registro se baja un informe A4 de un rango de fechas (hasta un año): las
cifras del período, la distribución por banda, la evolución y la tabla de
cada control. Se arma en el dispositivo con jsPDF; no hay servidor ni archivo
guardado en ningún lado.

- **`generarPdf.js` se carga con `import()`** recién al tocar "Descargar". jsPDF
  y las fuentes pesan casi 1 MB; importarlo de forma estática lo mete en el
  bundle de entrada.
- Las fuentes son Manrope en TTF estático (`informe/fuentes/`, licencia OFL).
  Con las fuentes que trae jsPDF los acentos dependen del visor.
- Los números se calculan sobre el `nivel` guardado, no reclasificando: el
  informe cuenta lo mismo que la persona vio en la app en su momento.
- El nombre del día va dibujado dentro de la primera fila de ese día, no como
  fila aparte: así nunca queda solo al pie de una página.
- `obtenerMedicionesEntre` pagina de a 1000 filas, el tope de PostgREST.

## Las guías de Autoayuda

El contenido vive en `features/autoayuda/guias.js` y nada más: sin tabla, sin
red y sin generación. Es una decisión, no una etapa provisoria.

**Las guías no se generan.** Quien abre "Hipoglucemia" a las tres de la mañana
necesita el mismo texto de siempre, el que revisó el equipo clínico, y no la
redacción de hoy. Material de consulta en una urgencia es justo donde el texto
que cambia solo deja de ser una gracia y pasa a ser un riesgo. Estando en el
repo, además, se revisa en un diff y funciona sin conexión.

| Archivo | Qué hace |
| --- | --- |
| `features/autoayuda/guias.js` | Las guías, los grupos del índice y `buscarGuias()`. Una guía vive en un solo lugar; los grupos la referencian por `slug` |
| `features/autoayuda/Autoayuda.jsx` | El índice y el buscador |
| `features/autoayuda/Guia.jsx` | La pantalla de lectura |

El buscador es una función pura sobre el contenido, sin red y sin índice
externo: son diez guías, cada tecleada sale gratis. Tres cosas que lo hacen
funcionar y conviene no deshacer:

- **Se busca sin acentos y en minúsculas.** Quien escribe "correccion" tiene
  que encontrar "corrección"; si no, hay que adivinar cómo se tipeó el título.
- **Cada guía tiene `claves`**: lo que alguien escribiría de verdad y no está
  en el texto ("birra", "gym", "bajón", "resaca"). Es la mitad del valor del
  buscador, porque nadie tipea el título de un artículo.
- **Los campos pesan distinto** (`nombre` 3, `temas` 2, `cuerpo` 1). Buscar en
  el cuerpo entero es lo que hace que "cetonas" encuentre días de enfermedad,
  pero sin pesos esa misma búsqueda devuelve primero la de ejercicio, que las
  menciona al pasar.

Con el campo vacío se ven los grupos; apenas se escribe algo queda una sola
lista ordenada por pertinencia. Repartir tres resultados en tres grupos los
esconde. La consulta va en `?q=` para que al volver de una guía siga escrita, y
se escribe con `replace` para no dejar una entrada de historial por tecla.

Al escribir una guía:

- **Ni dosis ni diagnóstico**, igual que en el resto de la app. La guía de
  factor de corrección explica el concepto y dice explícitamente que Diabex no
  calcula la corrección: si algún día se vuelve una calculadora, la app pasa a
  ser software médico regulado.
- Sumá sus `claves` de búsqueda: los términos que alguien tiparía y que no
  están en el texto. Una guía sin claves sólo se encuentra por su título.
- Una sección puede llevar `urgente: true` y es el único lugar donde una guía
  usa color. Va siempre con un título que dice lo mismo en palabras ("Cuándo
  llamar sin esperar").
- El contenido actual sigue las pautas de manejo habituales en tipo 1. **Antes
  de producción tiene que revisarlo el equipo clínico**, lo mismo que
  `recomendaciones.js`.

## El plan de alimentación

La pestaña de Alimentación no arma el plan: lo pide. Lo escribe un modelo desde
la edge function `daily-nutrition-plan`, una vez por día, con el perfil y los
controles de hoy.

| Archivo | Qué hace |
| --- | --- |
| `supabase/functions/daily-nutrition-plan/index.ts` | Arma el plan y lo guarda. El único lugar que habla con el modelo |
| `features/alimentacion/datos.js` | Invoca la función y abre el cuerpo del error para rescatar su `codigo` |
| `features/alimentacion/usePlanDelDia.js` | Carga, error y reintento |
| `features/alimentacion/presentacion.js` | Comida del plan → fila del riel |
| `features/alimentacion/HojaComida.jsx` | Detalle de una comida y sus alternativas |

Lo que conviene no perder de vista:

- **El plan es texto generado, y se dice.** La pantalla lo aclara al pie. Quien
  lo lee tiene que poder decidir cuánto peso darle.
- Las reglas de Diabex viven en el prompt **y** se verifican sobre la respuesta:
  un plan que mencione dosis de insulina se descarta antes de llegar a la
  pantalla. El prompt propone; el código dispone.
- Sin peso y altura no se llama a la función: la pantalla ya sabe que va a
  fallar y muestra el acceso al perfil.
- Los códigos de error de la función (`perfil_incompleto`, `modelo_no_responde`,
  `plan_rechazado`…) se traducen en `lib/errores.js`, igual que los de Postgres.

## Fechas y zona horaria

`lib/fechas.js` es el único lugar donde se arman fechas. Una regla que importa
más de lo que parece:

**Nunca uses `toISOString().slice(0, 10)` para saber de qué día es una
medición.** Convierte a UTC, y acá el offset es -3: un control de las 21:00
quedaría archivado al día siguiente. Usá `claveLocal()`, que lee el día con el
reloj del dispositivo. Las mediciones se agrupan por el día que vivió la
persona, no por el día UTC.

Para consultar un rango sí se manda `toISOString()`, pero los límites se arman
en hora local primero (`limitesDelMes`, `comienzoDeHoy`): así el mes consultado
es el mes que ve la persona.

La semana empieza el lunes: `getDay()` devuelve 0 para domingo, y
`estructuraDelMes` lo corrige con `(dia + 6) % 7`.

## Acciones destructivas

Una medición se puede borrar, pero no editar: un control es un hecho con su
fecha, no un campo que se corrige. La política de RLS refleja eso — hay
`select`, `insert` y `delete`, no `update`.

Cómo se ofrece un borrado acá:

- **Nunca un ícono de tacho visible en cada fila de una lista.** Se toca sin
  querer, y esto no se puede deshacer.
- Se llega tocando la fila, que abre su detalle. El borrado vive ahí adentro,
  detrás de una confirmación en línea que nombra lo que se va a borrar
  ("¿Borrar este control de 196 mg/dL?").
- La confirmación es **en línea, dentro de la misma hoja**. Nada de `confirm()`
  del navegador (bloquea todo) ni de un diálogo adentro de otro diálogo.
- El primer elemento enfocable de una hoja nunca es la acción destructiva: en
  `Hoja.jsx` el asa es el botón de cerrar y lleva `autoFocus`.

## Hojas

`components/Hoja.jsx` tiene la mecánica: `<dialog>` nativo, animación por
keyframes, bloqueo del scroll del body, Escape, y el asa que además cierra.
`HojaCuenta`, `HojaMedicion` y `HojaComida` la usan.

`children` es una función que recibe `cerrar`, porque lo que va adentro casi
siempre necesita cerrar la hoja con su animación después de hacer lo suyo
(navegar, borrar).

### Color de alerta

El azul de marca es el estado normal. Hay sólo dos colores de alerta —ámbar
para "fuera de objetivo" y rojo para hipoglucemia y valores muy altos— y se
usan únicamente donde hace falta. No es un semáforo en cada elemento.

**El color nunca va solo**: siempre acompaña a una etiqueta de texto que dice
lo mismo. Un valor fuera de rango tiene que ser legible sin distinguir colores.

En el calendario, el día elegido se marca con un anillo y no con un relleno
azul lleno: sobre azul, los puntos azules de "en rango" desaparecen y la celda
pierde justo lo que tiene que mostrar.

### El riel del día

`components/RielDelDia.jsx` es el elemento propio de Diabex: la hora a la
izquierda, un nodo por momento y una línea que los une. Lo comparten Registro y
Alimentación. Autoayuda **no** lo usa a propósito: leer una guía no tiene hora.

El nodo hueco ya comunica "acá no hay nada todavía", así que no hace falta
repetir "sin datos" en cada fila.

Evitá las grillas de tarjetas idénticas. Filas con línea fina separadora suelen
leerse mejor y pesan menos.

## Animación

- 150–250 ms, siempre con `ease-salida`. Sin rebotes.
- Se anima `transform` y `opacity`. No propiedades de layout.
- **La animación no puede ser lo que hace visible al contenido.** Si se apoya
  en `requestAnimationFrame` o en una clase que enciende la opacidad, en una
  pestaña en segundo plano el navegador congela los frames y el contenido queda
  invisible. El estado base tiene que ser el estado final; la animación sólo
  entra desde afuera (ver los keyframes de `.hoja` en `index.css`).
- Toda animación necesita su rama en `@media (prefers-reduced-motion: reduce)`.

## Accesibilidad

- Texto normal ≥ 4.5:1 de contraste, texto grande ≥ 3:1. **El placeholder
  cuenta como texto normal**: `slate-400` no llega (2.6:1), `slate-500` sí.
- La unidad de un campo va en la etiqueta ("Peso (kg)"), no en el placeholder:
  el placeholder desaparece apenas se escribe.
- El estado activo nunca se comunica sólo con color: en la barra de pestañas va
  ícono relleno + peso tipográfico + indicador.
- Foco visible en todo lo interactivo (`focus-visible:outline-2`).
- En `<dialog>`, el primer elemento enfocable tiene que ser inofensivo. En la
  hoja de cuenta el asa es el botón de cerrar y lleva `autoFocus`, para que la
  primera tecla de un usuario de teclado no sea "cerrar sesión".

## PWA

Diabex se instala. La configuración está en `vite.config.js` (`vite-plugin-pwa`,
modo `generateSW`) y el manifest se genera en el build: **no hay manifest a mano
en `public/`**, y agregar uno crearía dos.

Tres reglas que no se tocan sin pensarlo:

- **Nada de Supabase se guarda en caché.** No hay ninguna regla de
  `runtimeCaching` para el dominio del proyecto, así que las mediciones y el
  perfil salen siempre de la red. En una app de salud, mostrar un valor viejo
  como si fuera el de ahora es peor que no mostrar nada: sin conexión aparecen
  los estados de error que las pantallas ya tienen. Lo único que se cachea en
  runtime son las fuentes de Google.
- **La versión nueva se avisa, no se impone** (`registerType: 'prompt'`). Con
  `autoUpdate` la página se recarga sola cuando el worker nuevo toma el control,
  y eso puede pasar con el cuestionario de una medición a medio llenar.
- **`<AvisoActualizacion />` va en `App.jsx`, fuera de `<Routes>`.** Ese
  componente es el que registra el service worker: si vive adentro de
  `AppLayout` sólo se monta con sesión iniciada, y entonces en `/login` —la
  pantalla desde la que se instala la app— no se registra nada.

El informe en PDF queda **fuera de la precarga**: `chunkFileNames` manda jsPDF,
sus dependencias opcionales y las fuentes a `assets/informe/`, y `globIgnores`
excluye esa carpeta. Sin conexión no hay mediciones que exportar, así que
precargarlo sumaría casi 1 MB a cada instalación para nada.

La precarga se lista archivo por archivo en `includeAssets`, no con un
`**/*.png`: en `public/` viven también los originales de 4096 px del logo, y un
glob los metería en la precarga. Hoy son 11 entradas, ~500 KB.

Los íconos del manifest se generan desde `public/diabex_app_icon.png`:
`icono-192` y `icono-512` son el tile tal cual, y `icono-maskable-512` lleva la
marca sola sobre azul a sangre, al 56 % del lienzo, porque el sistema recorta a
un círculo del 80 %. El tile tiene un filete claro en el borde: si se usa
entero como maskable, ese filete se ve como una costura sobre el fondo plano.

## Supabase

Un solo cliente, en `src/lib/supabase.js`. Las claves salen de `.env`
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). La publishable key es
pública; la secret key (`sb_secret_...`) **nunca** va en el cliente.

### Migraciones

Van en `supabase/migraciones/`, numeradas, y se ejecutan a mano en el SQL Editor
del proyecto. Se escriben **idempotentes** (`if not exists`, `drop policy if
exists` antes de cada `create policy`) para poder correrlas de nuevo sin romper
nada.

Toda tabla nueva lleva RLS activada y políticas por `auth.uid()`. Sin excepción:
la publishable key es pública, así que RLS es lo único que separa los datos de
un paciente de los de otro.

| Archivo | Qué crea |
| --- | --- |
| `0001_perfiles.sql` | Tabla `perfiles` (una fila por usuario) con RLS |
| `0002_mediciones.sql` | Tabla `mediciones` con RLS, más el descarte opcional de `perfiles.tipo_diabetes` |
| `0003_planes_alimentacion.sql` | Tabla `planes_alimentacion` con RLS: un plan de comidas por usuario y por día |

Si una pantalla muestra "Todavía no está creada la tabla…", falta correr una
migración. El mapeo de esos códigos de Postgres y PostgREST está en
`src/lib/errores.js`.

### Edge functions

Van en `supabase/functions/<nombre>/index.ts`. Corren en Deno, no ven `src/` y
no pasan por Vite ni por oxlint: lo que necesiten de `lib/` se repite ahí
adentro (las etiquetas de glucosa, la cuenta de la edad).

| Función | Qué hace |
| --- | --- |
| `daily-nutrition-plan` | Arma el plan de comidas del día con el perfil y las mediciones de hoy, y lo guarda en `planes_alimentacion` |

Reglas de una edge function acá:

- El cliente de Supabase se arma con el `Authorization` de la request, nunca con
  la secret key. Así las consultas siguen pasando por RLS y la función no puede
  leer datos de otro paciente aunque tenga un bug.
- El día lo decide el reloj del dispositivo, no el del servidor: la función
  corre en UTC y la app vive en UTC-3. El cliente manda `dia` (`claveLocal()`)
  y `desfaseMinutos` (`getTimezoneOffset()`).
- Lo que cuesta plata se genera una vez y se guarda. La restricción única de la
  tabla es lo que hace cumplir el "una vez por día"; el choque `23505` no es un
  error, es la señal de que ya estaba hecho.
- **Las reglas de Diabex se verifican sobre la respuesta del modelo, no sólo en
  el prompt.** Un modelo puede desobedecer, y acá desobedecer es sugerir una
  dosis de insulina. Si el plan menciona insulina con cantidades, se descarta.

Los secrets (`OPENAI_API_KEY`, y `OPENAI_MODEL` si se quiere cambiar el modelo)
se cargan en el proyecto de Supabase, no en `.env`.

### Acceso a datos

Cada módulo tiene su `datos.js` con las funciones de Supabase, y un hook que
maneja carga, error y reintento (`features/perfil/usePerfil.js` es el modelo).
Las pantallas no llaman a `supabase` directamente.

## Cómo sumar un módulo

1. Crear la pantalla en `src/features/<modulo>/`.
2. Registrar la ruta en `App.jsx`, dentro del bloque de `<ProtectedRoute>`.
3. Si es una pestaña nueva, sumarla a `PESTANAS` en `TabBar.jsx` con su ícono
   en `components/iconos.jsx` — misma grilla de 24 y mismo trazo que los demás.
   Antes de sumar una cuarta pestaña, revisá si no corresponde a la hoja de
   cuenta: tres pestañas es una decisión de producto.
4. Escribir la migración en `supabase/migraciones/` con RLS y políticas por
   `auth.uid()`, y correrla en el SQL Editor.
5. Poner el acceso a datos en `datos.js` del módulo, nunca en la pantalla.
