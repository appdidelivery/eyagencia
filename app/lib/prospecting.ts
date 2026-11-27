export const PROSPECT_SENDER="contato@eyagencia.com.br";
export type Brand="EYAGENCIA"|"VELO";
export type Finding={title:string;detail:string;url:string;observedAt:string};
export type Audit={url:string;at:string;scores:{performance:number|null;seo:number|null;accessibility:number|null};findings:Finding[]};
export function publicSite(value:string){
 const u=new URL(value.trim());
 const host=u.hostname.toLowerCase();
 if(u.protocol!=="https:"||u.username||u.password||u.port||!/^([a-z0-9-]+\.)+[a-z]{2,63}$/.test(host)||/\.(local|localhost|internal|test|example|invalid|onion)$/.test(host)||u.search||u.hash)throw Error("Use o endereço HTTPS público da página, sem parâmetros ou credenciais.");
 return u.href;
}
export function prospectEmail(value:string){return value.trim().toLowerCase()}
export function prospectBlocked(rows:{id?:string;kind:string;status:string;email?:string;title?:string}[],email:string,exclude?:string){
 const e=prospectEmail(email);
 return Boolean(e&&rows.some(r=>r.id!==exclude&&prospectEmail(r.email||"")===e&&(r.kind==="prospect"||r.kind==="client"&&r.status==="ativo")));
}
export function interpretAudit(data:any,requestedUrl:string,at:string):Audit{
 const lh=data?.lighthouseResult;if(!lh||lh.runtimeError)throw Error("Auditoria indisponível; não foi possível obter uma medição válida.");
 const score=(key:string)=>{const n=lh.categories?.[key]?.score;return typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=1?Math.round(n*100):null};
 const scores={performance:score("performance"),seo:score("seo"),accessibility:score("accessibility")};
 if(Object.values(scores).every(n=>n===null))throw Error("Nenhuma métrica válida retornada.");
 const url=publicSite(requestedUrl);
 const findings:Finding[]=[];
 const add=(title:string,detail:string)=>findings.push({title,detail,url,observedAt:at});
 const lcp=lh.audits?.["largest-contentful-paint"]?.numericValue;
 if(typeof lcp==="number"&&Number.isFinite(lcp)&&lcp>2500&&lcp<600000)add("Carregamento do conteúdo principal","LCP de "+(lcp/1000).toFixed(1).replace(".",",")+" s no teste de laboratório mobile; referência de boa experiência: até 2,5 s.");
 if(scores.performance!==null&&scores.performance<50)add("Desempenho mobile","Pontuação de performance Lighthouse mobile: "+scores.performance+"/100 nesta medição.");
 const known:[string,string,string][]=[["meta-description","Meta description","O teste não aprovou a presença de uma meta description."],["document-title","Título da página","O teste não aprovou o título da página."],["image-alt","Textos alternativos","O teste identificou imagens sem texto alternativo adequado."],["link-text","Links descritivos","O teste identificou links sem texto descritivo adequado."],["crawlable-anchors","Links rastreáveis","O teste identificou links não rastreáveis."]];
 for(const [id,title,detail] of known){const a=lh.audits?.[id];if(a&&a.score===0&&a.scoreDisplayMode==="binary")add(title,detail);}
 return {url,at,scores,findings};
}
export function recommendation(f:Finding,brand:Brand){
 const steps:Record<string,string>={"Cardápio em PDF":"Oferecer cardápio digital interativo com pedidos integrados, sem afirmar que o PDF é o único canal.","Canal de pedidos WhatsApp":"Oferecer automação oficial do atendimento e dos pedidos, complementar ao fluxo existente.","Link de marketplace":"Avaliar um canal próprio complementar de pedidos e fidelização.","Vitrine em marketplace":"Avaliar uma loja virtual própria complementar ao marketplace.","Carregamento do conteúdo principal":"Revisar o tamanho e a prioridade das imagens principais e os recursos que atrasam a renderização; repetir o teste após a correção.","Desempenho mobile":"Revisar os recursos mais pesados do Lighthouse e priorizar as melhorias de carregamento mobile.","Meta description":"Criar uma descrição específica da página, coerente com a oferta e a intenção de busca.","Título da página":"Definir um título claro, único e alinhado ao serviço apresentado.","Textos alternativos":"Adicionar descrições úteis às imagens informativas e revisar elementos decorativos.","Links descritivos":"Trocar rótulos genéricos por textos que indiquem o destino.","Links rastreáveis":"Revisar a navegação com links HTML acessíveis aos rastreadores."};
 return steps[f.title]||(brand==="VELO"?"Validar o caminho de compra no celular, da página consultada até o pedido; revisar o ponto observado e testar a correção.":"Revisar o ponto observado na jornada mobile até o contato ou compra e testar a solução com o responsável.");
}
export function buildApproach(brand:Brand,name:string,findings:Finding[]){
 const business=name.trim();if(!business||!findings.length)throw Error("Informe a empresa e pelo menos uma evidência verificável.");
 const first=findings[0];
 const identity=brand==="EYAGENCIA"?"EYAGENCIA":"Velo Delivery";
 const signature=brand==="EYAGENCIA"?"Equipe EYAGENCIA\nhttps://eyagencia.com.br":"Equipe Velo Delivery | EYAGENCIA\nhttps://velodelivery.com.br";
 const value=brand==="EYAGENCIA"?"melhorar a presença digital e tornar o caminho até o contato mais simples":"facilitar o caminho até o pedido direto e melhorar a experiência de compra";
 const body="Olá, equipe da "+business+"! Tudo bem?\n\nFaço parte da equipe "+identity+". Em uma análise pontual da presença digital de vocês, identifiquei o seguinte ponto:\n\n"+first.title+": "+first.detail+"\nFonte: "+first.url+" ("+first.observedAt.slice(0,10)+").\n\nUma sugestão inicial: "+recommendation(first,brand)+" Isso pode ajudar a "+value+". Posso enviar a análise gratuita completa, sem compromisso?\n\nSe preferirem não receber novos contatos comerciais, basta responder a este e-mail.\n\nAtenciosamente,\n"+signature;
 const report="DIAGNÓSTICO GRATUITO — "+business+" | "+identity+"\n"+findings.map((f,i)=>(i+1)+". "+f.title+" — "+f.detail+"\nSugestão: "+recommendation(f,brand)+"\nFonte: "+f.url+" | "+f.observedAt).join("\n\n")+"\n\nAnálise pontual, sem acesso às métricas internas da empresa. Não estima perdas de vendas nem garante resultados.";
 const followup="Olá, equipe da "+business+"! Retomo o e-mail anterior sobre "+first.title.toLowerCase()+". Se o tema for útil, posso compartilhar a análise e as sugestões práticas. Se não for prioridade ou preferirem não receber novos contatos, é só me avisar. Obrigado, equipe "+identity+".";
 return {sender:PROSPECT_SENDER,followup,subject:business+" — uma sugestão para "+(brand==="EYAGENCIA"?"sua presença digital":"seu canal de pedidos"),body,report,priority:findings.length>=2?"alta":"normal"};
}
