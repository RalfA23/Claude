import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/starting-strength/logik.js";

const SS = globalThis.SS;

test("Workout A und B wechseln je nach Phase", () => {
  const s = SS.neuerStand();
  assert.deepEqual(SS.plan(s, "A"), ["kniebeuge", "druecken", "kreuzheben"]);
  assert.deepEqual(SS.plan(s, "B"), ["kniebeuge", "bank", "kreuzheben"]);
  s.phase = 2;
  assert.deepEqual(SS.plan(s, "B"), ["kniebeuge", "bank", "umsetzen"]);
  s.phase = 3;
  assert.deepEqual(SS.plan(s, "B"), ["kniebeuge", "bank", "klimmzug"]);
});

test("Startgewicht unter der Stange wird auf die Stange gehoben", () => {
  const s = SS.neuerStand({gewichte: {druecken: 10}});
  const tr = SS.neuesTraining(s, "A", "2026-11-07");
  assert.equal(tr.uebungen[1].kg, 20);
});

test("Keine Aufwärmsätze bei leerer Stange, sonst Stufen unter dem Arbeitsgewicht", () => {
  const s = SS.neuerStand();
  assert.deepEqual(SS.aufwaermen("kniebeuge", 20, s), []);
  const w = SS.aufwaermen("kniebeuge", 100, s);
  assert.deepEqual(w[0], {kg: 20, wdh: 5, anzahl: 2});
  assert.deepEqual(w.map(x => x.kg), [20, 40, 60, 80]);
  const k = SS.aufwaermen("kreuzheben", 60, s);
  assert.ok(k.every(x => x.kg < 60 && x.kg >= 20));
});

test("Scheiben pro Seite", () => {
  const s = SS.neuerStand();
  assert.deepEqual(SS.scheibenProSeite(102.5, s), [25, 15, 1.25]);
  assert.deepEqual(SS.scheibenProSeite(20, s), []);
});

test("Geschafft steigert, Fehlversuche halten, dritter Fehlversuch geht 10 % zurück", () => {
  let s = SS.neuerStand({gewichte: {kniebeuge: 100, druecken: 40, kreuzheben: 120}});
  let tr = SS.neuesTraining(s, "A", "2026-11-07");
  tr.uebungen[0].saetze = [5, 5, 5];
  tr.uebungen[1].saetze = [5, 5, 4];
  tr.uebungen[2].saetze = [5];
  let r = SS.abschliessen(s, tr);
  assert.equal(r.stand.gewichte.kniebeuge, 102.5);
  assert.equal(r.stand.gewichte.druecken, 40);
  assert.equal(r.stand.fehl.druecken, 1);
  assert.equal(r.stand.gewichte.kreuzheben, 125);
  assert.equal(r.stand.naechstes, "B");
  s = r.stand;
  for (let i = 0; i < 2; i++) {
    tr = SS.neuesTraining(s, "A", "2026-11-09");
    tr.uebungen.forEach(u => { u.saetze = u.saetze.map(() => 5); });
    tr.uebungen[1].saetze = [5, 3, 3];
    s = SS.abschliessen(s, tr).stand;
  }
  assert.equal(s.gewichte.druecken, 35);
  assert.equal(s.fehl.druecken, 0);
});
