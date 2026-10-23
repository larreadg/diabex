import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    /**
     * Diabex como app instalable.
     *
     * Dos decisiones que importan más de lo que parecen:
     *
     * 1. **Nada de Supabase se guarda en caché.** No hay ninguna regla de
     *    `runtimeCaching` para el dominio del proyecto, así que las mediciones
     *    y el perfil salen siempre de la red. En una app de salud, mostrar un
     *    valor viejo como si fuera el de ahora es peor que no mostrar nada: sin
     *    conexión aparecen los estados de error que las pantallas ya tienen.
     *
     * 2. **La versión nueva se avisa, no se impone** (`registerType: 'prompt'`).
     *    Con `autoUpdate` la página se recarga sola al activarse el service
     *    worker, y acá eso puede pasar con el cuestionario de una medición a
     *    medio completar. El aviso lo muestra <AvisoActualizacion />.
     */
    VitePWA({
      registerType: 'prompt',

      // Se listan uno por uno a propósito. En `public/` viven también los
      // originales de 4096 px del logo, y un `**/*.png` los metería en la
      // precarga: más de 1 MB que nadie descarga hoy.
      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
        'logo-diabex.png',
        'icono-192.png',
        'icono-512.png',
        'icono-maskable-512.png',
      ],

      manifest: {
        id: '/',
        name: 'Diabex',
        short_name: 'Diabex',
        description: 'Seguimiento simple y diario para personas con diabetes tipo 1.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f8fafc',
        theme_color: '#ffffff',
        icons: [
          { src: '/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // El sistema recorta este a un círculo: la marca está dentro de la
          // zona segura y el fondo llega hasta el borde.
          {
            src: '/icono-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // Anotar es lo de todos los días: que esté a un mantenido del ícono.
        shortcuts: [
          {
            name: 'Anotar una medición',
            short_name: 'Anotar',
            url: '/registro/nuevo',
            icons: [{ src: '/icono-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },

      workbox: {
        // Sólo el resultado del build. Las imágenes van por `includeAssets`.
        globPatterns: ['**/*.{js,css,html}'],
        // El informe en PDF necesita red igual (las mediciones vienen de
        // Supabase), así que precargarlo sería sumar casi 1 MB a cada
        // instalación para algo que sin conexión no puede funcionar.
        globIgnores: ['assets/informe/**'],

        // La app es una SPA: cualquier ruta se resuelve con index.html. El
        // callback de Google también, porque el token viaja en el fragmento y
        // lo lee el cliente.
        navigateFallback: 'index.html',

        runtimeCaching: [
          // Manrope vive en el CDN de Google. Sin esto, la app instalada se ve
          // con la tipografía del sistema apenas se corta la conexión.
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-hojas' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-archivos',
              // Las fuentes tienen hash en la URL: si cambian, cambia la URL.
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // jsPDF, sus dependencias opcionales y el generador del informe van a
        // una carpeta propia: así el service worker los deja afuera por ruta,
        // sin depender de cómo se llame cada pedazo.
        chunkFileNames(pedazo) {
          const delInforme = pedazo.moduleIds.some((id) =>
            /\/node_modules\/(jspdf|jspdf-autotable|html2canvas|canvg|dompurify)\/|\/registro\/informe\//.test(
              id,
            ),
          )
          return delInforme ? 'assets/informe/[name]-[hash].js' : 'assets/[name]-[hash].js'
        },
        assetFileNames(archivo) {
          const nombre = archivo.names?.[0] ?? ''
          return /^Manrope-.*\.ttf$/.test(nombre)
            ? 'assets/informe/[name]-[hash][extname]'
            : 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
