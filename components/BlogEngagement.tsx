'use client'
import {useEffect,useState,type FormEvent} from 'react'

type Comment={name:string;message:string;createdAt:string}
type Feedback={likes:number;ratingCount:number;ratingAverage:number|null;commentCount:number;comments:Comment[]}
const initial:Feedback={likes:0,ratingCount:0,ratingAverage:null,commentCount:0,comments:[]}

export default function BlogEngagement({slug,title,initialData=initial}:{slug:string;title:string;initialData?:Feedback}){
  const [data,setData]=useState<Feedback>(initialData)
  const [loaded,setLoaded]=useState(true)
  const [busy,setBusy]=useState(false)
  const [notice,setNotice]=useState('')
  const [rating,setRating]=useState(0)
  const [name,setName]=useState('')
  const [message,setMessage]=useState('')
  const url='https://www.eyagencia.com.br/blog/'+encodeURIComponent(slug)
  useEffect(()=>{
    let active=true
    fetch('/api/blog-feedback?slug='+encodeURIComponent(slug),{cache:'no-store'})
      .then(r=>{if(!r.ok)throw Error();return r.json()})
      .then(v=>{if(active){setData(v);setLoaded(true)}})
      .catch(()=>{if(active)setNotice('Não foi possível carregar as interações.')})
    return()=>{active=false}
  },[slug])
  async function submit(kind:'like'|'rating'|'comment',extra:Record<string,unknown>={}){
    if(busy)return
    setBusy(true);setNotice('')
    try{
      const response=await fetch('/api/blog-feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,slug,...extra})})
      const result=await response.json()
      if(!response.ok)throw Error(result.error||'Tente novamente.')
      setData(result)
      if(kind==='comment'){setMessage('');setNotice('Comentário recebido. A publicação depende de moderação.')}
      else setNotice(kind==='like'?'Curtida registrada (uma por visitante).':'Avaliação registrada (uma por visitante).')
    }catch(error){setNotice(error instanceof Error?error.message:'Não foi possível registrar.')}
    finally{setBusy(false)}
  }
  async function sendComment(event:FormEvent<HTMLFormElement>){event.preventDefault();await submit('comment',{name,message})}
  async function copyLink(){try{await navigator.clipboard.writeText(url);setNotice('Link copiado.')}catch{setNotice('Copie o link na barra de endereço.')}}

  return <section aria-label="Interações com o artigo" className="mt-12 pt-9 border-t border-slate-200 space-y-8">
    <div className="flex flex-wrap items-center gap-3">
      <button disabled={busy} type="button" onClick={()=>submit('like')} className="rounded-xl border border-[#275c58]/30 bg-[#275c58]/5 px-5 py-3 text-[#275c58] font-bold hover:bg-[#275c58]/10 disabled:opacity-50">♥ Curtir {loaded?'('+data.likes+')':''}</button>
      <a href="#comentarios" className="rounded-xl border border-slate-200 px-5 py-3 text-slate-800 font-bold hover:bg-slate-50">Comentar</a>
      <a href="#compartilhar" className="rounded-xl border border-slate-200 px-5 py-3 text-slate-800 font-bold hover:bg-slate-50">Compartilhar</a>
    </div>
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
      <h2 className="text-lg font-bold text-slate-900">Qual sua nota para este conteúdo?</h2>
      <div className="flex flex-wrap gap-1 items-center mt-3" role="group" aria-label="Avaliação de uma a cinco estrelas">
        {[1,2,3,4,5].map(value=><button key={value} type="button" disabled={busy} onClick={()=>{setRating(value);submit('rating',{rating:value})}} aria-label={value+(value===1?' estrela':' estrelas')} aria-pressed={rating===value} className={'text-3xl p-1 leading-none hover:scale-110 transition-transform disabled:opacity-50 '+(value<=rating?'text-amber-500':'text-slate-400')}>★</button>)}
        <span className="text-sm text-slate-600 ml-3">{loaded&&data.ratingCount?data.ratingAverage+'/5 · '+data.ratingCount+' avaliações':'Seja o primeiro a avaliar'}</span>
      </div>
    </div>
    <div id="compartilhar">
      <h2 className="text-lg font-bold text-slate-900 mb-3">Compartilhe este artigo</h2>
      <div className="flex flex-wrap gap-3 text-sm font-bold">
        <a target="_blank" rel="noopener noreferrer" href={'https://api.whatsapp.com/send?text='+encodeURIComponent(title+' '+url)} className="rounded-lg bg-[#25D366] px-5 py-3 text-white">WhatsApp</a>
        <a target="_blank" rel="noopener noreferrer" href={'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url)} className="rounded-lg bg-[#0077b5] px-5 py-3 text-white">LinkedIn</a>
        <button type="button" onClick={copyLink} className="rounded-lg border border-slate-300 px-5 py-3 text-slate-800">Copiar link</button>
      </div>
    </div>
    <div id="comentarios">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Comentários ({loaded?data.commentCount:'–'})</h2>
      <div className="space-y-4 mb-8" aria-live="polite">
        {data.comments.length?data.comments.map((comment,i)=><div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <strong className="text-slate-900">{comment.name||'Leitor'}</strong>
          <p className="text-slate-700 mt-2 whitespace-pre-wrap">{comment.message}</p>
        </div>):<p className="text-slate-500">Ainda não há comentários publicados.</p>}
      </div>
      <form onSubmit={sendComment} className="rounded-2xl border border-slate-200 p-5 space-y-3">
        <h3 className="font-bold text-slate-900">Deixe sua opinião</h3>
        <label htmlFor="blog-name" className="block text-sm font-semibold">Seu nome</label>
        <input id="blog-name" value={name} onChange={e=>setName(e.target.value)} maxLength={60} autoComplete="name" placeholder="Como podemos chamar você?" className="w-full border border-slate-300 rounded-lg px-4 py-3"/>
        <label htmlFor="blog-message" className="block text-sm font-semibold">Seu comentário</label>
        <textarea id="blog-message" value={message} onChange={e=>setMessage(e.target.value)} minLength={10} maxLength={1000} rows={4} required placeholder="Compartilhe sua dúvida ou opinião..." className="w-full border border-slate-300 rounded-lg px-4 py-3"/>
        <p className="text-xs text-slate-500">Os comentários são moderados antes da publicação. Não envie dados pessoais ou links.</p>
        <button disabled={busy} type="submit" className="bg-[#275c58] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-50">Enviar comentário</button>
      </form>
    </div>
    {notice?<p role="status" aria-live="polite" className="text-sm font-semibold text-[#275c58]">{notice}</p>:null}
  </section>
}
