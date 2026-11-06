import {NextRequest,NextResponse} from 'next/server'
import {runNativeRepostRadar} from '../../social-agent/nativeRepostRadar'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest) {
  if(!process.env.CRON_SECRET ||
    request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  try {
    const result=await runNativeRepostRadar()
    console.info('[native-reposts-cron]',JSON.stringify({
      enabled:result.enabled,day:'day' in result?result.day:null,
      results:result.results.map(item=>({brand:item.brand,status:item.status,
        source:item.source||null,reason:item.reason||null})),
    }))
    return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}})
  }catch(error){
    console.error('[native-reposts-cron] failed',
      error instanceof Error?error.message.slice(0,100):'unknown')
    return NextResponse.json({ok:false,error:'Erro no radar de reposts.'},{status:500})
  }
}
