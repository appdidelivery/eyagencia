# CRM privado EYAGENCIA

Rota /admin. Login pelo Firebase Auth existente; API /api/admin/crm valida ID token com Identity Toolkit e lista restrita de administradores server-side. Nenhum cliente real no repositório público. Os registros ficam em um Vercel Blob privado vinculado exclusivamente ao projeto, com inicialização idempotente via variável sensível de produção e atualização condicional ETag. As regras Firestore anteriores não são utilizadas por esta versão.

Configuração: BLOB_READ_WRITE_TOKEN do store privado, EY_CRM_ADMIN_EMAILS e EY_CRM_INITIAL_DATA exclusivamente server-side, configurações públicas Firebase existentes. Habilitar Google provider e domínio autorizado no console Firebase se necessário. Testar acesso anônimo 401, conta Google não autorizada 403, entrada da conta permitida, gravação/recarga e concorrência (409). Não registrar valores reais como recebidos sem comprovante. O cadastro inicial inclui referências de valores históricos e projetos pendentes, não equivale a receita confirmada. Cobrança/assinatura ainda são controles manuais.

Não imprimir variáveis nem payloads em logs. Não expor a base em JSON público, analytics ou HTML pré-renderizado. Não reutilizar tokens de outras aplicações. A base usa snapshot JSON com controle otimista, adequado à operação administrativa inicial; migrar para banco transacional se volume ou concorrência crescer.
