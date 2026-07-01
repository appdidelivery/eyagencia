import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO (Meta Title)',
      type: 'string',
      description: 'Título estratégico que aparecerá no Google (Ideal: 50-60 caracteres)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrição SEO (Meta Description)',
      type: 'text',
      description: 'Resumo persuasivo focado em clique/conversão na página de busca (Ideal: 150-160 caracteres)',
      rows: 3,
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo Executivo (TL;DR)',
      type: 'text',
      description: 'Resumo de alto valor que aparece no topo do artigo para reter o leitor B2B.',
      rows: 4,
    }),
    defineField({
      name: 'audioUrl',
      title: 'Link do Áudio (Opcional)',
      type: 'url',
      description: 'Cole a URL do arquivo de áudio (.mp3) hospedado para criar a versão narrada.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
