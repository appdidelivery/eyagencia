# Piloto — Agente de Conteúdo eYagencia

Fluxo inicial, deliberadamente em modo **draft-only**:

1. Radar Editorial — pesquisa atual com web search.
2. Verificador — fact-check com novas buscas.
3. Editor SEO/GEO/E-E-A-T — redação estruturada.
4. QA — bloqueio editorial.
5. Sanity — cria um `post` em draft e um `aiContentJob` para auditoria.

## Variáveis de ambiente

- `OPENAI_API_KEY`
- `OPENAI_CONTENT_MODEL` (opcional; padrão: `gpt-6-luna`)
- `SANITY_API_WRITE_TOKEN`
- `CONTENT_AGENT_SECRET`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (já usado pelo projeto)
- `NEXT_PUBLIC_SANITY_DATASET` (já usado pelo projeto)

## Endpoint

`POST /api/content-agent/run`

Header:

`Authorization: Bearer <CONTENT_AGENT_SECRET>`

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
