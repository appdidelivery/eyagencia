// Disposable QA branch: single low-cost request to identify the Gateway rejection.
if(process.env.VERCEL_ENV!=='preview'||process.env.VERCEL_GIT_COMMIT_REF!=='qa/gpt-image-live-20261125')
  throw Error('Diagnostic restricted to its dedicated preview branch')
const key=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN
if(!key)throw Error('No Gateway credential configured')
const res=await fetch('https://ai-gateway.vercel.sh/v1/images/generations',{
  method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
  body:JSON.stringify({model:'openai/gpt-image-2',prompt:'Editorial photograph of a red apple on a wooden table, no text',n:1,size:'1024x1024',quality:'low',output_format:'png'}),
  signal:AbortSignal.timeout(110000),cache:'no-store'
})
if(!res.ok){
  let body={}
  try{body=await res.json()}catch{}
  const e=body?.error||{}
  const msg=[e.message,e.type,e.code,e.param?.error].filter(x=>typeof x==='string').join(' ')
  const indicators={
    freeTier:/free.?(credits?|tier)|restrictedmodels|restricted access/i.test(msg),
    cardVerification:/customer_verification_required|valid (credit card|payment method)|card on file/i.test(msg),
    creditPurchase:/purchase.*credits|paid credits|top.up/i.test(msg),
    organizationVerification:/organi[sz]ation.*verif/i.test(msg),
    policy:/allowlist|routing rule|denied by rule/i.test(msg),
    budget:/budget|insufficient (credits|funds|balance)/i.test(msg)
  }
  const code=typeof e.type==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(e.type)?e.type:'unavailable'
  const errorCode=typeof e.code==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(e.code)?e.code:'unavailable'
  console.error('[gateway-diagnostic]',JSON.stringify({http:res.status,type:code,code:errorCode,indicators}))
  throw Error('Gateway diagnostic rejected; see classified response above')
}
const data=await res.json()
console.info('[gateway-diagnostic]',JSON.stringify({http:res.status,imageReturned:Boolean(data?.data?.[0]?.b64_json),inputTokens:data?.usage?.input_tokens??null,outputTokens:data?.usage?.output_tokens??null}))
if(!data?.data?.[0]?.b64_json)throw Error('No image in successful response')
// No CMS writes, publication, or credential changes.
