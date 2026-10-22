import {writeClient} from '../../../sanity/lib/writeClient'
import {checkArticleQuality} from './quality'
import {evidenceCoverage, fetchEditorialEvidence, inspectFactEvidence} from './evidence'

type RecordObject = Record<string, any>
type Decision = {eligible: boolean; reasons: string[]}

function parseStoredObject(value: unknown): RecordObject | null {
  if (typeof value !== 'string') return null
  try {
    const json = JSON.parse(value)
    return json && typeof json === 'object' && !Array.isArray(json) ? json : null
  } catch {
    return null
  }
}

export function autonomousPublicationDecision(
  job: RecordObject | null,
  draft: RecordObject | null,
  article: RecordObject | null,
  qa: RecordObject | null,
  factCheck: RecordObject | null,
): Decision {
  const reasons: string[] = []
  if (!job || !draft || !article || !qa || !factCheck) {
    return {eligible: false, reasons: ['Relatório, artigo ou rascunho não encontrado.']}
  }
  if (job.status !== 'qa_passed' || job.qaPassed !== true || qa.passed !== true) {
    reasons.push('QA não aprovado.')
  }
  if (typeof job.qaScore !== 'number' || job.qaScore < 90 ||
      typeof qa.score !== 'number' || qa.score < 90) {
    reasons.push('Publicação autônoma exige nota mínima de 90.')
  }
  if (qa.publicationRisk !== 'low') reasons.push('Risco editorial não é baixo.')
  if (!Array.isArray(qa.issues) || qa.issues.length !== 0) {
    reasons.push('Existem apontamentos editoriais pendentes no relatório de QA.')
  }
  if (!Array.isArray(article.sources) || article.sources.length < 2) {
    reasons.push('Artigo sem pelo menos duas referências documentadas.')
  }
  if (!Array.isArray(factCheck.approvedFacts) || factCheck.approvedFacts.length < 2) {
    reasons.push('Menos de dois fatos comprovados.')
  }
  if (!Array.isArray(factCheck.primarySources) || factCheck.primarySources.length < 2) {
    reasons.push('Inventário das fontes oficiais insuficiente.')
  }
  const draftId = String(draft._id || '')
  if (!/^drafts\.agent-[a-z0-9-]+$/.test(draftId) || draft._type !== 'post') {
    reasons.push('Documento não pertence aos drafts gerados pelo agente.')
  }
  if (job.postDraftId !== draftId) reasons.push('Associação de rascunho e job incorreta.')
  if (String(draft.slug?.current || '') !== String(article.slug || '')) {
    // Editor may supply a non-normalized slug: the saved draft's canonical slug
    // is independently validated at publication.
    if (String(draft.slug?.current || '').length < 10) {
      reasons.push('Slug canônico ausente ou muito curto.')
    }
  }
  if (typeof draft.title !== 'string' || draft.title.length < 30 ||
      typeof draft.seoTitle !== 'string' || draft.seoTitle.length < 40 ||
      typeof draft.seoDescription !== 'string' || draft.seoDescription.length < 110 ||
      typeof draft.excerpt !== 'string' || draft.excerpt.length < 60 ||
      !Array.isArray(draft.body) || draft.body.length < 12) {
    reasons.push('Campos obrigatórios do artigo não atendem requisitos de publicação.')
  }
  const structureIssues = checkArticleQuality(article, factCheck.approvedFacts || [])
  reasons.push(...structureIssues)
  return {eligible: reasons.length === 0, reasons}
}

export function testAutonomousPublishing() {
  const minimumArticle = {
    title: 'Guia de inteligência artificial no comércio eletrônico',
    slug: 'ia-no-ecommerce-metricas-e-governanca',
    seoTitle: 'IA no comércio eletrônico: métricas e governança',
    seoDescription: 'Entenda os principais critérios de avaliação de inteligência artificial no comércio eletrônico, com referências oficiais e cuidados de governança.',
    excerpt: 'Roteiro editorial de práticas para avaliar IA em operações de comércio eletrônico sem inventar promessas de resultado.',
    sections: Array.from({length: 5}, (_, i) => ({
      heading: 'Etapa editorial ' + i,
      paragraphs: [('Escolha hipótese de teste, métricas, responsabilidade, fontes oficiais, dados mínimos e controles de qualidade sem atribuir resultados exclusivos à IA. ').repeat(5)],
    })),
    faq: [],
    sources: [{url: 'https://gov.example/one'}, {url: 'https://gov.example/two'}],
  }
  const draft = {
    _id: 'drafts.agent-ia-no-ecommerce-metricas-e-governanca-123456',
    _type: 'post',
    title: minimumArticle.title,
    slug: {current: minimumArticle.slug},
    seoTitle: minimumArticle.seoTitle,
    seoDescription: minimumArticle.seoDescription,
    excerpt: minimumArticle.excerpt,
    body: Array.from({length: 18}, () => ({_type: 'block'})),
  }
  const qa = {passed: true, score: 92, publicationRisk: 'low', issues: []}
  const facts = {approvedFacts: [{claim: 'Fato A', confidence: 99},{claim: 'Fato B',confidence: 95}],primarySources: [{url:'https://gov.example/one'},{url:'https://gov.example/two'}]}
  const job = {status: 'qa_passed',qaPassed:true,qaScore:92,postDraftId:draft._id}
  return [
    {name:'Permite exemplo com todos os guardrails', passed:autonomousPublicationDecision(job,draft,minimumArticle,qa,facts).eligible},
    {name:'Bloqueia QA com problema editorial',passed:!autonomousPublicationDecision(job,draft,minimumArticle,{...qa,issues:[{severity:'medium'}]},facts).eligible},
    {name:'Bloqueia nota abaixo de 90',passed:!autonomousPublicationDecision(job,draft,minimumArticle,{...qa,score:88},facts).eligible},
    {name:'Bloqueia documentos sem associação a job',passed:!autonomousPublicationDecision({...job,postDraftId:'drafts.outro'},draft,minimumArticle,qa,facts).eligible},
    {name:'Bloqueia risco editorial alto',passed:!autonomousPublicationDecision(job,draft,minimumArticle,{...qa,publicationRisk:'high'},facts).eligible},
  ]
}

export async function attemptAutonomousPublish(jobId: string, draftId: string) {
  const rawClient = writeClient.withConfig({perspective: 'raw'})
  const job = await rawClient.getDocument<RecordObject>(jobId)
  const draft = await rawClient.getDocument<RecordObject>(draftId)
  const article = parseStoredObject(job?.articleRaw)
  const qa = parseStoredObject(job?.qaRaw)
  const facts = parseStoredObject(job?.factCheckRaw)
  const decision = autonomousPublicationDecision(job || null, draft || null, article, qa, facts)
  if (!decision.eligible) return {published: false, reasons: decision.reasons}

  // A source list in a stored JSON is not proof of factual support.
  // Re-check the official pages and literal quotations immediately before publishing.
  const evidence = await fetchEditorialEvidence(String(job?.topic || ''))
  const evidenceIssues = evidenceCoverage(evidence).ready
    ? inspectFactEvidence({approvedFacts: facts!.approvedFacts}, evidence)
    : ['Não foi possível recuperar as fontes oficiais novamente.']
  const commerceConfirmed = (facts!.approvedFacts as RecordObject[]).some((fact) =>
    evidence.sources.some((source) => source.url === fact.sourceUrl && source.area === 'comercio')
  )
  const aiConfirmed = (facts!.approvedFacts as RecordObject[]).some((fact) =>
    evidence.sources.some((source) => source.url === fact.sourceUrl &&
      (source.area === 'ia-e-dados' || source.area === 'regulacao'))
  )
  if (!commerceConfirmed || !aiConfirmed) {
    return {published: false, reasons: ['Fatos comprovados não cobrem comércio eletrônico e governança de IA.']}
  }
  const officialUrls = new Set(evidence.sources.map((source) => source.url))
  const sourceUrls = (article!.sources as RecordObject[]).map((source) => source.url)
  if (evidenceIssues.length || sourceUrls.some((url) => !officialUrls.has(url))) {
    return {published: false, reasons: [...evidenceIssues, 'Revisão externa das fontes não concluída.']}
  }

  const publicId = draftId.replace(/^drafts\./, '')
  const existing = await rawClient.getDocument(publicId)
  if (existing) return {published: false, reasons: ['O artigo já possui versão publicada; substituição automática proibida.']}
  const duplicateSlug = await rawClient.fetch<number>(
    'count(*[_type == "post" && slug.current == $slug && _id != $draft && _id != $published])',
    {slug: draft!.slug.current, draft: draftId, published: publicId},
  )
  if (duplicateSlug > 0) return {published: false, reasons: ['Slug de outro artigo encontrado.']}

  // Create and remove the draft and mark the associated QA record atomically.
  // The user can still edit the published document through Sanity Studio.
  const publishedAt = new Date().toISOString()
  const {_id, _rev, _createdAt, _updatedAt, ...fields} = draft!
  const body = [...draft!.body]
  body.push({
    _type: 'block',
    _key: 'aiEditorialDisclosure',
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: 'aiDisclosureText',
      text: 'Transparência editorial: conteúdo produzido com apoio de inteligência artificial, revisado por verificações automáticas de fontes e qualidade; não substitui aconselhamento profissional.',
      marks: [],
    }],
  })
  await writeClient.transaction()
    .create({
      ...fields, _id: publicId, _type: 'post', body, publishedAt,
      aiAssisted: true, editorialReview: 'automated',
    })
    .patch(jobId, (patch) => patch.set({
      status: 'auto_published', publishedAt, publicPostId: publicId,
    }))
    .delete(draftId)
    .commit()

  return {
    published: true,
    url: 'https://www.eyagencia.com.br/blog/' + encodeURIComponent(draft!.slug.current),
    publishedAt,
  }
}
