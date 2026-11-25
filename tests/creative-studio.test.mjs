import test from 'node:test'
import assert from 'node:assert/strict'
import {approvedCreativeReferences,creativeBrief,verifiedUnitImagePrice,imageRequestConfig,estimatedGptImageCost,gptImageRequest} from '../scripts/creative-studio.mjs'
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
