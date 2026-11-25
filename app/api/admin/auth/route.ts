import { beginCrmLogin } from "@/app/lib/crm-google-session";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function GET(){return beginCrmLogin();}
