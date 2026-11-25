// Disposable QA branch: never merge this live, billable smoke test into main.
import {mkdir,writeFile} from 'node:fs/promises'
import {generateEditorialPhoto} from './creative-studio.mjs'
import {makeBrandSocialSvg} from './brand-social-visual.mjs'
import {renderBrandArt} from './render-brand-art.mjs'
import sharp from 'sharp'
if(process.env.VERCEL_ENV!=='preview'||process.env.VERCEL_GIT_COMMIT_REF!=='qa/gpt-image-live-20261125')
  throw Error('Live smoke test is restricted to its dedicated preview branch')
process.env.SOCIAL_AGENT_IMAGES_ENABLED='true'
process.env.SOCIAL_AGENT_IMAGE_MODEL='openai/gpt-image-2'
process.env.SOCIAL_AGENT_IMAGE_QUALITY='medium'
process.env.SOCIAL_AGENT_IMAGE_SIZE='1024x1536'
process.env.SOCIAL_AGENT_IMAGE_MAX_USD='0.055'
const cases=[
  {slug:'eyagencia',topic:'SEO e busca inteligente para e-commerce',concept:'Gestor revisando uma operacao de comercio digital em estudio editorial, sem interfaces falsas'},
  {slug:'velo-delivery',topic:'Organize os pedidos e melhore o atendimento',concept:'Cozinha de restaurante real, equipe preparando embalagens de delivery sem marcas'},
]
await mkdir('public/qa-gpt-image',{recursive:true})
for(const {slug,topic,concept} of cases){
  const result=await generateEditorialPhoto({brandSlug:slug,topic,concept,date:'2026-11-25',mode:'blog'})
  const svg=makeBrandSocialSvg({slug,topic,date:'2026-11-25',cover:true,photographic:true})
  const image=await renderBrandArt(svg,{backgroundBuffer:result.buffer})
  const metadata=await sharp(image).metadata()
  if(metadata.width!==1080||metadata.height!==1080)throw Error('Unexpected composed art dimensions')
  await writeFile('public/qa-gpt-image/'+slug+'.png',image)
  console.info('[gpt-image-live-qa]',JSON.stringify({brand:slug,model:result.model,score:result.score,attempts:result.attempts,estimatedImageUsd:result.maximumEstimatedImageCostUsd,width:metadata.width,height:metadata.height}))
}
// No CMS writes, no publication calls, no new keys. Artifacts are preview-only.
