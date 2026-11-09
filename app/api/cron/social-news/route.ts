import {NextRequest, NextResponse} from 'next/server'
import {runIndustryNewsRadar, inspectIndustrySources} from '../../social-agent/newsRadar'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest) {
  // Preview-only smoke test: no publishing, no Sanity writes, no credential exposure.
  if(process.env.VERCEL_ENV==='preview' &&
     request.nextUrl.searchParams.get('check')==='sources') {
    const sources=await inspectIndustrySources()
    return NextResponse.json({ok:sources.every(item=>item.eligible>0),publishes:false,sources},
      {headers:{'Cache-Control':'no-store'}})
  }
  if(!process.env.CRON_SECRET ||
    request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  try {
    const result=await runIndustryNewsRadar()
    // Provider token or fetched article contents are never written to logs.
    console.info('[social-news-cron]',JSON.stringify(result))
    return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}})
  }catch(error){
    console.error('[social-news-cron] failed',
      error instanceof Error?error.message.slice(0,100):'unknown')
    return NextResponse.json({ok:false,error:'Falha na curadoria. Consulte os registros.'},{status:500})
  }
}
