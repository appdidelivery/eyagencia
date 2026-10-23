import {writeClient} from '../../../sanity/lib/writeClient'
import {buildEditorialSvgCover, COVER_GENERATOR_VERSION} from './editorialCover'

type LegacyArticle = {
  _id: string
  _rev: string
  title: string
  excerpt?: string
  seoDescription?: string
  slug?: {current?: string}
  mainImage?: {generationSource?: string; alt?: string}
}

export async function repairLegacyBlogCovers(limit = 3) {
  const count = Math.min(Math.max(limit, 1), 5)
  // Only auto-generated V1 covers. Never modify human-curated images.
  const old = await writeClient.fetch<LegacyArticle[]>(
    '*[_type == "post" && !(_id in path("drafts.**")) && mainImage.generationSource == "eyagencia/free-svg-v1"] | order(publishedAt desc)[0...$limit]{_id,_rev,title,excerpt,seoDescription,slug,mainImage}',
    {limit: count},
  )
  const results: Array<{postId: string; result: string}> = []
  for (const article of old || []) {
    try {
      const svg = buildEditorialSvgCover({
        title: article.title, excerpt: article.excerpt, slug: article.slug?.current,
      })
      const asset = await writeClient.assets.upload('image', svg, {
        filename: 'eyagencia-v2-' + String(article.slug?.current || article._id)
          .replace(/[^a-z0-9-]/g, '').slice(0, 75) + '.svg',
        contentType: 'image/svg+xml',
      })
      // Optimistic lock ensures a simultaneous human edit cannot be overwritten.
      await writeClient.patch(article._id).ifRevisionId(article._rev).set({
        mainImage: {
          _type: 'image',
          asset: {_type: 'reference', _ref: asset._id},
          alt: article.mainImage?.alt || 'Capa do artigo ' + article.title,
          generationSource: COVER_GENERATOR_VERSION,
          generatedAt: new Date().toISOString(),
          prompt: 'Identidade EyAgencia; arte temática automática baseada no artigo, sem custo de inferência.',
        },
        imageStatus: 'generated',
      }).commit()
      results.push({postId: article._id, result: 'repaired'})
    } catch (error) {
      console.error('[blog-cover-repair]', article._id, error instanceof Error ? error.message : 'unknown')
      results.push({postId: article._id, result: 'failed'})
    }
  }
  return results
}
