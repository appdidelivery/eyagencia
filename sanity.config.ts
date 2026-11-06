'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import BookImportTool from './sanity/tools/BookImportTool'
import DiegoBioInsightsTool from './sanity/tools/DiegoBioInsightsTool'
import AcademiaInsightsTool from './sanity/tools/AcademiaInsightsTool'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  tools: [{name:'importar-livros',title:'Importar livros',component:BookImportTool},{name:'bio-insights',title:'Bio · cliques',component:DiegoBioInsightsTool},{name:'academia-insights',title:'Academia · Alunos',component:AcademiaInsightsTool}],
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
