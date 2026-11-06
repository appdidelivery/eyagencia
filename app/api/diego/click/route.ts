import {NextRequest,NextResponse} from 'next/server'
import {createClient} from 'next-sanity'
export const runtime='nodejs'

const bioIds=new Set(['eyagencia','velo_delivery','livros','playlist','projetos','trajetoria','ia_ecommerce','artigos','contato','instagram','obra_enchente'])
const partners=new Set(['mercado_livre','amazon','shopee','mercado_livre_nao_afiliado','mercado_livre_box_5_volumes','amazon_box_5_volumes','mercado_livre_edicao_homens'])
const clean=(v:unknown,max=80)=>typeof v==='string'?v.replace(/[^a-zA-Z0-9áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ._ -]/g,'').slice(0,max):''
export async function POST(request:NextRequest){
 try{
  const origin=request.headers.get('origin')
  if(origin&&origin!==request.nextUrl.origin)return new NextResponse(null,{status:403})
  const fetchSite=request.headers.get('sec-fetch-site')
  if(fetchSite&&fetchSite!=='same-origin')return new NextResponse(null,{status:403})
  const ref=request.headers.get('referer')
  if(ref){let r:URL;try{r=new URL(ref)}catch{return new NextResponse(null,{status:403})}
   if(r.origin!==request.nextUrl.origin||!r.pathname.startsWith('/diego'))return new NextResponse(null,{status:403})
  }
  const body=await request.json()
  const kind=body?.kind==='affiliate'?'affiliate':body?.kind==='bio'?'bio':null
  const linkId=clean(body?.linkId,100)
  if(!kind||!linkId)return new NextResponse(null,{status:400})
  if(kind==='bio'&&!bioIds.has(linkId))return new NextResponse(null,{status:400})
  if(kind==='affiliate'&&!/^[a-z0-9-]{3,100}$/.test(linkId))return new NextResponse(null,{status:400})
  const partner=kind==='affiliate'?clean(body?.partner):''
  if(kind==='affiliate'&&!partners.has(partner))return new NextResponse(null,{status:400})
  const token=process.env.SANITY_API_WRITE_TOKEN
  const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET
  if(!token||!projectId||!dataset)return new NextResponse(null,{status:503})
  const client=createClient({projectId,dataset,apiVersion:'2026-07-01',useCdn:false,token})
  await client.create({_type:'diegoBioClick',kind,linkId,partner,position:kind==='bio'?Math.max(0,Math.min(10,Number(body?.position)||0)):null,source:clean(body?.source),medium:clean(body?.medium),campaign:clean(body?.campaign),referrerHost:clean(body?.referrerHost),clickedAt:new Date().toISOString()})
  return new NextResponse(null,{status:204})
 }catch(error){console.error('[diego-analytics] falha na coleta',error instanceof Error?error.message:'erro');return new NextResponse(null,{status:500})}
}
