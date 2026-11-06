import {defineField,defineType} from 'sanity'

export const academyCompletionType=defineType({
 name:'academyCompletion',
 title:'Academia · Conclusões',
 type:'document',
 description:'Inscrições de concluintes (autodeclaradas). Nome e WhatsApp são criptografados no backend. Para ver o contato completo consulte a mensagem recebida no WhatsApp da agência.',
 fields:[
  defineField({name:'courseId',title:'Código da trilha',type:'string',readOnly:true}),
  defineField({name:'courseTitle',title:'Curso concluído',type:'string',readOnly:true}),
  defineField({name:'contactAlias',title:'Contato parcialmente identificado',type:'string',readOnly:true}),
  defineField({name:'completedMissions',title:'Missões declaradas concluídas',type:'array',of:[{type:'string'}],readOnly:true}),
  defineField({name:'completedAt',title:'Data de conclusão declarada',type:'datetime',readOnly:true}),
  defineField({name:'registeredAt',title:'Data do registro',type:'datetime',readOnly:true}),
  defineField({name:'studentReported',title:'Autodeclarado pelo navegador',type:'boolean',readOnly:true}),
  defineField({name:'marketingOptIn',title:'Autorizou contato para marketing?',type:'boolean',readOnly:true}),
  defineField({name:'consentVersion',title:'Versão do aviso de privacidade',type:'string',readOnly:true}),
  defineField({name:'consentedAt',title:'Data do consentimento',type:'datetime',readOnly:true}),
  defineField({name:'notificationChannel',title:'Canal de notificação',type:'string',readOnly:true}),
  defineField({name:'notificationStatus',title:'Situação do aviso',type:'string',
   description:'O sistema prepara um link do WhatsApp, mas não confirma entrega automática. O recebimento deve ser conferido manualmente.',
   options:{list:[
    {title:'Aguardando envio do aluno',value:'aguardando_envio_aluno'},
    {title:'Mensagem recebida / conferida',value:'recebida_confirmada'}
   ]}
  }),
  defineField({name:'encryptedContact',title:'Contato criptografado (somente backend)',type:'object',readOnly:true,
   fields:[
    defineField({name:'iv',title:'Vetor de inicialização',type:'string',readOnly:true,hidden:true}),
    defineField({name:'ciphertext',title:'Conteúdo criptografado',type:'string',readOnly:true,hidden:true}),
    defineField({name:'tag',title:'Tag de autenticação',type:'string',readOnly:true,hidden:true})
   ]
  })
 ],
 preview:{select:{title:'contactAlias',subtitle:'courseTitle',date:'completedAt',status:'notificationStatus'},
  prepare({title,subtitle,date,status}){return{title:title||'Aluno registrado',subtitle:(subtitle||'Curso')+' · '+(date?new Date(date).toLocaleDateString('pt-BR'):'')+' · '+(status==='recebida_confirmada'?'WhatsApp conferido':'Aguardando envio')}}}
})
