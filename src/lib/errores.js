// Traducción de los errores de Supabase Auth a mensajes claros en español.
// Supabase expone un `code` estable (recomendado) y, en algunos casos, sólo el
// mensaje en inglés: contemplamos ambos.

const FALTA_TABLA =
  'Todavía no está creada la tabla que guarda estos datos en Supabase. Ejecutá los archivos de supabase/migraciones/ en el SQL Editor del proyecto.'

const POR_CODIGO = {
  invalid_credentials: 'El email o la contraseña no son correctos.',
  email_not_confirmed:
    'Todavía no confirmaste tu email. Revisá tu casilla y hacé clic en el enlace que te enviamos.',
  user_already_exists: 'Ya existe una cuenta registrada con ese email.',
  email_exists: 'Ya existe una cuenta registrada con ese email.',
  weak_password: 'La contraseña es demasiado débil. Usá al menos 6 caracteres.',
  over_email_send_rate_limit:
    'Enviamos demasiados emails a esa dirección. Esperá unos minutos y volvé a intentar.',
  over_request_rate_limit:
    'Hiciste demasiados intentos seguidos. Esperá un momento y volvé a intentar.',
  validation_failed: 'Revisá los datos ingresados: hay algún campo inválido.',
  email_address_invalid: 'El email ingresado no es válido.',
  same_password: 'La nueva contraseña debe ser distinta a la anterior.',
  user_not_found: 'No encontramos ninguna cuenta con ese email.',
  session_expired: 'Tu sesión expiró. Volvé a iniciar sesión.',
  signup_disabled: 'El registro de nuevas cuentas está deshabilitado por el momento.',
  provider_disabled:
    'El ingreso con Google todavía no está habilitado en este proyecto de Supabase.',
  bad_oauth_state:
    'El ingreso con Google se interrumpió. Volvé a intentar desde esta misma pestaña.',
  flow_state_expired: 'El intento de ingreso expiró. Probá de nuevo.',
  flow_state_not_found: 'El intento de ingreso expiró. Probá de nuevo.',
  access_denied: 'Cancelaste el ingreso con Google. Podés volver a intentar cuando quieras.',
  provider_email_needs_verification:
    'Tenés que verificar tu email en Google antes de poder ingresar.',

  // Códigos de Postgres y PostgREST, no de Auth. Aparecen mientras falten
  // migraciones por correr en el proyecto de Supabase.
  '42P01': FALTA_TABLA,
  PGRST205: FALTA_TABLA,
  '42501': 'No tenés permiso para acceder a estos datos.',

  // Códigos que devuelve la edge function `daily-nutrition-plan`. Vienen en el
  // cuerpo de la respuesta, no en una excepción: `features/alimentacion/datos.js`
  // los abre y los deja en `error.code` para que caigan acá.
  perfil_incompleto:
    'Necesitamos tu peso y tu altura para armar el plan. Completalos en tu perfil y volvé a intentar.',
  sin_sesion: 'Tu sesión expiró. Volvé a iniciar sesión.',
  desfase_invalido:
    'La zona horaria de tu dispositivo no es válida. Revisá la fecha y la hora del teléfono.',
  sin_clave: 'Todavía falta configurar la clave del asistente en Supabase (OPENAI_API_KEY).',
  modelo_no_responde:
    'El asistente no está respondiendo en este momento. Volvé a intentar en unos minutos.',
  plan_ilegible: 'No pudimos armar tu plan de hoy. Volvé a intentar en unos minutos.',
  // El plan se descartó porque cruzaba un límite de Diabex (una dosis, por
  // ejemplo). No es un error de red: es el cortafuego haciendo su trabajo.
  plan_rechazado:
    'Descartamos el plan que se generó porque no cumplía nuestras reglas de seguridad. Volvé a intentar.',
}

const POR_MENSAJE = [
  [/invalid login credentials/i, POR_CODIGO.invalid_credentials],
  [/email not confirmed/i, POR_CODIGO.email_not_confirmed],
  [/user already registered|already registered/i, POR_CODIGO.user_already_exists],
  [/password should be at least/i, POR_CODIGO.weak_password],
  [/unable to validate email address|invalid email/i, POR_CODIGO.email_address_invalid],
  [/rate limit|too many requests/i, POR_CODIGO.over_request_rate_limit],
  [/unsupported provider|provider is not enabled/i, POR_CODIGO.provider_disabled],
  [/failed to fetch|network/i, 'No pudimos conectarnos. Revisá tu conexión a internet.'],
  [/does not exist|schema cache/i, FALTA_TABLA],
]

const GENERICO = 'Ocurrió un error inesperado. Volvé a intentar en unos segundos.'

/**
 * Errores del ingreso con Google: vuelven como parámetros en la URL del
 * callback (`?error=...&error_code=...`), no como una excepción.
 */
export function mensajeDeErrorOAuth({ error, codigo, descripcion } = {}) {
  if (!error && !codigo) return ''

  if (codigo && POR_CODIGO[codigo]) return POR_CODIGO[codigo]
  if (error && POR_CODIGO[error]) return POR_CODIGO[error]

  if (descripcion) {
    const coincidencia = POR_MENSAJE.find(([patron]) => patron.test(descripcion))
    if (coincidencia) return coincidencia[1]
  }

  return 'No pudimos completar el ingreso con Google. Volvé a intentar.'
}

export function mensajeDeError(error) {
  if (!error) return GENERICO

  if (error.code && POR_CODIGO[error.code]) return POR_CODIGO[error.code]

  const texto = error.message ?? String(error)
  const coincidencia = POR_MENSAJE.find(([patron]) => patron.test(texto))
  if (coincidencia) return coincidencia[1]

  return GENERICO
}
