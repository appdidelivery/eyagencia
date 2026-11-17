import test from 'node:test'
import assert from 'node:assert/strict'
import {approvedCreativeReferences,creativeBrief,verifiedUnitImagePrice} from '../scripts/creative-studio.mjs'
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
