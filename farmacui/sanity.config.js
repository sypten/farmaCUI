import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'FarmaCUI',

  projectId: 'okx84883',
  dataset: 'productos',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
