/**
 * Íconos propios de Diabex, dibujados sobre la misma grilla de 24 con trazo
 * redondeado. Los tres de la barra de pestañas comparten una forma circular
 * de base para que se lean como un juego y no como tres dibujos sueltos.
 *
 * Cada ícono acepta `activo`: engrosa el trazo y suma un relleno tenue, así
 * la pestaña seleccionada se distingue también sin depender del color.
 */

function Svg({ activo = false, className = 'h-6 w-6', children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={activo ? 2 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Alimentación: un bol visto de costado. Comida, no instrumental médico. */
export function IconoBol({ activo, ...props }) {
  return (
    <Svg activo={activo} {...props}>
      <path
        d="M3.2 10.8h17.6v.6a8.8 8.8 0 0 1-17.6 0v-.6Z"
        fill="currentColor"
        fillOpacity={activo ? 0.14 : 0}
      />
      <path d="M8.2 6.4c1.3-1.1 2.3-1.1 3.6 0s2.3 1.1 3.6 0" opacity="0.65" />
    </Svg>
  )
}

/** Registro: la gota de la medición capilar. */
export function IconoGota({ activo, ...props }) {
  return (
    <Svg activo={activo} {...props}>
      <path
        d="M12 3.2c0 0-6.2 6.6-6.2 10.8a6.2 6.2 0 0 0 12.4 0C18.2 9.8 12 3.2 12 3.2Z"
        fill="currentColor"
        fillOpacity={activo ? 0.12 : 0}
      />
      <path d="M9 14.2a3 3 0 0 0 3 3" strokeWidth={activo ? 1.8 : 1.4} opacity="0.7" />
    </Svg>
  )
}

/** Autoayuda: una brújula. Orientarse, no diagnosticarse. */
export function IconoBrujula({ activo, ...props }) {
  return (
    <Svg activo={activo} {...props}>
      <circle cx="12" cy="12" r="8.8" fill="currentColor" fillOpacity={activo ? 0.12 : 0} />
      <path d="m16 8-2.9 5.1L8 16l2.9-5.1L16 8Z" fill="currentColor" fillOpacity={activo ? 0.9 : 0} />
    </Svg>
  )
}

/** Lupa, para buscar. */
export function IconoLupa({ className = 'h-5 w-5' }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m15.8 15.8 4.2 4.2" />
    </Svg>
  )
}

/** Cruz, para limpiar un campo. */
export function IconoCruz({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </Svg>
  )
}

/** Círculo con signo de exclamación, para avisos del servicio. */
export function IconoAviso({ className = 'h-5 w-5' }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.4v.1" strokeWidth={2.2} />
    </Svg>
  )
}

/** Cheurón a la derecha, para filas que llevan a otro lado. */
export function IconoCheuron({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="m9.5 6 6 6-6 6" />
    </Svg>
  )
}

/** Flecha a la izquierda, para volver. */
export function IconoFlechaIzquierda({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </Svg>
  )
}

/** Flecha a la derecha, para avanzar. */
export function IconoFlechaDerecha({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  )
}

/** Tacho, para borrar. */
export function IconoTacho({ className = 'h-5 w-5' }) {
  return (
    <Svg className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6.5 7l.7 11.1A1.5 1.5 0 0 0 8.7 19.5h6.6a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
      <path d="M10.5 11v4.5M13.5 11v4.5" opacity="0.6" />
    </Svg>
  )
}

/** Salida de sesión. */
export function IconoSalir({ className = 'h-5 w-5' }) {
  return (
    <Svg className={className}>
      <path d="M14 20H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4H14" />
      <path d="m17 15 3-3-3-3" />
      <path d="M20 12h-9" />
    </Svg>
  )
}

/** Una hoja con una flecha hacia abajo, para bajar un archivo. */
export function IconoDescarga({ className = 'h-5 w-5' }) {
  return (
    <Svg className={className}>
      <path d="M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z" />
      <path d="M14 3.5V7.5h4" opacity="0.6" />
      <path d="M12 10.5v6" />
      <path d="m9.5 14 2.5 2.5 2.5-2.5" />
    </Svg>
  )
}
