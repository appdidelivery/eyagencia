import test from 'node:test'
import assert from 'node:assert/strict'
import { editorialQaApproved, preferEditorialCandidate, repairSeoMetadata } from '../app/api/content-agent/editorialQaPolicy.ts'
const approved={passed:true,score:92,publicationRisk:'low',issues:[]}
test('strict gate: no missing inventory, risk, findings or subthreshold score',()=>{
 assert.equal(editorialQaApproved(approved),true)
 assert.equal(editorialQaApproved({...approved,score:85}),true)
 assert.equal(editorialQaApproved({...approved,score:88}),true)
 for(const qa of [{...approved,score:84},{...approved,publicationRisk:'medium'},{...approved,issues:['Pendência']},{...approved,issues:undefined},{...approved,score:NaN},{...approved,score:101},{...approved,passed:false}])assert.equal(editorialQaApproved(qa),false)
})
test('metadata only reuses an existing complete sentence',()=>{
 const excerpt='Avalie aplicações de inteligência artificial no comércio eletrônico com critérios de qualidade, experimentos controlados e supervisão humana.'
 const a={title:'Inteligência artificial no comércio eletrônico',seoTitle:'IA',seoDescription:'Curta',excerpt,sections:[{heading:'Teste'}]}
 const result=repairSeoMetadata(a)
 assert.equal(result.seoDescription,excerpt)
 assert.equal(result.seoTitle,a.title)
 assert.equal(result.sections,a.sections)
 assert.equal(repairSeoMetadata({...a,excerpt:'Curto'}).seoDescription,'Curta')
})

test('optional style polish does not block an otherwise approved article',()=>{
 assert.equal(editorialQaApproved({...approved,score:85,issues:[{severity:'low',dimension:'style',blocking:false,detail:'Preferir frase mais curta'}]}),true)
 assert.equal(editorialQaApproved({...approved,issues:[{severity:'low',dimension:'seo',blocking:false}]}),false)
 assert.equal(editorialQaApproved({...approved,issues:[{severity:'high',dimension:'style',blocking:false}]}),false)
 assert.equal(editorialQaApproved({...approved,passed:false,issues:[{severity:'low',dimension:'style',blocking:false}]}),false)
})

test('keeps the better draft without weakening publication gates',()=>{
 const rejected78={...approved,passed:false,score:78,publicationRisk:'medium',issues:[{severity:'high',dimension:'facts'}]}
 const near88={...approved,score:88,issues:[{severity:'low',dimension:'seo',blocking:true}]}
 assert.equal(preferEditorialCandidate(rejected78,['SEO'],near88,['SEO']),true)
 assert.equal(preferEditorialCandidate(near88,['SEO'],rejected78,['SEO']),false)
 assert.equal(editorialQaApproved(near88),false)
 assert.equal(preferEditorialCandidate(near88,['SEO'],approved,[]),true)
 assert.equal(preferEditorialCandidate(approved,[],{...approved,score:99},['Factual error']),false)
 assert.equal(preferEditorialCandidate(approved,[],{...approved,score:99,publicationRisk:'high'},[]),false)
 assert.equal(preferEditorialCandidate(approved,[],approved,[]),false)
})
test('deterministic issues and unknown QA inventory cannot be overridden by a score',()=>{
 const previous={...approved,score:85}
 assert.equal(preferEditorialCandidate(previous,[],{...approved,score:100,issues:undefined},[]),false)
 assert.equal(preferEditorialCandidate(previous,[],{...approved,score:100},['Duplicate slug']),false)
})

import { recoveryGuides } from '../app/api/content-agent/recoveryGuides.ts'
import { checkArticleQuality } from '../app/api/content-agent/quality.ts'
test('recovery bank has distinct relevant drafts and passes structural checks',()=>{
 const sources=[{title:'Fonte 1',url:'https://example.org/1'},{title:'Fonte 2',url:'https://example.org/2'}]
 const topics=['IA no e-commerce: experimentos de jornada de compra','IA no e-commerce: avaliação de respostas automatizadas','IA no e-commerce: padronização do catálogo']
 const drafts=topics.map(topic=>recoveryGuides(topic,sources)[0])
 assert.equal(new Set(drafts.map(d=>d.slug)).size,3)
 for (const draft of drafts) {
  assert.deepEqual(checkArticleQuality(draft,[]),[],draft.slug)
  assert.deepEqual(draft.sources,sources)
 }
 assert.equal(recoveryGuides('tema não coberto',sources).length,0)
 assert.equal(recoveryGuides(topics[0],sources)[0].slug,drafts[0].slug)
})
