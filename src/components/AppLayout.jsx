import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import HojaCuenta from '@/components/HojaCuenta'
import Logo from '@/components/Logo'
import TabBar, { PestanasEscritorio } from '@/components/TabBar'
import { useAuth } from '@/context/AuthContext'

/**
 * Armazón de la app con sesión iniciada. Pensado para el teléfono primero:
 * encabezado fino arriba, contenido en el medio y la barra de pestañas fija
 * abajo. Desde `md` las pestañas suben al encabezado y la barra desaparece.
 */
export default function AppLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [cuentaAbierta, setCuentaAbierta] = useState(false)

  const inicial = (user?.email?.[0] ?? 'D').toUpperCase()

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-4">
          <Logo className="h-7" />

          <div className="ml-auto flex items-center gap-2">
            <PestanasEscritorio />

            <button
              type="button"
              onClick={() => setCuentaAbierta(true)}
              aria-haspopup="dialog"
              aria-expanded={cuentaAbierta}
              className="-mr-1.5 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marca-800 text-sm font-bold text-white">
                {inicial}
              </span>
              <span className="sr-only">Tu cuenta{user?.email ? `: ${user.email}` : ''}</span>
            </button>
          </div>
        </div>
      </header>

      {/* El padding de abajo deja libre la barra de pestañas más el área
          segura del teléfono, para que nada quede tapado al final del scroll. */}
      <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
        <div key={pathname} className="pantalla">
          <Outlet />
        </div>
      </main>

      <TabBar />

      <HojaCuenta abierta={cuentaAbierta} onCerrar={() => setCuentaAbierta(false)} />
    </div>
  )
}
