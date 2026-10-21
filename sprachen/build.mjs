// Builds dist/ for the Sprachen hub: the hub page (src/, public/) plus every language folder (niederlaendisch/, japanisch/, thai/ …) as dist/<name>/.
// Each language folder is self-contained; its pages load login and storage from ../../config.js.
import { readFileSync, readdirSync, statSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const SKIP = new Set(["src", "public", "dist", "node_modules"]);
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, "src"), dist, { recursive: true });
cpSync(join(root, "public"), dist, { recursive: true });
const langs = readdirSync(root).filter(n => !SKIP.has(n) && !n.startsWith(".") && statSync(join(root, n)).isDirectory());
for (const n of langs) cpSync(join(root, n), join(dist, n), { recursive: true });

// Every inline script and every .js file must parse, so a broken page never goes live.
let checked = 0;
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (extname(n) === ".html") {
      for (const m of readFileSync(p, "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g)) { new Function(m[1]); checked++; }
    } else if (extname(n) === ".js") { new Function(readFileSync(p, "utf8")); checked++; }
  }
})(dist);
console.log("Built dist/ with", langs.length ? langs.join(", ") : "no languages yet", "·", checked, "scripts parse");
