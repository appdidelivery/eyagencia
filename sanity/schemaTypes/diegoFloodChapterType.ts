import {defineField,defineType} from 'sanity'
const chapterCodes=Array.from({length:12},(_,i)=>({title:'Capítulo '+String(i+1).padStart(2,'0'),value:'c'+String(i+1).padStart(2,'0')}))
export const diegoFloodChapterType=defineType({
 name:'diegoFloodChapter',title:'Livro 02 · Capítulos',type:'document',
 description:'Textos do segundo livro. Sem aprovação do autor, ficam fora do site.',
 fields:[
  defineField({name:'chapterCode',title:'Capítulo / link permanente',type:'string',options:{list:chapterCodes},validation:R=>R.required()}),
  defineField({name:'title',title:'Título aprovado',type:'string',validation:R=>R.required()}),
  defineField({name:'order',title:'Ordem',type:'number',validation:R=>R.integer().min(1).max(12)}),
  defineField({name:'body',title:'Texto do capítulo (parágrafos separados por linha em branco)',type:'text',rows:24,description:'Somente fatos documentados e relatos revisados. Não inventar falas ou situações.'}),
  defineField({name:'sourceNotes',title:'Fontes e anotações de checagem (interno)',type:'text',rows:8}),
  defineField({name:'authorApproved',title:'Diego revisou e aprovou?',type:'boolean',initialValue:false}),
  defineField({name:'published',title:'Liberar capítulo publicamente?',type:'boolean',initialValue:false})
 ],
 preview:{select:{title:'title',code:'chapterCode',approved:'authorApproved',published:'published'},
 prepare({title,code,approved,published}){return{title:title||'Capítulo em edição',subtitle:code+' · '+(published&&approved?'Publicado':'Não publicado')}}}
})
