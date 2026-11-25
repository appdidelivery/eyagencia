import {NextRequest,NextResponse} from 'next/server'
import {repairLegacyBlogCovers} from '../../content-agent/repairLegacyCovers'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300
export async function GET(request:NextRequest){
  if(!process.env.CRON_SECRET||request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  if(process.env.VERCEL_ENV!=='production'||process.env.CONTENT_AGENT_COVER_REPAIR_ENABLED!=='true'||!process.env.SANITY_API_WRITE_TOKEN)
    return NextResponse.json({ok:true,skipped:'Recuperação desativada.'})
  const results=await repairLegacyBlogCovers(1)
  console.info('[blog-cover-repair]',JSON.stringify(results))
  return NextResponse.json({ok:results.every(x=>x.result==='repaired'),results})
}
