import {defineField, defineType} from 'sanity'
export const blogFeedbackType = defineType({
  name: 'blogFeedback', title: 'Interações do blog', type: 'document',
  fields: [
    defineField({name:'postSlug',title:'Slug do artigo',type:'string',readOnly:true}),
    defineField({name:'kind',title:'Interação',type:'string',readOnly:true,options:{list:['like','rating','comment']}}),
    defineField({name:'rating',title:'Nota (1–5)',type:'number',readOnly:true}),
    defineField({name:'name',title:'Leitor',type:'string',readOnly:true}),
    defineField({name:'message',title:'Comentário',type:'text',readOnly:true}),
    defineField({name:'createdAt',title:'Recebido em',type:'datetime',readOnly:true}),
    defineField({name:'status',title:'Moderação',type:'string',initialValue:'pending',
      options:{list:[{title:'Pendente',value:'pending'},{title:'Aprovado',value:'approved'},{title:'Rejeitado',value:'rejected'}]}}),
  ],
  preview:{select:{title:'name',subtitle:'message'}}
})
