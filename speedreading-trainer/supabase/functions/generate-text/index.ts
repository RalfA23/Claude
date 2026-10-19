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
  constructor(code: string, status = 404) { super(code); this.code = code; this.status = status; }
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

async function getJson(url: string) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(9000) });
  if (!r.ok) throw new SourceError("fetch_failed", 502);
  return await r.json();
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

async function fromGutenberg(query: string) {
  const j = await getJson(`https://gutendex.com/books?languages=de&search=${encodeURIComponent(query)}`);
  const results = (j?.results ?? []) as any[];
  if (!results.length) throw new SourceError("not_found");
  const free = (people: any[] | undefined) =>
    Array.isArray(people) && people.every((a) => typeof a?.death_year === "number" && a.death_year <= PD_LAST_DEATH_YEAR);
  const book = results.find((b) =>
    free(b.authors) && b.authors.length > 0 && (!b.translators?.length || free(b.translators)) &&
    Object.keys(b.formats ?? {}).some((k) => k.startsWith("text/plain"))
  );
  if (!book) throw new SourceError("not_public_domain", 422);
  const key = Object.keys(book.formats).find((k) => k.startsWith("text/plain"))!;
  const r = await fetch(book.formats[key], { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new SourceError("fetch_failed", 502);
  let raw = (await r.text()).replace(/\r\n?/g, "\n");
  const a = raw.search(/\*\*\* ?START OF[^\n]*\n/);
  if (a >= 0) raw = raw.slice(raw.indexOf("\n", a) + 1);
  const z = raw.search(/\*\*\* ?END OF/);
  if (z >= 0) raw = raw.slice(0, z);
  const paras = raw.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, " ").trim())
    .filter((x) => wc(x) >= 30 && x.length < 2500 && /[.!?"»“«)]$/.test(x));
  if (paras.length < 6) throw new SourceError("too_short", 422);
  // Somewhere in the middle of the book, skipping preface and appendix.
  const lo = Math.floor(paras.length * 0.15), hi = Math.max(lo + 1, Math.floor(paras.length * 0.7));
  let passage: string[] | null = null;
  for (let tries = 0; tries < 8 && !passage; tries++) {
    passage = pickPassage(paras, lo + Math.floor(Math.random() * (hi - lo)));
  }
  if (!passage) throw new SourceError("too_short", 422);
  const author = String(book.authors.map((x: any) => String(x.name).split(",").reverse().join(" ").trim()).join(", "));
  const died = Math.max(...book.authors.map((x: any) => x.death_year));
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
      if (e instanceof SourceError) return json({ error: e.code }, e.status);
      return json({ error: "fetch_failed" }, 502);
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
