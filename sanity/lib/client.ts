import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = '2026-07-01' // Data de hoje

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // false para garantir dados em tempo real no modo dev
})