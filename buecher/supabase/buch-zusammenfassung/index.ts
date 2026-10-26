// Bücher: writes a short summary (5-8 sentences plus core theses) of a book Claude knows for sure, or says it does not know it.
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
  const anthropic = ownKey ? new Anthropic({ apiKey: ownKey }) : new Anthropic();

  try {
    const params = {
      model: "claude-sonnet-5-5",
      max_tokens: 1500,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: promptFor(title, author, isbn) }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming;
    const msg = await anthropic.messages.create(params);
    if (msg.stop_reason === "refusal") return json({ error: "refused" }, 422);
    const text = msg.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return json({ error: "empty" }, 502);
    const d = JSON.parse(text.text);
    const known = !!d.bekannt && typeof d.zusammenfassung === "string" && d.zusammenfassung.trim().length > 40;
    return json({ known, text: known ? d.zusammenfassung.trim() : "", points: known && Array.isArray(d.kernthesen) ? d.kernthesen.map(String).slice(0, 8) : [] });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return json({ error: "bad_key" }, 401);
    if (e instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (e instanceof Anthropic.APIError) return json({ error: "ai_error", status: e.status }, 502);
    return json({ error: "bad_output" }, 502);
  }
});
