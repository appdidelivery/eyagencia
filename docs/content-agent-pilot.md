# Piloto — Agente de Conteúdo eYagencia

**Ambiente: branch `feat/content-agent-pilot`, Vercel Preview. Não publicar em produção sem revisão.**

## Fluxo e segurança

1. Radar Editorial → pesquisa web **somente se o modelo suportar**.
2. Verificador → confiança e fontes primárias; conferir leis nos sítios oficiais.
3. Editor SEO/GEO/E-E-A-T → estrutura editorial, links da allowlist e sem dados inventados.
4. QA → nota >= 85, risco editorial `low` **e** nenhum bloqueio determinístico.
5. Sanity → cria exclusivamente um `post` em **draft** e um `aiContentJob` com relatório de auditoria.

O score da IA **não sobrepõe** os bloqueios determinísticos. Nenhuma execução publica artigos automaticamente. Links internos não autorizados são retirados da versão rascunho. Quando não há busca web ativa, fontes alegadas pelo modelo não são adicionadas ao corpo do rascunho, e o registro fica em revisão.

## Pesquisa com fontes oficiais e revisão automática

- O código agora usa `app/api/content-agent/evidence.ts` para consultar páginas oficiais previamente autorizadas da **ANPD** e do **MDIC**, sem API paga e sem confiar em URLs sugeridas pelo modelo.
- Toda execução exige pelo menos duas fontes acessíveis e **cobertura de comércio eletrônico e IA/proteção de dados**; ausência de cobertura impede chamadas ao modelo.
- O Verificador recebe um pacote limitado de trechos textuais e precisa devolver `sourceUrl`, `evidenceQuote` literal e contínua da página e `confidence >= 90` para cada fato aprovado. O código compara as citações com as páginas obtidas. Quando há erro, faz **uma única tentativa de correção do fact-check** e descarta fatos não comprovados antes da redação.
- O Editor e o QA recebem somente fatos ainda comprovados após a checagem literal, mais as fontes recuperadas. Links externos gerados pelo modelo que não estiverem no pacote são eliminados do rascunho.
- Se a nota ou o risco editorial falharem **mas os fatos já estiverem fundamentados**, há uma única revisão automática, seguida de novo QA. Se as fontes estiverem insuficientes ou sem lastro, não se permite uma revisão que 'lave' fatos inseguros.
- A checagem de texto comprobatório **não demonstra sozinha a interpretação correta da fonte**. A revisão humana continua obrigatória antes de qualquer publicação.
- Os dois rascunhos históricos (QA 84 e QA 78) não são alterados automaticamente.

## Diagnóstico gratuito de fontes

A chamada `GET /api/content-agent/run?check=evidence`, disponível somente no Preview, consulta os URLs oficiais e retorna cobertura, fontes acessíveis e indisponíveis. Não chama modelos nem grava no Sanity. O autoteste `check=selftest` tem agora **15 verificações determinísticas**.

### Limitação conhecida
Em testes sucessivos, páginas de ANPD e MDIC tiveram disponibilidade intermitente. A consulta agora usa ondas pequenas com páginas alternativas, exige cobertura das duas áreas e interrompe a geração em caso de falta de fontes. Isso não deve ser interpretado como pesquisa web geral e o sistema não deve extrapolar os dados consultados para o mercado inteiro.

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
- `CONTENT_AGENT_MODEL`: opcional. Padrão do piloto: `nvidia/nemotron-3.5-lightning-free`. O modelo `reflection/beam-free` retornou HTTP 403 para a conta atual, apesar do catálogo informar custo zero; disponibilidade de cobrança não equivale a permissão de acesso. Antes de CADA geração, o código exige sufixo `-free` e consulta `/v1/models` para confirmar preços de entrada e saída iguais a zero; em caso de dúvida ou falha de consulta, bloqueia a execução. A checagem de catálogo não garante permissão de uso na conta. **Sem pesquisa web nativa, o QA exige revisão factual humana**.
- `CONTENT_AGENT_AI_ENABLED=true`: **trava financeira obrigatória**, compartilhada por POST e pelo atalho GET. Ausente/desativado por padrão: nenhuma chamada à IA ocorre, mesmo que alguém tente invocar o endpoint diretamente.
- `CONTENT_AGENT_PILOT_ENABLED=true`: habilita temporariamente o gatilho GET no preview somente quando a trava financeira acima também estiver ativada.
- `CONTENT_AGENT_SECRET`: necessário para chamada POST em produção.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET`: projeto e dataset existentes.

## Rotas

- `GET /api/content-agent/run`: exibe status e situação da trava financeira (sem chamar IA).
- `GET /api/content-agent/run?check=selftest`: somente no preview; 15 autotestes determinísticos, sem chamadas de IA e sem gravar no Sanity.
- `GET /api/content-agent/run?check=evidence`: somente no preview; consulta fontes oficiais em tempo real, sem chamadas de IA nem escrita no Sanity.
- `GET /api/content-agent/run?check=model`: somente no preview; verifica catálogo e preço real do modelo gratuito, sem chamadas de geração e sem gravar no Sanity.
- `GET /api/content-agent/run?check=sanity`: somente no preview; grava e remove um registro temporário no Sanity para testar permissões.
- `GET /api/content-agent/run?latest=1`: somente no preview; lê o histórico do último job, sem chamar IA.
- `GET /api/content-agent/run?pilot=1`: somente no preview e com `CONTENT_AGENT_PILOT_ENABLED=true`; **executa IA e pode consumir créditos**.
- `POST /api/content-agent/run`: gera artigo draft; exige segredo no ambiente production.

Após mudar variáveis de ambiente, realizar novo deploy de preview para recarregar os valores.

## Antes de liberar uma nova execução

- [ ] Executar `check=model` para validar o preço do modelo gratuito no catálogo do Vercel AI Gateway.
- [ ] Configurar orçamento e alerta de gastos restritivos antes de usar modelo pago.
- [ ] Verificar os 15 autotestes em `check=selftest` (inclui os três erros jurídicos conhecidos).
- [ ] Conferir o resultado de build do preview.
- [ ] Revisar rascunho, fontes, links, autoria, data, FAQ e informações legais por humano.
- [ ] Manter publicação automática inativa.

## Status do piloto em 21/10/2026

- Primeira geração com pesquisa por fontes oficiais: rascunho criado, QA do modelo 92/100, **bloqueado** por cinco citações sem correspondência literal; nenhuma publicação.
- Motivos: citação que combinava trechos separados e passagens do MDIC não preservadas por completo na extração anterior. A correção posterior passou a preservar HTML inline e validar trechos contínuos mais longos.
- Para investigar: `GET /api/content-agent/run?check=latest-evidence` mostra, no preview protegido, citações e fontes do último job sem gerar conteúdo.
- `CONTENT_AGENT_AI_ENABLED=false` e `CONTENT_AGENT_PILOT_ENABLED=false` devem permanecer como padrão fora de um teste específico. Alterar variáveis exige novo preview; deployments antigos retêm configurações de seu momento de criação.
