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

function brazilDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)
}
async function fetchHtml(url: string, allowedHost: string) {
  const address = new URL(url)
  if(address.protocol !== 'https:' || address.hostname !== allowedHost) throw new Error('disallowed_source')
  const response = await fetch(url,{
    headers:{'Accept':'text/html','User-Agent':'EyAgencia-NewsRadar/1.0 (+https://www.eyagencia.com.br)'},
    redirect:'error',cache:'no-store',signal:AbortSignal.timeout(16000),
  })
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

export async function runIndustryNewsRadar() {
  if(process.env.VERCEL_ENV!=='production' ||
     process.env.SOCIAL_NEWS_RADAR_ENABLED!=='true')return {enabled:false,results:[] as Result[]}
  if(!process.env.SANITY_API_WRITE_TOKEN)return {enabled:true,results:[{brand:'eyagencia' as BrandKey,status:'sanity_missing'}]}
  const today=brazilDate()
  const results:Result[]=[]
  for(const brand of ['eyagencia','velo-delivery'] as BrandKey[]) {
    // Velo's feed is carousel-only. Do not let the independent news task
    // publish a second, single-image post on that account.
    if (brand === 'velo-delivery') {
      results.push({brand, status:'carousel_feed_priority'})
      continue
    }
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
    const source=NEWS_SOURCES[brand] as Source
    const keys=credentials(brand)
    if(!keys){results.push({brand,status:'credentials_missing'});continue}
    const id='social-news-'+brand+'-'+today
    const exists=await writeClient.fetch<{status?:string}|null>(
      '*[_id==$id][0]{status}',{id},
    )
    if(exists){results.push({brand,status:'already_processed'});continue}
    let article:Article|null=null
    try {
      const candidates=await relevantArticles(brand,source)
      for(const candidate of candidates){
        const posted=await writeClient.fetch<number>(
          'count(*[_type=="socialNewsPost" && brand==$brand && sourceUrl==$url])',
          {brand,url:candidate.url},
        )
        if(posted===0){article=candidate;break}
      }
    }catch(error) {
      const reason=error instanceof Error?error.message.slice(0,110):'source_unavailable'
      results.push({brand,status:'source_unavailable',reason})
      continue
    }
    if(!article){results.push({brand,status:'no_fresh_relevant_news'});continue}
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
      const svg=makeBrandSocialSvg({
        slug:brand,topic:article.title,concept:'Notícia de mercado: '+article.title,date:today,
      })
      const buffer=await renderBrandArt(svg)
      const asset=await writeClient.assets.upload('image',buffer,{
        filename:'industry-news-'+brand+'-'+today+'.png',contentType:'image/png',
      })
      const jpeg=imageJpeg(asset.url)
      await writeClient.patch(id).set({imageAssetId:asset._id,imageUrl:jpeg,status:'publishing'}).commit()

      try{
        const container=await publishInstagram(keys,jpeg,text)
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
          const post=await graph('POST',keys.pageId+'/photos',token,{url:jpeg,message:text})
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
