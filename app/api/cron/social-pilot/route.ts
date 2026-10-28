import {NextRequest,NextResponse} from 'next/server'
import {runOneTimeSocialPilot} from '../../social-agent/engine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET ||
      request.headers.get('authorization') !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  }
  try {
    const result = await runOneTimeSocialPilot()
    return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}})
  } catch {
    return NextResponse.json({ok:false,error:'Falha no piloto; consulte os registros.'},{status:500})
  }
}
