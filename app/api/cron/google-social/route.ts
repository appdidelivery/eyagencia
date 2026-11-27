import {NextRequest,NextResponse} from 'next/server'
import {publishGoogleBusiness} from '../../social-agent/googleBusinessCrosspost'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300
export async function GET(request:NextRequest){
 if(!process.env.CRON_SECRET||request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return NextResponse.json({ok:false},{status:401})
 try{return NextResponse.json(await publishGoogleBusiness(),{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({ok:false,status:'failed'},{status:500})}
}
