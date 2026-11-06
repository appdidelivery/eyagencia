export type TrackId = "fundamentos" | "negocios" | "renda";

export type CourseTool = {
  name: string;
  url: string;
  why: string;
};

export type Mission = {
  id: string;
  track: TrackId;
  title: string;
  subtitle: string;
  minutes: number;
  xp: number;
  concept: string;
  steps: string[];
  prompt: string;
  output: string;
  checks: string[];
  trick: string;
  tools: CourseTool[];
  quiz: {
    question: string;
    options: [string, string, string];
    correct: number;
    explanation: string;
  };
};

export const academyUrl = "https://www.eyagencia.com.br/academia-ia";

export const tracks: { id: TrackId; title: string; subtitle: string; color: string; symbol: string }[] = [
  { id: "fundamentos", title: "IA do zero", subtitle: "Aprenda a pedir, avaliar e melhorar resultados.", color: "#8eecb2", symbol: "✳" },
  { id: "negocios", title: "IA para negócios", subtitle: "Transforme tarefas reais em entregas profissionais.", color: "#9dd8f5", symbol: "◈" },
  { id: "renda", title: "IA para gerar renda", subtitle: "Crie, precifique e apresente um serviço honesto.", color: "#ffcf8c", symbol: "↗" }
];

const chat: CourseTool = { name: "ChatGPT", url: "https://chatgpt.com/", why: "Criar, revisar e estruturar ideias" };
const gemini: CourseTool = { name: "Gemini", url: "https://gemini.google.com/", why: "Comparar respostas e trabalhar com texto" };
const canva: CourseTool = { name: "Canva", url: "https://www.canva.com/", why: "Transformar conteúdo revisado em peças visuais" };
const sheets: CourseTool = { name: "Google Planilhas", url: "https://sheets.google.com/", why: "Organizar dados, fórmulas e resultados" };
const n8n: CourseTool = { name: "n8n", url: "https://n8n.io/", why: "Estudar fluxos e automações com regras explícitas" };

export const missions: Mission[] = [
  {
    id: "f01", track: "fundamentos", title: "Sua primeira conversa que funciona", subtitle: "Saia do prompt vago e chegue a uma entrega utilizável.", minutes: 6, xp: 80,
    concept: "Uma boa instrução tem papel, contexto, tarefa, limites e formato. A IA pode produzir um rascunho; você continua responsável por conferir o conteúdo.",
    steps: ["Escolha um negócio fictício ou seu próprio projeto.", "Cole o prompt e substitua os campos entre colchetes.", "Compare a primeira resposta com o objetivo e peça uma melhoria específica."],
    prompt: "Você é um assistente de marketing. Contexto: [tipo de negócio e público]. Objetivo: criar uma apresentação curta do serviço [serviço]. Escreva 3 versões, cada uma com até 60 palavras. Não invente números, clientes ou diferenciais. Ao final, faça 2 perguntas para melhorar o briefing.",
    output: "Três versões de apresentação e uma versão revisada.",
    checks: ["O público está definido.", "Não há promessas ou dados inventados.", "A versão final cabe em uma mensagem real."],
    trick: "Peça três alternativas antes de escolher. Depois combine o melhor das respostas sem aceitar tudo automaticamente.",
    tools: [chat, gemini],
    quiz: { question: "Qual instrução tende a produzir uma resposta mais útil?", options: ["Escreva algo bom", "Você é consultor; escreva para lojas pequenas, em 70 palavras, sem prometer vendas", "Faça o melhor possível, sem perguntas"], correct: 1, explanation: "Contexto, público, formato e limites tornam a saída verificável." }
  },
  {
    id: "f02", track: "fundamentos", title: "Como não cair nas respostas inventadas", subtitle: "Verificação é uma habilidade de quem usa IA profissionalmente.", minutes: 6, xp: 90,
    concept: "Modelos podem responder de maneira convincente e errada. Informação de produto, preços, leis, datas e números exige confirmação em fontes confiáveis.",
    steps: ["Peça um resumo sobre um tema que você conhece.", "Separe três afirmações verificáveis da resposta.", "Encontre fontes oficiais para as afirmações ou marque-as como não confirmadas."],
    prompt: "Resuma [tema] em 5 tópicos. Para cada afirmação que dependa de dados externos, marque 'verificação necessária'. Diferencie informação conhecida de hipótese. Não fabrique fontes, links ou citações.",
    output: "Uma lista com 3 afirmações e seu status: confirmado, não confirmado ou incorreto.",
    checks: ["Cada informação verificável tem fonte ou aviso.", "Nenhum número foi tratado como fato sem checagem.", "Erros foram corrigidos no texto final."],
    trick: "Perguntar à mesma IA se ela errou não substitui conferir a fonte original.",
    tools: [chat, gemini],
    quiz: { question: "A IA apresenta uma estatística sem fonte. O que fazer?", options: ["Publicar porque parece precisa", "Confirmar na fonte primária antes de usar", "Repetir a estatística para outra IA e assumir que está certa"], correct: 1, explanation: "A validação exige uma fonte rastreável, não apenas outra resposta de modelo." }
  },
  {
    id: "f03", track: "fundamentos", title: "A técnica do briefing em camadas", subtitle: "Faça a IA perguntar antes de executar.", minutes: 7, xp: 100,
    concept: "Um trabalho melhora quando o modelo coleta requisitos antes de produzir. Vale para roteiros, e-mails, serviços e até especificações de aplicações.",
    steps: ["Selecione uma tarefa real que você adia.", "Peça até cinco perguntas de briefing, uma de cada vez.", "Responda e gere um rascunho; depois critique e revise."],
    prompt: "Atue como especialista em [área]. Quero criar [entrega]. Não execute ainda. Faça no máximo cinco perguntas objetivas para entender público, recursos, restrições, prazo e critério de sucesso. Depois das respostas, entregue um primeiro rascunho e uma lista de pontos a conferir.",
    output: "Briefing com cinco respostas e um rascunho revisado.",
    checks: ["O trabalho tem objetivo claro.", "As restrições estão explícitas.", "O resultado é conferido antes do uso."],
    trick: "Peça para a IA propor primeiro critérios de aprovação: fica mais fácil revisar a entrega.",
    tools: [chat, gemini],
    quiz: { question: "Quando usar perguntas de briefing?", options: ["Quando há requisitos ambíguos ou dados faltando", "Somente em programação", "Nunca; a IA deve adivinhar"], correct: 0, explanation: "As perguntas reduzem retrabalho e suposições desnecessárias." }
  },
  {
    id: "f04", track: "fundamentos", title: "Crie seu primeiro modelo de trabalho", subtitle: "Reaproveite processos sem expor dados de clientes.", minutes: 8, xp: 110,
    concept: "Um modelo reutilizável inclui entrada, processo, saída e validação. Dados de clientes e informações sensíveis não devem ser enviados sem autorização.",
    steps: ["Escolha uma tarefa recorrente: pauta, proposta ou atendimento.", "Crie um checklist de entradas usando dados fictícios.", "Gere um modelo, aplique a um segundo exemplo e registre o que precisou mudar."],
    prompt: "Crie um modelo reutilizável de [tarefa] para [público]. Entregue: campos de entrada, instruções, exemplo usando dados fictícios, checklist de revisão e um aviso para não incluir informações pessoais sem autorização.",
    output: "Template que pode ser reaplicado a dois casos sem dados reais sensíveis.",
    checks: ["Os campos obrigatórios estão claros.", "O exemplo usa dados fictícios.", "A revisão humana continua necessária."],
    trick: "Não salve só o prompt: salve também um exemplo de entrada e um exemplo de saída aprovada.",
    tools: [chat, sheets],
    quiz: { question: "Você quer testar um atendimento com IA. O que é mais apropriado?", options: ["Enviar a lista inteira de clientes", "Usar dados fictícios e remover identificadores pessoais", "Publicar conversas de clientes para receber feedback"], correct: 1, explanation: "Minimizar dados pessoais reduz risco e é uma boa prática de teste." }
  },
  {
    id: "f05", track: "fundamentos", title: "Do texto à primeira peça visual", subtitle: "Una criação, ferramenta de design e revisão.", minutes: 9, xp: 130,
    concept: "Criar uma peça é diferente de criar apenas uma legenda. Você precisa de mensagem, hierarquia, identidade, público e chamada para ação.",
    steps: ["Use uma marca fictícia de cafeteria ou comércio local.", "Produza título, subtítulo e CTA com o prompt.", "Monte uma peça no Canva e revise textos, contraste e legibilidade no celular."],
    prompt: "Para uma [cafeteria fictícia] com público [perfil], crie 3 propostas de post educativo. Entregue título com até 7 palavras, apoio com até 18 palavras, CTA sem promessa de resultado e orientação visual. Não crie preços ou depoimentos falsos.",
    output: "Uma arte exportada e sua copy revisada.",
    checks: ["Texto legível no celular.", "Arte e copy comunicam a mesma mensagem.", "Não há ofertas ou avaliações fabricadas."],
    trick: "Teste o post em tamanho de tela pequena antes de aprovar. Uma boa ideia ilegível não converte.",
    tools: [chat, canva],
    quiz: { question: "O que precisa ser revisado antes de publicar a peça?", options: ["Somente a cor", "Texto, contraste, dados e adequação ao público", "Nada, se foi gerado com IA"], correct: 1, explanation: "Design é comunicação; precisão e legibilidade fazem parte da entrega." }
  },
  {
    id: "n01", track: "negocios", title: "Diagnóstico de um negócio em 10 perguntas", subtitle: "Encontre oportunidades antes de escolher ferramentas.", minutes: 8, xp: 120,
    concept: "Automatizar um processo ruim só faz o erro acontecer mais rápido. Comece com um mapa de gargalos e tarefas repetitivas.",
    steps: ["Escolha uma empresa fictícia com site ou catálogo público.", "Monte dez perguntas sobre vendas, atendimento e operação.", "Classifique problemas por impacto, frequência e facilidade de solução."],
    prompt: "Atue como analista de operações para uma [loja de bairro fictícia]. Crie 10 perguntas de diagnóstico de vendas, atendimento, conteúdo e retrabalho. Depois gere uma matriz impacto x esforço, separando fatos informados de hipóteses.",
    output: "Uma matriz com três oportunidades priorizadas e hipóteses explícitas.",
    checks: ["Oportunidades não são confundidas com resultados já alcançados.", "Há uma prioridade realista.", "As perguntas identificam dados que faltam."],
    trick: "Ofereça primeiro um pequeno diagnóstico verificável. A automação vem depois de entender o processo.",
    tools: [chat, sheets],
    quiz: { question: "Qual é a primeira etapa de um bom projeto de automação?", options: ["Automatizar tudo", "Entender a tarefa e o problema que ela resolve", "Escolher a ferramenta mais cara"], correct: 1, explanation: "O diagnóstico evita investir em fluxos sem utilidade comprovada." }
  },
  {
    id: "n02", track: "negocios", title: "SEO de produto sem inventar características", subtitle: "Aplique IA ao catálogo de uma loja de verdade.", minutes: 10, xp: 150,
    concept: "Um título pode melhorar a compreensão do produto, mas não deve fabricar material, tamanho ou benefícios. Texto de SEO precisa refletir atributos confirmados.",
    steps: ["Escolha três produtos de demonstração com características conhecidas.", "Preencha atributos, diferenciais comprovados e público de cada item.", "Gere títulos e descrições e valide cada atributo contra a ficha original."],
    prompt: "Você é redator de e-commerce. Dados CONFIRMADOS: [produto, marca, tamanho, material, uso]. Gere 2 títulos até 70 caracteres, 1 meta descrição até 155 caracteres e 1 descrição clara. Não crie atributos, certificações ou promessas. Liste dúvidas antes de escrever caso faltem dados.",
    output: "Três fichas revisadas com título, meta e descrição.",
    checks: ["Atributos correspondem à ficha original.", "Não há promessas ou certificações inventadas.", "Títulos ajudam o cliente a identificar o produto."],
    trick: "Separe os atributos em um bloco imutável antes de pedir criação. Só aprova texto que bate com a fonte.",
    tools: [chat, sheets],
    quiz: { question: "A IA diz que o papel é resistente à gordura sem isso constar na ficha. O que fazer?", options: ["Usar porque ajuda no SEO", "Remover ou confirmar o atributo com o fornecedor", "Publicar apenas na meta descrição"], correct: 1, explanation: "O SEO deve representar a realidade do produto." }
  },
  {
    id: "n03", track: "negocios", title: "Campanha de conteúdo em uma hora", subtitle: "Planeje, produza e valide mensagens de uma marca.", minutes: 9, xp: 150,
    concept: "Uma sequência de conteúdo precisa de objetivo e público. Alcance não é venda; chamadas para ação precisam ser mensuráveis.",
    steps: ["Defina um objetivo para uma marca fictícia.", "Peça três pautas: educação, demonstração e convite.", "Crie um post no Canva e desenhe uma forma de medir interações reais."],
    prompt: "Monte uma microcampanha de 3 conteúdos para [negócio], público [perfil], objetivo [visitas ao site ou mensagens]. Para cada conteúdo: ideia, gancho, roteiro de 20 segundos, legenda, CTA e hipótese de métrica. Evite alegações sem prova.",
    output: "Plano de três posts, uma peça pronta e duas métricas de acompanhamento.",
    checks: ["Cada post tem função definida.", "CTA corresponde ao objetivo.", "Métricas são objetivos, não resultados inventados."],
    trick: "Proponha um post para ensinar, um para demonstrar e um para convidar. Evite só propaganda.",
    tools: [chat, canva, sheets],
    quiz: { question: "Qual é uma métrica de resultado observável?", options: ["'A campanha certamente dobrará vendas'", "Mensagens recebidas por link identificado", "A IA garantiu alta conversão"], correct: 1, explanation: "Uma métrica depende de eventos realmente medidos." }
  },
  {
    id: "n04", track: "negocios", title: "Transforme números em decisões", subtitle: "Analise uma pequena planilha sem confundir lucro e receita.", minutes: 10, xp: 160,
    concept: "Faturamento, margem e lucro são diferentes. IA pode sugerir análise, mas fórmulas e dados precisam ser conferidos.",
    steps: ["Crie uma planilha fictícia com cinco pedidos, valor e custo.", "Calcule receita, custo e margem por item na própria planilha.", "Peça à IA três hipóteses de melhoria e valide cálculos."],
    prompt: "Analise este conjunto FICTÍCIO de vendas: [cole até 5 linhas sem dados pessoais]. Calcule receita total, custos diretos, margem bruta em R$ e %, explique as fórmulas e identifique o que falta para calcular lucro líquido. Não invente custos ausentes.",
    output: "Mini-relatório com totais conferidos, limitações e três hipóteses.",
    checks: ["Os cálculos foram conferidos fora da IA.", "Margem não é chamada de lucro líquido.", "Dados fictícios não foram apresentados como vendas reais."],
    trick: "Peça que a IA mostre as fórmulas — e confira no Google Planilhas antes de tomar decisão.",
    tools: [chat, sheets],
    quiz: { question: "Uma loja teve R$ 1.000 de vendas e R$ 600 de custo direto. Qual afirmação é segura?", options: ["O lucro líquido foi R$ 400", "A margem bruta foi R$ 400 antes de outras despesas", "As vendas cresceram 40%"], correct: 1, explanation: "Ainda faltam despesas administrativas, taxas, impostos e outros custos para apurar lucro líquido." }
  },
  {
    id: "n05", track: "negocios", title: "Seu primeiro fluxo de automação responsável", subtitle: "Mapeie o processo antes de disparar mensagens.", minutes: 12, xp: 180,
    concept: "Uma automação confiável tem gatilho, consentimento quando aplicável, dados mínimos, decisão, saída e tratamento de erros. Faça o teste com dados fictícios e sem envio real.",
    steps: ["Escolha um processo interno: pedido de orçamento ou organização de tarefas.", "Desenhe as etapas do fluxo e onde deve existir aprovação humana.", "Simule um evento de entrada, um de erro e uma saída final."],
    prompt: "Desenhe um fluxo de automação para [receber pedidos de orçamento fictícios]. Mostre gatilho, dados necessários, consentimento quando aplicável, regras, validações, aprovação humana, mensagem de saída e erros. Não dispare mensagens reais nem peça tokens ou senhas.",
    output: "Fluxograma funcional ou checklist detalhado com cenário de teste.",
    checks: ["Entradas e erros estão previstos.", "Dados pessoais e autorizações são respeitados.", "Não houve disparo a contatos reais durante o teste."],
    trick: "Projete primeiro a condição de PARADA, depois a condição de ENVIO. Isso reduz automações perigosas.",
    tools: [chat, n8n],
    quiz: { question: "Antes de automatizar mensagens comerciais, qual cuidado é essencial?", options: ["Enviar para toda a base de uma vez", "Checar autorização, finalidade e regras do canal", "Ignorar devolutivas e erros"], correct: 1, explanation: "Consentimento e regras do canal devem ser considerados na arquitetura." }
  },
  {
    id: "r01", track: "renda", title: "Encontre um serviço pequeno e vendável", subtitle: "Comece com uma entrega específica, não com promessas vagas.", minutes: 8, xp: 150,
    concept: "Um serviço claro resolve um problema concreto, tem entrada conhecida, entrega delimitada e não promete um resultado fora de seu controle.",
    steps: ["Escolha entre revisão de catálogo, apresentações ou calendário de conteúdo.", "Escreva o problema, a entrega e o que fica fora do escopo.", "Monte uma proposta de uma frase com prazo realista."],
    prompt: "Crie 3 opções de microserviço para pequenas empresas usando IA como ferramenta, não como promessa de faturamento. Para cada uma, descreva problema, entradas, entrega, o que NÃO está incluído, risco de qualidade e perfil de cliente.",
    output: "Uma oferta de serviço com entregáveis e limites claros.",
    checks: ["O cliente entende o que receberá.", "Há limite de revisões e prazo proposto.", "Não há ganho financeiro garantido."],
    trick: "É mais fácil vender '10 descrições revisadas' do que 'consultoria completa em IA' sem escopo.",
    tools: [chat, sheets],
    quiz: { question: "Qual oferta define melhor o serviço?", options: ["Eu faço tudo com IA", "Entrego 10 descrições de produtos revisadas com base nas fichas fornecidas", "Garanto dobrar suas vendas"], correct: 1, explanation: "Escopo claro reduz objeções e retrabalho." }
  },
  {
    id: "r02", track: "renda", title: "Crie um case demonstrativo honesto", subtitle: "Mostre o antes e depois sem fingir ter um cliente.", minutes: 11, xp: 170,
    concept: "Um portfólio pode começar por projeto autoral. O erro é fingir que uma simulação foi contratada ou gerou vendas.",
    steps: ["Monte uma ficha de produto fictício com atributos verificáveis.", "Prepare a versão original e a versão melhorada.", "Registre o raciocínio da melhoria e sinalize 'projeto demonstrativo'."],
    prompt: "Com base nesta ficha fictícia [dados], crie um antes e depois de descrição de produto. Mantenha o mesmo conjunto de fatos. Em seguida explique cada mudança e escreva um case curto claramente identificado como projeto demonstrativo, sem clientes, conversões ou números inventados.",
    output: "Um case visual antes/depois para portfólio, marcado como demonstração.",
    checks: ["O projeto é apresentado como demonstração.", "Antes e depois usam os mesmos dados.", "A melhoria é explicada por critérios, não por vendas fictícias."],
    trick: "Documente a hipótese, a mudança e como mediria resultado com um cliente real. Isso passa confiança.",
    tools: [chat, canva],
    quiz: { question: "Você não prestou serviço para um cliente ainda. Como apresentar seu portfólio?", options: ["Inventar o nome de um cliente", "Rotular claramente o material como projeto demonstrativo", "Dizer que gerou 300% mais vendas"], correct: 1, explanation: "Projetos simulados são válidos quando apresentados com transparência." }
  },
  {
    id: "r03", track: "renda", title: "Precifique sem esquecer seu tempo", subtitle: "Aprenda a defender o valor da entrega.", minutes: 10, xp: 180,
    concept: "Preço deve considerar horas, revisão, ferramentas, impostos, risco e valor entregue. Não existe tabela universal de preço gerada por IA.",
    steps: ["Estime tempo de execução e de revisão de um microserviço.", "Some custos diretos e determine um valor de referência.", "Crie duas versões de pacote e uma política simples de revisão."],
    prompt: "Ajude a construir um modelo de orçamento de [serviço]. Entradas: horas estimadas [x], custo horário desejado [R$], ferramentas [R$], revisões [n], tributos estimados [se conhecidos]. Mostre cálculo e o que falta, sem apresentar preços de mercado como fatos. Sugira dois pacotes claros.",
    output: "Orçamento com premissas e duas opções de serviço.",
    checks: ["As horas de revisão entram no cálculo.", "O valor foi calculado, não adivinhado.", "Custos desconhecidos aparecem como pendência."],
    trick: "Inclua no orçamento o tempo de conversar com o cliente, revisar e entregar. IA não elimina responsabilidade.",
    tools: [chat, sheets],
    quiz: { question: "Qual custo costuma ser esquecido na precificação de um serviço com IA?", options: ["O tempo de revisão e comunicação", "O nome da ferramenta", "A cor do logotipo"], correct: 0, explanation: "Revisão e atendimento fazem parte do esforço real de entrega." }
  },
  {
    id: "r04", track: "renda", title: "Prospecção com contexto e respeito", subtitle: "Crie uma abordagem relevante, sem spam ou falsas provas.", minutes: 9, xp: 180,
    concept: "Abordagem comercial depende de contexto e permissão quando necessário. Listas compradas e disparos automáticos sem autorização trazem riscos.",
    steps: ["Selecione uma empresa fictícia ou um contato que autorizou a conversa.", "Escreva mensagem curta identificando problema observável e oferta pequena.", "Crie um follow-up respeitoso e uma regra para parar."],
    prompt: "Escreva uma abordagem profissional para [segmento], baseada apenas em problema observável [problema]. Máximo 90 palavras. Explique o serviço [escopo], proponha uma conversa opcional, sem urgência falsa, garantia de venda, personalização inventada ou disparo em massa. Faça uma versão para retorno após resposta.",
    output: "Mensagem inicial, seguimento permitido e critério de encerramento.",
    checks: ["A mensagem não inventa relação prévia.", "A abordagem é específica e respeitosa.", "Existe uma condição clara para não insistir."],
    trick: "Uma pequena análise de um problema real vale mais que uma mensagem genérica enviada para cem pessoas.",
    tools: [chat],
    quiz: { question: "O que fazer se o contato disser que não tem interesse?", options: ["Aumentar a frequência de envio", "Respeitar a recusa e encerrar", "Trocar o número e tentar novamente"], correct: 1, explanation: "Respeitar uma recusa é parte de uma prospecção profissional e ética." }
  },
  {
    id: "r05", track: "renda", title: "Meça resultado sem inventar receita", subtitle: "Separe entregas, contratos, vendas e lucro.", minutes: 12, xp: 220,
    concept: "Projeto concluído, proposta aceita, pagamento recebido e lucro são eventos distintos. Um case real deve documentar origem dos dados, período e critérios de atribuição.",
    steps: ["Crie quatro colunas: entregue, contratado, recebido, custos.", "Registre um exemplo fictício e marque explicitamente que é simulação.", "Descreva como comprovaria o próximo case real: proposta, aceite, comprovante e autorização."],
    prompt: "Monte um quadro para acompanhamento de microserviços usando colunas: data, serviço, escopo, proposta enviada, aceite, valor contratado, valor efetivamente recebido, custos e lucro estimado. Use linhas FICTÍCIAS marcadas como demonstração. Explique a diferença entre cada indicador e liste quais provas guardaria com privacidade.",
    output: "Modelo de acompanhamento e um protocolo de comprovação de resultados.",
    checks: ["Proposta não é tratada como faturamento.", "Pagamento não é confundido com lucro.", "O case só se torna real com evidências e consentimento para divulgação."],
    trick: "Comece medindo 'entregas aprovadas'. Só publique receita quando ela realmente existir e puder ser demonstrada.",
    tools: [sheets, chat],
    quiz: { question: "Um cliente recebeu sua proposta de R$ 800, mas não respondeu. Qual valor foi comprovadamente faturado?", options: ["R$ 800", "R$ 400", "R$ 0"], correct: 2, explanation: "Proposta enviada não representa contratação nem recebimento." }
  }
];

export const challengePaths = [
  {
    id: "sete-dias" as const,
    name: "7 dias para fazer com IA",
    description: "Sete missões progressivas, mesmo para quem nunca usou IA.",
    ids: ["f01", "f02", "f03", "f04", "f05", "n02", "r02"]
  },
  {
    id: "primeiro-servico" as const,
    name: "Do prompt ao primeiro serviço",
    description: "Uma jornada orientada a montar uma oferta e um portfólio demonstrativo.",
    ids: ["f01", "f03", "n01", "n02", "r01", "r02", "r03", "r04", "r05"]
  }
];

export function missionIndex(id: string) {
  return missions.findIndex(m => m.id === id);
}
