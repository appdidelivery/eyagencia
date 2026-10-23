import {defineField, defineType} from 'sanity'

export const socialPublicationType = defineType({
  name: 'socialPublication',
  title: 'Redes sociais · Publicações',
  type: 'document',
  fields: [
    defineField({name: 'brandId', title: 'ID do cliente', type: 'string'}),
    defineField({name: 'brandName', title: 'Cliente', type: 'string'}),
    defineField({name: 'day', title: 'Dia (Brasília)', type: 'string'}),
    defineField({name: 'topic', title: 'Pauta', type: 'string'}),
    defineField({name: 'status', title: 'Estado', type: 'string', options: {list: [
      {title: 'Reservada', value: 'reserved'}, {title: 'Gerando', value: 'generating'},
      {title: 'Publicada', value: 'published'}, {title: 'Parcial', value: 'partial'},
      {title: 'Bloqueada', value: 'blocked'}, {title: 'Falha', value: 'failed'},
    ]}}),
    defineField({name: 'caption', title: 'Legenda', type: 'text', rows: 10}),
    defineField({name: 'imageUrl', title: 'Imagem usada', type: 'url'}),
    defineField({name: 'imageAssetId', title: 'Asset Sanity', type: 'string'}),
    defineField({name: 'instagramPostId', title: 'ID Instagram', type: 'string'}),
    defineField({name: 'facebookPostId', title: 'ID Facebook', type: 'string'}),
    defineField({name: 'errors', title: 'Falhas', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'createdAt', title: 'Criada em', type: 'datetime'}),
    defineField({name: 'finishedAt', title: 'Terminada em', type: 'datetime'}),
  ],
  preview: {
    select: {title: 'topic', brand: 'brandName', day: 'day', status: 'status'},
    prepare: ({title, brand, day, status}) => ({
      title: title || 'Publicação social',
      subtitle: [brand, day, status].filter(Boolean).join(' · '),
    }),
  },
})
