import test from "node:test";
import assert from "node:assert/strict";
import {blank,finance,scoped,canGenerate,dueItems,validDate,csvCell} from "../app/lib/crm-model.ts";
const r=(kind,id,props={})=>({...blank(kind),id,...props});
const client=r("client","c",{company:"EYAGENCIA",status:"ativo"});
test("competência e caixa independentes; histórico sem data não entra no mês",()=>{
 const rows=[client,r("monthly","m",{clientId:"c",period:"2026-11",amountCents:100000}),r("monthly","old",{clientId:"c",period:"2026-10",amountCents:200000}),r("monthly","legacy",{clientId:"c",amountCents:999999}),r("payment","p",{clientId:"c",period:"2026-11",status:"recebido",paidDate:"2026-12-02",amountCents:40000,referenceId:"m"}),r("expense","e",{company:"EYAGENCIA",period:"2026-11",status:"paga",paidDate:"2026-11-12",amountCents:25000}),r("payment","open",{clientId:"c",period:"2026-11",status:"pendente",amountCents:60000,referenceId:"m"})];
 const n=finance(rows,"2026-11");assert.equal(n.planned,100000);assert.equal(n.cashIn,0);assert.equal(n.cashOut,25000);assert.equal(n.net,-25000);assert.equal(n.outstanding,60000);assert.equal(n.review.length,1);assert.equal(finance(rows,"2026-12").cashIn,40000);
});
test("recebimento avulso e empresa herdada; legado separado",()=>{
 const rows=[client,r("payment","a",{clientId:"c",period:"2026-11",status:"pendente",amountCents:1234}),r("payment","b",{company:"VELO",clientId:"c",period:"2026-11",status:"recebido",paidDate:"2026-11-20",amountCents:100}),r("expense","unknown",{period:"2026-11",amountCents:500})];assert.equal(finance(scoped(rows,"EYAGENCIA"),"2026-11").outstanding,1234);assert.equal(finance(scoped(rows,"VELO"),"2026-11").cashIn,100);assert.equal(scoped(rows,"").length,1)
});
test("receita recorrente apenas assinada e vigente",()=>{
 const c=r("contract","ct",{status:"assinado",recurring:true,startDate:"2026-10-01",endDate:"2026-12-01",amountCents:50000});assert.equal(finance([c],"2026-11").mrr,50000);assert.equal(finance([c],"2027-01").mrr,0);assert.equal(finance([{...c,status:"a conferir"}],"2026-11").mrr,0)
});
test("recorrência única, vigência e cancelamento",()=>{
 const c=r("contract","ct",{status:"assinado",recurring:true,startDate:"2026-10-01"});assert.equal(canGenerate([c],c,"2026-11"),true);assert.equal(canGenerate([c,r("monthly","m",{referenceId:"ct",period:"2026-11"})],c,"2026-11"),false);
 const e=r("expense","e",{recurring:true,period:"2026-10"});assert.equal(canGenerate([e],e,"2026-11"),true);assert.equal(canGenerate([{...e,status:"cancelada"},r("expense","n",{referenceId:"e",recurring:true,period:"2026-11"})],r("expense","n",{referenceId:"e",recurring:true,period:"2026-11"}),"2026-12"),false);
});
test("prazos reais e segurança CSV",()=>{
 assert.equal(validDate("2026-02-30"),false);assert.equal(validDate("2024-02-29"),true);assert.equal(dueItems([r("task","t",{date:"2026-11-25"}),r("task","x",{date:"2026-11-23",status:"concluída"})],"2026-11-26").length,1);assert.equal(csvCell("=SUM(A1)"),"\"'=SUM(A1)\"")
});

import { readSnapshot, strongVersion, writeSnapshot } from "../app/lib/crm-blob.ts";
const blobConfig={token:"test-token",storeId:"teststore"};
const meta=etag=>new Response(JSON.stringify({etag}),{status:200});
const body=(rows,etag)=>new Response(JSON.stringify(rows),{status:200,headers:{etag}});
function mockBlob(sequence){
 const calls=[];
 return {calls,fetcher:async(url,opts)=>{calls.push({url,opts});assert.ok(sequence.length,"unexpected request");return sequence.shift();}};
}
test("ETag de representação fraco usa versão forte dos metadados",async()=>{
 const m=mockBlob([meta('"abc"'),body([{id:"c"}],'W/"compressed"'),meta('"abc"')]);
 assert.deepEqual(await readSnapshot("records.json",blobConfig,m.fetcher),{rows:[{id:"c"}],version:'"abc"'});
 assert.match(m.calls[0].url,/vercel.com\/api\/blob/);
 assert.match(m.calls[1].url,/cache=0$/);
 assert.equal(m.calls[1].opts.headers["Accept-Encoding"],"identity");
 assert.ok(m.calls.every(c=>c.opts.cache==="no-store"&&c.opts.redirect==="error"));
});
test("alteração simultânea durante leitura não associa dados antigos à versão nova",async()=>{
 const m=mockBlob([meta('"a"'),body([{id:"old"}],'W/"old"'),meta('"b"'),meta('"b"'),body([{id:"new"}],'W/"new"'),meta('"b"')]);
 assert.deepEqual(await readSnapshot("records.json",blobConfig,m.fetcher),{rows:[{id:"new"}],version:'"b"'});
});
test("versão forte divergente e concorrência persistente não liberam gravação",async()=>{
 const m=mockBlob(Array.from({length:3},()=>[meta('"a"'),body([],'"b"'),meta('"a"')]).flat());
 await assert.rejects(readSnapshot("records.json",blobConfig,m.fetcher),e=>e.status===409);
});
test("metadados fracos ou ausentes falham com segurança; 404 permite inicialização create-only",async()=>{
 assert.equal(strongVersion('W/"a"'),null);assert.equal(strongVersion("abc"),'"abc"');
 await assert.rejects(readSnapshot("records.json",blobConfig,mockBlob([meta('W/"a"')]).fetcher),e=>e.status===503);
 assert.equal(await readSnapshot("records.json",blobConfig,mockBlob([new Response(null,{status:404})]).fetcher),null);
});

test("gravação condicional conserva o ETag e mapeia conflito 412 para 409",async()=>{
 const m=mockBlob([new Response(JSON.stringify({error:{code:"precondition_failed"}}),{status:412})]);
 await assert.rejects(writeSnapshot([{id:"c"}],blobConfig,"records.json",'"abc"',m.fetcher),e=>e.status===409);
 assert.equal(m.calls[0].opts.headers["x-if-match"],'"abc"');
 assert.equal(m.calls[0].opts.headers["x-allow-overwrite"],"1");
 assert.equal(m.calls[0].opts.headers["x-vercel-blob-access"],"private");
});
import { randomUUID } from "node:crypto";
// Explicitly limited to this hotfix preview. No production CRM data is read or
// written. A unique synthetic object is removed even if the assertions fail.
const liveBlobTest=process.env.VERCEL_ENV==="preview"&&process.env.VERCEL_GIT_COMMIT_REF==="fix/crm-blob-etag-20261126";
test("Blob real privado: criar, alterar, reler e rejeitar versão antiga",{skip:!liveBlobTest,timeout:90000},async()=>{
 const token=process.env.BLOB_READ_WRITE_TOKEN;
 const storeId=token?.split("_")[3];
 assert.ok(token&&storeId&&/^[A-Za-z0-9]+$/.test(storeId),"Conexão privada de teste indisponível");
 const config={token,storeId};
 const path="ey-crm-tests/"+randomUUID()+".json";
 try{
  assert.equal(await readSnapshot(path,config),null);
  await writeSnapshot([{id:"synthetic",status:"initial"}],config,path);
  const first=await readSnapshot(path,config);
  assert.equal(first?.rows[0]?.status,"initial");
  assert.ok(first?.version);
  await writeSnapshot([{id:"synthetic",status:"updated"}],config,path,first.version);
  const second=await readSnapshot(path,config);
  assert.equal(second?.rows[0]?.status,"updated");
  assert.notEqual(second?.version,first.version);
  await assert.rejects(writeSnapshot([{id:"synthetic",status:"stale"}],config,path,first.version),e=>e.status===409);
  assert.equal((await readSnapshot(path,config))?.rows[0]?.status,"updated");
 }finally{
  const url="https://"+storeId+".private.blob.vercel-storage.com/"+path;
  const response=await fetch("https://vercel.com/api/blob/delete",{
   method:"POST",headers:{Authorization:"Bearer "+token,"x-vercel-blob-store-id":storeId,"x-api-version":"13","x-api-blob-request-id":randomUUID(),"x-api-blob-request-attempt":"0","Content-Type":"application/json"},body:JSON.stringify({urls:[url]}),cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)
  });
  assert.ok(response.ok||response.status===404,"Falha na limpeza do objeto sintético");
 }
});

import {publicSite,interpretAudit,buildApproach,prospectBlocked} from "../app/lib/prospecting.ts";
test("prospecção exige fonte pública HTTPS e rejeita IP, credenciais e parâmetros",()=>{assert.equal(publicSite("https://empresa.com.br"),"https://empresa.com.br/");for(const url of ["http://empresa.com.br","https://127.0.0.1","https://server.local","https://user:pass@empresa.com.br","https://empresa.com.br/?secret=x"])assert.throws(()=>publicSite(url));});
test("auditoria não inventa métricas nem achados",()=>{assert.throws(()=>interpretAudit({},"https://empresa.com.br","2026-11-26"));const a=interpretAudit({lighthouseResult:{categories:{seo:{score:1}},audits:{}}},"https://empresa.com.br","2026-11-26");assert.equal(a.scores.performance,null);assert.equal(a.findings.length,0);assert.throws(()=>buildApproach("VELO","Empresa",[]));});
test("diagnóstico fundamenta abordagem e conserva fonte e opt-out",()=>{const a=interpretAudit({lighthouseResult:{categories:{performance:{score:.42}},audits:{"largest-contentful-paint":{numericValue:3500}}}},"https://empresa.com.br","2026-11-26");assert.equal(a.findings.length,2);const d=buildApproach("VELO","Empresa",a.findings);assert.match(d.body,/3,5 s/);assert.match(d.body,/https:\/\/empresa.com.br/);assert.match(d.body,/não receber novos contatos/);assert.match(d.body,/Velo Delivery/);assert.equal(d.priority,"alta");});
test("deduplicação de e-mail e bloqueio por oposição cruzam marcas",()=>{const rows=[{id:"a",kind:"prospect",status:"não contatar",email:"comercial@empresa.com.br"},{id:"b",kind:"client",status:"ativo",email:"cliente@empresa.com.br"}];assert.equal(prospectBlocked(rows," COMERCIAL@empresa.com.br "),true);assert.equal(prospectBlocked(rows,"cliente@empresa.com.br"),true);assert.equal(prospectBlocked(rows,"novo@empresa.com.br"),false);});

test("ambas as marcas usam remetente corporativo único e assinatura distinta",()=>{const f=[{title:"Desempenho mobile",detail:"Pontuação 42/100",url:"https://empresa.com.br/",observedAt:"2026-11-26"}];const ey=buildApproach("EYAGENCIA","Empresa",f),velo=buildApproach("VELO","Empresa",f);assert.equal(ey.sender,"contato@eyagencia.com.br");assert.equal(velo.sender,ey.sender);assert.match(ey.body,/https:\/\/eyagencia.com.br/);assert.match(velo.body,/Equipe Velo Delivery \| EYAGENCIA/);assert.match(velo.body,/https:\/\/velodelivery.com.br/);});

import {umblerConfig,mailAccount,UmblerConfigError,safeMailFailure} from "../app/lib/umbler-config.ts";
test("Umbler usa contas e servidores fixos com TLS, sem depender de parâmetros públicos redundantes",()=>{const env={UMBLER_CONTATO_PASSWORD:"synthetic-test-only",UMBLER_FINANCEIRO_PASSWORD:"synthetic-finance-only",UMBLER_SMTP_HOST:"attacker.example",UMBLER_SMTP_PORT:"25",UMBLER_CONTATO_EMAIL:"outra@example.com"};assert.equal(mailAccount("contato"),true);assert.equal(mailAccount("outra"),false);const c=umblerConfig("contato",env);assert.equal(c.imapPort,993);assert.equal(c.smtpPort,587);assert.equal(c.smtpHost,"smtp.umbler.com");assert.equal(c.user,"contato@eyagencia.com.br");assert.equal(umblerConfig("financeiro",env).user,"financeiro@eyagencia.com.br");assert.throws(()=>umblerConfig("financeiro",{}),e=>e instanceof UmblerConfigError&&e.missingKey==="UMBLER_FINANCEIRO_PASSWORD");assert.throws(()=>umblerConfig("contato",{UMBLER_CONTATO_PASSWORD:"  "}),e=>e instanceof UmblerConfigError&&e.missingKey==="UMBLER_CONTATO_PASSWORD");});
test("Umbler classifica falhas sem divulgar mensagens ou segredos do provedor",()=>{assert.equal(safeMailFailure({code:"EAUTH",message:"SECRET"}),"Autenticação recusada pelo servidor");assert.equal(safeMailFailure({code:"ETIMEDOUT"}),"Falha de conexão ou tempo limite");assert.equal(safeMailFailure({message:"SECRET"}),"Servidor não confirmou a operação");});

import {mailReadRequest,mailSequenceRange,mailTextPart,mailHtmlText} from "../app/lib/mail-read.ts";
test("leitura corporativa aceita apenas contas fixas e operações list/read com UID válido",()=>{
 assert.equal(mailReadRequest({account:"outro",action:"list",page:0}),null);
 assert.equal(mailReadRequest({account:"contato",action:"send",page:0}),null);
 assert.equal(mailReadRequest({account:"contato",action:"read",uid:0,uidValidity:"1"}),null);
 assert.equal(mailReadRequest({account:"contato",action:"read",uid:1,uidValidity:"abc"}),null);
 assert.deepEqual(mailReadRequest({account:"financeiro",action:"read",uid:7,uidValidity:"123"}),{account:"financeiro",action:"read",uid:7,uidValidity:"123"});
 assert.equal(mailSequenceRange(144,0),"125:144");assert.equal(mailSequenceRange(144,7),"1:4");assert.equal(mailSequenceRange(144,8),null);
});
test("seleção de texto ignora anexos e prefere texto simples; HTML nunca renderizado",()=>{
 assert.deepEqual(mailTextPart({type:"multipart/alternative",childNodes:[{type:"text/html",part:"1"},{type:"text/plain",part:"2",disposition:"attachment"},{type:"text/plain",part:"3"}]}),{part:"3",kind:"plain",size:undefined});
 assert.equal(mailTextPart({type:"application/pdf",part:"1"}),null);
 assert.equal(mailHtmlText("<head><style>hidden</style></head><p>Olá &amp; tchau</p><script>evil()</script><img src='https://tracker.example/a'>"),"Olá & tchau");
});

import {isPublicIPv4,officialEmails,businessMentioned,candidatesFromOsm,sameBusiness,prospectDraft} from "../app/lib/prospect-agent-model.ts";
test("agente bloqueia IPs internos e reservados; só confirma e-mail funcional publicado no domínio",()=>{
 for(const ip of ["127.0.0.1","10.1.2.3","169.254.169.254","172.16.0.1","192.168.1.1","100.64.0.1","198.18.0.1","192.0.2.1","203.0.113.1","224.0.0.1","::1"])assert.equal(isPublicIPv4(ip),false);
 assert.equal(isPublicIPv4("8.8.8.8"),true);
 const html='<script><a href="mailto:vendas@loja.com.br">x</a></script><a href="mailto:contato@loja.com.br">Contato</a><a href="mailto:joao@loja.com.br">Pessoa</a><a href="mailto:contato@outro.com.br">Outro</a>';
 assert.deepEqual(officialEmails(html,"https://www.loja.com.br/"),["contato@loja.com.br"]);
 assert.equal(businessMentioned("<h1>Loja São João</h1>","Loja Sao Joao"),true);
 assert.equal(businessMentioned("<script>Loja São João</script>","Loja Sao Joao"),false);
});
test("agente exige achado real, deduplica empresas e mantém oportunidade em revisão",()=>{
 const cs=candidatesFromOsm({elements:[{id:1,type:"node",tags:{name:"Loja Teste",website:"https://loja.com.br"}},{id:2,type:"node",tags:{name:"Outra",website:"https://instagram.com/loja"}},{id:3,type:"node",tags:{name:"Duplicada",website:"https://www.loja.com.br"}}]},"EYAGENCIA");
 assert.equal(cs.length,1);
 const c={...cs[0],email:"contato@loja.com.br",source:"https://loja.com.br/"};
 const at="2026-11-27T12:00:00.000Z",audit={url:c.site,at,scores:{performance:42,seo:99,accessibility:90},findings:[]};
 assert.equal(prospectDraft(c,audit,at,"p1"),null);
 const row=prospectDraft(c,{...audit,findings:[{title:"Desempenho mobile",detail:"Pontuação 42/100",url:c.site,observedAt:at}]},at,"p1");
 assert.equal(row.status,"aprovado");assert.equal(row.createdBy,"agent:prospect");assert.equal(sameBusiness([row],c),true);assert.equal(sameBusiness([{...row,status:"não contatar",email:"vendas@loja.com.br"}],c),true);
});

import {presenceFindings,leadScore,noSiteResearch,channelPolicy} from "../app/lib/sdr-qualification.ts";
test("SDR diferencia evidência positiva de ausência não comprovada e bloqueia canais",()=>{
 const at="2026-11-27T12:00:00.000Z",site="https://loja.com.br/";
 const f=presenceFindings('<a href="/cardapio.pdf">Cardápio</a><a href="https://wa.me/5500000000">Fazer pedido</a><a href="https://ifood.com.br/">Pedir</a>',site,"VELO",at);
 assert.equal(f.length,3);assert.equal(leadScore(f,true),95);
 assert.equal(presenceFindings("<h1>Loja</h1>",site,"VELO",at).length,0);
 assert.equal(leadScore([],true),0);
 const r=noSiteResearch({elements:[{type:"node",id:1,tags:{name:"Loja teste"}},{type:"node",id:2,tags:{name:"Loja com site",website:site}}]},"EYAGENCIA",at);
 assert.equal(r.length,1);assert.equal(r[0].score,45);assert.match(r[0].reason,/sem site informado/);
 assert.match(channelPolicy().whatsapp,/bloqueado/);assert.match(channelPolicy().email,/bloqueado/);
});
