import {NextRequest,NextResponse} from 'next/server'
import {runVeloBlogSocial} from '../../social-agent/engine'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest) {
  if(!process.env.CRON_SECRET ||
     request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  try{
    const result=await runVeloBlogSocial()
    console.info('[velo-blog-social-cron]',JSON.stringify({
      enabled:result.enabled,day:'day' in result?result.day:null,
      results:result.results.map(item=>({brand:item.brand,status:item.status,detail:item.detail||null})),
    }))
    return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}})
  }catch{
    return NextResponse.json({ok:false,error:'Falha no publicador social do blog Velo.'},{status:500})
  }
}
