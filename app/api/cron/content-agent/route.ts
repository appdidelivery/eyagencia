import {NextRequest, NextResponse} from 'next/server'
import {writeClient} from '../../../../sanity/lib/writeClient'
import {POST as createDraft} from '../../content-agent/run/route'
import {attemptAutonomousPublish} from '../../content-agent/publication'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

// Rotating editorial topics grounded in the existing ANPD/MDIC research scope.
// A topic cannot be repeated within 30 days and a calendar day has one lock.
const TOPICS = [
  ['IA no e-commerce: atendimento e revisão humana', 'IA no atendimento de e-commerce'],
  ['IA no e-commerce: métricas e testes de conversão', 'como medir IA no e-commerce'],
  ['IA no e-commerce: governança e proteção de dados', 'governança de IA no e-commerce'],
  ['IA no e-commerce: qualidade de descrições de produtos', 'IA para cadastro de produtos'],
  ['IA no e-commerce: busca interna e relevância', 'IA em busca para e-commerce'],
  ['IA no e-commerce: catalogação e classificação', 'IA para catálogo de lojas virtuais'],
  ['IA no e-commerce: indicadores operacionais sem promessas', 'indicadores IA e-commerce'],
  ['IA no e-commerce: riscos e supervisão editorial', 'revisão humana de IA e-commerce'],
  ['IA no e-commerce: como desenhar experimentos', 'testes de IA no varejo digital'],
  ['IA no e-commerce: experiência de compra e segurança', 'IA e experiência no e-commerce'],
  ['IA no e-commerce: custos ocultos da automação', 'custos de IA no e-commerce'],
  ['IA no e-commerce: auditoria de fontes e E-E-A-T', 'auditoria SEO GEO para IA'],
  ['IA no e-commerce: política de dados de atendimento', 'LGPD e atendimento com IA'],
  ['IA no e-commerce: como avaliar recomendações', 'avaliação de recomendações IA'],
  ['IA no e-commerce: métricas de qualidade em chatbots', 'qualidade de chatbots em lojas virtuais'],
  ['IA no e-commerce: como revisar respostas incorretas', 'revisão de respostas de IA'],
  ['IA no e-commerce: padronização do catálogo', 'padronização de catálogos com IA'],
  ['IA no e-commerce: indicadores de busca de produtos', 'indicadores de busca inteligente'],
  ['IA no e-commerce: governança de recomendações', 'governança de recomendações IA'],
  ['IA no e-commerce: prevenção de conteúdo inventado', 'reduzir alucinação em e-commerce'],
  ['IA no e-commerce: teste controlado de funcionalidades', 'experimentos controlados com IA'],
  ['IA no e-commerce: análise de qualidade no atendimento', 'qualidade do atendimento com IA'],
  ['IA no e-commerce: avaliação de fornecedores', 'escolher fornecedores de IA'],
  ['IA no e-commerce: riscos de compartilhar dados', 'riscos de dados em IA'],
  ['IA no e-commerce: avaliação de respostas automatizadas', 'auditoria de respostas com IA'],
  ['IA no e-commerce: experimentos de jornada de compra', 'experimentos de jornada com IA'],
  ['IA no e-commerce: documentação de processos', 'documentação de fluxos de IA'],
  ['IA no e-commerce: métricas de revisão editorial', 'auditoria editorial de IA'],
  ['IA no e-commerce: verificação de informações de produto', 'checagem de informações de produtos'],
  ['IA no e-commerce: processos de correção e rollback', 'planos de rollback para IA'],
  ['IA no e-commerce: treinamento de equipes sem dados sensíveis', 'treinamento de equipes para IA'],
  ['IA no e-commerce: quando não automatizar decisões', 'limites de automação com IA'],
] as const

export async function GET(request: NextRequest) {
  // Vercel injects Authorization: Bearer <CRON_SECRET> into scheduled requests.
  // Never accept a query-string secret or a public unprotected trigger.
  if (!process.env.CRON_SECRET ||
      request.headers.get('authorization') !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ok: false, error: 'Não autorizado.'}, {status: 401})
  }
  if (process.env.VERCEL_ENV !== 'production' ||
      process.env.CONTENT_AGENT_AUTO_DRAFTS_ENABLED !== 'true' ||
      process.env.CONTENT_AGENT_AI_ENABLED !== 'true') {
    return NextResponse.json({ok: true, skipped: 'Autonomia desativada.'})
  }
  if (!process.env.CONTENT_AGENT_SECRET || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ok: false, error: 'Credenciais de execução ausentes.'}, {status: 503})
  }

  const now = new Date()
  const day = now.toISOString().slice(0, 10)
  const lockId = 'content-agent-daily-' + day
  const existing = await writeClient.fetch<string | null>(
    '*[_id == $id][0]._id',
    {id: lockId},
  )
  if (existing) return NextResponse.json({ok: true, skipped: 'Dia já processado.', day})

  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const start = Math.floor(now.getTime() / 86400000) % TOPICS.length
  let selected: (typeof TOPICS)[number] | undefined
  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[(start + i) % TOPICS.length]
    const previous = await writeClient.fetch<number>(
      'count(*[_type == "aiContentJob" && topic == $topic && createdAt > $cutoff])',
      {topic: topic[0], cutoff},
    )
    if (!previous) {selected = topic; break}
  }
  if (!selected) return NextResponse.json({ok: true, skipped: 'Pautas já processadas nos últimos 30 dias.', day})

  try {
    await writeClient.create({
      _id: lockId, _type: 'contentAgentDailyLock', day,
      status: 'running', createdAt: now.toISOString(), topic: selected[0],
    })
  } catch {
    return NextResponse.json({ok: true, skipped: 'Execução já reservada por outra chamada.', day})
  }

  try {
    const internalRequest = new NextRequest(new URL('/api/content-agent/run', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + process.env.CONTENT_AGENT_SECRET,
      },
      body: JSON.stringify({
        topic: selected[0],
        targetKeyword: selected[1],
        audience: 'gestores de lojas virtuais, agências e times de marketing digital',
      }),
    })
    const response = await createDraft(internalRequest)
    const payload = await response.json().catch(() => ({}))
    const created = response.ok && payload?.ok === true && payload?.mode === 'draft-only'
    await writeClient.patch(lockId).set({
      status: created ? 'completed' : 'error',
      finishedAt: new Date().toISOString(),
      jobId: created ? payload.jobId : null,
      postDraftId: created ? payload.postDraftId : null,
      qaScore: created ? Number(payload.qa?.score || 0) : null,
      qaPassed: created ? payload.qa?.passed === true : false,
      httpStatus: response.status,
    }).commit()
    return NextResponse.json({
      ok: created, day,
      result: created ? 'draft_created' : 'generation_failed',
      qaScore: created ? payload.qa?.score : null,
      qaPassed: created ? payload.qa?.passed : false,
      // Never reveal an internal auth token or raw model response.
    }, {status: created ? 200 : 502})
  } catch {
    await writeClient.patch(lockId).set({status: 'error', finishedAt: new Date().toISOString()}).commit().catch(() => {})
    return NextResponse.json({ok: false, error: 'A execução foi interrompida; sem nova tentativa automática hoje.'}, {status: 500})
  }
}
