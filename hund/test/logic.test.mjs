// Tests der Hundeleben-Logik: cd hund && npm test
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const H = createRequire(import.meta.url)("../src/logic.js");

const W = H.buildWorld(7), N = H.buildNav(W, 0.3);
// Standard: der Hund folgt immer, damit die Abläufe gleich bleiben. Gehorsam selbst testet ein eigener Test.
function sim(extra = {}) { const s = new H.Sim(Object.assign({world: W, nav: N, rand: H.rng(5), name: "Bello"}, extra)); s.obeyChance = () => 1; s.ambient = () => null; s.plan = []; return s; }
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

test("Gehorsam: Unbekanntes verwirrt, Leckerli direkt nach dem Befolgen bringt Können", () => {
  const s = new H.Sim({world: W, nav: N, rand: H.rng(9), name: "Bello"}); s.ambient = () => null; s.plan = [];
  s.setDog("idle", 9); s.d.x = s.p.x + 1.2; s.d.z = s.p.z;
  s.command("rolle"); run(s, 1);
  assert.ok(s.events.some(e => e.type === "unknown" && e.cmd === "rolle"));
  s.skills.sitz = 100; s.obeyChance = () => 1;
  const before = s.skills.sitz, lk = s.vorrat.leckerli;
  s.skills.sitz = 50; s.command("sitz"); run(s, 1);
  assert.equal(s.d.mode, "sit");
  assert.ok(s.reward());
  assert.ok(s.skills.sitz > 50, "Können steigt: " + s.skills.sitz);
  assert.equal(s.vorrat.leckerli, lk - 1);
  const now = s.skills.sitz; s.reward();
  assert.equal(s.skills.sitz, now, "zweites Leckerli ohne neues Kommando bringt nichts");
  void before;
});

test("Ohne Training folgt der Hund nicht immer", () => {
  const s = new H.Sim({world: W, nav: N, rand: H.rng(3), name: "Bello"}); s.ambient = () => null; s.plan = [];
  s.skills.platz = 10; let ign = 0;
  for (let i = 0; i < 20; i++) { s.setDog("idle", 9); s.d.x = s.p.x + 1.2; s.d.z = s.p.z; s.events = []; s.command("platz"); run(s, 1); if (s.events.some(e => e.type === "ignored")) ign++; }
  assert.ok(ign >= 8, "ignoriert: " + ign);
});

test("Tricks üben kostet 2 Leckerli und bringt Können, Drehen und Rolle gehen danach", () => {
  const s = sim();
  s.setDog("idle", 9); s.d.x = s.p.x + 1.2; s.d.z = s.p.z;
  s.order("ueben:dreh", {type: "train"}); run(s, 15);
  assert.ok(s.skills.dreh >= 8, "dreh " + s.skills.dreh);
  assert.equal(s.vorrat.leckerli, 18);
  s.tasks.push({id: "dreh", need: 1, have: 0, done: false, failed: false, text: ""});
  s.setDog("idle", 9); s.command("dreh"); run(s, 3);
  assert.ok(s.tasks.find(t => t.id === "dreh").done, "Drehen erledigt");
});

test("Arbeiten bringt Geld, bestelltes Futter bringt der Postbote", () => {
  const s = sim();
  s.t = 9 * 60;
  const m0 = s.money;
  s.order("arbeiten", {type: "obj", id: "schreibtisch"}); run(s, 130);
  assert.ok(s.money > m0 + 40, "Geld " + s.money);
  assert.ok(s.tasks.find(t => t.id === "arbeit").have >= 119);
  s.t = 10 * 60; s.p.act = null;
  s.order("bestellen_futter", {type: "obj", id: "schreibtisch"}); run(s, 5);
  assert.equal(s.orders.length, 1);
  s.t = s.orders[0].at + 1; s.d.mode = "sleep"; s.d.timer = 999;
  run(s, 2);
  const post = s.npcs.find(n => n.role === "post");
  assert.ok(post && post.parcel, "Postbote mit Paket");
  for (let i = 0; i < 40 && !post.arrived; i++) run(s, 1);
  assert.ok(post.arrived, "an der Tür");
  s.p.x = -0.4; s.p.z = -118.6; const f0 = s.vorrat.futter;
  s.order("paket", {type: "npc", id: post.id}); run(s, 4);
  assert.equal(s.vorrat.futter, f0 + 10);
  assert.equal(s.orders.length, 0);
  assert.ok(s.tasks.find(t => t.id === "post").done);
});

test("Socke klauen und mit Aus zurückgeben", () => {
  const s = sim();
  s.t = 15 * 60; s.setDog("idle", 3); s.d.x = -3; s.d.z = -126; s.p.x = -5; s.p.z = -126;
  assert.ok(s.trigger("socke"));
  assert.equal(s.d.mode, "keepaway");
  assert.ok(s.item(s.d.item).kind === "socke");
  run(s, 2);
  s.command("aus"); run(s, 2);
  assert.ok(!s.items.some(it => it.kind === "socke"), "Socke weg");
  assert.ok(s.tasks.find(t => t.id === "socke").done);
});

test("Regen macht den Hund draußen nass, drinnen abtrocknen", () => {
  const s = sim();
  s.t = 11 * 60; s.trigger("regen");
  s.setDog("idle", 3); s.d.x = 0; s.d.z = -114; run(s, 1);
  assert.equal(s.d.wet, 1);
  s.d.x = -3; s.d.z = -126; s.p.x = -4; s.p.z = -126; s.setDog("idle", 9); run(s, 1);
  assert.ok(s.tasks.find(t => t.id === "trocken"), "Aufgabe abtrocknen");
  s.order("abtrocknen", {type: "dog"}); run(s, 8);
  assert.equal(s.d.wet, 0);
  assert.ok(s.tasks.find(t => t.id === "trocken").done);
});

test("Fremde Hunde: beschnuppern und spielen", () => {
  const s = sim();
  s.t = 17 * 60; s.p.x = 0; s.p.z = -50; s.d.x = 1; s.d.z = -50; s.setDog("idle", 0.1);
  const n = s.spawnNpc("walker", {x: 0, z: -45, yaw: Math.PI, withDog: true});
  s.tasks.push({id: "hundefreund", need: 1, have: 0, done: false, failed: false, text: ""});
  s.startPlay(n); run(s, 11);
  assert.ok(s.events.some(e => e.type === "played"));
  assert.ok(s.tasks.find(t => t.id === "hundefreund").done);
});

test("Leute im Park kommen am Abend, gehen und lassen sich ansprechen", () => {
  const s = new H.Sim({world: W, nav: N, rand: H.rng(4), name: "Bello"}); s.plan = []; s.obeyChance = () => 1;
  s.t = 17 * 60; s.p.x = 0; s.p.z = -60; s.d.x = 1; s.d.z = -60; s.d.mode = "follow";
  run(s, 30);
  const amb = s.npcs.filter(n => n.ambient);
  assert.ok(amb.length >= 4, "Leute: " + amb.length);
  assert.ok(amb.some(n => n.walk > 5), "laufen");
  const w = amb[0]; w.x = 0; w.z = -57; w.pause = 5;
  s.tasks.push({id: "plaudern", need: 2, have: 0, done: false, failed: false, text: ""});
  s.order("plaudern", {type: "npc", id: w.id}); run(s, 15);
  assert.ok(s.events.some(e => e.type === "talk"));
  assert.equal(s.tasks.find(t => t.id === "plaudern").have, 1);
});

test("Wochenplan: werktags Homeoffice, samstags Hundeschule, sonntags Hundewiese", () => {
  const mo = H.makeTasks(1, 3).map(t => t.id), sa = H.makeTasks(6, 3).map(t => t.id), so = H.makeTasks(7, 3).map(t => t.id);
  assert.ok(mo.includes("arbeit") && mo.includes("mittagsrunde") && !mo.includes("hundeschule"));
  assert.ok(sa.includes("hundeschule") && !sa.includes("arbeit"));
  assert.ok(so.includes("hundewiese"));
  assert.ok(H.makePlan(6, 3).some(e => e.type === "schule"));
  assert.ok(mo.length >= 10, "Aufgaben am Montag: " + mo.length);
});

test("Hundeschule: Training starten, Übungen, Abzeichen", () => {
  const s = sim();
  s.day = 6; s.tasks = H.makeTasks(6, 1); s.t = 9 * 60 + 40;
  s.trigger("schule");
  const tr = s.npcs.find(n => n.role === "trainer");
  assert.ok(tr);
  s.p.x = -31; s.p.z = -82; s.d.x = -31.5; s.d.z = -83; s.setDog("idle", 9); s.t = 600;
  const m0 = s.money;
  assert.ok(s.startSchool(tr.id));
  assert.equal(s.money, m0 - 15);
  assert.ok(s.tasks.find(t => t.id === "hundeschule").done);
  assert.equal(s.schoolStep().id, "fuss");
  s.schoolSkip();
  assert.equal(s.schoolStep().id, "bleib");
  s.task("stayed");
  assert.equal(s.schoolStep().id, "komm");
  s.task("came", {from: 9});
  assert.equal(s.schoolStep().id, "neu");
  s.schoolSkip(); s.schoolSkip();
  const done = s.events.find(e => e.type === "schoolDone");
  assert.ok(done && done.badge === "Welpenkurs", JSON.stringify(done));
  assert.equal(s.schoolN, 1);
  assert.ok(!s.school);
});

test("Parcours auf dem Übungsplatz", () => {
  const s = sim();
  s.skills.parcours = 100; s.p.x = -37; s.p.z = -84; s.d.x = -37.5; s.d.z = -85; s.setDog("idle", 9);
  s.command("parcours"); run(s, 25);
  const c = s.events.find(e => e.type === "course");
  assert.ok(c, "Parcours beendet");
  assert.ok(c.hits >= 2);
});

test("Speichern behält Geld, Vorrat und Können", () => {
  const s = sim();
  s.money = 77.5; s.vorrat.futter = 3; s.skills.rolle = 33; s.schoolN = 2;
  const t = new H.Sim({world: W, nav: N, save: JSON.parse(JSON.stringify(s.save()))});
  assert.equal(t.money, 77.5); assert.equal(t.vorrat.futter, 3); assert.equal(t.skills.rolle, 33); assert.equal(t.schoolN, 2);
});
