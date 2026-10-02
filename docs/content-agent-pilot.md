# Piloto — Agente de Conteúdo eYagencia

Fluxo inicial, deliberadamente em modo **draft-only**:

1. Radar Editorial — pesquisa atual com web search.
2. Verificador — fact-check com novas buscas.
3. Editor SEO/GEO/E-E-A-T — redação estruturada.
4. QA — bloqueio editorial.
5. Sanity — cria um `post` em draft e um `aiContentJob` para auditoria.

## Variáveis de ambiente

- `SANITY_API_WRITE_TOKEN`
- `CONTENT_AGENT_SECRET` (obrigatório em produção; preview protegido dispensa no piloto)
- `CONTENT_AGENT_MODEL` (opcional; padrão no AI Gateway: `openai/gpt-6-luna`)
- `AI_GATEWAY_API_KEY` (opcional em deploy Vercel com `VERCEL_OIDC_TOKEN`; usado como fallback)
- `OPENAI_API_KEY` (fallback opcional caso o AI Gateway/OIDC não esteja disponível)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (já usado pelo projeto)
- `NEXT_PUBLIC_SANITY_DATASET` (já usado pelo projeto)

## Endpoint

`POST /api/content-agent/run`

Header em produção:

`Authorization: Bearer <CONTENT_AGENT_SECRET>`

No preview protegido pela Vercel, o piloto aceita o POST sem esse header.

Body opcional:

```json
{
  "topic": "E-commerce + Inteligência Artificial em 2026",
  "targetKeyword": "inteligência artificial no e-commerce",
  "audience": "gestores de e-commerce, marketing e negócios digitais no Brasil"
}
```

Sem body, o endpoint usa essa pauta como primeiro teste.

## Regra de publicação

Nenhuma execução publica automaticamente. Mesmo quando o QA retorna score >= 85, o conteúdo permanece em draft para revisão humana no Studio.

> Depois de adicionar ou alterar variáveis de ambiente na Vercel, gere um novo preview deployment para que o runtime receba os novos valores.

Preview validado em 2026-10-02 para recarregar variáveis de ambiente do piloto.
