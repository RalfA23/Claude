// Builds dist/ for Klavier: the page with songs (src/lieder.js) and pitch detection (src/klang.js) inlined, plus manifest and icon. Login and storage come from the portal (../config.js).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
let page = readFileSync(join(root, "src/index.html"), "utf8");
for (const [mark, file] of [["/*LIEDER*/", "lieder.js"], ["/*KLANG*/", "klang.js"]]) {
  if (!page.includes(mark)) throw new Error("Platzhalter " + mark + " fehlt");
  const js = readFileSync(join(root, "src", file), "utf8");
  page = page.replace(mark, () => js);
}
writeFileSync(join(dist, "index.html"), page);
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
