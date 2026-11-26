"use client";
import {useState} from "react";
type Account="contato"|"financeiro";
type Result={account:string;imap:{ok:boolean;messageCount?:number};smtp:{ok:boolean};checkedAt:string;sent:false};
const accounts:Account[]=["contato","financeiro"];
export default function CorporateMail(){
 const [working,setWorking]=useState<Account|null>(null),[results,setResults]=useState<Partial<Record<Account,Result>>>({}),[errors,setErrors]=useState<Partial<Record<Account,string>>>({});
 async function test(account:Account){
  setWorking(account);setErrors(old=>({...old,[account]:""}));setResults(old=>({...old,[account]:undefined}));
  try{const r=await fetch("/api/admin/umbler-check",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({account})});const data=await r.json();if(!r.ok)throw Error(data.error||"Teste indisponível.");setResults(old=>({...old,[account]:data}));}catch(e){setErrors(old=>({...old,[account]:e instanceof Error?e.message:"Falha no teste."}));}finally{setWorking(null);}
 }
 return <div className="ey-stack"><section className="ey-panel"><div className="ey-panel-head"><div><h2>Umbler · conexão corporativa</h2><p>Teste de autenticação seguro. IMAP em somente leitura; SMTP verifica a conexão, sem enviar e-mail.</p></div><span className="ey-badge">Privado</span></div>
 {accounts.map(account=>{const r=results[account];return <div className="ey-panel" key={account}><div className="ey-panel-head"><div><h3>{account}@eyagencia.com.br</h3><p>{account==="contato"?"Comercial e atendimento":"Financeiro e cobranças"}</p></div><button className="ey-secondary" disabled={!!working} onClick={()=>void test(account)}>{working===account?"Verificando…":"Testar conexão"}</button></div>
 <div className="ey-kpis"><div className="ey-kpi"><span>IMAP</span><strong>{r?(r.imap.ok?"Autenticado":"Falha"):"Não testado"}</strong>{r?.imap.ok&&<small>{r.imap.messageCount??"—"} mensagens na INBOX</small>}</div><div className="ey-kpi"><span>SMTP</span><strong>{r?(r.smtp.ok?"Autenticado":"Falha"):"Não testado"}</strong><small>Nenhuma mensagem enviada</small></div></div>{r&&<p>Verificado: {new Date(r.checkedAt).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}</p>}{errors[account]&&<p className="ey-error" role="alert">{errors[account]}</p>}</div>})}
 <p>Credenciais ficam exclusivamente no ambiente de produção. Não são devolvidas pelo endpoint nem exibidas no navegador. A autenticação SMTP não comprova entrega. Envio, sincronização de mensagens e automações comerciais permanecem desativados.</p></section></div>
}
