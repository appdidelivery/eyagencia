import {NextResponse} from 'next/server'
import {writeClient} from '../../../../sanity/lib/writeClient'

export const dynamic = 'force-dynamic'

export async function GET() {
  const last = await writeClient.fetch(
    '*[_type == "contentAgentDailyLock"] | order(createdAt desc)[0]{day,status,qaScore,publicationStatus,publicUrl,finishedAt,httpStatus,failureStage,failureCategory,jobId}'
  )

  // A user-requested editorial rewrite can be published after the cron
  // originally completed. Reconcile the associated job and published document
  // so the public status reflects actual publication without erasing original QA.
  if (last?.jobId) {
    const job = await writeClient.fetch(
      '*[_type == "aiContentJob" && _id == $id][0]{status,publicPostId,publishedAt}',
      {id: last.jobId},
    )
    if (job?.publicPostId && job.publishedAt && job.status === 'published_after_revision') {
      const post = await writeClient.fetch(
        '*[_type == "post" && _id == $id][0]{"slug":slug.current}',
        {id: job.publicPostId},
      )
      if (post?.slug) {
        last.status = 'published'
        last.publicationStatus = 'published_after_revision'
        last.publicUrl = 'https://www.eyagencia.com.br/blog/' + encodeURIComponent(post.slug)
        last.publishedAt = job.publishedAt
        last.originalDraftQaScore = last.qaScore
      }
    }
    delete last.jobId
  }
  // A green cron configuration is not proof that any article was published.
  // Expose only aggregate, read-only editorial diagnostics without source text,
  // prompts, token values or unpublished article bodies.
  const since7Days = new Date(Date.now() - 7 * 86400000).toISOString()
  const [latestPublished, publishedLast7Days, rejectedLast7Days] = await Promise.all([
    writeClient.fetch<{title?: string; publishedAt?: string; slug?: {current?: string}} | null>(
      '*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt) && defined(slug.current)] | order(publishedAt desc)[0]{title,publishedAt,slug}',
    ),
    writeClient.fetch<number>(
      'count(*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt > $since])',
      {since: since7Days},
    ),
    writeClient.fetch<number>(
      'count(*[_type == "aiContentJob" && createdAt > $since && status == "needs_review"])',
      {since: since7Days},
    ),
  ])
  const lastPublishedAt = latestPublished?.publishedAt || null
  const hoursWithoutArticle = lastPublishedAt
    ? Math.max(0, Math.floor((Date.now() - Date.parse(lastPublishedAt)) / 3600000))
    : null
  const scheduled = process.env.CONTENT_AGENT_AUTO_DRAFTS_ENABLED === 'true'
  const autoPublishing = process.env.CONTENT_AGENT_AUTO_PUBLISH_ENABLED === 'true'
  const isStalled = Boolean(scheduled && autoPublishing &&
    (hoursWithoutArticle === null || hoursWithoutArticle >= 48))

  return NextResponse.json({
    operational: true, scheduled, autoPublishing, isStalled,
    lastRun: last || null,
    lastPublished: latestPublished ? {
      title: latestPublished.title || null,
      publishedAt: lastPublishedAt,
      url: latestPublished.slug?.current
        ? 'https://www.eyagencia.com.br/blog/' + encodeURIComponent(latestPublished.slug.current)
        : null,
    } : null,
    hoursWithoutArticle,
    last7Days: {published: publishedLast7Days, needsReview: rejectedLast7Days},
  }, {headers: {'Cache-Control': 'no-store'}})
}
