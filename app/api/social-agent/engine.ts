import {writeClient} from '../../../sanity/lib/writeClient'
import {makeBrandSocialSvg, makeBrandMotivationSvg, supportedBrandSlug} from '../../../scripts/brand-social-visual.mjs'
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
    '{"caption":"legenda completa, sem markdown","visualConcept":"descrição visual em uma frase","slides":["dica 1","dica 2","dica 3","dica 4","dica 5","dica 6"]}.',
    'Para Velo Delivery, slides deve conter 6 orientações reais, cada uma de 25 a 95 caracteres, específicas do tema, distintas, sem promessas.',
    'Cada dica será um slide do carrossel, então nunca invente recursos, dados, resultados ou depoimentos.',
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
      response_format: {type: 'json_object'}, reasoning: {effort: 'none'}, max_completion_tokens: 1600,
    }),
    cache: 'no-store', signal: AbortSignal.timeout(90000),
  })
  if (!res.ok) throw new Error('Falha na geração da legenda (HTTP ' + res.status + ').')
  const data = await res.json()
  const raw = String(data?.choices?.[0]?.message?.content || '').trim()
  let parsed: {caption?: string; visualConcept?: string; slides?: string[]}
  try { parsed = JSON.parse(raw) } catch {throw new Error('Legenda fora do formato esperado.')}
  const caption = (parsed.caption || '').trim()
  const concept = (parsed.visualConcept || '').trim()
  const slides = Array.isArray(parsed.slides) ? parsed.slides.map(x => String(x).replace(/\s+/g,' ').trim()) : []
  if (brand.slug === 'velo-delivery' &&
      (slides.length !== 6 || slides.some(x => x.length < 25 || x.length > 95) ||
       new Set(slides.map(x => x.toLocaleLowerCase('pt-BR'))).size !== 6)) {
    throw new Error('Carrossel Velo incompleto ou com slides duplicados.')
  }
  const editorialText = [caption, ...slides].join('\n')
  if (caption.length < 90 || caption.length > 2100 || concept.length < 15 || concept.length > 650) {
    throw new Error('Conteúdo incompleto ou acima dos limites editoriais.')
  }
  if (/(?:R\$\s*\d|\b\d+(?:[.,]\d+)?\s*%|\b(?:garantid[oa]|gr[aá]tis|imperd[ií]vel)\b)/i.test(editorialText)) {
    throw new Error('Alegação de preço, resultado ou promoção não autorizada.')
  }
  if (/(?:m[aá]quina de vendas|dispar(?:a|am|e|ou) (?:as )?vendas|(?:aument|elev|multiplic|melhor)\w*.{0,55}(?:ticket m[eé]dio|faturamento|vendas|convers[aã]o|lucro)|(?:garant|comprovad)\w* resultado)/i.test(editorialText)) {
    throw new Error('Legenda reprovada por promessa comercial sem evidência.')
  }
  const links = caption.match(/https?:\/\/[^\s)]+/g) || []
  if (links.some((link) => {
    try { return !brand.website || new URL(link).hostname !== new URL(brand.website).hostname }
    catch { return true }
  })) throw new Error('URL externa não autorizada na legenda.')
  return {caption, concept, slides}
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

// Convert the configured system-user credential into the authorized Page
// access token only for Facebook Page posting. The configured token remains
// unchanged for Instagram; neither token is logged, persisted or returned.
async function facebookPageToken(pageId: string, systemToken: string) {
  const response = await fetch(GRAPH_URL + '/' + encodeURIComponent(pageId) + '?fields=id,access_token', {
    method: 'GET',
    headers: {Authorization: 'Bearer ' + systemToken},
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  })
  const data = await response.json().catch(() => ({})) as {id?: string; access_token?: string; error?: {code?: number}}
  if (!response.ok || data.id !== pageId || !data.access_token) {
    throw new Error('Meta: credencial não autorizada a obter token da Página; código ' +
      (data.error?.code || response.status))
  }
  const token = data.access_token
  const identity = await fetch(GRAPH_URL + '/me?fields=id', {
    method: 'GET', headers: {Authorization: 'Bearer ' + token},
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  })
  const page = await identity.json().catch(() => ({})) as {id?: string}
  if (!identity.ok || page.id !== pageId) {
    throw new Error('Meta: token derivado não identifica a Página Velo.')
  }
  return token
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


async function publishFacebookCarousel(pageId: string, token: string, images: string[], caption: string) {
  if (images.length !== 8) throw new Error('Facebook: slide_count_invalid')
  const pageToken = await facebookPageToken(pageId, token)
  const photoIds: string[] = []
  for (const url of images) photoIds.push(await metaPost(pageId + '/photos', pageToken, {url, published: 'false'}))
  const params: Record<string,string> = {message: caption}
  photoIds.forEach((id, i) => {params['attached_media[' + i + ']'] = JSON.stringify({media_fbid: id})})
  return metaPost(pageId + '/feed', pageToken, params)
}
async function publishInstagramCarousel(igId: string, token: string, images: string[], caption: string) {
  if (images.length !== 8) throw new Error('Instagram: slide_count_invalid')
  const children: string[] = []
  for (const url of images) {
    const child = await metaPost(igId + '/media', token, {image_url: url, is_carousel_item: 'true'})
    let ready = false
    for (let i = 0; i < 8; i++) {
      const state = await metaGet(child, token)
      if (state.status_code === 'FINISHED') {ready = true; break}
      if (state.status_code === 'ERROR' || state.status_code === 'EXPIRED') break
      if (i < 7) await new Promise(resolve => setTimeout(resolve, 3000))
    }
    if (!ready) throw new Error('Instagram: child_not_ready')
    children.push(child)
  }
  const parent = await metaPost(igId + '/media', token, {
    media_type: 'CAROUSEL', children: children.join(','), caption,
  })
  let ready = false
  for (let i = 0; i < 8; i++) {
    const state = await metaGet(parent, token)
    if (state.status_code === 'FINISHED') {ready = true; break}
    if (state.status_code === 'ERROR' || state.status_code === 'EXPIRED') break
    if (i < 7) await new Promise(resolve => setTimeout(resolve, 3000))
  }
  if (!ready) throw new Error('Instagram: parent_not_ready')
  return metaPost(igId + '/media_publish', token, {creation_id: parent})
}
async function buildVeloCarousel(brand: Brand, day: string, topic: string,
  concept: string, coverUrl: string, slides: string[]) {
  if (brand.slug !== 'velo-delivery' || slides.length !== 6)
    throw new Error('Velo: carousel_script_invalid')
  const titles = [...slides, 'Salve este guia e revise uma melhoria por vez']
  const images = [coverUrl]
  const assetIds: string[] = []
  for (const [index, title] of titles.entries()) {
    const svg = makeBrandSocialSvg({
      slug: brand.slug, topic: title, concept: topic + ' ' + concept,
      date: day + '-slide-' + (index + 2),
    })
    const buffer = await renderBrandArt(svg)
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: 'velo-carousel-' + day + '-' + (index + 2) + '.png', contentType: 'image/png',
    })
    assetIds.push(asset._id)
    images.push(publicJpeg(asset.url))
  }
  if (images.length !== 8) throw new Error('Velo: carousel_render_incomplete')
  return {images, assetIds}
}


// Each phrase is original, not copied or attributed to a viral third-party
// post. The week-index rotation prevents repetitive feed covers.
type Motivation = {cover:string; messages:string[]}
const MOTIVATION: Record<'eyagencia' | 'velo-delivery', {monday:Motivation[];friday:Motivation[]}> = {
  eyagencia: {
    monday:[
      {cover:'Bom dia. Grandes negócios começam com pequenas decisões bem feitas.',messages:[
        'Comece pelo que está sob seu controle.',
        'Consistência constrói o que o impulso não sustenta.',
        'Ouvir seu cliente também é estratégia.',
        'Uma melhoria por dia muda a operação.',
        'Não compare bastidores com vitrines.',
        'Seu negócio merece foco, não pressa.',
      ]},
      {cover:'Bom dia. Sua empresa cresce quando você segue aprendendo.',messages:[
        'Toda semana traz uma oportunidade de melhorar.',
        'Comece ouvindo antes de anunciar.',
        'Uma experiência clara vale muito.',
        'Organização é parte do crescimento.',
        'A evolução pode começar no detalhe.',
        'Construa um passo de cada vez.',
      ]},
      {cover:'Bom dia. O progresso nasce do trabalho que você repete.',messages:[
        'Valorize os ajustes que ninguém vê.',
        'Melhore processos antes de multiplicar tarefas.',
        'Tenha clareza sobre a próxima prioridade.',
        'Quem mede consegue decidir melhor.',
        'Relacionamento também é patrimônio.',
        'Faça hoje o que aproxima sua empresa do amanhã.',
      ]},
      {cover:'Bom dia. Fé para começar, disciplina para continuar.',messages:[
        'Cultive bons hábitos antes de esperar grandes resultados.',
        'Planeje sua manhã com clareza e gratidão.',
        'A constância é uma escolha renovada a cada dia.',
        'Cuide das pessoas enquanto constrói seus projetos.',
        'Descanse para continuar criando com propósito.',
        'Trabalhe com esperança e revise suas prioridades.',
      ]},
      {cover:'Bom dia. Bons hábitos sustentam grandes sonhos.',messages:[
        'Comece com uma prioridade possível.',
        'Disciplina também é respeitar seus limites.',
        'Reserve tempo para aprender e ouvir.',
        'Cultive fé sem abandonar o planejamento.',
        'Registre o que funcionou e melhore o processo.',
        'Celebre o progresso sem perder a humildade.',
      ]},
      {cover:'Bom dia. A rotina que você cuida hoje prepara seu amanhã.',messages:[
        'Pratique gratidão antes de começar as tarefas.',
        'Organize o trabalho sem esquecer da família.',
        'Fé e responsabilidade caminham juntas.',
        'Enfrente uma decisão importante por vez.',
        'Construa consistência em vez de buscar atalhos.',
        'Permita-se descansar e recomeçar.',
      ]},
    ],
    friday:[
      {cover:'Feche a semana reconhecendo o que você fez avançar.',messages:[]},
      {cover:'Que seu fim de semana tenha descanso e orgulho do caminho.',messages:[]},
      {cover:'Você construiu mais uma semana. Reconheça cada passo.',messages:[]},
      {cover:'Que a sexta traga gratidão, fé e um descanso merecido.',messages:[]},
      {cover:'Feche a semana com paz, reconhecendo seus bons hábitos.',messages:[]},
    ],
  },
  'velo-delivery': {
    monday:[
      {cover:'Bom dia, quem abre as portas e faz o delivery acontecer.',messages:[
        'Por trás de cada pedido existe uma equipe.',
        'Uma operação organizada começa no básico.',
        'Clareza no cardápio ajuda o atendimento.',
        'Cuidar do cliente começa antes do pedido.',
        'A rotina melhora com processos consistentes.',
        'Sua dedicação movimenta o negócio.',
      ]},
      {cover:'Bom dia. Que a semana traga boas escolhas para sua operação.',messages:[
        'Cada detalhe do atendimento importa.',
        'Uma equipe alinhada trabalha com mais clareza.',
        'Ouça as dúvidas que os clientes repetem.',
        'Prepare a casa antes do horário de pico.',
        'Revise o que pode ser mais simples.',
        'Valorize quem constrói a jornada junto com você.',
      ]},
      {cover:'Bom dia. O cuidado de hoje prepara o serviço de amanhã.',messages:[
        'Comece a semana organizando as prioridades.',
        'Uma informação clara evita muitas dúvidas.',
        'A cozinha e o atendimento precisam conversar.',
        'Faça o simples funcionar bem.',
        'Respeite o ritmo de quem faz acontecer.',
        'Uma boa experiência começa nos bastidores.',
      ]},
      {cover:'Bom dia. Fé, preparo e constância para mais uma semana.',messages:[
        'Comece organizando a equipe e as prioridades.',
        'Uma boa rotina cuida de quem atende e de quem compra.',
        'Antes do movimento, revise seus processos.',
        'Trabalhe com esperança e atenção aos detalhes.',
        'Valorize o esforço de quem está nos bastidores.',
        'Termine o turno com gratidão e aprendizados.',
      ]},
      {cover:'Bom dia. Bons hábitos também constroem bons negócios.',messages:[
        'Uma equipe alinhada começa com comunicação clara.',
        'Revise o cardápio antes de abrir o atendimento.',
        'Faça pausas para voltar com atenção.',
        'Tenha fé, mas também tenha um plano.',
        'Registre o que funciona e ajuste o que não funciona.',
        'Reconheça as pequenas vitórias da sua equipe.',
      ]},
      {cover:'Bom dia. Consistência transforma cuidado em rotina.',messages:[
        'Comece o dia cuidando do preparo.',
        'Priorize quem trabalha ao seu lado.',
        'Crie o hábito de conferir os pedidos com atenção.',
        'Escolha uma melhoria simples para esta semana.',
        'Mantenha o ânimo mesmo nos dias corridos.',
        'Agradeça pelo trabalho concluído.',
      ]},
    ],
    friday:[
      {cover:'Que sua sexta termine com bons pedidos e uma equipe valorizada.',messages:[]},
      {cover:'Encerrar a semana também é reconhecer quem fez acontecer.',messages:[]},
      {cover:'Depois de tantos pedidos, que venha um descanso merecido.',messages:[]},
      {cover:'Que a sexta traga boas entregas, fé e gratidão.',messages:[]},
      {cover:'Obrigado a quem cuidou de cada pedido nesta semana.',messages:[]},
    ],
  },
}
function weeklyMotivation(slug:string, day:string, weekday:number) {
  if(slug!=='eyagencia' && slug!=='velo-delivery') throw new Error('unknown_motivational_brand')
  const kind=weekday===1?'monday':'friday'
  const pool=MOTIVATION[slug][kind]
  const weekIndex=Math.floor(Date.parse(day+'T12:00:00Z')/604800000)
  const choice=pool[((weekIndex%pool.length)+pool.length)%pool.length]
  const hashtag=slug==='eyagencia'?'#EyAgencia #Empreendedorismo #Negocios':
    '#VeloDelivery #Restaurantes #Delivery'
  const intro=weekday===1?'☀️ Bom dia, empreendedor!':'✨ Uma excelente sexta-feira!'
  return {
    cover:choice.cover,slides:choice.messages,
    caption:[intro,'',choice.cover,'',
      weekday===1?'Qual prioridade você vai assumir nesta semana?':
        'Qual foi a pequena conquista da sua equipe nesta semana?',
      '',hashtag].join('\n'),
  }
}
async function createMotivationImage(brand:Brand,day:string,title:string,closing:boolean) {
  const buffer=await renderBrandArt(makeBrandMotivationSvg({
    slug:brand.slug,topic:title,date:day,closing,
  }))
  const asset=await writeClient.assets.upload('image',buffer,{
    filename:'weekly-motivation-'+brand.slug+'-'+day+'.png',contentType:'image/png',
  })
  return {url:asset.url,assetId:asset._id}
}
async function buildMotivationCarousel(brand:Brand,day:string,coverUrl:string,messages:string[]) {
  if(messages.length!==6)throw new Error('motivation_slides_invalid')
  const content=[...messages,'Salve este lembrete e compartilhe com quem empreende.']
  const images=[coverUrl],assetIds:string[]=[]
  for(let i=0;i<content.length;i++){
    const buffer=await renderBrandArt(makeBrandMotivationSvg({
      slug:brand.slug,topic:content[i],date:day+'-'+i,
    }))
    const asset=await writeClient.assets.upload('image',buffer,{
      filename:'weekly-motivation-'+brand.slug+'-'+day+'-'+(i+2)+'.png',
      contentType:'image/png',
    })
    assetIds.push(asset._id)
    images.push(publicJpeg(asset.url))
  }
  if(images.length!==8)throw new Error('motivation_carousel_incomplete')
  return {images,assetIds}
}


type PracticalEdition={cover:string;messages:[string,string,string,string,string,string]}
const PRACTICAL: Record<'eyagencia'|'velo-delivery',PracticalEdition[]> = {
  eyagencia:[
    {cover:'5 ajustes que ajudam uma loja virtual a ser mais clara',messages:[
      'Organize as categorias com nomes que o cliente entende.',
      'Responda às dúvidas mais comuns nas páginas dos produtos.',
      'Deixe as condições de entrega fáceis de localizar.',
      'Revise a experiência de navegação no celular.',
      'Mostre informações úteis antes de pedir o cadastro.',
      'Acompanhe as perguntas repetidas no atendimento.',
    ]},
    {cover:'Como organizar melhor a comunicação do seu negócio',messages:[
      'Comece definindo o que sua empresa resolve.',
      'Fale com clareza sobre sua oferta e público.',
      'Planeje conteúdos que respondam perguntas reais.',
      'Apresente próximos passos sem pressionar o cliente.',
      'Mantenha o mesmo tom em todos os seus canais.',
      'Revise o que as pessoas realmente querem saber.',
    ]},
  ],
  'velo-delivery':[
    {cover:'6 cuidados simples com a operação do delivery',messages:[
      'Revise os horários e informações do cardápio.',
      'Organize os produtos para facilitar a escolha.',
      'Combine o fluxo de pedidos com a equipe.',
      'Confira as informações importantes antes da entrega.',
      'Prepare orientações para as dúvidas mais comuns.',
      'Registre oportunidades de melhoria para a próxima semana.',
    ]},
    {cover:'Como melhorar a comunicação do restaurante com o cliente',messages:[
      'Deixe claros os canais de atendimento.',
      'Mostre os detalhes que ajudam na escolha do pedido.',
      'Informe mudanças de horário com antecedência.',
      'Escute os problemas que se repetem no atendimento.',
      'Não prometa prazos que a operação não consegue cumprir.',
      'Use o retorno dos clientes para revisar processos.',
    ]},
  ],
}
function weeklyPractical(slug:string,day:string){
  if(slug!=='eyagencia'&&slug!=='velo-delivery')throw new Error('unknown_brand')
  const pool=PRACTICAL[slug]
  const idx=Math.floor(Date.parse(day+'T12:00:00Z')/604800000)%pool.length
  const p=pool[idx]
  const hashtag=slug==='eyagencia'?'#EyAgencia #Ecommerce #Empreendedorismo':
    '#VeloDelivery #Delivery #Gestao'
  return {
    cover:p.cover,slides:p.messages,
    caption:['📌 Dicas práticas para quem empreende','',p.cover,'',
      'Salve este carrossel para revisar com a equipe.','',hashtag].join('\n'),
  }
}
async function buildPracticalCarousel(brand:Brand,day:string,coverUrl:string,messages:string[]){
  if(messages.length!==6)throw new Error('practical_slides_invalid')
  const images=[coverUrl],assetIds:string[]=[]
  const captions=[...messages,'Salve este guia e escolha um ajuste para colocar em prática.']
  for(const [i,title] of captions.entries()){
    const svg=makeBrandSocialSvg({
      slug:brand.slug,topic:title,concept:'Dica prática para a operação',date:day+'-tip-'+(i+2),
    })
    const png=await renderBrandArt(svg)
    const asset=await writeClient.assets.upload('image',png,{
      filename:'social-practical-'+brand.slug+'-'+day+'-'+(i+2)+'.png',
      contentType:'image/png',
    })
    assetIds.push(asset._id)
    images.push(publicJpeg(asset.url))
  }
  if(images.length!==8)throw new Error('practical_carousel_incomplete')
  return {images,assetIds}
}

async function processBrand(brand: Brand, day: string, weekday: number): Promise<Result> {
  const slug = brand.slug
  if (![1,4,5].includes(weekday)) return {brand: brand.name, status: 'not-scheduled'}
  const keys = credentials(brand)
  if (!keys) return {brand: brand.name, status: 'credentials-missing'}
  const publicationId = 'social-' + slug + '-' + day
  const already = await writeClient.fetch<{
    _rev: string; status?: string; attempts?: number; publishStartedAt?: string;
    imageUrl?: string; carouselImages?: string[];
    instagramPostId?: string; facebookPostId?: string
  } | null>(
    '*[_id == $id][0]{_rev,status,attempts,publishStartedAt,imageUrl,carouselImages,instagramPostId,facebookPostId}',
    {id: publicationId},
  )
  // A failed draft can be retried once, but NEVER retry after any Meta
  // submission began: the response could be lost after a real publication.
  const canRetry = Boolean(already &&
    already.status === 'blocked' &&
    !already.publishStartedAt &&
    !already.imageUrl && !already.carouselImages?.length &&
    !already.instagramPostId && !already.facebookPostId &&
    Number(already.attempts || 1) < 2)
  if (already && !canRetry) return {brand: brand.name, status: 'already-processed'}
  const plan=weekday===4?weeklyPractical(slug,day):weeklyMotivation(slug,day,weekday)
  const topic=plan.cover
  try {
    if (already && canRetry) {
      await writeClient.patch(publicationId).ifRevisionId(already._rev).set({
        status: 'reserved', attempts: Number(already.attempts || 1) + 1,
        errors: [], lastRetryAt: new Date().toISOString(),
      }).commit()
    } else {
      await writeClient.create({
        _id: publicationId, _type: 'socialPublication', brandId: brand._id,
        brandName: brand.name, day, topic, status: 'reserved', attempts: 1,
        createdAt: new Date().toISOString(),
      })
    }
  } catch {return {brand: brand.name, status: 'already-reserved'}}
  try {
    await writeClient.patch(publicationId).set({status: 'generating'}).commit()
    const generated = plan
    const photo = weekday===4
      ? await createImage(brand,generated.cover,day,generated.cover)
      : await createMotivationImage(brand,day,generated.cover,weekday===5)
    const jpeg = publicJpeg(photo.url)
    // Monday: inspirational carousel. Thursday: practical carousel.
    // Friday: original end-of-week image.
    const carousel = weekday===1
      ? await buildMotivationCarousel(brand,day,jpeg,generated.slides)
      : weekday===4 ? await buildPracticalCarousel(brand,day,jpeg,generated.slides) : null
    await writeClient.patch(publicationId).set({
      caption: generated.caption, imageUrl: jpeg, imageAssetId: photo.assetId,
      ...(carousel ? {format: 'carousel', slideCount: carousel.images.length,
        carouselImages: carousel.images, carouselAssetIds: carousel.assetIds} : {}),
    }).commit()
    const errors: string[] = []
    let facebookPostId: string | null = null
    let instagramPostId: string | null = null
    // Each platform has its own result: success on one platform never causes duplicate posting there.
    // Reserve the external submission phase before any Meta request. On
    // ambiguity, leave this daily job locked to prevent duplicate feed posts.
    await writeClient.patch(publicationId).set({
      status: 'publishing', publishStartedAt: new Date().toISOString(),
    }).commit()
    // Instagram carousel takes priority. Facebook must not consume the
    // function budget before we have published the primary 8-slide post.
    if (brand.instagramEnabled && keys.instagramId) {
      try {
        instagramPostId = carousel
          ? await publishInstagramCarousel(keys.instagramId, keys.pageToken, carousel.images, generated.caption)
          : await publishInstagram(keys.instagramId, keys.pageToken, jpeg, generated.caption)
        await writeClient.patch(publicationId).set({instagramPostId}).commit()
      } catch (error) {errors.push('Instagram: ' + (error instanceof Error ? error.message : 'falha'))}
    }
    if (brand.facebookEnabled && keys.pageId) {
      try {
        facebookPostId = carousel
          ? await publishFacebookCarousel(keys.pageId, keys.pageToken, carousel.images, generated.caption)
          : await metaPost(keys.pageId + '/photos', await facebookPageToken(keys.pageId, keys.pageToken), {
              url: jpeg, message: generated.caption,
            })
        await writeClient.patch(publicationId).set({facebookPostId}).commit()
      } catch (error) {errors.push('Facebook: ' + (error instanceof Error ? error.message : 'falha'))}
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

async function ensureEyagenciaBrand() {
  const exists=await writeClient.fetch<string|null>(
    '*[_type=="socialBrand" && slug.current=="eyagencia"][0]._id'
  )
  if(exists)return
  await writeClient.createIfNotExists({
    _id:'social-brand-eyagencia-weekly',_type:'socialBrand',
    name:'EyAgencia',slug:{_type:'slug',current:'eyagencia'},enabled:true,
    brandGuide:'Agência de marketing digital para negócios e e-commerce. Tom profissional, humano e inspirador. Identidade verde-petróleo, turquesa e coral, sem promessas de resultado.',
    audience:'Empresários, lojistas, gestores e empreendedores brasileiros',
    verifiedFacts:['EyAgencia atua com estratégia de marketing digital.'],
    topics:['Empreendedorismo e consistência','Estratégia de negócios','Valorização de equipes'],
    days:['1','5'],instagramEnabled:true,facebookEnabled:true,
    createdAt:new Date().toISOString(),
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
  // Start next Monday: do not create a Friday post on a transition day
  // that may already contain a published legacy EyAgencia carousel.
  if (day < '2026-11-09') return {enabled:true,day,results:[] as Result[]}
  if (![1,4,5].includes(weekday)) return {enabled:true, day, results:[] as Result[]}
  await ensureInitialBrand()
  await ensureEyagenciaBrand()
  const brands = await writeClient.fetch<Brand[]>(
    '*[_type == "socialBrand" && enabled == true]{_id,name,"slug":slug.current,brandGuide,audience,verifiedFacts,topics,days,website,instagramEnabled,facebookEnabled,approvedImages[]{asset->{url}}}'
  )
  const results:Result[]=[]
  // One scheduled authorial publication per brand; other agents do not post
  // blog articles to the feed under the weekly calendar.
  const scheduled=(brands||[]).filter(b=>b.slug==='velo-delivery'||b.slug==='eyagencia')
  results.push(...await Promise.all(scheduled.map(brand=>processBrand(brand,day,weekday))))
  return {enabled:true,day,results}
}


// One-off production test, authenticated by Vercel Cron and locked in Sanity.
// Only the designated brand and date are eligible. A second trigger never
// publishes again, even if the first invocation partially succeeds.

type VeloBlogSource = {
  id?:string; slug?:string; url?:string; title?:string;
  publishedAt?:string; excerpt?:string;
  sections?:Array<{title?:string;text?:string}>
}
function saneArticle(post:VeloBlogSource) {
  try {
    const link=new URL(post.url||'')
    const when=Date.parse(post.publishedAt||'')
    return Boolean(link.protocol==='https:'&&link.hostname==='velodelivery.com.br'&&
      link.pathname==='/blog/'+encodeURIComponent(post.slug||'')&&
      post.title&&post.title.length>=15&&post.excerpt&&post.excerpt.length>=45&&
      post.sections&&post.sections.length>=3&&
      post.sections.every(item=>item.title&&item.text&&item.text.length>=35)&&
      Number.isFinite(when)&&when<=Date.now()+3600000&&Date.now()-when<21*86400000)
  }catch{return false}
}
async function veloBlogCandidates():Promise<VeloBlogSource[]> {
  const response=await fetch('https://www.velodelivery.com.br/api/social-blog-source',{
    cache:'no-store',redirect:'error',signal:AbortSignal.timeout(18000),
    headers:{Accept:'application/json'},
  })
  if(!response.ok)throw new Error('Velo blog source HTTP '+response.status)
  const data=await response.json() as {ok?:boolean;posts?:VeloBlogSource[]}
  if(!data.ok||!Array.isArray(data.posts))throw new Error('Velo blog source unavailable')
  return data.posts.filter(saneArticle)
}
async function renderVeloBlogCarousel(post:VeloBlogSource,day:string) {
  if(!post.title||!post.sections||!post.excerpt)throw new Error('Velo: blog content incomplete')
  const sections=post.sections.slice(0,4)
  const slides=[
    post.title,
    'Por que esse assunto importa? '+post.excerpt,
    ...sections.map(item=>String(item.title)+': '+String(item.text)),
    ...(sections.length===3?['Na prática: '+String(sections[0]?.text||post.excerpt)]:[]),
    'Em resumo: '+post.excerpt,
    'Leia o artigo completo no blog da Velo Delivery.',
  ]
  if(slides.length!==8)throw new Error('Velo: blog carousel incomplete')
  const images:string[]=[],assetIds:string[]=[]
  for(const [i,title] of slides.entries()){
    const image=makeBrandSocialSvg({
      slug:'velo-delivery',topic:title.slice(0,125),
      concept:'Conteúdo do blog Velo Delivery: '+(post.title||''),
      date:day+'-blog-'+(i+1),
    })
    const png=await renderBrandArt(image)
    const asset=await writeClient.assets.upload('image',png,{
      filename:'velo-blog-carousel-'+day+'-'+(i+1)+'.png',
      contentType:'image/png',
    })
    assetIds.push(asset._id)
    images.push(publicJpeg(asset.url))
  }
  return {images,assetIds}
}
export async function runVeloBlogSocial() {
  if(process.env.VERCEL_ENV!=='production'||
     process.env.SOCIAL_AGENT_ENABLED!=='true'||
     process.env.SOCIAL_AGENT_AUTOPUBLISH_ENABLED!=='true')
    return {enabled:false,results:[] as Result[]}
  const {day,weekday}=brazilDay()
  if(day<'2026-11-08'||![0,2].includes(weekday))
    return {enabled:true,day,results:[{brand:'Velo Delivery',status:'not-scheduled'}]}
  if(!process.env.SANITY_API_WRITE_TOKEN)
    return {enabled:true,day,results:[{brand:'Velo Delivery',status:'sanity-token-missing'}]}
  const publicationId='social-blog-velo-delivery-'+day
  try {
    await ensureInitialBrand()
    const brand=await writeClient.fetch<Brand|null>(
      '*[_type=="socialBrand" && enabled==true && slug.current=="velo-delivery"][0]'+
      '{_id,name,"slug":slug.current,instagramEnabled,facebookEnabled}',
    )
    if(!brand)return {enabled:true,day,results:[{brand:'Velo Delivery',status:'brand-unavailable'}]}
    const keys=credentials(brand)
    if(!keys)return {enabled:true,day,results:[{brand:brand.name,status:'credentials-missing'}]}
    const already=await writeClient.fetch<string|null>(
      '*[_id==$id][0]._id',{id:publicationId},
    )
    if(already)return {enabled:true,day,results:[{brand:brand.name,status:'already-processed'}]}
    const posts=await veloBlogCandidates()
    let chosen:VeloBlogSource|null=null
    for(const post of posts){
      const used=await writeClient.fetch<number>(
        'count(*[_type=="socialPublication" && sourceUrl==$url && brandName==$brand])',
        {url:post.url,brand:brand.name},
      )
      if(!used){chosen=post;break}
    }
    if(!chosen)return {enabled:true,day,results:[{brand:brand.name,status:'no_new_blog_article'}]}
    const article=chosen
    const caption=[
      '📚 Velo Insights | Conteúdo para gestores de delivery',
      '',article.title||'',article.excerpt||'',
      'Confira o artigo completo: '+article.url,'','#VeloDelivery #Delivery #Gestao',
    ].join('\n').slice(0,2100)
    try {
      await writeClient.create({
        _id:publicationId,_type:'socialPublication',
        brandId:brand._id,brandName:brand.name,day,
        topic:article.title,status:'reserved',attempts:1,format:'carousel',
        sourceUrl:article.url,sourcePostId:article.id,
        sourcePublishedAt:article.publishedAt,caption,
        createdAt:new Date().toISOString(),
      })
    }catch{return {enabled:true,day,results:[{brand:brand.name,status:'already-reserved'}]}}
    try {
      await writeClient.patch(publicationId).set({status:'generating'}).commit()
      const slides=await renderVeloBlogCarousel(article,day)
      await writeClient.patch(publicationId).set({
        imageUrl:slides.images[0],carouselImages:slides.images,
        carouselAssetIds:slides.assetIds,slideCount:slides.images.length,
        status:'ready-to-publish',
      }).commit()
      // From this point, a lost Graph response cannot trigger a duplicate post.
      await writeClient.patch(publicationId).set({
        status:'publishing',publishStartedAt:new Date().toISOString(),
      }).commit()
      const errors:string[]=[]
      let instagramPostId:string|null=null,facebookPostId:string|null=null
      if(brand.instagramEnabled && keys.instagramId){
        try{
          instagramPostId=await publishInstagramCarousel(
            keys.instagramId,keys.pageToken,slides.images,caption)
          await writeClient.patch(publicationId).set({instagramPostId}).commit()
        }catch(e){errors.push('Instagram: '+(e instanceof Error?e.message:'unknown'))}
      }
      if(brand.facebookEnabled && keys.pageId){
        try{
          facebookPostId=await publishFacebookCarousel(
            keys.pageId,keys.pageToken,slides.images,caption)
          await writeClient.patch(publicationId).set({facebookPostId}).commit()
        }catch(e){errors.push('Facebook: '+(e instanceof Error?e.message:'unknown'))}
      }
      const success=Boolean(instagramPostId||facebookPostId)
      const status=errors.length?(success?'partial':'failed'):'published'
      await writeClient.patch(publicationId).set({
        status,errors,finishedAt:new Date().toISOString(),
      }).commit()
      console.info('[velo-blog-social] publishing',JSON.stringify({
        day,status,slides:slides.images.length,instagram:!!instagramPostId,
        facebook:!!facebookPostId,errors:errors.length,
      }))
      return {enabled:true,day,results:[{brand:brand.name,status,
        detail:errors.join(' | ').slice(0,180)||undefined}]}
    }catch(error){
      const reason=error instanceof Error?error.message.slice(0,160):'unknown'
      await writeClient.patch(publicationId).set({
        status:'blocked',errors:[reason],finishedAt:new Date().toISOString(),
      }).commit().catch(()=>{})
      return {enabled:true,day,results:[{brand:brand.name,status:'blocked',detail:reason}]}
    }
  }catch(error){
    const reason=error instanceof Error?error.message.slice(0,160):'unknown'
    return {enabled:true,day,results:[{brand:'Velo Delivery',status:'source-unavailable',detail:reason}]}
  }
}

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
      facebookPostId = await metaPost(pageId + '/photos',await facebookPageToken(pageId,token),{
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
