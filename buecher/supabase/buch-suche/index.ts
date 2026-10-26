// Bücher: finds books by ISBN or by title for the add dialog, server side (no CORS, no shared browser quota).
// Sources in order: Open Library, lobid (hbz, German library catalogue), Google Books (often over its anonymous quota).
// Body: {isbn} or {q, author?}. Answer: {items: [{title, author, isbn, cover, genre, year}]}. Needs a logged-in user.
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UA = "Lebensplattform-Buecher/1.0 (https://ralfa23.github.io/Claude/)";

type Item = { title: string; author: string; isbn: string; cover: string; genre: string; year: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

async function get(url: string) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

const olCover = (isbn: string) => isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : "";
const pickIsbn = (list: unknown) => {
  const a = (Array.isArray(list) ? list : []).map((x) => String(x).replace(/[^0-9X]/gi, ""));
  return a.find((x) => x.length === 13) ?? a.find((x) => x.length === 10) ?? "";
};

// ---------- Open Library ----------
async function olIsbn(isbn: string): Promise<Item[]> {
  const j = await get(`https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:${isbn}`);
  const d = j?.[`ISBN:${isbn}`];
  if (!d?.title) return [];
  return [{
    title: d.subtitle && d.title.length < 40 ? `${d.title}: ${d.subtitle}` : d.title,
    author: (d.authors ?? []).map((a: { name: string }) => a.name).join(", "),
    isbn, cover: d.cover?.medium ?? olCover(isbn), genre: "", year: String(d.publish_date ?? "").match(/\d{4}/)?.[0] ?? "",
  }];
}
async function olSearch(q: string, author: string): Promise<Item[]> {
  const j = await get(`https://openlibrary.org/search.json?limit=6&fields=title,author_name,isbn,cover_i,first_publish_year&title=${encodeURIComponent(q)}` +
    (author ? `&author=${encodeURIComponent(author)}` : ""));
  return (j?.docs ?? []).map((d: Record<string, unknown>) => {
    const isbn = pickIsbn(d.isbn);
    return {
      title: String(d.title ?? ""), author: ((d.author_name as string[]) ?? []).slice(0, 3).join(", "), isbn,
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : olCover(isbn), genre: "", year: String(d.first_publish_year ?? ""),
    };
  });
}

// ---------- lobid (deutsche Bibliotheken) ----------
function lobidItem(m: Record<string, any>, isbn = ""): Item {
  const contrib = (m.contribution ?? []) as any[];
  const authors = contrib.filter((c) => /Autor|Verfasser/i.test(c?.role?.label ?? "")).map((c) => c?.agent?.label).filter(Boolean);
  const names = (authors.length ? authors : contrib.map((c) => c?.agent?.label).filter(Boolean)).slice(0, 3)
    .map((n: string) => n.includes(",") ? n.split(",").reverse().join(" ").trim() : n);
  const sub = (m.otherTitleInformation ?? [])[0];
  const title = String(m.title ?? "");
  const i = isbn || pickIsbn(m.isbn);
  return {
    title: sub && title.length < 40 ? `${title}: ${sub}` : title, author: names.join(", "), isbn: i, cover: olCover(i),
    genre: "", year: String((m.publication ?? [])[0]?.startDate ?? ""),
  };
}
async function lobidIsbn(isbn: string): Promise<Item[]> {
  const j = await get(`https://lobid.org/resources/search?format=json&size=1&q=isbn:${isbn}`);
  const m = (j?.member ?? [])[0];
  return m?.title ? [lobidItem(m, isbn)] : [];
}
async function lobidSearch(q: string, author: string): Promise<Item[]> {
  const query = `title:(${q})` + (author ? ` AND contribution.agent.label:(${author})` : "");
  const j = await get(`https://lobid.org/resources/search?format=json&size=6&filter=type:Book&q=${encodeURIComponent(query)}`);
  return ((j?.member ?? []) as any[]).filter((m) => m?.title).map((m) => lobidItem(m));
}

// ---------- Google Books ----------
function gbItem(v: any): Item {
  const i = v.volumeInfo ?? {};
  const ids = (i.industryIdentifiers ?? []) as { type: string; identifier: string }[];
  const isbn = ids.find((x) => x.type === "ISBN_13")?.identifier ?? ids.find((x) => x.type === "ISBN_10")?.identifier ?? "";
  const img = i.imageLinks?.thumbnail ?? i.imageLinks?.smallThumbnail ?? "";
  return {
    title: (i.title ?? "") + (i.subtitle && i.title && i.title.length < 40 ? `: ${i.subtitle}` : ""), author: (i.authors ?? []).join(", "), isbn,
    cover: String(img).replace(/^http:/, "https:"), genre: (i.categories ?? [])[0] ?? "", year: String(i.publishedDate ?? "").slice(0, 4),
  };
}
async function gbSearch(q: string): Promise<Item[]> {
  const j = await get(`https://www.googleapis.com/books/v1/volumes?maxResults=6&printType=books&country=DE&q=${encodeURIComponent(q)}`);
  return ((j?.items ?? []) as any[]).map(gbItem).filter((x) => x.title);
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
  const clean = (v: unknown, n: number) => typeof v === "string" ? v.replace(/[\u0000-\u001f<>{}()\[\]:"\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, n) : "";
  const isbn = typeof body.isbn === "string" ? body.isbn.replace(/[^0-9X]/gi, "").toUpperCase() : "";

  if (isbn) {
    if (isbn.length !== 10 && isbn.length !== 13) return json({ error: "bad_isbn" }, 400);
    for (const f of [olIsbn, lobidIsbn, (x: string) => gbSearch(`isbn:${x}`)]) {
      const r = await f(isbn);
      if (r.length) {
        const it = { ...r[0], isbn };
        if (!it.cover) it.cover = olCover(isbn);
        return json({ items: [it] });
      }
    }
    return json({ items: [] });
  }

  const q = clean(body.q, 120), author = clean(body.author, 80);
  if (q.length < 2) return json({ error: "query_required" }, 400);
  const [ol, lb] = await Promise.all([olSearch(q, author), lobidSearch(q, author)]);
  let items = [...lb.slice(0, 4), ...ol.slice(0, 4)];
  if (!items.length) items = await gbSearch(`intitle:${q}${author ? ` inauthor:${author}` : ""}`);
  // gleiche Titel/Autoren nur einmal
  const seen = new Set<string>();
  items = items.filter((x) => {
    const k = (x.title + "|" + x.author).toLowerCase();
    if (!x.title || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return json({ items: items.slice(0, 8) });
});
