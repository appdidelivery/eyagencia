import {redirect} from 'next/navigation'
import {recentAssistedContent} from '@/app/api/social-agent/assistedContent'
import {getCrmUser} from '@/app/lib/crm-google-session'
import {brands,channels,bindingStatus} from '@/app/lib/social-google-binding'
export const metadata={title:'Conexões de marketing | EYAGENCIA',robots:{index:false,follow:false}}
export const dynamic='force-dynamic'
export const runtime='nodejs'
export default async function SocialConnections({searchParams}:{searchParams:Promise<{status?:string}>}){
 if(!await getCrmUser())redirect('/admin')
 const status=(await searchParams).status
 const queue=process.env.VERCEL_ENV==='production'?await recentAssistedContent().catch(()=>null):null
 const messages:Record<string,string>={disconnected:'Vínculo local removido; novos envios ficam bloqueados.',consent_required:'Confirme a autorização antes de continuar.',production_only:'Conexões reais disponíveis apenas em produção.',connected:'Autorização vinculada e gravada.',cancelled:'Autorização não concluída.',channel_identity_not_unique:'O canal autorizado não corresponde inequivocamente à marca.',location_identity_not_unique:'Não foi encontrado um único Perfil com o site oficial da marca.',existing_target_mismatch:'Já existe vínculo com outro destino. Nenhum vínculo foi substituído.',offline_access_missing:'Google não concedeu autorização offline.',provider_error:'Google recusou a autorização.',private_storage_missing:'Armazenamento privado indisponível.',connection_failed:'Não foi possível confirmar a autorização.'}
 return <main style={{maxWidth:840,margin:'48px auto',padding:24,fontFamily:'system-ui'}}>
  <a href="/admin">Voltar ao painel</a><h1>Conexões de marketing</h1>
  <p>Autorize cada marca separadamente. A conexão não publica conteúdo nem ativa custos. O Perfil precisa informar o domínio oficial; o canal YouTube precisa ter o nome exato da marca.</p>
  {status&&<p role="status">{messages[status]||'Autorização não confirmada; verifique as permissões.'}</p>}
  {await Promise.all(brands.map(async brand=><section key={brand} style={{border:'1px solid #8885',borderRadius:12,padding:20,margin:'20px 0'}}>
   <h2>{brand==='eyagencia'?'EYAGENCIA':'Velo Delivery'}</h2>
   {await Promise.all(channels.map(async channel=>{
    let binding=null,unavailable=false
    try{if(process.env.VERCEL_ENV!=='production')unavailable=true;else binding=await bindingStatus(brand,channel)}catch{unavailable=true}
    return <div key={channel}><form method="post" action="/api/admin/social/connect" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',padding:'12px 0'}}>
     <input type="hidden" name="brand" value={brand}/><input type="hidden" name="channel" value={channel}/>
     <div style={{flex:1}}><strong>{channel==='gbp'?'Perfil da Empresa Google':'YouTube (vídeos e Shorts)'}</strong>
      <p>{unavailable?'Armazenamento indisponível':binding?'Vinculado: '+binding.label:'Não vinculado'}</p></div>
     <label style={{flexBasis:'100%',fontSize:14}}><input type="checkbox" name="consent" value="yes" required/> Li a <a href="https://www.velodelivery.com.br/privacidade" target="_blank" rel="noreferrer">política de privacidade</a> e autorizo a distribuição automatizada de conteúdo desta marca no destino conectado, após habilitação explícita da automação.</label>
     <button type="submit" disabled={unavailable}>{binding?'Reautorizar':'Conectar com Google'}</button>
    </form>{binding&&<form method="post" action="/api/admin/social/connect" style={{paddingBottom:12}}><input type="hidden" name="brand" value={brand}/><input type="hidden" name="channel" value={channel}/><input type="hidden" name="action" value="disconnect"/><label><input type="checkbox" name="confirm" value="yes" required/> Confirmo a remoção deste vínculo local.</label> <button type="submit">Desconectar</button></form>}</div>
   }))}
  </section>))}
  <section style={{border:'1px solid #8885',borderRadius:12,padding:20,margin:'20px 0'}}>
  <h2>Conteúdos para publicação assistida</h2>
  <p>Últimos sete dias de conteúdo próprio com publicação Meta confirmada. Confira a conta de destino no aplicativo oficial; nenhum envio é feito por este painel.</p>
  {!queue?<p>Fila indisponível neste ambiente.</p>:queue.map(({brand,items})=><div key={brand}><h3>{brand==='eyagencia'?'EYAGENCIA':'Velo Delivery'}</h3>
  {!items.length?<p>Nenhum conteúdo elegível.</p>:items.map(item=><article key={item._id} style={{borderTop:'1px solid #8885',padding:'16px 0'}}>
  <strong>{item.title}</strong><p style={{whiteSpace:'pre-wrap'}}>{item.caption}</p>
  {item.video?<p><a href={item.video} target="_blank" rel="noreferrer">Abrir MP4 original</a></p>:<div style={{display:'flex',gap:12,flexWrap:'wrap'}}>{item.images?.map((url,i)=><a key={i} href={url} target="_blank" rel="noreferrer">Imagem {i+1}</a>)}</div>}
  <p><a href="https://studio.youtube.com/" target="_blank" rel="noreferrer">YouTube Studio — {item.video?'vídeo/Short':'Posts'}</a> · <a href="https://www.tiktok.com/upload" target="_blank" rel="noreferrer">TikTok — publicar</a></p>
  </article>)}</div>)}
  </section>
  <p>A revogação completa pode ser realizada nas <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noreferrer">permissões da Conta Google</a>; como o aplicativo é compartilhado, isso pode afetar outras integrações. Para excluir dados, contate contato@eyagencia.com.br.</p><p>YouTube Posts: acesso à API piloto ainda não homologado. TikTok: depende de integração homologada.</p>
 </main>
}
