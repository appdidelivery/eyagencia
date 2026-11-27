import test from 'node:test'
import assert from 'node:assert/strict'
import {destinations,gbpPayload} from '../scripts/social-channel-routing.mjs'
const imageUrl='https://cdn.sanity.io/images/test/main/photo.png'
test('routes images and video to distinct supported or assisted destinations',()=>{
 assert.deepEqual(destinations('carousel'),['gbp','youtube-post-assisted','tiktok-assisted'])
 assert.deepEqual(destinations('reel'),['youtube-video','tiktok-assisted'])
 assert.deepEqual(destinations('video'),['youtube-video','tiktok-assisted'])
 assert.deepEqual(destinations('unknown'),[])
})
test('GBP adaptation keeps brand domain, photo and safe text',()=>{
 const p=gbpPayload({brand:'eyagencia',caption:'Aprenda a melhorar a gestão da loja. #SEO Link no perfil. https://example.org',imageUrl,sourceUrl:'https://www.eyagencia.com.br/blog/geo?x=1'})
 assert.equal(p.topicType,'STANDARD')
 assert.equal(p.callToAction.url,'https://www.eyagencia.com.br/blog/geo')
 assert.equal(p.summary,'Aprenda a melhorar a gestão da loja.')
 assert.equal(p.media[0].sourceUrl,imageUrl+'?fm=jpg&w=1080')
})
test('rejects third-party assets, invalid brand and telephone-like text',()=>{
 const base={brand:'velo-delivery',caption:'Conheça maneiras de fidelizar os clientes.',imageUrl}
 assert.throws(()=>gbpPayload({...base,imageUrl:'https://example.org/photo.png'}))
 assert.throws(()=>gbpPayload({...base,brand:'other'}))
 assert.throws(()=>gbpPayload({...base,caption:'Entre em contato: (48) 99999-9999'}))
 assert.equal(gbpPayload({...base,sourceUrl:'https://eyagencia.com.br'}).callToAction.url,'https://velodelivery.com.br')
})
