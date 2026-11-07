import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/workouts/logik.js";

const WO = globalThis.WO;

test("Alle Workouts nutzen bekannte Übungen und Kategorien, IDs sind eindeutig", () => {
  const ids = new Set();
  for (const w of WO.WORKOUTS) {
    assert.ok(!ids.has(w.id), w.id); ids.add(w.id);
    assert.ok(WO.KATEGORIEN.includes(w.k), w.id);
    for (const [u] of w.ue) assert.ok(WO.UEBUNGEN[u], w.id + ": " + u);
    assert.ok(WO.schritte(w).length > 0);
  }
  for (const k of WO.KATEGORIEN) assert.ok(WO.WORKOUTS.some(w => w.k === k), k);
});

test("Runden-Workout: Wiederholungen und Rundenpausen", () => {
  const w = WO.WORKOUTS.find(x => x.id === "alster");
  const s = WO.schritte(w);
  assert.equal(s.filter(x => x.typ === "pause").length, 2);
  assert.equal(s[0].typ, "wdh"); assert.equal(s[0].wdh, 10);
  assert.equal(s[s.length - 1].typ, "zeit");
  const leicht = WO.schritte(w, {stufe: 1});
  assert.equal(leicht[0].wdh, 7);
  assert.equal(WO.schritte(w, {stufe: 3}).filter(x => x.ue === "kniebeuge").length, 4);
});

test("Intervall mit nur einer Übung bekommt Pausen zwischen den Runden", () => {
  const w = WO.WORKOUTS.find(x => x.id === "kiez");
  const s = WO.schritte(w);
  assert.equal(s.filter(x => x.typ === "zeit").length, 8);
  assert.equal(s.filter(x => x.typ === "pause").length, 7);
  assert.equal(s[s.length - 1].typ, "zeit");
  assert.ok(Math.abs(WO.dauerSek(w) - (8 * 20 + 7 * 10)) < 1);
});

test("Seitenübungen werden geteilt, Aufwärmen und Dehnen kommen dazu", () => {
  const w = WO.WORKOUTS.find(x => x.id === "speicherstadt");
  const s = WO.schritte(w, {aufwaermen: true, dehnen: true});
  assert.equal(s[0].abschnitt, "Aufwärmen");
  assert.equal(s[s.length - 1].abschnitt, "Dehnen");
  assert.ok(s.some(x => x.ue === "seitstuetz" && x.seite === "links"));
  assert.ok(s.some(x => x.ue === "seitstuetz" && x.seite === "rechts"));
});

test("Leiter zählt pro Runde herunter", () => {
  const w = WO.WORKOUTS.find(x => x.id === "elbphilharmonie");
  const kz = WO.schritte(w).filter(x => x.ue === "klimmzug").map(x => x.wdh);
  assert.deepEqual(kz, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

test("Ansage, Zeittext und Vorschlag", () => {
  assert.equal(WO.ansage({typ: "wdh", ue: "burpee", wdh: 10}), "10 Burpees");
  assert.equal(WO.ansage({typ: "wdh", ue: "laufen", wdh: 400}), "400 Meter Laufen");
  assert.equal(WO.zeitText(75), "1:15");
  assert.equal(WO.zeitText(3725), "1:02:05");
  const v = WO.vorschlag([{id: "elbe", datum: "2026-11-06"}], "2026-11-07");
  assert.notEqual(v.k, "Ganzkörper");
});
