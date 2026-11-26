export const MAIL_ACCOUNTS={contato:"contato@eyagencia.com.br",financeiro:"financeiro@eyagencia.com.br"} as const;
export type MailAccount=keyof typeof MAIL_ACCOUNTS;
export function mailAccount(value:unknown):value is MailAccount{return value==="contato"||value==="financeiro"}
export function umblerConfig(account:MailAccount,env:Record<string,string|undefined>){
 if(!mailAccount(account))throw Error("config");
 const prefix="UMBLER_"+account.toUpperCase();
 const user=env[prefix+"_EMAIL"]?.trim().toLowerCase(),pass=env[prefix+"_PASSWORD"];
 if(user!==MAIL_ACCOUNTS[account]||!pass||env.UMBLER_IMAP_HOST?.trim()!=="imap.umbler.com"||env.UMBLER_SMTP_HOST?.trim()!=="smtp.umbler.com"||env.UMBLER_IMAP_PORT?.trim()!=="993"||env.UMBLER_SMTP_PORT?.trim()!=="587")throw Error("config");
 return {user,pass,imapHost:"imap.umbler.com",smtpHost:"smtp.umbler.com",imapPort:993,smtpPort:587};
}
