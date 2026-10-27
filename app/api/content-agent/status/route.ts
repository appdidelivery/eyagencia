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
  return NextResponse.json({
    operational: true,
    scheduled: process.env.CONTENT_AGENT_AUTO_DRAFTS_ENABLED === 'true',
    autoPublishing: process.env.CONTENT_AGENT_AUTO_PUBLISH_ENABLED === 'true',
    lastRun: last || null,
  }, {headers: {'Cache-Control': 'no-store'}})
}
