// Speed-reading trainer: writes a German practice text with comprehension questions, or cuts a passage from Wikipedia /
// Project Gutenberg (public-domain classics) unchanged and only writes the questions for it.
// Secrets: ANTHROPIC_API_KEY (set via `supabase secrets set`). SUPABASE_URL, SUPABASE_ANON_KEY and
// SUPABASE_SERVICE_ROLE_KEY are provided by the Supabase runtime. Optional: AI_DAILY_LIMIT (default 10).
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const DAILY_LIMIT = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "10");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const anthropic = new Anthropic();

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    paras: { type: "array", items: { type: "string" } },
    qs: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "array", items: { type: "string" } } },
        required: ["q", "a"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "paras", "qs"],
  additionalProperties: false,
};

// Original texts: only the questions are written by Claude, the passage itself stays unchanged.
const QS_SCHEMA = {
  type: "object",
  properties: { qs: SCHEMA.properties.qs },
  required: ["qs"],
  additionalProperties: false,
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

function promptFor(topic: string) {
  return `Schreibe einen sachlichen deutschen Übungstext für ein Lesetraining für Erwachsene. Thema: ${topic}.
Länge: 240 bis 290 Wörter in 3 oder 4 Absätzen. Nur gut gesicherte Fakten, allgemein verständlich, keine Überschrift im Text, keine Aufzählungen.
Dazu genau 4 Multiple-Choice-Fragen zum Inhalt (drei Detailfragen, eine Frage zur Hauptaussage) mit jeweils 3 kurzen Antworten; die richtige Antwort steht immer an erster Stelle.
Felder: title (kurzer Titel), paras (Absätze), qs (Fragen mit q und a).`;
}

function promptForQuestions(paras: string[]) {
  return `Hier ist ein deutscher Textausschnitt für ein Lesetraining für Erwachsene:

${paras.join("\n\n")}

Schreibe genau 4 Multiple-Choice-Fragen allein zu diesem Ausschnitt (drei Detailfragen, eine Frage zur Hauptaussage) mit jeweils 3 kurzen Antworten; die richtige Antwort steht immer an erster Stelle. Feld: qs (Fragen mit q und a).`;
}

// ---------- Original sources ----------
const UA = "Speedreading-Trainer/1.0 (Lesetraining; Kontakt über die App)";
class SourceError extends Error {
  code: string;
  status: number;
  detail: string;
  constructor(code: string, status = 404, detail = "") { super(code); this.code = code; this.status = status; this.detail = detail; }
}

const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;

function cutAtSentence(p: string, maxWords: number) {
  const sentences = p.match(/[^.!?]+[.!?]+["»“”)]*\s*/g) ?? [p];
  let out = "";
  for (const s of sentences) {
    if (wc(out + s) > maxWords && out) break;
    out += s;
  }
  return out.trim();
}

// Takes consecutive paragraphs (unchanged) until about 240-320 words are reached.
function pickPassage(paras: string[], start: number) {
  const out: string[] = [];
  let words = 0;
  for (let i = start; i < paras.length && words < 240; i++) {
    let p = paras[i];
    if (words + wc(p) > 330) {
      if (words >= 160) break;
      p = cutAtSentence(p, 330 - words);
    }
    out.push(p);
    words += wc(p);
  }
  return words >= 150 ? out : null;
}

// One retry, generous timeout; the failing host and status end up in `detail` so a failure can be diagnosed.
const where = (u: string) => { const x = new URL(u); return (x.host + x.pathname).slice(0, 60); };

async function fetchOk(url: string, accept: string, timeoutMs: number, attempts = 2) {
  let detail = "";
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, Accept: accept }, redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
      if (r.ok) return r;
      detail = `${where(url)} HTTP ${r.status}`;
    } catch (e) {
      detail = `${where(url)} ${(e as Error).name}`;
    }
  }
  throw new SourceError("fetch_failed", 502, detail);
}

async function getJson(url: string, attempts = 2, timeoutMs = 20000) {
  const r = await fetchOk(url, "application/json", timeoutMs, attempts);
  try {
    return await r.json();
  } catch {
    throw new SourceError("fetch_failed", 502, `${new URL(url).host} kein JSON`);
  }
}

async function fromWikipedia(query: string) {
  const u = "https://de.wikipedia.org/w/api.php?action=query&format=json&redirects=1&generator=search&gsrlimit=1&gsrnamespace=0" +
    `&gsrsearch=${encodeURIComponent(query)}&prop=extracts|info&explaintext=1&exsectionformat=plain&exlimit=1&inprop=url`;
  const j = await getJson(u);
  const pages = Object.values(j?.query?.pages ?? {}) as any[];
  const page = pages[0];
  if (!page || typeof page.extract !== "string") throw new SourceError("not_found");
  const paras = page.extract.split(/\n+/).map((x: string) => x.trim())
    .filter((x: string) => wc(x) >= 25 && /[.!?"»“)]$/.test(x));
  const passage = pickPassage(paras, 0);
  if (!passage) throw new SourceError("too_short", 422);
  const title = String(page.title ?? query).slice(0, 80);
  const url = typeof page.fullurl === "string" ? page.fullurl : `https://de.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  return {
    title, paras: passage,
    src: { name: `Wikipedia: ${title}`, url, license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.de" },
  };
}

// Germany: protection ends 70 years after the death of the author, so authors who died up to 1955 are free in 2026.
const PD_LAST_DEATH_YEAR = 1955;

type Book = { id: number; title: string; authors: string[]; died: number; textUrl: string | null };
const flipName = (n: string) => String(n).split(",").reverse().join(" ").trim();

// First choice: Gutendex (JSON with author death years).
async function viaGutendex(query: string): Promise<Book[]> {
  const j = await getJson(`https://gutendex.com/books?languages=de&search=${encodeURIComponent(query)}`, 1, 12000);
  const free = (people: any[] | undefined) =>
    Array.isArray(people) && people.every((a) => typeof a?.death_year === "number" && a.death_year <= PD_LAST_DEATH_YEAR);
  return ((j?.results ?? []) as any[]).filter((b) => Array.isArray(b.authors) && b.authors.length > 0).map((b) => {
    const key = Object.keys(b.formats ?? {}).find((k) => k.startsWith("text/plain"));
    const ok = free(b.authors) && (!b.translators?.length || free(b.translators));
    return {
      id: b.id, title: String(b.title), authors: b.authors.map((a: any) => flipName(a.name)),
      died: ok ? Math.max(...b.authors.map((a: any) => a.death_year)) : -1, textUrl: key ? b.formats[key] : null,
    };
  });
}

// Fallback when Gutendex is down: Gutenberg's own search page, then the catalog record (RDF) of each hit for authors and dates.
async function viaGutenberg(query: string): Promise<Book[]> {
  const page = await (await fetchOk(
    `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(query + " l.de")}&submit_search=Go%21`, "text/html", 20000, 1,
  )).text();
  const ids = [...new Set([...page.matchAll(/href="\/ebooks\/(\d+)"/g)].map((m) => Number(m[1])))].slice(0, 6);
  const books: Book[] = [];
  for (const id of ids) {
    let rdf: string;
    try {
      rdf = await (await fetchOk(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.rdf`, "application/rdf+xml", 15000, 1)).text();
    } catch {
      continue;
    }
    if (!/<dcterms:language>[\s\S]*?<rdf:value[^>]*>de<\/rdf:value>/.test(rdf)) continue;
    const agents = [...rdf.matchAll(/<(?:dcterms:creator|marcrel:\w+)>\s*<pgterms:agent[\s\S]*?<\/pgterms:agent>/g)].map((m) => m[0]);
    if (!agents.length) continue;
    const years = agents.map((a) => Number(a.match(/<pgterms:deathdate[^>]*>(\d+)</)?.[1] ?? NaN));
    const names = agents.map((a) => a.match(/<pgterms:name>([^<]*)</)?.[1] ?? "").filter(Boolean);
    const ok = years.every((y) => Number.isFinite(y) && y <= PD_LAST_DEATH_YEAR);
    books.push({
      id, title: (rdf.match(/<dcterms:title>([^<]*)</)?.[1] ?? `Buch ${id}`).replace(/\s+/g, " ").trim(),
      authors: names.slice(0, 3).map(flipName), died: ok ? Math.max(...years) : -1, textUrl: null,
    });
  }
  return books;
}

// Gutenberg keeps a book's text under several names, and some books only have an HTML edition, so try them in turn.
async function bookText(book: Book): Promise<string> {
  const id = book.id;
  const plain = [book.textUrl, `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`, `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`, `https://www.gutenberg.org/files/${id}/${id}.txt`]
    .filter((u, i, a): u is string => !!u && a.indexOf(u) === i);
  const html = [`https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.html`, `https://www.gutenberg.org/cache/epub/${id}/pg${id}.html`,
    `https://www.gutenberg.org/files/${id}/${id}-h/${id}-h.htm`];
  let lastErr: SourceError | null = null;
  for (const u of [...plain, ...html]) {
    try {
      const t = (await (await fetchOk(u, "text/plain, text/html", 25000, 1)).text()).replace(/\r\n?/g, "\n");
      return u.endsWith(".html") || u.endsWith(".htm") ? htmlToText(t) : t;
    } catch (e) {
      if (e instanceof SourceError) lastErr = e; else throw e;
    }
  }
  throw new SourceError("fetch_failed", 502, `${lastErr?.detail ?? "kein Text"} (Buch ${id})`);
}

function htmlToText(h: string): string {
  const body = h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "").replace(/<\/(p|div|h\d|blockquote|li|tr)>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  const ent: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return body.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ent[e.toLowerCase()] ?? m;
  });
}

function paragraphsOf(text: string): string[] {
  let raw = text;
  const a = raw.search(/\*\*\* ?START OF[^\n]*\n/);
  if (a >= 0) raw = raw.slice(raw.indexOf("\n", a) + 1);
  const z = raw.search(/\*\*\* ?END OF/);
  if (z >= 0) raw = raw.slice(0, z);
  return raw.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, " ").trim())
    .filter((x) => wc(x) >= 30 && x.length < 2500 && /[.!?"»“«)]$/.test(x));
}

async function fromGutenberg(query: string) {
  let books: Book[];
  try {
    books = await viaGutendex(query);
  } catch (e) {
    if (!(e instanceof SourceError) || e.code !== "fetch_failed") throw e;
    console.error("gutendex failed, using gutenberg.org", e.detail);
    books = await viaGutenberg(query);
  }
  if (!books.length) throw new SourceError("not_found");
  const free = books.filter((b) => b.died > 0).slice(0, 4);
  if (!free.length) throw new SourceError("not_public_domain", 422);
  // Not every catalog entry has a readable text (some are audio only), so try the next hit when one fails.
  let book: Book | null = null, paras: string[] = [], lastErr: SourceError | null = null;
  for (const cand of free) {
    try {
      const ps = paragraphsOf(await bookText(cand));
      if (ps.length < 6) throw new SourceError("too_short", 422);
      book = cand;
      paras = ps;
      break;
    } catch (e) {
      if (e instanceof SourceError) lastErr = e; else throw e;
    }
  }
  if (!book) throw lastErr ?? new SourceError("fetch_failed", 502, "kein Text");
  const died = book.died;
  // Somewhere in the middle of the book, skipping preface and appendix.
  const lo = Math.floor(paras.length * 0.15), hi = Math.max(lo + 1, Math.floor(paras.length * 0.7));
  let passage: string[] | null = null;
  for (let tries = 0; tries < 8 && !passage; tries++) {
    passage = pickPassage(paras, lo + Math.floor(Math.random() * (hi - lo)));
  }
  if (!passage) throw new SourceError("too_short", 422);
  const author = book.authors.join(", ");
  return {
    title: String(book.title).slice(0, 80), paras: passage,
    src: {
      name: `${author}: ${book.title}`, url: `https://www.gutenberg.org/ebooks/${book.id}`,
      license: `gemeinfrei (Autor † ${died}), Quelle: Projekt Gutenberg`, licenseUrl: "",
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  const body = await req.json().catch(() => ({}));
  const clean = (v: unknown) => typeof v === "string" ? v.replace(/[\u0000-\u001f<>{}]/g, "").trim().slice(0, 80) : "";
  const source = body.source === "wikipedia" || body.source === "classic" ? body.source : "topic";
  const topic = clean(source === "topic" ? body.topic : body.query);
  if (topic.length < (source === "topic" ? 3 : 2)) return json({ error: "topic_required" }, 400);

  // Fetch the original first: a failed lookup does not use up the daily limit.
  let original: { title: string; paras: string[]; src: Record<string, string> } | null = null;
  if (source !== "topic") {
    try {
      original = source === "wikipedia" ? await fromWikipedia(topic) : await fromGutenberg(topic);
    } catch (e) {
      console.error("source failed", source, topic, e);
      if (e instanceof SourceError) return json({ error: e.code, detail: e.detail }, e.status);
      return json({ error: "fetch_failed", detail: String((e as Error)?.message ?? e).slice(0, 120) }, 502);
    }
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const day = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin.from("ai_usage").select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
  const used = usage?.count ?? 0;
  if (used >= DAILY_LIMIT) return json({ error: "daily_limit" }, 429);
  await admin.from("ai_usage").upsert({ user_id: user.id, day, count: used + 1 });

  try {
    // Server-side refusal fallback ("default" routing) plus structured JSON output; fields not yet in the SDK types are cast.
    const params = {
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: original ? QS_SCHEMA : SCHEMA } },
      messages: [{ role: "user", content: original ? promptForQuestions(original.paras) : promptFor(topic) }],
    } as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming;
    const msg = await anthropic.beta.messages.create(params);
    if (msg.stop_reason === "refusal") return json({ error: "refused" }, 422);
    const text = msg.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return json({ error: "empty" }, 502);
    const data = JSON.parse(text.text);
    if (original) return json({ title: original.title, paras: original.paras, qs: data.qs, topic, generatedBy: "source", src: original.src });
    return json({ ...data, topic, generatedBy: "ai" });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (e instanceof Anthropic.APIError) return json({ error: "ai_error", status: e.status }, 502);
    return json({ error: "bad_output" }, 502);
  }
});
