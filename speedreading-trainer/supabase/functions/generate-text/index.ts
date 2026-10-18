// Generates a German practice text with comprehension questions for the speed-reading trainer.
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

function promptFor(topic: string) {
  return `Schreibe einen sachlichen deutschen Übungstext für ein Lesetraining für Erwachsene. Thema: ${topic}.
Länge: 240 bis 290 Wörter in 3 oder 4 Absätzen. Nur gut gesicherte Fakten, allgemein verständlich, keine Überschrift im Text, keine Aufzählungen.
Dazu genau 4 Multiple-Choice-Fragen zum Inhalt (drei Detailfragen, eine Frage zur Hauptaussage) mit jeweils 3 kurzen Antworten; die richtige Antwort steht immer an erster Stelle.
Felder: title (kurzer Titel), paras (Absätze), qs (Fragen mit q und a).`;
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
  const topic = typeof body.topic === "string" ? body.topic.replace(/[\u0000-\u001f<>{}]/g, "").trim().slice(0, 80) : "";
  if (topic.length < 3) return json({ error: "topic_required" }, 400);

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
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: promptFor(topic) }],
    } as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming;
    const msg = await anthropic.beta.messages.create(params);
    if (msg.stop_reason === "refusal") return json({ error: "refused" }, 422);
    const text = msg.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return json({ error: "empty" }, 502);
    const data = JSON.parse(text.text);
    return json({ ...data, topic, generatedBy: "ai" });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (e instanceof Anthropic.APIError) return json({ error: "ai_error", status: e.status }, 502);
    return json({ error: "bad_output" }, 502);
  }
});
