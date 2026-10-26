// Tests der Hundeleben-Logik: cd hund && npm test
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const H = createRequire(import.meta.url)("../src/logic.js");

const W = H.buildWorld(7), N = H.buildNav(W, 0.3);
function sim(extra = {}) { return new H.Sim(Object.assign({world: W, nav: N, rand: H.rng(5), name: "Bello"}, extra)); }
function run(s, sec, inp = {}) { for (let i = 0; i < sec * 30; i++) s.step(1 / 30, typeof inp === "function" ? inp(i) : inp); }

test("Park und Haus sind gleich gebaut, Start und Körbchen sind frei", () => {
  const W2 = H.buildWorld(7);
  assert.equal(W2.trees.length, W.trees.length);
  assert.ok(W.trees.length > 120 && W.sticks.length >= 10 && W.benches.length === 6);
  assert.ok(!H.blocked(N, W.start.x, W.start.z), "Start im Schlafzimmer frei");
  for (const id of ["napf", "wassernapf", "bett", "sofa", "regal", "wanne", "kuehlschrank", "koerbchen"]) {
    const o = W.objects.find(x => x.id === id);
    assert.ok(o, id);
    assert.ok(!H.blocked(N, o.use.x, o.use.z), "Stehplatz frei: " + id);
  }
});

test("Wegfindung führt durch die Türen vom Schlafzimmer in die Küche und in den Park", () => {
  const a = H.findPath(N, W.start.x, W.start.z, 4.7, -127.6);
  assert.ok(a && a.length >= 2, "Weg in die Küche");
  const b = H.findPath(N, W.start.x, W.start.z, 0, -60);
  assert.ok(b, "Weg in den Park");
  let prev = {x: W.start.x, z: W.start.z};
  for (const q of b) { assert.ok(H.los(N, prev.x, prev.z, q.x, q.z), "freie Strecke"); prev = q; }
});

test("Mensch läuft per Antippen zum Napf, füllt ihn, Hund frisst", () => {
  const s = sim();
  s.need.hunger = 40;
  assert.ok(s.order("fuettern", {type: "obj", id: "napf"}));
  run(s, 40);
  assert.ok(s.events.some(e => e.type === "fed"), "gefüttert");
  assert.ok(s.tasks.find(t => t.id === "fruehstueck").done, "Frühstück erledigt");
  run(s, 80);
  assert.ok(s.need.hunger > 80, "Hund hat gefressen: " + s.need.hunger);
});

test("Gangarten: Trab bewegt diagonale Beine gemeinsam", () => {
  for (let ph = 0; ph < 1; ph += 0.1) {
    assert.deepEqual(H.legPose("trot", ph, 0), H.legPose("trot", ph, 3));
    assert.deepEqual(H.legPose("trot", ph, 1), H.legPose("trot", ph, 2));
  }
  assert.equal(H.pickGait(0), "stand");
  assert.equal(H.pickGait(5), "gallop");
});

test("Gassi: anleinen, raus in den Park, Hund macht sein Geschäft, Leine hält ihn nah", () => {
  const s = sim();
  s.need.blase = 40;
  s.setDog("idle", 1);
  s.d.x = s.p.x + 1; s.d.z = s.p.z;
  assert.ok(s.setLeash(true));
  s.walkTo(0, -95);
  let maxLeash = 0;
  for (let i = 0; i < 30 * 90; i++) {
    s.step(1 / 30, {});
    const h = s.hand(), c = s.collar();
    maxLeash = Math.max(maxLeash, Math.hypot(h.x - c.x, h.z - c.z));
    if (!s.p.path && !s.p.goal && H.inPark(s.p) && s.events.some(e => e.type === "pee")) break;
  }
  assert.ok(H.inPark(s.p), "im Park");
  assert.ok(maxLeash < H.LEASH + 0.3, "Leine " + maxLeash);
  run(s, 30);
  assert.ok(s.events.some(e => e.type === "pee" && e.park), "Geschäft im Park");
  assert.ok(s.tasks.find(t => t.id === "morgenrunde").done, "Morgenrunde erledigt");
});

test("Stock werfen im Park: Hund holt ihn und bringt ihn zurück", () => {
  const s = sim();
  s.p.x = 0; s.p.z = -80; s.p.yaw = 0; s.d.x = 1; s.d.z = -79; s.setDog("idle", 5); s.need.blase = 100; s.d.darm = 0;
  const st = s.items.find(i => i.kind === "stock"); st.state = "player"; s.p.holding = st.id;
  assert.ok(s.throwItem());
  let back = false;
  for (let i = 0; i < 30 * 25 && !back; i++) { s.step(1 / 30, {}); back = s.events.some(e => e.type === "fetched"); }
  assert.ok(back, "gebracht");
  assert.equal(s.p.holding, st.id, "wieder in der Hand");
});

test("Kommandos: Sitz, Platz, Pfote erledigen die Kombi-Aufgabe der Reihe nach", () => {
  const s = sim();
  s.tasks = [{id: "kombi", need: 3, have: 0, done: false, failed: false, text: ""}];
  s.setDog("idle", 9); s.need.blase = 100; s.need.hunger = 100; s.need.durst = 100; s.need.energie = 100; s.need.spass = 100;
  s.d.x = s.p.x + 1.2; s.d.z = s.p.z;
  s.command("sitz"); run(s, 2);
  s.command("platz"); run(s, 2);
  s.command("pfote"); run(s, 3);
  assert.ok(s.tasks[0].done, "Kombi " + s.tasks[0].have);
});

test("Ohne Gassi gibt es irgendwann eine Pfütze, aufwischen räumt sie weg", () => {
  const s = sim();
  s.setDog("idle", 1); s.need.blase = 0.1; s.d.x = -3; s.d.z = -125;
  run(s, 3);
  assert.equal(s.puddles.length, 1);
  s.order("aufwischen", {type: "puddle", id: s.puddles[0].id});
  run(s, 30);
  assert.equal(s.puddles.length, 0);
});

test("Schlafen springt zum nächsten Morgen und bewertet den Tag", () => {
  const s = sim();
  s.t = 21 * 60; s.d.x = -6.6; s.d.z = -127.5;
  s.order("schlafen", {type: "obj", id: "bett"});
  run(s, 30);
  const end = s.events.find(e => e.type === "dayEnd");
  assert.ok(end, "Tag beendet");
  assert.equal(s.day, 2);
  assert.ok(s.t >= 420 && s.t < 460, "Uhr " + s.t);
  assert.ok(end.stars >= 1 && end.stars <= 5);
});

test("Speichern und Laden behalten Tag, Uhrzeit und Bedürfnisse", () => {
  const s = sim(); s.t = 600; s.need.spass = 33; s.bowl.food = 0.5;
  const s2 = sim({save: JSON.parse(JSON.stringify(s.save()))});
  assert.equal(s2.t, 600); assert.equal(s2.need.spass, 33); assert.equal(s2.bowl.food, 0.5);
});

test("Aufgaben des Tages: feste Runden plus Zufall, zu zweit mit Begrüßung", () => {
  const a = H.makeTasks(1, 3), b = H.makeTasks(1, 3, {multi: true});
  assert.equal(a[0].id, "morgenrunde");
  assert.ok(a.some(t => t.id === "leine"));
  assert.ok(b.some(t => t.id === "gruss"));
  assert.deepEqual(H.makeTasks(4, 3).map(t => t.id), H.makeTasks(4, 3).map(t => t.id));
});

test("Zu zweit: ein fremder Hund in der Nähe wird beschnuppert", () => {
  const s = sim({multi: true});
  s.p.x = 0; s.p.z = -80; s.d.x = 1; s.d.z = -80; s.need.blase = 100; s.d.darm = 0; s.setDog("idle", 0.1);
  s.others = [{dog: {x: 3, z: -78}}];
  run(s, 8);
  assert.ok(s.events.some(e => e.type === "greet"));
  assert.ok(s.tasks.find(t => t.id === "gruss").done);
});

test("Baden: Hund geht in die Wanne, danach ist er sauber", () => {
  const s = sim();
  s.need.sauber = 20; s.setDog("idle", 30); s.d.x = 6; s.d.z = -131; s.p.x = 6; s.p.z = -132;
  s.order("baden", {type: "obj", id: "wanne"});
  run(s, 45);
  assert.ok(s.events.some(e => e.type === "bath"), "gebadet");
  assert.ok(s.need.sauber > 98);
});

test("Haufen im Park: einpacken und in den Mülleimer werfen", () => {
  const s = sim();
  s.tasks = [{id: "haufen", need: 1, have: 0, done: false, failed: false, text: ""}];
  s.p.x = 0; s.p.z = -60; s.poops.push({id: "h1", x: 1, z: -60});
  s.order("aufheben", {type: "poop", id: "h1"});
  run(s, 6);
  assert.equal(s.poops.length, 0); assert.equal(s.p.bags, 1);
  const bin = s.W.objects.find(o => o.id === "eimer_p0");
  s.order("wegwerfen", {type: "obj", id: bin.id});
  run(s, 80);
  assert.ok(s.tasks[0].done, "Haufen-Aufgabe");
});
