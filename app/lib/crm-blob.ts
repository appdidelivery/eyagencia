import { randomUUID } from "node:crypto";

export class CrmError extends Error {
 constructor(message:string,public status:number){super(message);}
}

type BlobConfig={token:string;storeId:string};

// The metadata API (the same endpoint used by SDK head()) returns the
// storage version, not a potentially weak HTTP representation ETag.
export function strongVersion(value:unknown):string|null {
 if(typeof value!=="string")return null;
 if(/^"[^"\r\n]+"$/.test(value))return value;
 if(/^[A-Za-z0-9_-]+$/.test(value))return '"'+value+'"';
 return null;
}

export async function readSnapshot<T>(path:string,{token,storeId}:BlobConfig,fetcher:typeof fetch=fetch):Promise<{rows:T[];version:string}|null>{
 const url="https://"+storeId+".private.blob.vercel-storage.com/"+path;
 const options={cache:"no-store" as const,redirect:"error" as const};
 async function metadata(){
  const r=await fetcher("https://vercel.com/api/blob/?"+new URLSearchParams({url}),{
   ...options,headers:{Authorization:"Bearer "+token,"x-vercel-blob-store-id":storeId,"x-api-version":"13","x-api-blob-request-id":randomUUID(),"x-api-blob-request-attempt":"0"},signal:AbortSignal.timeout(10000)
  });
  if(r.status===404)return null;
  if(!r.ok)throw new CrmError("Não foi possível consultar a versão do armazenamento privado.",503);
  const data=await r.json();
  const version=strongVersion(data?.etag);
  if(!version)throw new CrmError("Versão segura do armazenamento indisponível.",503);
  return version;
 }
 for(let attempt=0;attempt<3;attempt++){
  const before=await metadata();
  if(!before)return null;
  const response=await fetcher(url+"?cache=0",{
   ...options,headers:{Authorization:"Bearer "+token,"Accept-Encoding":"identity"},signal:AbortSignal.timeout(10000)
  });
  if(response.status===404){if(!(await metadata()))return null;continue;}
  if(!response.ok)throw new CrmError("Não foi possível consultar o armazenamento privado.",503);
  const representationVersion=strongVersion(response.headers.get("etag"));
  const rows=await response.json();
  if(!Array.isArray(rows)||rows.length>10000)throw new CrmError("Base de registros inválida.",503);
  const after=await metadata();
  // A weak representation ETag is not used as the write precondition.
  // Bracket the uncached read with authoritative metadata to reject races.
  if(before===after&&(!representationVersion||representationVersion===before))return {rows,version:before};
 }
 throw new CrmError("Outra alteração ocorreu durante a leitura. Atualize o painel antes de salvar.",409);
}
