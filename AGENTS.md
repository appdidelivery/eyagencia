<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## EYAGENCIA — Deploys livres (25/11/2026)

- Publicações autorizadas em qualquer horário, dia e quantidade, conforme necessidade do trabalho. Não há janelas obrigatórias, limite diário nem espera até o próximo dia útil.
- Git auto-deploy permitido; usar a integração Vercel para publicar alterações quando estiverem prontas. Não criar um segundo build se o mesmo SHA já estiver em fila ou pronto no ambiente desejado.
- Manter verificações técnicas proporcionais: build, segurança, integrações e rollback. Não desativar cron jobs, integrações, autenticação ou proteções de dados para acelerar publicação.
- Conferir status real da publicação no Vercel e informar falhas ou bloqueios. Alterações de dados e CMS não exigem deploy de código.
