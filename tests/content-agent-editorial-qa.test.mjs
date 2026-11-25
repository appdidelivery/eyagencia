import test from 'node:test'
import assert from 'node:assert/strict'
import { editorialQaApproved, repairSeoMetadata } from '../app/api/content-agent/editorialQaPolicy.ts'
const approved={passed:true,score:92,publicationRisk:'low',issues:[]}
test('strict gate: no missing inventory, risk, findings or subthreshold score',()=>{
 assert.equal(editorialQaApproved(approved),true)
 for(const qa of [{...approved,score:88},{...approved,publicationRisk:'medium'},{...approved,issues:['Pendência']},{...approved,issues:undefined},{...approved,score:NaN},{...approved,score:101},{...approved,passed:false}])assert.equal(editorialQaApproved(qa),false)
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
