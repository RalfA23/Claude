// Builds dist/ for Essenz (Produktivikus-Videos als Abhakliste): the page with the checklist data inlined, plus manifest and icon. Login and storage come from the portal (../config.js).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const page = readFileSync(join(root, "src/index.html"), "utf8");
const data = JSON.parse(readFileSync(join(root, "src/daten.json"), "utf8"));
if (!page.includes("/*DATEN*/")) throw new Error("Platzhalter /*DATEN*/ fehlt");
writeFileSync(join(dist, "index.html"), page.replace("/*DATEN*/", () => "const DATA = " + JSON.stringify(data).replace(/</g, "\\u003c") + ";"));
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
