# CRM interno da EYAGENCIA — primeira etapa

Rota /admin, protegida por Firebase Auth (Google) e custom claim administrativa. A interface fica indisponível por padrão. Não há dados de clientes, credenciais ou links privados no repositório público.

## Configuração e bloqueios antes de produção
- Usar projeto Firebase **dedicado ao CRM**, sem reutilizar banco público nem regras permissivas. Antes de configurar produção, confirmar se não existe base anterior em outro projeto ou serviço.
- Configurar Google Auth e domínios autorizados. Conceder custom claim `ey_crm_admin: true` somente a UID de administrador verificado, por ambiente seguro com SDK Admin; não autorizar somente pelo e-mail informado na interface.
- Aplicar e testar `crm/firestore.rules` no projeto dedicado. Não substituir regras de outros projetos. Bloquear todas as outras coleções por padrão e não criar regras sobrepostas permissivas.
- Variáveis públicas específicas: NEXT_PUBLIC_EY_CRM_FIREBASE_API_KEY, NEXT_PUBLIC_EY_CRM_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_EY_CRM_FIREBASE_PROJECT_ID, NEXT_PUBLIC_EY_CRM_FIREBASE_APP_ID. Após homologação, NEXT_PUBLIC_EY_CRM_ENABLED=true. Estas configurações Firebase não substituem regras de segurança.
- Acessar /admin diretamente (navegação completa). Verificar ausência de GTM e demais trackers na área, inclusive em navegação interna, e cabeçalhos de cache. Se houver vazamento de analytics, isolar origem/layout antes de dados reais.
- Testar em emulador e ambiente isolado: usuário anônimo, Google sem claim, administrador, claim removida, registro de outra coleção, criação/edição, campos extras, cliente inexistente, exclusão negada, atualização de timestamp, documentos privados, logout e recarga.
- Validar build e regressão de site/blog; publicar em qualquer horário; validar a segurança antes de ativar dados reais.
- Após segurança aprovada, cadastrar um cliente real no painel, vincular contrato do Drive com permissões restritas, cadastrar cobranças previstas e checklist. Não registrar pagamento recebido sem comprovante nem publicar links privados.

## Limitações desta etapa
CRUD de criação/edição sem exclusão, seis tipos de registro, vínculo por cliente, valor em centavos, status, data, unidade, URL e observações. Não implementa faturamento automático, PIX real, assinatura eletrônica, exportação, anexos binários, trilha completa de alterações ou conciliação; esses itens são etapas futuras. O status de pagamento é manual. As métricas não são receita contábil. Não armazenar CPF, dados bancários ou senhas em observações. 
