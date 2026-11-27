import {NextRequest,NextResponse} from 'next/server'
import {discoverOmni} from '../../../../scripts/sophia-audiovisual.mjs'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){
 if(process.env.VERCEL_ENV!=='preview')return NextResponse.json({error:'not-found'},{status:404})
 const configured=Boolean(process.env.SOPHIA_GEMINI_API_KEY)
 const metadata=request.nextUrl.searchParams.get('check')==='model'&&configured
 ? await discoverOmni({apiKey:process.env.SOPHIA_GEMINI_API_KEY}) : null
 return NextResponse.json({keyConfigured:configured,metadata,paidGeneration:false,metaPublication:false},{headers:{'Cache-Control':'no-store'}})
}
