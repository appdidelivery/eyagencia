import {makeBrandSocialSvg,supportedBrandSlug} from './brand-social-visual.mjs'
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
 const svg=makeBrandSocialSvg({slug,topic,date:'2026-10-27'})
 if(!svg.includes(motif))throw Error('Wrong subject treatment: '+topic)
 const buffer=await renderBrandArt(svg)
 const meta=await sharp(buffer).metadata()
 if(meta.width!==1080||meta.height!==1080||buffer.length<5000)throw Error('Bad output: '+topic)
 previews.push({slug,topic,kb:Math.round(buffer.length/1024)})
}
if(makeBrandSocialSvg({slug:'velo-delivery',topic:subjects[0].topic})===makeBrandSocialSvg({slug:'velo-delivery',topic:subjects[1].topic}))throw Error('Reused cover')
console.log('[brand-social-visual] glyph and layout gate passed',JSON.stringify(previews))
