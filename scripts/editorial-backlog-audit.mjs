
const site = process.env.EDITORIAL_AUDIT_SITE
const projectId = site === 'velo' ? process.env.VELO_SANITY_PROJECT_ID : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = site === 'velo' ? process.env.VELO_SANITY_DATASET : process.env.NEXT_PUBLIC_SANITY_DATASET
const token = site === 'velo' ? process.env.VELO_SANITY_API_WRITE_TOKEN : process.env.SANITY_API_WRITE_TOKEN
if (process.env.VERCEL_ENV !== 'production' || !projectId || !dataset || !token) {
 console.log('[editorial-audit] skipped', {site,production:process.env.VERCEL_ENV==='production',configured:Boolean(projectId&&dataset&&token)})
 process.exit(0)
}
async function query(expression) {
 const u=new URL('https://'+projectId+'.api.sanity.io/v2026-07-01/data/query/'+dataset)
 u.searchParams.set('query',expression)
 u.searchParams.set('perspective','raw')
 const res=await fetch(u,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store'})
 if (!res.ok) throw Error('Read failed: '+res.status)
 return (await res.json()).result
}
try {
 const jobs=await query('*[_type=="aiContentJob"] | order(createdAt desc)[0...16]{_id,topic,status,qaScore,qaPassed,postDraftId,publicPostId,createdAt,qaRaw,articleRaw}')
 const posts=await query('*[_type=="post" && _id in path("drafts.**")] | order(_createdAt desc)[0...25]{_id,_rev,title,slug,seoDescription,excerpt,body,mainImage,_createdAt}')
 console.log('[editorial-audit] site='+site+' jobs='+jobs.length+' drafts='+posts.length)
 for(const j of jobs) {
   let qa={},art={}
   try {qa=JSON.parse(j.qaRaw||'{}')} catch {}
   try {art=JSON.parse(j.articleRaw||'{}')} catch {}
   const draft=posts.find(p=>p._id===j.postDraftId)
   const blocks=draft?.body?.filter(b=>b._type==='block')||[]
   const bodyText=blocks.map(b=>(b.children||[]).map(c=>c.text||'').join(' ')).join(' ')
   console.log('[editorial-audit] '+JSON.stringify({id:j._id,topic:j.topic,status:j.status,score:j.qaScore,created:j.createdAt,draft:j.postDraftId,found:Boolean(draft),title:draft?.title,slug:draft?.slug?.current,hasImage:Boolean(draft?.mainImage?.asset?._ref),blockCount:blocks.length,bodyChars:bodyText.length,excerpt:(draft?.excerpt||'').slice(0,230),sample:bodyText.slice(0,620),qaIssues:(qa.issues||[]).map(i=>typeof i==='string'?i:String(i?.detail||JSON.stringify(i))).slice(0,8),references:Array.isArray(art.sources)?art.sources.length:0,sections:Array.isArray(art.sections)?art.sections.length:0}))
 }
 for(const p of posts.filter(p=>!jobs.some(j=>j.postDraftId===p._id)).slice(0,6))console.log('[editorial-audit] unmatched '+JSON.stringify({id:p._id,title:p.title,created:p._createdAt}))
}catch(err){console.error('[editorial-audit] failure',String(err?.message||err))}
