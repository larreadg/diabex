# Módulos (features)

Cada carpeta agrupa todo lo propio de un módulo: componentes, hooks y el acceso
a datos de Supabase. Así el módulo crece sin ensuciar `src/components`.

| Carpeta | Pestaña | Estado |
| --- | --- | --- |
| `alimentacion/` | Alimentación | Pantalla armada, sin datos |
| `registro/` | Registro | **Funcionando**: cuestionario diario y mediciones del día |
| `autoayuda/` | Autoayuda | Pantalla armada, contenido por escribir |
| `perfil/` | — (se llega desde la hoja de cuenta) | **Funcionando**: guarda en Supabase |

Un componente va a `src/components/` sólo si lo usan dos o más módulos. Si es
propio de una pestaña, se queda acá.

`perfil/` es el módulo de referencia: `datos.js` (acceso a Supabase),
`usePerfil.js` (carga, error y reintento) y `Perfil.jsx` (pantalla). Copiá esa
forma para los módulos que vienen.

Los pasos para sumar un módulo están en `CLAUDE.md`.
