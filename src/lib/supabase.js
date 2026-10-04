import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Revisá el archivo .env (VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY).',
  )
}

// Cliente único de Supabase para toda la aplicación.
// La publishable key es pública y segura para el frontend; la secret key
// (sb_secret_...) nunca debe usarse acá.
export const supabase = createClient(url, publishableKey, {
  auth: {
    // Mantiene la sesión en localStorage y la renueva sola: al recargar la
    // página el usuario sigue logueado.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
