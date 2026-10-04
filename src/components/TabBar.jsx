import { NavLink, useLocation } from 'react-router-dom'

import { IconoBol, IconoBrujula, IconoGota } from '@/components/iconos'

/**
 * Las tres secciones de la app. El orden importa: Registro queda en el medio
 * porque es la acción de todos los días y es donde llega el pulgar.
 */
const PESTANAS = [
  { to: '/alimentacion', etiqueta: 'Alimentación', Icono: IconoBol },
  { to: '/registro', etiqueta: 'Registro', Icono: IconoGota },
  { to: '/autoayuda', etiqueta: 'Autoayuda', Icono: IconoBrujula },
]

/**
 * Índice de la pestaña activa, o -1 si la pantalla actual no es ninguna de las
 * tres (por ejemplo /perfil). En ese caso no se marca ninguna: la barra sigue
 * siendo la forma de volver, pero no dice que estás en un lugar donde no estás.
 */
function useIndiceActivo() {
  const { pathname } = useLocation()
  return PESTANAS.findIndex((p) => pathname === p.to || pathname.startsWith(`${p.to}/`))
}

/**
 * Barra de pestañas del teléfono: fija abajo, esquivando el indicador de
 * inicio del iPhone. Desde `md` desaparece y su lugar lo toma
 * <PestanasEscritorio /> en el encabezado.
 */
export default function TabBar() {
  const indice = useIndiceActivo()

  return (
    <nav
      aria-label="Secciones de Diabex"
      className="fixed inset-x-0 bottom-0 z-[var(--z-tabbar)] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="relative mx-auto grid max-w-2xl grid-cols-3">
        {/* Indicador que se desliza entre pestañas. Anima sólo transform. */}
        <span
          aria-hidden="true"
          style={{ transform: `translateX(${Math.max(indice, 0) * 100}%)` }}
          className={`pointer-events-none absolute top-0 left-0 h-0.5 w-1/3 rounded-full bg-marca-600 transition-[transform,opacity] duration-300 ease-salida motion-reduce:transition-none ${
            indice === -1 ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {PESTANAS.map(({ to, etiqueta, Icono }, i) => {
          const activo = i === indice
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-2 pt-2 pb-1.5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-marca-600 ${
                activo ? 'text-marca-700' : 'text-slate-600 active:bg-slate-50'
              }`}
            >
              <Icono activo={activo} className="h-6 w-6" />
              <span className={`text-[0.6875rem] ${activo ? 'font-bold' : 'font-medium'}`}>
                {etiqueta}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

/** Las mismas tres secciones, como pestañas horizontales en pantallas grandes. */
export function PestanasEscritorio() {
  const indice = useIndiceActivo()

  return (
    <nav aria-label="Secciones de Diabex" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {PESTANAS.map(({ to, etiqueta, Icono }, i) => {
          const activo = i === indice
          return (
            <li key={to}>
              <NavLink
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 ${
                  activo
                    ? 'bg-marca-50 font-bold text-marca-800'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icono activo={activo} className="h-[1.125rem] w-[1.125rem]" />
                {etiqueta}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
