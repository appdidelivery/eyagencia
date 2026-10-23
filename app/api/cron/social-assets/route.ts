import {NextRequest, NextResponse} from 'next/server'
import {renderPendingSocialMedia} from '../../../../scripts/social-media-render.mjs'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest){
  if(!process.env.CRON_SECRET ||
      request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET){
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  }
  if(process.env.VERCEL_ENV!=='production' ||
     process.env.CONTENT_AGENT_MEDIA_RENDER_ENABLED!=='true'){
    return NextResponse.json({ok:true,skipped:'Renderização social desativada.'})
  }
  try{
    const result=await renderPendingSocialMedia({maxPackages:2})
    console.info('[social-assets-cron]',JSON.stringify(result))
    return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}})
  }catch(error){
    console.error('[social-assets-cron]',error instanceof Error?error.message:'unknown')
    return NextResponse.json({ok:false,error:'Falha do renderizador. Consulte logs.'},{status:500})
  }
}
