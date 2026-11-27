# Sophia audiovisual — fase 1 (27/11/2026)

## Segurança e escopo
- Este PR é uma fundação de homologação, não uma integração ativa. Nenhuma rota cron, motor de blog, carrosséis ou configuração de produção foi modificada.
- O Google encerrou Veo 3.1 Preview na Gemini Developer API em 22/10/2026. A alternativa documentada é `gemini-omni-1.2-flash` via Interactions API. Flow e API possuem créditos separados.
- Usar Flow Pro para produzir MP4 e preservar a personagem/voz. Não assumir transferência da personagem do Flow para API.
- `SOPHIA_GEMINI_API_KEY` deve ficar apenas no Preview e nunca ser logada. Não publicar dados de clientes ou referências sem autorização.
- Nenhuma geração paga ou publicação Meta é executada por este código; os contratos retornam execute:false. O limite de R$40/mês é uma restrição de planejamento, NÃO um bloqueio financeiro efetivo; a proteção do Google é experimental e tem latência.

## Funcionalidades da fase 1
- scripts/sophia-audiovisual.mjs: roteiros Flow baseados nos fatos confirmados; estimativa Omni com margem e câmbio explícito; avaliação de orçamento e QA manual; consulta GET de metadados do modelo (não chamada em produção); payloads secos Omni/Instagram.
- sanity/schemaTypes/sophiaVideoType.ts: documento editorial de campanha da Velo, MP4 destinado à publicação, referência opcional para socialPackage existente, revisão de direitos/fatos/áudio/rotulagem e data proposta. Não equivale a publicação nas redes.
- npm run test:sophia: testes unitários sem rede e sem segredos reais.
- Valores de entrada do QA são informados pelo operador nesta fase. Ainda é necessário ffprobe ou equivalente para aferir codecs, resolução, áudio e duração reais.

## Homologação proposta
1. Validar build e acesso ao Studio em Preview com dataset de teste; não escrever em dataset de produção.
2. Importar MP4 Love Picados, confirmar perfil oficial do parceiro e ofertas vigentes; verificar direitos da Sophia e trilha. O CDN Sanity pode ser público: enviar apenas material autorizado para divulgação.
3. Conferir modelo e chave por GET, sem gerar conteúdo. A presença do modelo não garante permissão de geração.
4. Implementar ledger persistente e atômico por mês, reserva antes de cada chamada, reconciliar cobranças, bloquear por crédito elegível insuficiente, proibir retries automáticos após resposta ambígua, usar aprovação humana e câmbio conservador.
5. Implementar cliente Interactions, acompanhamento de operação, armazenamento e montagem/QA, com limites e sem ativar produção. Antes de chamar API, verificar preço e elegibilidade dos créditos; manter geração paga desativada até autorização.
6. Integrar publicador Instagram/Facebook, permissões, rotulagem, convite collab e idempotência persistente; simular timeout/duplicidade; validar upload/processamento e retorno de IDs. Convite collab depende de aceitação. Sem publicação real no Preview.
7. Integrar ao slot de terça/domingo de runVeloBlogSocial de forma opt-in, sem duplicar cron ou substituir carrossel sem decisão editorial explícita. Verificar PRs concorrentes. Merge e deploy somente após homologação e aprovação.

## Referências
- https://aistudio.google.com/docs/deprecations
- https://aistudio.google.com/docs/omni
- https://aistudio.google.com/docs/pricing#gemini-omni-1.2-flash
- https://developers.facebook.com/docs/graph-api/reference/page/video_reels
