import {writeClient} from '../../../sanity/lib/writeClient'

type Brand = 'eyagencia' | 'velo-delivery'
type Source = {name:string; handle:string; domains:string[]; linkedByOfficialSite?:boolean}
type Media = {id?:string; caption?:string; media_type?:string; permalink?:string; timestamp?:string}
type Discovery = {business_discovery?: {username?:string; website?:string; media?:{data?:Media[]}}; error?:{code?:number}}
type Candidate = {brand:Brand; source:Source; media:Media; score:number}
type Outcome = {brand:Brand; status:string; source?:string; permalink?:string; reason?:string}

// Candidate usernames are not assumed official. The Meta-returned website is
// checked against the publisher domain before considering any content.
const SOURCES:Record<Brand,Source[]> = {
  eyagencia:[
    {name:'E-Commerce Brasil',handle:'ecommercebrasil',domains:['ecommercebrasil.com.br']},
    {name:'Loja Integrada',handle:'lojaintegrada',domains:['lojaintegrada.com.br'],linkedByOfficialSite:true},
    {name:'Tray',handle:'traycommerce',domains:['tray.com.br']},
    {name:'VTEX',handle:'vtex',domains:['vtex.com']},
    {name:'Nuvemshop',handle:'nuvemshop',domains:['nuvemshop.com.br']},
  ],
  'velo-delivery':[
    {name:'Abrasel',handle:'abrasel',domains:['abrasel.com.br']},
    {name:'Sebrae',handle:'sebrae',domains:['sebrae.com.br']},
    {name:'iFood Parceiros',handle:'ifoodparceiros',domains:['ifood.com.br']},
  ],
}
const RELEVANCE:Record<Brand,RegExp> = {
  eyagencia:/e-?commerce|com[eé]rcio eletr[oô]nico|loja virtual|marketplace|checkout|varejo digital|marketing digital|SEO|tr[aá]fego|busca|convers[aã]o|plataforma|intelig[eê]ncia artificial|log[ií]stica|black friday|whatsapp/i,
  'velo-delivery':/delivery|restaurante|foodservice|gastronom|bares|card[aá]pio|pedido|fideliz|atendimento|cozinha|marketing|consumidor|gest[aã]o|opera[cç][aã]o|vendas|food|pix|pagamento|faturamento/i,
}
const REJECT=/elei[cç][aã]o|pol[ií]tic|boicote|den[uú]ncia|trag[eé]dia|crime|viol[eê]ncia|cupom|sorteio|giveaway|promessa garantida/i
const LIMIT_PER_WEEK=3
const GRAPH='https://graph.facebook.com/v26.0'

function localDay(now=new Date()) {
  return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)
}
function monday(day:string) {
  const value=new Date(day+'T12:00:00Z')
  const weekday=value.getUTCDay()
  value.setUTCDate(value.getUTCDate()-((weekday+6)%7))
  return value.toISOString().slice(0,10)
}
function weekday(day:string) {return new Date(day+'T12:00:00Z').getUTCDay()}
function validInstagramPost(value:string) {
  try {
    const u=new URL(value)
    return u.protocol==='https:' &&
      (u.hostname==='www.instagram.com'||u.hostname==='instagram.com') &&
      /^\/(p|reel)\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname) && !u.username && !u.password
  } catch{return false}
}
function verifiedSource(source:Source,accountWebsite:string) {
  if (source.linkedByOfficialSite) return true
  try {
    const hostname=new URL(accountWebsite).hostname.toLowerCase()
    return source.domains.some(domain=>hostname===domain||hostname.endsWith('.'+domain))
  } catch{return false}
}
function identity(brand:Brand) {
  const suffix=brand==='eyagencia'?'EYAGENCIA':'VELO_DELIVERY'
  const id=process.env['SOCIAL_META_INSTAGRAM_ID_'+suffix]
  const token=process.env['SOCIAL_META_PAGE_TOKEN_'+suffix]
  return id && /^\d{8,30}$/.test(id) && token ? {id,token} : null
}
async function discover(brand:Brand,source:Source):Promise<Candidate[]> {
  const auth=identity(brand)
  if(!auth) throw new Error('meta_credentials_missing')
  const url=new URL(GRAPH+'/'+auth.id)
  url.searchParams.set('fields','business_discovery.username('+source.handle+')'+
    '{username,website,media.limit(8){id,caption,media_type,permalink,timestamp}}')
  const response=await fetch(url,{
    headers:{Authorization:'Bearer '+auth.token},
    cache:'no-store',signal:AbortSignal.timeout(14000),
  })
  const data=await response.json().catch(()=>({})) as Discovery
  if(!response.ok) throw new Error('meta_discovery_http_'+response.status+'_code_'+(data.error?.code||'unknown'))
  const account=data.business_discovery
  if(!account||account.username?.toLowerCase()!==source.handle||
     !verifiedSource(source,account.website||''))throw new Error('publisher_not_verified')
  const now=Date.now()
  return (account.media?.data||[]).filter(item=>{
    const when=Date.parse(item.timestamp||'')
    const age=now-when
    return Boolean(item.id && item.permalink && validInstagramPost(item.permalink) &&
      Number.isFinite(when) && age>=0 && age<=10*86400000 &&
      RELEVANCE[brand].test(item.caption||'') && !REJECT.test(item.caption||''))
  }).map(media=>{
    const excerpt=(media.caption||'').slice(0,700)
    const matches=excerpt.match(new RegExp(RELEVANCE[brand].source,'gi'))||[]
    const freshness=Math.max(0,10-Math.floor((now-Date.parse(media.timestamp||''))/86400000))
    return {brand,source,media,score:Math.min(5,matches.length)*3+freshness}
  })
}
async function choose(brand:Brand,day:string):Promise<Outcome> {
  if(!identity(brand)) return {brand,status:'meta_credentials_missing'}
  const weekStart=monday(day)
  const existing=await writeClient.fetch<Array<{_id:string;sourceHandle:string;originalMediaId:string}>>(
    '*[_type=="socialNativeRepost" && brand==$brand && weekStart==$weekStart]',
    {brand,weekStart},
  )
  if(existing.length>=LIMIT_PER_WEEK)return {brand,status:'weekly_limit_reached'}
  if(existing.some(e=>e._id==='native-repost-'+brand+'-'+day))
    return {brand,status:'already_curated_today'}
  const outcomes=await Promise.allSettled(SOURCES[brand].map(source=>discover(brand,source)))
  const candidates:Candidate[]=[]
  const failures:string[]=[]
  for(let i=0;i<outcomes.length;i++){
    const result=outcomes[i]
    if(result.status==='fulfilled')candidates.push(...result.value)
    else failures.push(SOURCES[brand][i].name+': '+
      (result.reason instanceof Error?result.reason.message.slice(0,70):'unavailable'))
  }
  const usedIds=new Set(existing.map(e=>e.originalMediaId))
  const usedSources=new Set(existing.map(e=>e.sourceHandle))
  const seen=await writeClient.fetch<string[]>(
    '*[_type=="socialNativeRepost" && brand==$brand].originalMediaId',{brand},
  )
  for(const id of seen)usedIds.add(id)
  const ranked=candidates.filter(c=>!usedIds.has(c.media.id||''))
    .sort((a,b)=>((b.score+(usedSources.has(b.source.handle)?0:8))-
                   (a.score+(usedSources.has(a.source.handle)?0:8))) ||
                   (b.media.timestamp||'').localeCompare(a.media.timestamp||''))
  const pick=ranked[0]
  if(!pick)return {brand,status:'no_eligible_instagram_posts',reason:failures.join('; ').slice(0,230)}
  const permalink=pick.media.permalink!
  // Store permalink and an editorial suggestion only. NEVER resubmit media to
  // Meta: the native Instagram Repost action is not exposed by this API.
  try{
    await writeClient.create({
      _id:'native-repost-'+brand+'-'+day,
      _type:'socialNativeRepost',
      brand,day,weekStart,status:'awaiting_native_repost',
      sourceName:pick.source.name,sourceHandle:pick.source.handle,
      originalMediaId:pick.media.id,originalPermalink:permalink,
      originalPublishedAt:pick.media.timestamp,
      mediaType:pick.media.media_type||'UNKNOWN',
      captionExcerpt:(pick.media.caption||'').slice(0,600),
      editorialNote:brand==='eyagencia'?
        'Repost sugerido: o que essa novidade muda na operação de um e-commerce?':
        'Repost sugerido: como essa notícia impacta a gestão do delivery?',
      relevanceScore:pick.score,createdAt:new Date().toISOString(),
    })
  }catch{return {brand,status:'already_reserved'}}
  console.info('[native-repost-radar] queued',JSON.stringify({
    brand,source:pick.source.name,day,score:pick.score,requiresManualAction:true,
  }))
  return {brand,status:'awaiting_native_repost',source:pick.source.name,permalink}
}
export async function runNativeRepostRadar() {
  if(process.env.VERCEL_ENV!=='production'||process.env.NATIVE_REPOST_RADAR_ENABLED!=='true')
    return {enabled:false,results:[] as Outcome[]}
  if(!process.env.SANITY_API_WRITE_TOKEN)
    return {enabled:true,results:[{brand:'eyagencia' as Brand,status:'sanity_missing'}]}
  const day=localDay()
  // Monday, Wednesday, Friday only; one candidate per brand per day.
  if(![1,3,5].includes(weekday(day)))return {enabled:true,day,results:[] as Outcome[],status:'not_scheduled'}
  const results:Outcome[]=[]
  for(const brand of ['eyagencia','velo-delivery'] as Brand[]){
    try{results.push(await choose(brand,day))}
    catch(error){results.push({brand,status:'curation_failed',
      reason:error instanceof Error?error.message.slice(0,120):'unknown'})}
  }
  return {enabled:true,day,results,notice:'Native Repost must be confirmed in Instagram; no automatic repost was attempted'}
}
