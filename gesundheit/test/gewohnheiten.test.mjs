import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/gewohnheiten/logik.js";

const GW = globalThis.GW;
const d = s => GW.parse(s);

test("Trainingsplan pro Wochentag wie auf der Gesundheitsseite", () => {
  // 16.11.2026 ist ein Montag
  const w = [0, 1, 2, 3, 4, 5, 6].map(i => GW.planTag(GW.addDays(d("2026-11-16"), i), {freq: "3"}));
  assert.deepEqual(w, ["kraft", "ausdauer", "kraft", "intervall", "kraft", "lang", "ruhe"]);
  const w2 = [0, 1, 2, 3, 4, 5, 6].map(i => GW.planTag(GW.addDays(d("2026-11-16"), i), {freq: "2"}));
  assert.equal(w2.filter(x => x === "kraft").length, 2);
  assert.equal(GW.planTag(d("2026-11-01"), {start: "2026-11-10"}), null);
  assert.equal(GW.planWoche(d("2026-11-18"), {start: "2026-11-16"}), 1);
  assert.equal(GW.planWoche(d("2026-11-23"), {start: "2026-11-16"}), 2);
});

test("Serie zählt bis gestern, solange heute noch offen ist", () => {
  const on = new Set(["2026-11-13", "2026-11-14", "2026-11-15"]);
  assert.equal(GW.serie(k => on.has(k), d("2026-11-16")), 3);
  on.add("2026-11-16");
  assert.equal(GW.serie(k => on.has(k), d("2026-11-16")), 4);
  assert.equal(GW.serie(k => on.has(k), d("2026-11-18")), 0);
});

test("Beim Training unterbrechen Ruhetage die Serie nicht", () => {
  const z = x => GW.istTraining(GW.planTag(x, {freq: "3"}));
  // Sa 14.11. lang, So 15.11. Ruhe, Mo 16.11. heute offen
  const on = new Set(["2026-11-13", "2026-11-14"]);
  assert.equal(GW.serie(k => on.has(k), d("2026-11-16"), z), 2);
  assert.equal(GW.gesternVerpasst(k => on.has(k), d("2026-11-16"), z), false);
  assert.equal(GW.gesternVerpasst(k => on.has(k), d("2026-11-17"), z), true);
});

test("Jahreszahlen und längste Serie", () => {
  const on = new Set(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-05"]);
  const j = GW.jahr(k => on.has(k), 2026, d("2026-01-10"));
  assert.deepEqual(j, {erledigt: 4, faellig: 10, quote: 40});
  assert.equal(GW.laengsteSerie(k => on.has(k), 2026, d("2026-01-10")), 3);
});

test("Vorlage und neue IDs", () => {
  assert.equal(GW.VORLAGE[0].id, "training");
  for (const g of GW.VORLAGE) assert.ok(GW.FARBEN.includes(g.f), g.id);
  assert.equal(GW.neueId("Kalt duschen", []), "kalt-duschen");
  assert.equal(GW.neueId("Lesen", ["lesen"]), "lesen-2");
  assert.equal(GW.neueId("Training", []), "training-2");
  assert.equal(GW.neueId("Übungen", []), "uebungen");
});
