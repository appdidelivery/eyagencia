"use client";
import { useEffect, useState, type FormEvent } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, setPersistence, browserSessionPersistence, type Auth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_EY_CRM_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_EY_CRM_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_EY_CRM_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_EY_CRM_FIREBASE_APP_ID,
};
const enabled = process.env.NEXT_PUBLIC_EY_CRM_ENABLED === "true";
const modules = {
  client: { title: "Clientes e leads", statuses: ["lead", "negociação", "ativo", "inativo"] },
  contract: { title: "Contratos", statuses: ["minuta", "aguardando assinatura", "assinado", "encerrado"] },
  monthly: { title: "Mensalidades", statuses: ["prevista", "cobrada", "cancelada"] },
  payment: { title: "Pagamentos", statuses: ["pendente", "recebido", "cancelado"] },
  delivery: { title: "Entregas", statuses: ["pendente", "em andamento", "concluída"] },
  document: { title: "Documentos", statuses: ["minuta", "validado", "arquivado"] },
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
  const [auth,setAuth]=useState<Auth|null>(null);
  const [db,setDb]=useState<Firestore|null>(null);
  const [authorized,setAuthorized]=useState(false);
  const [ready,setReady]=useState(false);
  const [rows,setRows]=useState<Row[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [kind,setKind]=useState<Kind>("client");
  const [form,setForm]=useState<RecordData>(empty("client"));
  const [editId,setEditId]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [filter,setFilter]=useState("");
  useEffect(()=>{
    if(!enabled || !Object.values(config).every(Boolean)){setReady(true);return;}
    try {
      const app=getApps().find(a=>a.name==="ey-private-crm") || initializeApp(config,"ey-private-crm");
      const a=getAuth(app); const d=getFirestore(app); setAuth(a);setDb(d);
      let active=true;
      const stop=onAuthStateChanged(a,async user=>{
        setAuthorized(false);setRows([]);setLoaded(false);
        try {
          if(user){
            const token=await user.getIdTokenResult(true);
            if(active && a.currentUser?.uid===user.uid){
              if(token.claims.ey_crm_admin===true && user.emailVerified) {setAuthorized(true);setError("");}
              else setError("Conta sem autorização administrativa.");
            }
          }
        } catch { if(active)setError("Não foi possível validar a autorização."); }
        finally {if(active)setReady(true);}
      });
      return ()=>{active=false;stop();};
    } catch {setReady(true);setError("Configuração do CRM indisponível.");}
  },[]);
  useEffect(()=>{
    if(!authorized||!db)return;
    return onSnapshot(collection(db,"eyCrmRecords"), snap=>{
      setRows(snap.docs.map(d=>({...d.data(),id:d.id} as Row)));setLoaded(true);setError("");
    },()=>{setRows([]);setLoaded(false);setError("Acesso aos registros indisponível. Verifique as regras do banco.");});
  },[authorized,db]);
  const clients=rows.filter(r=>r.kind==="client");
  const activeClients=clients.filter(r=>r.status==="ativo");
  const visible=rows.filter(r=>r.kind===kind && (!filter || r.clientId===filter || r.id===filter));
  const changeKind=(k:Kind)=>{setKind(k);setForm(empty(k));setEditId(null);setFilter("");};
  const change=(k:keyof RecordData,v:string|number)=>setForm(f=>({...f,[k]:v}));
  async function login(){
    if(!auth)return;
    setError("");try{await setPersistence(auth,browserSessionPersistence);await signInWithPopup(auth,new GoogleAuthProvider());}
    catch{setError("Não foi possível entrar com Google.");}
  }
  async function save(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(!authorized||!db||!loaded||busy)return;
    const item={...form,title:form.title.trim(),notes:form.notes.trim(),url:form.url.trim()};
    if(!item.title || (item.kind!=="client"&&!clients.some(c=>c.id===item.clientId)) || (item.url&&!safeUrl(item.url)) || !Number.isSafeInteger(item.amountCents)||item.amountCents<0){setError("Revise os campos e o vínculo com o cliente.");return;}
    setBusy(true);setError("");
    try{
      if(editId)await updateDoc(doc(db,"eyCrmRecords",editId),{...item,updatedAt:serverTimestamp(),updatedBy:auth?.currentUser?.uid});
      else await addDoc(collection(db,"eyCrmRecords"),{...item,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),createdBy:auth?.currentUser?.uid,updatedBy:auth?.currentUser?.uid});
      setForm(empty(kind));setEditId(null);
    }catch{setError("Não foi possível salvar. Nenhuma confirmação de gravação foi recebida.");}
    finally{setBusy(false);}
  }
  if(!ready)return <main className="min-h-screen p-8">Validando acesso...</main>;
  if(!enabled||!auth)return <main className="min-h-screen p-8"><h1 className="text-2xl font-bold">EYAGENCIA | Gestão interna</h1><p>Ambiente indisponível até a homologação de segurança.</p></main>;
  if(!authorized)return <main className="min-h-screen grid place-items-center bg-slate-100 text-slate-900"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow"><h1 className="text-2xl font-bold">EYAGENCIA | Gestão interna</h1><p className="my-4">Acesso exclusivo a administradores autorizados.</p>{error&&<p role="alert" className="text-red-700">{error}</p>}<button className={button} onClick={login}>Entrar com Google</button>{auth.currentUser&&<button className="ml-3 underline" onClick={()=>signOut(auth)}>Sair</button>}</section></main>;
  return <main className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-8"><div className="mx-auto max-w-6xl">
    <header className="flex flex-wrap items-center justify-between gap-4 mb-6"><div><p className="font-semibold text-emerald-700">EYAGENCIA</p><h1 className="text-3xl font-bold">Gestão de clientes</h1></div><button className="underline" onClick={()=>{setRows([]);setAuthorized(false);void signOut(auth);}}>Sair</button></header>
    {error&&<p role="alert" className="my-3 rounded bg-red-100 p-3 text-red-800">{error}</p>}
    {!loaded?<p>Carregando registros autorizados...</p>:<>
    <div className="grid gap-3 sm:grid-cols-3 mb-6">
      <div className="rounded-xl bg-white p-4"><p>Clientes ativos</p><strong className="text-2xl">{activeClients.length}</strong></div>
      <div className="rounded-xl bg-white p-4"><p>Contratos assinados</p><strong className="text-2xl">{rows.filter(r=>r.kind==="contract"&&r.status==="assinado").length}</strong></div>
      <div className="rounded-xl bg-white p-4"><p>Pagamentos pendentes (registrados)</p><strong className="text-2xl">{currency(rows.filter(r=>r.kind==="payment"&&r.status==="pendente").reduce((a,r)=>a+r.amountCents,0))}</strong></div>
    </div>
    <nav className="flex flex-wrap gap-2 mb-5">{(Object.keys(modules) as Kind[]).map(k=><button key={k} className={k===kind?button:"rounded-lg bg-white px-4 py-2"} onClick={()=>changeKind(k)}>{modules[k].title}</button>)}</nav>
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><section className="rounded-xl bg-white p-5">
      <h2 className="text-xl font-bold mb-4">{editId?"Editar":"Novo registro"}</h2>
      <form className="space-y-3" onSubmit={save}>
        <label className="block">Nome / título<input className={field} required maxLength={180} value={form.title} onChange={e=>change("title",e.target.value)}/></label>
        {kind!=="client"&&<label className="block">Cliente<select className={field} required value={form.clientId} onChange={e=>change("clientId",e.target.value)}><option value="">Selecione</option>{clients.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>}
        <label className="block">Unidade<input className={field} maxLength={150} value={form.unit} onChange={e=>change("unit",e.target.value)}/></label>
        <label className="block">Status<select className={field} value={form.status} onChange={e=>change("status",e.target.value)}>{modules[kind].statuses.map(s=><option key={s}>{s}</option>)}</select></label>
        {["contract","monthly","payment"].includes(kind)&&<label className="block">Valor em reais<input className={field} type="number" min="0" max="100000000" step="0.01" value={form.amountCents/100} onChange={e=>change("amountCents",Math.round(Number(e.target.value)*100))}/></label>}
        <label className="block">Data / vencimento<input type="date" className={field} value={form.date} onChange={e=>change("date",e.target.value)}/></label>
        <label className="block">Observações<textarea className={field} rows={4} maxLength={5000} value={form.notes} onChange={e=>change("notes",e.target.value)}/></label>
        <label className="block">Link privado do documento<input className={field} type="url" maxLength={1000} value={form.url} onChange={e=>change("url",e.target.value)}/></label>
        <button className={button} disabled={busy} type="submit">{busy?"Salvando...":"Salvar registro"}</button>
        {editId&&<button type="button" className="ml-3 underline" onClick={()=>{setEditId(null);setForm(empty(kind));}}>Cancelar edição</button>}
      </form>
    </section><section className="rounded-xl bg-white p-5"><h2 className="text-xl font-bold mb-3">{modules[kind].title}</h2>
      {kind!=="client"&&<label className="block mb-3">Filtrar por cliente<select className={field} value={filter} onChange={e=>setFilter(e.target.value)}><option value="">Todos</option>{clients.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>}
      {!visible.length&&<p>Nenhum registro.</p>}
      <div className="space-y-3">{visible.map(r=><article key={r.id} className="rounded-lg border border-slate-200 p-3"><div className="flex justify-between gap-2"><strong>{r.title}</strong><span>{r.status}</span></div><p className="text-sm text-slate-600">{clients.find(c=>c.id===r.clientId)?.title} {r.unit} {r.date}</p>{r.amountCents>0&&<p>{currency(r.amountCents)}</p>}{r.notes&&<p className="whitespace-pre-wrap break-words text-sm">{r.notes}</p>}{r.url&&safeUrl(r.url)&&<a className="text-emerald-700 underline mr-4" href={r.url} target="_blank" rel="noopener noreferrer">Abrir documento</a>}<button className="underline" onClick={()=>{const {id,...rest}=r;setEditId(id);setForm({kind:rest.kind,title:rest.title,clientId:rest.clientId,unit:rest.unit,status:rest.status,amountCents:rest.amountCents,date:rest.date,notes:rest.notes,url:rest.url});}}>Editar</button></article>)}</div>
    </section></div></>}
  </div></main>;
}
