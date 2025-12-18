/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Playpen Sans', 'sans-serif'],
				heading: ['Londrina Solid', 'cursive'],
				brand: ['Antonio', 'sans-serif'],
			},
			colors: {
				// Paleta personalizada basada en tu imagen
				farma: {
					primary: '#9504E2',    // El violeta vibrante principal [cite: 1]
					secondary: '#762CB6',  // Violeta más oscuro (ideal para hover) [cite: 3]
					accent: '#CB97FB',     // Lila claro (ideal para fondos suaves) [cite: 2]
					highlight: '#CA95F9',  // Lila muy similar al accent (detalles) [cite: 4]
					muted: '#A476CD',      // Violeta desaturado (bordes o textos secundarios) [cite: 5]
					text: '#363636',       // Gris oscuro (para textos principales) [cite: 6]
					gray: '#A4A4A4',       // Gris medio (para placeholders o bordes) [cite: 7]
					white: '#FFFFFF',  
					// --- AGREGADOS FUNCIONALES (Semánticos) ---
					// Un verde menta vibrante que contrasta genial con el violeta
					success: '#10B981', 
					// Un verde más oscuro para el hover del botón de compra
					successHover: '#059669', 
					
					// Un rojo suave, no agresivo, para errores
					error: '#EF4444', 
					
					// Un naranja cálido para advertencias (Poco stock)
					warning: '#F59E0B',    // Blanco puro
				},
			},
		},
	},
	plugins: [],
};