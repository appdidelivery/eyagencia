import {defineField,defineType} from 'sanity'

export const socialNewsPostType=defineType({
  name:'socialNewsPost',title:'Radar de notícias · Publicações',type:'document',
  fields:[
    defineField({name:'brand',title:'Marca',type:'string',readOnly:true}),
    defineField({name:'day',title:'Dia da curadoria',type:'string',readOnly:true}),
    defineField({name:'status',title:'Situação',type:'string',readOnly:true,
      options:{list:[
        {title:'Reservada',value:'reserved'},
        {title:'Gerando arte',value:'generating'},
        {title:'Publicando',value:'publishing'},
        {title:'Publicada',value:'published'},
        {title:'Parcial',value:'partial'},
        {title:'Falhou',value:'failed'},
        {title:'Conferência manual',value:'verification_required'},
      ]}}),
    defineField({name:'sourceName',title:'Veículo de origem',type:'string',readOnly:true}),
    defineField({name:'sourceUrl',title:'Link da notícia original',type:'url',readOnly:true}),
    defineField({name:'sourceTitle',title:'Título da notícia',type:'string',readOnly:true}),
    defineField({name:'sourcePublishedAt',title:'Data da notícia',type:'datetime',readOnly:true}),
    defineField({name:'caption',title:'Legenda original com crédito',type:'text',rows:8,readOnly:true}),
    defineField({name:'imageUrl',title:'Arte própria',type:'url',readOnly:true}),
    defineField({name:'imageAssetId',title:'Asset Sanity',type:'string',readOnly:true}),
    defineField({name:'instagramPostId',title:'ID Instagram',type:'string',readOnly:true}),
    defineField({name:'facebookPostId',title:'ID Facebook',type:'string',readOnly:true}),
    defineField({name:'errors',title:'Ocorrências',type:'array',of:[{type:'string'}],readOnly:true}),
    defineField({name:'createdAt',title:'Registro criado',type:'datetime',readOnly:true}),
    defineField({name:'finishedAt',title:'Publicação finalizada',type:'datetime',readOnly:true}),
  ],
  preview:{
    select:{title:'sourceTitle',brand:'brand',status:'status',day:'day'},
    prepare:({title,brand,status,day})=>({
      title:title||'Notícia do setor',
      subtitle:[brand,day,status].filter(Boolean).join(' · '),
    }),
  },
})
