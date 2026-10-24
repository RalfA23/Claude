// Tests der Poker-Logik: cd poker && npm test
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const P = createRequire(import.meta.url)("../src/engine.js");

const H = (s) => s.split(" ").map(P.parse);
const ev = (s) => P.evaluate(H(s));
function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

// Unabhängige Referenz: 5-Karten-Bewertung durch Sortieren, beste aus allen 21 Kombinationen.
function ref5(c) {
  const r = c.map((x) => x >> 2).sort((a, b) => b - a), s = c.map((x) => x & 3);
  const fl = s.every((x) => x === s[0]);
  const uniq = [...new Set(r)];
  let st = -1;
  if (uniq.length === 5) { if (r[0] - r[4] === 4) st = r[0]; else if (r.join() === "12,3,2,1,0") st = 3; }
  const cnt = {}; r.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1));
  const g = Object.entries(cnt).map(([k, v]) => [v, +k]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  const ks = g.map((x) => x[1]);
  let cat;
  if (st >= 0 && fl) return [8, st];
  if (g[0][0] === 4) cat = 7; else if (g[0][0] === 3 && g[1][0] === 2) cat = 6; else if (fl) return [5, ...r];
  else if (st >= 0) return [4, st]; else if (g[0][0] === 3) cat = 3; else if (g[0][0] === 2 && g[1][0] === 2) cat = 2; else if (g[0][0] === 2) cat = 1; else cat = 0;
  return [cat, ...ks];
}
const cmp = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] ?? -1) - (b[i] ?? -1); if (d) return Math.sign(d); } return 0; };
function ref7(c) {
  let best = null;
  for (let a = 0; a < 7; a++) for (let b = a + 1; b < 7; b++) { const v = ref5(c.filter((_, i) => i !== a && i !== b)); if (!best || cmp(v, best) > 0) best = v; }
  return best;
}

test("Kategorien", () => {
  const cases = [
    ["As Ks Qs Js Ts 2d 3c", 8], ["5h 4h 3h 2h Ah Kd Kc", 8], ["9c 9d 9h 9s 2d 3c 4h", 7], ["Kc Kd Kh 2s 2d 3c 4h", 6],
    ["Kc Kd Kh 2s 2d 2c 4h", 6], ["Ah 9h 7h 4h 2h Kd Kc", 5], ["Ah 2c 3d 4s 5h Kd Qc", 4], ["Th Jc Qd Ks Ah 2d 2c", 4],
    ["7h 7c 7d As Kh 2d 4c", 3], ["7h 7c 4d 4s Kh Kd 2c", 2], ["7h 7c 4d 9s Kh Qd 2c", 1], ["7h 3c 4d 9s Kh Qd 2c", 0],
  ];
  for (const [h, c] of cases) assert.equal(P.category(ev(h)), c, h);
  assert.equal(P.handName(ev("As Ks Qs Js Ts 2d 3c")), "Royal Flush");
  assert.equal(P.handName(ev("Kc Kd Kh 2s 2d 3c 4h")), "Full House König und Zwei");
});

test("Reihenfolge und Kicker", () => {
  assert.ok(ev("6h 2c 3d 4s 5h Kd Qc") > ev("Ah 2c 3d 4s 5h Kd Qc"), "Sechser-Straße schlägt Wheel");
  assert.ok(ev("Ah Ad Kc 9s 7h 3d 2c") > ev("Ah Ad Qc 9s 7h 3d 2c"), "Kicker zählt");
  assert.equal(ev("Ah Ad Kc Qs Jh 3d 2c"), ev("As Ac Kd Qh Jc 4d 2s"), "fünfte Karte entscheidet nicht mehr");
  assert.ok(ev("Kc Kd Kh As Ad Qc Qh") > ev("Kc Kd Kh Qs Qd Jc Jh"));
  assert.ok(ev("2c 2d 2h 2s Ad 3c 3h") > ev("2c 2d 2h 2s Kd Kc Kh"), "Vierling-Kicker");
});

test("Bewertung stimmt mit Referenz überein (20 000 Zufallspaare)", () => {
  const rng = seeded(7);
  for (let i = 0; i < 20000; i++) {
    const d = P.shuffled(rng), a = d.slice(0, 7), b = d.slice(7, 14);
    assert.equal(Math.sign(P.evaluate(a) - P.evaluate(b)), cmp(ref7(a), ref7(b)), a.map(P.cardText) + " / " + b.map(P.cardText));
    assert.equal(P.category(P.evaluate(a)), ref7(a)[0]);
  }
});

test("bestFive liefert die bewertete Hand", () => {
  const c = H("Kc Kd Kh 2s 2d 3c 4h"), f = P.bestFive(c);
  assert.equal(f.length, 5);
  assert.equal(P.evaluate(f), P.evaluate(c));
});

const players = (stacks) => stacks.map((s, i) => ({ id: "p" + i, name: "P" + i, stack: s }));

test("Blinds und Reihenfolge mit drei Spielern", () => {
  const g = P.createGame({ players: players([1000, 1000, 1000]), sb: 10, bb: 20 });
  P.startHand(g, seeded(1));
  assert.equal(g.button, 0); assert.equal(g.sbSeat, 1); assert.equal(g.bbSeat, 2);
  assert.equal(g.toAct, 0, "UTG ist der Button bei drei Spielern");
  assert.equal(g.players[1].bet, 10); assert.equal(g.players[2].bet, 20);
  P.act(g, "call"); P.act(g, "call");
  assert.equal(g.street, "preflop", "Big Blind hat noch die Option");
  assert.equal(g.toAct, 2);
  const L = P.legal(g); assert.ok(L.canCheck && L.canRaise);
  P.act(g, "check");
  assert.equal(g.street, "flop"); assert.equal(g.board.length, 3);
  assert.equal(g.toAct, 1, "nach dem Flop beginnt der Small Blind");
});

test("Heads-up: Button ist Small Blind und beginnt vor dem Flop", () => {
  const g = P.createGame({ players: players([500, 500]), sb: 5, bb: 10 });
  P.startHand(g, seeded(2));
  assert.equal(g.sbSeat, g.button);
  assert.equal(g.toAct, g.button);
  P.act(g, "call"); P.act(g, "check");
  assert.equal(g.street, "flop");
  assert.equal(g.toAct, g.bbSeat, "nach dem Flop beginnt der Big Blind");
});

test("Alle passen: Blinds gehen an den Big Blind", () => {
  const g = P.createGame({ players: players([1000, 1000, 1000]), sb: 10, bb: 20 });
  P.startHand(g, seeded(3));
  P.act(g, "fold"); P.act(g, "fold");
  assert.equal(g.street, "done");
  assert.equal(g.players[2].stack, 1010);
  assert.equal(g.result.showdown, false);
});

test("Mindest-Raise und unvollständiges All-in öffnet nicht neu", () => {
  const g = P.createGame({ players: players([1000, 1000, 130]), sb: 10, bb: 20 });
  P.startHand(g, seeded(4)); // Button p0, SB p1, BB p2 (130)
  let L = P.legal(g);
  assert.equal(L.minTo, 40);
  P.act(g, "raise", 100); // p0 auf 100, Raise um 80
  assert.equal(g.minRaise, 80);
  L = P.legal(g); assert.equal(L.minTo, 180);
  P.act(g, "call"); // p1
  P.act(g, "allin"); // p2 auf 130: nur 30 mehr, kein voller Raise
  assert.equal(g.currentBet, 130);
  L = P.legal(g);
  assert.equal(L.seat, 0); assert.equal(L.canRaise, false, "p0 darf nach unvollständigem Raise nicht erhöhen");
  assert.equal(L.toCall, 30);
  P.act(g, "call");
  assert.equal(P.legal(g).canRaise, false);
  P.act(g, "call");
  assert.equal(g.street, "flop");
});

test("Side Pots mit drei All-ins", () => {
  const ps = [
    { id: "a", total: 100, inHand: true, folded: false }, { id: "b", total: 300, inHand: true, folded: false },
    { id: "c", total: 500, inHand: true, folded: false }, { id: "d", total: 200, inHand: true, folded: true },
  ];
  const pots = P.buildPots(ps);
  assert.deepEqual(pots.map((x) => x.amount), [400, 500, 200]);
  assert.deepEqual(pots.map((x) => x.eligible), [["a", "b", "c"], ["b", "c"], ["c"]]);
});

test("Showdown mit Side Pot: Kurzer gewinnt Hauptpot, Rest an den Zweitbesten", () => {
  const g = P.createGame({ players: players([100, 500, 500]), sb: 10, bb: 20 });
  P.startHand(g, seeded(5));
  // Karten festlegen: p0 Asse, p1 Könige, p2 Damen, Board ohne Hilfe.
  g.players[0].hole = H("As Ah"); g.players[1].hole = H("Ks Kh"); g.players[2].hole = H("Qs Qh");
  g.deck = H("2c 3d 8h 9c 4s 7d Jd 2d").reverse();
  P.act(g, "allin"); P.act(g, "raise", 300); P.act(g, "call");
  while (g.street !== "done") P.act(g, P.legal(g).canCheck ? "check" : "call");
  assert.equal(g.players[0].stack, 300);
  assert.equal(g.players[1].stack, 600);
  assert.equal(g.players[2].stack, 200);
  assert.equal(g.players.reduce((s, p) => s + p.stack, 0), 1100);
  assert.equal(g.result.pots.length, 2);
  assert.equal(g.result.pots[0].hand, "Paar Ass");
});

test("Split Pot bei Straße auf dem Board", () => {
  const g = P.createGame({ players: players([1000, 1000, 1000]), sb: 5, bb: 10 });
  P.startHand(g, seeded(6));
  g.players[0].hole = H("2c 3c"); g.players[1].hole = H("2d 3d"); g.players[2].hole = H("4h 5h");
  g.deck = H("9c Ac Kd Qh 2s Js 8d Th").reverse();
  // p0 passt, Blinds spielen Board-Straße
  P.act(g, "fold");
  P.act(g, "raise", 15);
  P.act(g, "call");
  while (g.street !== "done") P.act(g, P.legal(g).canCheck ? "check" : "call");
  assert.equal(g.result.pots[0].winners.length, 2);
  assert.equal(g.players.reduce((s, p) => s + p.stack, 0), 3000);
});

test("Öffentliche Ansicht verrät keine fremden Karten und kein Deck", () => {
  const g = P.createGame({ players: players([1000, 1000]), sb: 10, bb: 20 });
  P.startHand(g, seeded(8));
  const v = P.publicView(g, "p0");
  assert.equal(v.deck, undefined);
  assert.deepEqual(v.players[1].hole, [-1, -1]);
  assert.deepEqual(v.players[0].hole, g.players[0].hole);
});

test("Tausende Bot-Hände: Chips bleiben erhalten, Regeln halten", () => {
  const rng = seeded(11);
  for (let t = 0; t < 30; t++) {
    const n = 2 + (t % 8), start = 300 + 50 * (t % 5);
    const g = P.createGame({ players: Array.from({ length: n }, (_, i) => ({ id: "b" + i, name: "B" + i, stack: start + i * 37, bot: { style: ["vorsichtig", "solide", "wild"][i % 3] } })), sb: 5, bb: 10 });
    const total = g.players.reduce((s, p) => s + p.stack, 0);
    for (let h = 0; h < 40 && P.canStart(g); h++) {
      P.startHand(g, rng);
      let guard = 0;
      while (g.street !== "done") {
        const L = P.legal(g);
        assert.ok(L, "jemand muss am Zug sein");
        const d = P.botDecide(g, rng, h % 3);
        P.act(g, d.action, d.amount);
        assert.ok(++guard < 200, "Hand endet");
        assert.equal(g.players.reduce((s, p) => s + p.stack + (g.street === "done" ? 0 : p.total), 0), total);
      }
      assert.equal(g.players.reduce((s, p) => s + p.stack, 0), total, "Chips nach der Hand");
      assert.ok(g.players.every((p) => p.stack >= 0));
      assert.ok(g.board.length === 5 || !g.result.showdown);
      const cards = g.board.concat(...g.players.map((p) => p.hole));
      assert.equal(new Set(cards).size, cards.length, "keine Karte doppelt");
    }
  }
});

test("Equity: Asse gegen eine Zufallshand rund 85 %", () => {
  const e = P.equity(H("As Ah"), [], 1, 4000, seeded(3));
  assert.ok(e > 0.81 && e < 0.89, String(e));
});
