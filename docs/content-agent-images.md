# Imagens automáticas do agente de conteúdo

- O agente de imagem só roda depois que o artigo passa por todos os gates editoriais de publicação.
- Modelo allowlisted: `bfl/flux-3-image-klein`.
- Teto de custo no código: US$ 0,01 por imagem. Não há fallback automático para modelo mais caro.
- A geração usa AI Gateway e o crédito gratuito disponível na conta; falhas não impedem a publicação do artigo.
- A imagem é enviada como asset do Sanity e vinculada em `mainImage`, com alt text, prompt, modelo e data.
- Home e /blog usam os posts publicados mais recentes do Sanity e exibem a capa; sem capa, mostram fallback visual.
- O endpoint de backfill `/api/content-agent/image?slug=...` funciona apenas em Preview para testar posts já publicados.
