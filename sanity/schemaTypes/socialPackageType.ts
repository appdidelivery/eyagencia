import {defineArrayMember, defineField, defineType} from 'sanity'

const frame = defineArrayMember({
  name: 'socialFrame',
  type: 'object',
  fields: [
    defineField({name:'kind',title:'Tipo de quadro',type:'string'}),
    defineField({name:'title',title:'Mensagem principal',type:'string'}),
    defineField({name:'text',title:'Texto de apoio',type:'text',rows:3}),
    defineField({name:'link',title:'Link',type:'url'}),
    defineField({name:'durationSeconds',title:'Duração em segundos',type:'number'}),
  ],
  preview:{select:{title:'title',subtitle:'kind'}},
})
export const socialPackageType=defineType({
  name:'socialPackage',
  title:'Agente Social · Pacotes do Blog',
  type:'document',
  fields:[
    defineField({name:'title',title:'Artigo de origem',type:'string',readOnly:true}),
    defineField({name:'sourcePostId',title:'ID do artigo',type:'string',readOnly:true}),
    defineField({name:'sourceSlug',title:'Slug',type:'string',readOnly:true}),
    defineField({name:'sourceUrl',title:'Leitura completa',type:'url'}),
    defineField({name:'sourcePublishedAt',title:'Publicado no blog em',type:'datetime'}),
    defineField({name:'formatVersion',title:'Versão do layout',type:'string'}),
    defineField({name:'state',title:'Situação',type:'string',options:{list:[
      {title:'Roteiro criado (aguardando renderização/publicação)',value:'planned'},
      {title:'Mídias renderizadas',value:'rendered'},
      {title:'Publicado',value:'published'},
      {title:'Falha de processamento',value:'failed'},
    ]}}),
    defineField({name:'carousel',title:'Carrossel · 1080×1350 (8 telas)',type:'array',of:[frame]}),
    defineField({name:'stories',title:'Stories · 1080×1920 (4 telas)',type:'array',of:[frame]}),
    defineField({name:'videoScenes',title:'Roteiro Reels · 1080×1920',type:'array',of:[frame]}),
    defineField({name:'caption',title:'Legenda social',type:'text',rows:6}),
    defineField({name:'createdAt',title:'Criado em',type:'datetime'}),
  ],
  preview:{select:{title:'title',subtitle:'state'}},
})
