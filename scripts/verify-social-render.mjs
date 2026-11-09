import {makeSocialSvg} from './social-media-render.mjs'
import sharp from 'sharp'

const pkg={title:'IA no e-commerce: métricas e testes de conversão',sourceSlug:'ia-metricas'}
const checks=[
  {name:'carousel',frame:{kind:'insight',title:'Como medir resultados de uma operação?',text:'Defina critérios, indicadores, responsáveis e acompanhe cada etapa com consistência.'},size:[1080,1350]},
  {name:'story',frame:{kind:'hook',title:'O que você precisa medir na sua operação?',text:'Confira os insights do artigo completo.'},size:[1080,1920]}
]
for(const test of checks){
  const xml=makeSocialSvg(pkg,test.frame,test.name,0,4)
  const png=await sharp(Buffer.from(xml)).png().toBuffer()
  const metadata=await sharp(png).metadata()
  if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||
     metadata.width!==test.size[0]||metadata.height!==test.size[1])throw new Error('Invalid '+test.name+' output')
  console.info('[social-media-selftest]',test.name,metadata.width+'x'+metadata.height,png.length+' bytes')
}

const covers=Array.from({length:4},(_,i)=>
 makeSocialSvg(pkg,{kind:'insight',title:'Reveja a experiência de compra',
 text:'Explique a oferta, simplifique escolhas e cuide do atendimento.'},'carousel',i,8))
if(new Set(covers).size!==4)throw Error('Repeated carousel composition')
const photoLayer=makeSocialSvg(pkg,{kind:'cover',title:'Marketing com foco no cliente'},
 'carousel',0,8,true)
const layerPng=await sharp(Buffer.from(photoLayer)).png().toBuffer()
const samplePhoto=await sharp({create:{width:1080,height:1350,channels:3,
 background:{r:39,g:60,b:65}}}).png().toBuffer()
const composed=await sharp(samplePhoto).composite([{input:layerPng}]).png().toBuffer()
if((await sharp(composed).metadata()).height!==1350)throw Error('Photo overlay failed')
console.info('[social-art-v2] four variants and photo/text separation passed without network or Meta')
