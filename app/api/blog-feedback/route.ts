import {createHash} from 'node:crypto'
import {NextRequest, NextResponse} from 'next/server'
import {client} from '../../../sanity/lib/client'

export const dynamic = 'force-dynamic'
const json = (value: unknown, status = 200) => NextResponse.json(value, {status, headers:{'Cache-Control':'no-store'}})
const validSlug = (s: unknown): s is string => typeof s === 'string' && /^[a-z0-9][a-z0-9-]{0,110}$/.test(s)
const clean = (v: unknown, max: number) => String(v || '').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max)

async function snapshot(slug: string) {
  const result = await client.fetch(`{
    "likes":count(*[_type=="blogFeedback" && postSlug==$slug && kind=="like"]),
    "ratings":*[_type=="blogFeedback" && postSlug==$slug && kind=="rating"].rating,
    "comments":*[_type=="blogFeedback" && postSlug==$slug && kind=="comment" && status=="approved"] | order(createdAt desc)[0...20]{name,message,createdAt},
    "commentCount":count(*[_type=="blogFeedback" && postSlug==$slug && kind=="comment" && status=="approved"])
  }`,{slug})
  const ratings:number[]=(result.ratings||[]).filter((r:unknown)=>Number.isInteger(r)&&Number(r)>=1&&Number(r)<=5)
  return {likes:result.likes||0,ratingCount:ratings.length,ratingAverage:ratings.length?Math.round(10*ratings.reduce((a,b)=>a+b,0)/ratings.length)/10:null,comments:result.comments||[],commentCount:result.commentCount||0}
}
export async function GET(req: NextRequest) {
  const slug=req.nextUrl.searchParams.get('slug')
  if (!validSlug(slug))return json({error:'Artigo inválido.'},400)
  try{return json(await snapshot(slug))}catch(e){console.error('[feedback:GET]',e);return json({error:'Interações indisponíveis.'},503)}
}
export async function POST(req: NextRequest) {
  let originHost=''
  try{originHost=new URL(req.headers.get('origin')||'').hostname}catch{}
  if(!['eyagencia.com.br','www.eyagencia.com.br'].includes(originHost))return json({error:'Origem não autorizada.'},403)
  const secret=process.env.SANITY_API_WRITE_TOKEN
  if(!secret)return json({error:'Interações temporariamente indisponíveis.'},503)
  if(Number(req.headers.get('content-length')||0)>3000)return json({error:'Mensagem excede o limite.'},413)
  let body:Record<string,unknown>
  try{body=await req.json()}catch{return json({error:'Dados inválidos.'},400)}
  const slug=body.slug, kind=body.kind
  if(!validSlug(slug)||!['like','rating','comment'].includes(String(kind)))return json({error:'Solicitação inválida.'},400)
  try{
    const exists=await client.fetch('count(*[_type=="post" && slug.current==$slug && !(_id in path("drafts.**"))])>0',{slug})
    if(!exists)return json({error:'Artigo não encontrado.'},404)
    const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim()
    const agent=req.headers.get('user-agent')||'unknown'
    const identity=createHash('sha256').update([secret,ip,agent,slug].join('|')).digest('hex').slice(0,32)
    const writer=client.withConfig({token:secret,useCdn:false})
    const base={_type:'blogFeedback',postSlug:slug,kind,createdAt:new Date().toISOString()}
    if(kind==='like')await writer.createIfNotExists({...base,_id:'blogFeedback.like.'+identity})
    if(kind==='rating'){
      const rating=Number(body.rating)
      if(!Number.isInteger(rating)||rating<1||rating>5)return json({error:'Selecione uma nota de 1 a 5.'},400)
      await writer.createIfNotExists({...base,_id:'blogFeedback.rating.'+identity,rating})
    }
    if(kind==='comment'){
      const name=clean(body.name,60)||'Leitor'
      const message=clean(body.message,1000)
      if(message.length<10||/https?:\/\/|www\.|<\/?[a-z]/i.test(message))return json({error:'Mínimo de 10 caracteres, sem links.'},400)
      const daily=createHash('sha256').update(identity+new Date().toISOString().slice(0,10)).digest('hex').slice(0,32)
      await writer.createIfNotExists({...base,_id:'blogFeedback.comment.'+daily,name,message,status:'pending'})
    }
    return json({ok:true,pending:kind==='comment',...(await snapshot(slug))})
  }catch(e){console.error('[feedback:POST]',e);return json({error:'Não foi possível registrar a interação.'},503)}
}
