import { NextResponse } from "next/server";
import { endCrmLogin, validCrmOrigin } from "@/app/lib/crm-google-session";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 if(!validCrmOrigin(request))return NextResponse.json({error:"Origem inválida."},{status:403});
 await endCrmLogin();return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
}
