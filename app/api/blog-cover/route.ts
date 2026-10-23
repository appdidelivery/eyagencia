import {NextRequest} from 'next/server'
import {buildEditorialSvgCover} from '../content-agent/editorialCover'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get('title') || '').trim().slice(0, 190)
  const slug = (req.nextUrl.searchParams.get('slug') || '').trim().slice(0, 100)
  if (title.length < 5 || slug.length < 5) return new Response('Invalid article', {status: 400})
  const svg = buildEditorialSvgCover({title, slug})
  return new Response(new Uint8Array(svg), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
