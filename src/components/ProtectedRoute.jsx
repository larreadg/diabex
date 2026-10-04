import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { PantallaCargando } from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'

/**
 * Envuelve las rutas que requieren sesión iniciada.
 * Si el usuario no está autenticado lo manda a /login y recuerda a dónde
 * quería ir, para volver ahí después de loguearse.
 */
export default function ProtectedRoute({ children }) {
  const { autenticado, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return <PantallaCargando mensaje="Verificando tu sesión…" />

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}
