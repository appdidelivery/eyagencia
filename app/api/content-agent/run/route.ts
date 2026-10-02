import {randomUUID} from 'crypto'
import {NextRequest, NextResponse} from 'next/server'
import {writeClient} from '../../../../sanity/lib/writeClient'

export const runtime = 'nodejs'
export const maxDuration = 300

type JsonObject = Record<string, any>

type AgentRequest = {
  topic?: string
  targetKeyword?: string
  audience?: string
}

const DEFAULT_TOPIC = 'E-commerce + Inteligência Artificial em 2026'
const DEFAULT_KEYWORD = 'inteligência artificial no e-commerce'
const DEFAULT_AUDIENCE = 'gestores de e-commerce, marketing e negócios digitais no Brasil'
const DEFAULT_MODEL = 'openai/gpt-6-luna'

function extractOutputText(response: JsonObject): string {
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim()
  }

  const parts: string[] = []
  for (const item of response.output || []) {
    if (item?.type !== 'message') continue
    for (const content of item.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        parts.push(content.text)
      }
    }
  }

  return parts.join('\n').trim()
}

function parseJson(text: string): JsonObject {
  const cleaned = text
    .replace(/^\s*```json\s*/i, '')
    .replace(/^\s*```\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }
    throw new Error('O agente não retornou JSON válido.')
  }
}

async function callAgent(args: {
  instructions: string
  input: string
  webSearch?: boolean
  maxOutputTokens?: number
}) {
  const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  const directOpenAiKey = process.env.OPENAI_API_KEY
  const apiKey = gatewayToken || directOpenAiKey
  if (!apiKey) {
    throw new Error(
      'Autenticação de IA ausente: configure AI_GATEWAY_API_KEY/VERCEL_OIDC_TOKEN ou OPENAI_API_KEY.',
    )
  }

  const usingGateway = Boolean(gatewayToken)
  const model =
    process.env.CONTENT_AGENT_MODEL ||
    process.env.OPENAI_CONTENT_MODEL ||
    (usingGateway ? DEFAULT_MODEL : 'gpt-6-luna')
  const payload: JsonObject = {
    model,
    instructions: args.instructions,
    input: args.input,
    max_output_tokens: args.maxOutputTokens || 5000,
  }

  if (args.webSearch) {
    payload.tools = [{type: 'web_search'}]
  }

  const response = await fetch(
    usingGateway
      ? 'https://ai-gateway.vercel.sh/v1/responses'
      : 'https://api.openai.com/v1/responses',
    {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
      body: JSON.stringify(payload),
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    const detail = await response.text()
    throw new Error('OpenAI Responses API ' + response.status + ': ' + detail.slice(0, 700))
  }

  const data = await response.json()
  const text = extractOutputText(data)
  if (!text) throw new Error('Resposta vazia do agente.')

  return {text, model, responseId: data.id as string | undefined}
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function portableTextBlock(text: string, style = 'normal', extra: JsonObject = {}) {
  return {
    _type: 'block',
    _key: randomUUID().slice(0, 12),
    style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: randomUUID().slice(0, 12),
        text,
        marks: [],
      },
    ],
    ...extra,
  }
}

function portableTextLink(label: string, href: string) {
  const markKey = randomUUID().slice(0, 12)
  return {
    _type: 'block',
    _key: randomUUID().slice(0, 12),
    style: 'normal',
    markDefs: [{_type: 'link', _key: markKey, href}],
    children: [
      {
        _type: 'span',
        _key: randomUUID().slice(0, 12),
        text: label,
        marks: [markKey],
      },
    ],
  }
}

function articleToPortableText(article: JsonObject) {
  const blocks: JsonObject[] = []

  for (const section of article.sections || []) {
    if (section.heading) blocks.push(portableTextBlock(String(section.heading), 'h2'))

    for (const paragraph of section.paragraphs || []) {
      blocks.push(portableTextBlock(String(paragraph)))
    }

    for (const bullet of section.bullets || []) {
      blocks.push(
        portableTextBlock(String(bullet), 'normal', {
          listItem: 'bullet',
          level: 1,
        }),
      )
    }
  }

  if (Array.isArray(article.faq) && article.faq.length) {
    blocks.push(portableTextBlock('Perguntas frequentes', 'h2'))
    for (const item of article.faq) {
      blocks.push(portableTextBlock(String(item.question || ''), 'h3'))
      blocks.push(portableTextBlock(String(item.answer || '')))
    }
  }

  const internalLinks = Array.isArray(article.internalLinks) ? article.internalLinks : []
  if (internalLinks.length) {
    blocks.push(portableTextBlock('Leituras relacionadas', 'h2'))
    for (const item of internalLinks) {
      if (item?.anchor && item?.url) {
        blocks.push(portableTextLink(String(item.anchor), String(item.url)))
      }
    }
  }

  const sources = Array.isArray(article.sources) ? article.sources : []
  if (sources.length) {
    blocks.push(portableTextBlock('Fontes e referências', 'h2'))
    for (const source of sources) {
      if (source?.title && source?.url) {
        blocks.push(portableTextLink(String(source.title), String(source.url)))
      }
    }
  }

  return blocks
}

function isAuthorized(request: NextRequest) {
  // Preview deployments are protected by Vercel Authentication and are used
  // only for the human-reviewed pilot. Production always requires the app secret.
  if (process.env.VERCEL_ENV === 'preview') return true

  const secret = process.env.CONTENT_AGENT_SECRET
  const authorization = request.headers.get('authorization')
  return Boolean(secret && authorization === 'Bearer ' + secret)
}

export async function GET() {
  return NextResponse.json({
    service: 'eYagencia Content Agent',
    status: 'ready',
    mode: 'draft-only',
    flow: ['radar', 'verifier', 'editor', 'qa', 'sanity-draft'],
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({error: 'Não autorizado.'}, {status: 401})
  }

  const hasAiAuth = Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.OPENAI_API_KEY,
  )

  const missing = [
    !hasAiAuth && 'AI_GATEWAY_API_KEY/VERCEL_OIDC_TOKEN (ou OPENAI_API_KEY)',
    !process.env.SANITY_API_WRITE_TOKEN && 'SANITY_API_WRITE_TOKEN',
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 'NEXT_PUBLIC_SANITY_PROJECT_ID',
    !process.env.NEXT_PUBLIC_SANITY_DATASET && 'NEXT_PUBLIC_SANITY_DATASET',
  ].filter(Boolean)

  if (missing.length) {
    return NextResponse.json(
      {error: 'Configuração incompleta.', missing},
      {status: 503},
    )
  }

  const body = (await request.json().catch(() => ({}))) as AgentRequest
  const topic = body.topic?.trim() || DEFAULT_TOPIC
  const targetKeyword = body.targetKeyword?.trim() || DEFAULT_KEYWORD
  const audience = body.audience?.trim() || DEFAULT_AUDIENCE
  const startedAt = new Date().toISOString()

  try {
    const radar = await callAgent({
      webSearch: true,
      maxOutputTokens: 4500,
      instructions:
        'Você é o Radar Editorial da eYagencia. Pesquise fontes atuais e confiáveis. Priorize fontes primárias, documentação oficial, dados recentes e contexto brasileiro. Não invente estatísticas, URLs ou fontes. Retorne SOMENTE JSON válido, sem markdown.',
      input:
        'Data de referência: ' +
        startedAt.slice(0, 10) +
        '\nPauta: ' +
        topic +
        '\nPalavra-chave alvo: ' +
        targetKeyword +
        '\nPúblico: ' +
        audience +
        '\n\nGere um briefing JSON com: searchIntent, angle, readerQuestions, entities, keyFacts, counterpoints, internalLinkIdeas e sources. Em sources use objetos com title, url, publisher, publishedAt quando disponível e whyRelevant.',
    })
    const brief = parseJson(radar.text)

    const verifier = await callAgent({
      webSearch: true,
      maxOutputTokens: 4500,
      instructions:
        'Você é o Verificador Editorial da eYagencia. Confirme cada afirmação factual importante com pesquisa atual. Diferencie fato, estimativa e opinião. Rejeite números sem fonte rastreável. Retorne SOMENTE JSON válido, sem markdown.',
      input:
        'Pauta: ' +
        topic +
        '\n\nBriefing do Radar:\n' +
        JSON.stringify(brief) +
        '\n\nRetorne JSON com: approvedFacts, rejectedClaims, nuances, sources, warnings e confidence de 0 a 100.',
    })
    const factCheck = parseJson(verifier.text)

    const editor = await callAgent({
      maxOutputTokens: 8000,
      instructions:
        'Você é o Editor SEO/GEO/E-E-A-T da eYagencia. Escreva em português do Brasil para público B2B. O texto deve soar editorial e especializado, sem clichês de IA, sem inventar experiência própria e sem linguagem inflada. Use apenas fatos aprovados pelo verificador. Estruture respostas claras para busca tradicional e mecanismos generativos. Retorne SOMENTE JSON válido, sem markdown.',
      input:
        'Pauta: ' +
        topic +
        '\nPalavra-chave: ' +
        targetKeyword +
        '\nPúblico: ' +
        audience +
        '\n\nBriefing:\n' +
        JSON.stringify(brief) +
        '\n\nVerificação factual:\n' +
        JSON.stringify(factCheck) +
        '\n\nGere JSON com: title, slug, seoTitle (50-60 caracteres), seoDescription (150-160 caracteres), excerpt, searchIntent, sections (cada item com heading, paragraphs e bullets opcionais), faq (question/answer), internalLinks (anchor/url usando SOMENTE esta allowlist: /ia-ecommerce, /ia-ecommerce/ferramentas, /ia-ecommerce/guias, /ia-ecommerce/metodologia, /blog, /clientes, /parceiros) e sources (title/url apenas das fontes verificadas). O artigo deve ser aprofundado, útil e acionável.',
    })
    const article = parseJson(editor.text)

    const qa = await callAgent({
      maxOutputTokens: 3500,
      instructions:
        'Você é o QA Editorial da eYagencia. Audite o artigo contra briefing e fact-check. Seja rigoroso com factualidade, SEO, GEO, E-E-A-T, clareza, duplicação, tom B2B e promessas não sustentadas. Retorne SOMENTE JSON válido, sem markdown.',
      input:
        'Briefing:\n' +
        JSON.stringify(brief) +
        '\n\nFact-check:\n' +
        JSON.stringify(factCheck) +
        '\n\nArtigo:\n' +
        JSON.stringify(article) +
        '\n\nRetorne JSON com: passed (boolean), score (0-100), issues, fixes e publicationRisk (low|medium|high). Considere passed somente com score >= 85 e sem problema factual crítico.',
    })
    const qaResult = parseJson(qa.text)
    const qaPassed = Boolean(qaResult.passed) && Number(qaResult.score || 0) >= 85

    const slug = slugify(String(article.slug || article.title || topic)) || 'conteudo-ia'
    const timestamp = Date.now()
    const postDraftId = 'drafts.agent-' + slug + '-' + timestamp
    const jobId = 'ai-content-job-' + timestamp

    const postDraft = {
      _id: postDraftId,
      _type: 'post',
      title: String(article.title || topic),
      slug: {_type: 'slug', current: slug},
      seoTitle: String(article.seoTitle || article.title || topic).slice(0, 70),
      seoDescription: String(article.seoDescription || article.excerpt || '').slice(0, 240),
      excerpt: String(article.excerpt || ''),
      body: articleToPortableText(article),
    }

    await writeClient.create(postDraft)

    await writeClient.create({
      _id: jobId,
      _type: 'aiContentJob',
      topic,
      targetKeyword,
      status: qaPassed ? 'qa_passed' : 'needs_review',
      qaPassed,
      qaScore: Number(qaResult.score || 0),
      model: radar.model,
      postDraftId,
      createdAt: startedAt,
      briefRaw: JSON.stringify(brief, null, 2),
      factCheckRaw: JSON.stringify(factCheck, null, 2),
      articleRaw: JSON.stringify(article, null, 2),
      qaRaw: JSON.stringify(qaResult, null, 2),
    })

    return NextResponse.json({
      ok: true,
      mode: 'draft-only',
      topic,
      model: radar.model,
      jobId,
      postDraftId,
      slug,
      qa: {
        passed: qaPassed,
        score: Number(qaResult.score || 0),
        risk: qaResult.publicationRisk || null,
      },
      nextStep: 'Revisar no Sanity Studio antes de publicar.',
    })
  } catch (error) {
    console.error('[content-agent]', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido.',
      },
      {status: 500},
    )
  }
}
