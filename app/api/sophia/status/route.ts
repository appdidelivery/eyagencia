import {NextRequest,NextResponse} from 'next/server'
import {discoverOmni} from '../../../../scripts/sophia-audiovisual.mjs'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){
 const preview=process.env.VERCEL_ENV==='preview'
 const production=process.env.VERCEL_ENV==='production'
 if(!preview&&!production)return NextResponse.json({error:'not-found'},{status:404})
 const headers={'Cache-Control':'no-store'}
 if(production)return NextResponse.json({service:'Sophia',mode:'flow-mp4',scheduledReels:process.env.SOPHIA_REELS_AUTOPUBLISH_ENABLED==='true'&&process.env.SOCIAL_AGENT_ENABLED==='true'&&process.env.SOCIAL_AGENT_AUTOPUBLISH_ENABLED==='true',paidGeneration:false,approvalRequired:true,slot:'Sunday'}, {headers})
 const configured=Boolean(process.env.SOPHIA_GEMINI_API_KEY)
 const metadata=request.nextUrl.searchParams.get('check')==='model'&&configured
 ? await discoverOmni({apiKey:process.env.SOPHIA_GEMINI_API_KEY}) : null
 return NextResponse.json({keyConfigured:configured,metadata,paidGeneration:false,metaPublication:false},{headers})
}
