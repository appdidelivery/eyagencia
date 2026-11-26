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
