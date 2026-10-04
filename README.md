# Diabex

Aplicación web para el seguimiento diario de personas con **diabetes tipo 1**.

**Etapa actual: autenticación + shell de la app.** Alta de cuenta y login (con
email/contraseña o con Google), logout, rutas protegidas y sesión persistente.
Con la sesión iniciada, una barra de tres pestañas —Alimentación, Registro,
Autoayuda— con cada pantalla armada, el perfil del paciente y el **cuestionario
diario**: unas preguntas de contexto, la carga del valor exacto del glucómetro y
una recomendación según la banda en la que cae. Ambos guardan en Supabase, y un
calendario permite ver las mediciones de cualquier fecha y borrar las que se
hayan cargado con un valor equivocado.

La app está pensada para el teléfono. Las convenciones del proyecto están en
`CLAUDE.md`; el contexto de producto y de diseño, en `PRODUCT.md`.

## Stack

- React 18 + Vite
- Tailwind CSS v4 (plugin de Vite)
- Supabase (Auth)
- React Router v6

## Puesta en marcha

```bash
npm install
cp .env.example .env   # completá las credenciales de tu proyecto de Supabase
npm run dev
```

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`) |

La publishable key es pública y está pensada para el frontend. La **secret key**
(`sb_secret_...`) nunca debe estar en el código del cliente. El archivo `.env`
está ignorado por git.

## Marca

| Color | Hex | Uso |
| --- | --- | --- |
| Azul profundo | `#004682` | `marca-800`: botones, títulos, acciones |
| Celeste | `#008bdd` | `marca-500`: foco en formularios, acentos |

La escala completa (`marca-50` … `marca-950`) está definida en `src/index.css`
dentro de `@theme`, así que se usa como cualquier color de Tailwind
(`bg-marca-800`, `text-marca-700`, `ring-marca-500/30`).

La tipografía es **Manrope** (400/500/600/800), cargada desde Google Fonts en
`index.html`. Una sola familia para toda la app.

Archivos en `public/`:

| Archivo | Origen | Uso |
| --- | --- | --- |
| `diabex_horizontal.png` | original | fuente del logo horizontal |
| `diabex_isotipo.png` | original | fuente del isotipo |
| `diabex_app_icon.png` | original | fuente de los íconos |
| `logo-diabex.png` | derivado (720 px) | logo del header y de las pantallas de auth |
| `isotipo-diabex.png` | derivado (256 px) | versión compacta, sin el texto |
| `favicon.png` | derivado (64 px) | ícono de la pestaña |
| `apple-touch-icon.png` | derivado (180 px) | ícono al agregar a la pantalla de inicio |
| `icono-192.png` | derivado (192 px) | ícono del manifest |
| `icono-512.png` | derivado (512 px) | ícono del manifest |
| `icono-maskable-512.png` | derivado (512 px) | ícono recortable de Android |

El manifest PWA no está acá: lo genera `vite-plugin-pwa` en cada build a partir
de `vite.config.js`. Agregar uno a mano en `public/` crearía dos.

Los derivados son recortes optimizados de los originales: si cambia la marca,
se regeneran desde los tres archivos `diabex_*.png`.

## Estructura

```
src/
├── components/        # Reutilizables: AppLayout, TabBar, HojaCuenta, RielDelDia, formularios
├── context/           # AuthContext + hook useAuth()
├── features/          # Un módulo por pestaña: alimentacion, registro, autoayuda, perfil
├── lib/               # supabase.js (cliente único), errores.js, destino.js, fechas.js
├── pages/             # Login.jsx, CrearCuenta.jsx, AuthCallback.jsx, NotFound.jsx
├── App.jsx            # Definición de rutas
└── main.jsx           # Punto de entrada
```

El alias `@` apunta a `src/`.

## Rutas

| Ruta | Acceso | Qué es |
| --- | --- | --- |
| `/login` | Sólo sin sesión | Ingreso |
| `/crear-cuenta` | Sólo sin sesión | Alta de cuenta |
| `/auth/callback` | Sin guardas | Vuelta desde Google |
| `/` | Requiere sesión | Redirige a `/registro` |
| `/alimentacion` | Requiere sesión | Pestaña Alimentación |
| `/registro` | Requiere sesión | Pestaña Registro |
| `/registro/nuevo` | Requiere sesión | Cuestionario diario |
| `/registro/historial` | Requiere sesión | Calendario de mediciones por fecha |
| `/autoayuda` | Requiere sesión | Pestaña Autoayuda |
| `/perfil` | Requiere sesión | Datos del paciente (fuera de la barra) |

Ojo: `/registro` es la **pestaña de mediciones**, no el alta de cuenta. El alta
está en `/crear-cuenta` para no chocar con ella.

Si un usuario sin sesión entra a una ruta protegida, va a `/login` y vuelve al
destino original después de ingresar.

## Navegación

Con la sesión iniciada, la app es un shell: encabezado fino arriba, contenido en
el medio y una barra de tres pestañas fija abajo, que respeta el área segura del
teléfono. Desde `md` la barra se oculta y las pestañas suben al encabezado.

El perfil y el cierre de sesión no ocupan una pestaña: están en la hoja de
cuenta, que se abre desde el avatar del encabezado.

## Base de datos

Las migraciones están en `supabase/migraciones/` y se ejecutan a mano en el
**SQL Editor** del proyecto de Supabase, en orden. Son idempotentes: se pueden
correr de nuevo sin romper nada.

| Archivo | Qué crea |
| --- | --- |
| `0001_perfiles.sql` | Tabla `perfiles`: nombre, fecha de nacimiento, peso y altura |
| `0002_mediciones.sql` | Tabla `mediciones`: valor de glucosa, contexto, nivel y recomendación |
| `0003_planes_alimentacion.sql` | Tabla `planes_alimentacion`: el plan de comidas del día |

Todas las tablas llevan RLS activada con políticas por `auth.uid()`: cada
usuario ve y edita únicamente su propia fila.

Si la app muestra *"Todavía no está creada la tabla…"*, falta correr la
migración correspondiente.

## Ingreso con Google

El código ya está listo, pero **falta habilitar el provider** en Supabase: hasta
entonces el botón muestra el aviso "El ingreso con Google todavía no está
habilitado en este proyecto de Supabase".

1. **Google Cloud Console** → *APIs & Services* → *Credentials* → crear un
   *OAuth client ID* de tipo *Web application*.
   - *Authorized JavaScript origins*: `http://localhost:5173` y el dominio de producción.
   - *Authorized redirect URI*: `https://eouydrgoeejbauzzmplt.supabase.co/auth/v1/callback`
2. **Supabase** → *Authentication* → *Providers* → *Google*: activarlo y pegar el
   *Client ID* y el *Client Secret* que devolvió Google.
3. **Supabase** → *Authentication* → *URL Configuration*. Los dos campos hacen
   cosas distintas y los dos importan:
   - **Site URL**: el dominio de producción (`https://tu-sitio.netlify.app`).
     Viene en `http://localhost:3000` de fábrica.
   - **Redirect URLs**: `http://localhost:5173/**` y `https://tu-sitio.netlify.app/**`.

El Client Secret va sólo en el panel de Supabase, nunca en este repositorio.

**Si el login con Google te devuelve a `localhost:3000`**, es esto: Supabase
descarta cualquier `redirectTo` que no esté en *Redirect URLs* y cae al *Site
URL*. Se nota porque te deja en la raíz del dominio y no en `/auth/callback`.
La app manda el `redirectTo` correcto; el que decide es el panel.

Con Google no hace falta un registro aparte: si el email no tenía cuenta,
Supabase la crea en el primer ingreso. Tampoco hay que confirmar el email,
porque Google ya lo verificó.

## Despliegue

`netlify.toml` tiene lo necesario: comando de build, carpeta `dist` y dos cosas
que no son opcionales.

- **El catch-all a `index.html`.** Sin esa regla, cualquier ruta que no sea `/`
  da 404 al entrar directo o al recargar, y la vuelta de Google a
  `/auth/callback` también.
- **`sw.js` sin caché.** Si el navegador se queda con un service worker viejo,
  la app deja de poder actualizarse y el próximo deploy no lo arregla: el worker
  viejo sigue sirviendo el build viejo.

En Netlify hay que cargar además las dos variables de entorno (*Site
configuration → Environment variables*). Sin ellas el build sale bien pero la
app se cae al arrancar, porque `lib/supabase.js` valida que estén.

## Sesión

`supabase-js` guarda la sesión en `localStorage` y renueva el token solo, así que
al recargar la página el usuario sigue logueado. `AuthContext` expone un flag
`cargando` mientras se resuelve la sesión inicial, para evitar un redirect
indebido a `/login` en ese instante.

## Lo que falta

Perfil y Registro guardan datos. Pendiente:

- Rango objetivo personalizado en el perfil, en vez de las constantes de `lib/glucosa.js`
- Gráficos de evolución y tiempo en rango por semana o por mes
- Exportar un resumen para llevarle al médico
- Revisión del contenido clínico (recomendaciones y guías) por el equipo de salud antes de producción

Cómo sumar un módulo: `CLAUDE.md`.
