import {defineField,defineType} from 'sanity'

export const socialNativeRepostType=defineType({
  name:'socialNativeRepost',title:'Instagram · Reposts nativos sugeridos',type:'document',
  fields:[
    defineField({name:'brand',type:'string',title:'Marca',readOnly:true}),
    defineField({name:'day',type:'string',title:'Dia da sugestão',readOnly:true}),
    defineField({name:'weekStart',type:'string',title:'Semana',readOnly:true}),
    defineField({name:'status',type:'string',title:'Situação',
      initialValue:'awaiting_native_repost',options:{list:[
        {title:'Aguardando repost no Instagram',value:'awaiting_native_repost'},
        {title:'Repostado pelo Instagram',value:'reposted_manually'},
        {title:'Ignorado',value:'skipped'},
      ]},validation:Rule=>Rule.required()}),
    defineField({name:'sourceName',type:'string',title:'Fonte',readOnly:true}),
    defineField({name:'sourceHandle',type:'string',title:'Perfil de origem',readOnly:true}),
    defineField({name:'originalMediaId',type:'string',title:'ID original',readOnly:true}),
    defineField({name:'originalPermalink',type:'url',title:'Abrir post original',readOnly:true}),
    defineField({name:'originalPublishedAt',type:'datetime',title:'Publicado na origem',readOnly:true}),
    defineField({name:'mediaType',type:'string',title:'Formato',readOnly:true}),
    defineField({name:'captionExcerpt',type:'text',title:'Trecho da legenda',rows:5,readOnly:true}),
    defineField({name:'editorialNote',type:'text',title:'Comentário sugerido',rows:3}),
    defineField({name:'relevanceScore',type:'number',title:'Relevância',readOnly:true}),
    defineField({name:'createdAt',type:'datetime',title:'Sugestão criada',readOnly:true}),
    defineField({name:'confirmedAt',type:'datetime',title:'Repost confirmado'}),
  ],
  preview:{
    select:{brand:'brand',source:'sourceName',excerpt:'captionExcerpt',status:'status'},
    prepare:({brand,source,excerpt,status})=>({
      title:source||'Repost nativo',
      subtitle:[brand,status,String(excerpt||'').slice(0,60)].filter(Boolean).join(' · '),
    }),
  },
})
