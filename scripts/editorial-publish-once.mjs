
const spec = {"draft":"drafts.agent-ia-ecommerce-indicadores-busca-inteligente-1793104249066","job":"ai-content-job-1793104249066","title":"Busca inteligente no e-commerce: indicadores para acompanhar","excerpt":"Como acompanhar consultas sem resultados, relevância, cliques e reformulações na busca interna de lojas virtuais, com testes controlados e revisão humana.","desc":"Guia de indicadores de busca interna para e-commerce: consultas sem resultados, relevância de produtos, testes de IA e governança de dados.","sections":[["Entenda a intenção por trás de cada busca","A busca interna registra como as pessoas procuram produtos. Uma consulta com marca e tamanho conhecidos é diferente de uma pesquisa ampla por ocasião de uso. Classificar essas intenções ajuda a separar problemas de nomenclatura, disponibilidade e relevância. Antes de contratar uma solução com inteligência artificial, reúna uma amostra de consultas e compare o que a loja realmente apresenta com o que o visitante provavelmente procurava.","Organize consultas sem resultados e pesquisas reformuladas em grupos separados. Um item pode estar disponível, mas com sinônimos ausentes, título inadequado ou categoria pouco intuitiva. Também pode não existir no catálogo. Os dois casos exigem respostas distintas. Documente mudanças de estoque, sazonalidade e campanhas, porque alterações nesses fatores dificultam comparar períodos e atribuir diferenças somente ao mecanismo de busca."],["Defina indicadores que possam ser conferidos","Monitore a participação de pesquisas sem resultados e a frequência de reformulações. Analise ainda os cliques após uma consulta, a posição do item escolhido e o uso de filtros. Nenhum desses sinais prova sozinho que o cliente ficou satisfeito. O valor está na leitura conjunta: uma busca pode receber cliques e ainda conduzir a um produto incompatível com a necessidade original.","Defina previamente quais eventos serão medidos e mantenha essa definição ao longo do acompanhamento. Abrir a página de um produto, adicionar ao carrinho e concluir um pedido representam etapas distintas. Observe segmentos de pesquisa, categorias, disponibilidade e diferentes dispositivos. Se o volume de dados não permitir conclusões, registre essa limitação em vez de transformar variações pequenas em resultados atribuídos à tecnologia."],["Avalie melhorias com testes claros","Escolha uma hipótese operacional por vez. Por exemplo: incluir sinônimos revisados pode tornar itens com nomes regionais mais fáceis de localizar. Prepare um conjunto de consultas representativas, registre os resultados atuais e compare com a configuração proposta. Quando houver volume adequado, um teste controlado entre alternativas ajuda a distinguir o efeito da mudança de outros acontecimentos na loja.","Recursos baseados em IA merecem revisão humana de casos difíceis. Termos semanticamente próximos nem sempre indicam produtos compatíveis: material, tamanho, especificação técnica e disponibilidade continuam relevantes. Tenha uma rotina de correção de resultados incorretos e registre quais regras foram alteradas. A decisão de expandir o recurso deve considerar também o esforço de manutenção e a qualidade dos dados cadastrais."],["Cuide dos dados e da revisão editorial","Consultas e registros de navegação podem envolver informações pessoais. Avalie finalidade, necessidade e retenção dos dados antes de ampliar a coleta. A aplicação das regras de proteção de dados depende do contexto de cada operação; uma recomendação genérica não substitui a avaliação do fluxo real. Prefira relatórios agregados quando o objetivo for compreender padrões de busca em vez de identificar consumidores.","Reúna periodicamente profissionais de catálogo, atendimento, marketing e tecnologia para examinar consultas recorrentes. Registre responsáveis, hipóteses, alterações e datas de revisão. Diferencie recomendações operacionais de resultados comprovados: indicadores orientam decisões, mas não demonstram, isoladamente, que a inteligência artificial aumentou vendas. Esse cuidado torna o aprendizado reproduzível sem depender de promessas ou números não verificados."]]};
const site = "EY";
const project = site === "EY" ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : process.env.VELO_SANITY_PROJECT_ID;
const dataset = site === "EY" ? process.env.NEXT_PUBLIC_SANITY_DATASET : process.env.VELO_SANITY_DATASET;
const token = site === "EY" ? process.env.SANITY_API_WRITE_TOKEN : process.env.VELO_SANITY_API_WRITE_TOKEN;
const urlBase = "https://" + project + ".api.sanity.io/v2026-07-01";
if (process.env.VERCEL_ENV !== "production" || !token || !project || !dataset) {
  console.log("[editorial-publish] skipped " + site);
  process.exit(0);
}
async function query(q,params={}) {
 const u=new URL(urlBase+"/data/query/"+dataset);
 u.searchParams.set("query",q);u.searchParams.set("perspective","raw");
 for(const [k,v] of Object.entries(params))u.searchParams.set("$"+k,JSON.stringify(v));
 const response=await fetch(u,{headers:{Authorization:"Bearer "+token},cache:"no-store"});
 if(!response.ok)throw Error("Sanity read HTTP "+response.status);
 return (await response.json()).result;
}
async function mutate(mutations) {
 const response=await fetch(urlBase+"/data/mutate/"+dataset+"?visibility=sync",{method:"POST",headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({mutations})});
 if(!response.ok)throw Error("Sanity write HTTP "+response.status+": "+(await response.text()).slice(0,300));
 return response.json();
}
const body=[];
const block=(text,style="normal")=>{
 const n=body.length+1;
 body.push({_type:"block",_key:"ed"+String(n).padStart(10,"0"),style,markDefs:[],children:[{_type:"span",_key:"tx"+String(n).padStart(10,"0"),text,marks:[]}]});
};
for(const section of spec.sections){block(section[0],"h2");for(const p of section.slice(1))block(p);}
block("Transparência editorial: conteúdo produzido com apoio de inteligência artificial e revisão do texto antes da publicação.");
const words=body.map(b=>b.children[0].text).join(" ").trim().split(/\s+/).length;
if(words<450||spec.sections.length<3)throw Error("Artigo abaixo do mínimo editorial");
try {
 const draft=await query('*[_id==$id][0]{_id,_type,slug,title}',{id:spec.draft});
 if(!draft||draft._type!=="post"||!draft.slug?.current)throw Error("Rascunho ausente");
 const slug=draft.slug.current,pubId=spec.draft.slice(7);
 if(await query('count(*[_type=="post" && !(_id in path("drafts.**")) && slug.current==$slug])',{slug})){console.log("[editorial-publish] duplicate "+slug);process.exit(0);}
 if(await query('count(*[_id==$id])',{id:pubId})){console.log("[editorial-publish] exists "+pubId);process.exit(0);}
 const siteUrl=site==="EY"?"https://www.eyagencia.com.br":"https://www.velodelivery.com.br";
 let image={_type:"image",alt:"Imagem de capa: "+spec.title,generationSource:site==="EY"?"eyagencia/free-svg-v1":"velo/free-svg-v1"};
 try{
  const res=await fetch(siteUrl+"/api/blog-cover?title="+encodeURIComponent(spec.title)+"&slug="+encodeURIComponent(slug)+"&v=3",{signal:AbortSignal.timeout(12000)});
  if(!res.ok)throw Error("cover HTTP "+res.status);
  const svg=await res.text();if(!svg.startsWith("<svg"))throw Error("invalid SVG");
  const upload=await fetch(urlBase+"/assets/images/"+dataset+"?filename="+encodeURIComponent("editorial-"+slug+".svg"),{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"image/svg+xml"},body:svg});
  if(!upload.ok)throw Error("upload HTTP "+upload.status);
  const asset=(await upload.json()).document;
  image={_type:"image",alt:"Imagem de capa: "+spec.title,asset:{_type:"reference",_ref:asset._id},generationSource:site==="EY"?"eyagencia/free-svg-v3":"velo/free-svg-v3",generatedAt:new Date().toISOString()};
 }catch(error){console.warn("[editorial-publish] dynamic cover fallback "+error.message);}
 const now=new Date().toISOString();
 const post={_id:pubId,_type:"post",title:spec.title,slug:{_type:"slug",current:slug},excerpt:spec.excerpt,seoTitle:spec.title,seoDescription:spec.desc,publishedAt:now,body,mainImage:image,aiAssisted:true,editorialReview:"assisted_rewrite",contentAgentGenerated:true,contentAgentTopic:spec.title};
 if(!await query('count(*[_id==$id])',{id:spec.job}))throw Error("Job not found");
 await mutate([{create:post},{delete:{id:spec.draft}},{patch:{id:spec.job,set:{status:"published_after_revision",publishedAt:now,publicPostId:pubId,publicationMode:"editorial_rewrite_requested",imageStatus:"generated"}}}]);
 const check=await query('*[_id==$id][0]{_id,title,publishedAt,"slug":slug.current}',{id:pubId});
 console.log("[editorial-publish] SUCCESS "+JSON.stringify({site,title:check?.title,date:check?.publishedAt,words,url:siteUrl+"/blog/"+encodeURIComponent(slug)}));
}catch(error){console.error("[editorial-publish] FAILED "+site+" "+error.message);process.exitCode=1;}
