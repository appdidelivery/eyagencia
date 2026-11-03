import {NextRequest, NextResponse} from 'next/server'
import {publishNextEyagenciaCarousel} from '../../social-agent/eyagenciaCarousel'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET ||
      request.headers.get('authorization') !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ok: false, error: 'Não autorizado.'}, {status: 401})
  }
  try {
    const result = await publishNextEyagenciaCarousel()
    console.info('[eyagencia-carousel-cron]', JSON.stringify(result))
    return NextResponse.json({
      ok: result.status !== 'verification_required' && result.status !== 'failed',
      ...result,
    }, {headers: {'Cache-Control': 'no-store'}})
  } catch (error) {
    console.error('[eyagencia-carousel-cron] failed', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ok: false, error: 'Falha de publicação. Consulte o monitoramento.'}, {status: 500})
  }
}
