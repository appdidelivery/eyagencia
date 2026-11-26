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
