import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const aiContentJobType = defineType({
  name: 'aiContentJob',
  title: 'AI Content Job',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'topic', title: 'Pauta', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'targetKeyword', title: 'Palavra-chave alvo', type: 'string'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Em processamento', value: 'running'},
          {title: 'QA aprovado — revisão humana', value: 'qa_passed'},
          {title: 'Requer revisão', value: 'needs_review'},
          {title: 'Erro', value: 'error'},
        ],
      },
    }),
    defineField({name: 'qaPassed', title: 'QA aprovado', type: 'boolean'}),
    defineField({name: 'qaScore', title: 'Score QA', type: 'number'}),
    defineField({name: 'model', title: 'Modelo', type: 'string'}),
    defineField({name: 'postDraftId', title: 'ID do draft do post', type: 'string'}),
    defineField({name: 'createdAt', title: 'Criado em', type: 'datetime'}),
    defineField({name: 'briefRaw', title: 'Radar / briefing', type: 'text', rows: 12}),
    defineField({name: 'factCheckRaw', title: 'Verificação factual', type: 'text', rows: 12}),
    defineField({name: 'articleRaw', title: 'Artigo estruturado', type: 'text', rows: 18}),
    defineField({name: 'qaRaw', title: 'QA editorial', type: 'text', rows: 12}),
    defineField({name: 'reviewerNotes', title: 'Notas da revisão humana', type: 'text', rows: 6}),
  ],
  preview: {
    select: {
      title: 'topic',
      status: 'status',
      score: 'qaScore',
    },
    prepare({title, status, score}) {
      return {
        title,
        subtitle: [status, typeof score === 'number' ? 'QA ' + score : null].filter(Boolean).join(' · '),
      }
    },
  },
})
