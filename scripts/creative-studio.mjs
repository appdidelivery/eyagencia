// Shared editorial creative studio. Only first-party approved visual references are inspected.
// Image text, logos and claims are always rendered later by the deterministic compositor.
import sharp from 'sharp'
import {visualBriefForBrand} from './premium-social-scene.mjs'

export const PREMIUM_IMAGE_MODEL='bfl/flux-3-image'
export const ECONOMY_IMAGE_MODEL='bfl/flux-3-image-klein'
export const VISUAL_REVIEW_MODEL='google/gemini-3.1-flash-lite'
const GATEWAY='https://ai-gateway.vercel.sh/v1'
const MAX_UNIT_USD=0.055
const MAX_ATTEMPTS=2
const SANITY_CDN=/^https:\/\/cdn\.sanity\.io\/images\//

export function approvedCreativeReferences(references=[]){
  return (Array.isArray(references)?references:[])
    .filter(x=>x&&x.approved===true&&typeof x.url==='string'&&SANITY_CDN.test(x.url))
    .slice(0,3).map(x=>({title:String(x.title||'').slice(0,80),
      visualNotes:String(x.visualNotes||'').slice(0,360),url:x.url}))
}
export function creativeBrief({brandSlug,topic,concept='',date='',mode='social',references=[],attempt=1,feedback=''}) {
  const refs=approvedCreativeReferences(references)
  const brand=brandSlug==='velo-delivery'?'VELO DELIVERY':'EYAGENCIA'
  const visualNotes=refs.map(x=>x.title+': '+x.visualNotes).filter(Boolean).join(' | ')
  return [
    'One PREMIUM high-end editorial commercial PHOTOGRAPH, square 1:1, for '+brand+'.',
    visualBriefForBrand(brandSlug,topic,mode),
    'Specific article/post topic: '+String(topic).slice(0,180)+'.',
    'Creative concept: '+String(concept).slice(0,330)+'.',
    visualNotes?'Creative references approved by the brand art director (STYLE only, do not copy existing artwork): '+visualNotes+'.':'',
    'A believable physical scene, premium authentic photographic lighting and coherent materials.',
    'One distinct focal subject placed in the RIGHT THIRD of the frame; LEFT 60% quiet and DARK for large overlaid typography.',
    'No words, letters, text, logos, labels, UI screen text, watermarks, fake metrics or numbers.',
    'Avoid flat gradients, huge geometric shapes, generic stock-style icons, repetitive compositions.',
    'Composition seed: '+String(date).slice(0,30)+'; concept variation '+attempt+'.',
    attempt>1?'Correct these problems in a NEW scene: '+String(feedback).slice(0,420):'',
  ].filter(Boolean).join(' ')
}
export function verifiedUnitImagePrice(entry){
  const prices=[entry?.pricing?.image,entry?.pricing?.per_image,entry?.pricing?.output_image]
    .filter(x=>x!==undefined&&x!==null).map(Number).filter(Number.isFinite)
  if(entry?.type!=='image'||entry?.pricing?.varies_by_provider===true||prices.length===0)return null
  // Default requested size 1024x1024; dimension-specific tariffs may be higher.
  const tiers=entry?.pricing?.image_dimension_quality_pricing||[]
  const sizePrice=Array.isArray(tiers)?tiers.find(x=>x.size==='1024x1024')?.cost:null
  const cost=Math.max(...prices,...(sizePrice!==null&&sizePrice!==undefined?[Number(sizePrice)]:[]))
  return Number.isFinite(cost)&&cost>=0?cost:null
}
async function models(){
  const res=await fetch(GATEWAY+'/models',{cache:'no-store',signal:AbortSignal.timeout(12000)})
  if(!res.ok)throw Error('Catalogo de precos de imagem indisponivel')
  const list=await res.json()
  return Array.isArray(list?.data)?list.data:[]
}
async function visualReview(apiKey,buffer,topic,brandSlug,references){
  const preview=await sharp(buffer).rotate().resize(520,520,{fit:'cover'}).jpeg({quality:72}).toBuffer()
  const parts=[
    {type:'text',text:[
      'Você é diretor de arte publicitário. Avalie a FOTO 1 (nova proposta) para a marca '+brandSlug,
      'e tema '+String(topic).slice(0,180)+'. Se existir FOTO 2, ela é referência de ESTILO, não arte para copiar.',
      'Critérios: cena realista, coerência temática, refinamento fotográfico, protagonista à DIREITA,',
      '60% à esquerda escuro e livre para título; sem texto, números, marcas, logos, watermarks ou interfaces falsas.',
      'Reprove colagens de objetos deformados e visual genérico.',
      'Retorne SOMENTE JSON: {"approved":boolean,"score":numero_de_0_a_100,"issues":["problema concreto"]}.',
      'Aprovar somente com nota >= 78 e sem violação de posicionamento, texto indevido ou falsa marca.',
    ].join(' ')},
    {type:'image_url',image_url:{url:'data:image/jpeg;base64,'+preview.toString('base64')}},
  ]
  const ref=approvedCreativeReferences(references)[0]
  if(ref)parts.push({type:'image_url',image_url:{url:ref.url}})
  const res=await fetch(GATEWAY+'/chat/completions',{
    method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
    body:JSON.stringify({model:VISUAL_REVIEW_MODEL,messages:[{role:'user',content:parts}],
      response_format:{type:'json_object'},max_completion_tokens:330}),
    cache:'no-store',signal:AbortSignal.timeout(40000),
  })
  if(!res.ok)throw Error('Revisao visual indisponivel HTTP '+res.status)
  const data=await res.json()
  let parsed
  try{parsed=JSON.parse(String(data?.choices?.[0]?.message?.content||''))}catch{throw Error('Avaliacao visual sem JSON')}
  const score=Number(parsed?.score)
  const issues=Array.isArray(parsed?.issues)?parsed.issues.map(x=>String(x).slice(0,100)).slice(0,4):[]
  if(!Number.isFinite(score)||score<0||score>100||typeof parsed?.approved!=='boolean')
    throw Error('Avaliacao visual invalida')
  return {approved:parsed.approved&&score>=78,score,issues}
}
async function technicalPhotoReview(buffer){
  if(!Buffer.isBuffer(buffer)||buffer.length<8000||buffer.length>12*1024*1024)
    throw Error('Fotografia fora do tamanho permitido')
  const meta=await sharp(buffer).metadata()
  if((meta.width||0)<700||(meta.height||0)<700)throw Error('Foto de baixa resolucao')
  const stats=await sharp(buffer).resize(128,128,{fit:'fill'}).stats()
  if(stats.channels.slice(0,3).every(x=>x.stdev<10))throw Error('Fotografia sem detalhes')
}
export async function generateEditorialPhoto({brandSlug,topic,concept='',date='',mode='social',references=[]}){
  if(process.env.SOCIAL_AGENT_IMAGES_ENABLED!=='true')throw Error('Geracao de imagens desabilitada')
  const apiKey=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN
  if(!apiKey)throw Error('Gateway de imagens sem autenticacao')
  const imageModel=process.env.SOCIAL_AGENT_IMAGE_TIER==='economy'
    ?ECONOMY_IMAGE_MODEL:PREMIUM_IMAGE_MODEL
  const catalog=await models()
  const entry=catalog.find(x=>x.id===imageModel)
  const unitPrice=verifiedUnitImagePrice(entry)
  if(unitPrice===null||unitPrice>MAX_UNIT_USD)
    throw Error('Tarifa de imagem acima do teto aprovado de US$ 0,055 por tentativa')
  const review=catalog.find(x=>x.id===VISUAL_REVIEW_MODEL)
  if(review?.type!=='language'||!review.modalities?.input?.includes('image'))
    throw Error('Modelo de revisao visual indisponivel')
  let feedback='',lastScore=0
  for(let attempt=1;attempt<=MAX_ATTEMPTS;attempt++){
    const prompt=creativeBrief({brandSlug,topic,concept,date,mode,references,attempt,feedback})
    const response=await fetch(GATEWAY+'/images/generations',{
      method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
      body:JSON.stringify({model:imageModel,prompt,n:1,size:'1024x1024',response_format:'b64_json'}),
      cache:'no-store',signal:AbortSignal.timeout(110000),
    })
    if(!response.ok)throw Error('Geracao premium HTTP '+response.status)
    const data=await response.json()
    const base64=data?.data?.[0]?.b64_json
    if(typeof base64!=='string')throw Error('Imagem nao devolvida pelo modelo')
    const buffer=Buffer.from(base64,'base64')
    await technicalPhotoReview(buffer)
    const verdict=await visualReview(apiKey,buffer,topic,brandSlug,references)
    lastScore=verdict.score
    if(verdict.approved)return {buffer,model:imageModel,score:verdict.score,
      attempts:attempt,maximumEstimatedImageCostUsd:Number((unitPrice*attempt).toFixed(3))}
    feedback=verdict.issues.join('; ')||'insufficient photographic composition'
  }
  throw Error('Revisao visual reprovou as '+MAX_ATTEMPTS+' propostas; ultima nota '+lastScore)
}
