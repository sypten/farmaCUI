// studio/schemaTypes/product.js

// ⚠️ ¡Esta línea es la clave! Debe decir "export default"
export default {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre del Producto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL amigable)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'price',
      title: 'Precio (ARS)',
      type: 'number',
    },
{
      name: 'category',
      title: 'Categoría',
      type: 'reference', // Ahora es una referencia (link)
      to: [{type: 'category'}], // Apunta al archivo category.js
      description: 'Crea nuevas categorías en el panel principal y selecciónalas aquí.'
    },
    {
      name: 'image',
      title: 'Imagen del Producto',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'discount',
      title: 'Porcentaje de Descuento',
      type: 'number',
      description: 'Ej: 20 para un 20% OFF. Dejar vacío o en 0 si no tiene descuento.',
      validation: Rule => Rule.min(0).max(100)
    },
    {
      name: 'description',
      title: 'Descripción del Producto',
      type: 'text',
      description: 'Resumen general del producto.',
      rows: 4
    },
    {
      name: 'usage',
      title: '¿Para qué sirve? (Modo de uso)',
      type: 'text',
      rows: 3
    },
    {
      name: 'benefits',
      title: 'Propiedades / Beneficios Principales',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Ej: Hipoalergénico, Sin parabenos, etc.'
    },
    {
      name: 'guarantees',
      title: 'Textos de Garantía',
      type: 'array',
      description: 'Ej: 🚚 Envíos a todo el país (Agrega uno por línea)',
      of: [{type: 'string'}]
    },
  ],
}