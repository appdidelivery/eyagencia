import {writeClient} from '../../../sanity/lib/writeClient'
import {buildEditorialSvgCover, COVER_GENERATOR_VERSION} from './editorialCover'

type RecordObject = Record<string, any>

export const DEFAULT_IMAGE_MODEL = 'bfl/flux-3-image-klein'
const MAX_IMAGE_UNIT_COST_USD = 0.01

function buildFeaturedImagePrompt(article: RecordObject) {
  const title = String(article?.title || 'Conteúdo de e-commerce')
  const excerpt = String(article?.excerpt || article?.seoDescription || '').slice(0, 500)
  return [
    'Create one premium horizontal editorial cover image for the EyAgencia B2B digital marketing blog.',
    'Topic: ' + title + '.',
    excerpt ? 'Context: ' + excerpt + '.' : '',
    'Brand direction: sophisticated Brazilian e-commerce and technology consultancy, dark forest green, teal, charcoal, warm off-white, subtle orange accent.',
    'Visual language: modern editorial illustration or photorealistic tech-business composite, clean composition, premium agency aesthetic, strong focal point, generous negative space.',
    'Use visual metaphors related to the article topic, e-commerce, data, AI, customer experience, marketing performance or digital operations when relevant.',
    'IMPORTANT: no words, no letters, no logos, no watermarks and no fake UI text inside the image. The website renders the title separately.',
    'Avoid generic stock-photo appearance, humanoid robot clichés, excessive neon, clutter and tiny interface details.',
    'Compose so the image remains useful when cropped to 16:9 cards and a wide article hero.',
  ].filter(Boolean).join(' ')
}

async function verifyImageModelBudget(model: string) {
  if (model !== DEFAULT_IMAGE_MODEL) {
    return {approved: false, reason: 'Modelo de imagem fora da allowlist econômica.'}
  }
  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/models', {
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) return {approved: false, reason: 'Catálogo de modelos indisponível.'}
    const catalog = await response.json()
    const entry = Array.isArray(catalog?.data)
      ? catalog.data.find((candidate: RecordObject) => candidate.id === model)
      : null
    if (!entry) return {approved: false, reason: 'Modelo de imagem não encontrado no catálogo.'}

    const pricing = entry.pricing || {}
    const candidates = [
      pricing.image,
      pricing.output_image,
      pricing.output,
      pricing.per_image,
    ].map(Number).filter(Number.isFinite)

    // Some catalog entries expose per-image pricing in provider-specific fields.
    // For this exact allowlisted model, fail closed only when a numeric unit price
    // is visible and exceeds our hard ceiling.
    const visibleUnitPrice = candidates.length ? Math.min(...candidates) : null
    if (visibleUnitPrice !== null && visibleUnitPrice > MAX_IMAGE_UNIT_COST_USD) {
      return {approved: false, reason: 'Preço por imagem acima do teto econômico.'}
    }
    return {approved: true, model, maxUnitCostUsd: MAX_IMAGE_UNIT_COST_USD}
  } catch {
    return {approved: false, reason: 'Não foi possível validar o orçamento da imagem.'}
  }
}

function detectMime(buffer: Buffer) {
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer.length >= 12 && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp'
  return 'image/png'
}

export async function generateFeaturedImage(article: RecordObject) {
  if (process.env.CONTENT_AGENT_IMAGE_ENABLED !== 'true') {
    return {ok: false as const, status: 'disabled', error: 'Geração automática de imagem desativada.'}
  }

  const mode = process.env.CONTENT_AGENT_IMAGE_MODE || 'free-svg'
  if (mode === 'free-svg') {
    return {
      ok: true as const,
      model: COVER_GENERATOR_VERSION,
      prompt: 'Capa vetorial temática com composição por assunto e identidade visual EyAgencia; custo de inferência US$ 0.',
      buffer: buildEditorialSvgCover(article),
      contentType: 'image/svg+xml',
      alt: 'Imagem de capa do artigo ' + String(article?.title || 'EyAgencia'),
    }
  }

  const model = process.env.CONTENT_AGENT_IMAGE_MODEL || DEFAULT_IMAGE_MODEL
  const budget = await verifyImageModelBudget(model)
  if (!budget.approved) {
    return {ok: false as const, status: 'budget_blocked', error: budget.reason}
  }

  const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  if (!token) {
    return {ok: false as const, status: 'auth_missing', error: 'Credencial do AI Gateway ausente.'}
  }

  const prompt = buildFeaturedImagePrompt(article)
  const requestBase = {
    model,
    prompt,
    n: 1,
    response_format: 'b64_json',
  }

  let response = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...requestBase, size: '1536x1024'}),
    cache: 'no-store',
    signal: AbortSignal.timeout(120000),
  })

  // Some providers choose their own native size. Retry once without size rather
  // than falling back to a more expensive model.
  if (!response.ok && response.status === 400) {
    response = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBase),
      cache: 'no-store',
      signal: AbortSignal.timeout(120000),
    })
  }

  if (!response.ok) {
    const detail = await response.text()
    return {
      ok: false as const,
      status: 'generation_failed',
      error: 'AI Gateway ' + response.status + ': ' + detail.slice(0, 400),
    }
  }

  const data = await response.json()
  const base64 = data?.data?.[0]?.b64_json
  if (!base64 || typeof base64 !== 'string') {
    return {ok: false as const, status: 'empty', error: 'Modelo não retornou imagem em base64.'}
  }

  const buffer = Buffer.from(base64, 'base64')
  if (buffer.length < 5000) {
    return {ok: false as const, status: 'invalid', error: 'Arquivo de imagem retornado é inválido.'}
  }

  return {
    ok: true as const,
    model,
    prompt,
    buffer,
    contentType: detectMime(buffer),
    alt: 'Imagem de capa do artigo ' + String(article?.title || 'EyAgencia'),
  }
}

export async function generateUploadAndAttachFeaturedImage(args: {
  postId: string
  article: RecordObject
  jobId?: string | null
}) {
  const generated = await generateFeaturedImage(args.article)
  if (!generated.ok) {
    if (args.jobId) {
      await writeClient.patch(args.jobId).set({
        imageStatus: generated.status === 'disabled' ? 'pending' : 'failed',
        imageError: generated.error,
      }).commit().catch(() => {})
    }
    await writeClient.patch(args.postId).set({
      imageStatus: generated.status === 'disabled' ? 'pending' : 'failed',
    }).commit().catch(() => {})
    return generated
  }

  const extension =
    generated.contentType === 'image/svg+xml' ? 'svg' :
    generated.contentType === 'image/jpeg' ? 'jpg' :
    generated.contentType === 'image/webp' ? 'webp' : 'png'

  try {
    const asset = await writeClient.assets.upload('image', generated.buffer, {
      filename: 'eyagencia-' + String(args.article?.slug || args.article?.title || 'post')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) + '.' + extension,
      contentType: generated.contentType,
    })

    const mainImage = {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: generated.alt,
      prompt: generated.prompt,
      generatedAt: new Date().toISOString(),
      generationSource: generated.model,
    }

    await writeClient.patch(args.postId).set({
      mainImage,
      imageStatus: 'generated',
    }).commit()

    if (args.jobId) {
      await writeClient.patch(args.jobId).set({
        imageGenerated: true,
        imageStatus: 'generated',
        imagePrompt: generated.prompt,
        imageAlt: generated.alt,
        imageAssetRef: asset._id,
        imageModel: generated.model,
      }).unset(['imageError']).commit().catch(() => {})
    }

    return {
      ok: true as const,
      status: 'generated',
      assetRef: asset._id,
      mainImage,
      model: generated.model,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao enviar imagem ao Sanity.'
    if (args.jobId) {
      await writeClient.patch(args.jobId).set({imageStatus: 'failed', imageError: message}).commit().catch(() => {})
    }
    return {ok: false as const, status: 'upload_failed', error: message}
  }
}
