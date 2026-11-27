import {createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {getCrmUser} from './crm-google-session'
import {googleClientId,googleClientSecret,GOOGLE_REPUTATION_REDIRECT_URI} from './reputation-google-session'
import {isBrand,isChannel,discoverBinding,saveBinding,disconnectBinding,googleJson} from './social-google-binding'
const origin='https://eyagencia.com.br',cookie='__Host-ey_social_oauth'
const opts={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/'}
const result=(status:string)=>NextResponse.redirect(origin+'/admin/social?status='+encodeURIComponent(status),303)
const evidenceCookie='__Host-ey_social_diagnostic'
function evidenceSignature(body:string){return createHmac('sha256',googleClientSecret()).update('social-diagnostic-v1:'+body).digest('base64url')}
export async function diagnosticEvidence(sub:string){
 try{
  const value=(await cookies()).get(evidenceCookie)?.value||''
  const [body,sig,...extra]=value.split('.')
  if(!body||!sig||extra.length)return null
  const expected=evidenceSignature(body)
  if(Buffer.byteLength(sig)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null
  const data=JSON.parse(Buffer.from(body,'base64url').toString('utf8'))
  if(data.sub!==sub||!isBrand(data.brand)||!isChannel(data.channel)||typeof data.exp!=='number'||data.exp<Date.now())return null
  return {brand:data.brand,channel:data.channel}
 }catch{return null}
}
export const isSocialState=(state:string|null)=>Boolean(state?.startsWith('social.'))
export async function beginSocialOAuth(request:Request){
 const user=await getCrmUser();if(!user)return NextResponse.redirect(origin+'/admin',303)
 if(process.env.VERCEL_ENV!=='production')return result('production_only')
 const form=await request.formData(),brand=form.get('brand'),channel=form.get('channel')
 if(request.headers.get('origin')!==origin||!isBrand(brand)||!isChannel(channel))return result('invalid')
 if(form.get('action')==='disconnect'){
  if(form.get('confirm')!=='yes')return result('consent_required')
  try{await disconnectBinding(brand,channel);return result('disconnected')}catch{return result('connection_failed')}
 }
 if(form.get('consent')!=='yes')return result('consent_required')
 const diagnostic=form.get('action')==='diagnostic'
 if(!diagnostic&&process.env.SOCIAL_GOOGLE_BINDINGS_ENABLED!=='true')return result('binding_disabled')
 const state='social.'+randomBytes(32).toString('base64url'),verifier=randomBytes(48).toString('base64url')
 const jar=await cookies()
 jar.set(cookie,JSON.stringify({state,verifier,brand,channel,diagnostic,sub:user.sub}),{...opts,maxAge:600})
 const url=new URL('https://accounts.google.com/o/oauth2/v2/auth')
 url.search=new URLSearchParams({client_id:googleClientId(),redirect_uri:GOOGLE_REPUTATION_REDIRECT_URI,
 response_type:'code',scope:channel==='gbp'?'https://www.googleapis.com/auth/business.manage':'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
 access_type:diagnostic?'online':'offline',prompt:'consent select_account',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString()
 return NextResponse.redirect(url,303)
}
export async function finishSocialOAuth(request:Request){
 if(process.env.VERCEL_ENV!=='production')return result('production_only')
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
  if(typeof data.access_token!=='string'||(s.diagnostic!==true&&typeof data.refresh_token!=='string'))return result('offline_access_missing')
  const granted=new Set(String(data.scope||'').split(/\s+/))
  const required=s.channel==='gbp'?['https://www.googleapis.com/auth/business.manage']:['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly']
  if(required.some(scope=>!granted.has(scope)))return result('scope_missing')
  const b=await discoverBinding(s.brand,s.channel,data.access_token)
  if(s.channel==='gbp')await googleJson('https://mybusiness.googleapis.com/v4/'+b.target+'/localPosts?pageSize=1',data.access_token)
  if(s.diagnostic===true){
   const body=Buffer.from(JSON.stringify({sub:user.sub,brand:s.brand,channel:s.channel,exp:Date.now()+600000})).toString('base64url')
   jar.set(evidenceCookie,body+'.'+evidenceSignature(body),{...opts,maxAge:600})
   return result('diagnostic_ok')
  }
  if(process.env.SOCIAL_GOOGLE_BINDINGS_ENABLED!=='true')return result('binding_disabled')
  await saveBinding(s.brand,s.channel,b.target,b.label,data.refresh_token)
  return result('connected')
 }catch(error){
  const reason=error instanceof Error?error.message:'unknown'
  return result(/^(channel_identity_not_unique|location_identity_not_unique|existing_target_mismatch|google_http_\d+|private_storage_missing)$/.test(reason)?reason:'connection_failed')
 }
}
