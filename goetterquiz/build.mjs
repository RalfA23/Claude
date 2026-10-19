// Builds dist/ for the Götterquiz: the page with all questions embedded, plus manifest and icon.
// Questions: the own catalogue (src/fragen.mjs) and the quiz questions of the Lesetraining texts and the Nerd-Ecke,
// read straight from ../speedreading-trainer/src so that new texts there land in the quiz with the next build.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { FRAGEN } from "./src/fragen.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Category per Lesetraining text: 0 Allgemeinwissen, 1 Geschichte und Geografie, 2 Wissenschaft und Technik, 3 Sport und Freizeit.
// Texts not listed here (new ones) go to Allgemeinwissen.
const CAT = {
  T1: 1, T2: 2, T3: 0, T4: 2, T5: 1, A: 1, B: 2, C: 2, D: 3, E: 0, F: 2, G: 1, H: 0,
  HU1: 2, HU2: 2, HU3: 2, HU4: 3, HU5: 2, HU6: 2, HH1: 1, HH2: 3, HH3: 1, HH4: 1, K1: 0, D1: 0, D2: 0,
  N1: 3, N2: 3, N3: 3, N4: 3, N5: 3, N6: 0, N7: 3, N8: 3, N9: 3, N10: 0, N11: 2, N12: 3, N13: 3,
};
// Questions that only make sense right after reading the text.
const NEEDS_TEXT = /Hauptaussage|laut Text|im Text|der Text|des Textes|dem Text|Lernrat folgt/i;

const sr = join(root, "../speedreading-trainer/src");
const trainer = readFileSync(join(sr, "trainer.html"), "utf8");
const a = trainer.indexOf("const TEXTS = ["), b = trainer.indexOf("const WEEKS");
if (a < 0 || b < 0) throw new Error("TEXTS im Lesetraining nicht gefunden");
const texts = vm.runInNewContext(trainer.slice(a + "const TEXTS = ".length, b).trim().replace(/;$/, ""));
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(sr, "nerd-data.js"), "utf8"), sandbox);
const nerd = (sandbox.window.NERD && sandbox.window.NERD.texts) || [];

const Q = [];
for (const [c, levels] of Object.entries(FRAGEN))
  levels.forEach((list, i) => list.forEach(([q, ...ans]) => Q.push({ c: +c, l: i + 1, q, a: ans })));
const own = Q.length;
let lesen = 0;
for (const t of texts.concat(nerd)) {
  for (const x of t.qs || []) {
    if (NEEDS_TEXT.test(x.q) || !Array.isArray(x.a) || x.a.length < 3) continue;
    // Nerd-Ecke is trivia (level 2), the course texts are detail questions (level 3).
    Q.push({ c: CAT[t.id] ?? 0, l: t.kind === "nerd" ? 2 : 3, q: x.q, a: x.a.slice(0, 4), src: t.title });
    lesen++;
  }
}
for (const x of Q) if (x.a.length < 3 || new Set(x.a).size !== x.a.length) throw new Error("Fehlerhafte Frage: " + x.q);

const v = Date.now();
const page = readFileSync(join(root, "src/index.html"), "utf8").replace("__FRAGEN__", () => JSON.stringify(Q).replaceAll("</", "<\\/"));
if (page.includes("__FRAGEN__")) throw new Error("Platzhalter doppelt");
writeFileSync(join(dist, "index.html"), page);
cpSync(join(root, "public"), dist, { recursive: true });
console.log(`Built dist/ (${own} eigene Fragen, ${lesen} aus dem Lesetraining, Version ${v})`);
