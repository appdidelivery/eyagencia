"use client";
import { useEffect, useState, type FormEvent } from "react";
import "./crm.css";

const modules = {
  client: { title: "Clientes e leads", statuses: ["lead", "negociação", "ativo", "inativo", "a conferir"] },
  contract: { title: "Contratos", statuses: ["minuta", "aguardando assinatura", "assinado", "encerrado", "a conferir"] },
  monthly: { title: "Mensalidades", statuses: ["prevista", "cobrada", "cancelada"] },
  payment: { title: "Pagamentos", statuses: ["pendente", "recebido", "cancelado"] },
  delivery: { title: "Entregas", statuses: ["pendente", "em andamento", "concluída"] },
  document: { title: "Documentos", statuses: ["minuta", "validado", "arquivado", "a conferir"] },
} as const;
type Kind = keyof typeof modules;
type RecordData = { kind: Kind; title: string; clientId: string; unit: string; status: string; amountCents: number; date: string; notes: string; url: string };
type Row = RecordData & { id: string };
const empty = (kind: Kind): RecordData => ({kind, title:"",clientId:"",unit:"",status:modules[kind].statuses[0],amountCents:0,date:"",notes:"",url:""});
const currency = (cents: number) => (cents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";
const button = "rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-50";
function safeUrl(s: string) { try { return new URL(s).protocol === "https:"; } catch { return false; } }

export default function Crm() {
  const [version,setVersion]=useState("");
  const [authorized,setAuthorized]=useState(false);
  const [ready,setReady]=useState(false);
  const [rows,setRows]=useState<Row[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [kind,setKind]=useState<Kind>("client");
  const [view,setView]=useState<Kind|"overview">("overview");
  const [drawer,setDrawer]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("");
  const [form,setForm]=useState<RecordData>(empty("client"));
  const [editId,setEditId]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [dataFailed,setDataFailed]=useState(false);
  const [filter,setFilter]=useState("");
  useEffect(()=>{
    let active=true;
    const query=new URLSearchParams(window.location.search);
    const code=query.get("login");
    const errors:Record<string,string>={denied:"A conta Google não está autorizada.",cancelled:"Login cancelado. Tente novamente.",invalid:"Sessão de login inválida ou expirada. Tente novamente.",provider:"O Google não concluiu a autenticação. Verifique as permissões do aplicativo.",config:"Configuração do login Google indisponível."};
    async function start(){
      try{
        const response=await fetch("/api/admin/crm",{cache:"no-store",credentials:"same-origin"});
        if(!active)return;
        if(response.status===401||response.status===403){if(code)setError(errors[code]||"Não foi possível concluir o login.");return;}
        const payload=await response.json();
        if(!response.ok){setDataFailed(true);throw new Error(payload.error||"Não foi possível abrir o CRM.");}
        setNotice(payload.notice||"");
        setRows(payload.rows);setVersion(payload.version);setAuthorized(true);setLoaded(true);setError("");
      }catch(err){if(active)setError(err instanceof Error?err.message:"Falha ao consultar CRM.");}
      finally{if(active)setReady(true);}
    }
    void start();
    return()=>{active=false;};
  },[]);

  const clients=rows.filter(r=>r.kind==="client");
  const activeClients=clients.filter(r=>r.status==="ativo");
  const clientName=(id:string)=>clients.find(c=>c.id===id)?.title||"";
  const visible=rows.filter(r=>r.kind===kind && (!filter || r.clientId===filter || r.id===filter) && (!statusFilter||r.status===statusFilter) && [r.title,r.unit,r.notes,clientName(r.clientId)].join(" ").toLowerCase().includes(search.toLowerCase()));
  const changeKind=(k:Kind|"overview")=>{setView(k);if(k!=="overview"){setKind(k);setForm(empty(k));}setEditId(null);setFilter("");setStatusFilter("");setSearch("");setDrawer(false);setMobile(false);};
  function openNew(k:Kind){changeKind(k);setDrawer(true);}
  function edit(r:Row){setKind(r.kind);setForm({kind:r.kind,title:r.title,clientId:r.clientId,unit:r.unit,status:r.status,amountCents:r.amountCents,date:r.date,notes:r.notes,url:r.url});setEditId(r.id);setDrawer(true);}
  async function refresh(){setBusy(true);setError("");try{const r=await fetch("/api/admin/crm",{cache:"no-store",credentials:"same-origin"});const p=await r.json();if(!r.ok)throw new Error(p.error||"Falha ao atualizar.");setRows(p.rows);setVersion(p.version);setNotice(p.notice||"");}catch(e){setError(e instanceof Error?e.message:"Falha ao atualizar.");}finally{setBusy(false);}}

  const change=(k:keyof RecordData,v:string|number)=>setForm(f=>({...f,[k]:v}));
  function login(){window.location.assign("https://eyagencia.com.br/api/admin/auth");}
  async function logout(){
    try{
      const response=await fetch("/api/admin/auth/logout",{method:"POST",credentials:"same-origin"});
      if(!response.ok)throw new Error();
      setRows([]);setVersion("");setAuthorized(false);setLoaded(false);window.location.assign("/admin");
    }catch{setError("Não foi possível sair. Tente novamente.");}
  }
  async function save(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(!authorized||!loaded||busy)return;
    const item={...form,title:form.title.trim(),notes:form.notes.trim(),url:form.url.trim()};
    if(!item.title || (item.kind!=="client"&&!clients.some(c=>c.id===item.clientId)) || (item.url&&!safeUrl(item.url)) || !Number.isSafeInteger(item.amountCents)||item.amountCents<0){setError("Revise os campos e o vínculo com o cliente.");return;}
    setBusy(true);setError("");
    try{
      const response=await fetch("/api/admin/crm",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({item,id:editId,version}),cache:"no-store"});
      const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Falha ao salvar.");
      setRows(payload.rows);setVersion(payload.version);setNotice(payload.notice||"");setForm(empty(kind));setEditId(null);setDrawer(false);
    }catch(err){setError(err instanceof Error?err.message:"Não foi possível salvar.");}
    finally{setBusy(false);}
  }
  if(!ready)return <main className="min-h-screen p-8">Validando acesso...</main>;
  if(!authorized)return <main className="min-h-screen grid place-items-center bg-slate-100 text-slate-900"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow"><h1 className="text-2xl font-bold">EYAGENCIA | Gestão interna</h1><p className="my-4">Acesso exclusivo a administradores autorizados. Entre com a conta Google da agência.</p>{error&&<p role="alert" className="text-red-700">{error}</p>}{dataFailed?<><p className="my-3 text-sm text-slate-600">Sua sessão foi reconhecida, mas a base não pôde ser carregada.</p><button className={button} onClick={()=>window.location.reload()}>Recarregar dados</button><button className="ml-3 underline" onClick={()=>void logout()}>Sair</button></>:<button className={button} onClick={login}>Entrar com Google</button>}</section></main>;
  const monthly=rows.filter(r=>r.kind==="monthly"&&r.status!=="cancelada");
  const payments=rows.filter(r=>r.kind==="payment");
  const deliveries=rows.filter(r=>r.kind==="delivery");
  const contracts=rows.filter(r=>r.kind==="contract");
  const docs=rows.filter(r=>r.kind==="document");
  const pending=payments.filter(r=>r.status==="pendente");
  const sum=(data:Row[])=>data.reduce((a,r)=>a+r.amountCents,0);
  const revenue=monthly.reduce<Record<string,number>>((a,r)=>{a[r.clientId]=(a[r.clientId]||0)+r.amountCents;return a;},{});
  const bars=Object.entries(revenue).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...bars.map(b=>b[1]));
  const done=deliveries.filter(r=>r.status==="concluída").length;
  const statusColors:Record<string,string>={"ativo":"#138a65","negociação":"#e2a329","lead":"#6795cb","inativo":"#94a3b8","a conferir":"#a78bba","pendente":"#d39b35","em andamento":"#6089c1","concluída":"#138a65"};
  const badges=(s:string)=><span className={"ey-badge "+(["ativo","assinado","recebido","concluída","validado"].includes(s)?"good":["pendente","negociação","minuta","a conferir","aguardando assinatura"].includes(s)?"warn":"neutral")}>{s}</span>;
  const dateLabel=(s:string)=>s?s.split("-").reverse().join("/"):"—";
  const nav: {key:Kind|"overview";label:string;icon:string}[]=[{key:"overview",label:"Visão geral",icon:"M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z"},{key:"client",label:"Clientes e leads",icon:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 11a4 4 0 0 0 0-8 M22 21v-2a4 4 0 0 0-3-4"},{key:"contract",label:"Contratos",icon:"M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7"},{key:"monthly",label:"Mensalidades",icon:"M3 6h18v14H3z M3 10h18 M7 15h5"},{key:"payment",label:"Pagamentos",icon:"M12 2v20 M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"},{key:"delivery",label:"Entregas",icon:"M4 4h16v16H4z M8 12l3 3 5-6"},{key:"document",label:"Documentos",icon:"M3 6h7l2 2h9v12H3z"}];
  const icon=(d:string)=><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}/></svg>;
  function distribution(data:Row[], keys:readonly string[]){
    const parts=keys.map(label=>({label,count:data.filter(r=>r.status===label).length,color:statusColors[label]||"#8795a7"}));
    let cursor=0;const segments=parts.filter(p=>p.count).map(p=>{const start=cursor;cursor+=p.count/Math.max(data.length,1)*100;return p.color+" "+start+"% "+cursor+"%";});
    return <div className="ey-distribution"><div className="ey-donut" role="img" aria-label={parts.map(p=>p.label+": "+p.count).join(", ")} style={{background:segments.length?"conic-gradient("+segments.join(",")+")":"#e5eae7"}}><div><strong>{data.length}</strong><small>registros</small></div></div><div className="ey-legend">{parts.map(p=><div key={p.label}><i style={{background:p.color}}/><span>{p.label}</span><strong>{p.count}</strong></div>)}</div></div>;
  }
  const kpis=[{label:"Receita mensal de referência",value:currency(sum(monthly)),detail:"Prevista e histórica, não recebida",key:"monthly" as const},{label:"Clientes ativos",value:String(activeClients.length),detail:clients.length+" cadastros no total",key:"client" as const},{label:"Cobranças pendentes",value:currency(sum(pending)),detail:pending.length+" pagamentos registrados",key:"payment" as const},{label:"Contratos assinados",value:String(contracts.filter(r=>r.status==="assinado").length),detail:contracts.length+" contratos cadastrados",key:"contract" as const},{label:"Entregas concluídas",value:done+"/"+deliveries.length,detail:deliveries.filter(r=>r.status==="em andamento").length+" em andamento",key:"delivery" as const},{label:"Documentos",value:String(docs.length),detail:"Biblioteca de arquivos",key:"document" as const}];
  return <main className="ey-crm">
    <button className="ey-mobile-toggle" onClick={()=>setMobile(!mobile)} aria-expanded={mobile}>☰ Menu</button>
    <aside className={"ey-sidebar "+(mobile?"ey-open":"")}>
      <div className="ey-brand"><img src="/eyagencia-logo-verde.png" alt="EYAGENCIA"/><small>GESTÃO INTERNA</small></div>
      <div className="ey-menu-label">WORKSPACE</div>
      <nav aria-label="Menu do CRM">{nav.map(n=><button key={n.key} className={view===n.key?"selected":""} onClick={()=>changeKind(n.key)}>{icon(n.icon)}<span>{n.label}</span>{view===n.key&&<span className="ey-nav-dot"/>}</button>)}</nav>
      <div className="ey-sidebar-bottom"><div className="ey-profile"><span className="ey-avatar">EY</span><div><strong>EYAGENCIA</strong><small>Área administrativa</small></div></div><button onClick={()=>void logout()}>{icon("M10 17l5-5-5-5 M15 12H3 M12 3h8v18h-8")} Sair da conta</button></div>
    </aside>
    <section className="ey-content">
      <header className="ey-topbar"><div className="ey-crumb">Workspace <span> / </span> {nav.find(n=>n.key===view)?.label}</div><div className="ey-actions"><button className="ey-secondary" disabled={busy} onClick={()=>void refresh()}>↻ Atualizar</button><button className="ey-primary" onClick={()=>openNew(view==="overview"?"client":kind)}>+ Novo registro</button></div></header>
      <div className="ey-main"><div className="ey-pagehead"><div><div className="ey-eyebrow">EYAGENCIA · CENTRAL DE GESTÃO</div><h1>{view==="overview"?"Visão geral":modules[kind].title}</h1><p>{view==="overview"?"Acompanhe clientes, receita, contratos e operação em um só lugar.":"Organize, filtre e acompanhe seus registros."}</p></div><span className="ey-live"><i/> Dados do CRM</span></div>
      {error&&<div className="ey-error" role="alert">{error}</div>}
      {notice&&<div className="ey-error" role="status">{notice}</div>}
      {!loaded?<p>Carregando registros autorizados...</p>:view==="overview"?<>
      <div className="ey-kpis">{kpis.map(k=><button className="ey-kpi" key={k.key} onClick={()=>changeKind(k.key)}><span>{k.label}</span><strong>{k.value}</strong><small>{k.detail}</small></button>)}</div>
      <div className="ey-charts"><section className="ey-panel"><div className="ey-panel-head"><div><h2>Receita por cliente</h2><p>Mensalidades de referência · BRL</p></div><button className="ey-link" onClick={()=>changeKind("monthly")}>Ver mensalidades →</button></div><div className="ey-bars">{bars.length?bars.map(([id,value])=><div key={id} className="ey-bar-row"><div><span>{clientName(id)||"Cliente"}</span><strong>{currency(value)}</strong></div><div className="ey-track"><i style={{width:(100*value/max)+"%"}}/></div></div>):<p>Sem mensalidades cadastradas.</p>}</div></section>
      <div className="ey-sidecharts"><section className="ey-panel"><div className="ey-panel-head"><div><h2>Carteira de clientes</h2><p>Distribuição por situação</p></div></div>{distribution(clients,modules.client.statuses)}</section><section className="ey-panel"><div className="ey-panel-head"><div><h2>Andamento das entregas</h2><p>Progresso operacional</p></div></div>{distribution(deliveries,modules.delivery.statuses)}</section></div></div>
      <div className="ey-bottom-grid"><section className="ey-panel"><div className="ey-panel-head"><div><h2>Cobranças pendentes</h2><p>Valores ainda não confirmados</p></div><button className="ey-link" onClick={()=>changeKind("payment")}>Ver todos →</button></div>{pending.length?pending.slice(0,6).map(r=><div className="ey-minirow" key={r.id}><div><strong>{clientName(r.clientId)}</strong><small>{r.title} · {dateLabel(r.date)}</small></div><strong>{currency(r.amountCents)}</strong></div>):<p>Nenhuma cobrança pendente.</p>}</section>
      <section className="ey-panel"><div className="ey-panel-head"><div><h2>Contratos e documentos</h2><p>Arquivos vinculados à carteira</p></div><button className="ey-link" onClick={()=>changeKind("contract")}>Ver contratos →</button></div>{contracts.slice(0,5).map(r=><div className="ey-minirow" key={r.id}><div><strong>{clientName(r.clientId)}</strong><small>{r.title}</small></div>{r.url&&safeUrl(r.url)?<a className="ey-link" href={r.url} target="_blank" rel="noopener noreferrer">Abrir ↗</a>:badges(r.status)}</div>)}{!contracts.length&&<p>Sem contratos cadastrados.</p>}</section></div>
      </>:<section className="ey-panel ey-table-panel"><div className="ey-panel-head"><div><h2>{modules[kind].title}</h2><p>{visible.length} registros encontrados</p></div></div><div className="ey-filters"><input className={field} placeholder="Buscar registros..." aria-label="Buscar registros" value={search} onChange={e=>setSearch(e.target.value)}/><select className={field} aria-label="Filtrar por status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">Todos os status</option>{modules[kind].statuses.map(s=><option key={s}>{s}</option>)}</select>{kind!=="client"&&<select className={field} aria-label="Filtrar por cliente" value={filter} onChange={e=>setFilter(e.target.value)}><option value="">Todos os clientes</option>{clients.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>}</div><div className="ey-table-scroll"><table><thead><tr><th>{kind==="client"?"Cliente":"Registro"}</th><th>Unidade</th><th>Status</th><th>{kind==="client"?"Mensalidade ref.":"Valor"}</th><th>Data</th><th>Ações</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}><td><strong>{r.title}</strong>{r.clientId&&<small>{clientName(r.clientId)}</small>}{r.notes&&<small className="ey-notes">{r.notes}</small>}</td><td>{r.unit||"—"}</td><td>{badges(r.status)}</td><td>{(kind==="client"?revenue[r.id]:r.amountCents)>0?currency(kind==="client"?revenue[r.id]:r.amountCents):"—"}</td><td>{dateLabel(r.date)}</td><td><div className="ey-row-actions">{r.url&&safeUrl(r.url)&&<a className="ey-link" href={r.url} target="_blank" rel="noopener noreferrer">Abrir ↗</a>}<button className="ey-link" onClick={()=>edit(r)}>Editar</button></div></td></tr>)}</tbody></table>{!visible.length&&<div className="ey-empty">Nenhum registro encontrado.</div>}</div></section>}
      </div>
    </section>
    {drawer&&<div className="ey-overlay" onClick={()=>{if(!busy)setDrawer(false)}}><section className="ey-drawer" role="dialog" aria-modal="true" aria-label={editId?"Editar registro":"Novo registro"} onClick={e=>e.stopPropagation()}><div className="ey-panel-head"><div><div className="ey-eyebrow">{modules[kind].title}</div><h2>{editId?"Editar registro":"Novo registro"}</h2></div><button className="ey-secondary" disabled={busy} onClick={()=>setDrawer(false)} aria-label="Fechar formulário">×</button></div>{error&&<div className="ey-error" role="alert">{error}</div>}<form className="space-y-4" onSubmit={save}>
        <label className="block">Nome / título<input className={field} required maxLength={180} value={form.title} onChange={e=>change("title",e.target.value)}/></label>
        {kind!=="client"&&<label className="block">Cliente<select className={field} required value={form.clientId} onChange={e=>change("clientId",e.target.value)}><option value="">Selecione</option>{clients.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>}
        <label className="block">Unidade<input className={field} maxLength={150} value={form.unit} onChange={e=>change("unit",e.target.value)}/></label>
        <label className="block">Status<select className={field} value={form.status} onChange={e=>change("status",e.target.value)}>{modules[kind].statuses.map(s=><option key={s}>{s}</option>)}</select></label>
        {["contract","monthly","payment"].includes(kind)&&<label className="block">Valor em reais<input className={field} type="number" min="0" max="100000000" step="0.01" value={form.amountCents/100} onChange={e=>change("amountCents",Math.round(Number(e.target.value)*100))}/></label>}
        <label className="block">Data / vencimento<input type="date" className={field} value={form.date} onChange={e=>change("date",e.target.value)}/></label>
        <label className="block">Observações<textarea className={field} rows={5} maxLength={5000} value={form.notes} onChange={e=>change("notes",e.target.value)}/></label>
        <label className="block">Link privado do documento<input className={field} type="url" maxLength={1000} value={form.url} onChange={e=>change("url",e.target.value)}/></label>
        <button className="ey-primary" disabled={busy} type="submit">{busy?"Salvando...":"Salvar registro"}</button>
    </form></section></div>}
  </main>;
}
