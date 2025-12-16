// studio/schemaTypes/promotion.js
export default {
  name: 'promotion',
  title: 'Promoción / Banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título Interno',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Imagen del Banner',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Galería de Imágenes (Para Slider)',
      type: 'array',
      description: 'Sube varias fotos si quieres que este banner sea un carrusel.',
      of: [{ type: 'image', options: { hotspot: true } }],
      // Ocultar este campo si el tamaño no es "large" ayuda a no confundirse, 
      // pero por simplicidad lo dejaremos visible siempre.
    },
    {
      name: 'link',
      title: 'Enlace (Opcional)',
      description: 'Ej: /producto/dermaglos o https://google.com',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel'],
        allowRelative: true // Permite enlaces internos como /producto/algo
      })
    },
    {
      name: 'size',
      title: 'Tamaño en la Grilla',
      type: 'string',
      options: {
        list: [
          { title: 'Normal (1 espacio)', value: 'normal' },
          { title: 'Alto (Vertical - Ocupa 2 filas)', value: 'tall' },
          { title: 'Ancho (Horizontal - Ocupa 2 columnas)', value: 'wide' },
          { title: 'Gigante (2x2)', value: 'large' },
        ],
        layout: 'radio' // Se ven como botoncitos
      },
      initialValue: 'normal'
    }
  ]
}