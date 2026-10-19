// Builds dist/ for the GEVT-Wissensdatenbank: the page plus manifest and icons. No knowledge texts are part of this repository;
// they live encrypted in Supabase and are only read by the edge function gevt-ask. The page uses ../config.js of the shared site.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// SHA-256 of the key in the private link (…/gevt/#k=KEY). A new key: printf %s KEY | sha256sum, then replace the value here.
const LINK_HASH = "8889ce41e9759a93fcd89c3ebbb1df5065588b007e0e849f687686873b8104e5";
const v = Date.now();
const page = readFileSync(join(root, "src/index.html"), "utf8").replace("__HASH__", LINK_HASH).replace('src="../config.js"', `src="../config.js?v=${v}"`);
writeFileSync(join(dist, "index.html"), page);
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
