// Builds dist/: fills src/trainer.tpl.html with the data files and wraps it into a standalone PWA.
// Config comes from env: SR_SUPABASE_URL and SR_SUPABASE_ANON_KEY (both public values, the same project as the Speedreading-Trainer).
// Without them the page runs without saving.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const read = (p) => readFileSync(join(root, p), "utf8");
const safe = (s) => s.replaceAll("</", "<\\/");
// Function replacers: the data contains "$" sequences that a string replacement would interpret.
let trainer = read("src/trainer.tpl.html");
const fill = (key, value) => {
  if (!trainer.includes(key)) throw new Error(`Platzhalter fehlt: ${key}`);
  trainer = trainer.replace(key, () => value);
};
// The Woodpecker set (book text) and the personal game data are NOT part of this repository: the repository is public and the
// book is copyrighted. In the hosted app they live in the user's own account (document "daten/start") and are loaded after login.
// For local tests, SCH_DATA_FILE=<seed file> embeds them instead: node build.mjs with SCH_DATA_FILE=schach-daten.json.
let seed = { wp: [], lines: [], ef: [], rate: {} };
if (process.env.SCH_DATA_FILE) seed = JSON.parse(readFileSync(process.env.SCH_DATA_FILE, "utf8")).docs["daten/start"];
fill("__WP__", safe(JSON.stringify(seed.wp)));
fill("__RATE__", JSON.stringify(seed.rate));
fill("__LINES__", JSON.stringify(seed.lines));
fill("__EF__", safe(JSON.stringify(seed.ef)));
fill("__CHESSJS__", safe(read("src/data/chess.js")));
// Without an embedded seed the main script waits until login and data are there (see shell.html), so it is stored inert here.
if (!process.env.SCH_DATA_FILE) {
  const i = trainer.lastIndexOf("<script>");
  if (i < 0) throw new Error("Hauptskript nicht gefunden");
  trainer = trainer.slice(0, i) + '<script type="text/plain" id="sch-main">' + trainer.slice(i + "<script>".length);
}

// Head tags at the top of the page (title, font link) move into <head>; the artifact-only meta is dropped.
const split = trainer.indexOf("<style>");
const headTags = trainer.slice(0, split).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
const page = read("src/shell.html").replace("</head>", () => headTags + "</head>").replace("<!--TRAINER-->", () => trainer.slice(split));
writeFileSync(join(dist, "index.html"), page);

const config = {
  supabaseUrl: process.env.SR_SUPABASE_URL || "",
  supabaseAnonKey: process.env.SR_SUPABASE_ANON_KEY || "",
};
writeFileSync(join(dist, "config.js"), `window.SR_CONFIG = ${JSON.stringify(config)};\n`);
cpSync(join(root, "src/hosted.js"), join(dist, "hosted.js"));
cpSync(join(root, "public"), dist, { recursive: true });
console.log(`Built dist/ (${config.supabaseUrl ? "mit Konten" : "ohne Speicherung"})`);
