import {makeBrandSocialSvg,makeBrandMotivationSvg,supportedBrandSlug} from './brand-social-visual.mjs'
import sharp from 'sharp'
import {renderBrandArt} from './render-brand-art.mjs'
const subjects=[
 {slug:'velo-delivery',topic:'Como organizar o cardápio digital para delivery',motif:'CARDÁPIO DIGITAL'},
 {slug:'velo-delivery',topic:'Como acompanhar o estoque do restaurante',motif:'ESTOQUE &amp; OPERAÇÃO'},
 {slug:'eyagencia',topic:'SEO e busca inteligente para e-commerce',motif:'BUSCA &amp; SEO'},
 {slug:'eyagencia',topic:'LGPD e privacidade de dados no atendimento',motif:'DADOS &amp; PRIVACIDADE'},
]
const previews=[]
for(const {slug,topic,motif} of subjects){
 if(!supportedBrandSlug(slug))throw Error('Missing brand: '+slug)
 const svg=makeBrandSocialSvg({slug,topic,date:'2026-10-27',cover:true})
 if(!svg.includes(motif))throw Error('Wrong subject treatment: '+topic)
 if(slug==='velo-delivery'&&!svg.includes('data-official-velo-logo'))
   throw Error('Official Velo logo missing from cover')
 const buffer=await renderBrandArt(svg)
 const meta=await sharp(buffer).metadata()
 if(meta.width!==1080||meta.height!==1080||buffer.length<5000)throw Error('Bad output: '+topic)
 previews.push({slug,topic,kb:Math.round(buffer.length/1024)})
}
if(makeBrandSocialSvg({slug:'velo-delivery',topic:subjects[0].topic})===makeBrandSocialSvg({slug:'velo-delivery',topic:subjects[1].topic}))throw Error('Reused cover')
console.log('[brand-social-visual] glyph and layout gate passed',JSON.stringify(previews))

const noLogoOnInside=makeBrandSocialSvg({
 slug:'velo-delivery',topic:'Dica prática: organize os pedidos',date:'2026-11-09-slide-2',cover:false,
})
if(noLogoOnInside.includes('data-official-velo-logo'))throw Error('Velo logo repeated on inner slides')
const coverMotivation=makeBrandMotivationSvg({
 slug:'velo-delivery',topic:'Bom dia. Gestão e boas entregas.',date:'2026-11-09',cover:true,
})
const innerMotivation=makeBrandMotivationSvg({
 slug:'velo-delivery',topic:'Organize sua equipe com cuidado.',date:'2026-11-09-2',cover:false,
})
if(!coverMotivation.includes('data-official-velo-logo')||
    innerMotivation.includes('data-official-velo-logo'))
  throw Error('Motivational logo placement incorrect')
await renderBrandArt(coverMotivation)
await renderBrandArt(innerMotivation)
const photography=await sharp({create:{width:1200,height:1200,channels:3,
 background:{r:18,g:43,b:72}}}).png().toBuffer()
const photoCover=await renderBrandArt(makeBrandSocialSvg({
 slug:'velo-delivery',topic:'Produção organizada e pedidos no horário',
 date:'2026-11-09',cover:true,photographic:true,
}),{backgroundBuffer:photography})
if((await sharp(photoCover).metadata()).width!==1080)throw Error('Photographic composition invalid')
console.log('[brand-social-art-v2] cover-only official logo, photography composite and glyph QA passed')
