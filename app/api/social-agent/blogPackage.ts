import {writeClient} from '../../../sanity/lib/writeClient'

type Block = {style?: string; _type?: string; children?: Array<{text?: string}>}
type Post = {_id: string; title: string; slug?: string; excerpt?: string; body?: Block[]; publishedAt?: string}
type SocialFrame = {kind: string; title: string; text?: string; link?: string; durationSeconds?: number}

function clean(s?: string, limit=240) {
  const value = String(s || '').replace(/\s+/g,' ').trim()
  if (value.length <= limit) return value
  const cut = value.slice(0,limit)
  return (cut.slice(0,cut.lastIndexOf(' ')) || cut).replace(/[,:;\s]+$/,'') + '…'
}
function sections(post: Post) {
  const headings: Array<{heading:string; explanation:string}> = []
  let active: {heading:string; explanation:string} | null = null
  for (const block of post.body || []) {
    if (block._type !== 'block') continue
    const value=clean((block.children||[]).map(c=>c.text||'').join(''),300)
    if (!value || /^transparência editorial:/i.test(value)) continue
    if (block.style === 'h2' || block.style === 'h3') {
      active={heading:clean(value,74),explanation:''}
      headings.push(active)
    } else if (active && !active.explanation && value.length>35) {
      active.explanation=clean(value,170)
    }
  }
  return headings.filter(x=>x.explanation.length>35).slice(0,4)
}
export function buildBlogSocialPackage(post: Post) {
  if (!post.slug || !post.publishedAt || !post.title || (post.excerpt||'').length<45) return null
  const insights=sections(post)
  if(insights.length<3) return null // Do not fabricate missing insights just to fill a template.
  const url='https://www.eyagencia.com.br/blog/'+encodeURIComponent(post.slug)
  const carousel: SocialFrame[]=[
    {kind:'cover',title:clean(post.title,110)},
    {kind:'context',title:'Por que esse tema importa?',text:clean(post.excerpt,180)},
    ...insights.slice(0,3).map(x=>({kind:'insight',title:x.heading,text:x.explanation})),
    {kind:'application',title:'Na prática',text:insights[3]?.explanation || insights[2].explanation},
    {kind:'summary',title:'O ponto principal',text:clean(post.excerpt,190)},
    {kind:'cta',title:'Leia o artigo completo',text:'Aprofunde o tema no Radar de Conteúdo da EyAgencia.',link:url},
  ]
  const stories: SocialFrame[]=[
    {kind:'hook',title:clean(post.title,95)},
    {kind:'insight',title:insights[0].heading,text:clean(insights[0].explanation,120)},
    {kind:'practical',title:'Aplicação prática',text:clean(insights[2].explanation,130)},
    {kind:'cta',title:'Leia no blog da EyAgencia',text:'Acesse o artigo completo pelo link indicado no perfil.',link:url},
  ]
  const videoScenes: SocialFrame[]=[
    {kind:'hook',title:clean(post.title,80),durationSeconds:3},
    {kind:'context',title:clean(post.excerpt,145),durationSeconds:6},
    ...insights.slice(0,3).map(x=>({kind:'insight',title:clean(x.heading,85),durationSeconds:6})),
    {kind:'cta',title:'Conteúdo completo no blog',text:'EyAgencia · link no perfil',link:url,durationSeconds:5},
  ]
  const caption=clean(post.excerpt,350)+'\n\nConfira o artigo completo no blog da EyAgencia. Link no perfil.\n\n#Ecommerce #MarketingDigital #EyAgencia'
  return {
    _type:'socialPackage',
    _id:'social-package-'+post._id.replace(/[^a-zA-Z0-9-]/g,'-'),
    sourcePostId:post._id,
    sourceSlug:post.slug,
    sourceUrl:url,
    sourcePublishedAt:post.publishedAt,
    title:post.title,
    formatVersion:'blog-to-social-v1',
    state:'planned',
    carousel:carousel.map((item,index)=>({...item,_key:'slide-'+index})),
    stories:stories.map((item,index)=>({...item,_key:'story-'+index})),
    videoScenes:videoScenes.map((item,index)=>({...item,_key:'scene-'+index})),
    caption,
    createdAt:new Date().toISOString(),
  }
}
export async function syncBlogSocialPackages(limit=3) {
  const posts=await writeClient.fetch<Post[]>(
    '*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt) && defined(slug.current)] | order(publishedAt desc)[0...$limit]{_id,title,"slug":slug.current,excerpt,body,publishedAt}',
    {limit:Math.min(5,Math.max(1,limit))},
  )
  const results: Array<{slug:string;result:string}>=[]
  for (const post of posts||[]) {
    const generated=buildBlogSocialPackage(post)
    if (!generated) {results.push({slug:post.slug||'',result:'source-insufficient'}); continue}
    try {
      await writeClient.createIfNotExists(generated)
      results.push({slug:post.slug||'',result:'planned'})
    } catch (error) {
      console.error('[social-package]', post._id, error instanceof Error ? error.message : 'unknown')
      results.push({slug:post.slug||'',result:'failed'})
    }
  }
  return results
}
