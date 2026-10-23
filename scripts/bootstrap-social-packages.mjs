const enabled=process.env.VERCEL_ENV==='production' && process.env.CONTENT_AGENT_SOCIAL_PACKAGES_ENABLED==='true'
if(!enabled){console.info('[social-bootstrap] inactive');process.exit(0)}
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET
const token=process.env.SANITY_API_WRITE_TOKEN
if(!projectId||!dataset||!token){console.error('[social-bootstrap] missing Sanity configuration');process.exit(1)}
const base=`https://${projectId}.api.sanity.io/v2026-07-01`
const tidy=(raw,n=230)=>{const s=String(raw||'').replace(/\s+/g,' ').trim();if(s.length<=n)return s;const cut=s.slice(0,n);return (cut.slice(0,cut.lastIndexOf(' '))||cut).trim()+'…'}
function extract(post){
  const lines=[], paragraphs=[]
  let current=null
  for(const block of post.body||[]){
    if(block._type!=='block')continue
    const line=tidy((block.children||[]).map(x=>x.text||'').join(''),400)
    if(!line||/^transparência editorial:/i.test(line))continue
    if(block.style==='h2'||block.style==='h3'){current={heading:tidy(line,80),description:''};lines.push(current)}
    else{if(line.length>55)paragraphs.push(line);if(current&&!current.description&&line.length>40)current.description=line}
  }
  const insights=lines.filter(x=>x.description.length>40)
  for(const paragraph of paragraphs){
    if(insights.length>=3)break
    if(insights.some(x=>x.description===paragraph))continue
    const title=tidy((paragraph.match(/^[^.!?]+[.!?]/)||[])[0]||paragraph,75)
    insights.push({heading:title,description:paragraph})
  }
  return insights.slice(0,4)
}
function make(post){
  if(!post._id||!post.title||!post.slug||!post.publishedAt)return null
  const insights=extract(post)
  if(insights.length<3)return null
  const intro=tidy(post.excerpt||insights[0].description,200)
  const url='https://www.eyagencia.com.br/blog/'+encodeURIComponent(post.slug)
  const three=insights.slice(0,3)
  const carousel=[
    {kind:'cover',title:tidy(post.title,110)},
    {kind:'context',title:'O contexto',text:intro},
    ...three.map(x=>({kind:'insight',title:tidy(x.heading,80),text:tidy(x.description,170)})),
    {kind:'application',title:'Na prática',text:tidy(insights[3]?.description||insights[2].description,170)},
    {kind:'summary',title:'O que levar deste artigo',text:intro},
    {kind:'cta',title:'Leia o artigo completo',text:'Aprofunde esse tema no blog da EyAgencia.',link:url}
  ].map((x,i)=>({...x,_type:'socialFrame',_key:'slide-'+i}))
  const stories=[
    {kind:'hook',title:tidy(post.title,95)},
    {kind:'insight',title:three[0].heading,text:tidy(three[0].description,130)},
    {kind:'practical',title:'Aplique o aprendizado',text:tidy(three[2].description,130)},
    {kind:'cta',title:'Veja o conteúdo completo',text:'Leia no blog da EyAgencia. Link no perfil.',link:url}
  ].map((x,i)=>({...x,_type:'socialFrame',_key:'story-'+i}))
  const videoScenes=[
    {kind:'hook',title:tidy(post.title,85),durationSeconds:3},
    {kind:'context',title:intro,durationSeconds:6},
    ...three.map(x=>({kind:'insight',title:tidy(x.heading,80),durationSeconds:6})),
    {kind:'cta',title:'Leia no blog da EyAgencia',link:url,durationSeconds:5}
  ].map((x,i)=>({...x,_type:'socialFrame',_key:'scene-'+i}))
  return {
    _id:'social-package-'+post._id.replace(/[^a-zA-Z0-9-]/g,'-'),_type:'socialPackage',
    title:post.title,sourcePostId:post._id,sourceSlug:post.slug,
    sourceUrl:url,sourcePublishedAt:post.publishedAt,formatVersion:'blog-to-social-v1',
    state:'planned',carousel,stories,videoScenes,
    caption:tidy(post.excerpt||insights[0].description,350)+'\n\nLeia o artigo completo no blog da EyAgencia. Link no perfil.\n\n#Ecommerce #MarketingDigital #EyAgencia',
    createdAt:new Date().toISOString()
  }
}
async function query(expression){
  const url=new URL(base+'/data/query/'+encodeURIComponent(dataset))
  url.searchParams.set('query',expression);url.searchParams.set('perspective','published')
  const response=await fetch(url,{headers:{Authorization:'Bearer '+token},cache:'no-store'})
  if(!response.ok)throw Error('Sanity read HTTP '+response.status)
  return (await response.json()).result
}
async function mutate(mutations){
  const response=await fetch(base+'/data/mutate/'+encodeURIComponent(dataset)+'?visibility=sync',{
    method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify({mutations}),cache:'no-store'
  })
  if(!response.ok)throw Error('Sanity mutation HTTP '+response.status)
  return response.json()
}
try{
  const posts=await query('*[_type=="post" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc)[0...12]{_id,title,"slug":slug.current,excerpt,body,publishedAt}')
  const plans=(posts||[]).map(make).filter(Boolean)
  const before=await query('count(*[_type=="socialPackage"])')
  if(!posts?.length||!plans.length){
    console.error('[social-bootstrap] empty source, articles='+posts?.length+', eligible='+plans.length)
    process.exitCode=1
  }else{
    await mutate(plans.map(doc=>({createIfNotExists:doc})))
    const after=await query('count(*[_type=="socialPackage"])')
    const verified=await query('*[_type=="socialPackage"] | order(createdAt desc)[0...12]{_id,title,state,"slides":count(carousel),"storiesCount":count(stories)}')
    const valid=(verified||[]).filter(x=>x.slides===8&&x.storiesCount===4)
    console.info('[social-bootstrap] articles='+posts.length+' prepared='+plans.length+' before='+before+' after='+after+' valid='+valid.length)
    if(after<plans.length||valid.length===0)process.exitCode=1
  }
}catch(error){
  console.error('[social-bootstrap] failure:',error instanceof Error?error.message:'unexpected error')
  process.exitCode=1
}
