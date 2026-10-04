import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/Button'
import GoogleButton from '@/components/GoogleButton'
import Separador from '@/components/Separador'
import TextField from '@/components/TextField'
import { useAuth } from '@/context/AuthContext'
import { mensajeDeError } from '@/lib/errores'

const LARGO_MINIMO = 6

export default function CrearCuenta() {
  const { registrarse, iniciarSesionConGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [yendoAGoogle, setYendoAGoogle] = useState(false)

  async function handleGoogle() {
    setError('')
    setYendoAGoogle(true)

    try {
      // Con Google no hace falta un paso de registro aparte: si la cuenta no
      // existe, Supabase la crea en el momento.
      await iniciarSesionConGoogle('/')
    } catch (err) {
      setError(mensajeDeError(err))
      setYendoAGoogle(false)
    }
  }

  function validar() {
    if (!email.trim()) return 'Ingresá tu email.'
    if (password.length < LARGO_MINIMO)
      return `La contraseña debe tener al menos ${LARGO_MINIMO} caracteres.`
    if (password !== repetirPassword) return 'Las contraseñas no coinciden.'
    return ''
  }

  async function handleSubmit(evento) {
    evento.preventDefault()

    const problema = validar()
    if (problema) {
      setError(problema)
      return
    }

    setError('')
    setEnviando(true)

    try {
      const data = await registrarse({ email: email.trim(), password })

      // Con la confirmación de email activada, Supabase no informa como error
      // que el email ya exista: devuelve un usuario con `identities` vacío.
      if (data.user && data.user.identities?.length === 0) {
        setError('Ya existe una cuenta registrada con ese email.')
        setEnviando(false)
        return
      }

      if (data.session) {
        // Registro sin confirmación por email: ya queda logueado.
        navigate('/', { replace: true })
        return
      }

      navigate('/login', {
        replace: true,
        state: {
          aviso:
            'Te enviamos un email para confirmar tu cuenta. Abrilo y después iniciá sesión acá.',
        },
      })
    } catch (err) {
      setError(mensajeDeError(err))
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Crear cuenta"
      subtitulo="Llevá el control de tu diabetes de forma simple y ordenada."
      pie={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-semibold text-marca-700 hover:text-marca-900">
            Iniciá sesión
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Alert tipo="error">{error}</Alert>

        <GoogleButton cargando={yendoAGoogle} onClick={handleGoogle} disabled={enviando}>
          {yendoAGoogle ? 'Abriendo Google…' : 'Crear cuenta con Google'}
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
          placeholder="Creá una contraseña"
          autoComplete="new-password"
          ayuda={`Mínimo ${LARGO_MINIMO} caracteres.`}
          required
        />

        <TextField
          label="Repetir contraseña"
          type="password"
          name="repetirPassword"
          value={repetirPassword}
          onChange={(e) => setRepetirPassword(e.target.value)}
          placeholder="Escribila de nuevo"
          autoComplete="new-password"
          required
        />

        <Button type="submit" cargando={enviando} disabled={yendoAGoogle} className="mt-2">
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
