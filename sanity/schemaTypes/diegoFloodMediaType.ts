import {defineField,defineType} from 'sanity'
const chapters=Array.from({length:12},(_,i)=>({title:'Capítulo '+String(i+1).padStart(2,'0'),value:'c'+String(i+1).padStart(2,'0')}))
export const diegoFloodMediaType=defineType({
 name:'diegoFloodMedia',title:'Livro 02 · Fotografias e vídeos',type:'document',
 description:'Cada foto e vídeo recebe um código permanente. Os originais ficam no Drive privado; envie ao CMS apenas uma cópia aprovada para publicação.',
 fields:[
  defineField({name:'mediaCode',title:'Código QR permanente (ex.: m001 ou v001)',type:'string',validation:R=>R.required().regex(/^[mv][0-9]{3}$/,{name:'m001 ou v001'})}),
  defineField({name:'title',title:'Título do registro',type:'string',validation:R=>R.required()}),
  defineField({name:'chapterCode',title:'Capítulo relacionado',type:'string',options:{list:chapters}}),
  defineField({name:'image',title:'Cópia da fotografia aprovada',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Texto alternativo',type:'string'})]}),
  defineField({name:'alt',title:'Descrição acessível da fotografia',type:'string'}),
  defineField({name:'videoUrl',title:'Link do vídeo PUBLICADO (YouTube/Vimeo)',type:'url',description:'Não cole links privados de Google Drive ou de arquivos brutos.'}),
  defineField({name:'caption',title:'Legenda e contexto',type:'text',rows:4}),
  defineField({name:'credit',title:'Fotógrafo / titular dos direitos',type:'string'}),
  defineField({name:'eventDate',title:'Data conferida do registro',type:'date'}),
  defineField({name:'locationPublic',title:'Local PUBLICÁVEL (não incluir endereço sensível)',type:'string'}),
  defineField({name:'privateResearchNotes',title:'Notas internas de apuração (não publicadas)',type:'text',rows:6}),
  defineField({name:'rightsCleared',title:'Direitos e autorizações conferidos?',type:'boolean',initialValue:false}),
  defineField({name:'approvedForPublic',title:'Diego aprovou a divulgação?',type:'boolean',initialValue:false}),
  defineField({name:'published',title:'Publicar este registro?',type:'boolean',initialValue:false})
 ],
 preview:{select:{title:'title',subtitle:'mediaCode',media:'image',approved:'approvedForPublic',rights:'rightsCleared',published:'published'},
  prepare({title,subtitle,media,approved,rights,published}){return{title:title||'Registro não identificado',subtitle:(published&&approved&&rights?'PÚBLICO':'PRIVADO / EM TRIAGEM')+' · '+(subtitle||'sem código'),media}}}
})
