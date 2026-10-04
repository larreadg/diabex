/**
 * Logo horizontal de Diabex (isotipo + wordmark).
 * El archivo vive en `public/`, derivado del original `diabex_horizontal.png`.
 */
export default function Logo({ className = 'h-9', ...props }) {
  return (
    <img
      src="/logo-diabex.png"
      alt="Diabex"
      width="720"
      height="220"
      className={`w-auto ${className}`}
      {...props}
    />
  )
}
