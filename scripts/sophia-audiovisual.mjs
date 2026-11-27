// Sophia: pure planning helpers, no paid requests and no publication.
export const OMNI_MODEL = 'gemini-omni-1.2-flash';
export const MAX_MONTHLY_CENTS = 4000;
// Google published output token rates, verified 2026-11-27.
// These are estimates, not a billing guarantee.
const TOKENS_PER_SECOND = Object.freeze({'360p':1931,'720p':5792,'1080p':8688,'4k':17376});
const integer = (value, min, max, name) => {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw Error(name);
  return value;
};
export function estimateOmni({seconds, resolution='720p', fxBrlPerUsd, reservePercent=30, inputReserveUsd=0.25}) {
  integer(seconds,3,60,'duracao invalida');
  if (!Object.hasOwn(TOKENS_PER_SECOND,resolution)) throw Error('resolucao invalida');
  if (!Number.isFinite(fxBrlPerUsd) || fxBrlPerUsd<=0 || fxBrlPerUsd>100) throw Error('cambio obrigatorio');
  integer(reservePercent,30,100,'reserva invalida');
  if (!Number.isFinite(inputReserveUsd) || inputReserveUsd<0.25) throw Error('reserva de entrada invalida');
  const outputUsd=seconds*TOKENS_PER_SECOND[resolution]*12/1e6;
  const estimatedCents=Math.ceil((outputUsd+inputReserveUsd)*fxBrlPerUsd*(1+reservePercent/100)*100);
  return {model:OMNI_MODEL,outputUsd,estimatedCents,resolution,seconds};
}
export function budgetDecision({estimatedCents, reservedCents, monthlyLimitCents, eligibleCreditCents, approved=false, generationEnabled=false}) {
  integer(estimatedCents,1,Number.MAX_SAFE_INTEGER,'estimativa invalida');
  integer(reservedCents,0,Number.MAX_SAFE_INTEGER,'saldo reservado invalido');
  integer(monthlyLimitCents,1,MAX_MONTHLY_CENTS,'limite invalido');
  integer(eligibleCreditCents,0,Number.MAX_SAFE_INTEGER,'credito invalido');
  const remainingCents=Math.max(0,Math.min(monthlyLimitCents,eligibleCreditCents)-reservedCents);
  const reasons=[];
  if (generationEnabled!==true) reasons.push('generation-disabled');
  if (approved!==true) reasons.push('approval-required');
  if (estimatedCents>remainingCents) reasons.push('budget-exceeded');
  // A positive result is an estimate only. Never authorizes a provider call.
  return {withinEstimate:reasons.length===0,remainingCents,reasons,liveGenerationAllowed:false};
}
export function flowPlan({client, objective, facts=[], ctaUrl, scenes=4, secondsPerScene=8}) {
  if(typeof client!=='string'||!client.trim()||client.length>100)throw Error('cliente invalido');
  if(typeof objective!=='string'||!objective.trim()||objective.length>500)throw Error('objetivo invalido');
  if(!Array.isArray(facts)||facts.length>20||facts.some(x=>typeof x!=='string'||!x.trim()||x.length>400))throw Error('fatos invalidos');
  const url=new URL(ctaUrl);
  if(url.protocol!=='https:'||url.username||url.password)throw Error('CTA invalido');
  integer(scenes,1,4,'cenas invalidas');integer(secondsPerScene,3,15,'duracao invalida');
  const arc=['Gancho e boas-vindas','Produto ou demonstracao real','Beneficios comprovados','Convite para agir'];
  return {brand:'velo-delivery',client:client.trim(),objective:objective.trim(),ctaUrl:url.href,verifiedFacts:[...facts],source:'flow',estimatedApiCents:0,aspectRatio:'9:16',durationSeconds:scenes*secondsPerScene,scenes:Array.from({length:scenes},(_,i)=>({index:i+1,seconds:secondsPerScene,goal:i===scenes-1?'Convite para agir':arc[i],prompt:['Video vertical 9:16, PT-BR, '+secondsPerScene+' segundos.', 'Cliente: '+client.trim(), 'Objetivo: '+objective.trim(), 'Cena: '+(i===scenes-1?'Convite para agir':arc[i]), 'Use apenas fatos confirmados: '+(facts.join(' | ')||'nenhuma oferta especifica confirmada'), 'Preserve referencias autorizadas; nao invente produtos, precos ou beneficios. Use a Sophia cadastrada no Flow quando aplicavel. Aprovacao humana antes de gerar.'].join('\n')}))};
}
export function manualVideoReview({assetUrl, projectId, dataset, width,height,durationSeconds,hasAudio,approved,commercialFactsVerified,rightsVerified,aiDisclosureReviewed,caption,scheduledDay,collaborator}) {
  const issues=[];
  try {
    const url=new URL(assetUrl);
    if(!/^[a-z0-9-]+$/i.test(projectId||'')||!/^[a-z0-9_-]+$/i.test(dataset||'')||url.origin!=='https://cdn.sanity.io'||url.username||url.password||url.search||url.hash||!url.pathname.startsWith('/files/'+projectId+'/'+dataset+'/')||!/^\w[\w-]*\.mp4$/i.test(url.pathname.split('/').at(-1)))issues.push('invalid-asset');
  }catch{issues.push('invalid-asset')}
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<540||height<960||Math.abs(width/height-9/16)>0.015)issues.push('invalid-aspect-ratio');
  if(!Number.isFinite(durationSeconds)||durationSeconds<3||durationSeconds>90)issues.push('invalid-duration');
  if(hasAudio!==true)issues.push('audio-review-required');
  if(approved!==true||commercialFactsVerified!==true||rightsVerified!==true||aiDisclosureReviewed!==true)issues.push('approval-required');
  if(typeof caption!=='string'||!caption.trim()||caption.length>2200)issues.push('invalid-caption');
  if(typeof scheduledDay!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDay)||!Number.isFinite(Date.parse(scheduledDay+'T12:00:00Z'))||new Date(scheduledDay+'T12:00:00Z').toISOString().slice(0,10)!==scheduledDay||![0,2].includes(new Date(scheduledDay+'T12:00:00Z').getUTCDay()))issues.push('outside-regular-schedule');
  if(collaborator!=null&&collaborator!==''&&(typeof collaborator!=='string'||!/^@?[a-z0-9._]{1,30}$/i.test(collaborator)))issues.push('invalid-collaborator');
  return {readyForManualReview:issues.length===0,issues,autoPublishAllowed:false};
}
// Only GET metadata; never sends prompts, assets, or generation requests.
export async function discoverOmni({apiKey,fetcher=fetch}) {
  if(typeof apiKey!=='string'||!apiKey.trim())return {configured:false,available:false};
  const endpoint='https://generativelanguage.googleapis.com/v1beta/models/'+OMNI_MODEL;
  try{
    const response=await fetcher(endpoint,{method:'GET',headers:{'x-goog-api-key':apiKey},redirect:'error',signal:AbortSignal.timeout(10000),cache:'no-store'});
    return {configured:true,available:response.ok,httpStatus:response.status,model:OMNI_MODEL};
  }catch{return {configured:true,available:false,model:OMNI_MODEL,error:'metadata-unavailable'}}
}
