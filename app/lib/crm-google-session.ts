import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { googleClientId, googleClientSecret, GOOGLE_REPUTATION_REDIRECT_URI } from "./reputation-google-session";

const origin="https://eyagencia.com.br";
const stateCookie="__Host-ey_crm_oauth";
const sessionCookie="__Host-ey_crm_session";
const options={httpOnly:true,secure:true,sameSite:"lax" as const,path:"/"};
function allowed(email:string){return (process.env.EY_CRM_ADMIN_EMAILS||"").split(",").map(e=>e.trim().toLowerCase()).includes(email.toLowerCase());}
function sign(body:string){return createHmac("sha256",googleClientSecret()).update("ey-crm-session-v1:"+body).digest("base64url");}
function equal(a:string,b:string){return a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
function redirectError(code:string){return NextResponse.redirect(origin+"/admin?login="+encodeURIComponent(code),303);}
export function isCrmState(state:string|null){return Boolean(state?.startsWith("crm."));}
export function validCrmOrigin(request:Request){
 const h=request.headers.get("origin");
 return h===origin||h==="https://www.eyagencia.com.br";
}
export async function beginCrmLogin(){
 try{
  if(!(process.env.EY_CRM_ADMIN_EMAILS||"").trim())return redirectError("config");
  const state="crm."+randomBytes(32).toString("base64url");
  const verifier=randomBytes(48).toString("base64url");
  const challenge=createHash("sha256").update(verifier).digest("base64url");
  const jar=await cookies();
  jar.set(stateCookie,JSON.stringify({state,verifier}),{...options,maxAge:600});
  const url=new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search=new URLSearchParams({client_id:googleClientId(),redirect_uri:GOOGLE_REPUTATION_REDIRECT_URI,response_type:"code",scope:"openid email profile",state,code_challenge:challenge,code_challenge_method:"S256",prompt:"select_account",access_type:"online"}).toString();
  return NextResponse.redirect(url,303);
 }catch{return redirectError("config");}
}
export async function finishCrmLogin(request:Request){
 const params=new URL(request.url).searchParams;const state=params.get("state");
 const jar=await cookies();const stored=jar.get(stateCookie)?.value;jar.set(stateCookie,"",{...options,maxAge:0});
 try{
  if(!stored||!state)return redirectError("invalid");
  const expected=JSON.parse(stored);
  if(typeof expected.state!=="string"||typeof expected.verifier!=="string"||!equal(expected.state,state))return redirectError("invalid");
  if(params.has("error"))return redirectError("cancelled");
  const code=params.get("code");if(!code)return redirectError("invalid");
  const token=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:googleClientId(),client_secret:googleClientSecret(),code,grant_type:"authorization_code",redirect_uri:GOOGLE_REPUTATION_REDIRECT_URI,code_verifier:expected.verifier}),cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!token.ok)return redirectError("provider");
  const data=await token.json();if(typeof data.access_token!=="string")return redirectError("provider");
  const info=await fetch("https://openidconnect.googleapis.com/v1/userinfo",{headers:{Authorization:"Bearer "+data.access_token},cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!info.ok)return redirectError("provider");
  const user=await info.json();
  if(user.email_verified!==true||typeof user.email!=="string"||typeof user.sub!=="string"||!allowed(user.email))return redirectError("denied");
  const body=Buffer.from(JSON.stringify({sub:user.sub,email:user.email.toLowerCase(),exp:Date.now()+8*60*60*1000}),"utf8").toString("base64url");
  jar.set(sessionCookie,body+"."+sign(body),{...options,maxAge:8*60*60});
  return NextResponse.redirect(origin+"/admin",303);
 }catch{return redirectError("provider");}
}
export async function getCrmUser(){
 try{
  const jar=await cookies();const value=jar.get(sessionCookie)?.value;
  if(!value||value.length>3000)return null;
  const [body,signature,...extra]=value.split(".");
  if(!body||!signature||extra.length||!equal(sign(body),signature))return null;
  const user=JSON.parse(Buffer.from(body,"base64url").toString("utf8"));
  if(typeof user.sub!=="string"||typeof user.email!=="string"||typeof user.exp!=="number"||user.exp<=Date.now()||!allowed(user.email))return null;
  return {sub:user.sub,email:user.email};
 }catch{return null;}
}
export async function endCrmLogin(){const jar=await cookies();jar.set(sessionCookie,"",{...options,maxAge:0});jar.set(stateCookie,"",{...options,maxAge:0});}
