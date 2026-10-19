// GEVT-Wissensdatenbank: answers questions from the encrypted knowledge base (Sifu Göksel's teaching and Ralf's own notes).
// The texts never leave this function: the page only gets the answer and the headings of the sections that were used.
// Secrets: ANTHROPIC_API_KEY (shared with generate-text), GEVT_DATA_KEY (encrypts the sections: 32 random bytes in base64
// or a passphrase of at least 20 characters).
// Optional: GEVT_DAILY_LIMIT (default 150 questions per person and day).
// Actions (POST JSON, signed in): {action:"status"}, {action:"ask", frage, verlauf}, {action:"import", reset, start, chunks} (admin only).
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DAILY_LIMIT = Number(Deno.env.get("GEVT_DAILY_LIMIT") ?? "150");
const ANSWER_MODEL = "claude-sonnet-5-5";
const QUICK_MODEL = "claude-haiku-5-5";

const anthropic = new Anthropic();
const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });

// ---------- Encryption (AES-256-GCM, one IV per section) ----------
type Chunk = { f: string; l: string; h: string; t: string; g: number | null; k: "text" | "always" | "terms" };
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string): Uint8Array<ArrayBuffer> => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
let keyPromise: Promise<CryptoKey> | null = null;
// GEVT_DATA_KEY is either 32 random bytes in base64 or a long passphrase (at least 20 characters), stretched with PBKDF2.
async function makeKey() {
  const raw = (Deno.env.get("GEVT_DATA_KEY") ?? "").trim();
  if (!raw) throw new Error("GEVT_DATA_KEY fehlt");
  let bytes: Uint8Array<ArrayBuffer> | null = null;
  try { bytes = /^[A-Za-z0-9+/]{43}=$/.test(raw) ? unb64(raw) : null; } catch { bytes = null; }
  if (bytes && bytes.length === 32) return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
  if (raw.length < 20) throw new Error("GEVT_DATA_KEY ist zu kurz (mindestens 20 Zeichen)");
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(raw), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode("gevt-wissen-v1"), iterations: 210000 },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
function dataKey() {
  if (!keyPromise) keyPromise = makeKey();
  keyPromise.catch(() => { keyPromise = null; });
  return keyPromise;
}
async function seal(c: Chunk) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await dataKey(), new TextEncoder().encode(JSON.stringify(c)));
  return { iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}
async function open(iv: string, ct: string): Promise<Chunk> {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, await dataKey(), unb64(ct));
  return JSON.parse(new TextDecoder().decode(pt));
}

// ---------- Knowledge base cache (per function instance) ----------
const STOP = new Set(("der die das und oder ein eine einer eines einem einen zu zum zur im in am an auf aus mit von vom fuer bei ist sind war wie was " +
  "wer wo wann warum welche welcher welches sagt sag sage erklaert erklaeren mir mich ich du dein deine deinem meinen meine mein es er sie wir ihr den dem " +
  "des nicht auch noch nur so dazu darueber ueber hat habe haben gibt kann koennen soll sollte man als dass da denn wenn dann doch mal bitte genau etwas " +
  "viel mehr bedeutet heisst steht goeksel goksel sifu ralf notiert notizen").split(" "));
const SYN: Record<string, string> = { sau: "sao", chun: "tsun", wing: "ving", tze: "jee", tse: "jee", tsze: "jee", jie: "jee", tschi: "chi", tschum: "chum",
  kuits: "kuit", puppe: "holzpuppe", dummy: "holzpuppe", jong: "holzpuppe", stock: "langstock", messer: "doppelmesser", snt: "siu", ck: "chum", bj: "biu" };
const norm = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").normalize("NFKD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const stem = (w: string) => (/^\d+$/.test(w) || w.length < 5 ? w : w.replace(/(ungen|ung|heit|keit|en|er|es|em|e|n|s)$/, ""));
const toks = (s: string) => norm(s).split(" ").filter(Boolean).map((w) => SYN[w] || w).map(stem);

type Doc = { c: Chunk; tf: Map<string, number>; len: number; head: string; body: string };
type KB = { docs: Doc[]; df: Map<string, number>; avg: number; always: Chunk[]; terms: string; loaded: number };
let kbCache: Promise<KB> | null = null;
const KB_TTL = 15 * 60 * 1000;

async function loadKb(): Promise<KB> {
  const rows: { iv: string; ct: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin.from("gevt_chunks").select("iv,ct").order("id").range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const chunks = await Promise.all(rows.map((r) => open(r.iv, r.ct)));
  const docs: Doc[] = [];
  const always: Chunk[] = [];
  let terms = "";
  for (const c of chunks) {
    if (c.k === "terms") { terms = c.t; continue; }
    if (c.k === "always") always.push(c);
    const tt = toks(`${c.h} ${c.h} ${c.h} ${c.t}`);
    const tf = new Map<string, number>();
    for (const t of tt) tf.set(t, (tf.get(t) || 0) + 1);
    docs.push({ c, tf, len: tt.length, head: ` ${norm(c.h)} `, body: ` ${norm(c.t)} ` });
  }
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  const avg = docs.reduce((a, d) => a + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avg, always, terms, loaded: Date.now() };
}
async function kb() {
  if (kbCache) {
    const k = await kbCache.catch(() => null);
    if (k && Date.now() - k.loaded < KB_TTL) return k;
  }
  kbCache = loadKb();
  return kbCache;
}

function search(k: KB, query: string, max = 12, budget = 32000) {
  const qt = [...new Set(toks(query).filter((t) => !STOP.has(t)))];
  const raw = norm(query).split(" ").filter((w) => w && !STOP.has(w));
  const pairs: string[] = [];
  for (let i = 0; i + 1 < raw.length; i++) pairs.push(` ${raw[i]} ${raw[i + 1]} `);
  const N = k.docs.length;
  const scored = k.docs.map((d) => {
    let s = 0;
    for (const t of qt) {
      const f = d.tf.get(t);
      if (!f) continue;
      const n = k.df.get(t)!;
      s += Math.log(1 + (N - n + 0.5) / (n + 0.5)) * f * 2.2 / (f + 1.2 * (0.25 + 0.75 * d.len / k.avg));
    }
    for (const p of pairs) s += d.head.includes(p) ? 6 : d.body.includes(p) ? 2 : 0;
    if (d.c.f === "00") s *= 0.6; // the index only points the way
    return { d, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const out: Chunk[] = [];
  const perFile: Record<string, number> = {};
  let size = 0;
  for (const { d } of scored) {
    if (out.length >= max) break;
    if ((perFile[d.c.f] || 0) >= 4 || d.c.k === "always") continue;
    if (size + d.c.t.length > budget && out.length) continue;
    out.push(d.c);
    perFile[d.c.f] = (perFile[d.c.f] || 0) + 1;
    size += d.c.t.length;
  }
  return out;
}

// ---------- Prompts ----------
const RULES = `Du bist Ralfs Nachschlage-Partner für GE Ving Tsun (GEVT, Schule von Sifu Göksel Erdogan). Du antwortest aus Ralfs Wissensdatenbank.

Regeln:
- Antworte nur aus den mitgeschickten Auszügen. Steht etwas nicht darin, sag das klar und gib kein allgemeines Wing-Chun-Wissen als GEVT-Lehre aus.
- Trenne immer erkennbar, was Sifu Göksel sagt (Lehrplan-Texte, Masterclass, YouTube-Videos, Unterlagen) und was aus Ralfs eigenen Mitschriften stammt (Notizbuch 1 und 2, Apple-Notizen). Formuliere z. B. „Göksel sagt …“ und „In deinem Notizbuch steht …“. Zusammenfassen und in eigenen Worten erklären ist erlaubt, solange die Quelle klar bleibt.
- [?] in Abschriften heißt unsichere Lesung: erwähne das, wenn die Antwort davon abhängt.
- Deutsch, Du-Form, wie ein Trainer im Gespräch. Standardlänge 80 bis 200 Wörter, länger nur auf Wunsch. Kein Markdown außer gelegentlich **fett** und einfachen Aufzählungen mit „- “.
- Erste Zeile genau im Format „STUFE: Grad N · Name“ (mehrere Grade mit Komma; „STUFE: allgemein“, wenn das Thema keinem Grad zugeordnet ist). Ordne nach dem Lehrplan-Inhaltsverzeichnis zu.
- Ende mit einer Zeile, die genau „QUELLEN:“ lautet, und darunter je Quelle eine Zeile, beginnend mit „G: “ für Göksel oder „R: “ für Ralfs Notizen, z. B. „G: Masterclass LE 7, Drill 3, 4:12“, „G: YouTube „Titel“ 3:15“ oder „R: Notizbuch S. 71“. Mit Zeitstempel bzw. Seite, wenn vorhanden.`;

async function rewrite(k: KB, text: string, verlauf: { r: string; t: string }[]) {
  const recent = verlauf.slice(-4).map((m) => (m.r === "u" ? "Ralf: " : "Claude: ") + m.t.slice(0, 600)).join("\n");
  try {
    const msg = await anthropic.messages.create({
      model: QUICK_MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" },
      system: [{ type: "text", text: `Du bereitest Suchanfragen für eine Wissensdatenbank zu GE Ving Tsun vor. Eingaben kommen oft per Diktat; kantonesische Begriffe werden verhört (z. B. „Sie nimm Tao“ = Siu Nim Tao, „Schi Sau“ = Chi Sao, „Tschum Kiu“ = Chum Kiu).\nBekannte Begriffe: ${k.terms}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `${recent ? "Bisheriges Gespräch:\n" + recent + "\n\n" : ""}Neue Eingabe: "${text}"\n\nAntworte nur mit JSON: {"frage": "die Frage als vollständige, eigenständige Frage mit korrigierten Fachbegriffen (Nachfragen mit dem Bezug aus dem Gespräch auflösen)", "suche": ["3 bis 8 Suchbegriffe in der Schreibweise der Liste"]}` }],
    });
    const t = msg.content.find((b) => b.type === "text");
    const m = t && t.type === "text" ? t.text.match(/\{[\s\S]*\}/) : null;
    const r = m ? JSON.parse(m[0]) : null;
    if (r && typeof r.frage === "string") return { frage: r.frage as string, suche: Array.isArray(r.suche) ? (r.suche as string[]).join(" ") : "" };
  } catch (e) {
    console.error("rewrite failed", e);
  }
  return { frage: text, suche: "" };
}

// ---------- Handlers ----------
async function ask(user: { id: string }, body: any) {
  const clean = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b-\u001f]/g, "").trim().slice(0, n) : "");
  const text = clean(body.frage, 1500);
  if (text.length < 2) return json({ error: "frage_fehlt" }, 400);
  const verlauf = (Array.isArray(body.verlauf) ? body.verlauf : []).slice(-8)
    .map((m: any) => ({ r: m?.r === "a" ? "a" : "u", t: clean(m?.t, 4000) })).filter((m: any) => m.t);

  const day = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin.from("gevt_usage").select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
  const used = usage?.count ?? 0;
  if (used >= DAILY_LIMIT) return json({ error: "tageslimit" }, 429);
  await admin.from("gevt_usage").upsert({ user_id: user.id, day, count: used + 1 });

  const k = await kb();
  if (!k.docs.length) return json({ error: "leer" }, 409);
  const rw = await rewrite(k, text, verlauf);
  const hits = search(k, `${rw.frage} ${rw.suche} ${text}`);
  const ctx = [...k.always.map((c) => ({ ...c, h: "Lehrplan-Inhaltsverzeichnis (zur Einordnung der Stufe)" })), ...hits]
    .map((c, i) => `[Auszug ${i + 1} · ${c.l} · ${c.h}${c.g ? ` · Grad ${c.g}` : ""}]\n${c.t}`).join("\n\n");
  const turns: Anthropic.MessageParam[] = [];
  for (const m of verlauf) {
    const role = m.r === "u" ? "user" : "assistant";
    if (turns.length && turns[turns.length - 1].role === role) continue;
    if (!turns.length && role === "assistant") continue;
    turns.push({ role, content: m.t });
  }
  if (turns.length && turns[turns.length - 1].role === "user") turns.pop();
  turns.push({ role: "user", content: `Auszüge aus Ralfs Wissensdatenbank zu dieser Frage:\n\n${ctx}\n\nRalfs Frage: ${text}${rw.frage !== text ? `\n(Gemeint ist vermutlich: ${rw.frage})` : ""}` });

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (o: unknown) => ctrl.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      send({ treffer: hits.map((c) => ({ q: c.l, h: c.h.replace(/\s*https?:\/\/\S+/, ""), g: c.g })), frage: rw.frage });
      try {
        // Thinking is on by default on this model and counts against max_tokens, so leave room; low effort suits a chat answer.
        const s = anthropic.messages.stream({ model: ANSWER_MODEL, max_tokens: 16000, output_config: { effort: "low" }, system: RULES, messages: turns });
        for await (const ev of s) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") send({ d: ev.delta.text });
        }
        const fin = await s.finalMessage();
        send({ ende: true, abgeschnitten: fin.stop_reason === "max_tokens" });
      } catch (e) {
        console.error("answer failed", e);
        send({ fehler: e instanceof Anthropic.RateLimitError ? "ausgelastet" : "ki_fehler" });
      }
      ctrl.close();
    },
  });
  return new Response(stream, { headers: { ...CORS, "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

async function importChunks(body: any) {
  const chunks = Array.isArray(body.chunks) ? body.chunks : [];
  const start = Number(body.start);
  if (!Number.isInteger(start) || start < 0 || chunks.length > 200) return json({ error: "ungueltig" }, 400);
  if (body.reset) {
    const { error } = await admin.from("gevt_chunks").delete().gte("id", 0);
    if (error) return json({ error: "db", detail: error.message }, 500);
  }
  const s = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");
  const rows = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i] ?? {};
    const k = c.k === "always" || c.k === "terms" ? c.k : "text";
    const g = Number.isInteger(c.g) && c.g >= 1 && c.g <= 8 ? c.g : null;
    rows.push({ id: start + i, ...(await seal({ f: s(c.f, 4), l: s(c.l, 80), h: s(c.h, 400), t: s(c.t, 20000), g, k })) });
  }
  if (rows.length) {
    const { error } = await admin.from("gevt_chunks").upsert(rows);
    if (error) return json({ error: "db", detail: error.message }, 500);
  }
  kbCache = null;
  return json({ ok: true, gespeichert: rows.length });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  // Membership is checked with the service role, so a member row cannot be faked from the page.
  const { data: member } = await admin.from("gevt_members").select("role").eq("user_id", user.id).maybeSingle();
  if (!member) return json({ error: "nicht_freigeschaltet" }, 403);

  const body = await req.json().catch(() => ({}));
  try {
    if (body.action === "status") {
      const { count } = await admin.from("gevt_chunks").select("id", { count: "exact", head: true });
      return json({ ok: true, rolle: member.role, abschnitte: count ?? 0 });
    }
    if (body.action === "ask") return await ask(user, body);
    if (body.action === "import") {
      if (member.role !== "admin") return json({ error: "nur_admin" }, 403);
      return await importChunks(body);
    }
    return json({ error: "unbekannte_aktion" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "server", detail: String((e as Error)?.message ?? e).slice(0, 160) }, 500);
  }
});
