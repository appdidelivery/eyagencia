// Independent, source-bounded research used by the preview content agent.
// Only these reviewed, first-party URLs are fetched; request input never
// determines a URL (prevents SSRF). A reachable page is not proof a claim is true.

type CatalogEntry = {id: string; title: string; publisher: string; url: string; area: string}

export type EvidenceSource = CatalogEntry & {
  excerpt: string
  retrievedAt: string
}

export type EvidenceBundle = {
  topic: string
  retrievedAt: string
  sources: EvidenceSource[]
  missing: string[]
  mode: 'official-sources' | 'out-of-scope'
}

const CATALOG: CatalogEntry[] = [
  {
    id: 'anpd-ia',
    title: 'ANPD — Por que Inteligência Artificial?',
    publisher: 'ANPD',
    url: 'https://www.gov.br/anpd/pt-br/sandbox/por-que-inteligencia-artificial',
    area: 'ia-e-dados',
  },
  {
    id: 'anpd-pl',
    title: 'ANPD — análise preliminar do PL 2.338/2023',
    publisher: 'ANPD',
    url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-analise-preliminar-do-projeto-de-lei-no-2338-2023-que-dispoe-sobre-o-uso-da-inteligencia-artificial',
    area: 'regulacao',
  },
  {
    id: 'mdic-ecommerce',
    title: 'MDIC — Programa E-commerce.BR 2025',
    publisher: 'MDIC',
    url: 'https://www.gov.br/mdic/pt-br/assuntos/sdic/comercio-e-servicos/e-commercebr/e-commercebr-2025',
    area: 'comercio',
  },
  {
    id: 'mdic-observatorio',
    title: 'MDIC — Observatório do Comércio Eletrônico Nacional',
    publisher: 'MDIC',
    url: 'https://www.gov.br/mdic/pt-br/assuntos/sdic/observatorio/projetos',
    area: 'comercio',
  },
  {
    id: 'mdic-dados',
    title: 'MDIC — Perguntas frequentes sobre dados do comércio eletrônico',
    publisher: 'MDIC',
    url: 'https://www.gov.br/mdic/pt-br/assuntos/sdic/observatorio/perguntas-frequentes/perguntas-frequentes-sobre-o-dashboard-de-comercio-eletronico',
    area: 'comercio',
  },
  {
    id: 'anpd-sandbox',
    title: 'ANPD — Metodologia de testagem do Sandbox Regulatório de IA',
    publisher: 'ANPD',
    url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-metodologia-de-testagem-do-sandbox-regulatorio-em-inteligencia-artificial-e-protecao-de-dados',
    area: 'regulacao',
  },
]

export function normalizeEvidence(value: unknown): string {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function isOfficialSourceUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname === 'www.gov.br' && CATALOG.some(
      (entry) => entry.url === parsed.origin + parsed.pathname.replace(/\/$/, ''),
    )
  } catch {
    return false
  }
}

function readableText(html: string): string {
  // Use main article area where possible to reduce navigation noise. Strip
  // scripts/styles and tags; cap what may be supplied to the LLM.
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)
  const segment = (main || article)?.[1] || html
  return segment
    .replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5500)
}

async function retrieveSource(entry: CatalogEntry): Promise<EvidenceSource | null> {
  try {
    const response = await fetch(entry.url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
      headers: {Accept: 'text/html'},
      redirect: 'follow',
    })
    if (!response.ok) return null
    const finalUrl = new URL(response.url)
    if (finalUrl.hostname !== 'www.gov.br') return null
    const type = response.headers.get('content-type') || ''
    if (!type.includes('text/html')) return null
    const length = Number(response.headers.get('content-length') || '0')
    if (length > 1800000) return null
    const html = (await response.text()).slice(0, 1800000)
    const excerpt = readableText(html)
    if (excerpt.length < 250) return null
    return {...entry, excerpt, retrievedAt: new Date().toISOString()}
  } catch {
    return null
  }
}

// Read-only: no paid APIs and no AI calls. The fixed collection is deliberately
// scoped to the editorial AI/e-commerce pilot; other topics fail closed.
export async function fetchEditorialEvidence(topic: string): Promise<EvidenceBundle> {
  const now = new Date().toISOString()
  const inScope = /(?:e[\s-]?commerce|com[eé]rcio eletr[oô]nico|intelig[eê]ncia artificial|\bia\b|lgpd|marketing digital)/i.test(topic)
  if (!inScope) return {topic, retrievedAt: now, sources: [], missing: [], mode: 'out-of-scope'}
  const sources: EvidenceSource[] = []
  const missing: string[] = []
  // Avoid concurrent bursts to gov.br, which intermittently rate-limits requests.
  // In each wave read one AI/governance source and one commerce source. Stop
  // early when both areas have verified pages, but retry with alternatives
  // when an official endpoint fails.
  const waves: string[][] = [
    ['anpd-ia', 'mdic-dados'],
    ['anpd-sandbox', 'mdic-ecommerce'],
    ['anpd-pl', 'mdic-observatorio'],
  ]
  for (const ids of waves) {
    const entries = ids.map((id) => CATALOG.find((entry) => entry.id === id)!)
    const fetched = await Promise.all(entries.map(retrieveSource))
    fetched.forEach((source, index) => {
      if (source) sources.push(source)
      else missing.push(entries[index].id)
    })
    if (sources.some((source) => source.area === 'comercio') &&
        sources.some((source) => source.area !== 'comercio') &&
        sources.length >= 2) break
  }
  return {
    topic,
    retrievedAt: now,
    sources,
    missing,
    mode: 'official-sources',
  }
}

export function evidenceCoverage(bundle: EvidenceBundle) {
  const commerce = bundle.sources.some((source) => source.area === 'comercio')
  const artificialIntelligence = bundle.sources.some(
    (source) => source.area === 'ia-e-dados' || source.area === 'regulacao',
  )
  return {
    commerce,
    artificialIntelligence,
    ready: bundle.sources.length >= 2 && commerce && artificialIntelligence,
  }
}

export function inspectFactEvidence(factCheck: Record<string, any>, bundle: EvidenceBundle): string[] {
  const problems: string[] = []
  const coverage = evidenceCoverage(bundle)
  if (!coverage.ready) {
    problems.push('Fontes insuficientes: são exigidas referências de comércio eletrônico e IA/proteção de dados.')
  }
  if (!Array.isArray(factCheck.approvedFacts) || !factCheck.approvedFacts.length) {
    problems.push('Nenhum fato aprovado com evidência rastreável.')
    return problems
  }
  for (const [index, fact] of factCheck.approvedFacts.entries()) {
    const confidence = Number(fact?.confidence)
    const source = bundle.sources.find((entry) => entry.url === fact?.sourceUrl)
    const quote = typeof fact?.evidenceQuote === 'string' ? normalizeEvidence(fact.evidenceQuote) : ''
    if (!Number.isFinite(confidence) || confidence < 90) {
      problems.push('Fato ' + (index + 1) + ': confiança inferior a 90%.')
    }
    if (!source || quote.length < 25 || !normalizeEvidence(source.excerpt).includes(quote)) {
      problems.push('Fato ' + (index + 1) + ': URL ou trecho comprobatório não corresponde à fonte consultada.')
    }
  }
  return problems
}

export function sanitizeArticleSources(
  article: Record<string, any>,
  bundle: EvidenceBundle,
): Array<{title: string; url: string}> {
  if (!Array.isArray(article.sources)) return []
  const valid = new Set(bundle.sources.map((source) => source.url))
  const added = new Set<string>()
  return article.sources
    .filter((item: any) => {
      const url = item?.url
      if (!valid.has(url) || added.has(url)) return false
      added.add(url)
      return true
    })
    .map((item: any) => ({title: bundle.sources.find((src) => src.url === item.url)!.title, url: item.url}))
}

export function testEditorialEvidence(): Array<{name: string; passed: boolean}> {
  const testBundle: EvidenceBundle = {
    topic: 'IA',
    retrievedAt: '2026-10-21T00:00:00Z',
    mode: 'official-sources',
    missing: [],
    sources: [
      { ...CATALOG[0], retrievedAt: '2026-10-21T00:00:00Z', excerpt: 'A proteção de dados pessoais exige finalidades claras, proporcionais e transparentes para sistemas de inteligência artificial.' },
      { ...CATALOG[2], retrievedAt: '2026-10-21T00:00:00Z', excerpt: 'O projeto piloto de comércio eletrônico oferece oportunidades de capacitação e digitalização para negócios brasileiros.' },
    ],
  }
  return [
    {name: 'URL externa ou arbitrária nunca entra na lista oficial', passed: !isOfficialSourceUrl('https://evil.example.com/anpd')},
    {name: 'URL oficial conhecida é reconhecida', passed: isOfficialSourceUrl(CATALOG[0].url)},
    {name: 'Bloqueia fonte inventada', passed: inspectFactEvidence({approvedFacts: [{confidence: 99, sourceUrl: 'https://fake.example', evidenceQuote: 'A proteção de dados pessoais exige finalidades claras'}]}, testBundle).length > 0},
    {name: 'Aceita citação textual ligada à fonte lida', passed: inspectFactEvidence({approvedFacts: [{confidence: 95, sourceUrl: CATALOG[0].url, evidenceQuote: 'A proteção de dados pessoais exige finalidades claras, proporcionais e transparentes'}]}, testBundle).length === 0},
    {name: 'Não inclui links não consultados nas referências', passed: sanitizeArticleSources({sources: [{url: CATALOG[0].url}, {url: 'https://fake.example'}]}, testBundle).length === 1},
    {name: 'Exige cobertura de IA e de comércio eletrônico', passed: evidenceCoverage(testBundle).ready},
    {name: 'Bloqueia dossiê só de IA, sem mercado', passed: !evidenceCoverage({...testBundle, sources: [testBundle.sources[0]]}).ready},
  ]
}
