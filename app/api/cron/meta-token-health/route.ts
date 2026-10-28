import {NextRequest,NextResponse} from 'next/server'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30

// Temporary read-only diagnostic. No credential leaves the server in a log or
// response. The app cron secret is checked before any Graph API request.
export async function GET(request:NextRequest) {
  if(!process.env.CRON_SECRET ||
     request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)
    return NextResponse.json({ok:false},{status:401})

  const pageId=process.env.SOCIAL_META_PAGE_ID_VELO_DELIVERY || ''
  const instagramId=process.env.SOCIAL_META_INSTAGRAM_ID_VELO_DELIVERY || ''
  const token=process.env.SOCIAL_META_PAGE_TOKEN_VELO_DELIVERY || ''
  const result:Record<string,unknown>={
    pageIdConfigured:pageId==='1100534609816460',
    instagramIdConfigured:instagramId==='17841480632856495',
    credentialPresent:token.length>30,
  }
  if(token.length<=30){console.info('[meta-token-health]',JSON.stringify(result));return NextResponse.json({ok:false,summary:result})}
  async function graph(path:string) {
    try{
      const response=await fetch('https://graph.facebook.com/v26.0/'+path,{
        method:'GET',headers:{Authorization:'Bearer '+token},
        cache:'no-store',signal:AbortSignal.timeout(10000),
      })
      const body=await response.json().catch(()=>({})) as {
        id?:string;name?:string;
        instagram_business_account?:{id?:string};
        error?:{code?:number;error_subcode?:number;type?:string};
      }
      return {
        status:response.status,
        idMatch:body.id===pageId,
        instagramMatch:body.instagram_business_account?.id===instagramId,
        errorCode:typeof body.error?.code==='number'?body.error.code:null,
        errorSubcode:typeof body.error?.error_subcode==='number'?body.error.error_subcode:null,
      }
    }catch{return {status:0,error:'graph_unavailable'}}
  }
  const me=await graph('me?fields=id,name')
  const page=await graph(encodeURIComponent(pageId)+'?fields=id,name,instagram_business_account')
  result.me=me
  result.page=page
  result.tokenIdentifiesExpectedPage=me.status===200&&me.idMatch===true
  console.info('[meta-token-health]',JSON.stringify(result))
  return NextResponse.json({ok:true,summary:result},{headers:{'Cache-Control':'no-store'}})
}
