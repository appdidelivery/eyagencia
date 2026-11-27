import {NextRequest,NextResponse} from 'next/server'
import {uploadApprovedVeloYoutube} from '../../social-agent/youtubeCrosspost'
import {publishGoogleBusiness} from '../../social-agent/googleBusinessCrosspost'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=300
export async function GET(request:NextRequest){
 if(!process.env.CRON_SECRET||request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return NextResponse.json({ok:false},{status:401})
 if(process.env.SOCIAL_GOOGLE_RELEASE_ENABLED!=='true')return NextResponse.json({ok:true,status:'homologation_only'},{headers:{'Cache-Control':'no-store'}})
 try{return NextResponse.json({gbp:await publishGoogleBusiness(),youtube:await uploadApprovedVeloYoutube()},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({ok:false,status:'failed'},{status:500})}
}
