// Builds dist/ for Poker: the page with engine and network code embedded, plus manifest and icon.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const src = (f) => readFileSync(join(root, "src", f), "utf8").replaceAll("</script", "<\\/script");
const page = readFileSync(join(root, "src/index.html"), "utf8")
  .replace("/*__ENGINE__*/", () => src("engine.js"))
  .replace("/*__NET__*/", () => src("net.js"));
if (page.includes("/*__ENGINE__*/") || page.includes("/*__NET__*/")) throw new Error("Platzhalter nicht ersetzt");
writeFileSync(join(dist, "index.html"), page);
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
