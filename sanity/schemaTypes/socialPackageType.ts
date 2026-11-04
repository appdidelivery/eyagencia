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
const mediaAsset = defineArrayMember({
  name:'socialMediaAsset',
  type:'object',
  fields:[
    defineField({name:'kind',title:'Formato',type:'string'}),
    defineField({name:'index',title:'Ordem',type:'number'}),
    defineField({name:'image',title:'Arte PNG',type:'image',fields:[
      defineField({name:'alt',title:'Texto alternativo',type:'string'}),
    ]}),
    defineField({name:'imageUrl',title:'URL pública',type:'url'}),
  ],
  preview:{
    select:{media:'image',kind:'kind',index:'index'},
    prepare:({media,kind,index})=>({
      title:(kind==='story'?'Story ':'Slide ')+String(index||''),
      media,
    }),
  },
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
    defineField({name:'mediaStatus',title:'Status das artes',type:'string',readOnly:true}),
    defineField({name:'mediaVersion',title:'Versão do renderizador',type:'string',readOnly:true}),
    defineField({name:'mediaRenderedAt',title:'Artes geradas em',type:'datetime',readOnly:true}),
    defineField({name:'carouselMedia',title:'Carrossel pronto · 8 PNG (1080×1350)',type:'array',of:[mediaAsset]}),
    defineField({name:'storyMedia',title:'Stories prontos · 4 PNG (1080×1920)',type:'array',of:[mediaAsset]}),
    defineField({name:'caption',title:'Legenda social',type:'text',rows:6}),
    defineField({name:'publishStatus',title:'Publicação Instagram · status',type:'string',readOnly:true,
      options:{list:[
        {title:'Publicando',value:'publishing'},
        {title:'Publicado',value:'published'},
        {title:'Falha antes da publicação',value:'failed'},
        {title:'Verificação manual necessária',value:'verification_required'},
      ]}}),
    defineField({name:'publishAttempts',title:'Tentativas de publicação',type:'number',readOnly:true}),
    defineField({name:'lastAttemptAt',title:'Última tentativa',type:'datetime',readOnly:true}),
    defineField({name:'instagramCarouselContainerId',title:'Container Meta do carrossel',type:'string',readOnly:true}),
    defineField({name:'instagramCarouselPostId',title:'ID do carrossel publicado',type:'string',readOnly:true}),
    defineField({name:'facebookCarouselPostId',title:'ID do post de múltiplas fotos no Facebook',type:'string',readOnly:true}),
    defineField({name:'facebookPublishStatus',title:'Publicação Facebook · status',type:'string',readOnly:true}),
    defineField({name:'facebookStagedPhotoIds',title:'Fotos preparadas no Facebook',type:'array',of:[{type:'string'}],readOnly:true}),
    defineField({name:'facebookPublishedAt',title:'Facebook · publicado em',type:'datetime',readOnly:true}),
    defineField({name:'instagramStoryPosts',title:'Instagram Stories · publicações',type:'array',of:[{
      type:'object',fields:[
        defineField({name:'index',type:'number',title:'Ordem'}),
        defineField({name:'postId',type:'string',title:'ID Meta'}),
      ],
    }],readOnly:true}),
    defineField({name:'instagramStoryStatus',title:'Instagram Stories · status',type:'string',readOnly:true}),
    defineField({name:'instagramStoryPendingIndex',title:'Story aguardando conferência',type:'number',readOnly:true}),
    defineField({name:'instagramStoryContainerId',title:'Container de Story',type:'string',readOnly:true}),
    defineField({name:'instagramStoriesPublishedAt',title:'Stories · publicados em',type:'datetime',readOnly:true}),
    defineField({name:'crosspostStatus',title:'Distribuição Facebook + Stories',type:'string',readOnly:true}),
    defineField({name:'crosspostAttempts',title:'Tentativas de distribuição',type:'number',readOnly:true}),
    defineField({name:'crosspostLastAttemptAt',title:'Última tentativa',type:'datetime',readOnly:true}),
    defineField({name:'crosspostFinishedAt',title:'Distribuição finalizada em',type:'datetime',readOnly:true}),
    defineField({name:'crosspostErrors',title:'Ocorrências de distribuição',type:'array',of:[{type:'string'}],readOnly:true}),
    defineField({name:'publishedPlatforms',title:'Redes publicadas',type:'array',of:[{type:'string'}],readOnly:true}),
    defineField({name:'publishedAt',title:'Publicação social concluída em',type:'datetime',readOnly:true}),
    defineField({name:'publishErrors',title:'Ocorrências da publicação',type:'array',of:[{type:'string'}],readOnly:true}),
    defineField({name:'createdAt',title:'Criado em',type:'datetime'}),
  ],
  preview:{select:{title:'title',subtitle:'state'}},
})
