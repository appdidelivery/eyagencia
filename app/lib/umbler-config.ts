export const MAIL_ACCOUNTS={contato:"contato@eyagencia.com.br",financeiro:"financeiro@eyagencia.com.br"} as const;
export type MailAccount=keyof typeof MAIL_ACCOUNTS;
export function mailAccount(value:unknown):value is MailAccount{return value==="contato"||value==="financeiro"}
export class UmblerConfigError extends Error{
 readonly missingKey:"UMBLER_CONTATO_PASSWORD"|"UMBLER_FINANCEIRO_PASSWORD";
 constructor(missingKey:"UMBLER_CONTATO_PASSWORD"|"UMBLER_FINANCEIRO_PASSWORD"){super("Credencial não disponível neste ambiente.");this.name="UmblerConfigError";this.missingKey=missingKey;}
}
// Accounts and TLS endpoints are fixed to the explicitly approved Umbler service.
// Do not accept a configurable destination that could receive mailbox credentials.
export function umblerConfig(account:MailAccount,env:Record<string,string|undefined>){
 if(!mailAccount(account))throw Error("config");
 const key=account==="contato"?"UMBLER_CONTATO_PASSWORD":"UMBLER_FINANCEIRO_PASSWORD";
 const pass=env[key];
 if(typeof pass!=="string"||!pass.trim())throw new UmblerConfigError(key);
 return {user:MAIL_ACCOUNTS[account],pass,imapHost:"imap.umbler.com",smtpHost:"smtp.umbler.com",imapPort:993,smtpPort:587};
}
export function safeMailFailure(error:unknown){
 const e=error as {code?:unknown;authenticationFailed?:unknown;responseStatus?:unknown};
 if(e?.authenticationFailed===true||e?.code==="EAUTH"||e?.responseStatus==="NO")return "Autenticação recusada pelo servidor";
 if(e?.code==="ETIMEDOUT"||e?.code==="ECONNECTION"||e?.code==="ECONNREFUSED"||e?.code==="ECONNRESET"||e?.code==="ENOTFOUND"||e?.code==="EAI_AGAIN")return "Falha de conexão ou tempo limite";
 if(e?.code==="ETLS"||e?.code==="CERT_HAS_EXPIRED"||e?.code==="ERR_TLS_CERT_ALTNAME_INVALID"||e?.code==="UNABLE_TO_VERIFY_LEAF_SIGNATURE")return "Falha de segurança TLS";
 return "Servidor não confirmou a operação";
}
