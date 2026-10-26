// Prüft Notenschrift, Stücke und Tonerkennung (src/lieder.js, src/klang.js) ohne Browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const lade = (datei, namen) => new Function(readFileSync(new URL("../src/" + datei, import.meta.url), "utf8") + ";return {" + namen + "}")();
const { LIEDER, STUFEN, parseTon, parseHand, ablauf, liedFuer, haendeVon } = lade("lieder.js", "LIEDER, STUFEN, parseTon, parseHand, ablauf, liedFuer, haendeVon");
const { tonStaerken, tonDa, gehoerteToene, tonFrequenz, tonName } = lade("klang.js", "tonStaerken, tonDa, gehoerteToene, tonFrequenz, tonName");

test("Töne: C4 ist MIDI 60, Vorzeichen und Notenlinien stimmen", () => {
  assert.equal(parseTon("C4").midi, 60);
  assert.equal(parseTon("A4").midi, 69);
  assert.equal(parseTon("F#5").midi, 78);
  assert.equal(parseTon("Bb3").midi, 58);
  assert.equal(parseTon("E4").step - parseTon("C4").step, 2);
  assert.equal(tonName(61), "Cis4");
  assert.ok(Math.abs(tonFrequenz(60) - 261.63) < 0.01);
});

test("Notenschrift: Dauer gilt weiter, Akkorde und Fingersatz", () => {
  const p = parseHand("C4_1:2 D4 | [C4E4G4]_135:1 r E4:2");
  assert.deepEqual(p.events.map(e => [e.t, e.d]), [[0, 2], [2, 2], [4, 1], [6, 2]]);
  assert.deepEqual(p.events[2].notes.map(n => [n.midi, n.finger]), [[60, 1], [64, 3], [67, 5]]);
  assert.deepEqual(p.takte, [4, 4]);
  assert.throws(() => parseHand("H4"));
});

test("Alle Stücke: eindeutige Kennungen, gültige Stufe, jeder Takt hat die richtige Länge", () => {
  assert.equal(new Set(LIEDER.map(l => l.id)).size, LIEDER.length);
  for (const l0 of LIEDER) {
    assert.ok(STUFEN.some(s => s.nr === l0.stufe), l0.id);
    const l = liedFuer(l0, (() => { let x = 3; return () => (x = (x * 9301 + 49297) % 233280) / 233280; })());
    const takt = (l.takt || [4, 4])[0];
    let laenge = -1;
    for (const hand of ["rechts", "links"]) {
      if (!l[hand]) continue;
      const p = parseHand(l[hand]);
      p.takte.forEach((t, i) => assert.equal(t, i === 0 && l.auftakt ? l.auftakt : takt, `${l.id} ${hand} Takt ${i + 1}`));
      if (laenge >= 0) assert.equal(p.laenge, laenge, l.id + ": beide Hände gleich lang");
      laenge = p.laenge;
      for (const e of p.events) for (const n of e.notes) assert.ok(n.midi >= 36 && n.midi <= 96, l.id + " Tonumfang");
    }
    assert.ok(ablauf(l).schritte.length >= 4, l.id);
    assert.ok(haendeVon(l), l.id);
  }
});

test("Ablauf: gleichzeitige Töne beider Hände bilden einen Schritt", () => {
  const a = ablauf(LIEDER.find(l => l.id === "parallel"));
  assert.equal(a.schritte.length, 9);
  assert.deepEqual(a.schritte[0].notes.map(n => n.hand + n.midi), ["l48", "r60"]);
  const elise = ablauf(LIEDER.find(l => l.id === "elise"));
  const s = elise.schritte.find(x => x.t === 4);
  assert.deepEqual(s.notes.map(n => n.midi), [45, 69]);
});

test("Notentrainer: jedes Mal neue Noten im richtigen Schlüssel", () => {
  const bass = liedFuer(LIEDER.find(l => l.id === "noten-bass"), Math.random);
  assert.ok(bass.links && !bass.rechts);
  for (const e of parseHand(bass.links).events) assert.ok(e.notes[0].midi >= 48 && e.notes[0].midi <= 59);
  const v = parseHand(liedFuer(LIEDER.find(l => l.id === "noten-violin"), Math.random).rechts).events;
  assert.equal(v.length, 16);
  for (let i = 1; i < v.length; i++) assert.notEqual(v[i].notes[0].midi, v[i - 1].notes[0].midi);
});

/* ---------- Tonerkennung mit künstlichem Klavierklang ---------- */
const SR = 44100, N = 8192;
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len;
    for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) {
      const wr = Math.cos(a * k), wi = Math.sin(a * k), xr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi, xi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
      re[i + k + len / 2] = re[i + k] - xr; im[i + k + len / 2] = im[i + k] - xi; re[i + k] += xr; im[i + k] += xi;
    }
  }
}
// Klavierähnlich: Obertöne werden leiser, leicht gestreckt (Inharmonizität), etwas Rauschen. grundStaerke < 1 für tiefe Töne.
function spektrum(toene, opts = {}) {
  const re = new Float64Array(N), im = new Float64Array(N);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const m of toene) {
    const f0 = tonFrequenz(m);
    for (let k = 1; k <= 10; k++) {
      const f = f0 * k * Math.sqrt(1 + 0.0004 * k * k), a = (k === 1 ? (opts.grund ?? 1) : 1 / Math.pow(k, 1.1)) * (opts.laut ?? 1);
      if (f > SR / 2) break;
      const ph = rnd() * 6.28;
      for (let i = 0; i < N; i++) re[i] += a * Math.sin(2 * Math.PI * f * i / SR + ph);
    }
  }
  for (let i = 0; i < N; i++) { re[i] = (re[i] + (rnd() - 0.5) * 0.02) * (0.42 - 0.5 * Math.cos(2 * Math.PI * i / N) + 0.08 * Math.cos(4 * Math.PI * i / N)); }
  fft(re, im);
  const amp = new Float32Array(N / 2);
  for (let i = 0; i < N / 2; i++) amp[i] = Math.hypot(re[i], im[i]) / N;
  return amp;
}
const erkenne = (toene, opts) => tonStaerken(spektrum(toene, opts), null, SR, N, {gate: 2e-3});

test("Einzeltöne von C3 bis C6 werden als stärkster Ton erkannt", () => {
  for (let m = 48; m <= 84; m += 1) {
    const r = erkenne([m]);
    assert.equal(gehoerteToene(r, 0.35, 4)[0], m, tonName(m));
    assert.ok(tonDa(r, m, 0.25, new Set([m])), tonName(m));
    assert.ok(!tonDa(r, m + 1, 0.25, new Set([m + 1])), tonName(m) + " nicht Halbton höher");
    assert.ok(!tonDa(r, m - 1, 0.25, new Set([m - 1])), tonName(m) + " nicht Halbton tiefer");
  }
});

test("Oktave und Quinte darüber zählen nicht, wenn nur der tiefe Ton klingt", () => {
  for (const m of [55, 60, 64, 67]) {
    const r = erkenne([m]);
    assert.ok(!tonDa(r, m + 12, 0.25, new Set([m + 12])), tonName(m) + " ist keine Oktave höher");
    assert.ok(!tonDa(r, m + 19, 0.25, new Set([m + 19])), tonName(m) + " ist keine Duodezime höher");
    assert.ok(!gehoerteToene(r, 0.35, 4).includes(m + 12));
  }
  const okt = erkenne([60, 72]);
  assert.ok(tonDa(okt, 72, 0.25, new Set([60, 72])), "Oktavgriff C4+C5 wird erkannt");
});

test("Akkorde: alle drei Töne da, Nachbartöne nicht", () => {
  for (const akk of [[60, 64, 67], [60, 65, 69], [59, 62, 67], [48, 60, 64, 67]]) {
    const r = erkenne(akk), set = new Set(akk);
    for (const m of akk) assert.ok(tonDa(r, m, 0.2, set), akk.map(tonName) + ": " + tonName(m));
    for (const m of [61, 63, 66, 62].filter(x => !set.has(x))) assert.ok(!tonDa(r, m, 0.2, new Set([m])), akk.map(tonName) + " ohne " + tonName(m));
  }
});

test("Tiefe Basstöne mit schwachem Grundton", () => {
  for (const m of [40, 43, 45, 48]) {
    const r = erkenne([m], {grund: 0.3});
    assert.ok(tonDa(r, m, 0.25, new Set([m])), tonName(m));
  }
});

test("Stille und leises Rauschen ergeben keinen Ton", () => {
  const r = tonStaerken(spektrum([]), null, SR, N, {gate: 2e-3});
  assert.equal(r.max, 0);
  assert.deepEqual(gehoerteToene(r, 0.35, 4), []);
});
