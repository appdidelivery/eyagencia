import {writeClient} from '../../../sanity/lib/writeClient'
import {makeBrandSocialSvg, supportedBrandSlug} from '../../../scripts/brand-social-visual.mjs'
import {renderBrandArt} from '../../../scripts/render-brand-art.mjs'

type Brand = {
  _id: string
  name: string
  slug: string
  brandGuide: string
  audience?: string
  verifiedFacts?: string[]
  topics?: string[]
  days?: string[]
  website?: string
  instagramEnabled?: boolean
  facebookEnabled?: boolean
  approvedImages?: {asset?: {url?: string}}[]
}
type Result = {brand: string; status: string; detail?: string}
type GraphJson = {id?: string; status_code?: string; error?: {code?: number; message?: string}}

const TIMEZONE = 'America/Sao_Paulo'
const MODEL = 'nvidia/nemotron-3.5-lightning-free'
const IMAGE_MODEL = 'bfl/flux-3-image-klein'
const GRAPH_VERSION = 'v26.0'
const GRAPH_URL = 'https://graph.facebook.com/' + GRAPH_VERSION

function brazilDay(now = new Date()) {
  const fields = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const value = (type: string) => fields.find((item) => item.type === type)?.value || ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(value('weekday'))
  return {day: value('year') + '-' + value('month') + '-' + value('day'), weekday}
}

function secretSuffix(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  return slug.toUpperCase().replace(/-/g, '_')
}

function credentials(brand: Brand) {
  const suffix = secretSuffix(brand.slug)
  if (!suffix) return null
  const pageId = process.env['SOCIAL_META_PAGE_ID_' + suffix]
  const pageToken = process.env['SOCIAL_META_PAGE_TOKEN_' + suffix]
  const instagramId = process.env['SOCIAL_META_INSTAGRAM_ID_' + suffix]
  if (brand.facebookEnabled && (!pageId || !pageToken)) return null
  if (brand.instagramEnabled && (!instagramId || !pageToken)) return null
  if (!brand.facebookEnabled && !brand.instagramEnabled) return null
  return {pageId, pageToken: pageToken || '', instagramId}
}

async function modelAllowed(model: string, image = false) {
  if (image ? model !== IMAGE_MODEL : !model.endsWith('-free')) return false
  const res = await fetch('https://ai-gateway.vercel.sh/v1/models', {
    cache: 'no-store', signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) return false
  const catalog = await res.json()
  const entry = Array.isArray(catalog?.data)
    ? catalog.data.find((item: {id?: string}) => item.id === model)
    : null
  if (!entry) return false
  if (!image) {
    return entry.type === 'language' &&
      Number(entry.pricing?.input) === 0 &&
      Number(entry.pricing?.output) === 0 &&
      entry.pricing?.varies_by_provider !== true
  }
  const pricing = entry.pricing || {}
  const prices = [pricing.image, pricing.output_image, pricing.per_image]
    .filter((price: unknown) => price !== undefined && price !== null)
    .map(Number).filter(Number.isFinite)
  // Do not assume a price if the live catalog does not report an image unit cost.
  return prices.length > 0 && Math.max(...prices) <= 0.01
}

async function createCaption(brand: Brand, topic: string, day: string) {
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  if (!apiKey) throw new Error('AI Gateway não conectado.')
  const model = process.env.SOCIAL_AGENT_TEXT_MODEL || MODEL
  if (!(await modelAllowed(model))) throw new Error('Modelo gratuito sem preço zero confirmado.')
  const facts = (brand.verifiedFacts || []).slice(0, 25)
  const instructions = [
    'Você é o editor automático de uma agência brasileira. Retorne apenas JSON válido:',
    '{"caption":"legenda completa, sem markdown","visualConcept":"descrição visual em uma frase"}.',
    'É obrigatório escrever em português brasileiro, com linguagem natural e CTA discreto.',
    'NÃO invente preço, promoção, estoque, oferta, dados, porcentagem, depoimento, legislação, resultado ou característica de produto.',
    'Somente fatos fornecidos como verificados podem ser afirmados especificamente.',
    'Não invente URLs. Não repita frases genéricas e não use termos como garantia de sucesso.',
    'Não diga que aumenta vendas, ticket médio, faturamento, lucro ou conversão sem evidências verificadas; não afirme que o cliente já possui filtros, fotos, integração ou funcionalidades sem fatos verificados.',
    'Evite frases sensacionalistas como máquina de vendas, resultados garantidos, venda mais, descubra o segredo, comprovadamente, imperdível.',
    'O texto deve ser publicável diretamente, sem revisão humana, ou você deve retornar JSON {"caption":"","visualConcept":""}.',
  ].join('\n')
  const input = JSON.stringify({
    client: brand.name, date: day, topic, audience: brand.audience || '',
    identity: brand.brandGuide, verifiedFacts: facts, officialWebsite: brand.website || '',
  })
  const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model, messages: [{role: 'system', content: instructions}, {role: 'user', content: input}],
      response_format: {type: 'json_object'}, reasoning: {effort: 'none'}, max_completion_tokens: 900,
    }),
    cache: 'no-store', signal: AbortSignal.timeout(90000),
  })
  if (!res.ok) throw new Error('Falha na geração da legenda (HTTP ' + res.status + ').')
  const data = await res.json()
  const raw = String(data?.choices?.[0]?.message?.content || '').trim()
  let parsed: {caption?: string; visualConcept?: string}
  try { parsed = JSON.parse(raw) } catch {throw new Error('Legenda fora do formato esperado.')}
  const caption = (parsed.caption || '').trim()
  const concept = (parsed.visualConcept || '').trim()
  if (caption.length < 90 || caption.length > 2100 || concept.length < 15 || concept.length > 650) {
    throw new Error('Conteúdo incompleto ou acima dos limites editoriais.')
  }
  if (/(?:R\$\s*\d|\b\d+(?:[.,]\d+)?\s*%|\b(?:garantid[oa]|gr[aá]tis|imperd[ií]vel)\b)/i.test(caption)) {
    throw new Error('Alegação de preço, resultado ou promoção não autorizada.')
  }
  if (/(?:m[aá]quina de vendas|dispar(?:a|am|e|ou) (?:as )?vendas|(?:aument|elev|multiplic|melhor)\w*.{0,55}(?:ticket m[eé]dio|faturamento|vendas|convers[aã]o|lucro)|(?:garant|comprovad)\w* resultado)/i.test(caption)) {
    throw new Error('Legenda reprovada por promessa comercial sem evidência.')
  }
  const links = caption.match(/https?:\/\/[^\s)]+/g) || []
  if (links.some((link) => {
    try { return !brand.website || new URL(link).hostname !== new URL(brand.website).hostname }
    catch { return true }
  })) throw new Error('URL externa não autorizada na legenda.')
  return {caption, concept}
}

async function createImage(brand: Brand, concept: string, day: string, topic: string) {
  const pictures = (brand.approvedImages || [])
    .map((img) => img.asset?.url)
    .filter((url): url is string => Boolean(url && url.startsWith('https://cdn.sanity.io/images/')))
  if (process.env.SOCIAL_AGENT_IMAGES_ENABLED !== 'true' && pictures.length) {
    const index = Number(day.replace(/-/g, '')) % pictures.length
    return {url: pictures[index], assetId: null as string | null}
  }
  if (process.env.SOCIAL_AGENT_IMAGES_ENABLED !== 'true') {
    // Brand-matched, topic-specific artwork: no third-party image and zero
    // inference cost. The sample graphics are direction, not image assets.
    if (!supportedBrandSlug(brand.slug)) {
      throw new Error('Sem imagem oficial: marca ainda sem identidade visual automática.')
    }
    const svg = makeBrandSocialSvg({slug: brand.slug, topic, concept, date: day})
    const buffer = await renderBrandArt(svg)
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: 'social-editorial-' + brand.slug + '-' + day + '.png',
      contentType: 'image/png',
    })
    return {url: asset.url, assetId: asset._id}
  }
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  if (!apiKey) throw new Error('Credencial para geração de imagem ausente.')
  if (!(await modelAllowed(IMAGE_MODEL, true))) {
    throw new Error('Preço de imagem não validado dentro do teto US$ 0,01.')
  }
  const prompt = [
    'Create a premium square 1:1 social media editorial image for an authentic Brazilian brand.',
    'Brand name: ' + brand.name,
    'Brand guidelines: ' + brand.brandGuide.slice(0, 900),
    'Illustrate this verified marketing topic without making up product-specific features: ' + concept,
    'Elegant professional photo or visual composition, crisp lighting, high quality.',
    'No written words, no letters, no logos, no watermarks, no invented packaging labels.',
  ].join('\n')
  const res = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
    method: 'POST',
    headers: {Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json'},
    body: JSON.stringify({model: IMAGE_MODEL, prompt, n: 1, response_format: 'b64_json'}),
    cache: 'no-store', signal: AbortSignal.timeout(120000),
  })
  if (!res.ok) throw new Error('Falha na geração da imagem (HTTP ' + res.status + ').')
  const json = await res.json()
  const base64 = json?.data?.[0]?.b64_json
  if (typeof base64 !== 'string') throw new Error('Imagem não retornada.')
  const buffer = Buffer.from(base64, 'base64')
  if (buffer.length < 8000 || buffer.length > 12 * 1024 * 1024) throw new Error('Tamanho de imagem inválido.')
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8
  const webp = buffer.toString('ascii', 8, 12) === 'WEBP'
  const contentType = jpg ? 'image/jpeg' : webp ? 'image/webp' : 'image/png'
  const ext = jpg ? 'jpg' : webp ? 'webp' : 'png'
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: 'social-' + brand.slug + '-' + day + '.' + ext,
    contentType,
  })
  return {url: asset.url, assetId: asset._id}
}

function publicJpeg(url: string) {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'cdn.sanity.io') {
    throw new Error('A mídia precisa estar hospedada no CDN público do Sanity.')
  }
  parsed.searchParams.set('fm', 'jpg')
  parsed.searchParams.set('w', '1080')
  parsed.searchParams.set('h', '1080')
  parsed.searchParams.set('fit', 'crop')
  return parsed.toString()
}

async function metaPost(path: string, token: string, params: Record<string, string>) {
  const res = await fetch(GRAPH_URL + '/' + path, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({...params, access_token: token}),
    cache: 'no-store', signal: AbortSignal.timeout(30000),
  })
  const payload = await res.json().catch(() => ({})) as GraphJson
  if (!res.ok || !payload.id) {
    // Error body can contain user-controlled text. Do not copy raw response or token to Sanity.
    throw new Error('Meta HTTP ' + res.status + '; código ' + (payload.error?.code || 'desconhecido'))
  }
  return payload.id
}

async function metaGet(path: string, token: string): Promise<GraphJson> {
  const url = new URL(GRAPH_URL + '/' + path)
  url.searchParams.set('fields', 'status_code')
  url.searchParams.set('access_token', token)
  const res = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(15000)})
  if (!res.ok) throw new Error('Verificação de mídia Meta HTTP ' + res.status)
  return res.json()
}

async function publishInstagram(igId: string, token: string, url: string, caption: string) {
  const container = await metaPost(igId + '/media', token, {image_url: url, caption})
  let ready = false
  for (let retry = 0; retry < 5; retry++) {
    const status = await metaGet(container, token)
    if (status.status_code === 'FINISHED') {ready = true; break}
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') break
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
  if (!ready) throw new Error('Imagem Instagram ainda não concluída; conferir container ' + container)
  return metaPost(igId + '/media_publish', token, {creation_id: container})
}

async function processBrand(brand: Brand, day: string, weekday: number): Promise<Result> {
  const slug = brand.slug
  if (!brand.days?.includes(String(weekday))) return {brand: brand.name, status: 'not-scheduled'}
  const keys = credentials(brand)
  if (!keys) return {brand: brand.name, status: 'credentials-missing'}
  if (!brand.topics?.length || !brand.brandGuide?.trim()) {
    return {brand: brand.name, status: 'editorial-config-missing'}
  }
  const publicationId = 'social-' + slug + '-' + day
  const already = await writeClient.fetch<string | null>('*[_id == $id][0]._id', {id: publicationId})
  if (already) return {brand: brand.name, status: 'already-processed'}
  const topicIndex = Math.floor(Date.parse(day + 'T12:00:00Z') / 86400000) % brand.topics.length
  const topic = brand.topics[topicIndex]
  try {
    await writeClient.create({
      _id: publicationId, _type: 'socialPublication', brandId: brand._id,
      brandName: brand.name, day, topic, status: 'reserved', createdAt: new Date().toISOString(),
    })
  } catch {return {brand: brand.name, status: 'already-reserved'}}
  try {
    await writeClient.patch(publicationId).set({status: 'generating'}).commit()
    const generated = await createCaption(brand, topic, day)
    const photo = await createImage(brand, generated.concept, day, topic)
    const jpeg = publicJpeg(photo.url)
    await writeClient.patch(publicationId).set({
      caption: generated.caption, imageUrl: jpeg, imageAssetId: photo.assetId,
    }).commit()
    const errors: string[] = []
    let facebookPostId: string | null = null
    let instagramPostId: string | null = null
    // Each platform has its own result: success on one platform never causes duplicate posting there.
    if (brand.facebookEnabled && keys.pageId) {
      try {
        facebookPostId = await metaPost(keys.pageId + '/photos', keys.pageToken, {
          url: jpeg, message: generated.caption,
        })
        await writeClient.patch(publicationId).set({facebookPostId}).commit()
      } catch (error) {errors.push('Facebook: ' + (error instanceof Error ? error.message : 'falha'))}
    }
    if (brand.instagramEnabled && keys.instagramId) {
      try {
        instagramPostId = await publishInstagram(keys.instagramId, keys.pageToken, jpeg, generated.caption)
        await writeClient.patch(publicationId).set({instagramPostId}).commit()
      } catch (error) {errors.push('Instagram: ' + (error instanceof Error ? error.message : 'falha'))}
    }
    const success = Boolean(facebookPostId || instagramPostId)
    const status = errors.length ? (success ? 'partial' : 'failed') : 'published'
    await writeClient.patch(publicationId).set({
      status, errors, finishedAt: new Date().toISOString(),
    }).commit()
    return {brand: brand.name, status, detail: errors.join(' | ') || undefined}
  } catch (error) {
    const safe = error instanceof Error ? error.message.slice(0, 250) : 'Erro desconhecido'
    await writeClient.patch(publicationId).set({
      status: 'blocked', errors: [safe], finishedAt: new Date().toISOString(),
    }).commit().catch(() => {})
    return {brand: brand.name, status: 'blocked', detail: safe}
  }
}

async function ensureInitialBrand() {
  // Idempotent initial Velo pilot. Never publishes until verified Meta permissions exist.
  const exists = await writeClient.fetch<string | null>(
    '*[_type == "socialBrand" && slug.current == "velo-delivery"][0]._id'
  )
  if (exists) return
  await writeClient.createIfNotExists({
    _id: 'social-brand-velo-delivery',
    _type: 'socialBrand',
    name: 'Velo Delivery',
    slug: {_type: 'slug', current: 'velo-delivery'},
    enabled: true,
    brandGuide: 'Plataforma brasileira de delivery para lojistas. Tom prático, simples, comercial e educativo. Visual limpo, mobile-first, profissional. Não inventar logos nem fotografias de produtos.',
    audience: 'gestores de restaurantes, conveniências, mercados e operações de delivery',
    verifiedFacts: ['Velo Delivery é uma plataforma de delivery para estabelecimentos comerciais.'],
    topics: [
      'Como deixar um cardápio de delivery mais fácil de navegar',
      'A importância de apresentar categorias claras no cardápio digital',
      'Organização de produtos e informações no delivery',
      'Como reduzir dúvidas comuns de clientes antes do pedido',
      'Boas práticas de comunicação de uma loja de delivery',
      'Como facilitar a operação de quem administra pedidos',
    ],
    days: ['1', '3', '5'],
    instagramEnabled: true,
    facebookEnabled: true,
    createdAt: new Date().toISOString(),
  })
}

export async function runSocialPublishing() {
  if (process.env.VERCEL_ENV !== 'production' ||
      process.env.SOCIAL_AGENT_ENABLED !== 'true' ||
      process.env.SOCIAL_AGENT_AUTOPUBLISH_ENABLED !== 'true') {
    return {enabled: false, results: [] as Result[]}
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return {enabled: true, results: [{brand: 'system', status: 'sanity-token-missing'}]}
  }
  const {day, weekday} = brazilDay()
  await ensureInitialBrand()
  const brands = await writeClient.fetch<Brand[]>(
    '*[_type == "socialBrand" && enabled == true]{_id,name,"slug":slug.current,brandGuide,audience,verifiedFacts,topics,days,website,instagramEnabled,facebookEnabled,approvedImages[]{asset->{url}}}'
  )
  const results: Result[] = []
  // Bounded parallelism keeps the daily job within the function duration.
  const scheduled = (brands || []).filter((b) => Boolean(b.slug)).slice(0, 4)
  results.push(...await Promise.all(scheduled.map((brand) => processBrand(brand, day, weekday))))
  return {enabled: true, day, results}
}


// One-off production test, authenticated by Vercel Cron and locked in Sanity.
// Only the designated brand and date are eligible. A second trigger never
// publishes again, even if the first invocation partially succeeds.
export async function runOneTimeSocialPilot() {
  const {day} = brazilDay()
  if (process.env.VERCEL_ENV !== 'production' || day !== '2026-10-28') {
    return {ok: true, skipped: 'Fora da janela do teste único.'}
  }
  const pageId = process.env.SOCIAL_META_PAGE_ID_VELO_DELIVERY
  const instagramId = process.env.SOCIAL_META_INSTAGRAM_ID_VELO_DELIVERY
  const token = process.env.SOCIAL_META_PAGE_TOKEN_VELO_DELIVERY
  if (pageId !== '1100534609816460' ||
      instagramId !== '17841480632856495' || !token ||
      !process.env.SANITY_API_WRITE_TOKEN) {
    return {ok: false, skipped: 'Credenciais ou ativos do piloto não correspondem à Velo.'}
  }
  const id = 'social-pilot-velo-delivery-2026-10-28'
  const topic = 'Como organizar melhor seu cardápio digital'
  const caption = 'Um cardápio digital bem organizado começa por categorias claras e descrições objetivas. Vale revisar os nomes dos itens, as informações de cada produto e a disponibilidade conforme a rotina da loja. Antes de divulgar seu cardápio, confira se alguém que está comprando pela primeira vez consegue encontrar o que procura. Qual parte do seu cardápio você revisaria hoje? #VeloDelivery #CardapioDigital #GestaoDeRestaurantes'
  try {
    await writeClient.create({
      _id: id, _type: 'socialPublication', brandId: 'social-brand-velo-delivery',
      brandName: 'Velo Delivery', day, topic, status: 'reserved',
      createdAt: new Date().toISOString(),
    })
  } catch {
    return {ok: true, skipped: 'Teste único já reservado ou concluído.'}
  }
  try {
    await writeClient.patch(id).set({status:'generating',caption}).commit()
    const svg = makeBrandSocialSvg({
      slug:'velo-delivery', topic, date:day, concept:'cardápio digital organizado',
    })
    const imageBuffer = await renderBrandArt(svg)
    const asset = await writeClient.assets.upload('image',imageBuffer,{
      filename:'velo-piloto-social-2026-10-28.png',contentType:'image/png',
    })
    const imageUrl = publicJpeg(asset.url)
    await writeClient.patch(id).set({imageUrl,imageAssetId:asset._id}).commit()
    const errors: string[]=[]
    let facebookPostId: string | null=null
    let instagramPostId: string | null=null
    try {
      facebookPostId = await metaPost(pageId + '/photos',token,{
        url:imageUrl,message:caption,
      })
      await writeClient.patch(id).set({facebookPostId}).commit()
    } catch (error) {
      errors.push('Facebook: '+(error instanceof Error?error.message:'erro'))
    }
    try {
      instagramPostId = await publishInstagram(instagramId,token,imageUrl,caption)
      await writeClient.patch(id).set({instagramPostId}).commit()
    } catch (error) {
      errors.push('Instagram: '+(error instanceof Error?error.message:'erro'))
    }
    const success=Boolean(facebookPostId || instagramPostId)
    const status=errors.length?(success?'partial':'failed'):'published'
    await writeClient.patch(id).set({
      status,errors,finishedAt:new Date().toISOString(),
    }).commit()
    console.info('[social-pilot] finished',JSON.stringify({status,facebookPostId,instagramPostId,errors}))
    return {ok:success,status,facebookPostId,instagramPostId,errors}
  } catch(error) {
    const message = error instanceof Error ? error.message.slice(0,160) : 'erro'
    await writeClient.patch(id).set({
      status:'blocked',errors:[message],finishedAt:new Date().toISOString(),
    }).commit().catch(()=>{})
    console.error('[social-pilot] blocked',message)
    return {ok:false,status:'blocked',error:message}
  }
}
