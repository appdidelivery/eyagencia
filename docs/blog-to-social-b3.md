# B3 · Blog → pacote social automático (EyAgencia)

## Implementado
- Novas capas temáticas por assunto: privacidade, atendimento, métricas, busca/SEO, performance, catálogo e automação.
- Cards, home, páginas dos artigos e metadados passam a exibir capas atualizadas mesmo quando o Sanity mantém assets legados `eyagencia/free-svg-v1`.
- Modo de migração conservador: só substitui capas geradas por V1, mantendo imagens manuais e protegendo revisões concorrentes.
- `socialPackage` no Studio, com 8 roteiros para slides 1080×1350, 4 stories 1080×1920, seis cenas de reel 1080×1920 e legenda/link. O texto vem exclusivamente de artigo existente e publicado.
- Agendamento diário autenticado recupera artigos e cria pacotes que ainda não existem, com ID determinístico. Não inventa pontos ausentes: artigos curtos ficam de fora.

## Configuração
- `CONTENT_AGENT_COVER_REPAIR_ENABLED=true` na produção: reprocessa até 3 capas automáticas antigas por execução do cron de conteúdo.
- `CONTENT_AGENT_SOCIAL_PACKAGES_ENABLED=true` na produção: prepara até 3 pacotes por execução.
- A rotina é protegida pelo `CRON_SECRET` existente.
- As flags independem de `CONTENT_AGENT_AI_ENABLED`: não acionam geração paga.
- A arte das capas é gerada no servidor, sem inferência e sem novos provedores de IA.

## Estados
- `planned`: roteiro estruturado criado, **não** é imagem PNG/JPEG ou post na Meta.
- `rendered`: mídias efetivamente exportadas (etapa posterior).
- `published`: confirmação do ID de postagem na rede (etapa posterior).

## Automação a completar
1. Renderizar efetivamente os 8 arquivos de carrossel e 4 de stories a partir dos quadros; anexar os assets no Sanity.
2. Exportar vídeo vertical em MP4, confirmar áudio/licenças, duração e qualidade.
3. Agendar Instagram carrossel e stories pela API Meta (permissões e limitações da plataforma).
4. Substituir agendamento genérico de foto única por roteamento por tipo de mídia, com auditoria.
5. Replicar pacotes nos artigos do blog Velo mantendo a linguagem e identidade da marca.

**Atenção:** stories gerados como imagens não implicam suporte a sticker de link clicável pela API. O CTA automático deve orientar link no perfil, a menos que a permissão da API habilite outro mecanismo oficialmente.
