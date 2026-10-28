import {NextRequest, NextResponse} from 'next/server'
import {createHash} from 'node:crypto'
import {makeBrandSocialSvg} from '../../../../scripts/brand-social-visual.mjs'
import {renderBrandArt} from '../../../../scripts/render-brand-art.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Safe, bounded production smoke test. No Meta access, no Sanity writes,
// no user-supplied caption/topic; images are public brand artwork only.
const samples = {
  'velo-delivery': 'Como organizar melhor seu cardápio digital',
  eyagencia: 'Como acompanhar métricas de um e-commerce',
} as const

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get('brand') || ''
  if (!Object.prototype.hasOwnProperty.call(samples,brand)) {
    return NextResponse.json({ok:false,error:'Identidade não suportada.'},{status:400})
  }
  try {
    const slug = brand as keyof typeof samples
    const png = await renderBrandArt(makeBrandSocialSvg({
      slug, topic:samples[slug], date:'2026-10-28',
    }))
    const headers = {'Cache-Control':'public, s-maxage=3600, stale-while-revalidate=86400'}
    if (request.nextUrl.searchParams.get('check') === '1') {
      return NextResponse.json({
        ok:true,brand,dimensions:'1080x1080',bytes:png.length,
        checksum:createHash('sha256').update(png).digest('hex').slice(0,20),
        font:'Noto Sans',renderGate:'passed',
        publishes:false,
      },{headers})
    }
    return new Response(new Uint8Array(png),{
      headers:{...headers,'Content-Type':'image/png','X-Content-Type-Options':'nosniff'},
    })
  } catch {
    return NextResponse.json({ok:false,error:'Falha no teste visual: mídia não liberada.'},{status:503})
  }
}
