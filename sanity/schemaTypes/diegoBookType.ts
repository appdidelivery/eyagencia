import {defineField,defineType} from 'sanity'
const allowed=(raw:string)=>{
  try {const u=new URL(raw),h=u.hostname.toLowerCase()
    return u.protocol==='https:'&&['mercadolivre.com.br','mercadolivre.com','mercado.li','meli.la'].some(d=>h===d||h.endsWith('.'+d))
  }catch{return false}
}
export const diegoBookType=defineType({
 name:'diegoBook',title:'Diego Lemes · Livros que li',type:'document',
 description:'Publique apenas livros de leitura confirmada e resenhas autorizadas.',
 fields:[
  defineField({name:'title',title:'Livro',type:'string',validation:R=>R.required()}),
  defineField({name:'slug',title:'Identificador',type:'slug',options:{source:'title'},validation:R=>R.required()}),
  defineField({name:'author',title:'Autor(a)',type:'string',validation:R=>R.required()}),
  defineField({name:'cover',title:'Capa',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Texto alternativo',type:'string'})]}),
  defineField({name:'category',title:'Assunto',type:'string',options:{list:['Negócios','E-commerce e marketing','IA e tecnologia','Finanças','Liderança','Desenvolvimento pessoal','Biografias','Literatura','Espiritualidade','Ciência','Mercado imobiliário','Formação técnica','Outros']}}),
  defineField({name:'readYear',title:'Ano da leitura',type:'number',validation:R=>R.integer().min(1950).max(2100)}),
  defineField({name:'about',title:'Sobre o que é',type:'text',rows:4}),
  defineField({name:'review',title:'Minha resenha (aprovada pelo Diego)',type:'text',rows:7}),
  defineField({name:'lessons',title:'O que aprendi',type:'text',rows:4}),
  defineField({name:'recommendFor',title:'Eu indicaria para',type:'text',rows:3}),
  defineField({name:'rating',title:'Minha nota (1–5)',type:'number',validation:R=>R.integer().min(1).max(5)}),
  defineField({name:'affiliateUrl',title:'Link afiliado Mercado Livre',type:'url',validation:R=>R.custom(v=>!v||allowed(v)||'Somente HTTPS do Mercado Livre, mercado.li ou meli.la.')}),
  defineField({name:'sortOrder',title:'Ordem de exibição',type:'number'}),
  defineField({name:'readConfirmed',title:'Diego confirmou que leu?',type:'boolean',initialValue:false}),
  defineField({name:'published',title:'Exibir publicamente?',type:'boolean',initialValue:false}),
 ],
 preview:{select:{title:'title',subtitle:'author',media:'cover',published:'published'},
  prepare({title,subtitle,media,published}){return {title:title||'Novo livro',subtitle:(published?'Publicado':'Rascunho')+' · '+(subtitle||''),media}}}
})
