import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
// CORRECCIÓN: Importación unificada para la versión 7+
import vercel from '@astrojs/vercel'; 

export default defineConfig({
  // Esto le dice al adaptador que queremos funciones Serverless (SSR)
  output: 'server',

  adapter: vercel({
    webAnalytics: { enabled: true },
    // En la v7 ya no hace falta especificar 'type: serverless', 
    // lo deduce automáticamente del output: 'server'
  }),

  integrations: [
    react(), 
    tailwind({
      applyBaseStyles: false,
    })
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  
  vite: {
    ssr: {
      // Esto asegura que Supabase no se rompa en el build
      noExternal: ['@supabase/supabase-js']
    }
  }
});