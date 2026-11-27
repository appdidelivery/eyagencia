import {redirect} from 'next/navigation'
import {getCrmUser} from '@/app/lib/crm-google-session'
import {brands,channels,bindingStatus} from '@/app/lib/social-google-binding'
export const dynamic='force-dynamic'
export const runtime='nodejs'
export default async function SocialConnections({searchParams}:{searchParams:Promise<{status?:string}>}){
 if(!await getCrmUser())redirect('/admin')
 const status=(await searchParams).status
 const messages:Record<string,string>={connected:'Autorização vinculada e gravada.',cancelled:'Autorização não concluída.',channel_identity_not_unique:'O canal autorizado não corresponde inequivocamente à marca.',location_identity_not_unique:'Não foi encontrado um único Perfil com o site oficial da marca.',existing_target_mismatch:'Já existe vínculo com outro destino. Nenhum vínculo foi substituído.',offline_access_missing:'Google não concedeu autorização offline.',provider_error:'Google recusou a autorização.',private_storage_missing:'Armazenamento privado indisponível.',connection_failed:'Não foi possível confirmar a autorização.'}
 return <main style={{maxWidth:840,margin:'48px auto',padding:24,fontFamily:'system-ui'}}>
  <a href="/admin">Voltar ao painel</a><h1>Conexões de marketing</h1>
  <p>Autorize cada marca separadamente. A conexão não publica conteúdo nem ativa custos. O Perfil precisa informar o domínio oficial; o canal YouTube precisa ter o nome exato da marca.</p>
  {status&&<p role="status">{messages[status]||'Autorização não confirmada; verifique as permissões.'}</p>}
  {await Promise.all(brands.map(async brand=><section key={brand} style={{border:'1px solid #8885',borderRadius:12,padding:20,margin:'20px 0'}}>
   <h2>{brand==='eyagencia'?'EYAGENCIA':'Velo Delivery'}</h2>
   {await Promise.all(channels.map(async channel=>{
    let binding=null,unavailable=false
    try{binding=await bindingStatus(brand,channel)}catch{unavailable=true}
    return <form key={channel} method="post" action="/api/admin/social/connect" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',padding:'12px 0'}}>
     <input type="hidden" name="brand" value={brand}/><input type="hidden" name="channel" value={channel}/>
     <div style={{flex:1}}><strong>{channel==='gbp'?'Perfil da Empresa Google':'YouTube (vídeos e Shorts)'}</strong>
      <p>{unavailable?'Armazenamento indisponível':binding?'Vinculado: '+binding.label:'Não vinculado'}</p></div>
     <button type="submit" disabled={unavailable}>{binding?'Reautorizar':'Conectar com Google'}</button>
    </form>
   }))}
  </section>))}
  <p>YouTube Posts: acesso à API piloto ainda não homologado. TikTok: depende de integração homologada.</p>
 </main>
}
