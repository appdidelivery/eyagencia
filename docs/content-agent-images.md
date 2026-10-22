# Imagens automáticas do agente de conteúdo

- O agente de imagem só roda depois que o artigo passa por todos os gates editoriais de publicação.
- Modo padrão: `free-svg`, um gerador vetorial próprio da EyAgencia com custo de inferência US$ 0.
- O modo de IA via AI Gateway permanece implementado, porém não é usado enquanto a conta Free não liberar modelos de imagem.
- Se futuramente o modo AI for habilitado, há allowlist e teto rígido de US$ 0,01 por imagem; não existe fallback automático para modelo mais caro.
- A capa é enviada como asset do Sanity e vinculada em `mainImage`, com alt text, metadados do gerador e data.
- Home e /blog usam os posts publicados mais recentes do Sanity; o mais recente vira destaque automaticamente.
- O endpoint de backfill `/api/content-agent/image?slug=...` funciona apenas em Preview para testar ou completar posts já publicados.
