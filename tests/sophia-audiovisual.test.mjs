import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateOmni,budgetDecision,flowPlan,manualVideoReview,discoverOmni,OMNI_MODEL,prepareOmniRequest,prepareInstagramReel} from '../scripts/sophia-audiovisual.mjs';
test('Omni estimate includes reserve and rejects invalid inputs',()=>{
 const result=estimateOmni({seconds:32,fxBrlPerUsd:6.1});
 assert.equal(result.model,OMNI_MODEL);assert.equal(result.estimatedCents,1962);
 assert.throws(()=>estimateOmni({seconds:32,fxBrlPerUsd:0}));
 assert.throws(()=>estimateOmni({seconds:32,fxBrlPerUsd:6.1,resolution:'invalid'}));
});
test('budget fails closed, even positive estimate cannot authorize a live call',()=>{
 const base={estimatedCents:1000,reservedCents:500,monthlyLimitCents:4000,eligibleCreditCents:3000};
 assert.equal(budgetDecision(base).withinEstimate,false);
 assert.equal(budgetDecision({...base,approved:true,generationEnabled:true}).liveGenerationAllowed,false);
 assert.ok(budgetDecision({...base,estimatedCents:2501,approved:true,generationEnabled:true}).reasons.includes('budget-exceeded'));
 assert.throws(()=>budgetDecision({...base,monthlyLimitCents:4001}));
});
test('Flow plan has no API charge and uses verified facts only',()=>{
 const result=flowPlan({client:'Love Picados',objective:'Boas-vindas',ctaUrl:'https://lovepicados.velodelivery.com.br/',facts:[]});
 assert.equal(result.durationSeconds,32);assert.equal(result.estimatedApiCents,0);assert.equal(result.scenes.length,4);
 assert.match(result.scenes[2].prompt,/nenhuma oferta especifica confirmada/);
 assert.throws(()=>flowPlan({client:'X',objective:'Y',ctaUrl:'http://example.com'}));
});
test('manual review blocks missing QA, wrong CDN, wrong day',()=>{
 const input={assetUrl:'https://cdn.sanity.io/files/abc123/production/abc123.mp4',projectId:'abc123',dataset:'production',width:1080,height:1920,durationSeconds:32,hasAudio:true,approved:true,commercialFactsVerified:true,rightsVerified:true,aiDisclosureReviewed:true,caption:'Conheca a Love Picados',scheduledDay:'2026-11-29',collaborator:'@lovepicados'};
 assert.equal(manualVideoReview(input).readyForManualReview,true);
 assert.equal(manualVideoReview(input).autoPublishAllowed,false);
 assert.ok(manualVideoReview({...input,approved:false}).issues.includes('approval-required'));
 assert.ok(manualVideoReview({...input,assetUrl:'https://example.com/a.mp4'}).issues.includes('invalid-asset'));
 assert.ok(manualVideoReview({...input,scheduledDay:'2026-11-27'}).issues.includes('outside-regular-schedule'));
 assert.ok(manualVideoReview({...input,scheduledDay:'2026-02-30'}).issues.includes('outside-regular-schedule'));
});
test('metadata GET never leaks key in URL or error and never generates',async()=>{
 const result=await discoverOmni({apiKey:'fake-secret',fetcher:async(url,options)=>{
  assert.ok(!url.includes('fake-secret'));assert.equal(options.method,'GET');assert.equal(options.headers['x-goog-api-key'],'fake-secret');
  assert.equal(options.redirect,'error');return {ok:true,status:200};
 }});
 assert.equal(result.available,true);assert.ok(!JSON.stringify(result).includes('fake-secret'));
 assert.equal((await discoverOmni({apiKey:'',fetcher:()=>{throw Error('must not call')}})).configured,false);
 assert.equal((await discoverOmni({apiKey:'secret',fetcher:async()=>{throw Error('secret')}})).error,'metadata-unavailable');
});

test('Omni payload is vertical and never executes',()=>{
 const p=prepareOmniRequest({prompt:'Cena de produto',seconds:8});
 assert.equal(p.body.response_format.duration,'8s');assert.equal(p.body.response_format.aspect_ratio,'9:16');
 assert.equal(p.body.response_format.delivery,'uri');assert.equal(p.execute,false);
 assert.throws(()=>prepareOmniRequest({prompt:'X',seconds:16}));
});
test('Instagram contract refuses missing review and never publishes',()=>{
 const p=prepareInstagramReel({instagramId:'12345',reviewInput:{}});
 assert.equal(p.execute,false);assert.ok(p.issues.includes('approval-required'));assert.equal(p.container,undefined);
});
