export type IAEditorCategory = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  businessQuestion: string;
  metrics: string[];
  related: string[];
};

export type IATool = {
  slug: string;
  name: string;
  company: string;
  categorySlug: string;
  category: string;
  status: string;
  useCase: string;
  bestFor: string;
  practicalUses: string[];
  metrics: string[];
  attention: string[];
  source: string;
  sourceLabel: string;
  reviewedAt: string;
};

export const categories: IAEditorCategory[] = [
  {
    slug: "agentes",
    title: "Agentes e operação",
    description: "Copilotos e agentes que analisam dados, executam tarefas e reduzem trabalho operacional.",
    intro: "Agentes de IA deixam de ser apenas interfaces de resposta quando recebem contexto da operação e permissão para executar ações. No e-commerce, isso pode significar analisar dados, alterar cadastros, apoiar merchandising, orientar equipes ou automatizar fluxos com supervisão humana.",
    businessQuestion: "Quais tarefas repetitivas ou decisões operacionais consomem horas da equipe sem criar diferenciação para o negócio?",
    metrics: ["Horas operacionais economizadas", "Tempo médio para concluir tarefas", "Taxa de correção/retrabalho", "Impacto financeiro por fluxo automatizado"],
    related: ["analytics", "crm", "atendimento"],
  },
  {
    slug: "atendimento",
    title: "Atendimento e vendas",
    description: "Assistentes que respondem dúvidas, recomendam produtos e apoiam pré e pós-venda.",
    intro: "A IA em atendimento já atua em pré-venda e pós-venda, mas o ganho real depende de base de conhecimento, integração com pedidos e regras claras de transferência para humanos. O objetivo não é apenas reduzir tickets: é melhorar resolução, velocidade e conversão sem comprometer confiança.",
    businessQuestion: "Quais dúvidas e solicitações se repetem e quais delas podem ser resolvidas com segurança usando dados da loja?",
    metrics: ["Taxa de resolução automática", "Tempo de primeira resposta", "Conversão assistida", "CSAT/NPS por canal"],
    related: ["crm", "agentes", "personalizacao"],
  },
  {
    slug: "crm",
    title: "CRM e automação",
    description: "IA aplicada a segmentação, jornadas, campanhas, retenção e relacionamento.",
    intro: "Em CRM, a IA ganha valor quando cruza comportamento, histórico de compra e contexto do cliente para priorizar mensagens, recomendações e ações. O ponto central é reduzir comunicação genérica e aumentar relevância ao longo da jornada.",
    businessQuestion: "A operação consegue diferenciar cliente novo, recorrente, inativo e de alto valor com mensagens e ofertas adequadas?",
    metrics: ["Receita por destinatário", "Taxa de recompra", "LTV", "Receita incremental de automações"],
    related: ["personalizacao", "atendimento", "analytics"],
  },
  {
    slug: "busca-descoberta",
    title: "Busca e descoberta",
    description: "Busca semântica, recomendação e descoberta de produtos com intenção mais complexa.",
    intro: "Busca interna e descoberta de produtos estão migrando de correspondência literal para entendimento de intenção. Isso exige catálogo bem estruturado, atributos completos e uma camada de experiência capaz de responder a consultas mais naturais.",
    businessQuestion: "O cliente encontra o produto certo quando pesquisa pelo problema, uso ou intenção — e não apenas pelo nome exato do SKU?",
    metrics: ["Taxa de busca sem resultado", "Conversão após busca", "CTR de resultados", "Receita por sessão com busca"],
    related: ["personalizacao", "seo-geo", "commerce-agentivo"],
  },
  {
    slug: "personalizacao",
    title: "Personalização e CRO",
    description: "Experiências, vitrines e ofertas adaptadas ao comportamento do comprador.",
    intro: "Personalização com IA deve ser tratada como disciplina de conversão, não como decoração. Quanto melhor o dado de produto e comportamento, maior a capacidade de ajustar vitrines, recomendações, bundles e experiências sem perder controle de negócio.",
    businessQuestion: "Quais pontos da jornada têm volume suficiente para testar personalização e medir impacto incremental?",
    metrics: ["Taxa de conversão", "AOV", "Receita por sessão", "Uplift de testes controlados"],
    related: ["analytics", "crm", "busca-descoberta"],
  },
  {
    slug: "ads",
    title: "Ads e aquisição",
    description: "Otimização de mídia, criativos, segmentação e Shopping com modelos de IA.",
    intro: "A IA já está embutida nas principais plataformas de mídia. Para e-commerce, o diferencial passa a ser a qualidade do feed, dos criativos, da mensuração e das páginas de destino — os insumos usados pelos modelos para decidir onde e como distribuir investimento.",
    businessQuestion: "Seu feed, tracking e conteúdo dão aos algoritmos sinais suficientes para otimizar por margem e valor, e não apenas por volume?",
    metrics: ["ROAS/POAS", "CPA", "Valor de conversão", "Margem após mídia"],
    related: ["analytics", "seo-geo", "imagem-video"],
  },
  {
    slug: "seo-geo",
    title: "Conteúdo, SEO e GEO",
    description: "Conteúdo, catálogo e estrutura técnica preparados para busca tradicional e respostas de IA.",
    intro: "SEO e GEO convergem em um princípio: tornar produtos, categorias e expertise compreensíveis por mecanismos de busca e sistemas generativos. Isso depende de conteúdo útil, entidades consistentes, arquitetura interna, dados estruturados e fontes confiáveis.",
    businessQuestion: "Seu site explica claramente o que vende, para quem, com quais atributos e por que sua informação merece ser usada como referência?",
    metrics: ["Cliques orgânicos qualificados", "Cobertura de páginas indexáveis", "Conversões orgânicas", "Menções/citações em experiências generativas"],
    related: ["busca-descoberta", "commerce-agentivo", "analytics"],
  },
  {
    slug: "imagem-video",
    title: "Imagem e vídeo",
    description: "Criação e edição de ativos de produto, anúncios e conteúdo em escala.",
    intro: "IA generativa reduz o custo de produção criativa, mas a vantagem real aparece quando existe direção de marca, revisão humana e um sistema para transformar ativos em variações testáveis de mídia e catálogo.",
    businessQuestion: "Quais ativos hoje atrasam campanhas, lançamentos ou atualização de catálogo e podem ser produzidos com supervisão em menos tempo?",
    metrics: ["Tempo por ativo", "Custo por variação", "CTR por criativo", "Taxa de aprovação/revisão"],
    related: ["ads", "seo-geo", "personalizacao"],
  },
  {
    slug: "analytics",
    title: "Analytics e BI",
    description: "Leitura de dados, detecção de padrões e apoio à tomada de decisão.",
    intro: "O maior ganho de IA em analytics não é criar mais dashboards, mas encurtar o caminho entre dado, hipótese e ação. A base precisa continuar confiável: eventos, receita, margem, canais e definições devem estar consistentes antes da camada de IA.",
    businessQuestion: "Quanto tempo leva entre perceber uma anomalia e chegar a uma decisão operacional com evidência suficiente?",
    metrics: ["Tempo para insight", "Cobertura de tracking", "Erro entre fontes", "Valor financeiro das ações geradas"],
    related: ["ads", "personalizacao", "agentes"],
  },
  {
    slug: "precificacao",
    title: "Precificação",
    description: "Monitoramento competitivo e suporte algorítmico a decisões de preço.",
    intro: "IA e automação podem apoiar monitoramento de concorrência e regras de preço, mas precisam respeitar margem, estoque, posicionamento e restrições comerciais. O objetivo é aumentar qualidade da decisão, não reagir automaticamente a qualquer movimento externo.",
    businessQuestion: "A operação consegue responder a mudanças de preço e estoque sem sacrificar margem ou posicionamento?",
    metrics: ["Margem bruta", "Índice de competitividade", "Giro de estoque", "Receita incremental por regra"],
    related: ["analytics", "logistica", "personalizacao"],
  },
  {
    slug: "logistica",
    title: "Logística e operação",
    description: "Previsão, roteirização, atendimento operacional e automação de backoffice.",
    intro: "Em logística, IA funciona melhor quando conectada a dados reais de demanda, estoque, SLA e custo. Casos de uso incluem previsão, exceções operacionais, suporte interno e priorização de tarefas.",
    businessQuestion: "Quais decisões logísticas ainda dependem de planilhas, conferência manual ou reação tardia a exceções?",
    metrics: ["OTIF/SLA", "Custo por pedido", "Ruptura", "Tempo de resolução de exceções"],
    related: ["analytics", "precificacao", "agentes"],
  },
  {
    slug: "commerce-agentivo",
    title: "Commerce agentivo",
    description: "Produtos descobertos, comparados e comprados dentro de interfaces conversacionais.",
    intro: "No commerce agentivo, agentes e interfaces conversacionais passam a participar da descoberta, comparação e, em alguns fluxos, da própria compra. Isso muda a prioridade do lojista: catálogo, disponibilidade, preço, metadados e autoridade precisam ser legíveis por sistemas além da interface tradicional da loja.",
    businessQuestion: "Seu catálogo está estruturado para ser entendido e atualizado fora do front-end tradicional da loja?",
    metrics: ["Cobertura de feed", "Qualidade dos atributos", "Sessões/conversões vindas de novos canais", "Atualização e consistência de preço/estoque"],
    related: ["seo-geo", "busca-descoberta", "agentes"],
  },
];

export const tools: IATool[] = [
  {
    slug: "chatgpt-shopping",
    name: "ChatGPT Shopping e Product Feeds",
    company: "OpenAI",
    categorySlug: "commerce-agentivo",
    category: "Commerce agentivo",
    status: "Descoberta de produtos e integração de catálogo",
    useCase: "Produtos podem aparecer em experiências de compra do ChatGPT a partir de metadados de comerciantes e produtos. Comerciantes elegíveis também podem fornecer feeds diretos para manter informações atualizadas.",
    bestFor: "Lojistas que querem preparar catálogo, disponibilidade, preço e metadados para novos canais de descoberta e compra assistida por IA.",
    practicalUses: ["Revisar qualidade de título, descrição e atributos de produto", "Garantir consistência de preço e disponibilidade", "Avaliar elegibilidade e integração de feeds", "Medir tráfego e conversões vindas de experiências de IA"],
    metrics: ["Cobertura do catálogo", "Atualização de preço/estoque", "Sessões assistidas por IA", "Conversão por origem"],
    attention: ["Resultados de compras são independentes de anúncios", "Disponibilidade de recursos e integrações pode variar por mercado e elegibilidade", "Feeds não substituem qualidade técnica e editorial das páginas de produto"],
    source: "https://help.openai.com/pt-br/articles/11128490-shopping-with-chatgpt-search",
    sourceLabel: "OpenAI Help Center — Compras com a Busca do ChatGPT",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "shopify-sidekick",
    name: "Sidekick",
    company: "Shopify",
    categorySlug: "agentes",
    category: "Agentes e operação",
    status: "Assistente de IA nativo do admin Shopify",
    useCase: "O Sidekick usa o contexto da loja para responder perguntas, analisar dados, gerar conteúdo, editar produtos, gerenciar pedidos e apoiar tarefas dentro do admin da Shopify.",
    bestFor: "Operações Shopify que querem reduzir trabalho manual e acelerar análise e execução sem sair do ambiente da plataforma.",
    practicalUses: ["Analisar indicadores e contexto da loja", "Editar produtos e conteúdo", "Apoiar gerenciamento de pedidos", "Criar apps e habilidades para rotinas recorrentes"],
    metrics: ["Horas economizadas", "Tempo por tarefa", "Retrabalho após revisão", "Número de fluxos recorrentes automatizados"],
    attention: ["Mudanças devem ser revisadas antes da aplicação", "Permissões e acesso a dados precisam ser controlados", "Resultados de IA podem conter erros e exigem validação"],
    source: "https://help.shopify.com/pt-BR/manual/ai-powered-tools/sidekick",
    sourceLabel: "Shopify Help Center — Sidekick",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "shopify-magic",
    name: "Shopify Magic",
    company: "Shopify",
    categorySlug: "imagem-video",
    category: "Conteúdo, imagem e mídia",
    status: "Suite de recursos de IA da Shopify",
    useCase: "O Shopify Magic reúne recursos para criar descrições, e-mails, páginas, respostas e mídia, além de apoiar geração e edição de ativos no admin.",
    bestFor: "Times que precisam acelerar produção de catálogo e comunicação mantendo revisão editorial e direção de marca.",
    practicalUses: ["Descrições de produto e páginas", "E-mails e respostas", "Edição e geração de mídia", "Blocos e temas com assistência de IA"],
    metrics: ["Tempo de produção", "Taxa de aprovação", "CTR por ativo", "Conversão das páginas atualizadas"],
    attention: ["Conteúdo deve ser revisado antes da publicação", "Consistência de marca precisa ser definida fora da ferramenta", "Geração em escala sem revisão pode criar conteúdo repetitivo"],
    source: "https://help.shopify.com/pt-BR/manual/ai-powered-tools/shopify-magic",
    sourceLabel: "Shopify Help Center — Shopify Magic",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "klaviyo-customer-agent",
    name: "K:AI Customer Agent",
    company: "Klaviyo",
    categorySlug: "crm",
    category: "CRM e atendimento",
    status: "Agente de experiência do cliente",
    useCase: "A Klaviyo posiciona o K:AI Customer Agent como assistente 24/7 treinado com storefront e dados de clientes para responder perguntas, recomendar produtos e resolver solicitações em múltiplos canais.",
    bestFor: "Marcas com operação de CRM madura e necessidade de integrar atendimento, recomendação e contexto do cliente.",
    practicalUses: ["Responder dúvidas de pré-venda", "Recomendar produtos com contexto", "Apoiar pós-venda", "Conectar atendimento a dados de relacionamento"],
    metrics: ["Conversão assistida", "Receita por contato", "Resolução automática", "Taxa de recompra"],
    attention: ["Disponibilidade por idioma e canal pode variar", "Dados de cliente exigem governança e consentimento adequados", "Automação deve preservar critérios claros de handoff humano"],
    source: "https://www.klaviyo.com/products/customer-experience-hub/ecommerce-cx",
    sourceLabel: "Klaviyo — Ecommerce Customer Experience / K:AI",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "gorgias-ai-agent",
    name: "AI Agent",
    company: "Gorgias",
    categorySlug: "atendimento",
    category: "Atendimento e vendas",
    status: "Agente de suporte e shopping assistant",
    useCase: "O AI Agent da Gorgias atua em pré-venda e pós-venda, pode responder em diferentes canais e executar ações configuradas em ferramentas conectadas.",
    bestFor: "E-commerces Shopify com volume relevante de atendimento e oportunidade de automatizar dúvidas e ações repetitivas.",
    practicalUses: ["Rastreio e dúvidas de pedido", "Retornos e cancelamentos com regras", "Descoberta de produtos", "Handoff para equipe humana"],
    metrics: ["Taxa de resolução", "Tempo de resposta", "Conversão assistida", "Taxa de handoff"],
    attention: ["Alguns canais e recursos podem estar em beta", "Ações precisam ser explicitamente configuradas", "Monitoramento contínuo dos tickets é parte da operação"],
    source: "https://helpcenter.gorgias.com/en-US/ai-agent-explained-497772",
    sourceLabel: "Gorgias Help Center — AI Agent explained",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "nosto-huginn",
    name: "experience.AI + Huginn",
    company: "Nosto",
    categorySlug: "personalizacao",
    category: "Personalização e CRO",
    status: "Plataforma de experiência e agente central",
    useCase: "A Nosto usa experience.AI para ativar dados de cliente, produto e conteúdo em personalização, busca e merchandising; Huginn coordena agentes e oportunidades em fluxos de commerce experience.",
    bestFor: "Operações com tráfego e catálogo suficientes para testar personalização, merchandising, busca e otimização em escala.",
    practicalUses: ["Personalização onsite", "Merchandising e busca", "Bundles e recomendações", "Oportunidades e insights acionáveis"],
    metrics: ["Uplift de conversão", "AOV", "Receita por sessão", "Performance de testes"],
    attention: ["Resultados dependem de volume e qualidade de dados", "Recomendações precisam ser testadas contra baseline", "Nem todo recurso agente está necessariamente disponível no mesmo estágio para todas as contas"],
    source: "https://www.nosto.com/agentic-commerce/",
    sourceLabel: "Nosto — Agentic Commerce / Huginn",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "google-ai-max-shopping",
    name: "IA Max para campanhas do Shopping",
    company: "Google Ads",
    categorySlug: "ads",
    category: "Ads e aquisição",
    status: "Beta em 2026",
    useCase: "A IA Max para Shopping usa recursos de IA do Google para ampliar relevância de criativos, termos e páginas de destino em pesquisas de compra complexas e conversacionais.",
    bestFor: "Varejistas com Merchant Center, feed bem estruturado e mensuração suficiente para avaliar ganho incremental com controle de CPA, ROAS e margem.",
    practicalUses: ["Personalização de texto", "Expansão de URL final", "Cobertura de consultas de cauda longa", "Relatórios de termos, títulos e páginas de destino"],
    metrics: ["Valor de conversão", "CPA", "ROAS", "Margem após mídia"],
    attention: ["O recurso permanece beta", "É importante observar período de aprendizado antes de mudanças frequentes", "Ganho de volume não deve ser analisado sem margem e qualidade das conversões"],
    source: "https://support.google.com/google-ads/answer/17091277?hl=pt-BR",
    sourceLabel: "Google Ads Help — IA Max para Shopping",
    reviewedAt: "29/09/2026",
  },
  {
    slug: "adobe-product-recommendations",
    name: "Product Recommendations",
    company: "Adobe Commerce",
    categorySlug: "personalizacao",
    category: "Personalização e recomendação",
    status: "Recomendações com Adobe AI",
    useCase: "O Adobe Commerce Product Recommendations usa Adobe AI e machine learning sobre comportamento agregado de compradores e dados do catálogo para gerar recomendações personalizadas na vitrine.",
    bestFor: "Operações Adobe Commerce que querem automatizar recomendação, cross-sell e up-sell com integração ao catálogo e à experiência da loja.",
    practicalUses: ["Recommended for you", "Cross-sell e up-sell", "Recomendações por comportamento", "Otimização por página e contexto"],
    metrics: ["Receita atribuída", "CTR de recomendações", "AOV", "Conversão por unidade de recomendação"],
    attention: ["A Adobe recomenda experimentar tipos e posicionamentos", "Privacidade e restrições do serviço precisam ser revisadas", "A recomendação deve complementar — não substituir — estratégia de merchandising"],
    source: "https://experienceleague.adobe.com/pt-br/docs/commerce/product-recommendations/overview",
    sourceLabel: "Adobe Experience League — Product Recommendations",
    reviewedAt: "29/09/2026",
  },
];

export const faqs = [
  {
    q: "Qual é a melhor IA para e-commerce em 2026?",
    a: "Não existe uma única ferramenta melhor para todas as operações. A escolha depende do gargalo: aquisição, atendimento, CRM, conteúdo, personalização, dados ou operação. O critério correto é impacto mensurável no negócio, compatibilidade com o stack e capacidade de governança.",
  },
  {
    q: "IA substitui a plataforma de e-commerce?",
    a: "Na maioria dos casos, não. A IA funciona como uma camada de inteligência sobre a plataforma, o catálogo, os dados e os canais de aquisição e relacionamento.",
  },
  {
    q: "O que é commerce agentivo?",
    a: "É um modelo em que agentes de IA participam diretamente da jornada de compra: entendem intenção, pesquisam, comparam, recomendam produtos e, em alguns fluxos, ajudam a concluir a transação.",
  },
  {
    q: "Como saber por onde começar?",
    a: "Comece pelo maior gargalo mensurável da operação. Atendimento alto, CAC crescente, baixa conversão, produção lenta de conteúdo e pouca retenção exigem ferramentas e integrações diferentes.",
  },
];

export const editorial = {
  updatedAt: "29/09/2026",
  publisher: "EyAgencia",
  methodology:
    "Selecionamos tecnologias com aplicação direta em e-commerce e priorizamos documentação oficial, disponibilidade verificável, clareza sobre limitações e potencial de impacto mensurável. Não usamos posição em listas pagas como critério editorial.",
};
