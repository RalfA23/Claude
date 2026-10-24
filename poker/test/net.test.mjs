// Mehrspieler-Tisch mit einem Fake-Realtime (wie Supabase Broadcast und Presence): cd poker && npm test
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const req = createRequire(import.meta.url);
const P = req("../src/engine.js");
globalThis.Poker = P;
const N = req("../src/net.js");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 8000) { const t = Date.now(); while (!fn()) { if (Date.now() - t > ms) throw new Error("Zeit abgelaufen"); await wait(10); } }

// Ein Kanal: Broadcast geht an alle außer den Absender, Presence ist eine Map key → meta.
function hub() {
  const subs = new Set(), log = [];
  const presence = () => { const m = {}; for (const s of subs) if (s.meta) m[s.key] = s.meta; return m; };
  const sync = () => { const m = presence(); for (const s of subs) s.pres && setTimeout(() => s.pres(m), 0); };
  return {
    log,
    transport(key) {
      const s = { key, meta: null, msg: null, pres: null };
      subs.add(s);
      return {
        send(ev, p) { const copy = JSON.parse(JSON.stringify(p)); log.push({ from: key, ev, p: copy }); for (const o of subs) if (o !== s && o.msg) setTimeout(() => o.msg(ev, JSON.parse(JSON.stringify(copy))), 1); },
        onMessage(cb) { s.msg = cb; }, onPresence(cb) { s.pres = cb; },
        track(meta) { s.meta = meta; sync(); },
        close() { subs.delete(s); sync(); },
      };
    },
    // Lauscher ohne Schlüssel: sieht alle Nachrichten und kann eigene schicken.
    spy() { return this.transport("spion"); },
  };
}

const settings = { name: "Test", chips: 500, sb: 5, bb: 10, seats: 6, turn: 2, bots: 1, botDelay: 5, pause: 30, level: 0 };

function mkTable(h, id, host) {
  const views = [];
  const t = N.Table({ transport: h.transport(id), me: { id, name: id.toUpperCase() }, host, settings: host ? { ...settings } : null, onChange: (v) => views.push(v) });
  t.views = views;
  return t;
}
const last = (t) => t.views[t.views.length - 1];

test("Tisch: Beitritt, verdeckte Karten, Aktionen, Chips bleiben erhalten", async () => {
  const h = hub();
  const host = mkTable(h, "a", true);
  await host.hostStart(); await host.join();
  const b = mkTable(h, "b", false), c = mkTable(h, "c", false);
  await b.join(); await c.join();
  await until(() => host.game().players.length === 4);
  assert.ok(host.deal());
  // Alle Menschen spielen passiv mit, bis 6 Hände gespielt sind.
  const players = [host, b, c];
  const total = 2000;
  let rounds = 0;
  while (host.game().hand < 6) {
    for (const t of players) {
      const v = last(t);
      if (!v || v.street === "done" || v.street === "idle") continue;
      const me = v.players.find((p) => p.id === t.me.id);
      if (me && me.inHand && v.street !== "done") assert.ok(me.hole.every((x) => x >= 0), t.me.id + " sieht eigene Karten");
      v.players.filter((p) => p.id !== t.me.id && !(v.result && v.result.shown.includes(p.id))).forEach((p) => assert.ok(p.hole.every((x) => x === -1), "fremde Karten verdeckt"));
      const cur = v.players[v.toAct];
      if (cur && cur.id === t.me.id) await t.act(rounds++ % 5 === 0 ? "raise" : "call", v.currentBet + v.minRaise);
    }
    await wait(5);
    const g = host.game();
    if (g.street === "done") assert.equal(g.players.reduce((s, p) => s + p.stack, 0), total);
  }
  // Nichts im Funkverkehr verrät fremde Karten: alle Klartext-Karten sind -1 oder beim Showdown aufgedeckt.
  for (const m of h.log.filter((x) => x.ev === "state")) {
    const shown = (m.p.game.result && m.p.game.result.shown) || [];
    m.p.game.players.forEach((p) => { if (!shown.includes(p.id)) assert.ok(p.hole.every((x) => x === -1)); });
    assert.equal(m.p.game.deck, undefined);
  }
  for (const t of [host, b, c]) t.close();
});

test("Fremde können keine Karten lesen und nicht für andere setzen", async () => {
  const h = hub();
  const host = mkTable(h, "a", true);
  await host.hostStart(); await host.join();
  const b = mkTable(h, "b", false); await b.join();
  await until(() => host.game().players.length === 3);
  host.deal();
  await until(() => last(b) && last(b).hand === 1 && last(b).players.find((p) => p.id === "b").hole[0] >= 0);
  const st = h.log.filter((x) => x.ev === "state").pop().p;
  assert.ok(st.enc.b, "Karten für b liegen verschlüsselt bei");
  // Ein Lauscher mit eigenem Schlüssel kann den Umschlag nicht öffnen.
  const kp = await N.keyPair(), k = await N.shared(kp.privateKey, st.hostPub);
  await assert.rejects(N.open(k, st.enc.b));
  // Gefälschte Aktion im Namen von b mit falschem Schlüssel wird ignoriert.
  const g = host.game(), before = JSON.stringify(g.players.map((p) => [p.stack, p.folded]));
  const spy = h.spy();
  spy.send("act", { id: "b", box: await N.seal(k, { hand: g.hand, action: "fold" }) });
  await wait(30);
  assert.equal(JSON.stringify(host.game().players.map((p) => [p.stack, p.folded])), before);
  for (const t of [host, b]) t.close();
});

test("Gastgeber geht: nächster Spieler übernimmt, Hand wird neu gegeben", async () => {
  const h = hub();
  const host = mkTable(h, "a", true);
  await host.hostStart(); await host.join();
  const b = mkTable(h, "b", false), c = mkTable(h, "c", false);
  await b.join(); await c.join();
  await until(() => host.game().players.length === 4);
  host.deal();
  await until(() => last(b) && last(b).hand === 1);
  const stacks = { ...host.game().startStacks };
  host.close(); // Browser zu, ohne Abmeldung
  await until(() => b.isHost, 9000);
  assert.equal(c.isHost, false);
  await until(() => b.game() && b.game().hand === 2, 9000);
  const g = b.game();
  assert.ok(!g.players.some((p) => p.id === "a" && !p.away), "alter Gastgeber ist abwesend");
  const sum = g.players.reduce((s, p) => s + p.stack + p.total, 0);
  assert.equal(sum, Object.values(stacks).reduce((s, x) => s + x, 0), "Stände vom Handanfang");
  await until(() => last(c) && last(c).hand === 2 && last(c).players.find((p) => p.id === "c").hole[0] >= 0, 9000);
  for (const t of [b, c]) t.close();
});
