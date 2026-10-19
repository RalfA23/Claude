// Builds dist/: wraps src/trainer.html (the same page that runs as a Claude artifact) into a standalone PWA.
// Config comes from env: SR_SUPABASE_URL and SR_SUPABASE_ANON_KEY (both public values). Without them the app runs local-only.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const shell = readFileSync(join(root, "src/shell.html"), "utf8");
// Personal wording of Ralf's artifact version is swapped for neutral wording in the public app.
const PUBLIC_TEXT = [
  ["<title>Ralfs Lesetraining</title>", "<title>Speedreading-Trainer</title>"],
  ['<h1 id="brand-h">Ralfs <span class="mk">Lesetraining</span></h1>', '<h1 id="brand-h">Dein <span class="mk">Lesetraining</span></h1>'],
  ["Morgen wartet die nächste Lektion. Um 20 Uhr fragt Claude im Projekt kurz nach.", "Morgen wartet die nächste Lektion."],
  ["otherwise the Claude artifact database is used when available.", "otherwise the host database is used when available."],
  ["otherwise Claude's sample capability.", "otherwise the host's sample capability."],
];
let trainer = readFileSync(join(root, "src/trainer.html"), "utf8");
for (const [from, to] of PUBLIC_TEXT) {
  if (!trainer.includes(from)) throw new Error(`Text nicht gefunden: ${from}`);
  trainer = trainer.replace(from, to);
}
// Head tags at the top of the trainer (title, font links) move into <head>; the artifact-only meta is dropped.
// Inhaltsdaten (src/*-data.js) werden vor dem Hauptskript eingebettet; im Artifact fehlen sie, die App läuft dort ohne.
const dataJs = readdirSync(join(root, "src")).filter(f => f.endsWith("-data.js")).sort().map(f => `<script>\n${readFileSync(join(root, "src", f), "utf8")}</script>\n`).join("");
if (!trainer.includes("<!--DATA-->")) throw new Error("Marker <!--DATA--> fehlt");
trainer = trainer.replace("<!--DATA-->", () => dataJs);
const split = trainer.indexOf("<style>");
const headTags = trainer.slice(0, split).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
const page = shell.replace("</head>", headTags + "</head>").replace("<!--TRAINER-->", trainer.slice(split));
// Version query so that browsers do not keep serving an old hosted.js/config.js from their cache (GitHub Pages caches for 10 minutes).
const v = Date.now();
writeFileSync(join(dist, "index.html"), page.replace('src="hosted.js"', `src="hosted.js?v=${v}"`).replace('src="config.js"', `src="config.js?v=${v}"`));

const config = {
  supabaseUrl: process.env.SR_SUPABASE_URL || "",
  supabaseAnonKey: process.env.SR_SUPABASE_ANON_KEY || "",
};
writeFileSync(join(dist, "config.js"), `window.SR_CONFIG = ${JSON.stringify(config)};\n`);
cpSync(join(root, "src/hosted.js"), join(dist, "hosted.js"));
cpSync(join(root, "public"), dist, { recursive: true });
console.log(`Built dist/ (${config.supabaseUrl ? "mit Konten" : "nur lokal"})`);
