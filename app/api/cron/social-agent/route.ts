import {NextRequest, NextResponse} from 'next/server'
import {runSocialPublishing} from '../../social-agent/engine'
import {syncBlogSocialPackages} from '../../social-agent/blogPackage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  // Cron is the ONLY trigger. Never accept credentials in query strings.
  if (!process.env.CRON_SECRET ||
      request.headers.get('authorization') !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ok: false, error: 'Não autorizado.'}, {status: 401})
  }
  try {
    let packages: Array<{slug:string;result:string}> = []
    if (process.env.VERCEL_ENV === 'production' &&
        process.env.CONTENT_AGENT_SOCIAL_PACKAGES_ENABLED === 'true' &&
        process.env.SANITY_API_WRITE_TOKEN) {
      packages = await syncBlogSocialPackages(5)
    }
    const result = await runSocialPublishing()
    console.info('[social-agent] packages', packages.map(p => p.result).join(','))
    return NextResponse.json({ok: true, packages, ...result}, {headers: {'Cache-Control': 'no-store'}})
  } catch {
    return NextResponse.json({ok: false, error: 'Erro de processamento; consulte os registros.'}, {status: 500})
  }
}
