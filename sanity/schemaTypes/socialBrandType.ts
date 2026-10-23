import {defineField, defineType} from 'sanity'

export const socialBrandType = defineType({
  name: 'socialBrand',
  title: 'Redes sociais · Clientes',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Cliente', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Identificador', type: 'slug', options: {source: 'name'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'enabled', title: 'Publicação automática habilitada', type: 'boolean', initialValue: false}),
    defineField({name: 'brandGuide', title: 'Identidade verbal e visual', type: 'text', rows: 5, validation: (Rule) => Rule.required()}),
    defineField({name: 'audience', title: 'Público-alvo', type: 'string'}),
    defineField({name: 'verifiedFacts', title: 'Produtos, serviços e fatos confirmados (não inventar)', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'topics', title: 'Pautas autorizadas', type: 'array', of: [{type: 'string'}], validation: (Rule) => Rule.required().min(3)}),
    defineField({name: 'days', title: 'Dias de postagem (horário Brasília, 10h)', type: 'array', of: [{type: 'string', options: {list: [
      {title: 'Domingo', value: '0'}, {title: 'Segunda', value: '1'},
      {title: 'Terça', value: '2'}, {title: 'Quarta', value: '3'},
      {title: 'Quinta', value: '4'}, {title: 'Sexta', value: '5'}, {title: 'Sábado', value: '6'},
    ]}}], initialValue: ['1', '3', '5']}),
    defineField({name: 'website', title: 'Site/CTA oficial (HTTPS)', type: 'url'}),
    defineField({name: 'instagramEnabled', title: 'Publicar no Instagram', type: 'boolean', initialValue: true}),
    defineField({name: 'facebookEnabled', title: 'Publicar no Facebook', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {title: 'name', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title, subtitle: enabled ? 'Automático' : 'Pausado'}),
  },
})
