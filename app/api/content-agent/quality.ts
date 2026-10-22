// Deterministic quality gate complements (never replaces) human editorial review.
// The LLM's numeric score is not sufficient to qualify a draft as publishable.

type Article = Record<string, any>
type Fact = Record<string, any>

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function articlePlainText(article: Article): string {
  const parts: string[] = [String(article.title || ''), String(article.excerpt || '')]
  for (const section of Array.isArray(article.sections) ? article.sections : []) {
    parts.push(String(section?.heading || ''))
    for (const text of Array.isArray(section?.paragraphs) ? section.paragraphs : []) parts.push(String(text))
    for (const text of Array.isArray(section?.bullets) ? section.bullets : []) parts.push(String(text))
  }
  for (const faq of Array.isArray(article.faq) ? article.faq : []) {
    parts.push(String(faq?.question || ''), String(faq?.answer || ''))
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function checkArticleQuality(article: Article, approvedFacts: Fact[]): string[] {
  const issues: string[] = []
  const sections = Array.isArray(article.sections) ? article.sections : []
  const articleText = articlePlainText(article)
  const clean = normalize(articleText)
  const factualEvidence = approvedFacts.map((fact) => String(fact.claim || '')).join(' ')
  const allowableNumbers = new Set(
    [...factualEvidence.matchAll(/\b\d{4}\b|R\$\s?[\d.,]+|\b\d+(?:[.,]\d+)?\s?%/g)]
      .map((match) => normalize(match[0])),
  )

  if (sections.length < 3 || words(articleText) < 420) {
    issues.push('Artigo superficial: mínimo de três seções e 420 palavras de conteúdo substantivo.')
  }
  const seoTitle = String(article.seoTitle || '')
  const description = String(article.seoDescription || '').trim()
  if (seoTitle.length < 40 || seoTitle.length > 70) {
    issues.push('Título SEO fora da faixa de 40 a 70 caracteres.')
  }
  if (description.length < 110 || description.length > 165) {
    issues.push('Descrição SEO fora da faixa de 110 a 165 caracteres.')
  }
  if (!String(article.excerpt || '').trim()) {
    issues.push('Falta resumo executivo do artigo.')
  }
  if (!Array.isArray(article.sources) || article.sources.length < 2) {
    issues.push('Artigo deve indicar ao menos duas fontes rastreáveis.')
  }
  // Disallow unsupported hard numeric performance promises. Year, percentage
  // or money in the article must also be present in an approved sourced claim.
  const numericClaims = [...articleText.matchAll(/\b(?:20[1-3]\d)\b|R\$\s?[\d.,]+|\b\d+(?:[.,]\d+)?\s?%/g)]
    .map((match) => normalize(match[0]))
  for (const item of new Set(numericClaims)) {
    if (!allowableNumbers.has(item)) issues.push('Número sem sustentação em fatos aprovados: ' + item)
  }
  // The documented 2022/2024 sources do not establish 2026 market outcomes.
  if (/\b(?:cresceu|aumentou|movimentou|atingiu|faturou)[^.!?]{0,110}\b2026\b/i.test(articleText)) {
    issues.push('Resultado de mercado em 2026 apresentado sem comprovação específica.')
  }
  // Block absolute statements whose truth is not derivable from government
  // background pages. Recommendations should be explicitly hypothetical.
  if (/\b(?:garante|garantem|comprovadamente|aumenta o faturamento em|eleva as vendas em)\b/i.test(clean)) {
    issues.push('Promessa causal/absoluta não sustentada por experimento.')
  }
  const faq = Array.isArray(article.faq) ? article.faq : []
  const questions = faq.map((item) => normalize(String(item?.question || '')))
  if (new Set(questions).size < questions.length) {
    issues.push('FAQ contém perguntas duplicadas.')
  }
  const headings = sections.map((section) => normalize(String(section?.heading || '')))
  if (new Set(headings).size < headings.length) {
    issues.push('Seções do artigo possuem títulos duplicados.')
  }
  return issues
}

export function testArticleQuality(): Array<{name: string; passed: boolean}> {
  const article = {
    title: 'Como avaliar IA no comércio eletrônico',
    seoTitle: 'Como avaliar IA no comércio eletrônico com segurança',
    seoDescription: 'Veja como planejar testes de inteligência artificial em lojas virtuais com métricas, governança, comparação e revisão humana baseada em fontes.',
    excerpt: 'Passo a passo de avaliação e medição de soluções de IA no e-commerce.',
    sources: [{url: 'https://example.org/1'}, {url: 'https://example.org/2'}],
    sections: [
      {heading: 'Defina a hipótese', paragraphs: [('Defina a hipótese, o público, os dados disponíveis e critérios de sucesso; proponha uma comparação transparente. ').repeat(5)]},
      {heading: 'Separe efeito de outros fatores', paragraphs: [('Compare grupos semelhantes, preço, logística, sazonalidade e qualidade de atendimento antes de concluir algo. ').repeat(5)]},
      {heading: 'Governança e cautela', paragraphs: [('Registre a origem dos dados, mantenha revisão humana e trate mudanças regulatórias somente após confirmar sua vigência. ').repeat(5)]},
      {heading: 'Métricas verificáveis', paragraphs: [('Escolha indicadores de processo, custos, conversão, qualidade, receita e satisfação sem inventar ganhos garantidos. ').repeat(5)]},
      {heading: 'Roteiro de implementação', paragraphs: [('Comece com escopo estreito, documente os riscos, acompanhe resultados e interrompa o teste quando a evidência for insuficiente. ').repeat(5)]},
    ],
    faq: [{question: 'Como medir?', answer: 'Escolha hipótese e experimento.'}],
  }
  const valid = checkArticleQuality(article, [])
  return [
    {name: 'Um artigo metodológico estruturado passa nos guardrails de formato', passed: valid.length === 0},
    {name: 'Números percentuais não suportados são bloqueados', passed: checkArticleQuality({...article, excerpt: 'A IA aumenta conversão em 34%.'}, []).some((x) => x.includes('34'))},
    {name: 'Promessa garantida é bloqueada', passed: checkArticleQuality({...article, excerpt: 'A tecnologia garante lucro.'}, []).some((x) => x.includes('Promessa'))},
    {name: 'Dados não confirmados de 2026 são bloqueados', passed: checkArticleQuality({...article, excerpt: 'O mercado cresceu no Brasil em 2026.'}, []).some((x) => x.includes('2026'))},
    {name: 'Artigo curto é bloqueado', passed: checkArticleQuality({...article, sections: []}, []).some((x) => x.includes('superficial'))},
  ]
}
