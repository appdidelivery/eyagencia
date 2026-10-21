# Piloto — Agente de Conteúdo eYagencia

**Ambiente: branch `feat/content-agent-pilot`, Vercel Preview. Não publicar em produção sem revisão.**

## Fluxo e segurança

1. Radar Editorial → pesquisa web **somente se o modelo suportar**.
2. Verificador → confiança e fontes primárias; conferir leis nos sítios oficiais.
3. Editor SEO/GEO/E-E-A-T → estrutura editorial, links da allowlist e sem dados inventados.
4. QA → nota >= 85, risco editorial `low` **e** nenhum bloqueio determinístico.
5. Sanity → cria exclusivamente um `post` em **draft** e um `aiContentJob` com relatório de auditoria.

O score da IA **não sobrepõe** os bloqueios determinísticos. Nenhuma execução publica artigos automaticamente. Links internos não autorizados são retirados da versão rascunho. Quando não há busca web ativa, fontes alegadas pelo modelo não são adicionadas ao corpo do rascunho, e o registro fica em revisão.

## Fatos jurídicos verificados em 21/10/2026

As referências abaixo foram indevidamente usadas no artigo de teste, e **não devem ser apresentadas como marcos de IA ou regulação de plataformas**:

- Lei 15.070/2024: regula bioinsumos, não IA. Fonte: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15070.htm
- Lei 14.811/2024: proteção de crianças e adolescentes contra violência. Fonte: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/_leis2024.htm
- Decreto 11.157: de 29/07/2022; revogado pelo Decreto 11.570/2023; não regula plataformas digitais. Fonte: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d11157.htm
- O Senado aprovou o PL 2.338/2023 em dezembro de 2024 e o encaminhou à Câmara em março de 2025. Não chamar o PL de lei sancionada. Fonte: https://www25.senado.leg.br/web/atividade/materias/-/materia/157233

Para qualquer outro dispositivo citado no futuro, **verificar número, ano, objeto, situação e texto oficial antes da publicação**. Este inventário de erros conhecidos não substitui fact-checking.

## Variáveis e custos

- `SANITY_API_WRITE_TOKEN`: necessário para criar rascunho.
- `AI_GATEWAY_API_KEY`: chave do gateway.
- `CONTENT_AGENT_MODEL`: opcional. A implementação antiga usa `inclusionai/ling-3.1-flash-free` como padrão do piloto, uma opção promocional que **não deve ser presumida disponível**. Antes de rodar novamente, conferir o catálogo atual do AI Gateway e limites de gastos.
- `CONTENT_AGENT_PILOT_ENABLED=true`: habilita temporariamente o gatilho GET no preview. **Ausente/desativado por padrão para evitar gasto acidental**.
- `CONTENT_AGENT_SECRET`: necessário para chamada POST em produção.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET`: projeto e dataset existentes.

## Rotas

- `GET /api/content-agent/run`: exibe status (sem chamar IA).
- `GET /api/content-agent/run?check=sanity`: somente no preview; grava e remove um registro temporário no Sanity para testar permissões.
- `GET /api/content-agent/run?latest=1`: somente no preview; lê o histórico do último job, sem chamar IA.
- `GET /api/content-agent/run?pilot=1`: somente no preview e com `CONTENT_AGENT_PILOT_ENABLED=true`; **executa IA e pode consumir créditos**.
- `POST /api/content-agent/run`: gera artigo draft; exige segredo no ambiente production.

Após mudar variáveis de ambiente, realizar novo deploy de preview para recarregar os valores.

## Antes de liberar uma nova execução

- [ ] Verificar catálogo e preço do modelo escolhido no Vercel AI Gateway.
- [ ] Configurar orçamento e alerta de gastos restritivos antes de usar modelo pago.
- [ ] Testar validação dos três erros jurídicos conhecidos.
- [ ] Conferir o resultado de build do preview.
- [ ] Revisar rascunho, fontes, links, autoria, data, FAQ e informações legais por humano.
- [ ] Manter publicação automática inativa.
