import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/Button'
import GoogleButton from '@/components/GoogleButton'
import Separador from '@/components/Separador'
import TextField from '@/components/TextField'
import { useAuth } from '@/context/AuthContext'
import { mensajeDeError } from '@/lib/errores'

export default function Login() {
  const { iniciarSesion, iniciarSesionConGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(location.state?.error ?? '')
  const [enviando, setEnviando] = useState(false)
  const [yendoAGoogle, setYendoAGoogle] = useState(false)

  // Si venía de una ruta protegida, lo devolvemos ahí después de entrar.
  const destino = location.state?.from?.pathname ?? '/'
  const avisoRegistro = location.state?.aviso ?? ''

  async function handleGoogle() {
    setError('')
    setYendoAGoogle(true)

    try {
      // Redirige a Google: si todo va bien, esta pantalla ya no vuelve.
      await iniciarSesionConGoogle(destino)
    } catch (err) {
      setError(mensajeDeError(err))
      setYendoAGoogle(false)
    }
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await iniciarSesion({ email: email.trim(), password })
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Iniciar sesión"
      subtitulo="Ingresá con tu email y contraseña para ver tu seguimiento."
      pie={
        <>
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/crear-cuenta" className="font-semibold text-marca-700 hover:text-marca-900">
            Creá una gratis
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {avisoRegistro ? <Alert tipo="exito">{avisoRegistro}</Alert> : null}
        <Alert tipo="error">{error}</Alert>

        <GoogleButton cargando={yendoAGoogle} onClick={handleGoogle} disabled={enviando}>
          {yendoAGoogle ? 'Abriendo Google…' : 'Ingresar con Google'}
        </GoogleButton>

        <Separador texto="o con tu email" />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>

        <TextField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tunombre@email.com"
          autoComplete="email"
          inputMode="email"
          required
        />

        <TextField
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          required
        />

        <Button type="submit" cargando={enviando} disabled={yendoAGoogle} className="mt-2">
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
