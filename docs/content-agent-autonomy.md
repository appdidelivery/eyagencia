# Rotina autônoma de conteúdo da EyAgencia

## Produção operacional

- **Agendamento:** Vercel Cron `30 12 * * *` (12h30 UTC, 9h30 em Brasília/São Paulo), todos os dias. Se a conta estiver no plano Hobby, a execução poderá variar dentro da hora.
- **Escopo:** até 1 pauta por dia, com rotação de 32 pautas de IA aplicada ao e-commerce.
- **Pesquisa:** ANPD e MDIC via fontes oficiais permitidas; faltando evidência, interromper o texto em vez de inventar fontes.
- **Produção de conteúdo:** Radar → verificador factual → editor → QA → rascunho Sanity.
- **Qualidade:** nota mínima 85, risco baixo e nenhum bloqueio determinístico para marcar `qa_passed`. Um artigo reprovado fica com `needs_review`.
- **Publicação:** **sempre manual**, com revisão de fact-check, SEO/GEO, título, data e autoria. Nenhuma rotina cron publica no blog.
- **Confidencialidade:** não inserir dados de clientes ou informações internas em modelo promocional gratuito. As pautas automáticas são públicas e genéricas.

## Segurança

- A Vercel inclui `Authorization: Bearer $CRON_SECRET` em cron agendado, e a rota `GET /api/cron/content-agent` recusa chamada que não traga a credencial.
- A rotina só funciona com `CONTENT_AGENT_AI_ENABLED=true` e `CONTENT_AGENT_AUTO_DRAFTS_ENABLED=true` **em produção**. Caso contrário responde `skipped`.
- O POST gerador exige `CONTENT_AGENT_SECRET` mesmo quando chamado pela rotina agendada.
- O preço do modelo `-free` é validado dinamicamente no catálogo da Vercel antes de cada execução. Custo não confirmado → sem inferência.
- O Sanity registra uma trava por dia em `contentAgentDailyLock` com ID `content-agent-daily-YYYY-MM-DD`; outra execução no dia é ignorada, inclusive em concorrência.
- Antes de selecionar a pauta, descarta tópicos tratados nos últimos 30 dias. O endpoint de criação também bloqueia colisões de slug em posts publicados **e** rascunhos.
- Não há tentativas automáticas extras após uma falha; a próxima oportunidade será o dia seguinte.

## Controle

- Status: `https://www.eyagencia.com.br/api/content-agent/run`
- Painel editorial: `https://www.eyagencia.com.br/studio`, seções **Agente de Conteúdo** (QA) e **Posts** (rascunhos).
- No painel Vercel do projeto `eyagencia`: Settings → Cron Jobs, para consultar execução e logs.
- Pausa de emergência: definir `CONTENT_AGENT_AUTO_DRAFTS_ENABLED=false` e fazer novo deploy de produção. Para bloquear toda inferência do agente, definir também `CONTENT_AGENT_AI_ENABLED=false` e fazer novo deploy.
- O modelo grátis pode deixar de estar disponível; em caso de tarifa diferente de zero ou oferta terminada, a geração falha fechada e não migra para modelo pago.

## Observações

- A verificação automática de fragmento literal de texto não prova que a síntese do artigo está completamente correta; mantenha a revisão humana pré-publicação.
- Não há publicação social, alteração de anúncios ou contato com clientes neste agendamento.
- A configuração de `CRON_SECRET`, `CONTENT_AGENT_SECRET` e chaves de API deve permanecer exclusivamente na Vercel (variáveis encrypted).
