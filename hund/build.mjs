// Baut dist/ für das Hundeleben: Seite mit Logik, Hund, Welt und App eingebettet, dazu three.js, Manifest und Icon.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const src = (f) => readFileSync(join(root, "src", f), "utf8").replaceAll("</script", "<\\/script");
const parts = { LOGIC: "logic.js", DOG: "dog3d.js", WORLD: "world3d.js", APP: "app.js" };
let page = readFileSync(join(root, "src/index.html"), "utf8");
for (const [k, f] of Object.entries(parts)) page = page.replace("/*__" + k + "__*/", () => src(f));
if (/\/\*__[A-Z]+__\*\//.test(page)) throw new Error("Platzhalter nicht ersetzt");
writeFileSync(join(dist, "index.html"), page);
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
