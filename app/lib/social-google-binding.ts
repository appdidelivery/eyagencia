import {createCipheriv,createDecipheriv,createHash,randomBytes} from 'node:crypto'
import {readSnapshot,writeSnapshot} from './crm-blob'
import {googleClientId,googleClientSecret} from './reputation-google-session'

export type Brand='eyagencia'|'velo-delivery'
export type Channel='gbp'|'youtube'
export const brands:Brand[]=['eyagencia','velo-delivery']
export const channels:Channel[]=['gbp','youtube']
export function isBrand(x:unknown):x is Brand{return brands.includes(x as Brand)}
export function isChannel(x:unknown):x is Channel{return channels.includes(x as Channel)}
export const brandDomain=(brand:Brand)=>brand==='eyagencia'?'eyagencia.com.br':'velodelivery.com.br'
type Binding={target:string;label:string;sealed:string;connectedAt:string}
function config(){
 const token=process.env.BLOB_READ_WRITE_TOKEN,storeId=token?.split('_')[3]
 if(!token||!storeId||! /^[A-Za-z0-9]+$/.test(storeId))throw Error('private_storage_missing')
 return {token,storeId}
}
function path(brand:Brand,channel:Channel){return 'ey-social-auth/v1/'+brand+'/'+channel+'.json'}
function key(){return createHash('sha256').update(googleClientSecret()+':ey-social-auth-v1').digest()}
function seal(refresh:string,brand:Brand,channel:Channel,target:string){
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(),iv)
 cipher.setAAD(Buffer.from(brand+'|'+channel+'|'+target))
 return Buffer.concat([iv,cipher.update(refresh,'utf8'),cipher.final(),cipher.getAuthTag()]).toString('base64url')
}
function open(b:Binding,brand:Brand,channel:Channel){
 const raw=Buffer.from(b.sealed,'base64url')
 const cipher=createDecipheriv('aes-256-gcm',key(),raw.subarray(0,12))
 cipher.setAAD(Buffer.from(brand+'|'+channel+'|'+b.target))
 cipher.setAuthTag(raw.subarray(-16))
 return Buffer.concat([cipher.update(raw.subarray(12,-16)),cipher.final()]).toString('utf8')
}
async function read(brand:Brand,channel:Channel){
 return readSnapshot<Binding>(path(brand,channel),config())
}
export async function bindingStatus(brand:Brand,channel:Channel){
 const b=(await read(brand,channel))?.rows[0]
 return b?{target:b.target,label:b.label,connectedAt:b.connectedAt}:null
}
export async function saveBinding(brand:Brand,channel:Channel,target:string,label:string,refresh:string){
 if(!refresh)throw Error('refresh_token_missing')
 const previous=await read(brand,channel)
 if(previous?.rows[0]&&previous.rows[0].target!==target)throw Error('existing_target_mismatch')
 const row={target,label,sealed:seal(refresh,brand,channel,target),connectedAt:new Date().toISOString()}
 await writeSnapshot([row],config(),path(brand,channel),previous?.version)
 const verified=(await read(brand,channel))?.rows[0]
 if(!verified||verified.sealed!==row.sealed)throw Error('binding_write_unverified')
}
export async function googleJson(url:string,token:string,init:RequestInit={}){
 const res=await fetch(url,{...init,headers:{...init.headers,Authorization:'Bearer '+token},
  cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)})
 if(!res.ok)throw Error('google_http_'+res.status)
 return res.json()
}
export async function refreshBinding(brand:Brand,channel:Channel){
 const b=(await read(brand,channel))?.rows[0]
 if(!b)throw Error('account_not_connected')
 const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',
  headers:{'Content-Type':'application/x-www-form-urlencoded'},
  body:new URLSearchParams({client_id:googleClientId(),client_secret:googleClientSecret(),
   grant_type:'refresh_token',refresh_token:open(b,brand,channel)}),
  cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)})
 if(!res.ok)throw Error('google_refresh_http_'+res.status)
 const data=await res.json()
 if(typeof data.access_token!=='string')throw Error('google_token_missing')
 return {token:data.access_token as string,target:b.target}
}
function hostname(url:string){try{return new URL(url).hostname.toLowerCase().replace(/^www\./,'')}catch{return ''}}
function brandName(s:string){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
export async function discoverBinding(brand:Brand,channel:Channel,token:string){
 if(channel==='youtube'){
  const res=await googleJson('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&maxResults=50',token)
  const expected=brand==='eyagencia'?'eyagencia':'velodelivery'
  const matches=(res.items||[]).filter((x:any)=>brandName(String(x.snippet?.title||''))===expected&&/^UC[A-Za-z0-9_-]{22}$/.test(x.id))
  if(matches.length!==1||res.nextPageToken)throw Error('channel_identity_not_unique')
  return {target:matches[0].id as string,label:String(matches[0].snippet.title)}
 }
 const matches=new Map<string,{target:string;label:string}>()
 let accountPage=''
 for(let a=0;a<5;a++){
  const au=new URL('https://mybusinessaccountmanagement.googleapis.com/v1/accounts')
  if(accountPage)au.searchParams.set('pageToken',accountPage)
  const accounts=await googleJson(au.toString(),token)
  for(const acc of accounts.accounts||[]){
   if(!/^accounts\/\d+$/.test(acc.name))continue
   let page=''
   for(let i=0;i<5;i++){
    const lu=new URL('https://mybusinessbusinessinformation.googleapis.com/v1/'+acc.name+'/locations')
    lu.searchParams.set('readMask','name,title,websiteUri');lu.searchParams.set('pageSize','100')
    if(page)lu.searchParams.set('pageToken',page)
    const locations=await googleJson(lu.toString(),token)
    for(const loc of locations.locations||[]){
     if(/^locations\/\d+$/.test(loc.name)&&hostname(loc.websiteUri||'')===brandDomain(brand)){
      const target=acc.name+'/'+loc.name
      matches.set(target,{target,label:String(loc.title||'')})
     }
    }
    page=locations.nextPageToken||'';if(!page)break
    if(i===4)throw Error('location_pagination_incomplete')
   }
  }
  accountPage=accounts.nextPageToken||'';if(!accountPage)break
  if(a===4)throw Error('account_pagination_incomplete')
 }
 if(matches.size!==1)throw Error('location_identity_not_unique')
 return [...matches.values()][0]
}
