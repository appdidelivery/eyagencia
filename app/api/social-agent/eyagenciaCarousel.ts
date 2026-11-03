import {writeClient} from '../../../sanity/lib/writeClient'

// This module publishes ONLY blog-derived carousels for @eyagencia.
// Never reuse the Velo Delivery socialBrand credentials or its daily feed job.
const GRAPH = 'https://graph.facebook.com/v26.0'
const EXPECTED_SLIDES = 8
const MAX_ATTEMPTS = 2

type Slide = {index?: number; imageUrl?: string}
type Package = {
  _id: string; _rev: string; title?: string; caption?: string
  sourcePostId?: string; sourceSlug?: string; sourceUrl?: string
  carouselMedia?: Slide[]; publishAttempts?: number
}
type MetaResponse = {
  id?: string
  status_code?: string
  permalink?: string
  error?: {code?: number; error_subcode?: number}
}
type Outcome = {status: string; packageId?: string; postId?: string; reason?: string}

function credentials() {
  const instagramId = process.env.SOCIAL_META_INSTAGRAM_ID_EYAGENCIA
  const token = process.env.SOCIAL_META_PAGE_TOKEN_EYAGENCIA
  // Never fall back to another brand's Meta credentials.
  if (!instagramId || !token || !/^\d{8,30}$/.test(instagramId)) return null
  return {instagramId, token}
}

function jpegFromSanity(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' ||
      !url.pathname.startsWith('/images/')) throw new Error('invalid_public_image')
  url.search = ''
  url.searchParams.set('fm', 'jpg')
  url.searchParams.set('w', '1080')
  url.searchParams.set('h', '1350')
  url.searchParams.set('fit', 'crop')
  return url.toString()
}

function validate(pkg: Package) {
  if (!pkg.sourcePostId || !pkg.sourceSlug) throw new Error('article_reference_missing')
  const url = new URL(String(pkg.sourceUrl || ''))
  if (url.protocol !== 'https:' || url.hostname !== 'www.eyagencia.com.br' ||
      url.pathname !== '/blog/' + encodeURIComponent(pkg.sourceSlug)) {
    throw new Error('article_link_invalid')
  }
  if (!pkg.caption || pkg.caption.trim().length < 60 || pkg.caption.length > 2200) {
    throw new Error('caption_invalid')
  }
  const slides = pkg.carouselMedia || []
  if (slides.length !== EXPECTED_SLIDES ||
      slides.some((item, i) => item.index !== i + 1 || !item.imageUrl)) {
    throw new Error('carousel_incomplete')
  }
  return slides.map(item => jpegFromSanity(String(item.imageUrl)))
}

async function requestMeta(
  method: 'GET' | 'POST', endpoint: string, token: string,
  params: Record<string, string> = {},
): Promise<MetaResponse> {
  const url = new URL(GRAPH + '/' + endpoint)
  if (method === 'GET') {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  }
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      ...(method === 'POST' ? {'Content-Type': 'application/x-www-form-urlencoded'} : {}),
    },
    ...(method === 'POST' ? {body: new URLSearchParams(params)} : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  })
  const payload = await response.json().catch(() => ({})) as MetaResponse
  if (!response.ok || (method === 'POST' && !payload.id)) {
    // Never log the full response, credentials, captions or request URL.
    throw new Error('meta_http_' + response.status + '_code_' +
      (payload.error?.code || 'unknown') + '_subcode_' + (payload.error?.error_subcode || 'none'))
  }
  return payload
}

async function ready(containerId: string, token: string) {
  for (let attempt = 0; attempt < 9; attempt++) {
    const response = await requestMeta('GET', containerId, token, {fields: 'status_code'})
    if (response.status_code === 'FINISHED') return
    if (response.status_code === 'ERROR' || response.status_code === 'EXPIRED') {
      throw new Error('meta_container_' + response.status_code.toLowerCase())
    }
    if (attempt < 8) await new Promise(resolve => setTimeout(resolve, 4000))
  }
  throw new Error('meta_container_not_ready')
}

async function findEligiblePackage(): Promise<Package | null> {
  const packages = await writeClient.fetch<Package[]>(
    '*[_type == "socialPackage" && state == "rendered" && mediaStatus == "rendered" && ' +
    'count(carouselMedia) == 8 && !defined(instagramCarouselPostId) && ' +
    '!(publishStatus in ["publishing","published","verification_required"]) && ' +
    'coalesce(publishAttempts,0) < $maxAttempts] | order(sourcePublishedAt desc)[0...8]' +
    '{_id,_rev,title,caption,sourcePostId,sourceSlug,sourceUrl,carouselMedia[]{index,imageUrl},publishAttempts}',
    {maxAttempts: MAX_ATTEMPTS},
  )
  return packages[0] || null
}

async function publishedSource(pkg: Package) {
  const post = await writeClient.fetch<{slug?: string; publishedAt?: string} | null>(
    '*[_type == "post" && _id == $id && defined(publishedAt) && !(_id in path("drafts.**"))]' +
    '[0]{"slug":slug.current,publishedAt}',
    {id: pkg.sourcePostId},
  )
  return Boolean(post?.publishedAt && post.slug === pkg.sourceSlug)
}

export async function publishNextEyagenciaCarousel(): Promise<Outcome> {
  if (process.env.VERCEL_ENV !== 'production' ||
      process.env.EYAGENCIA_CAROUSEL_AUTOPUBLISH_ENABLED !== 'true') {
    return {status: 'disabled'}
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) return {status: 'sanity_unavailable'}
  const keys = credentials()
  if (!keys) return {status: 'eyagencia_meta_credentials_missing'}

  const pkg = await findEligiblePackage()
  if (!pkg) return {status: 'no_rendered_carousel'}
  const result: Outcome = {status: 'failed', packageId: pkg._id}
  let postSubmitted = false

  try {
    // Claim the item before validation so a malformed package cannot block the
    // queue forever. Attempts are bounded even if media or source is invalid.
    await writeClient.patch(pkg._id).ifRevisionId(pkg._rev).set({
      publishStatus: 'publishing',
      lastAttemptAt: new Date().toISOString(),
      publishAttempts: Number(pkg.publishAttempts || 0) + 1,
      publishErrors: [],
    }).commit()
    const urls = validate(pkg)
    if (!(await publishedSource(pkg))) throw new Error('source_article_not_published')

    // The eight children must be created before the parent carousel container.
    const children = await Promise.all(urls.map(async imageUrl => {
      const item = await requestMeta('POST', keys.instagramId + '/media', keys.token, {
        image_url: imageUrl, is_carousel_item: 'true',
      })
      return String(item.id)
    }))
    await Promise.all(children.map(child => ready(child, keys.token)))

    const parent = await requestMeta('POST', keys.instagramId + '/media', keys.token, {
      media_type: 'CAROUSEL', children: children.join(','), caption: pkg.caption!.trim(),
    })
    await ready(String(parent.id), keys.token)
    await writeClient.patch(pkg._id).set({
      instagramCarouselContainerId: String(parent.id),
    }).commit()

    // From here on, an uncertain API outcome is NEVER retried automatically:
    // the post may have reached Instagram before a timeout or Sanity failure.
    postSubmitted = true
    const published = await requestMeta('POST', keys.instagramId + '/media_publish', keys.token, {
      creation_id: String(parent.id),
    })
    const postId = String(published.id)
    await writeClient.patch(pkg._id).set({
      publishStatus: 'published', state: 'published',
      instagramCarouselPostId: postId, publishedPlatforms: ['instagram'],
      publishedAt: new Date().toISOString(), publishErrors: [],
    }).commit()
    console.info('[eyagencia-carousel] published', JSON.stringify({
      packageId: pkg._id, slides: urls.length, postId,
    }))
    return {status: 'published', packageId: pkg._id, postId}
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 120) : 'unknown'
    // If the optimistic claim failed, do not overwrite another worker's state.
    if (/revision|conflict/i.test(reason)) return {status: 'claimed_elsewhere'}
    const status = postSubmitted ? 'verification_required' : 'failed'
    await writeClient.patch(pkg._id).set({
      publishStatus: status, publishErrors: [reason],
    }).commit().catch(() => {})
    console.warn('[eyagencia-carousel] unsuccessful', JSON.stringify({
      packageId: pkg._id, status, reason,
    }))
    return {...result, status, reason}
  }
}
