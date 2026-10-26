// Builds dist/ for Entspannung: the page with the meditations inlined, plus manifest and icon. Login and storage come from the portal (../config.js), speech from ../sprachen/ton.js.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const page = readFileSync(join(root, "src/index.html"), "utf8");
const med = readFileSync(join(root, "src/meditationen.js"), "utf8");
if (!page.includes("/*MEDITATIONEN*/")) throw new Error("Platzhalter /*MEDITATIONEN*/ fehlt");
writeFileSync(join(dist, "index.html"), page.replace("/*MEDITATIONEN*/", () => med));
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
