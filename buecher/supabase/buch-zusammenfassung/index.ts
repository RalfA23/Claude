// Bücher: writes a short summary (5-8 sentences plus core theses) of a book Claude knows for sure, or says it does not know it.
// With "format": "kurz" it writes a Blinkist-style Kurzfassung instead: core idea, who it is for, 5-8 bite-sized parts and a conclusion.
// Who pays: with a key in the request body ("key", the viewer's own Anthropic API key, not stored here) the call runs on that key.
// Without one, only admins (app_admins, i.e. Ralf) may use the project secret ANTHROPIC_API_KEY.
// SUPABASE_URL and SUPABASE_ANON_KEY are provided by the Supabase runtime.
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SCHEMA = {
  type: "object",
  properties: {
    bekannt: { type: "boolean" },
    zusammenfassung: { type: "string" },
    kernthesen: { type: "array", items: { type: "string" } },
  },
  required: ["bekannt", "zusammenfassung", "kernthesen"],
  additionalProperties: false,
};

const KURZ_SCHEMA = {
  type: "object",
  properties: {
    bekannt: { type: "boolean" },
    kernidee: { type: "string" },
    fuer_wen: { type: "string" },
    haeppchen: {
      type: "array",
      items: {
        type: "object",
        properties: { titel: { type: "string" }, text: { type: "string" } },
        required: ["titel", "text"],
        additionalProperties: false,
      },
    },
    fazit: { type: "string" },
  },
  required: ["bekannt", "kernidee", "fuer_wen", "haeppchen", "fazit"],
  additionalProperties: false,
};

function kurzPrompt(title: string, author: string, isbn: string) {
  return `Buch: „${title}“${author ? ` von ${author}` : ""}${isbn ? ` (ISBN ${isbn})` : ""}.
Schreibe eine deutsche Kurzfassung dieses Buches zum Lesen in wenigen Minuten, aufgeteilt in Häppchen.
Wichtig: Nur aus sicherem Wissen. Wenn du genau dieses Buch nicht sicher kennst (oder es mit einem anderen verwechseln könntest), setze bekannt auf false und lass alle Texte leer und haeppchen leer. Erfinde nichts, keine wörtlichen Zitate, keine Seitenzahlen, keine erfundenen Studien oder Zahlen.
Wenn du es sicher kennst: bekannt true.
kernidee: ein bis zwei Sätze, die Hauptaussage des Buches.
fuer_wen: ein Satz, für wen sich das Buch lohnt.
haeppchen: 5 bis 8 Abschnitte in der Reihenfolge des Buches. titel ist eine kurze, aussagekräftige Überschrift (höchstens 8 Wörter), text sind 90 bis 150 Wörter in eigenen Worten, klar und anschaulich, mit einem Beispiel aus dem Buch, wo du es sicher weißt.
fazit: zwei bis drei Sätze, was man mitnehmen und gleich ausprobieren kann.`;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

function promptFor(title: string, author: string, isbn: string) {
  return `Buch: „${title}“${author ? ` von ${author}` : ""}${isbn ? ` (ISBN ${isbn})` : ""}.
Schreibe eine deutsche Kurzzusammenfassung dieses Buches für eine persönliche Bücherliste.
Wichtig: Nur aus sicherem Wissen. Wenn du genau dieses Buch nicht sicher kennst (oder es mit einem anderen verwechseln könntest), setze bekannt auf false und lass zusammenfassung leer und kernthesen leer. Erfinde nichts, keine Zitate, keine Seitenzahlen.
Wenn du es sicher kennst: bekannt true, zusammenfassung mit 5 bis 8 Sätzen (worum es geht, Hauptaussage, für wen es sich lohnt), kernthesen mit 3 bis 6 kurzen Kernthesen.`;
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
  const clean = (v: unknown, n: number) => typeof v === "string" ? v.replace(/[\u0000-\u001f<>{}]/g, "").trim().slice(0, n) : "";
  const title = clean(body.title, 160), author = clean(body.author, 120), isbn = clean(body.isbn, 20);
  if (title.length < 2) return json({ error: "title_required" }, 400);

  const ownKey = typeof body.key === "string" && /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(body.key.trim()) ? body.key.trim() : "";
  if (!ownKey) {
    const { data: ad } = await userClient.from("app_admins").select("user_id").eq("user_id", user.id).maybeSingle();
    if (!ad) return json({ error: "no_key" }, 403);
  }
  const kurz = body.format === "kurz";
  const anthropic = ownKey ? new Anthropic({ apiKey: ownKey }) : new Anthropic();

  try {
    const params = {
      model: "claude-sonnet-5-5",
      max_tokens: kurz ? 6000 : 1500,
      output_config: { effort: "low", format: { type: "json_schema", schema: kurz ? KURZ_SCHEMA : SCHEMA } },
      messages: [{ role: "user", content: kurz ? kurzPrompt(title, author, isbn) : promptFor(title, author, isbn) }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming;
    const msg = await anthropic.messages.create(params);
    if (msg.stop_reason === "refusal") return json({ error: "refused" }, 422);
    const text = msg.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return json({ error: "empty" }, 502);
    const d = JSON.parse(text.text);
    if (kurz) {
      const parts = Array.isArray(d.haeppchen)
        ? d.haeppchen.filter((h: { titel?: unknown; text?: unknown }) => h && typeof h.titel === "string" && typeof h.text === "string" && h.text.trim())
          .slice(0, 10).map((h: { titel: string; text: string }) => ({ title: h.titel.trim(), text: h.text.trim() }))
        : [];
      const ok = !!d.bekannt && parts.length >= 3;
      return json(ok
        ? { known: true, idea: String(d.kernidee || "").trim(), forWhom: String(d.fuer_wen || "").trim(), parts, outro: String(d.fazit || "").trim() }
        : { known: false });
    }
    const known = !!d.bekannt && typeof d.zusammenfassung === "string" && d.zusammenfassung.trim().length > 40;
    return json({ known, text: known ? d.zusammenfassung.trim() : "", points: known && Array.isArray(d.kernthesen) ? d.kernthesen.map(String).slice(0, 8) : [] });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return json({ error: "bad_key" }, 401);
    if (e instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (e instanceof Anthropic.APIError) return json({ error: "ai_error", status: e.status }, 502);
    return json({ error: "bad_output" }, 502);
  }
});
