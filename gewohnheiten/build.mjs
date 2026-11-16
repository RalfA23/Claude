// Builds dist/ for Gewohnheiten: page, logic, storage and styles plus manifest and icon. Login and storage come from the portal (../config.js).
import { mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, "src"), dist, { recursive: true });
cpSync(join(root, "public"), dist, { recursive: true });
console.log("Built dist/");
