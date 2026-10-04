import { Navigate, Outlet } from 'react-router-dom'

import { PantallaCargando } from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'

/**
 * Rutas sólo para visitantes (login y registro).
 * Si ya hay sesión activa, redirige al panel principal.
 */
export default function PublicOnlyRoute({ children }) {
  const { autenticado, cargando } = useAuth()

  if (cargando) return <PantallaCargando />

  if (autenticado) return <Navigate to="/" replace />

  return children ?? <Outlet />
}
