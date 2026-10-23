const VERSION='social-media-v1'
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
export function makeSocialSvg(pkg,frame,format,index,count){
  const story=format==='story', width=1080, height=story?1920:1350
  const theme=visualTheme(pkg.title||'')
  const seed=hash(pkg.sourceSlug||pkg.title||'eyagencia')
  const section=String(frame.kind||'insight').toLowerCase()
  const cover=['cover','hook'].includes(section)
  const cta=section==='cta'
  const headline=str(frame.title||pkg.title||'Radar de Conteúdo',120)
  const content=str(frame.text||'',180)
  const title=wrap(headline,story?20:22,cover?5:4)
  const mainSize=title.length>=5?64:title.length>=4?70:cover?82:75
  const y0=story?605:435
  const detail=wrap(content,story?36:37,story?5:4)
  const detailStart=y0+title.length*(mainSize+22)+(!cover?70:85)
  const detailSize=story?40:37
  const countLabel=format==='story'?'STORY':'CARROSSEL'
  const totalLabel=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')
  const decoX=story?590:645, decoY=story?1220:810
  const angle=[-13,0,12][(seed+index)%3]
  const corner=story?'1600':'1150'
  const art=cover
    ? `<circle cx="${decoX+120}" cy="${decoY+50}" r="230" stroke="${theme.accent}" stroke-width="12" fill="none" opacity=".24"/>
       <circle cx="${decoX+120}" cy="${decoY+50}" r="142" stroke="${theme.accent}" stroke-width="19" fill="none" opacity=".5"/>
       <path d="M${decoX+5} ${decoY+50} H${decoX+235} M${decoX+120} ${decoY-60} V${decoY+160}" stroke="${theme.accent}" stroke-width="13" opacity=".6"/>`
    : `<rect x="${decoX-25}" y="${decoY-95}" width="330" height="270" rx="52" fill="${theme.accent}" opacity=".10" transform="rotate(${angle} ${decoX+145} ${decoY+50})"/>
       <circle cx="${decoX+145}" cy="${decoY+45}" r="112" stroke="${theme.accent}" stroke-width="15" fill="none" opacity=".5"/>
       <path d="M${decoX+93} ${decoY+38} L${decoX+133} ${decoY+78} L${decoX+210} ${decoY-25}" stroke="${theme.accent}" stroke-width="17" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`
  const textDetail=!cta?titleSvg(detail,105,detailStart,detailSize,'#d9e7e4',detailSize+18):
     `<text x="105" y="${detailStart}" fill="#d9e7e4" font-size="${story?40:36}" font-family="Arial,sans-serif">Artigo completo no blog da EyAgencia</text>`
  const guidance=cta
    ? `<text x="105" y="${story?1470:1110}" fill="${theme.accent}" font-size="37" font-weight="700" font-family="Arial,sans-serif">Link no perfil · eyagencia.com.br/blog</text>`
    : ''
  const safeBottom=story?1710:1218
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="${theme.bg}"/><stop offset="1" stop-color="${theme.alt}"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <circle cx="900" cy="${corner}" r="430" fill="${theme.accent}" opacity=".045"/>
    <path d="M75 0 V${height}" stroke="${theme.accent}" stroke-width="6" opacity=".7"/>
    <rect x="105" y="${story?320:142}" width="420" height="66" rx="33" fill="${theme.accent}"/>
    <text x="131" y="${story?364:186}" fill="${theme.bg}" font-size="28" font-weight="800" font-family="Arial,sans-serif">${xml(theme.label)}</text>
    <text x="105" y="${story?475:280}" fill="${theme.accent}" font-size="30" font-weight="700" font-family="Arial,sans-serif">EYAGENCIA · RADAR DE CONTEÚDO</text>
    ${titleSvg(title,105,y0,mainSize,'#f7fffb',mainSize+22)}
    ${textDetail}
    <g>${art}</g>
    ${guidance}
    <path d="M105 ${safeBottom} H960" stroke="${theme.accent}" stroke-width="4" opacity=".7"/>
    <text x="105" y="${safeBottom+60}" fill="#d8e9e2" font-size="27" font-weight="700" font-family="Arial,sans-serif">${countLabel} · ${xml(totalLabel)}</text>
    <text x="955" y="${safeBottom+60}" text-anchor="end" fill="#e4f3ef" font-size="26" font-family="Arial,sans-serif">eyagencia.com.br</text>
  </svg>`
}
async function getPackages(cfg){
  const groq='*[_type=="socialPackage" && state != "published" && !(mediaStatus == "rendered" && count(carouselMedia) == 8 && count(storyMedia) == 4)] | order(createdAt asc)[0...20]{_id,_rev,title,sourceSlug,sourcePostId,carousel,stories,mediaStatus,carouselMedia,storyMedia}'
  const url=new URL(cfg.root+'/data/query/'+encodeURIComponent(cfg.dataset))
  url.searchParams.set('query',groq)
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
      // Prevent concurrent mutable edits and preserve existing art if someone has already rendered.
      const imageRecords=[]
      const frames=[...carousel.map((frame,index)=>({frame,index,kind:'carousel',total:carousel.length})),
        ...stories.map((frame,index)=>({frame,index,kind:'story',total:stories.length}))]
      // Keep concurrency low to respect the Sanity upload API and avoid bursts of RAM use.
      for(let i=0;i<frames.length;i+=3){
        const batch=frames.slice(i,i+3)
        const media=await Promise.all(batch.map(async ({frame,index,kind,total})=>{
          const svg=makeSocialSvg(pkg,frame,kind,index,total)
          const size=kind==='story'?[1080,1920]:[1080,1350]
          const png=await sharp(Buffer.from(svg)).resize(size[0],size[1]).png({compressionLevel:8}).toBuffer()
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
