const VERSION='social-media-v2'
const API='v2026-07-01'
function settings(){
  const project=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET
  const token=process.env.SANITY_API_WRITE_TOKEN
  if(!project||!dataset||!token)throw Error('Sanity configuration incomplete')
  return {project,dataset,token,root:`https://${project}.api.sanity.io/${API}`}
}
function xml(value) {
  return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}
function str(value,limit=210) {
  const v=String(value||'').replace(/\s+/g,' ').trim()
  return v.length>limit ? v.slice(0,limit).replace(/\s+\S*$/,'').trim()+'…' : v
}
function wrap(value,width=24,max=6){
  const words=str(value,240).split(/\s+/).filter(Boolean), result=[]
  let line=''
  for(const word of words){
    const next=line?line+' '+word:word
    if(line&&next.length>width){result.push(line);line=word}else line=next
  }
  if(line)result.push(line)
  if(result.length>max){
    const clipped=result.slice(0,max)
    clipped[max-1]=clipped[max-1].replace(/[.,:;\s]+$/,'')+'…'
    return clipped
  }
  return result
}
function hash(input) {
  let n=2166136261
  for(let i=0;i<input.length;i++)n=Math.imul(n^input.charCodeAt(i),16777619)
  return n>>>0
}
function visualTheme(name) {
  const t=name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  if(/lgpd|privacidade|dados|governanca/.test(t))return {bg:'#0c2630',alt:'#1b5c54',accent:'#77ddbb',label:'DADOS E GOVERNANÇA'}
  if(/seo|busca|geo|aeo/.test(t))return {bg:'#0a2f35',alt:'#275c58',accent:'#bce9dd',label:'SEO E DESCOBERTA'}
  if(/indicador|metrica|avaliar|conversao|performance/.test(t))return {bg:'#0e2937',alt:'#295b6d',accent:'#f2ab83',label:'ANÁLISE E RESULTADOS'}
  return {bg:'#0b2b2b',alt:'#28615b',accent:'#a2e8d4',label:'ESTRATÉGIA DIGITAL'}
}
function titleSvg(lines,x,y,size,color,lineHeight) {
  return lines.map((line,i)=>`<text x="${x}" y="${y+i*lineHeight}" fill="${color}" font-size="${size}" font-weight="800" font-family="Arial,DejaVu Sans,sans-serif">${xml(line)}</text>`).join('')
}
export function makeSocialSvg(pkg,frame,format,index,count,usePhoto=false) {
  const story=format==='story',width=1080,height=story?1920:1350
  const theme=visualTheme(pkg.title||'')
  const seed=hash(pkg.sourceSlug||pkg.title||'eyagencia')
  const variant=(seed+index)%4
  const section=String(frame.kind||'insight').toLowerCase()
  const cover=['cover','hook'].includes(section)
  const cta=section==='cta'
  const headline=str(frame.title||pkg.title||'Radar de Conteúdo',115)
  const content=str(frame.text||'',180)
  const title=wrap(headline,story?20:21,cover?5:4)
  const size=title.length>=5?64:title.length>=4?70:cover?84:78
  const y0=story?610:420
  const lineHeight=size+24
  const detailStart=y0+title.length*lineHeight+54
  const detailSize=story?40:37
  const footer=story?1710:1210
  const remaining=footer-detailStart-100
  const detailLines=Math.max(1,Math.min(4,Math.floor(remaining/(detailSize+20))))
  const detail=wrap(content,story?34:34,detailLines)
  const artX=story?665:710,artY=story?1260:870
  const decorative=[
    `<circle cx="${artX+110}" cy="${artY}" r="195" stroke="${theme.accent}" stroke-width="15" fill="none" opacity=".57"/><circle cx="${artX+110}" cy="${artY}" r="125" stroke="#f1cfae" stroke-width="5" fill="none" opacity=".66"/>`,
    `<path d="M${artX-105} ${artY+150} L${artX+180} ${artY-160} L${artX+310} ${artY-30}" stroke="${theme.accent}" stroke-width="24" stroke-linecap="round" fill="none" opacity=".53"/>`,
    `<rect x="${artX-75}" y="${artY-155}" width="355" height="300" rx="54" transform="rotate(-11 ${artX+100} ${artY})" fill="none" stroke="${theme.accent}" stroke-width="12" opacity=".55"/>`,
    `<path d="M${artX-80} ${artY+80} L${artX+45} ${artY-40} L${artX+115} ${artY+20} L${artX+280} ${artY-145}" fill="none" stroke="${theme.accent}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>`,
  ][variant]
  const accent=variant===0?'#f2ab83':variant===1?'#78e1d2':variant===2?'#bce9dd':theme.accent
  const titleColor=cover? '#ffffff':'#f7fffb'
  const supporting=cta
    ?`<text x="105" y="${Math.min(detailStart,footer-135)}" fill="#f9dfd0" font-size="${story?38:34}" font-family="Arial,sans-serif">Artigo completo no blog da EyAgencia</text>`
    :titleSvg(detail,105,detailStart,detailSize,'#e4f2f0',detailSize+20)
  const photoOverlay=usePhoto
    ?`<rect width="${width}" height="${height}" fill="#051b24" opacity=".53"/>
      <rect x="76" y="${story?420:310}" width="705" height="${story?905:775}" rx="47" fill="#06222a" opacity=".76"/>`
    :`<rect width="${width}" height="${height}" fill="url(#bg)"/>
      <circle cx="${870+variant*23}" cy="${story?1160:810}" r="490" fill="${theme.accent}" opacity=".1"/>
      <path d="M680 ${height} L1080 ${story?1050:610} M770 ${height} L1080 ${story?1210:790}" stroke="${accent}" stroke-width="7" opacity=".23"/>
      <rect x="76" y="${story?420:310}" width="705" height="${story?905:775}" rx="47" fill="#04232b" opacity=".52"/>
      <g>${decorative}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="${theme.bg}"/><stop offset="1" stop-color="${theme.alt}"/>
      </linearGradient>
    </defs>
    ${photoOverlay}
    <path d="M76 0 V${height}" stroke="${accent}" stroke-width="8" opacity=".72"/>
    <rect x="105" y="${story?332:132}" width="470" height="64" rx="17" fill="${accent}"/>
    <text x="131" y="${story?374:175}" fill="#062b32" font-size="26" font-weight="800" font-family="Arial,sans-serif">${xml(theme.label)}</text>
    <text x="105" y="${story?500:291}" fill="${accent}" font-size="31" font-weight="700" font-family="Arial,sans-serif">EYAGENCIA · INTELIGÊNCIA DIGITAL</text>
    <path d="M104 ${story?528:322} H644" stroke="${theme.accent}" stroke-width="6" stroke-linecap="round"/>
    ${titleSvg(title,105,y0,size,titleColor,lineHeight)}
    ${supporting}
    <path d="M105 ${footer} H965" stroke="${accent}" stroke-width="5" opacity=".8"/>
    <text x="105" y="${footer+59}" fill="#f1fffb" font-size="28" font-weight="700" font-family="Arial,sans-serif">${xml(format==='story'?'STORY':'CARROSSEL')} · ${String(index+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}</text>
    <text x="957" y="${footer+59}" text-anchor="end" fill="#f1fffb" font-size="25" font-family="Arial,sans-serif">eyagencia.com.br</text>
  </svg>`
}
async function getPackages(cfg){
  const since=new Date(Date.now()-21*86400000).toISOString()
  const groq='*[_type=="socialPackage" && defined(sourcePublishedAt) && sourcePublishedAt >= $since && state != "published" && (coalesce(mediaStatus,"") != "rendered" || count(carouselMedia) != 8 || count(storyMedia) != 4)] | order(sourcePublishedAt desc)[0...20]{_id,_rev,title,sourceSlug,sourcePostId,carousel,stories,mediaStatus,carouselMedia,storyMedia,"heroImageUrl":*[_type=="post" && _id == ^.sourcePostId][0].mainImage.asset->url}'
  const url=new URL(cfg.root+'/data/query/'+encodeURIComponent(cfg.dataset))
  url.searchParams.set('query',groq)
  url.searchParams.set('$since',JSON.stringify(since))
  const response=await fetch(url,{headers:{Authorization:'Bearer '+cfg.token},cache:'no-store',signal:AbortSignal.timeout(30000)})
  if(!response.ok)throw Error('Social media read failed HTTP '+response.status)
  return (await response.json()).result||[]
}
async function upload(cfg,png,filename){
  const url=cfg.root+'/assets/images/'+encodeURIComponent(cfg.dataset)+'?filename='+encodeURIComponent(filename)
  const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+cfg.token,'Content-Type':'image/png'},body:png,signal:AbortSignal.timeout(45000)})
  if(!response.ok)throw Error('Social media upload HTTP '+response.status)
  const item=(await response.json()).document
  if(!item?._id||!item?.url)throw Error('Sanity upload returned no asset')
  return item
}
async function save(cfg,mutations){
  const response=await fetch(cfg.root+'/data/mutate/'+encodeURIComponent(cfg.dataset)+'?visibility=sync',{
    method:'POST',headers:{Authorization:'Bearer '+cfg.token,'Content-Type':'application/json'},
    body:JSON.stringify({mutations}),signal:AbortSignal.timeout(25000)
  })
  if(!response.ok)throw Error('Social media write HTTP '+response.status)
  return response.json()
}
async function approvedBlogPhoto(url) {
  if(typeof url!=='string'||!/^https:\/\/cdn\.sanity\.io\/images\//.test(url))return null
  try {
    const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)})
    if(!response.ok||!String(response.headers.get('content-type')||'').startsWith('image/'))
      throw new Error('photo_http_or_type')
    const bytes=Buffer.from(await response.arrayBuffer())
    if(bytes.length<8000||bytes.length>12*1024*1024)throw new Error('photo_size')
    return bytes
  }catch(error){
    console.warn('[social-art] source photo unavailable; using illustrated cover',
      error instanceof Error?error.message:'unknown')
    return null
  }
}
async function verifySocialVisual(png,kind){
  const sharp=(await import('sharp')).default
  const expectedHeight=kind==='story'?1920:1350
  const meta=await sharp(png).metadata()
  if(meta.width!==1080||meta.height!==expectedHeight)throw Error('Social visual dimensions failed QA')
  const {data,info}=await sharp(png).extract({
    left:110,top:kind==='story'?540:350,width:540,height:kind==='story'?535:570,
  }).removeAlpha().raw().toBuffer({resolveWithObject:true})
  let glyphs=0
  for(let i=0;i<data.length;i+=info.channels) {
    if(data[i]>220&&data[i+1]>220&&data[i+2]>220)glyphs++
  }
  if(glyphs<1000)throw Error('Social visual failed headline contrast/glyph QA')
}
export async function renderPendingSocialMedia({maxPackages=1}={}){
  const cfg=settings()
  const sharp= (await import('sharp')).default
  const packages=(await getPackages(cfg)).slice(0,Math.min(4,Math.max(1,maxPackages)))
  const results=[]
  for(const pkg of packages){
    const carousel=pkg.carousel||[],stories=pkg.stories||[]
    if(carousel.length!==8||stories.length!==4){
      results.push({id:pkg._id,status:'invalid-frames'})
      continue
    }
    try {
      // Article hero is a licensed first-party Sanity asset. Use only on
      // the carousel cover, never on every frame or on unrelated topics.
      const hero=await approvedBlogPhoto(pkg.heroImageUrl)
      // Prevent concurrent mutable edits and preserve existing art if someone has already rendered.
      const imageRecords=[]
      const frames=[...carousel.map((frame,index)=>({frame,index,kind:'carousel',total:carousel.length})),
        ...stories.map((frame,index)=>({frame,index,kind:'story',total:stories.length}))]
      // Keep concurrency low to respect the Sanity upload API and avoid bursts of RAM use.
      for(let i=0;i<frames.length;i+=3){
        const batch=frames.slice(i,i+3)
        const media=await Promise.all(batch.map(async ({frame,index,kind,total})=>{
          const withPhoto=Boolean(hero&&kind==='carousel'&&index===0)
          const svg=makeSocialSvg(pkg,frame,kind,index,total,withPhoto)
          const size=kind==='story'?[1080,1920]:[1080,1350]
          const overlay=await sharp(Buffer.from(svg)).resize(size[0],size[1]).png({compressionLevel:8}).toBuffer()
          await verifySocialVisual(overlay,kind)
          const png=withPhoto
            ?await sharp(hero).rotate().resize(size[0],size[1],{fit:'cover',position:'attention'})
              .composite([{input:overlay,top:0,left:0}]).png({compressionLevel:8}).toBuffer()
            :overlay
          const name='eyagencia-social-'+String(pkg.sourceSlug||'blog').replace(/[^a-z0-9-]/g,'').slice(0,50)+'-'+kind+'-'+String(index+1)+'.png'
          const asset=await upload(cfg,png,name)
          return {
            _key:kind+'-'+index,
            _type:'socialMediaAsset',
            kind,
            index:index+1,
            image:{_type:'image',asset:{_type:'reference',_ref:asset._id},alt:(frame.title||'EyAgencia')+' ('+(index+1)+'/'+total+')'},
            imageUrl:asset.url
          }
        }))
        imageRecords.push(...media)
      }
      const carouselMedia=imageRecords.filter(x=>x.kind==='carousel').sort((a,b)=>a.index-b.index)
      const storyMedia=imageRecords.filter(x=>x.kind==='story').sort((a,b)=>a.index-b.index)
      await save(cfg,[{patch:{id:pkg._id,ifRevisionID:pkg._rev,set:{
        carouselMedia,storyMedia,mediaStatus:'rendered',mediaVersion:VERSION,
        mediaRenderedAt:new Date().toISOString(),state:'rendered',
      },unset:['mediaError']}}])
      results.push({id:pkg._id,status:'rendered',carousel:carouselMedia.length,stories:storyMedia.length})
    }catch(error){
      const message=error instanceof Error?error.message:'Render failure'
      results.push({id:pkg._id,status:'failed',reason:message.slice(0,160)})
      console.error('[social-render] failed',pkg._id,message.slice(0,160))
    }
  }
  return {version:VERSION,processed:results.length,results}
}
