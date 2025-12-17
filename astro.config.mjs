import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind'; // Asumo que usas Tailwind por tus clases
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // 'server': Permite SSR (Renderizado en Servidor). 
  // Es necesario si usas cookies, rutas de API o protección de rutas en el servidor.
  output: 'server',

  // Conecta Astro con la infraestructura de Vercel
  adapter: vercel({
    webAnalytics: { enabled: true }, // Opcional: activa analíticas gratis de Vercel
  }),

  integrations: [
    react(),
    tailwind({
      // Esto ayuda si tienes problemas de estilos en producción
      applyBaseStyles: false, 
    }), 
  ],

  // Optimización de imágenes (clave para evitar errores con componentes <Image />)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  
  // Seguridad: Asegura que las variables de entorno se lean correctamente
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  }
});