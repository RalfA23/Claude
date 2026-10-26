// Prüft die Meditationstexte und die Längenplanung (src/meditationen.js) ohne Browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/meditationen.js", import.meta.url), "utf8");
const { MEDITATIONEN, planMeditation, meditationDesTages } = new Function(src + ";return {MEDITATIONEN, planMeditation, meditationDesTages}")();

test("sechs Meditationen mit eindeutigen Kennungen", () => {
  assert.equal(MEDITATIONEN.length, 6);
  assert.equal(new Set(MEDITATIONEN.map(m => m.id)).size, 6);
  for (const m of MEDITATIONEN) assert.ok(m.intro.length && m.outro.length && m.core.length >= 6, m.id);
});

test("mehr Minuten bringen mehr Abschnitte, nie weniger", () => {
  for (const m of MEDITATIONEN) {
    let prev = 0;
    for (let t = 3; t <= 10; t++) {
      const p = planMeditation(m, t, 13);
      assert.ok(p.abschnitte >= prev && p.abschnitte >= 1, m.id + " " + t);
      assert.ok(p.sprech < t * 60 * 0.75, m.id + " " + t + " Sprechzeit passt");
      prev = p.abschnitte;
    }
  }
});

test("Abschnitte bleiben in ihrer Reihenfolge, der letzte Satz hat keine Pause", () => {
  for (const m of MEDITATIONEN) {
    const p = planMeditation(m, 4, 13), all = [].concat(m.intro, ...m.core.map(c => c.x), m.outro).filter(s => s !== "~");
    let k = -1;
    for (const it of p.items) { const i = all.indexOf(it.text, k + 1); assert.ok(i > k, m.id + ": " + it.text); k = i; }
    assert.equal(p.items[p.items.length - 1].w, 0);
    assert.ok(!p.items.some(it => it.text === "~"));
  }
});

test("Meditation des Tages wechselt täglich und ist je Datum fest", () => {
  const a = meditationDesTages("2026-10-26"), b = meditationDesTages("2026-10-27");
  assert.notEqual(a.id, b.id);
  assert.equal(meditationDesTages("2026-10-26").id, a.id);
  const woche = new Set(["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31"].map(d => meditationDesTages(d).id));
  assert.equal(woche.size, 6);
});
