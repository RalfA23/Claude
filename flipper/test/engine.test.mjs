// Tests der Flipper-Physik und -Regeln: cd flipper && npm test
import test from "node:test";
import assert from "node:assert/strict";
import { F, seeded, autopilot } from "./sim.mjs";

function freeBall(g, x, y, vx = 0, vy = 0) {
  g.balls = [{x, y, vx, vy, ramp: null, held: null, cool: 0, inside: {}, still: 0, auto: 0, launched: true, sx: x, sy: y}];
  return g.balls[0];
}

test("alle Tische sind vollständig beschrieben", () => {
  assert.deepEqual(F.TABLE_ORDER, ["klassik", "comic", "huberman", "weltraum", "buecher"]);
  for (const id of F.TABLE_ORDER) {
    const t = F.TABLES[id];
    assert.equal(t.id, id);
    assert.ok(t.name && t.blurb && t.theme && t.theme.dmd, id);
    assert.equal(t.lanes.xs.length + 1, t.lanes.guides.length, id + ": Lanes und Führungen");
    assert.ok(t.missions.length >= 5, id + ": Missionen");
    for (const m of t.missions) assert.ok(["bumper", "bank", "ramp", "spin", "lanes", "saucer", "standups", "mover", "orbit", "drop", "lane"].includes(m.ev), id + ": " + m.ev);
  }
});

test("voller Abschuss bringt die Kugel bis ganz nach oben", () => {
  for (const id of F.TABLE_ORDER) {
    const g = new F.Game(F.TABLES[id], {rand: seeded(1)});
    g.input.plunger = true;
    for (let i = 0; i < 60; i++) g.update(1 / 60);
    g.input.plunger = false;
    let minY = 1e9;
    for (let i = 0; i < 90; i++) { g.update(1 / 60); g.balls.forEach((b) => (minY = Math.min(minY, b.y))); }
    assert.ok(minY < 120, id + ": höchster Punkt " + minY);
  }
});

test("schwacher Abschuss fällt zurück in die Bahn", () => {
  const g = new F.Game(F.TABLES.klassik, {rand: seeded(2)});
  g.input.plunger = true; g.update(1 / 60); g.input.plunger = false;
  for (let i = 0; i < 240; i++) g.update(1 / 60);
  assert.ok(g.waiting(), "Kugel liegt wieder auf dem Abzug");
});

test("der Flipper schießt eine liegende Kugel nach oben", () => {
  for (const side of ["L", "R"]) {
    const g = new F.Game(F.TABLES.klassik, {rand: seeded(3)});
    const fl = g.w.flippers[side === "L" ? 0 : 1];
    const mx = fl.px + Math.cos(fl.ang) * 55, my = fl.py + Math.sin(fl.ang) * 55;
    const b = freeBall(g, mx, my - 24);
    for (let i = 0; i < 10; i++) g.update(1 / 60);
    g.input[side === "L" ? "left" : "right"] = true;
    let best = 0;
    for (let i = 0; i < 20; i++) { g.update(1 / 60); best = Math.min(best, b.vy); }
    assert.ok(best < -1200, side + ": vy " + best);
  }
});

test("eine Kugel in der Inlane rollt auf den Flipper und nicht ins Aus daneben", () => {
  for (const [x, y] of [[80, 860], [480, 860]]) {
    const g = new F.Game(F.TABLES.klassik, {rand: seeded(4)});
    const b = freeBall(g, x, y);
    let maxX = 0, minX = 1e9;
    for (let i = 0; i < 50 && g.balls.length; i++) { g.update(1 / 60); maxX = Math.max(maxX, b.x); minX = Math.min(minX, b.x); }
    if (x < 300) assert.ok(maxX > 180, "links erreicht den Flipper"); else assert.ok(minX < 380, "rechts erreicht den Flipper");
  }
});

test("Bumper stoßen die Kugel kräftig ab und zählen Punkte", () => {
  const g = new F.Game(F.TABLES.klassik, {rand: seeded(5)});
  const bu = g.w.circs.find((c) => c.tag === "bumper");
  const b = freeBall(g, bu.x, bu.y - bu.r - 30, 0, 400);
  const before = g.score;
  for (let i = 0; i < 6; i++) g.update(1 / 60);
  assert.ok(g.score > before, "Punkte");
  assert.ok(Math.hypot(b.vx, b.vy) > 500, "Abstoß");
});

test("Fallziele fallen, die Reihe gibt den Bonus und steht danach wieder", () => {
  const g = new F.Game(F.TABLES.klassik, {rand: seeded(6)});
  const drops = g.w.segs.filter((s) => s.tag === "drop");
  const seen = [];
  for (const d of drops) { g.onHit(d, {x: d.ax, y: d.ay}, 300); seen.push(...g.drainEvents().map((e) => e.type)); }
  assert.ok(seen.includes("bank"));
  assert.ok(drops.every((d) => !d.on));
  for (let i = 0; i < 90; i++) g.update(1 / 60);
  assert.ok(drops.every((d) => d.on), "Reihe steht wieder");
});

test("Rampe fährt die Kugel bis zur Inlane und zählt", () => {
  for (const id of F.TABLE_ORDER) {
    const g = new F.Game(F.TABLES[id], {rand: seeded(7)});
    const r = g.w.ramps[0];
    const b = freeBall(g, r.entry.x, r.entry.y + 40, 0, -1500);
    let ev = [];
    for (let i = 0; i < 120 && !ev.includes("ramp"); i++) { g.update(1 / 60); ev.push(...g.drainEvents().map((e) => e.type)); }
    assert.ok(ev.includes("rampEnter") && ev.includes("ramp"), id);
    assert.ok(Math.abs(b.x - r.exit.x) < 40 && b.y > 700, id + ": landet in der Inlane");
  }
});

test("zwei gesperrte Kugeln starten den Multiball mit drei Kugeln", () => {
  const g = new F.Game(F.TABLES.klassik, {rand: seeded(8)});
  g.input.plunger = true; for (let i = 0; i < 40; i++) g.update(1 / 60); g.input.plunger = false; g.update(1 / 60);
  g.lockLit = 2;
  g.onSaucer(g.balls[0]); g.onSaucer(g.balls[0]);
  assert.ok(g.multiball);
  for (let i = 0; i < 300; i++) g.update(1 / 60);
  assert.equal(g.balls.length + g.queue.length, 3);
});

test("zu viel Rütteln gibt Tilt: Flipper tot, kein Bonus", () => {
  const g = new F.Game(F.TABLES.comic, {rand: seeded(9)});
  const ev = [];
  for (let i = 0; i < 5; i++) { g.nudge(); ev.push(...g.drainEvents().map((e) => e.type)); }
  assert.ok(ev.includes("tiltWarn") && ev.includes("tilt"));
  g.input.left = true; g.update(1 / 60);
  assert.equal(g.w.flippers[0].ang, g.w.flippers[0].rest);
});

test("Missionen zählen und belohnen", () => {
  const g = new F.Game(F.TABLES.weltraum, {rand: seeded(10)});
  const m = g.currentMission();
  assert.equal(m.ev, "bumper");
  for (let i = 0; i < m.need; i++) g.progressMission("bumper");
  const ev = g.drainEvents().map((e) => e.type);
  assert.ok(ev.includes("mission"));
  assert.equal(g.currentMission().ev, "bank");
});

test("ganze Spiele mit Autopilot: keine Kugel verlässt den Tisch, keine hängt fest, Spiel endet", () => {
  for (const id of F.TABLE_ORDER) {
    const rnd = seeded(11);
    for (let gi = 0; gi < 3; gi++) {
      const g = new F.Game(F.TABLES[id], {rand: rnd});
      let t = 0, searches = 0;
      while (!g.over && t < 1200) {
        autopilot(g, t, rnd); g.update(1 / 60); t += 1 / 60;
        for (const e of g.drainEvents()) if (e.type === "search") searches++;
        for (const b of g.balls) {
          assert.ok(Number.isFinite(b.x) && Number.isFinite(b.y), id + ": Zahl");
          if (!b.ramp) assert.ok(b.x > 12 && b.x < 588 && b.y > 2, id + ": im Gehäuse " + b.x.toFixed(0) + "," + b.y.toFixed(0));
        }
      }
      assert.ok(g.over, id + ": Spiel endet");
      assert.ok(searches <= 3, id + ": Ballsuche " + searches + "×");
      assert.ok(g.score > 0);
    }
  }
});

test("wanderndes Ziel bewegt sich, zählt und startet nach drei Treffern den Hurry-up", () => {
  for (const id of F.TABLE_ORDER) {
    const g = new F.Game(F.TABLES[id], {rand: seeded(12)});
    const m = g.w.mover; assert.ok(m, id + ": mover");
    const x0 = m.x; for (let i = 0; i < 60; i++) g.update(1 / 60);
    assert.notEqual(m.x, x0, id + ": bewegt sich");
  }
  const g = new F.Game(F.TABLES.klassik, {rand: seeded(13)});
  const ev = [];
  for (let i = 0; i < 3; i++) { g.w.mover.cool = 0; g.onHit(g.w.mover, {x: g.w.mover.x, y: g.w.mover.y}, 400); ev.push(...g.drainEvents().map((e) => e.type)); }
  assert.ok(ev.includes("mover") && ev.includes("hurryStart"));
  assert.ok(g.hurry && g.hurry.v > 0);
});

test("Kickback rettet die Kugel einmal, Mystery und Frenzy geben Punkte", () => {
  const g = new F.Game(F.TABLES.comic, {rand: seeded(14)});
  const b = freeBall(g, 40, 900, 0, 600);
  const ev = [];
  for (let i = 0; i < 90; i++) { g.update(1 / 60); ev.push(...g.drainEvents().map((e) => e.type)); }
  assert.ok(ev.includes("kickback"), "Kickback ausgelöst");
  assert.ok(b.x > 90 || b.y < 600, "Kugel wieder im Spiel");
  assert.equal(g.kickLit, false);
  const before = g.score; g.mystery(); assert.ok(g.drainEvents().some((e) => e.type === "mystery"));
  g.startFrenzy(); g.drainEvents();
  const bu = g.w.circs.find((c) => c.tag === "bumper"); bu.cool = 0; const s = g.score; g.onHit(bu, {x: 0, y: 0}, 300);
  //.find((c) => c.tag === "bumper"), {x: 0, y: 0}, 300);
  assert.ok(g.score - s >= 1500, "Frenzy-Bonus");
  assert.ok(g.score >= before);
});

test("Bibliothek: Missionen aus Klassikern und der eigenen Bücher-App", () => {
  assert.ok(F.CLASSICS.length >= 30);
  const lib = [{title: "Der Zauberberg", author: "Thomas Mann", status: "lese"}];
  const ms = F.bookMissions(lib, seeded(15));
  assert.ok(ms.length >= 5);
  assert.ok(ms.some((m) => m.mine && m.title === "Der Zauberberg"), "eigenes Buch drin");
  const g = new F.Game(F.TABLES.buecher, {rand: seeded(16), missions: ms});
  assert.equal(g.missions, ms);
  const plain = F.bookMissions([], seeded(17));
  assert.ok(plain.every((m) => !m.mine) && plain.length >= 5);
});
