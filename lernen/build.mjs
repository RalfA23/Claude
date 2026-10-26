// Builds dist/ for Lernen (Übersicht aller Lernkurse): the page plus manifest and icon. Login and storage come from the portal (../config.js).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "index.html"), readFileSync(join(root, "src/index.html"), "utf8"));
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
