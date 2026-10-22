import {writeClient} from '../../../sanity/lib/writeClient'

type RecordObject = Record<string, any>

export const DEFAULT_IMAGE_MODEL = 'bfl/flux-3-image-klein'
const MAX_IMAGE_UNIT_COST_USD = 0.01

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function titleLines(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? current + ' ' + word : word
    if (next.length > 28 && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function themeLabel(article: RecordObject) {
  const text = (String(article?.title || '') + ' ' + String(article?.excerpt || '')).toLowerCase()
  if (/lgpd|privacidade|dados|seguran/.test(text)) return 'PRIVACIDADE + IA'
  if (/seo|geo|aeo|google|busca/.test(text)) return 'SEO + DESCOBERTA'
  if (/tr[aá]fego|ads|m[ií]dia|roas|cac/.test(text)) return 'PERFORMANCE'
  if (/atendimento|chat|cliente|crm/.test(text)) return 'EXPERIÊNCIA'
  if (/e-?commerce|loja|cat[aá]logo|produto/.test(text)) return 'E-COMMERCE'
  return 'ESTRATÉGIA DIGITAL'
}

function buildFreeSvgCover(article: RecordObject) {
  const title = String(article?.title || 'Conteúdo de e-commerce')
  const lines = titleLines(title)
  const label = themeLabel(article)
  const lineSvg = lines.map((line, index) =>
    '<text x="108" y="' + (330 + index * 86) + '" fill="#f8fafc" font-size="' +
    (lines.length >= 4 ? 62 : 70) +
    '" font-weight="800" font-family="Inter, Arial, sans-serif">' + escapeXml(line) + '</text>'
  ).join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071c1b"/>
      <stop offset="0.55" stop-color="#163d3a"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#49d7b0" stop-opacity=".34"/>
      <stop offset="1" stop-color="#49d7b0" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="900" rx="0" fill="url(#bg)"/>
  <circle cx="1320" cy="255" r="310" fill="url(#glow)"/>
  <circle cx="1420" cy="720" r="190" fill="#f0815b" opacity=".08" filter="url(#soft)"/>
  <g opacity=".28" stroke="#67e8c2" stroke-width="2" fill="none">
    <path d="M1020 128 C1190 70 1420 110 1510 280"/>
    <path d="M970 250 C1160 185 1370 205 1505 370"/>
    <path d="M1070 770 C1210 635 1410 620 1535 720"/>
    <circle cx="1110" cy="180" r="8" fill="#67e8c2"/>
    <circle cx="1270" cy="128" r="6" fill="#67e8c2"/>
    <circle cx="1435" cy="218" r="9" fill="#67e8c2"/>
    <circle cx="1210" cy="700" r="7" fill="#67e8c2"/>
    <circle cx="1410" cy="670" r="8" fill="#67e8c2"/>
  </g>

  <g transform="translate(1030 285)">
    <rect x="0" y="0" width="430" height="300" rx="28" fill="#0b2a28" stroke="#53d8b2" stroke-width="3"/>
    <rect x="34" y="38" width="362" height="190" rx="14" fill="#e8f4f1" opacity=".95"/>
    <rect x="58" y="67" width="120" height="16" rx="8" fill="#275c58"/>
    <rect x="58" y="104" width="240" height="11" rx="5" fill="#94a3b8"/>
    <rect x="58" y="132" width="205" height="11" rx="5" fill="#cbd5e1"/>
    <rect x="58" y="166" width="86" height="40" rx="11" fill="#f0815b"/>
    <circle cx="330" cy="139" r="48" fill="#49d7b0" opacity=".45"/>
    <path d="M185 300 L245 342 L415 342 L430 300 Z" fill="#061716" stroke="#53d8b2" stroke-width="2"/>
  </g>

  <g transform="translate(1185 500)">
    <path d="M95 0 C150 30 190 30 225 40 V135 C225 220 164 270 95 298 C26 270 -35 220 -35 135 V40 C0 30 40 30 95 0Z"
      fill="#103f3a" stroke="#67e8c2" stroke-width="5"/>
    <rect x="51" y="112" width="88" height="78" rx="18" fill="#49d7b0"/>
    <path d="M72 112 V88 C72 56 118 56 118 88 V112" fill="none" stroke="#eafff9" stroke-width="12" stroke-linecap="round"/>
    <circle cx="95" cy="146" r="9" fill="#103f3a"/>
    <path d="M95 153 V171" stroke="#103f3a" stroke-width="8" stroke-linecap="round"/>
  </g>

  <rect x="108" y="104" width="260" height="44" rx="22" fill="#f0815b"/>
  <text x="238" y="134" text-anchor="middle" fill="#fff7ed" font-size="19" letter-spacing="2.5" font-weight="800" font-family="Inter, Arial, sans-serif">${escapeXml(label)}</text>
  <text x="108" y="220" fill="#67e8c2" font-size="28" font-weight="800" letter-spacing="1" font-family="Inter, Arial, sans-serif">EYAGENCIA · RADAR DE CONTEÚDO</text>
  ${lineSvg}
  <rect x="108" y="745" width="580" height="3" rx="2" fill="#67e8c2" opacity=".7"/>
  <text x="108" y="800" fill="#cbd5e1" font-size="22" font-family="Inter, Arial, sans-serif">E-commerce · IA · SEO · Performance</text>
  <text x="1490" y="820" text-anchor="end" fill="#94a3b8" font-size="18" font-family="Inter, Arial, sans-serif">eyagencia.com.br</text>
</svg>`

  return Buffer.from(svg, 'utf8')
}


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
      model: 'eyagencia/free-svg-v1',
      prompt: 'Capa vetorial automática EyAgencia baseada no título e tema do artigo; custo de inferência US$ 0.',
      buffer: buildFreeSvgCover(article),
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
