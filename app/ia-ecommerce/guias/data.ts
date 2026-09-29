export type GuideSource = {
  label: string;
  url: string;
};

export type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type IAGuide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updatedAt: string;
  readTime: string;
  intro: string;
  keyTakeaways: string[];
  sections: GuideSection[];
  relatedTools: string[];
  relatedCategories: string[];
  sources: GuideSource[];
};

export const guides: IAGuide[] = [
  {
    slug: "ia-nuvemshop-2026",
    title: "IA na Nuvemshop em 2026: Lumi, MCP e operação conversacional",
    description:
      "Como o Lumi e os conectores MCP da Nuvemshop mudam catálogo, pedidos, conteúdo, análise e operação — e onde ainda é preciso manter supervisão humana.",
    eyebrow: "Guia prático • Nuvemshop",
    updatedAt: "29/09/2026",
    readTime: "8 min",
    intro:
      "A Nuvemshop deixou de tratar IA apenas como gerador de texto. Em 2026, o Lumi trabalha com dados reais da loja e a plataforma também oferece conectores baseados em MCP para que ferramentas compatíveis consultem e executem ações na operação. Isso muda a pergunta do lojista: em vez de “qual IA eu uso?”, passa a ser “quais rotinas posso delegar com segurança e como vou medir o ganho?”.",
    keyTakeaways: [
      "Lumi usa contexto da própria loja, incluindo produtos, pedidos e métricas.",
      "O conector MCP permite operar a loja por linguagem natural em ferramentas compatíveis.",
      "Ações de escrita precisam de governança: aprovação, permissões e revisão continuam essenciais.",
      "O melhor ponto de partida é uma rotina repetitiva com impacto mensurável, não uma automação ampla.",
    ],
    sections: [
      {
        title: "O que já mudou na prática",
        paragraphs: [
          "O Lumi está integrado ao painel da Nuvemshop e pode responder perguntas sobre a operação, apoiar análises e criar ou revisar conteúdo. Isso reduz a distância entre dado e ação: o lojista não precisa necessariamente exportar informações para uma ferramenta externa antes de começar a investigar um problema.",
          "Em paralelo, o conector da Nuvemshop usa o padrão MCP para criar uma ponte entre a loja e ferramentas de IA compatíveis. A própria documentação da plataforma descreve consultas e ações sobre catálogo, pedidos, clientes e outros recursos da operação."
        ],
        bullets: [
          "Consultar vendas, pedidos e desempenho em linguagem natural.",
          "Criar ou revisar descrições de produto e textos de SEO.",
          "Atualizar catálogo, preços e estoque com aprovação configurável.",
          "Usar ferramentas de IA externas sem compartilhar a senha da loja."
        ]
      },
      {
        title: "Onde um e-commerce deve começar",
        paragraphs: [
          "Começar pela automação mais chamativa tende a gerar mais risco do que ganho. A primeira rotina deve ter três características: volume repetitivo, regra clara e resultado verificável.",
          "Cadastro de produtos, revisão de descrições, consulta de pedidos e consolidação de indicadores costumam ser melhores pilotos do que mudanças automáticas de preço, exclusões de catálogo ou alterações estruturais em massa."
        ],
        bullets: [
          "Defina o tempo gasto hoje na tarefa.",
          "Defina quais campos ou decisões podem ser executados sem ambiguidade.",
          "Mantenha aprovação humana para escrita até a taxa de erro ficar conhecida.",
          "Compare tempo, retrabalho e impacto comercial depois de algumas semanas."
        ]
      },
      {
        title: "MCP não elimina governança",
        paragraphs: [
          "O ganho do MCP é dar contexto e capacidade de ação a uma IA sem criar uma integração proprietária para cada interface. Isso não transforma qualquer instrução em uma ação segura por padrão.",
          "A Nuvemshop diferencia ações de leitura de ações como criar, editar, excluir ou publicar. O nível de confiança pode ser configurado por ferramenta. Para uma agência ou operação com várias pessoas, essa camada de permissão deve ser tratada como parte da arquitetura, não como detalhe técnico."
        ]
      },
      {
        title: "O que medir",
        paragraphs: [
          "O retorno deve aparecer em produtividade ou resultado comercial. Se a automação apenas desloca trabalho para uma etapa de revisão mais demorada, ela não está funcionando."
        ],
        bullets: [
          "Minutos por cadastro ou atualização de produto.",
          "Percentual de conteúdo aprovado sem retrabalho.",
          "Tempo para responder perguntas operacionais.",
          "Quantidade de ações assistidas por IA por semana.",
          "Conversão e receita das páginas que receberam melhorias."
        ]
      }
    ],
    relatedTools: ["nuvemshop-lumi-mcp"],
    relatedCategories: ["agentes", "seo-geo", "analytics"],
    sources: [
      {
        label: "Nuvemshop — O que é o Lumi e como ele ajuda na gestão da loja",
        url: "https://atendimento.nuvemshop.com.br/pt_BR/conheca-o-lumi/o-que-e-o-lumi-e-como-ele-ajuda-na-gestao-da-loja-nuvemshop"
      },
      {
        label: "Nuvemshop — MCP e conectores de IA",
        url: "https://www.nuvemshop.com.br/ia/mcp"
      },
      {
        label: "Nuvemshop — Gerenciar a loja com ferramentas de IA",
        url: "https://atendimento.nuvemshop.com.br/pt_BR/conectores-de-ia/como-gerenciar-sua-loja-nuvemshop-com-ferramentas-de-ia-sem-entrar-no-administrador"
      }
    ]
  },
  {
    slug: "ia-tray-2026",
    title: "IA na Tray em 2026: como usar o Tray Pulse sem cair em automação genérica",
    description:
      "Um roteiro para aplicar Tray Pulse em cadastro, SEO, páginas, marketplaces e marketing mantendo revisão editorial, métricas e consistência de marca.",
    eyebrow: "Guia prático • Tray",
    updatedAt: "29/09/2026",
    readTime: "7 min",
    intro:
      "O Tray Pulse concentra recursos de IA dentro da própria plataforma: descrição de produtos, campos de SEO, criação de páginas e apoio à operação de marketplaces e campanhas. O ganho potencial é grande para catálogos extensos, mas só aparece quando a automação recebe padrões editoriais e indicadores claros.",
    keyTakeaways: [
      "Tray Pulse reduz fricção de produção porque opera dentro do painel da loja.",
      "SEO automático precisa de padrão editorial e revisão para evitar páginas repetitivas.",
      "Catálogo e marketplace são bons casos de uso quando existe regra de cadastro consistente.",
      "A métrica certa não é “quantos textos a IA fez”, e sim tempo, qualidade, conversão e retrabalho."
    ],
    sections: [
      {
        title: "O que o Tray Pulse resolve",
        paragraphs: [
          "A proposta do Pulse é reduzir tarefas operacionais que normalmente exigem copiar dados entre ferramentas. A documentação pública da Tray destaca geração de descrições, preenchimento de metatitle, meta description, palavras-chave e URL, além de criação de landing pages e recursos voltados a marketplaces.",
          "Isso faz sentido principalmente quando o lojista já tem um grande volume de SKUs e uma equipe enxuta. O benefício vem da padronização e da velocidade — não da simples substituição do trabalho editorial."
        ]
      },
      {
        title: "SEO em escala sem criar conteúdo raso",
        paragraphs: [
          "Gerar metadados para milhares de produtos é simples. Gerar páginas que realmente diferenciam um produto de outro é mais difícil. O processo precisa começar com regras por categoria, atributos obrigatórios, intenção de busca e diferenças reais entre SKUs.",
          "Para a EyAgencia, a IA deve preencher estrutura repetitiva e acelerar primeira versão; a revisão deve preservar especificações, linguagem de categoria, links internos e informações que ajudam o comprador a decidir."
        ],
        bullets: [
          "Template diferente por categoria, não um prompt único para a loja inteira.",
          "Atributos técnicos puxados de dados reais do produto.",
          "Metatitle e description sem repetição desnecessária.",
          "Links internos para categoria, subcategoria e conteúdos relacionados.",
          "Revisão por amostragem antes de processar lotes maiores."
        ]
      },
      {
        title: "Marketplace: velocidade com controle",
        paragraphs: [
          "O uso de IA em marketplace é valioso para enriquecer títulos, descrições e atributos, mas cada canal possui regras próprias. A automação precisa validar limites, campos obrigatórios e consistência entre o cadastro da loja e o anúncio publicado.",
          "Uma boa operação mede rejeição de anúncios, tempo de publicação e divergência de informação entre canais. Se a IA aumenta volume, mas também aumenta rejeições, o ganho operacional desaparece."
        ]
      },
      {
        title: "Como testar em uma sprint de 30 dias",
        paragraphs: [
          "Escolha uma categoria com volume suficiente e histórico de conversão. Aplique o Pulse a um conjunto controlado de produtos e mantenha um grupo comparável sem alteração para observar ganho de produtividade e qualquer mudança de desempenho."
        ],
        bullets: [
          "Semana 1: padrões de cadastro e baseline.",
          "Semana 2: lote piloto e revisão de qualidade.",
          "Semana 3: ampliar volume e medir rejeições/retrabalho.",
          "Semana 4: comparar conversão, tempo e eficiência operacional."
        ]
      }
    ],
    relatedTools: ["tray-pulse"],
    relatedCategories: ["agentes", "seo-geo", "imagem-video"],
    sources: [
      {
        label: "Tray — Tray Pulse",
        url: "https://tray.com.br/tray-pulse"
      }
    ]
  },
  {
    slug: "medir-trafego-ia-ga4",
    title: "Como medir tráfego do ChatGPT e outros assistentes de IA no GA4 em 2026",
    description:
      "O Google Analytics agora identifica um canal de Assistente de IA. Veja o que mudou, como analisar origem, sessão e conversão e quais limitações ainda existem.",
    eyebrow: "Medição • GA4",
    updatedAt: "29/09/2026",
    readTime: "9 min",
    intro:
      "Desde maio de 2026, o Google Analytics passou a ter uma classificação dedicada para tráfego vindo de assistentes de IA. Para e-commerce, isso permite finalmente separar parte das visitas originadas em ChatGPT, Gemini, Claude e outras interfaces do tráfego de referência genérico — e comparar esse público com busca, mídia e outros canais.",
    keyTakeaways: [
      "O GA4 introduziu o canal padrão “Assistente de IA” em 2026.",
      "Quando o referenciador é reconhecido, a mídia pode ser classificada como ai-assistant.",
      "A análise deve combinar sessões, receita, conversão, AOV e landing pages.",
      "Nem toda interação com IA gera clique ou referenciador; o canal mede tráfego observável, não toda a influência da IA."
    ],
    sections: [
      {
        title: "O que o Google Analytics passou a classificar",
        paragraphs: [
          "A atualização anunciada em 13 de maio de 2026 adicionou uma maneira dedicada de medir tráfego de assistentes de IA. Quando o referenciador corresponde a uma fonte reconhecida, o GA4 classifica a visita no canal Assistente de IA, usa a mídia ai-assistant e identifica a campanha como (ai-assistant).",
          "A documentação de grupos de canais cita fontes como ChatGPT, Gemini, Deepseek, Copilot e Grok. A lista e a lógica podem evoluir, então vale acompanhar o changelog do Analytics."
        ]
      },
      {
        title: "Relatório mínimo para um e-commerce",
        paragraphs: [
          "A pergunta importante não é apenas quantas visitas vieram de IA. O objetivo é entender se esse tráfego chega em páginas de produto ou conteúdo, se engaja e se participa de receita."
        ],
        bullets: [
          "Sessões por grupo de canais da sessão.",
          "Origem da sessão e mídia da sessão.",
          "Landing page.",
          "Compras, receita e taxa de conversão.",
          "Receita por sessão e ticket médio.",
          "Novo x recorrente, quando fizer sentido para a análise."
        ]
      },
      {
        title: "Como interpretar sem superestimar o canal",
        paragraphs: [
          "Assistentes de IA podem influenciar uma decisão sem gerar um clique mensurável. O usuário pode ler uma recomendação, memorizar a marca e voltar depois por busca, acesso direto ou outro canal. O GA4 registra a sessão observável; ele não mede toda a exposição dentro das respostas de IA.",
          "Por isso, crescimento de menções e crescimento do canal Assistente de IA devem ser acompanhados juntos, mas não tratados como a mesma métrica."
        ]
      },
      {
        title: "E se sua propriedade ainda usa um grupo personalizado antigo?",
        paragraphs: [
          "Antes da classificação padrão, muitas equipes criavam canais personalizados usando regex para identificar domínios de assistentes. O Google mantém documentação para esse tipo de configuração.",
          "Em propriedades já atualizadas, revise a regra customizada para evitar dupla interpretação e documente qual dimensão é usada em cada dashboard."
        ]
      }
    ],
    relatedTools: ["google-analytics-ask-advisor", "semrush-ai-visibility"],
    relatedCategories: ["analytics", "seo-geo"],
    sources: [
      {
        label: "Google Analytics — Novidades: medição de tráfego de assistentes de IA",
        url: "https://support.google.com/analytics/answer/9164320?hl=pt-BR"
      },
      {
        label: "Google Analytics — Grupo de canais padrão",
        url: "https://support.google.com/analytics/answer/9756891?hl=pt-BR"
      },
      {
        label: "Google Analytics — Grupos de canais personalizados",
        url: "https://support.google.com/analytics/answer/13051316?hl=pt-BR"
      },
      {
        label: "Google Analytics — Ask Advisor (Beta)",
        url: "https://support.google.com/analytics/answer/16675569?hl=pt-BR"
      }
    ]
  },
  {
    slug: "geo-para-ecommerce",
    title: "GEO para E-commerce em 2026: como tornar catálogo e conteúdo compreensíveis por sistemas de IA",
    description:
      "GEO aplicado a e-commerce: arquitetura, entidades, dados de produto, fontes, conteúdo e mensuração para aumentar a legibilidade da marca em experiências generativas.",
    eyebrow: "Estratégia • GEO",
    updatedAt: "29/09/2026",
    readTime: "10 min",
    intro:
      "GEO não é escrever para robôs nem repetir palavras-chave em páginas de produto. Em e-commerce, a disciplina começa pela qualidade da informação que descreve a loja: produtos, atributos, disponibilidade, marca, políticas, conteúdo editorial e relações entre páginas. Sistemas generativos precisam conseguir entender essas entidades e confiar que a informação está atualizada.",
    keyTakeaways: [
      "Produto bem estruturado é parte de GEO, não apenas conteúdo de blog.",
      "Informação atualizada de preço e disponibilidade ganhou importância em canais de compra por IA.",
      "Fontes primárias, autoria editorial e consistência entre páginas ajudam a reduzir ambiguidade.",
      "GEO deve ser medido com visibilidade em respostas, tráfego de assistentes e resultado comercial."
    ],
    sections: [
      {
        title: "Comece pelo catálogo, não pelo artigo",
        paragraphs: [
          "A documentação de commerce da OpenAI exige campos estruturados como id, título, descrição, link, imagem, disponibilidade, preço e marca para feeds compatíveis. Mesmo fora de um feed direto, esse princípio é útil: um produto precisa ter identidade, atributos e estado comercial claros.",
          "Para um e-commerce, GEO começa quando categoria, PDP, feed e dados estruturados contam a mesma história sobre o produto."
        ],
        bullets: [
          "Título específico e consistente.",
          "Descrição útil, sem texto genérico repetido.",
          "Marca, variante, tamanho, cor e atributos técnicos quando aplicável.",
          "Preço e disponibilidade atualizados.",
          "Imagem principal coerente com o item.",
          "Canonical, breadcrumbs e relações de categoria bem definidas."
        ]
      },
      {
        title: "Conteúdo editorial precisa acrescentar contexto",
        paragraphs: [
          "Um artigo só cria autoridade quando responde algo que a página de produto não consegue responder sozinha: comparação de uso, critérios de escolha, manutenção, compatibilidade, contexto de mercado ou metodologia.",
          "O objetivo é construir um grafo de informação: conteúdos explicam conceitos; categorias organizam intenção; produtos resolvem a compra; metodologia e fontes mostram como a informação foi produzida."
        ]
      },
      {
        title: "E-E-A-T como estrutura operacional",
        paragraphs: [
          "Para a EyAgencia, E-E-A-T não é um bloco decorativo de autor. Ele aparece na data de revisão, na transparência sobre limitações, na fonte utilizada, em exemplos reais e na consistência entre o que a empresa afirma e o que consegue demonstrar.",
          "Quando um recurso está em beta, é indicado como beta. Quando uma plataforma altera documentação, a página precisa ser revisada. Essa disciplina evita conteúdo desatualizado sendo tratado como verdade presente."
        ]
      },
      {
        title: "Como medir GEO sem inventar uma métrica única",
        paragraphs: [
          "Não existe uma métrica universal que represente toda a presença de uma marca em sistemas generativos. O caminho mais confiável é combinar sinais."
        ],
        bullets: [
          "Menções e citações monitoradas por ferramentas especializadas.",
          "Páginas que aparecem como fonte em respostas.",
          "Tráfego do canal Assistente de IA no GA4.",
          "Conversão e receita desse tráfego.",
          "Cobertura de páginas de produto e categoria tecnicamente indexáveis."
        ]
      }
    ],
    relatedTools: ["chatgpt-shopping", "semrush-ai-visibility", "google-analytics-ask-advisor"],
    relatedCategories: ["seo-geo", "commerce-agentivo", "analytics"],
    sources: [
      {
        label: "OpenAI — Compras com a Busca do ChatGPT",
        url: "https://help.openai.com/pt-br/articles/11128490-shopping-with-chatgpt-search"
      },
      {
        label: "OpenAI Developers — Especificação de dados de produto",
        url: "https://developers.openai.com/commerce/specs/file-upload/products?view=table"
      },
      {
        label: "Google Analytics — Medição de tráfego de assistentes de IA",
        url: "https://support.google.com/analytics/answer/9164320?hl=pt-BR"
      }
    ]
  },
  {
    slug: "commerce-agentivo-ecommerce",
    title: "Commerce agentivo em 2026: o que muda para o e-commerce quando a compra começa em uma IA",
    description:
      "Descoberta, comparação, feeds, disponibilidade, checkout e mensuração: o que lojistas precisam preparar para a jornada de compra mediada por agentes.",
    eyebrow: "Estratégia • Commerce agentivo",
    updatedAt: "29/09/2026",
    readTime: "9 min",
    intro:
      "A jornada de compra já não começa apenas em busca, marketplace ou mídia social. Interfaces de IA podem entender intenção, mostrar produtos, comparar opções e direcionar o usuário para a compra; em alguns casos elegíveis, a experiência pode incluir checkout dentro do próprio ChatGPT. Para o lojista, isso cria um novo canal de descoberta que depende de dados estruturados e informação comercial atualizada.",
    keyTakeaways: [
      "O ChatGPT já apresenta resultados de produtos quando identifica intenção de compra.",
      "A OpenAI aceita conteúdo de comerciantes por meios como feeds, seguindo uma especificação de produto.",
      "Preço, disponibilidade, qualidade da informação e identidade do comerciante influenciam a experiência de compra.",
      "O lojista precisa medir esse canal sem confundir descoberta orgânica, feed e publicidade."
    ],
    sections: [
      {
        title: "Da página de resultados para uma conversa de compra",
        paragraphs: [
          "Em uma interface conversacional, o usuário não precisa conhecer a categoria ou escrever a consulta perfeita. Ele pode descrever ocasião, orçamento, restrições e preferências em linguagem natural. O sistema então tenta mapear essa intenção para produtos relevantes.",
          "Isso aumenta a importância de atributos ricos e informações claras. Um catálogo que depende apenas de nomes internos, descrições curtas e imagens sem contexto oferece menos sinais para uma experiência mediada por IA."
        ]
      },
      {
        title: "Feed de produto vira infraestrutura",
        paragraphs: [
          "A especificação de feed da OpenAI inclui campos obrigatórios para identificação e apresentação do produto. A documentação também orienta comerciantes a atualizar preço e disponibilidade quando houver mudanças.",
          "Para a operação, isso significa tratar feed como infraestrutura viva: o objetivo não é apenas enviar um arquivo, mas manter consistência entre ERP, plataforma, feed e página."
        ],
        bullets: [
          "ID e variantes estáveis.",
          "Título e descrição coerentes com a PDP.",
          "Preço e disponibilidade atualizados.",
          "Marca e imagem corretas.",
          "Links canônicos e páginas funcionando."
        ]
      },
      {
        title: "Orgânico, feed e anúncio não são a mesma coisa",
        paragraphs: [
          "A própria documentação da OpenAI diferencia resultados de compra de anúncios. A presença orgânica de produtos é selecionada separadamente, enquanto recursos publicitários baseados em feed têm regras e formatos próprios.",
          "Essa distinção importa para mensuração. Uma equipe deve separar tráfego e receita de descoberta orgânica, campanhas pagas e outros referrals, em vez de agrupar tudo sob o rótulo “ChatGPT”."
        ]
      },
      {
        title: "O checklist do lojista para 2026",
        paragraphs: [
          "Antes de buscar qualquer integração avançada, o e-commerce precisa ter sua base de produto em ordem."
        ],
        bullets: [
          "Catálogo com atributos completos e sem conflitos entre canais.",
          "Feed atualizado e monitorado.",
          "Dados estruturados coerentes com a página.",
          "Políticas comerciais e informações de entrega acessíveis.",
          "GA4 preparado para acompanhar tráfego de assistentes de IA.",
          "Rotina editorial para revisar páginas que recebem tráfego ou citações."
        ]
      }
    ],
    relatedTools: ["chatgpt-shopping", "shopify-sidekick", "nuvemshop-lumi-mcp"],
    relatedCategories: ["commerce-agentivo", "busca-descoberta", "seo-geo"],
    sources: [
      {
        label: "OpenAI — Compras com a Busca do ChatGPT",
        url: "https://help.openai.com/pt-br/articles/11128490-shopping-with-chatgpt-search"
      },
      {
        label: "OpenAI — Termos do Feed de Comerciantes",
        url: "https://openai.com/pt-BR/policies/merchant-feed-terms-of-service/"
      },
      {
        label: "OpenAI Developers — Product Feed Spec",
        url: "https://developers.openai.com/commerce/specs/file-upload/products?view=table"
      }
    ]
  }
];
