# Agente de Redes Sociais · publicação 100% automática (Meta oficial)

## Objetivo
Geração editorial e postagem sem aprovação por publicação. Cada cliente tem calendário,
pautas, identidade, fatos autorizados e credenciais próprias. O agente **não** usa a
integração WhatsApp da Velo Delivery: Instagram/Facebook requerem permissões separadas.

## Fluxo
1. Vercel Cron: `0 13 * * *` UTC, às **10h em Brasília** (America/Sao_Paulo, se permanecer UTC-03).
2. Busca clientes com `socialBrand.enabled=true` no Sanity e verifica o dia configurado.
3. Verifica a presença das permissões e credenciais individuais antes de qualquer custo.
4. Reserva um documento determinístico `social-<slug>-<YYYY-MM-DD>` (idempotência).
5. Gera legenda **somente com fatos confirmados** usando modelo de preço zero verificado.
6. Usa fotos oficiais carregadas para o cliente OU produz imagem com orçamento limitado.
7. Publica foto + legenda no Facebook e no Instagram via Meta Graph API.
8. Salva o ID e o estado de cada rede (publicado/parcial/bloqueado), sem repetir posts no mesmo dia.

## Primeira configuração (somente uma vez por cliente)
- Em `/studio`, cadastrar documento **Redes sociais · Clientes**.
- Preencher identificador (ex. `velo-delivery`), identidade da marca, fatos
  comprovados, no mínimo três pautas, dias e imagens oficiais autorizadas.
- Vincular conta profissional de Instagram a uma Página do Facebook com permissões oficiais.
- Na Vercel, projeto **eyagencia**, configurar estas variáveis **encrypted** em Production
  (o sufixo será o identificador Sanity em maiúsculas e hífens trocados por `_`):

  - `SOCIAL_META_PAGE_ID_VELO_DELIVERY`
  - `SOCIAL_META_PAGE_TOKEN_VELO_DELIVERY`
  - `SOCIAL_META_INSTAGRAM_ID_VELO_DELIVERY`

- Se outro cliente: por exemplo `SOCIAL_META_PAGE_TOKEN_MAMEDES` e equivalentes.
- O token da Página precisa incluir permissões apropriadas (`pages_manage_posts`,
  `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`,
  `pages_show_list` conforme o fluxo Meta escolhido). Para clientes externos,
  validar Business Verification e App Review / Advanced Access se exigidos.
- Não enviar tokens em chats, commits nem campos do Sanity.

## Chaves gerais
- `CRON_SECRET`: existente; cron protegido por Bearer e disponível apenas em Production.
- `SANITY_API_WRITE_TOKEN`: existente.
- `AI_GATEWAY_API_KEY`: existente, uso sujeito ao modelo -free e catálogo de custo zero.
- `SOCIAL_AGENT_ENABLED=true`: habilita o processamento periódico.
- `SOCIAL_AGENT_AUTOPUBLISH_ENABLED=true`: habilita envio real, sem aprovação humana.
- `SOCIAL_AGENT_IMAGES_ENABLED=false`: padrão **sem custo de geração visual**; exige
  fotos aprovadas no Sanity. Para artes inéditas, configurar `true` apenas após
  validar o preço da imagem (o código bloqueia modelos com unidade > US$ 0,01 ou preço
  não confirmado). Mesmo sob teto, imagens geradas podem ter custos.
- `SOCIAL_AGENT_TEXT_MODEL`: opcional. Deve ter sufixo `-free` e preço confirmado.

## Limitações e proteções
- O planejamento é feito **no Sanity/Vercel**, não insere antecipadamente cartões no
  Planner da Meta. O post aparece nas redes somente após a publicação.
- Inicialmente suporta **foto estática** no Instagram e Facebook. Reels, stories,
  carrosséis, vídeos e horários por marca exigem fases específicas de integração.
- A conta do Instagram precisa ser profissional. Consumidores/pessoais não são suportados.
- Se houver erro ou timeout ambíguo, a tarefa registra falha sem reenvio automático,
  prevenindo duplicatas. Conferir `Redes sociais · Publicações` e logs da Vercel.
- A geração pode ser bloqueada por fontes ou conteúdo insuficientes; autonomia
  significa publicação sem revisão, **não publicação de conteúdo reprovado**.
- Limite de processamento: quatro marcas por rodada, uma publicação por dia/marca.
- Para pausar imediatamente: `SOCIAL_AGENT_AUTOPUBLISH_ENABLED=false` em Production
  e executar novo deployment; ou desligar `enabled` no registro do cliente.
- Antes de ativar para qualquer marca, validar licença das imagens, permissões e
  regras de uso de IA. Usuários não devem fornecer senhas ou tokens pelo chat.

## API operacional
- `GET /api/cron/social-agent` exige `Authorization: Bearer <CRON_SECRET>`
  e não oferece disparo público. Retorna estado por cliente, nunca tokens.
- Studio Sanity exibe contas habilitadas e registros de publicação.
- Sem credenciais oficiais Meta, **nenhuma publicação real é possível**.
