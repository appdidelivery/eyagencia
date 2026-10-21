// Restricted editorial fallback for the AI + e-commerce governance pilot.
// This is advice about HOW TO TEST, not unsupported claims about outcomes.
// It does not invent figures, laws, citations, experience, dates or ROI.

export function createMethodologicalDraft(
  sources: Array<{title: string; url: string}>,
) {
  return {
    title: 'IA no e-commerce: como avaliar casos de uso, métricas e riscos',
    slug: 'avaliar-ia-ecommerce-metricas-governanca',
    seoTitle: 'IA no e-commerce: métricas, testes e governança de dados',
    seoDescription:
      'Guia para gestores avaliarem aplicações de IA no e-commerce com indicadores, experimentos controlados, proteção de dados e revisão humana.',
    excerpt:
      'Um roteiro para avaliar IA no e-commerce sem prometer crescimento automático: escolha uma hipótese, defina métricas, valide fontes, monitore riscos e decida com evidências.',
    searchIntent: 'Guia prático para avaliação responsável de IA no varejo digital',
    sections: [
      {
        heading: 'Antes de adotar IA, defina o problema e o resultado esperado',
        paragraphs: [
          'Um projeto de inteligência artificial deve começar com uma decisão de negócio específica, não com uma tecnologia em busca de aplicação. Em uma operação de comércio eletrônico, uma equipe pode querer reduzir retrabalho no atendimento, organizar o catálogo ou melhorar a descoberta de produtos. Essas são hipóteses de intervenção, e não resultados previamente demonstrados. Registre o processo atual, os recursos empregados, a experiência do cliente e os critérios que indicariam melhoria. Documente também quem toma as decisões, quais equipes serão afetadas e quais dados realmente são necessários.',
          'Antes do teste, descreva o público-alvo, a duração prevista, o critério de interrupção e um cenário de comparação. Evite apresentar exemplos externos como prova de que uma solução funcionará em outra empresa. Operações com preços, logística, sortimento e perfis de clientes diferentes podem apresentar comportamentos distintos. A decisão de ampliar o uso deve depender do resultado observado no próprio contexto, acompanhado de revisão humana e registro de limitações.',
        ],
        bullets: [
          'Escreva uma hipótese que possa ser refutada e não uma promessa de faturamento.',
          'Defina um responsável por qualidade, privacidade e análise dos resultados.',
          'Registre a situação anterior para não confundir tendência existente com efeito do teste.',
        ],
      },
      {
        heading: 'Casos de uso para testar, sem confundir possibilidade com resultado comprovado',
        paragraphs: [
          'Atendimento assistido, revisão de descrições, classificação de dúvidas e apoio à busca interna são exemplos de tarefas que podem ser avaliadas em pilotos limitados. Sua adequação depende da qualidade do catálogo, das políticas de atendimento, do custo de integração e dos mecanismos de intervenção humana. Um assistente que responde rapidamente, mas apresenta informações erradas sobre estoque ou prazos, pode piorar a experiência. Por isso, velocidade sozinha não basta: qualidade, precisão e capacidade de encaminhar dúvidas precisam fazer parte da medição.',
          'Na descoberta de produtos, estabeleça como os resultados serão julgados e quem revisará recomendações indevidas. Na geração de conteúdo, exija conferência de preços, atributos, autoria e referências. Na organização do catálogo, monitore alterações que possam criar duplicações ou classificações incorretas. Esses exemplos são propostas de experimento, não declarações de retorno econômico. Não atribua ganhos de conversão a uma ferramenta de IA sem comparar grupos adequados e controlar fatores operacionais.',
        ],
        bullets: [
          'Atendimento: avaliar resolução correta e encaminhamento humano.',
          'Catálogo: avaliar consistência de atributos e necessidade de correções.',
          'Busca interna: avaliar relevância e satisfação, sem supor ganhos de venda.',
        ],
      },
      {
        heading: 'Como medir o efeito sem confundir correlação com causalidade',
        paragraphs: [
          'Escolha indicadores primários e secundários antes de iniciar a implementação. Uma mudança na taxa de conversão pode coincidir com alterações de preço, campanhas, frete, sazonalidade ou disponibilidade de produtos. Essa coincidência não demonstra que a IA causou o resultado. Quando possível, compare grupos semelhantes expostos e não expostos à nova solução, defina regras de elegibilidade e observe a variação dos indicadores ao longo de um período adequado. Se não houver desenho experimental, apresente o resultado como observação, não como evidência causal.',
          'Combine indicadores de negócio com métricas de segurança e operação. Para atendimento, acompanhe respostas corretas, retrabalho, satisfação e escalonamentos. Para busca, avalie relevância, abandono e qualidade do catálogo. Para conteúdo, considere precisão factual, correções editoriais e clareza da informação. Documente custos operacionais e revisões necessárias para evitar uma conclusão baseada apenas em métricas de volume. Se os dados não forem suficientes, a decisão correta pode ser ampliar a observação ou interromper o teste.',
        ],
        bullets: [
          'Defina baseline, grupo de comparação e regras de exclusão antes de analisar resultados.',
          'Separe ganhos observados de hipóteses e opiniões de especialistas.',
          'Registre efeitos colaterais, falhas e custos de supervisão.',
        ],
      },
      {
        heading: 'Fontes oficiais: o que elas informam e o que não comprovam',
        paragraphs: [
          'A Autoridade Nacional de Proteção de Dados mantém informações públicas sobre inteligência artificial e proteção de dados, incluindo iniciativas de testagem regulatória. Essas informações ajudam a identificar questões de governança e riscos a considerar, mas não constituem demonstração de desempenho comercial de ferramentas privadas. É inadequado transportar resultados de iniciativas institucionais para promessas de eficiência ou aumento de vendas no varejo digital. O contexto de aplicação, os dados e as responsabilidades são diferentes.',
          'O Ministério do Desenvolvimento, Indústria, Comércio e Serviços publica documentação sobre seu painel de comércio eletrônico e a metodologia de estatísticas administrativas. Antes de utilizar os números desse painel, consulte a versão e as limitações metodológicas diretamente na fonte. Indicadores agregados de transações não medem isoladamente o impacto de uma ferramenta de IA sobre faturamento, e seu escopo não deve ser confundido com todo o universo de serviços e vendas entre empresas. Use esses materiais como contexto, sem extrapolar datas ou segmentos que não foram medidos.',
        ],
        bullets: [
          'Consulte a fonte primária e registre quando o material foi acessado.',
          'Diferencie dados observados, hipóteses de negócio e recomendações metodológicas.',
          'Nunca trate um projeto de lei ou notícia antiga como prova de situação normativa vigente.',
        ],
      },
      {
        heading: 'Privacidade, governança e supervisão humana',
        paragraphs: [
          'Defina quais dados a solução realmente precisa, quem poderá acessá-los, por quanto tempo serão conservados e como serão corrigidos ou excluídos. Evite inserir dados pessoais de clientes em testes sem avaliação apropriada de necessidade e segurança. Estabeleça uma política interna para fornecedores, permissões, registro de incidentes e resposta a decisões inadequadas. Para questões sobre base legal, tratamento de dados e obrigações específicas, solicite avaliação atualizada da equipe jurídica ou de proteção de dados. Este guia não substitui orientação jurídica.',
          'A supervisão humana deve ser proporcional ao risco da tarefa. Erros em descrições de produtos exigem um tipo de revisão; decisões que possam afetar crédito, acesso, preço individualizado ou direitos de pessoas exigem cuidados diferentes. Mantenha um caminho claro para contestação e correção, com responsáveis identificáveis. Não apresente sistemas automatizados como infalíveis e não use um selo de avaliação interna como substituto de verificação das afirmações que aparecem para o consumidor.',
        ],
        bullets: [
          'Minimize dados utilizados e delimite finalidades antes do piloto.',
          'Defina quando um operador humano deve revisar ou interromper a automação.',
          'Documente versões, correções, incidentes e decisões de expansão.',
        ],
      },
      {
        heading: 'Roteiro de decisão: testar, ajustar ou interromper',
        paragraphs: [
          'Comece com uma tarefa de baixo risco e com dados que possam ser auditados. Prepare uma amostra representativa, estabeleça a avaliação de qualidade e mantenha a experiência anterior como referência. Registre o que foi alterado, incluindo mudanças de preço, campanha, logística e catálogo, para facilitar a interpretação dos resultados. Durante o teste, acompanhe desempenho, incidência de respostas erradas, reclamações e necessidade de intervenção humana. Revisões frequentes devem ser previstas como parte da operação, não tratadas como exceção.',
          'Ao final, reúna responsáveis de negócio, operações, dados e privacidade para decidir com base nos registros produzidos. Amplie o uso apenas quando o benefício esperado estiver suficientemente sustentado e os riscos residuais forem aceitáveis. Caso a evidência seja ambígua, apresente essa incerteza de forma explícita. Uma decisão de não escalar também pode ser um resultado útil de um experimento. A orientação central é tratar IA como hipótese sujeita a teste, não como justificativa automática para qualquer mudança.',
        ],
        bullets: [
          'Iniciar: objetivo verificável, dados mínimos e responsáveis definidos.',
          'Ajustar: evidência parcial, erros corrigíveis e limites de risco documentados.',
          'Interromper: informação incorreta recorrente, falta de evidência ou risco excessivo.',
        ],
      },
    ],
    faq: [
      {
        question: 'Como saber se a IA melhorou a conversão?',
        answer:
          'Defina a hipótese e compare grupos equivalentes sempre que possível. Sem desenho adequado, descreva apenas associação observada, considerando preço, marketing, estoque e logística.',
      },
      {
        question: 'Dados oficiais do comércio eletrônico comprovam ROI de IA?',
        answer:
          'Não. Estatísticas agregadas podem contextualizar o mercado, mas não isolam o efeito de uma ferramenta. ROI depende de avaliação específica de custos, benefícios e evidência do próprio projeto.',
      },
      {
        question: 'Quem deve aprovar um conteúdo produzido com IA?',
        answer:
          'Uma pessoa responsável precisa validar fatos, fontes, riscos regulatórios, SEO e utilidade para o leitor antes da publicação. A pontuação automática é um sinal de triagem, não autorização final.',
      },
    ],
    internalLinks: [{anchor: 'Conheça as iniciativas da agência', url: '/ia-ecommerce'}, {anchor: 'Mais artigos de estratégia digital', url: '/blog'}],
    sources,
  }
}
