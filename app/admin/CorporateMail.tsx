"use client";
import {useState} from "react";
type Account="contato"|"financeiro";
type Result={account:string;imap:{ok:boolean;messageCount?:number;reason?:string};smtp:{ok:boolean;reason?:string};checkedAt:string;sent:false};
const accounts:Account[]=["contato","financeiro"];
export default function CorporateMail(){
 const [working,setWorking]=useState<Account|null>(null),[results,setResults]=useState<Partial<Record<Account,Result>>>({}),[errors,setErrors]=useState<Partial<Record<Account,string>>>({});
 async function test(account:Account){
  setWorking(account);setErrors(old=>({...old,[account]:""}));setResults(old=>({...old,[account]:undefined}));
  try{const r=await fetch("/api/admin/umbler-check",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({account})});const data=await r.json();if(!r.ok)throw Error(data.error||"Teste indisponível.");setResults(old=>({...old,[account]:data}));}catch(e){setErrors(old=>({...old,[account]:e instanceof Error?e.message:"Falha no teste."}));}finally{setWorking(null);}
 }
 return <div className="ey-stack"><section className="ey-panel"><div className="ey-panel-head"><div><h2>Umbler · conexão corporativa</h2><p>Teste de autenticação seguro. IMAP em somente leitura; SMTP verifica a conexão, sem enviar e-mail.</p></div><span className="ey-badge">Privado</span></div>
 {accounts.map(account=>{const r=results[account];return <div className="ey-panel" key={account}><div className="ey-panel-head"><div><h3>{account}@eyagencia.com.br</h3><p>{account==="contato"?"Comercial e atendimento":"Financeiro e cobranças"}</p></div><button className="ey-secondary" disabled={!!working} onClick={()=>void test(account)}>{working===account?"Verificando…":"Testar conexão"}</button></div>
 <div className="ey-kpis"><div className="ey-kpi"><span>IMAP</span><strong>{r?(r.imap.ok?"Autenticado":"Falha"):"Não testado"}</strong>{r?.imap.ok&&<small>{r.imap.messageCount??"—"} mensagens na INBOX (contagem, não leitura)</small>}{r&&!r.imap.ok&&<small>{r.imap.reason||"Falha não classificada"}</small>}</div><div className="ey-kpi"><span>SMTP</span><strong>{r?(r.smtp.ok?"Autenticado":"Falha"):"Não testado"}</strong>{r&&!r.smtp.ok&&<small>{r.smtp.reason||"Falha não classificada"}</small>}<small>Nenhuma mensagem enviada</small></div></div>{r&&<p>Verificado: {new Date(r.checkedAt).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}</p>}{errors[account]&&<p className="ey-error" role="alert">{errors[account]}</p>}</div>})}
 <p>Credenciais ficam exclusivamente no ambiente de produção. Não são devolvidas pelo endpoint nem exibidas no navegador. A autenticação SMTP não comprova entrega. Envio, sincronização de mensagens e automações comerciais permanecem desativados.</p></section><Inbox/></div>
}

type MailHeader={uid:number;subject:string;from:string;date:string|null;seen:boolean};
type MailList={account:Account;uidValidity:string;page:number;total:number;hasMore:boolean;messages:MailHeader[]};
type MailBody={message:MailHeader;body:string|null;format:"plain"|"html"|null;truncated:boolean};
function Inbox(){
 const [account,setAccount]=useState<Account>("contato"),[list,setList]=useState<MailList|null>(null),[opened,setOpened]=useState<MailBody|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function request(payload:Record<string,unknown>){
  const r=await fetch("/api/admin/umbler-inbox",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify(payload)});
  const data=await r.json();if(!r.ok)throw Error(data.error||"Consulta indisponível.");return data;
 }
 async function load(page=0){
  setBusy(true);setError("");setOpened(null);setList(null);
  try{setList(await request({account,action:"list",page}));}catch(e){setError(e instanceof Error?e.message:"Falha de consulta.");}finally{setBusy(false);}
 }
 async function open(uid:number){
  if(!list)return;setBusy(true);setError("");setOpened(null);
  try{setOpened(await request({account:list.account,action:"read",uid,uidValidity:list.uidValidity}));}catch(e){setError(e instanceof Error?e.message:"Falha de leitura.");}finally{setBusy(false);}
 }
 const date=(value:string|null)=>value?new Date(value).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"}):"—";
 return <section className="ey-panel"><div className="ey-panel-head"><div><h2>Caixa de entrada · leitura</h2><p>Consulta sob demanda, sem marcar como lido, enviar, apagar ou sincronizar mensagens.</p></div><span className="ey-badge">Somente leitura</span></div>
 <div className="ey-actions" style={{flexWrap:"wrap",marginBottom:16}}><label>Conta <select className="ey-input" value={account} disabled={busy} onChange={e=>{setAccount(e.target.value as Account);setList(null);setOpened(null);setError("");}}><option value="contato">contato@eyagencia.com.br</option><option value="financeiro">financeiro@eyagencia.com.br</option></select></label><button className="ey-secondary" type="button" disabled={busy} onClick={()=>void load()}>{busy?"Consultando…":"Carregar mensagens"}</button></div>
 {error&&<p className="ey-error" role="alert">{error}</p>}
 {list&&<><p className="ey-muted">{list.total} mensagens na INBOX · página {list.page+1}</p><div className="ey-stack">{list.messages.map(m=><button key={m.uid} className="ey-secondary" disabled={busy} type="button" onClick={()=>void open(m.uid)} style={{whiteSpace:"normal",textAlign:"left",overflowWrap:"anywhere"}}><strong>{m.subject}</strong><br/><small>{m.from||"Remetente indisponível"} · {date(m.date)}{!m.seen?" · Não lida":""}</small></button>)}</div>{!list.messages.length&&<p>Nenhuma mensagem nesta página.</p>}<div className="ey-actions" style={{marginTop:12}}><button className="ey-secondary" disabled={busy||list.page===0} onClick={()=>void load(list.page-1)}>Anterior</button><button className="ey-secondary" disabled={busy||!list.hasMore} onClick={()=>void load(list.page+1)}>Próxima</button></div></>}
 {opened&&<section className="ey-panel" style={{marginTop:16}}><div className="ey-panel-head"><div><h3 style={{overflowWrap:"anywhere"}}>{opened.message.subject}</h3><p style={{overflowWrap:"anywhere"}}>{opened.message.from} · {date(opened.message.date)}</p></div><button className="ey-secondary" onClick={()=>setOpened(null)}>Fechar</button></div>{opened.body===null?<p>Nenhum corpo de texto disponível. Anexos não são abertos.</p>:<><p className="ey-muted">{opened.format==="html"?"Texto extraído do HTML; sem renderizar imagens, links ou código.":"Conteúdo em texto simples."}{opened.truncated?" Exibição limitada a 256 KiB.":""}</p><div style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",maxHeight:"65vh",overflowY:"auto",lineHeight:1.6}}>{opened.body||"(Corpo vazio)"}</div></>}</section>}
 <p className="ey-muted" style={{marginTop:16}}>Não há armazenamento de cópias pelo CRM. Conteúdo acessível apenas à sessão administrativa autorizada; anexos e recursos remotos não são carregados.</p></section>;
}
