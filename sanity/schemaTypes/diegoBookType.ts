import {defineField,defineType} from 'sanity'
const allowed=(raw:string)=>{
  try {const u=new URL(raw),h=u.hostname.toLowerCase()
    return u.protocol==='https:'&&['mercadolivre.com.br','mercadolivre.com','mercado.li','meli.la'].some(d=>h===d||h.endsWith('.'+d))
  }catch{return false}
}
const fromStore=(raw:string,hosts:string[])=>{
 try{const u=new URL(raw),h=u.hostname.toLowerCase();return u.protocol==='https:'&&hosts.some(d=>h===d||h.endsWith('.'+d))}catch{return false}
}
export const diegoBookType=defineType({
 name:'diegoBook',title:'Diego Lemes · Livros que li',type:'document',
 description:'Publique apenas livros de leitura confirmada e resenhas autorizadas.',
 fields:[
  defineField({name:'title',title:'Livro',type:'string',validation:R=>R.required()}),
  defineField({name:'slug',title:'Identificador',type:'slug',options:{source:'title'},validation:R=>R.required()}),
  defineField({name:'author',title:'Autor(a)',type:'string',validation:R=>R.required()}),
  defineField({name:'cover',title:'Capa',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Texto alternativo',type:'string'})]}),
  defineField({name:'coverUrl',title:'URL da capa importada',type:'url',description:'Capas externas preservadas após a importação. Uma imagem enviada no campo Capa tem prioridade no site.'}),
  defineField({name:'affiliateUrl',title:'Link afiliado Mercado Livre',type:'url',description:'Cole seu link do Mercado Livre e publique o documento. O botão Comprar aparecerá no site.',validation:R=>R.custom(v=>!v||allowed(v)||'Somente HTTPS do Mercado Livre, mercado.li ou meli.la.')}),
  defineField({name:'category',title:'Assunto',type:'string',options:{list:['Negócios','E-commerce e marketing','IA e tecnologia','Finanças','Liderança','Desenvolvimento pessoal','Biografias','Literatura','Espiritualidade','Ciência','Mercado imobiliário','Formação técnica','Outros']}}),
  defineField({name:'readYear',title:'Ano da leitura',type:'number',validation:R=>R.integer().min(1950).max(2100)}),
  defineField({name:'about',title:'Sobre o que é',type:'text',rows:4}),
  defineField({name:'review',title:'Minha resenha (aprovada pelo Diego)',type:'text',rows:7}),
  defineField({name:'lessons',title:'O que aprendi',type:'text',rows:4}),
  defineField({name:'recommendFor',title:'Eu indicaria para',type:'text',rows:3}),
  defineField({name:'rating',title:'Minha nota (1–5)',type:'number',validation:R=>R.integer().min(1).max(5)}),

  defineField({name:'amazonAffiliateUrl',title:'Link afiliado Amazon',type:'url',description:'Link gerado no programa de Associados Amazon; não use URLs comuns para atribuir comissão.',validation:R=>R.custom(v=>!v||fromStore(v,['amazon.com.br','amzn.to','a.co'])||'Use um link HTTPS válido da Amazon ou amzn.to')}),
  defineField({name:'shopeeAffiliateUrl',title:'Link afiliado Shopee',type:'url',description:'Opcional: link gerado no programa de afiliados Shopee.',validation:R=>R.custom(v=>!v||fromStore(v,['shopee.com.br','shope.ee'])||'Use um link HTTPS válido da Shopee ou shope.ee')}),
  defineField({name:'sortOrder',title:'Ordem de exibição',type:'number'}),
  defineField({name:'readConfirmed',title:'Diego confirmou que leu?',type:'boolean',initialValue:false}),
  defineField({name:'published',title:'Exibir publicamente?',type:'boolean',initialValue:false}),
 ],
 preview:{select:{title:'title',subtitle:'author',media:'cover',published:'published'},
  prepare({title,subtitle,media,published}){return {title:title||'Novo livro',subtitle:(published?'Publicado':'Rascunho')+' · '+(subtitle||''),media}}}
})
