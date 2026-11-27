import {createHash,randomBytes,timingSafeEqual} from 'node:crypto'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {getCrmUser} from './crm-google-session'
import {googleClientId,googleClientSecret,GOOGLE_REPUTATION_REDIRECT_URI} from './reputation-google-session'
import {isBrand,isChannel,discoverBinding,saveBinding} from './social-google-binding'
const origin='https://eyagencia.com.br',cookie='__Host-ey_social_oauth'
const opts={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/'}
const result=(status:string)=>NextResponse.redirect(origin+'/admin/social?status='+encodeURIComponent(status),303)
export const isSocialState=(state:string|null)=>Boolean(state?.startsWith('social.'))
export async function beginSocialOAuth(request:Request){
 const user=await getCrmUser();if(!user)return NextResponse.redirect(origin+'/admin',303)
 const form=await request.formData(),brand=form.get('brand'),channel=form.get('channel')
 if(request.headers.get('origin')!==origin||!isBrand(brand)||!isChannel(channel))return result('invalid')
 const state='social.'+randomBytes(32).toString('base64url'),verifier=randomBytes(48).toString('base64url')
 const jar=await cookies()
 jar.set(cookie,JSON.stringify({state,verifier,brand,channel,sub:user.sub}),{...opts,maxAge:600})
 const url=new URL('https://accounts.google.com/o/oauth2/v2/auth')
 url.search=new URLSearchParams({client_id:googleClientId(),redirect_uri:GOOGLE_REPUTATION_REDIRECT_URI,
 response_type:'code',scope:channel==='gbp'?'https://www.googleapis.com/auth/business.manage':'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
 access_type:'offline',prompt:'consent select_account',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString()
 return NextResponse.redirect(url,303)
}
export async function finishSocialOAuth(request:Request){
 const jar=await cookies(),stored=jar.get(cookie)?.value;jar.set(cookie,'',{...opts,maxAge:0})
 try{
  const user=await getCrmUser(),p=new URL(request.url).searchParams,state=p.get('state'),code=p.get('code')
  if(!stored||!user||!state||!code||p.has('error'))return result('cancelled')
  const s=JSON.parse(stored)
  if(typeof s.state!=='string'||typeof s.verifier!=='string'||s.sub!==user.sub||
  Buffer.byteLength(s.state)!==Buffer.byteLength(state)||!timingSafeEqual(Buffer.from(s.state),Buffer.from(state))||
  !isBrand(s.brand)||!isChannel(s.channel))return result('invalid')
  const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',
   headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:googleClientId(),
   client_secret:googleClientSecret(),code,grant_type:'authorization_code',redirect_uri:GOOGLE_REPUTATION_REDIRECT_URI,code_verifier:s.verifier}),
   cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)})
  if(!res.ok)return result('provider_error')
  const data=await res.json()
  if(typeof data.access_token!=='string'||typeof data.refresh_token!=='string')return result('offline_access_missing')
  const b=await discoverBinding(s.brand,s.channel,data.access_token)
  await saveBinding(s.brand,s.channel,b.target,b.label,data.refresh_token)
  return result('connected')
 }catch(error){
  const reason=error instanceof Error?error.message:'unknown'
  return result(/^(channel_identity_not_unique|location_identity_not_unique|existing_target_mismatch|google_http_\d+|private_storage_missing)$/.test(reason)?reason:'connection_failed')
 }
}
