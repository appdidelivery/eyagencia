import {NextRequest,NextResponse} from 'next/server'
import {createHash} from 'node:crypto'
import {runWeeklyMotivationStories} from '../../social-agent/motivationStories'
import {makeBrandMotivationStorySvg} from '../../../../scripts/brand-social-visual.mjs'
import {renderBrandStoryArt} from '../../../../scripts/render-brand-art.mjs'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300

export async function GET(request:NextRequest){
  // Read-only preview. Never touches Sanity or Meta.
  if(process.env.VERCEL_ENV==='preview'&&request.nextUrl.searchParams.get('check')==='render'){
    try{
      const checks=[]
      for(const brand of ['eyagencia','velo-delivery']){
        const png=await renderBrandStoryArt(makeBrandMotivationStorySvg({
          slug:brand,topic:'Bom dia. Fé, disciplina e bons hábitos para começar.',
          date:'2026-11-09',
        }))
        checks.push({brand,dimensions:'1080x1920',bytes:png.length,
          checksum:createHash('sha256').update(png).digest('hex').slice(0,16)})
      }
      return NextResponse.json({ok:true,publishes:false,checks})
    }catch{return NextResponse.json({ok:false,error:'story_render_failed',publishes:false},{status:503})}
  }
  if(!process.env.CRON_SECRET||
     request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401})
  try{
    const result=await runWeeklyMotivationStories()
    console.info('[weekly-stories-cron]',JSON.stringify(result))
    return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}})
  }catch{
    return NextResponse.json({ok:false,error:'Falha na rotina de Stories.'},{status:500})
  }
}
