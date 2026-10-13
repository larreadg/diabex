import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from '@/components/AppLayout'
import AvisoActualizacion from '@/components/AvisoActualizacion'
import AvisoServicio from '@/components/AvisoServicio'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicOnlyRoute from '@/components/PublicOnlyRoute'
import Alimentacion from '@/features/alimentacion/Alimentacion'
import Autoayuda from '@/features/autoayuda/Autoayuda'
import Guia from '@/features/autoayuda/Guia'
import Perfil from '@/features/perfil/Perfil'
import Historial from '@/features/registro/Historial'
import NuevaMedicion from '@/features/registro/NuevaMedicion'
import Registro from '@/features/registro/Registro'
import AuthCallback from '@/pages/AuthCallback'
import CrearCuenta from '@/pages/CrearCuenta'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <>
      {/* Fuera de <Routes> a propósito: este componente es el que registra el
          service worker, así que tiene que montarse también en /login, que es
          desde donde mucha gente va a instalar la app. */}
      <AvisoActualizacion />

      <AvisoServicio>
        <Routes>
          {/* Rutas públicas: sólo visibles si NO hay sesión.
              El alta de cuenta vive en /crear-cuenta porque /registro es la
              pestaña de mediciones de la app. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            <Route path="/register" element={<Navigate to="/crear-cuenta" replace />} />
          </Route>

          {/* Vuelta desde Google: sin guardas, decide sola a dónde mandar al usuario */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Rutas privadas: requieren sesión iniciada.
              Las tres primeras son las pestañas de la barra inferior; el orden acá
              es el mismo que en el array PESTANAS de components/TabBar.jsx. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/registro" replace />} />
              <Route path="alimentacion" element={<Alimentacion />} />
              <Route path="registro" element={<Registro />} />
              <Route path="registro/nuevo" element={<NuevaMedicion />} />
              <Route path="registro/historial" element={<Historial />} />
              <Route path="autoayuda" element={<Autoayuda />} />
              <Route path="autoayuda/:slug" element={<Guia />} />

              {/* Fuera de la barra de pestañas: se llega desde la hoja de cuenta. */}
              <Route path="perfil" element={<Perfil />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AvisoServicio>
    </>
  )
}
