import test from 'node:test'
import assert from 'node:assert/strict'
import {approvedCreativeReferences,creativeBrief,verifiedUnitImagePrice,imageRequestConfig,estimatedGptImageCost,gptImageRequest,fullCarouselPhotosEnabled,fullCarouselBudget,generateCarouselPhotos} from '../scripts/creative-studio.mjs'
test('nao insere references nao aprovadas nem urls externas',()=>{
  assert.equal(approvedCreativeReferences([{approved:false,url:'https://cdn.sanity.io/images/x/y/a.png'},
    {approved:true,url:'https://evil.test/a.png'}]).length,0)
})
test('nota manual vira briefing, sem copiar imagens ou pedir textos na foto',()=>{
  const refs=[{approved:true,url:'https://cdn.sanity.io/images/example/main/photo.jpg',
    title:'Capa premium',visualNotes:'Foto real, luz lateral, terco direito'}]
  const prompt=creativeBrief({brandSlug:'velo-delivery',topic:'Gestao de delivery',
    concept:'Cozinha em movimento',references:refs,attempt:1})
  assert.match(prompt,/luz lateral/)
  assert.match(prompt,/RIGHT THIRD/)
  assert.match(prompt,/No words, letters/)
})
test('preco de 1024 validado a partir do catalogo',()=>{
  assert.equal(verifiedUnitImagePrice({type:'image',pricing:{image:'0.048',
    image_dimension_quality_pricing:[{size:'1024x1024',cost:'0.048'}]}}),0.048)
  assert.equal(verifiedUnitImagePrice({type:'image',pricing:{}}),null)
})

const gpt2={id:'openai/gpt-image-2',type:'image',pricing:{input:'0.000005',output:'0.00003'}}
test('GPT Image defaults and provider payload exclude legacy response_format',()=>{
  const config=imageRequestConfig({})
  assert.equal(config.model,'openai/gpt-image-2')
  assert.equal(config.quality,'medium')
  assert.equal(config.size,'1024x1536')
  assert.deepEqual(gptImageRequest(config,'Editorial photograph'),{
    model:config.model,prompt:'Editorial photograph',n:1,size:'1024x1536',
    quality:'medium',output_format:'png',
  })
  assert.equal(imageRequestConfig({SOCIAL_AGENT_IMAGE_TIER:'economy'}).quality,'low')
})
test('cost estimates include text and reject changed or unverified pricing',()=>{
  const config=imageRequestConfig({})
  const estimate=estimatedGptImageCost(gpt2,config,'Editorial photograph')
  assert.ok(estimate>0.041&&estimate<config.maxUsd)
  assert.ok(estimatedGptImageCost(gpt2,config,'a'.repeat(4000))>config.maxUsd)
  assert.equal(estimatedGptImageCost({...gpt2,pricing:{...gpt2.pricing,output:'0.00004'}},config,'test'),null)
  assert.throws(()=>imageRequestConfig({SOCIAL_AGENT_IMAGE_MAX_USD:'0.1'}))
  assert.throws(()=>imageRequestConfig({SOCIAL_AGENT_IMAGE_MODEL:'bfl/flux-3-image'}))
  assert.throws(()=>imageRequestConfig({SOCIAL_AGENT_IMAGE_QUALITY:'high'}))
  const flare=imageRequestConfig({SOCIAL_AGENT_IMAGE_MODEL:'openai/gpt-image-2.5-flare'})
  assert.equal(estimatedGptImageCost({...gpt2,id:flare.model},flare,'test'),null)
  assert.ok(estimatedGptImageCost({...gpt2,id:flare.model,pricing:{...gpt2.pricing,
    image_dimension_quality_pricing:[{size:flare.size,quality:flare.quality,cost:'0.025'}]}},flare,'test')<flare.maxUsd)
})

test('blog cover requires horizontal photographic composition',()=>{
 const prompt=creativeBrief({brandSlug:'eyagencia',topic:'Operação de e-commerce',mode:'blog-cover'})
 assert.match(prompt,/horizontal 3:2/)
 assert.match(prompt,/no illustration, vector or CGI/)
 assert.doesNotMatch(prompt,/LEFT 60%/)
})

const carouselEnv={SOCIAL_AGENT_FULL_CAROUSEL_ENABLED:'true',SOCIAL_AGENT_IMAGES_ENABLED:'true',SOCIAL_AGENT_CAROUSEL_MAX_USD:'0.44'}
const carouselFrames=Array.from({length:8},(_,i)=>({title:'Slide '+(i+1),text:'Detalhe '+(i+1)}))
test('carrossel completo exige ativacao e teto explicito sem elevar custo por imagem',()=>{
  assert.equal(fullCarouselPhotosEnabled({}),false)
  assert.throws(()=>fullCarouselBudget({}))
  assert.throws(()=>fullCarouselBudget({...carouselEnv,SOCIAL_AGENT_CAROUSEL_MAX_USD:'0.43'}))
  assert.throws(()=>fullCarouselBudget({...carouselEnv,SOCIAL_AGENT_CAROUSEL_MAX_USD:'0.45'}))
  assert.throws(()=>fullCarouselBudget({...carouselEnv,SOCIAL_AGENT_IMAGE_MAX_USD:'0.06'}))
  assert.ok(Math.abs(fullCarouselBudget(carouselEnv)-0.44)<1e-9)
})
test('cada slide tem briefing proprio e apenas uma tentativa, sem chamada real',async()=>{
  const requests=[]
  const photos=await generateCarouselPhotos({brandSlug:'eyagencia',topic:'GEO 2027',frames:carouselFrames,date:'2026-11-27',env:carouselEnv,generate:async args=>{
    requests.push(args)
    return {buffer:Buffer.from(args.date)}
  }})
  assert.equal(photos.length,8)
  assert.equal(new Set(photos.map(b=>b.toString())).size,8)
  assert.equal(new Set(requests.map(x=>x.concept)).size,8)
  assert.ok(requests.every(x=>x.attemptLimit===1&&x.brandSlug==='eyagencia'))
})
test('reprova pacote incompleto ou repetido, sem iniciar chamadas quando o teto falha',async()=>{
  let calls=0
  const base={brandSlug:'velo-delivery',topic:'Fidelizacao',frames:carouselFrames,env:carouselEnv}
  await assert.rejects(generateCarouselPhotos({...base,env:{},generate:async()=>{calls++;return {buffer:Buffer.from('x')}}}))
  assert.equal(calls,0)
  await assert.rejects(generateCarouselPhotos({...base,generate:async()=>({buffer:Buffer.from('same')})}),/repetida/)
  await assert.rejects(generateCarouselPhotos({...base,generate:async args=>{
    if(args.date.endsWith('-4'))throw Error('QA')
    return {buffer:Buffer.from(args.date)}
  }}),/incompleto/)
})
