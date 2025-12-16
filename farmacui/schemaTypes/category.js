// studio/schemaTypes/category.js
export default {
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nombre de la Categoría',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL amigable)',
      type: 'slug',
      options: {
      source: 'title',
      maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descripción (Opcional)',
      type: 'text',
      rows: 2
    }
  ]
}