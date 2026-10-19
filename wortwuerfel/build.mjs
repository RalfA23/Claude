// Builds dist/ for the Wortwürfel: the page, the front-coded word list (src/woerter.txt), manifest and icons.
// The word list is loaded by the page at start; its URL carries the build version so browsers fetch a new list after a deploy.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const v = Date.now();
const words = readFileSync(join(root, "src/woerter.txt"), "utf8");
const n = words.split("\n").filter(Boolean).length;
if (n < 100000) throw new Error("Wortliste zu kurz: " + n);
const page = readFileSync(join(root, "src/index.html"), "utf8").replaceAll("__VERSION__", String(v));
writeFileSync(join(dist, "index.html"), page);
writeFileSync(join(dist, "woerter.txt"), words);
cpSync(join(root, "public"), dist, { recursive: true });
console.log(`Built dist/ (${n} Wörter, Version ${v})`);
