import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {makeBrandMotivationSvg} from './brand-social-visual.mjs'

const cron=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8')).crons
const schedule=Object.fromEntries(cron.map(item=>[item.path,item.schedule]))
assert.equal(schedule['/api/cron/social-agent'],'0 13,21 * * 1,5')
assert.equal(schedule['/api/cron/native-reposts'],'20 14 * * 3,6')
assert.equal(schedule['/api/cron/content-agent'],'30 12,22 * * 0,2')
for(const old of ['/api/cron/social-assets','/api/cron/eyagencia-carousel','/api/cron/eyagencia-crosspost','/api/cron/social-news']){
  assert.equal(schedule[old],undefined,'Legacy autopublisher should not have a scheduled cron')
}
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
}
console.info('[weekly-social-selftest] 2 feed slots, 2 native repost slots, 2 blogs, brand sunrise art passed')
