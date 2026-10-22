import {NextRequest, NextResponse} from 'next/server'
import {writeClient} from '../../../../sanity/lib/writeClient'
import {generateUploadAndAttachFeaturedImage} from '../image'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.json({ok: false, error: 'Rota de teste disponível somente em Preview.'}, {status: 403})
  }

  const slug = request.nextUrl.searchParams.get('slug')
  const rawClient = writeClient.withConfig({perspective: 'raw'})
  const post = slug
    ? await rawClient.fetch(
        '*[_type == "post" && !(_id in path("drafts.**")) && slug.current == $slug][0]{_id,title,slug,excerpt,seoDescription}',
        {slug},
      )
    : await rawClient.fetch(
        '*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0]{_id,title,slug,excerpt,seoDescription}',
      )

  if (!post?._id) {
    return NextResponse.json({ok: false, error: 'Post publicado não encontrado.'}, {status: 404})
  }

  const result = await generateUploadAndAttachFeaturedImage({
    postId: String(post._id),
    article: {
      title: post.title,
      slug: post.slug?.current,
      excerpt: post.excerpt,
      seoDescription: post.seoDescription,
    },
  })

  return NextResponse.json({
    ok: result.ok,
    postId: post._id,
    slug: post.slug?.current,
    status: result.status,
    assetRef: result.ok ? result.assetRef : null,
    error: result.ok ? null : result.error,
  }, {status: result.ok ? 200 : 422})
}
