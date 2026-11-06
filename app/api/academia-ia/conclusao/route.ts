import { NextRequest, NextResponse } from "next/server";
import { createCipheriv, createHmac, randomBytes } from "node:crypto";
import { createClient } from "next-sanity";
import { missions, tracks, type TrackId } from "../../../academia-ia/data";

export const runtime = "nodejs";
const agencyNumber = "554832200260";
const acceptedCourses = new Set(tracks.map(t => t.id));
const allowedOrigins = new Set([
  "https://eyagencia.com.br",
  "https://www.eyagencia.com.br",
  "https://eyagencia.vercel.app"
]);

function normalizePhone(input: unknown) {
  if (typeof input !== "string") return null;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
  if (!/^55[1-9][0-9]{9,10}$/.test(digits)) return null;
  const local = digits.slice(4);
  if (/^(\d)\1+$/.test(local)) return null;
  return digits;
}
function safeName(input: unknown) {
  if (typeof input !== "string") return null;
  const name = input.normalize("NFC").replace(/\s+/g, " ").trim();
  if (name.length < 3 || name.length > 90 || !/^[\p{L}\p{M}][\p{L}\p{M} '.-]*$/u.test(name)) return null;
  return name;
}
function encodeContact(name: string, phone: string, hexSecret: string) {
  const key = Buffer.from(hexSecret, "hex");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify({ name, phone }), "utf8"), cipher.final()]);
  return { iv: iv.toString("base64"), ciphertext: data.toString("base64"), tag: cipher.getAuthTag().toString("base64") };
}
function answer(status: number, data: Record<string, unknown>) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 6000) return answer(413, { error: "Requisição muito grande." });
    const origin = request.headers.get("origin");
    if (origin && !allowedOrigins.has(origin) && origin !== request.nextUrl.origin) return answer(403, { error: "Origem não autorizada." });
    const site = request.headers.get("sec-fetch-site");
    if (site && site !== "same-origin" && site !== "same-site") return answer(403, { error: "Origem não autorizada." });
    const referer = request.headers.get("referer");
    if (referer) {
      const url = new URL(referer);
      if (url.origin !== request.nextUrl.origin || url.pathname !== "/academia-ia") return answer(403, { error: "Página não autorizada." });
    }
    const body = await request.json();
    if (!body || typeof body !== "object" || body.honeypot) return answer(400, { error: "Dados inválidos." });
    const courseId = body.courseId as TrackId;
    if (!acceptedCourses.has(courseId)) return answer(400, { error: "Curso inválido." });
    const name = safeName(body.name);
    const phone = normalizePhone(body.whatsapp);
    if (!name || !phone) return answer(400, { error: "Informe nome e WhatsApp válidos, com DDD." });
    if (body.consent !== true) return answer(400, { error: "É necessário autorizar o registro da conclusão e o compartilhamento com a agência." });
    const required = missions.filter(m => m.track === courseId).map(m => m.id);
    const reported = Array.isArray(body.completedMissions) ? body.completedMissions : [];
    const unique = new Set(reported);
    if (reported.length !== required.length || unique.size !== required.length || required.some(id => !unique.has(id))) {
      return answer(400, { error: "Conclua as cinco missões desta trilha antes do registro." });
    }
    const secret = process.env.ACADEMY_CONTACT_ENCRYPTION_KEY;
    if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) return answer(503, { error: "O registro seguro está indisponível no momento." });
    if (!process.env.SANITY_API_WRITE_TOKEN || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
      return answer(503, { error: "O armazenamento ainda não está configurado." });
    }
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false, apiVersion: "2026-07-01"
    });
    const course = tracks.find(t => t.id === courseId)!;
    const uniqueId = createHmac("sha256", Buffer.from(secret, "hex")).update(courseId + ":" + phone).digest("hex").slice(0, 40);
    const docId = "academyCompletion." + uniqueId;
    const now = new Date().toISOString();
    const encryptedContact = encodeContact(name, phone, secret);
    const contactAlias = "Aluno ···" + phone.slice(-4);
    const saved = await client.createIfNotExists({
      _id: docId, _type: "academyCompletion",
      courseId, courseTitle: course.title, contactAlias,
      encryptedContact, completedMissions: required,
      completedAt: now, registeredAt: now,
      studentReported: true,
      consentVersion: "academia-v1-2026-11-06", consentedAt: now,
      marketingOptIn: body.marketingOptIn === true,
      notificationChannel: "whatsapp_link",
      notificationStatus: "aguardando_envio_aluno"
    });
    // Não afirma envio automático. O link abre uma mensagem pronta, e o aluno toca em Enviar.
    const message = [
      "🎓 *Nova conclusão — IA na Prática | EyAgencia*",
      "",
      "*Aluno:* " + name,
      "*WhatsApp:* +" + phone,
      "*Curso:* " + course.title,
      "*Missões:* 5 de 5 (conclusão registrada no navegador)",
      "*Data do registro:* " + new Date(saved.registeredAt || now).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      "*ID:* " + uniqueId.slice(0, 10),
      "*Contato posterior:* " + (body.marketingOptIn === true ? "Autorizado" : "Não autorizado para marketing"),
      "",
      "Enviado voluntariamente pelo participante pelo WhatsApp."
    ].join("\n");
    const sendUrl = "https://wa.me/" + agencyNumber + "?text=" + encodeURIComponent(message);
    return answer(200, { registered: true, alreadyRegistered: saved.registeredAt !== now, sendUrl, course: course.title });
  } catch (error) {
    console.error("[academia-conclusao]", error instanceof Error ? error.name : "Erro inesperado");
    return answer(500, { error: "Não foi possível registrar sua conclusão. Tente novamente." });
  }
}
