import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {makeBrandMotivationSvg,makeBrandMotivationStorySvg} from './brand-social-visual.mjs'

const cron=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8')).crons
const schedule=Object.fromEntries(cron.map(item=>[item.path,item.schedule]))
assert.equal(schedule['/api/cron/content-agent'],'30 12,22 * * *')
assert.equal(schedule['/api/cron/social-agent'],'0 13,21 * * 1,4,5')
assert.equal(schedule['/api/cron/velo-blog-social'],'0 16,23 * * 0,2')
assert.equal(schedule['/api/cron/native-reposts'],'20 14 * * 3,6')
assert.equal(schedule['/api/cron/social-assets'],'15 14,23 * * 0,2')
assert.equal(schedule['/api/cron/eyagencia-carousel'],'45 14,23 * * 0,2')
assert.equal(schedule['/api/cron/eyagencia-crosspost'],'15 0,16 * * *')
assert.equal(schedule['/api/cron/social-news'],'20 21 * * 6')
assert.equal(schedule['/api/cron/weekly-stories'],'0 16,23 * * 1,5')
assert.equal(cron.length,Object.keys(schedule).length,'All scheduled paths must be unique')
for(const slug of ['eyagencia','velo-delivery']){
  const monday=makeBrandMotivationSvg({
    slug,topic:'Bom dia. Uma nova semana começa com escolhas conscientes.',date:'2026-11-09',
  })
  const friday=makeBrandMotivationSvg({
    slug,topic:'Que o fim de semana traga descanso e boas lembranças.',date:'2026-11-13',closing:true,
  })
  for(const art of [monday,friday]){
    assert.ok(art.includes('width="1080"'))
    assert.ok(art.includes('height="1080"'))
    assert.ok(art.includes('xmlns="http://www.w3.org/2000/svg"'))
    assert.ok(art.includes('font-family="Noto Sans"'))
  }
  for(const art of [
    makeBrandMotivationStorySvg({slug,topic:'Bom dia. Fé e disciplina para começar.',date:'2026-11-09'}),
    makeBrandMotivationStorySvg({slug,topic:'Que venha um descanso merecido.',date:'2026-11-13',closing:true}),
  ]){
    assert.ok(art.includes('width="1080" height="1920"'))
    assert.ok(art.includes('Veja o post completo no perfil.'))
  }
}
console.info('[weekly-social-selftest] daily blogs unchanged; Mon/Thu/Fri authorial, Tue/Sun blog carousels, Wed/Sat source-attributed original editorial posts passed')
