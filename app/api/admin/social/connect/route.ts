import {beginSocialOAuth} from '@/app/lib/social-google-oauth'
export const dynamic='force-dynamic'
export const runtime='nodejs'
export async function POST(request:Request){return beginSocialOAuth(request)}
