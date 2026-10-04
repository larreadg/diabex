import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Hoja from '@/components/Hoja'
import { IconoCheuron, IconoSalir } from '@/components/iconos'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'

/** Datos de la sesión, acceso al perfil y cierre de sesión. */
export default function HojaCuenta({ abierta, onCerrar }) {
  const [saliendo, setSaliendo] = useState(false)
  const { user, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const email = user?.email ?? ''
  const inicial = (email[0] ?? 'D').toUpperCase()

  async function handleCerrarSesion() {
    setSaliendo(true)
    try {
      await cerrarSesion()
      navigate('/login', { replace: true })
    } finally {
      setSaliendo(false)
    }
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} etiqueta="Tu cuenta">
      {(cerrar) => (
        <>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marca-800 text-base font-bold text-white">
              {inicial}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Tu cuenta</p>
              <p className="truncate text-sm text-slate-600">{email}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                // Navegamos y cerramos a la vez: la hoja baja dejando ver el perfil.
                navigate('/perfil')
                cerrar()
              }}
              className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
            >
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-900">Mi perfil</span>
                <span className="mt-0.5 block text-sm text-slate-600 text-pretty">
                  Tu nombre, edad, peso y altura. Con esto ajustamos tus recomendaciones.
                </span>
              </span>
              <IconoCheuron className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            <div className="border-t border-slate-200 pt-2">
              <button
                type="button"
                onClick={handleCerrarSesion}
                disabled={saliendo}
                className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-3 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 disabled:opacity-60"
              >
                {saliendo ? (
                  <Spinner className="h-5 w-5 text-slate-500" />
                ) : (
                  <IconoSalir className="h-5 w-5 text-slate-500" />
                )}
                {saliendo ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </button>
            </div>
          </div>
        </>
      )}
    </Hoja>
  )
}
