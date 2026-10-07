# Google Reputation AI — piloto Patty Centro de Beleza

## Objetivo

Criar um módulo próprio da eYagencia para:
- listar avaliações dos Perfis da Empresa no Google;
- classificar elogio, ressalva, insatisfação e crise;
- reconhecer serviços/profissionais citados;
- sugerir respostas com SEO local, GEO e sinais de experiência/autoridade sem keyword stuffing;
- bloquear publicação automática em reviews de risco.

## Política inicial

- 4–5 estrelas, sem termos de reclamação: pode entrar em automação.
- 3 estrelas: revisão humana.
- 4–5 estrelas com ressalva textual: revisão humana.
- 1–2 estrelas ou termos sensíveis: crise, nunca publicar automaticamente.
- Nunca inventar serviço, profissional, localização ou solução.
- Profissional só é citado quando aparece no review ou quando existe contexto validado.
- Localização é usada com parcimônia, não em todas as respostas.

## Patty Centro de Beleza

Piloto configurado com:
- categoria: salão de beleza;
- cidade: Forquilhinha;
- serviços: corte, escova, progressiva, alisamento, luzes, cachos, transformações, sobrancelhas, manicure, unhas/nails, reflexologia, maquiagem, cílios/lash e estética;
- nomes reconhecidos: Patty/Patrícia, Allegra, Gaby, Geraldine e equipe atual cadastrada no contexto do salão.

## Rotas

- `/reputacao`: painel piloto com simulador ao vivo via AI Gateway.
- `POST /api/reputation/generate`: classifica pelo motor de segurança e gera a redação final via IA, com fallback determinístico.
- `POST /api/reputation/preview`: classifica e gera resposta sem publicar.
- `GET /api/reputation/google/reviews`: lista reviews reais quando OAuth estiver configurado.
- `POST /api/reputation/google/reply`: publica resposta apenas quando o modo deixar e houver confirmação.

## Variáveis de ambiente

- `GOOGLE_GBP_CLIENT_ID`
- `GOOGLE_GBP_CLIENT_SECRET`
- `GOOGLE_GBP_REFRESH_TOKEN`
- `GOOGLE_GBP_ACCOUNT_ID`
- `GOOGLE_GBP_LOCATION_ID`
- `REPUTATION_REPLY_MODE=dry-run` (padrão seguro)
- `AI_GATEWAY_API_KEY` (já disponível no projeto eYagencia)
- `REPUTATION_AI_MODEL` (opcional; padrão do piloto: `alibaba/qwen3.5-flash`)

Para publicar no piloto, alterar `REPUTATION_REPLY_MODE` para outro valor e enviar `confirm: true` no endpoint de reply.

## Google Business Profile API

A integração usa OAuth 2.0 com o escopo `https://www.googleapis.com/auth/business.manage`.

Reviews:
- listar: `GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews`
- responder: `PUT https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply`

O projeto Google Cloud precisa ter acesso aprovado às APIs necessárias antes da conexão real.


## Camada de IA

A decisão de segurança não é delegada ao modelo. Primeiro o motor determinístico classifica nota, termos de reclamação, crise, serviços e profissionais. Só depois a IA pode melhorar a redação.

No piloto:
- reviews de crise não são enviados à IA para publicação automática;
- o modelo padrão é `alibaba/qwen3.5-flash`, escolhido por custo baixo e boa capacidade de texto;
- se o AI Gateway falhar, a resposta volta automaticamente para o template seguro;
- o endpoint mostra se houve uso de IA, modelo utilizado e tokens consumidos.
