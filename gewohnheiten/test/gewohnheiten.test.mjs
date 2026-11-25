import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/logik.js";

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

test("Training-Eintrag und neue IDs", () => {
  assert.equal(GW.TRAINING.id, "training");
  assert.ok(GW.FARBEN.includes(GW.TRAINING.f));
  assert.equal(GW.neueId("Holzpuppe", []), "holzpuppe");
  assert.equal(GW.neueId("BCD", []), "bcd");
  assert.equal(GW.neueId("Lesen", ["lesen"]), "lesen-2");
  assert.equal(GW.neueId("Training", []), "training-2");
  assert.equal(GW.neueId("Übungen", []), "uebungen");
});

test("Monatskalender beginnt am Montag", () => {
  const w = GW.monat(2026, 10); // November 2026, der 1. ist ein Sonntag
  assert.equal(w[0].filter(x => x === null).length, 6);
  assert.equal(w[0][6].getDate(), 1);
  assert.equal(w.flat().filter(Boolean).length, 30);
  for (const x of w) assert.equal(x.length, 7);
  const z = GW.monatZahlen(k => k === "2026-11-02" || k === "2026-11-03", 2026, 10, GW.parse("2026-11-10"));
  assert.deepEqual(z, {erledigt: 2, faellig: 10, quote: 20});
});

test("GEVT: Würfel bleibt im Bereich", () => {
  assert.equal(GW.wuerfel(2, 6, () => 0), 2);
  assert.equal(GW.wuerfel(2, 6, () => 0.9999), 6);
  for (let i = 0; i < 200; i++) { const n = GW.wuerfel(5, 15); assert.ok(n >= 5 && n <= 15); }
  assert.equal(GW.einheit("form", 1), "Durchgang");
  assert.equal(GW.einheit("denk", 7), "Minuten");
});

test("GEVT: Statistik zählt nur abgehakte Tage, Rotation nimmt das Seltenste", () => {
  const docs = {
    "2026-11-17": {form: {thema: "Siu Nim Tau", anzahl: 3}, denk: {thema: "Mittellinie", anzahl: 10}},
    "2026-11-18": {form: {thema: "Chum Kiu", anzahl: 4}},
    "2026-11-19": {form: {thema: "Biu Tze", anzahl: 5}}
  };
  const st = GW.gevtStatistik(docs, d => d !== "2026-11-19");
  assert.deepEqual(st.form["Siu Nim Tau"], {tage: 1, summe: 3, zuletzt: "2026-11-17"});
  assert.equal(st.form["Biu Tze"], undefined);
  assert.equal(GW.gevtNaechstes("form", st, 0), "Biu Tze");
  assert.equal(GW.gevtNaechstes("form", st, 1), "Holzpuppenform");
  assert.equal(GW.gevtNaechstes("form", st, 2), "Siu Nim Tau");
  assert.equal(GW.gevtNaechstes("denk", st, 0), "Entspannung und Lockerheit");
  // Alle gleich oft: der am längsten zurückliegende kommt zuerst
  const st2 = {form: {"Siu Nim Tau": {tage: 1, zuletzt: "2026-11-10"}, "Chum Kiu": {tage: 1, zuletzt: "2026-11-12"}, "Biu Tze": {tage: 1, zuletzt: "2026-11-11"}, "Holzpuppenform": {tage: 1, zuletzt: "2026-11-13"}}};
  assert.equal(GW.gevtNaechstes("form", st2, 0), "Siu Nim Tau");
});

test("GEVT: Nachdenken ist eigene Rubrik, Training hat Holzpuppe", () => {
  assert.deepEqual(GW.GEVT_REIHE, ["form", "puppe", "frei"]);
  assert.ok(GW.GEVT_ALLE.includes("denk"));
  const st = GW.gevtStatistik({"2026-11-18": {form: {thema: "Chum Kiu", anzahl: 2}, denk: {thema: "Mittellinie", anzahl: 5}}}, (d, b) => b === "denk");
  assert.equal(st.form["Chum Kiu"], undefined);
  assert.equal(st.denk["Mittellinie"].tage, 1);
});

test("GEVT: höchstens 10, nur Übungen allein, frühere Aufgaben ohne heute", () => {
  for (const b of GW.GEVT_REIHE) assert.ok(GW.GEVT_BEREICHE[b].max <= 10, b);
  for (const t of GW.GEVT_BEREICHE.frei.themen) assert.ok(!/Chi Sao|Lat Sao|Partner/.test(t), t);
  for (let i = 0; i < 50; i++) { const w = GW.wuerfel(GW.GEVT_BEREICHE.frei.min, GW.GEVT_BEREICHE.frei.max); assert.ok(w >= 3 && w <= 10); }
  const docs = {"2026-11-17": {frei: {aufgabe: "A"}}, "2026-11-18": {frei: {aufgabe: "B"}}, "2026-11-19": {frei: {aufgabe: "C"}}};
  assert.deepEqual(GW.gevtFrueher(docs, "frei", "2026-11-19"), ["B", "A"]);
});

test("GEVT: Antwort in Aufgabe und Erläuterung zerlegen", () => {
  const z = GW.gevtZerlegen("STUFE: Grad 1 · Siu Nim Tau\nAUFGABE: Ersten Satz ganz langsam, Ellbogen in der Mitte.\n\nGöksel sagt, der Ellbogen bleibt **eine Faust** vom Körper.\n\nQUELLEN:\nG: Lehrplan Grad 1");
  assert.equal(z.stufe, "Grad 1 · Siu Nim Tau");
  assert.equal(z.aufgabe, "Ersten Satz ganz langsam, Ellbogen in der Mitte.");
  assert.ok(z.erklaerung.startsWith("Göksel sagt"));
  assert.equal(z.quellen, "G: Lehrplan Grad 1");
  const ohne = GW.gevtZerlegen("Übe heute den Tan Sao. Achte auf den Ellbogen.");
  assert.equal(ohne.aufgabe, "Übe heute den Tan Sao.");
});

test("GEVT: Doppelmesser ist eigene Rubrik mit eigenem Haken", () => {
  assert.ok(GW.GEVT_ALLE.includes("messer"));
  assert.ok(!GW.GEVT_REIHE.includes("messer"));
  const m = GW.GEVT_BEREICHE.messer;
  assert.ok(m.max <= 10 && m.min >= 1 && m.themen.length > 5);
  const st = GW.gevtStatistik({"2026-11-25": {messer: {thema: m.themen[0], anzahl: 4}}}, (d, b) => b === "messer");
  assert.deepEqual(st.messer[m.themen[0]], {tage: 1, summe: 4, zuletzt: "2026-11-25"});
  assert.equal(GW.gevtNaechstes("messer", st, 0), m.themen[1]);
});
