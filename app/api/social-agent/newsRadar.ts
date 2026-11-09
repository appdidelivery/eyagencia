import {writeClient} from '../../../sanity/lib/writeClient'
import {makeBrandSocialSvg} from '../../../scripts/brand-social-visual.mjs'
import {renderBrandArt} from '../../../scripts/render-brand-art.mjs'
import {
  NEWS_SOURCES, extractNewsLinks, extractNewsDate, articleHeadline,
  isRecent, rankHeadline,
} from '../../../scripts/news-source-parser.mjs'

type BrandKey = 'eyagencia' | 'velo-delivery'
type Source = {name: string; host: string; listUrl: string; articlePrefix: string}
type Article = {url: string; title: string; publishedAt: string; score: number}
type Result = {brand: BrandKey; status: string; sourceUrl?: string; instagramPostId?: string; facebookPostId?: string; reason?: string}
type MetaResult = {id?: string; status_code?: string; error?: {code?: number; error_subcode?: number}}
const GRAPH = 'https://graph.facebook.com/v26.0'
const SOURCE_LIMIT = 6
// Multiple pre-approved primary sources. The official websites are read only;
// the publication artwork and editorial commentary are fully original.
const EXTRA_SOURCES:Record<BrandKey,Source[]> = {
  eyagencia:[
    {name:'Nuvemshop',host:'www.nuvemshop.com.br',listUrl:'https://www.nuvemshop.com.br/blog/',articlePrefix:'/blog/'},
    {name:'Tray',host:'tray.com.br',listUrl:'https://tray.com.br/escola/',articlePrefix:'/escola/'},
  ],
  'velo-delivery':[],
}
function allowedSources(brand:BrandKey):Source[]{return [NEWS_SOURCES[brand] as Source,...EXTRA_SOURCES[brand]]}

function brazilDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)
}
function editorialSlot(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US',{
    timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',hourCycle:'h23',
  }).formatToParts(now)
  const weekday=parts.find(p=>p.type==='weekday')?.value
  const hour=Number(parts.find(p=>p.type==='hour')?.value)
  if ((weekday==='Wed'||weekday==='Sat') && hour>=9 && hour<=15) return 'morning'
  if (weekday==='Sat' && hour>=17 && hour<=21) return 'evening'
  return null
}
function brazilWeek(day:string) {
  const date=new Date(day+'T12:00:00Z')
  const offset=(date.getUTCDay()+6)%7
  date.setUTCDate(date.getUTCDate()-offset)
  return date.toISOString().slice(0,10)
}
async function fetchHtml(url: string, allowedHost: string) {
  const address = new URL(url)
  if(address.protocol !== 'https:' || address.hostname !== allowedHost) throw new Error('disallowed_source')
  const response = await fetch(url,{
    headers:{'Accept':'text/html','User-Agent':'EyAgencia-NewsRadar/1.0 (+https://www.eyagencia.com.br)'},
    redirect:'follow',cache:'no-store',signal:AbortSignal.timeout(16000),
  })
  // A redirect must stay on the pre-approved publisher host.
  const finalUrl=new URL(response.url)
  if(finalUrl.protocol!=='https:'||finalUrl.hostname!==allowedHost)throw new Error('source_redirect_disallowed')
  if(!response.ok) throw new Error('source_http_'+response.status)
  if(!(response.headers.get('content-type')||'').includes('text/html'))throw new Error('source_not_html')
  const html=await response.text()
  if(html.length<400 || html.length>1_600_000)throw new Error('source_html_unexpected_size')
  return html
}
async function relevantArticles(brand: BrandKey, source: Source): Promise<Article[]> {
  const indexHtml=await fetchHtml(source.listUrl,source.host)
  const links=extractNewsLinks(indexHtml,source)
    .map(link=>({...link,score:rankHeadline(link.title,brand)}))
    .filter(link=>link.score>0).slice(0,SOURCE_LIMIT)
  // Do not scrape entire sites or load source images; only check at most 6 article headers.
  const verified=await Promise.allSettled(links.map(async link=>{
    const html=await fetchHtml(link.url,source.host)
    const date=extractNewsDate(html)
    if(!date || !isRecent(date,new Date(),7))return null
    const title=articleHeadline(html)||link.title
    const score=rankHeadline(title,brand)
    if(score<=0)return null
    return {url:link.url,title,publishedAt:date.toISOString(),score} as Article
  }))
  return verified.filter((item):item is PromiseFulfilledResult<Article|null>=>item.status==='fulfilled')
    .map(item=>item.value)
    .filter((article):article is Article=>Boolean(article))
    .sort((a,b)=>b.score-a.score || b.publishedAt.localeCompare(a.publishedAt))
}

function angle(brand: BrandKey,title: string) {
  const value=title.toLowerCase()
  if(brand==='eyagencia') {
    if(/seo|busca|google|conte[uú]do/i.test(value))
      return 'Ponto para observar: clareza do catálogo, conteúdo útil e facilidade de encontrar produtos.'
    if(/intelig[eê]ncia artificial|\bia\b|agente|whatsapp/i.test(value))
      return 'Ponto para observar: onde a automação ajuda a jornada de compra e quando a operação precisa de supervisão humana.'
    if(/pagamento|checkout|cart[aã]o|pix/i.test(value))
      return 'Ponto para observar: experiência do checkout, informação clara e alternativas de pagamento.'
    return 'Ponto para observar: como a mudança pode afetar a operação, a descoberta e a experiência de compra.'
  }
  if(/pagamento|pix|vale|cart[aã]o/i.test(value))
    return 'Ponto para o gestor: revisar custos, aceitação e experiência de pagamento no estabelecimento.'
  if(/delivery|app|plataforma|pedido/i.test(value))
    return 'Ponto para o gestor: acompanhar os canais de venda, o atendimento e o controle dos pedidos.'
  if(/contrat|custo|vendas|faturamento|mercado/i.test(value))
    return 'Ponto para o gestor: acompanhar os indicadores do setor antes de tomar decisões na operação.'
  return 'Ponto para o gestor: entender o contexto e avaliar o que realmente se aplica à rotina do negócio.'
}

function captionFor(brand: BrandKey,source: Source,article: Article) {
  const opening=brand==='eyagencia'?'📰 Radar do E-commerce | EYAGENCIA':'📰 Radar do Foodservice | Velo Delivery'
  const intro='O portal '+source.name+' publicou uma notícia sobre: '+article.title+'.'
  const credit='Fonte: '+source.name+' (veículo original).'
  const url='Matéria completa: '+article.url
  const message=[opening,'',intro,'',angle(brand,article.title),'',credit,url].join('\n')
  if(message.length>2050)throw new Error('caption_too_long')
  return message
}

function credentials(brand: BrandKey) {
  const suffix=brand==='eyagencia'?'EYAGENCIA':'VELO_DELIVERY'
  const pageId=process.env['SOCIAL_META_PAGE_ID_'+suffix]
  const instagramId=process.env['SOCIAL_META_INSTAGRAM_ID_'+suffix]
  const token=process.env['SOCIAL_META_PAGE_TOKEN_'+suffix]
  if(!token || !instagramId || !/^\d{8,30}$/.test(instagramId))return null
  return {pageId,instagramId,token}
}
async function graph(method:'GET'|'POST',endpoint:string,token:string,params:Record<string,string>={}):Promise<MetaResult> {
  const url=new URL(GRAPH+'/'+endpoint)
  if(method==='GET')for(const [k,v]of Object.entries(params))url.searchParams.set(k,v)
  const response=await fetch(url,{
    method,headers:{
      Authorization:'Bearer '+token,
      ...(method==='POST'?{'Content-Type':'application/x-www-form-urlencoded'}:{}),
    },
    ...(method==='POST'?{body:new URLSearchParams(params)}:{}),
    cache:'no-store',signal:AbortSignal.timeout(18000),
  })
  const json=await response.json().catch(()=>({})) as MetaResult
  if(!response.ok || (method==='POST'&&!json.id))
    throw new Error('meta_'+response.status+'_code_'+(json.error?.code||'unknown'))
  return json
}
function imageJpeg(url:string) {
  const parsed=new URL(url)
  if(parsed.protocol!=='https:'||parsed.hostname!=='cdn.sanity.io'||
     !parsed.pathname.startsWith('/images/'))throw new Error('image_not_from_sanity')
  parsed.search=''
  parsed.searchParams.set('fm','jpg')
  parsed.searchParams.set('w','1080')
  parsed.searchParams.set('h','1080')
  parsed.searchParams.set('fit','crop')
  return parsed.toString()
}
async function pageToken(keys:{pageId?:string;token:string}) {
  if(!keys.pageId || !/^\d{8,30}$/.test(keys.pageId))return null
  const me=await graph('GET','me',keys.token,{fields:'id'})
  if(me.id===keys.pageId)return keys.token
  const lookup=await graph('GET',keys.pageId,keys.token,{fields:'id,access_token'})
    .catch(()=>null) as (MetaResult & {access_token?:string})|null
  if(lookup?.id===keys.pageId && lookup.access_token) {
    const test=await graph('GET','me',lookup.access_token,{fields:'id'})
    return test.id===keys.pageId?lookup.access_token:null
  }
  return null
}
// Original visual analysis only: no imported publisher images or captions.
// Every carousel has eight branded slides; it is NOT an Instagram native Repost.
async function makeSourceCarousel(brand:BrandKey,source:Source,article:Article,day:string,slot:string) {
  const title=article.title.slice(0,115)
  const slides=[
    title,
    'Radar de mercado: notícia publicada por '+source.name,
    angle(brand,title),
    'Confira os fatos diretamente na matéria original antes de tomar decisões.',
    brand==='eyagencia'
      ? 'Compare essa novidade com a jornada de compra da sua loja.'
      : 'Compare essa novidade com a rotina do seu restaurante.',
    'Separe informações confirmadas de hipóteses para o seu negócio.',
    'Defina o que acompanhar e registre o resultado na sua operação.',
    'Crédito: '+source.name+'. Leia a matéria no link da legenda.',
  ]
  const images:string[]=[],assets:string[]=[]
  for (const [index,headline] of slides.entries()) {
    const svg=makeBrandSocialSvg({
      slug:brand,topic:headline,concept:'Análise original de notícia setorial',
      date:day+'-'+slot+'-fonte-'+(index+1),
    })
    const png=await renderBrandArt(svg)
    const asset=await writeClient.assets.upload('image',png,{
      filename:'radar-original-'+brand+'-'+day+'-'+slot+'-'+(index+1)+'.png',
      contentType:'image/png',
    })
    images.push(imageJpeg(asset.url))
    assets.push(asset._id)
  }
  if(images.length!==8)throw new Error('carousel_incomplete')
  return {images,assets}
}
async function publishSourceCarousel(keys:{instagramId:string;token:string},images:string[],caption:string) {
  if(images.length!==8)throw new Error('carousel_incomplete')
  const children:string[]=[]
  for(const image of images){
    const child=await graph('POST',keys.instagramId+'/media',keys.token,{
      image_url:image,is_carousel_item:'true',
    })
    for(let i=0;i<8;i++){
      const state=await graph('GET',String(child.id),keys.token,{fields:'status_code'})
      if(state.status_code==='FINISHED'){children.push(String(child.id));break}
      if(state.status_code==='ERROR'||state.status_code==='EXPIRED')throw new Error('carousel_child_error')
      if(i<7)await new Promise(resolve=>setTimeout(resolve,3500))
    }
    if(children.length===0 || children.length!==images.indexOf(image)+1)throw new Error('carousel_child_timeout')
  }
  const parent=await graph('POST',keys.instagramId+'/media',keys.token,{
    media_type:'CAROUSEL',children:children.join(','),caption,
  })
  for(let i=0;i<8;i++){
    const state=await graph('GET',String(parent.id),keys.token,{fields:'status_code'})
    if(state.status_code==='FINISHED')return String(parent.id)
    if(state.status_code==='ERROR'||state.status_code==='EXPIRED')throw new Error('carousel_parent_error')
    if(i<7)await new Promise(resolve=>setTimeout(resolve,3500))
  }
  throw new Error('carousel_parent_timeout')
}
async function publishFacebookSourceCarousel(pageId:string,token:string,images:string[],caption:string){
  const photos:string[]=[]
  for(const url of images){
    const photo=await graph('POST',pageId+'/photos',token,{url,published:'false'})
    photos.push(String(photo.id))
  }
  const fields:Record<string,string>={message:caption}
  photos.forEach((id,i)=>{fields['attached_media['+i+']']=JSON.stringify({media_fbid:id})})
  return graph('POST',pageId+'/feed',token,fields)
}

async function publishInstagram(keys:{instagramId:string;token:string},jpeg:string,caption:string) {
  const container=await graph('POST',keys.instagramId+'/media',keys.token,{image_url:jpeg,caption})
  for(let i=0;i<7;i++){
    const status=await graph('GET',String(container.id),keys.token,{fields:'status_code'})
    if(status.status_code==='FINISHED')return String(container.id)
    if(status.status_code==='ERROR'||status.status_code==='EXPIRED')
      throw new Error('meta_media_'+status.status_code.toLowerCase())
    if(i<6)await new Promise(resolve=>setTimeout(resolve,4000))
  }
  throw new Error('meta_media_not_ready')
}

// Read-only preview diagnostic: public metadata only, never loads assets or
// executes a Meta request or writes to the CMS.
export async function inspectIndustrySources() {
  const rows=await Promise.all((['eyagencia','velo-delivery'] as BrandKey[]).flatMap(brand=>
    allowedSources(brand).map(async source=>{
      try{
        const articles=await relevantArticles(brand,source)
        return {brand,source:source.name,eligible:articles.length,
          titles:articles.slice(0,3).map(article=>({title:article.title,publishedAt:article.publishedAt,url:article.url}))}
      }catch(error){
        return {brand,source:source.name,eligible:0,
          error:error instanceof Error?error.message.slice(0,90):'unavailable'}
      }
    }),
  ))
  return rows
}

export async function runIndustryNewsRadar() {
  // Replaces the manual repost queue with original source-based commentary.
  // Never tries to call Instagram's unsupported native Repost action.
  if(process.env.VERCEL_ENV!=='production' ||
     process.env.NATIVE_REPOST_RADAR_ENABLED!=='true')return {enabled:false,results:[] as Result[]}
  const slot=editorialSlot()
  if(!slot)return {enabled:true,results:[] as Result[],status:'not_scheduled'}
  if(!process.env.SANITY_API_WRITE_TOKEN)return {enabled:true,results:[{brand:'eyagencia' as BrandKey,status:'sanity_missing'}]}
  const today=brazilDate()
  const week=brazilWeek(today)
  const results:Result[]=[]
  for(const brand of ['eyagencia','velo-delivery'] as BrandKey[]) {
    const weekCount=await writeClient.fetch<number>(
      'count(*[_type=="socialNewsPost" && brand==$brand && day >= $week && '+
      'status in ["reserved","generating","publishing","published","partial","verification_required"]])',
      {brand,week},
    )
    if(weekCount>=3){results.push({brand,status:'weekly_limit_reached'});continue}
    const since = new Date(today + 'T03:00:00.000Z').toISOString()
    const until = new Date(Date.parse(since) + 86400000).toISOString()
    const alreadyInFeed = await writeClient.fetch<number>(
      'count(*[(_type == "socialPackage" && defined(instagramCarouselPostId) && ' +
      'publishedAt >= $since && publishedAt < $until) || ' +
      '(_type == "socialPublication" && brandName == "EyAgencia" && day == $day && defined(instagramPostId))])',
      {since, until, day: today},
    )
    if (alreadyInFeed) {
      results.push({brand, status:'daily_limit_reached'})
      continue
    }
    let source=NEWS_SOURCES[brand] as Source
    const keys=credentials(brand)
    if(!keys){results.push({brand,status:'credentials_missing'});continue}
    const id='social-news-'+brand+'-'+today+'-'+slot
    const exists=await writeClient.fetch<{status?:string}|null>(
      '*[_id==$id][0]{status}',{id},
    )
    if(exists){results.push({brand,status:'already_processed'});continue}
    let article:Article|null=null
    const failures:string[]=[]
    for(const publisher of allowedSources(brand)){
      try{
        const candidates=await relevantArticles(brand,publisher)
        for(const candidate of candidates){
          const posted=await writeClient.fetch<number>(
            'count(*[_type=="socialNewsPost" && brand==$brand && sourceUrl==$url])',
            {brand,url:candidate.url},
          )
          if(posted===0){article=candidate;source=publisher;break}
        }
        if(article)break
      }catch(error){
        failures.push(publisher.name+': '+(error instanceof Error?error.message.slice(0,50):'unavailable'))
      }
    }
    if(!article){results.push({brand,status:'no_fresh_relevant_news',
      reason:failures.join('; ').slice(0,180)});continue}
    const text=captionFor(brand,source,article)
    try {
      await writeClient.create({
        _id:id,_type:'socialNewsPost',brand,day:today,status:'reserved',
        sourceName:source.name,sourceUrl:article.url,sourceTitle:article.title,
        sourcePublishedAt:article.publishedAt,caption:text,
        createdAt:new Date().toISOString(),
      })
    }catch{results.push({brand,status:'claimed_elsewhere'});continue}
    let instagramSubmitted=false
    let facebookSubmitted=false
    const errors:string[]=[]
    let instagramPostId:string|undefined
    let facebookPostId:string|undefined
    try{
      await writeClient.patch(id).set({status:'generating'}).commit()
      const carousel=await makeSourceCarousel(brand,source,article,today,slot)
      await writeClient.patch(id).set({
        imageAssetId:carousel.assets[0],imageUrl:carousel.images[0],
        carouselImages:carousel.images,carouselAssetIds:carousel.assets,
        slideCount:8,format:'carousel',status:'publishing',
      }).commit()

      try{
        const container=await publishSourceCarousel(keys,carousel.images,text)
        instagramSubmitted=true
        const result=await graph('POST',keys.instagramId+'/media_publish',keys.token,{creation_id:container})
        instagramPostId=result.id
        await writeClient.patch(id).set({instagramPostId}).commit()
      }catch(error){
        errors.push('Instagram: '+(error instanceof Error?error.message:'unknown'))
      }

      if(keys.pageId){
        try{
          const token=await pageToken(keys)
          if(!token)throw new Error('page_access_missing')
          facebookSubmitted=true
          const post=await publishFacebookSourceCarousel(keys.pageId,token,carousel.images,text)
          facebookPostId=post.id
          await writeClient.patch(id).set({facebookPostId}).commit()
        }catch(error){errors.push('Facebook: '+(error instanceof Error?error.message:'unknown'))}
      }else errors.push('Facebook: page_id_unconfigured')

      const possiblyPublished=(instagramSubmitted&&!instagramPostId)||(facebookSubmitted&&!facebookPostId)
      const status=possiblyPublished?'verification_required':
        instagramPostId&&facebookPostId?'published':
        instagramPostId||facebookPostId?'partial':'failed'
      await writeClient.patch(id).set({
        status,errors,finishedAt:new Date().toISOString(),
      }).commit()
      results.push({brand,status,sourceUrl:article.url,instagramPostId,facebookPostId,
        reason:errors.length?errors.join('; ').slice(0,160):undefined})
      console.info('[social-news] result',JSON.stringify({
        brand,status,instagramPostId,facebookPostId,errorCount:errors.length,
      }))
    }catch(error){
      const reason=error instanceof Error?error.message.slice(0,120):'unknown'
      await writeClient.patch(id).set({status:'failed',errors:[reason],
        finishedAt:new Date().toISOString()}).commit().catch(()=>{})
      results.push({brand,status:'failed',reason})
    }
  }
  return {enabled:true,day:today,results}
}
