// Gewohnheiten auf der Apple Watch: ein Kurzbefehl (Shortcuts) hakt den heutigen Tag ab, ohne Webseite.
// Anmeldung über einen persönlichen Uhr-Schlüssel statt Login, weil ein Kurzbefehl kein Supabase-Login halten kann.
//   POST {action:"schluessel"} mit Login (Authorization: Bearer <JWT>) -> {schluessel}. Erzeugt einen neuen Schlüssel,
//        gespeichert wird nur sein SHA-256 in schach_docs gewohnheiten/uhr. Ein neuer Schlüssel macht den alten ungültig.
//   POST {k}       -> ["🪵 Holzpuppe", ...]  heute noch offene Gewohnheiten (für „Aus Liste auswählen“)
//   POST {k, h}    -> "✓ Holzpuppe ist für heute abgehakt."  h = Eintrag aus der Liste oder Name
// Daten wie auf /gewohnheiten/: gewohnheiten/liste, gewohnheiten/jahr.<yyyy> {id:{"MM-DD":1}}, Training: gesundheit/training.<datum>.
// „Heute“ ist der Tag in Europe/Berlin. Deploy mit verify_jwt false (eigene Prüfung über Schlüssel bzw. Login).
import { createClient } from "npm:@supabase/supabase-js@2";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UHR = "gewohnheiten/uhr", LISTE = "gewohnheiten/liste", JAHR = "gewohnheiten/jahr.", TRAIN = "gesundheit/training.";
const FERTIG = "Alles erledigt 🎉";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
const text = (t: string, s = 200) => new Response(t, { status: s, headers: { ...CORS, "Content-Type": "text/plain; charset=utf-8" } });

async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function heute() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return p; // YYYY-MM-DD
}
const norm = (s: string) => s.normalize("NFC").replace(/^✓\s*/, "").trim().toLowerCase();

type G = { id: string; n: string; i?: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return text("Bitte POST verwenden.", 405);
  const body = await req.json().catch(() => ({}));
  const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });

  // Neuer Schlüssel, nur mit Login von der Webseite.
  if (body.action === "schluessel") {
    const uc = createClient(URL_, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: { user } } = await uc.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);
    const roh = new Uint8Array(18); crypto.getRandomValues(roh);
    const k = "gw_" + btoa(String.fromCharCode(...roh)).replace(/\+/g, "-").replace(/\//g, "_");
    const r = await admin.from("schach_docs").upsert({ user_id: user.id, path: UHR, data: { hash: await sha(k), erstellt: new Date().toISOString() }, updated_at: new Date().toISOString() });
    if (r.error) return json({ error: "speichern" }, 500);
    return json({ schluessel: k });
  }

  // Ab hier: Kurzbefehl mit Schlüssel.
  const k = typeof body.k === "string" ? body.k.trim() : "";
  if (!/^gw_[A-Za-z0-9_-]{20,}$/.test(k)) return text("Uhr-Schlüssel fehlt oder ist falsch. Neu erzeugen auf der Seite Gewohnheiten.", 401);
  const hit = await admin.from("schach_docs").select("user_id").eq("path", UHR).eq("data->>hash", await sha(k));
  if (hit.error || !hit.data || hit.data.length !== 1) return text("Uhr-Schlüssel ist nicht mehr gültig. Neu erzeugen auf der Seite Gewohnheiten.", 401);
  const uid = hit.data[0].user_id as string;

  const tag = heute(), y = tag.slice(0, 4), md = tag.slice(5);
  const docs = await admin.from("schach_docs").select("path,data").eq("user_id", uid).in("path", [LISTE, JAHR + y, TRAIN + tag]);
  if (docs.error) return text("Konto gerade nicht erreichbar.", 502);
  const by: Record<string, any> = {};
  for (const r of docs.data ?? []) by[r.path] = r.data;
  const liste: G[] = Array.isArray(by[LISTE]?.liste) ? by[LISTE].liste : [];
  const jahr: Record<string, Record<string, number>> = by[JAHR + y] && typeof by[JAHR + y] === "object" ? by[JAHR + y] : {};
  const erledigt = (g: G) => g.id === "training" ? !!by[TRAIN + tag]?.done : !!jahr[g.id]?.[md];
  const label = (g: G) => ((g.i ? g.i + " " : "") + g.n).trim();

  const h = typeof body.h === "string" ? body.h : "";
  if (!h) {
    const offen = liste.filter((g) => !erledigt(g)).map(label);
    return json(offen.length ? offen : [FERTIG]);
  }
  if (norm(h) === norm(FERTIG)) return text("Heute ist schon alles abgehakt. Stark!");
  const g = liste.find((x) => norm(label(x)) === norm(h)) ?? liste.find((x) => norm(x.n) === norm(h));
  if (!g) return text("„" + h.slice(0, 40) + "“ kenne ich nicht.", 404);
  if (erledigt(g)) return text("✓ " + g.n + " war heute schon abgehakt.");

  let r;
  if (g.id === "training") {
    r = await admin.from("schach_docs").upsert({ user_id: uid, path: TRAIN + tag, data: { done: true }, updated_at: new Date().toISOString() });
  } else {
    jahr[g.id] = jahr[g.id] && typeof jahr[g.id] === "object" ? jahr[g.id] : {};
    jahr[g.id][md] = 1;
    r = await admin.from("schach_docs").upsert({ user_id: uid, path: JAHR + y, data: jahr, updated_at: new Date().toISOString() });
  }
  if (r.error) return text("Speichern hat nicht geklappt.", 500);
  const rest = liste.filter((x) => x.id !== g.id && !erledigt(x)).length;
  return text("✓ " + g.n + " ist für heute abgehakt." + (rest ? " Noch " + rest + " offen." : " Alles erledigt 🎉"));
});
