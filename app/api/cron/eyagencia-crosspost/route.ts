import {NextRequest,NextResponse} from 'next/server'
import {publishMissingEyagenciaChannels} from '../../social-agent/eyagenciaCrosspost'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest){
  if(!process.env.CRON_SECRET ||
     request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  const dayName=new Intl.DateTimeFormat('en-US',{
    timeZone:'America/Sao_Paulo',weekday:'short',
  }).format(new Date())
  if(!['Tue','Sun'].includes(dayName))
    return NextResponse.json({ok:true,status:'not-scheduled'},{
      headers:{'Cache-Control':'no-store'},
    })
  try{
    const result=await publishMissingEyagenciaChannels()
    console.info('[eyagencia-crosspost-cron]',JSON.stringify({
      status:result.status,packageId:result.packageId||null,
      facebook:!!result.facebookId,stories:result.storyCount||0,
    }))
    return NextResponse.json({ok:!['verification_required'].includes(result.status),...result},
      {headers:{'Cache-Control':'no-store'}})
  }catch(error){
    console.error('[eyagencia-crosspost-cron] failed',
      error instanceof Error?error.message.slice(0,100):'unknown')
    return NextResponse.json({ok:false,error:'Crosspost falhou; verifique os logs.'},{status:500})
  }
}
