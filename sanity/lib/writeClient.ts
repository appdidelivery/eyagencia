import {createClient} from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
