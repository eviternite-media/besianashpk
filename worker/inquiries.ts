import type { D1Database } from "@cloudflare/workers-types";

interface InquiryEnv {
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_API_TOKEN?: string;
  INQUIRY_CHALLENGE_SECRET?: string;
}

const SITE_ORIGIN = "https://cyclon-kosovo.multipllando200.chatgpt.site";
const PUBLIC_ORIGINS = new Set([
  "https://www.besianashpk.com",
  "https://besianashpk.com",
  SITE_ORIGIN,
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:3000",
  "http://localhost:3001",
]);
const REQUEST_TYPES = new Set(["Produkt", "Ofertë biznesi", "Dokumentacion teknik", "Tjetër"]);
const textEncoder = new TextEncoder();
let schemaReady: Promise<void> | null = null;

export async function handleInquiryApi(request: Request, env: InquiryEnv): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === "/api/inquiries" && request.method === "OPTIONS") {
    return corsResponse(request, new Response(null, { status: 204 }));
  }
  if (url.pathname === "/api/inquiries/challenge" && request.method === "GET") {
    if (!isAllowedPublicRequest(request)) return json({ error: "Origjina nuk lejohet." }, 403);
    return corsResponse(request, await createChallenge(env));
  }
  if (url.pathname === "/api/inquiries" && request.method === "POST") {
    if (!isAllowedPublicRequest(request)) return json({ error: "Origjina nuk lejohet." }, 403);
    return corsResponse(request, await createInquiry(request, env));
  }
  if (url.pathname === "/api/admin/session" && request.method === "GET") {
    const admin = authorizeAdmin(request, env, false);
    if (!admin.ok) return json({ error: admin.message }, admin.status);
    return json({ ok: true, email: admin.email });
  }
  if (url.pathname === "/api/admin/inquiries" && request.method === "GET") {
    const admin = authorizeAdmin(request, env, false);
    if (!admin.ok) return json({ error: admin.message }, admin.status);
    await ensureSchema(env.DB);
    const status = url.searchParams.get("status");
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 100, 1), 200);
    const query = status && ["new", "contacted", "archived"].includes(status)
      ? env.DB.prepare("SELECT id, created_at, name, company, phone, email, city, request_type, product, message, status, source FROM inquiries WHERE status = ? ORDER BY id DESC LIMIT ?").bind(status, limit)
      : env.DB.prepare("SELECT id, created_at, name, company, phone, email, city, request_type, product, message, status, source FROM inquiries ORDER BY id DESC LIMIT ?").bind(limit);
    const result = await query.all();
    return json({ inquiries: result.results });
  }
  if (url.pathname === "/api/admin/notifications" && request.method === "GET") {
    const admin = authorizeAdmin(request, env, true);
    if (!admin.ok) return json({ error: admin.message }, admin.status);
    await ensureSchema(env.DB);
    const after = Math.max(Number(url.searchParams.get("after")) || 0, 0);
    const result = await env.DB.prepare("SELECT id, created_at, name, company, phone, city, request_type, product FROM inquiries WHERE id > ? ORDER BY id ASC LIMIT 50").bind(after).all();
    const latest = await env.DB.prepare("SELECT COALESCE(MAX(id), 0) AS latest_id FROM inquiries").first<{ latest_id: number }>();
    return json({ inquiries: result.results, latestId: latest?.latest_id ?? after });
  }

  const statusMatch = url.pathname.match(/^\/api\/admin\/inquiries\/(\d+)$/);
  if (statusMatch && request.method === "PATCH") {
    const admin = authorizeAdmin(request, env, false);
    if (!admin.ok) return json({ error: admin.message }, admin.status);
    const body = await readJson(request);
    const status = typeof body?.status === "string" ? body.status : "";
    if (!["new", "contacted", "archived"].includes(status)) return json({ error: "Status i pavlefshëm." }, 400);
    await ensureSchema(env.DB);
    await env.DB.prepare("UPDATE inquiries SET status = ? WHERE id = ?").bind(status, Number(statusMatch[1])).run();
    return json({ ok: true });
  }

  return null;
}

async function createChallenge(env: InquiryEnv): Promise<Response> {
  const secret = env.INQUIRY_CHALLENGE_SECRET;
  if (!secret) return json({ error: "Verifikimi nuk është konfiguruar." }, 503);
  const a = randomInt(2, 9);
  const b = randomInt(1, 9);
  const issuedAt = Date.now();
  const nonce = randomToken(12);
  const payload = `${a}.${b}.${issuedAt}.${nonce}`;
  const signature = await sign(payload, secret);
  return json({ question: `${a} + ${b}`, token: encodeBase64Url(JSON.stringify({ a, b, issuedAt, nonce, signature })) });
}

async function createInquiry(request: Request, env: InquiryEnv): Promise<Response> {
  if (!env.DB) return json({ error: "Ruajtja e kërkesave nuk është e disponueshme." }, 503);
  if (Number(request.headers.get("content-length") || 0) > 20_000) return json({ error: "Kërkesa është shumë e madhe." }, 413);
  const body = await readJson(request);
  if (!body) return json({ error: "Të dhënat nuk janë të vlefshme." }, 400);
  if (stringValue(body.website, 200)) return json({ ok: true }, 202);

  const name = stringValue(body.name, 100);
  const company = stringValue(body.company, 120);
  const phone = stringValue(body.phone, 40);
  const email = stringValue(body.email, 160);
  const city = stringValue(body.city, 80);
  const requestType = stringValue(body.type, 50);
  const product = stringValue(body.product, 200);
  const message = stringValue(body.message, 3000);
  const answer = Number(body.humanAnswer);
  const challengeToken = stringValue(body.challengeToken, 1000);

  if (name.length < 2 || phone.length < 5 || city.length < 2 || message.length < 10 || body.consent !== true) {
    return json({ error: "Plotësoni të gjitha fushat e detyrueshme." }, 400);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Email-i nuk është i vlefshëm." }, 400);
  if (!REQUEST_TYPES.has(requestType)) return json({ error: "Lloji i kërkesës nuk është i vlefshëm." }, 400);
  if (!await verifyChallenge(challengeToken, answer, env.INQUIRY_CHALLENGE_SECRET || "")) {
    return json({ error: "Verifikimi njerëzor nuk kaloi. Provoni pyetjen e re." }, 400);
  }

  await ensureSchema(env.DB);
  const now = Math.floor(Date.now() / 1000);
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = await sign(ip, env.INQUIRY_CHALLENGE_SECRET || "rate-limit");
  const recent = await env.DB.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE ip_hash = ? AND created_at > ?").bind(ipHash, now - 3600).first<{ count: number }>();
  if ((recent?.count ?? 0) >= 5) return json({ error: "Janë dërguar shumë kërkesa. Provoni përsëri pas një ore." }, 429);

  await env.DB.prepare("DELETE FROM inquiries WHERE created_at < ?").bind(now - 31_536_000).run();
  const result = await env.DB.prepare("INSERT INTO inquiries (created_at, name, company, phone, email, city, request_type, product, message, status, source, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'website', ?)")
    .bind(now, name, company, phone, email, city, requestType, product, message, ipHash).run();
  return json({ ok: true, id: result.meta.last_row_id, message: "Kërkesa u dërgua me sukses." }, 201);
}

async function ensureSchema(db: D1Database): Promise<void> {
  schemaReady ??= (async () => {
    await db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', city TEXT NOT NULL, request_type TEXT NOT NULL, product TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', source TEXT NOT NULL DEFAULT 'website', ip_hash TEXT NOT NULL)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at ON inquiries(status, created_at)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_inquiries_ip_created_at ON inquiries(ip_hash, created_at)"),
    ]);
    await db.prepare("PRAGMA optimize").run();
  })();
  return schemaReady;
}

function authorizeAdmin(request: Request, env: InquiryEnv, tokenOnly: boolean): { ok: true; email: string } | { ok: false; status: number; message: string } {
  const suppliedToken = request.headers.get("x-admin-token") || "";
  if (suppliedToken && env.ADMIN_API_TOKEN && safeEqual(suppliedToken, env.ADMIN_API_TOKEN)) return { ok: true, email: env.ADMIN_EMAIL || "local-notifier" };
  if (tokenOnly) return { ok: false, status: 401, message: "Autorizimi mungon." };
  const email = (request.headers.get("oai-authenticated-user-email") || "").trim().toLowerCase();
  if (!email) return { ok: false, status: 401, message: "Kyçuni me ChatGPT për të hapur panelin." };
  if (!env.ADMIN_EMAIL || email !== env.ADMIN_EMAIL.trim().toLowerCase()) return { ok: false, status: 403, message: "Kjo llogari nuk ka qasje në panel." };
  return { ok: true, email };
}

async function verifyChallenge(token: string, answer: number, secret: string): Promise<boolean> {
  if (!token || !secret || !Number.isFinite(answer)) return false;
  try {
    const value = JSON.parse(decodeBase64Url(token)) as { a: number; b: number; issuedAt: number; nonce: string; signature: string };
    if (![value.a, value.b, value.issuedAt].every(Number.isFinite) || typeof value.nonce !== "string" || typeof value.signature !== "string") return false;
    const age = Date.now() - value.issuedAt;
    if (age < 1_500 || age > 15 * 60_000 || answer !== value.a + value.b) return false;
    return safeEqual(await sign(`${value.a}.${value.b}.${value.issuedAt}.${value.nonce}`, secret), value.signature);
  } catch {
    return false;
  }
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return encodeBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(value))));
}

function randomInt(min: number, max: number): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return min + (values[0] % (max - min + 1));
}

function randomToken(length: number): string {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return encodeBase64Url(values);
}

function stringValue(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value = await request.json();
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function isAllowedPublicRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return PUBLIC_ORIGINS.has(origin);
  return new URL(request.url).hostname.endsWith("chatgpt.site") || ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname);
}

function corsResponse(request: Request, response: Response): Response {
  const origin = request.headers.get("origin");
  if (!origin || !PUBLIC_ORIGINS.has(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Headers", "content-type");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.append("Vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function safeEqual(a: string, b: string): boolean {
  const left = textEncoder.encode(a);
  const right = textEncoder.encode(b);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

function encodeBase64Url(value: string | Uint8Array): string {
  const bytes = typeof value === "string" ? textEncoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}
