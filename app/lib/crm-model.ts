export const modules={
 client:{title:"Clientes e leads",statuses:["lead","negociação","ativo","inativo","a conferir"]},
 contract:{title:"Contratos",statuses:["minuta","aguardando assinatura","assinado","encerrado","a conferir"]},
 monthly:{title:"Mensalidades",statuses:["prevista","cobrada","cancelada"]},
 payment:{title:"Recebimentos",statuses:["pendente","recebido","cancelado"]},
 delivery:{title:"Entregas",statuses:["pendente","em andamento","concluída"]},
 document:{title:"Documentos",statuses:["minuta","validado","arquivado","a conferir"]},
 proposal:{title:"Propostas",statuses:["rascunho","enviada","negociação","aprovada","recusada","cancelada"]},
 expense:{title:"Despesas",statuses:["prevista","pendente","paga","cancelada"]},
 project:{title:"Projetos",statuses:["planejado","em andamento","aguardando cliente","concluído","cancelado"]},
 task:{title:"Tarefas",statuses:["pendente","em andamento","aguardando cliente","concluída","cancelada"]},
 meeting:{title:"Agenda",statuses:["prevista","confirmada","realizada","cancelada"]},
 report:{title:"Relatórios",statuses:["pendente","em elaboração","entregue","arquivado"]},
 site:{title:"Sites e integrações",statuses:["ativo","em implantação","a conferir","inativo"]},
 campaign:{title:"Campanhas",statuses:["planejada","ativa","pausada","encerrada","a conferir"]}
} as const;
export type Kind=keyof typeof modules;
export type Company="EYAGENCIA"|"VELO"|"";
export type Item={kind:Kind;title:string;clientId:string;unit:string;status:string;amountCents:number;date:string;notes:string;url:string;company?:Company;period?:string;paidDate?:string;startDate?:string;endDate?:string;recurring?:boolean;referenceId?:string;owner?:string;priority?:string;email?:string;phone?:string;service?:string;source?:string;nextAction?:string;time?:string};
export type Row=Item&{id:string;updatedAt?:string;updatedBy?:string;createdAt?:string;createdBy?:string};
export const clientOptional=new Set<Kind>(["client","expense","task","meeting","project","document"]);
export const moneyKinds=new Set<Kind>(["monthly","payment","expense","contract","proposal"]);
export const blank=(kind:Kind):Item=>({kind,title:"",clientId:"",unit:"",status:modules[kind].statuses[0],amountCents:0,date:"",notes:"",url:"",company:"",period:"",paidDate:"",startDate:"",endDate:"",recurring:false,referenceId:"",owner:"",priority:"normal",email:"",phone:"",service:"",source:"",nextAction:"",time:""});
export function validDate(s:string){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+"T00:00:00Z"))&&new Date(s+"T00:00:00Z").toISOString().slice(0,10)===s}
export function validPeriod(s:string){return /^\d{4}-(0[1-9]|1[0-2])$/.test(s)}
export function todayBR(now=new Date()){return new Intl.DateTimeFormat("sv-SE",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(now)}
export const sum=(rows:Row[])=>rows.reduce((a,r)=>a+r.amountCents,0);
export function companyOf(r:Row,rows:Row[]):Company{return r.company||rows.find(c=>c.kind==="client"&&c.id===r.clientId)?.company||""}
export function scoped(rows:Row[],company:string){return company==="all"?rows:rows.filter(r=>companyOf(r,rows)===company)}
export function finance(rows:Row[],period:string){
 const monthly=rows.filter(r=>r.kind==="monthly"&&r.period===period&&r.status!=="cancelada");
 const payments=rows.filter(r=>r.kind==="payment"&&r.status!=="cancelado");
 const received=payments.filter(r=>r.status==="recebido"&&r.paidDate?.slice(0,7)===period);
 const expenses=rows.filter(r=>r.kind==="expense"&&r.status!=="cancelada");
 const expectedExpenses=expenses.filter(r=>r.period===period);
 const paid=expenses.filter(r=>r.status==="paga"&&r.paidDate?.slice(0,7)===period);
 const outstanding=monthly.reduce((a,m)=>a+Math.max(0,m.amountCents-sum(payments.filter(p=>p.referenceId===m.id&&p.status==="recebido"))),0);
 // Linked payment entries describe the same receivable; do not count them twice.
 const standalone=payments.filter(r=>r.status==="pendente"&&!r.referenceId&&r.period===period);
 const contracts=rows.filter(r=>r.kind==="contract"&&r.status==="assinado"&&r.recurring===true&&r.startDate&&validDate(r.startDate)&&r.startDate.slice(0,7)<=period&&(!r.endDate||r.endDate.slice(0,7)>=period));
 const review=rows.filter(r=>moneyKinds.has(r.kind)&&((["monthly","expense","payment"].includes(r.kind)&&!r.period)||(r.kind==="payment"&&r.status==="recebido"&&!r.paidDate)||(r.kind==="expense"&&r.status==="paga"&&!r.paidDate)));
 return {monthly,received,paid,expectedExpenses,planned:sum(monthly),mrr:sum(contracts),cashIn:sum(received),cashOut:sum(paid),net:sum(received)-sum(paid),outstanding:outstanding+sum(standalone),review};
}
export function dueItems(rows:Row[],today:string){
 const closed=new Set(["cancelado","cancelada","concluído","concluída","realizada","entregue","arquivado","encerrado","recusada","paga","recebido","inativo","aprovada"]);
 return rows.filter(r=>!closed.has(r.status)&&["task","delivery","meeting","expense","payment","proposal","project","report","contract"].includes(r.kind)).map(r=>({r,due:r.kind==="contract"?r.endDate||"":r.date})).filter(x=>x.due&&validDate(x.due)).sort((a,b)=>a.due.localeCompare(b.due)).map(x=>({...x,overdue:x.due<today}));
}
export function canGenerate(rows:Row[],source:Row,period:string){if(!validPeriod(period)||!source.recurring||source.status==="cancelada"||source.status==="encerrado")return false;if(source.kind==="contract"&&(source.status!=="assinado"||!source.startDate||source.startDate.slice(0,7)>period||Boolean(source.endDate&&source.endDate.slice(0,7)<period)))return false;if(source.kind==="expense"&&(!source.period||source.period>=period))return false;const root=source.referenceId||source.id;const rootRecord=rows.find(r=>r.id===root);if(source.kind==="expense"&&(!rootRecord?.recurring||rootRecord.status==="cancelada"))return false;const kind=source.kind==="contract"?"monthly":"expense";return ["contract","expense"].includes(source.kind)&&!rows.some(r=>r.kind===kind&&r.period===period&&(r.referenceId===root||r.id===root))}
export function csvCell(v:unknown){let s=String(v??"");if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
