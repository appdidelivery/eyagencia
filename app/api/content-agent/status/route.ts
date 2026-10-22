import {NextResponse} from 'next/server'
import {writeClient} from '../../../../sanity/lib/writeClient'

export const dynamic = 'force-dynamic'

export async function GET() {
  const last = await writeClient.fetch(
    '*[_type == "contentAgentDailyLock"] | order(createdAt desc)[0]{day,status,qaScore,publicationStatus,publicUrl,finishedAt}'
  )
  return NextResponse.json({
    operational: true,
    scheduled: process.env.CONTENT_AGENT_AUTO_DRAFTS_ENABLED === 'true',
    autoPublishing: process.env.CONTENT_AGENT_AUTO_PUBLISH_ENABLED === 'true',
    lastRun: last || null,
  }, {headers: {'Cache-Control': 'no-store'}})
}
