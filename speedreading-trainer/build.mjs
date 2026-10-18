// Builds dist/: wraps src/trainer.html (the same page that runs as a Claude artifact) into a standalone PWA.
// Config comes from env: SR_SUPABASE_URL and SR_SUPABASE_ANON_KEY (both public values). Without them the app runs local-only.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
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
  ['<h1>Ralfs <span class="mk">Lesetraining</span></h1>', '<h1>Dein <span class="mk">Lesetraining</span></h1>'],
  ["Morgen wartet die nächste Lektion. Um 20 Uhr fragt Claude im Projekt kurz nach.", "Morgen wartet die nächste Lektion."],
];
let trainer = readFileSync(join(root, "src/trainer.html"), "utf8");
for (const [from, to] of PUBLIC_TEXT) {
  if (!trainer.includes(from)) throw new Error(`Text nicht gefunden: ${from}`);
  trainer = trainer.replace(from, to);
}
// Head tags at the top of the trainer (title, font links) move into <head>; the artifact-only meta is dropped.
const split = trainer.indexOf("<style>");
const headTags = trainer.slice(0, split).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
const page = shell.replace("</head>", headTags + "</head>").replace("<!--TRAINER-->", trainer.slice(split));
writeFileSync(join(dist, "index.html"), page);

const config = {
  supabaseUrl: process.env.SR_SUPABASE_URL || "",
  supabaseAnonKey: process.env.SR_SUPABASE_ANON_KEY || "",
};
writeFileSync(join(dist, "config.js"), `window.SR_CONFIG = ${JSON.stringify(config)};\n`);
cpSync(join(root, "src/hosted.js"), join(dist, "hosted.js"));
cpSync(join(root, "public"), dist, { recursive: true });
console.log(`Built dist/ (${config.supabaseUrl ? "mit Konten" : "nur lokal"})`);
