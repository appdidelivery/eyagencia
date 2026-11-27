import {defineField, defineType} from 'sanity'

export const sophiaVideoType = defineType({
  name: 'sophiaVideo',
  title: 'Sophia · Reels Velo Delivery',
  type: 'document',
  initialValue: {source:'flow',status:'draft',commercialFactsVerified:false,rightsVerified:false,aiDisclosureReviewed:false,audioReviewed:false},
  fields: [
    defineField({name:'title',title:'Campanha',type:'string',validation:R=>R.required().max(120)}),
    defineField({name:'clientName',title:'Cliente parceiro',type:'string',validation:R=>R.required().max(100)}),
    defineField({name:'sourcePackage',title:'Pacote editorial existente (opcional)',type:'reference',to:[{type:'socialPackage'}]}),
    defineField({name:'source',title:'Origem',type:'string',readOnly:true,options:{list:[{title:'Google Flow / MP4 manual',value:'flow'}]}}),
    defineField({name:'ctaUrl',title:'Link de compra confirmado',type:'url',validation:R=>R.required().uri({scheme:['https']})}),
    defineField({name:'verifiedFacts',title:'Informações comerciais verificadas',type:'array',of:[{type:'string'}]}),
    defineField({name:'script',title:'Roteiro e direção de arte',type:'text',rows:8}),
    defineField({name:'video',title:'MP4 final (material destinado à publicação)',type:'file',options:{accept:'video/mp4'},description:'Enviar somente o vídeo final autorizado. O arquivo poderá ficar acessível por URL no CDN do Sanity.'}),
    defineField({name:'width',title:'Largura conferida (px)',type:'number',validation:R=>R.integer().min(540)}),
    defineField({name:'height',title:'Altura conferida (px)',type:'number',validation:R=>R.integer().min(960)}),
    defineField({name:'durationSeconds',title:'Duração conferida (segundos)',type:'number',validation:R=>R.min(3).max(90)}),
    defineField({name:'caption',title:'Legenda',type:'text',rows:6,validation:R=>R.max(2200)}),
    defineField({name:'collaborator',title:'Instagram oficial do colaborador',type:'string',validation:R=>R.regex(/^@?[a-zA-Z0-9._]{1,30}$/)}),
    defineField({name:'scheduledDay',title:'Data proposta (Brasília; terça ou domingo)',type:'date'}),
    defineField({name:'commercialFactsVerified',title:'Preços e ofertas vigentes conferidos',type:'boolean'}),
    defineField({name:'rightsVerified',title:'Direitos de imagem, voz e trilha conferidos',type:'boolean'}),
    defineField({name:'audioReviewed',title:'Áudio e sincronização conferidos',type:'boolean'}),
    defineField({name:'aiDisclosureReviewed',title:'Rotulagem de IA e requisitos Meta conferidos',type:'boolean'}),
    defineField({name:'status',title:'Estado editorial (não dispara publicação)',type:'string',options:{list:[
      {title:'Rascunho',value:'draft'},{title:'Aguardando revisão',value:'review'},{title:'Aprovado para homologação manual',value:'approved'}
    ]},validation:R=>R.required()}),
  ],
  preview:{select:{title:'title',subtitle:'status'}},
})
