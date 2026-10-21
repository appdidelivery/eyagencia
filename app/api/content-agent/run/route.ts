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
const DEFAULT_MODEL = 'nvidia/nemotron-3.5-lightning-free'

// Never silently switch the free pilot to a billable model. Only model IDs
// ending in -free are considered; confirm their live price before any inference.
async function checkZeroCostModel(model: string) {
  if (!model.endsWith('-free')) {
    return {approved: false, model, reason: 'Modelo sem sufixo -free pode gerar custos.'}
  }

  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/models', {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      return {approved: false, model, reason: 'Catálogo de preços indisponível.'}
    }
    const catalog = await response.json()
    const entry = Array.isArray(catalog?.data)
      ? catalog.data.find((candidate: JsonObject) => candidate.id === model)
      : null
    if (!entry) {
      return {approved: false, model, reason: 'Modelo não listado no catálogo atual.'}
    }
    const zeroCost =
      entry.type === 'language' &&
      Number(entry.pricing?.input) === 0 &&
      Number(entry.pricing?.output) === 0 &&
      entry.pricing?.varies_by_provider !== true

    return {
      approved: zeroCost,
      model,
      priceVerified: zeroCost,
      accountAccessVerified: false,
      reason: zeroCost
        ? 'Modelo -free com preço zero no catálogo; permissão da conta será verificada apenas na execução.'
        : 'O catálogo não confirma custo zero para este modelo.',
    }
  } catch {
    return {approved: false, model, reason: 'Não foi possível verificar o preço em tempo real.'}
  }
}

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
  const freePilotMode = model.endsWith('-free')
  const freePilotInstruction =
    args.instructions +
    (args.webSearch
      ? '\nMODO PILOTO GRATUITO: web search nativo está desativado. Não invente fontes, URLs, estatísticas, datas, tendências ou números atuais. Trabalhe apenas com conhecimento geral não temporal e sinalize limitações. Se não puder verificar algo, omita.'
      : '')

  const payload: JsonObject = freePilotMode
    ? {
        model,
        messages: [
          {role: 'system', content: freePilotInstruction},
          {role: 'user', content: args.input},
        ],
        max_completion_tokens: args.maxOutputTokens || 5000,
      }
    : {
        model,
        instructions: args.instructions,
        input: args.input,
        max_output_tokens: args.maxOutputTokens || 5000,
      }

  if (args.webSearch && !freePilotMode) {
    payload.tools = [{type: 'web_search'}]
  }

  const endpoint = freePilotMode
    ? 'https://ai-gateway.vercel.sh/v1/chat/completions'
    : usingGateway
      ? 'https://ai-gateway.vercel.sh/v1/responses'
      : 'https://api.openai.com/v1/responses'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error('AI Gateway ' + response.status + ': ' + detail.slice(0, 700))
  }

  const data = await response.json()
  const text = freePilotMode
    ? String(data?.choices?.[0]?.message?.content || '').trim()
    : extractOutputText(data)
  if (!text) throw new Error('Resposta vazia do agente.')

  return {text, model, responseId: data.id as string | undefined, webSearchActive: Boolean(args.webSearch && !freePilotMode)}
}


const ALLOWED_INTERNAL_PATHS = new Set([
  '/ia-ecommerce',
  '/ia-ecommerce/ferramentas',
  '/ia-ecommerce/guias',
  '/ia-ecommerce/metodologia',
  '/blog',
  '/clientes',
  '/parceiros',
])

// Confirmed against primary Brazilian legal sources on 2026-10-21.
// This list is a safety backstop, NOT a replacement for source verification.
const INCORRECT_LEGAL_REFERENCES = [
  {
    pattern: /lei\s*(?:n[º°o.]*)?\s*15[.]?070\s*\/\s*2024/i,
    issue: 'Lei 15.070/2024 regula bioinsumos, não inteligência artificial.',
  },
  {
    pattern: /lei\s*(?:n[º°o.]*)?\s*14[.]?811\s*\/\s*2024/i,
    issue: 'Lei 14.811/2024 não é uma lei geral sobre mercados digitais ou IA.',
  },
  {
    pattern: /decreto\s*(?:n[º°o.]*)?\s*11[.]?157\s*\/\s*2023/i,
    issue: 'Decreto 11.157 é de 2022, foi revogado e não regula plataformas digitais.',
  },
]

function deterministicEditorialIssues(
  article: JsonObject,
  factCheck: JsonObject,
  webSearchActive: boolean,
): string[] {
  const issues: string[] = []
  const content = JSON.stringify(article)
  for (const reference of INCORRECT_LEGAL_REFERENCES) {
    if (reference.pattern.test(content)) issues.push(reference.issue)
  }

  if (!webSearchActive) {
    // The promotional free model disables native search. Neither a fabricated
    // source URL nor a self-reported confidence score counts as verification.
    // Any unverified workflow must remain in human review regardless of AI score.
    issues.push('Pesquisa web independente desativada; fact-check humano obrigatório.')
    if (Array.isArray(article.sources) && article.sources.length) {
      issues.push('Fontes listadas sem pesquisa web ativa; validação humana obrigatória.')
    }
    if (/\b(?:lei|decreto|portaria|resolu[cç][aã]o)\s*(?:n[º°o.]*)?\s*\d/i.test(content)) {
      issues.push('Citação normativa produzida sem busca web ativa; conferir texto oficial.')
    }
  }

  if (!Array.isArray(factCheck.approvedFacts)) {
    issues.push('Verificação factual sem lista estruturada de fatos aprovados.')
  } else {
    const lowConfidenceFacts = factCheck.approvedFacts.filter(
      (fact: JsonObject) =>
        typeof fact?.confidence === 'number' && fact.confidence < 90,
    )
    if (lowConfidenceFacts.length) {
      issues.push(
        String(lowConfidenceFacts.length) +
          ' afirmação(ões) com confiança inferior a 90% no fact-check; revisão necessária.',
      )
    }
  }

  const unsafeLinks = Array.isArray(article.internalLinks)
    ? article.internalLinks.filter(
        (link: JsonObject) =>
          !link?.url || !ALLOWED_INTERNAL_PATHS.has(String(link.url)),
      )
    : []
  if (unsafeLinks.length) {
    issues.push(String(unsafeLinks.length) + ' link(s) internos não validados foram descartados.')
  }
  return issues
}


function runZeroCostSelfTests() {
  const verified = {approvedFacts: [{confidence: 100}]}
  const legalInputs = [
    'Lei nº 15.070/2024',
    'Lei nº 14.811/2024',
    'Decreto nº 11.157/2023',
  ]
  const tests = legalInputs.map((text) => ({
    name: 'Bloqueio de referência incorreta: ' + text,
    passed: deterministicEditorialIssues(
      {sections: [{heading: text, paragraphs: []}], sources: [], internalLinks: []},
      verified,
      true,
    ).length === 1,
  }))

  tests.push({
    name: 'Rejeição de fonte não verificada quando busca desativada',
    passed: deterministicEditorialIssues(
      {sources: [{title: 'Fonte alegada', url: 'https://example.com'}], internalLinks: []},
      verified,
      false,
    ).some((issue) => issue.includes('sem pesquisa web ativa')),
  })
  tests.push({
    name: 'Bloqueio de link interno fora da allowlist',
    passed: deterministicEditorialIssues(
      {sources: [], internalLinks: [{url: '/blog/slug-inexistente', anchor: 'Link'}]},
      verified,
      true,
    ).some((issue) => issue.includes('não validados')),
  })
  tests.push({
    name: 'Bloqueio de fatos com confiança inferior a 90%',
    passed: deterministicEditorialIssues(
      {sources: [], internalLinks: []},
      {approvedFacts: [{confidence: 45}]},
      true,
    ).some((issue) => issue.includes('inferior a 90%')),
  })
  tests.push({
    name: 'Exemplo básico válido não dispara bloqueios',
    passed: deterministicEditorialIssues(
      {sections: [{heading: 'Melhorias operacionais sem dados não verificados'}], internalLinks: [{url: '/blog', anchor: 'Blog'}], sources: []},
      verified,
      true,
    ).length === 0,
  })

  return {
    ok: tests.every((test) => test.passed),
    service: 'eYagencia Content Agent',
    tests,
    aiCalls: 0,
    sanityWrites: 0,
  }
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

export async function GET(request: NextRequest) {
  if (
    process.env.VERCEL_ENV === 'preview' &&
    request.nextUrl.searchParams.get('check') === 'model'
  ) {
    const model = process.env.CONTENT_AGENT_MODEL || DEFAULT_MODEL
    const status = await checkZeroCostModel(model)
    return NextResponse.json({...status, aiCalls: 0, sanityWrites: 0})
  }

  if (
    process.env.VERCEL_ENV === 'preview' &&
    request.nextUrl.searchParams.get('check') === 'selftest'
  ) {
    const result = runZeroCostSelfTests()
    return NextResponse.json(result, {status: result.ok ? 200 : 500})
  }

  if (
    process.env.VERCEL_ENV === 'preview' &&
    request.nextUrl.searchParams.get('latest') === '1'
  ) {
    const latest = await writeClient.fetch(
      '*[_type == "aiContentJob"] | order(createdAt desc)[0]{topic,status,qaPassed,qaScore,model,postDraftId,createdAt}',
    )
    return NextResponse.json({ok: true, latest})
  }

  if (
    process.env.VERCEL_ENV === 'preview' &&
    request.nextUrl.searchParams.get('check') === 'sanity'
  ) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        {ok: false, service: 'sanity', error: 'SANITY_API_WRITE_TOKEN ausente.'},
        {status: 503},
      )
    }

    const testId = 'drafts.content-agent-credential-check'
    try {
      await writeClient.createOrReplace({
        _id: testId,
        _type: 'aiContentJob',
        topic: 'Credential check',
        status: 'running',
        createdAt: new Date().toISOString(),
      })
      await writeClient.delete(testId)

      return NextResponse.json({
        ok: true,
        service: 'sanity',
        writeAccess: true,
        cleanup: true,
      })
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          service: 'sanity',
          error: error instanceof Error ? error.message : 'Erro desconhecido.',
        },
        {status: 500},
      )
    }
  }

  // Temporary preview-only pilot trigger. It is removed before merging to main.
  // Always refuse an explicit pilot request when the cost gate is disabled.
  if (request.nextUrl.searchParams.get('pilot') === '1') {
    if (
      process.env.VERCEL_ENV !== 'preview' ||
      process.env.CONTENT_AGENT_PILOT_ENABLED !== 'true' ||
      process.env.CONTENT_AGENT_AI_ENABLED !== 'true'
    ) {
      return NextResponse.json(
        {ok: false, error: 'Piloto desabilitado; nenhuma chamada de IA realizada.', aiCalls: 0},
        {status: 403},
      )
    }
    return POST(request)
  }

  return NextResponse.json({
    service: 'eYagencia Content Agent',
    status: 'ready',
    mode: 'draft-only',
    generation: process.env.CONTENT_AGENT_AI_ENABLED === 'true' ? 'enabled' : 'blocked-by-cost-gate',
    flow: ['radar', 'verifier', 'editor', 'qa', 'sanity-draft'],
  })
}

export async function POST(request: NextRequest) {
  // Enforce the spending gate for both POST and GET pilot, before any model call.
  if (process.env.CONTENT_AGENT_AI_ENABLED !== 'true') {
    return NextResponse.json(
      {ok: false, error: 'Geração de IA desabilitada até aprovação do orçamento.', aiCalls: 0},
      {status: 403},
    )
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({error: 'Não autorizado.'}, {status: 401})
  }

  const selectedModel = process.env.CONTENT_AGENT_MODEL || process.env.OPENAI_CONTENT_MODEL || DEFAULT_MODEL
  const costCheck = await checkZeroCostModel(selectedModel)
  if (!costCheck.approved) {
    return NextResponse.json(
      {ok: false, error: 'Execução bloqueada: modelo não comprovadamente gratuito.', costCheck, aiCalls: 0},
      {status: 403},
    )
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
        'Você é o Verificador Editorial da eYagencia. Confirme cada afirmação factual importante com pesquisa atual em fontes primárias. Para leis e decretos brasileiros, valide número, ano, assunto, vigência e tramitação em Planalto, Câmara ou Senado. Nunca confunda aprovação do Senado com lei sancionada. Diferencie fato, estimativa e opinião. Se a pesquisa web não estiver disponível, declare a limitação e não aprove fatos normativos ou números com confiança fictícia. Em approvedFacts inclua confidence numérico de 0 a 100. Rejeite afirmações sem fonte rastreável. Retorne SOMENTE JSON válido, sem markdown.',
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
        'Você é o Editor SEO/GEO/E-E-A-T da eYagencia. Escreva em português do Brasil para público B2B sem clichês de IA, experiência inventada ou promessas de ROI não verificadas. Utilize SOMENTE fatos verificados com confiança >=90 e fonte primária; descarte referências normativas não comprovadas. Não apresente projeto de lei como lei em vigor. Use uma seção única de controles de risco e FAQs breves sem duplicar seções. Diferencie fato verificado, tendência e opinião. Sugira métricas, evidências e riscos para casos de uso sem fabricar resultados. Utilize somente links internos da allowlist e nunca invente autoria, revisão jurídica ou data de publicação. Estruture para SEO/GEO/E-E-A-T e retorne SOMENTE JSON válido, sem markdown.',
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
        'Você é o QA Editorial da eYagencia. Audite fatos contra fontes primárias e fact-check. REFERÊNCIAS INCORRETAS: Lei 15.070/2024 é sobre bioinsumos, Lei 14.811/2024 não regulamenta mercados digitais em geral e Decreto 11.157 é de 2022 e foi revogado. Qualquer menção com enquadramento falso reprova o artigo, independentemente da nota. Se houver fato normativo não verificado, marque passed=false e publicationRisk=high. Avalie SEO, GEO, E-E-A-T, clareza, repetição entre FAQ e corpo, links existentes, dados de ROI e promessas. Não invente revisão humana. Retorne SOMENTE JSON válido, sem markdown.',
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
    const deterministicIssues = deterministicEditorialIssues(
      article,
      factCheck,
      radar.webSearchActive,
    )
    // The model cannot override deterministic factual checks or medium/high risk.
    const qaPassed =
      Boolean(qaResult.passed) &&
      Number(qaResult.score || 0) >= 85 &&
      qaResult.publicationRisk === 'low' &&
      deterministicIssues.length === 0
    const editorialReview = {
      ...qaResult,
      passed: qaPassed,
      issues: [
        ...(Array.isArray(qaResult.issues) ? qaResult.issues : []),
        ...deterministicIssues.map((detail) => ({
          severity: 'high',
          dimension: 'verificacao_deterministica',
          detail,
        })),
      ],
      publicationRisk: deterministicIssues.length ? 'high' : qaResult.publicationRisk,
    }
    const safeArticle = {
      ...article,
      internalLinks: Array.isArray(article.internalLinks)
        ? article.internalLinks.filter(
            (link: JsonObject) => link?.url && ALLOWED_INTERNAL_PATHS.has(String(link.url)),
          )
        : [],
      // Without actual web search, URLs generated by a model are not verified
      // and must not appear in a publishable-looking post body.
      sources: radar.webSearchActive && Array.isArray(article.sources)
        ? article.sources
        : [],
    }

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
      body: articleToPortableText(safeArticle),
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
      articleRaw: JSON.stringify(safeArticle, null, 2),
      qaRaw: JSON.stringify(editorialReview, null, 2),
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
        risk: editorialReview.publicationRisk || null,
        deterministicIssues,
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
