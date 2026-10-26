// Flipper-Engine: Physik (Kugel, Wände, Bumper, Flipper, Rampen, Spinner, Fallziele) und Spielregeln.
// Läuft im Browser (window.Flipper) und in Node (require) für die Tests. Kein Zeichnen, kein Ton:
// Alles, was die Oberfläche wissen muss, steht in game.events (wird pro Bild abgeholt) und im Spielzustand.
(function (root, factory) {
  var F = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = F;
  else root.Flipper = Object.assign(root.Flipper || {}, F);
})(this, function () {
  "use strict";
  // Welt: 600 breit, 1100 hoch, y zeigt nach unten (zum Spieler). Einheiten pro Sekunde.
  var W = 600, H = 1100, R = 11, G = 1050, SUB = 10, VMAX = 2700;
  var LANE_X = 540, PLUNGER_Y = 1052;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------- Bausteine ---------- */
  function seg(x1, y1, x2, y2, o) {
    o = o || {};
    return {kind: "seg", ax: x1, ay: y1, bx: x2, by: y2, r: o.r != null ? o.r : 3, e: o.e != null ? o.e : 0.45, f: o.f != null ? o.f : 0.015,
      kick: o.kick || 0, tag: o.tag || "wall", i: o.i || 0, oneWay: o.oneWay || null, on: true, flash: 0, cool: 0, hidden: !!o.hidden};
  }
  function circ(x, y, r, o) {
    o = o || {};
    return {kind: "circ", x: x, y: y, r: r, e: o.e != null ? o.e : 0.5, f: 0.01, kick: o.kick || 0, tag: o.tag || "post", i: o.i || 0, on: true, flash: 0, cool: 0, label: o.label || ""};
  }
  function polyline(pts, o) { var s = []; for (var i = 1; i < pts.length; i++) s.push(seg(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], o)); return s; }
  function arcPts(cx, cy, r, a0, a1, n) { var p = []; for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; }

  // Gemeinsamer Rahmen aller Tische: Gehäuse mit runder Oberkante, Abschussbahn rechts, Slingshots, In- und Outlanes, zwei Flipper.
  function frame() {
    var s = [];
    s = s.concat(polyline(arcPts(300, 280, 280, Math.PI, 2 * Math.PI, 36), {e: 0.3, f: 0.004}));
    s.push(seg(20, 280, 20, 1130, {e: 0.35}));
    s.push(seg(580, 280, 580, 1130, {e: 0.3}));
    s.push(seg(LANE_X, 330, LANE_X, 1130, {e: 0.35}));
    s.push(seg(LANE_X, PLUNGER_Y, 580, PLUNGER_Y, {e: 0.15, tag: "plunger"}));
    // Einbahn-Tor oben an der Abschussbahn: von unten frei, von oben zu.
    s.push(seg(LANE_X, 336, 580, 306, {oneWay: {nx: -0.6, ny: -0.8}, e: 0.3, tag: "gate"}));
    // Ablenker unten an den Seitenwänden: Kugeln, die an der Wand herunterrollen, landen in der Inlane statt im Aus.
    s.push(seg(20, 600, 58, 680, {e: 0.3}));
    s.push(seg(540, 600, 502, 680, {e: 0.3}));
    // Outlane-Trenner und Inlane-Führungen bis zum Flipper
    s.push(seg(60, 790, 60, 860, {r: 4}), seg(60, 860, 176, 932, {r: 4, e: 0.3}));
    s.push(seg(500, 790, 500, 860, {r: 4}), seg(500, 860, 384, 932, {r: 4, e: 0.3}));
    // Slingshots: die schräge Kante schießt
    s.push(seg(96, 762, 96, 836, {r: 4}), seg(96, 836, 148, 868, {r: 4}), seg(96, 762, 148, 868, {r: 5, kick: 690, tag: "sling", i: 0, e: 0.7}));
    s.push(seg(464, 762, 464, 836, {r: 4}), seg(464, 836, 412, 868, {r: 4}), seg(464, 762, 412, 868, {r: 5, kick: 690, tag: "sling", i: 1, e: 0.7}));
    var c = [circ(96, 762, 7), circ(96, 836, 7), circ(148, 868, 7), circ(464, 762, 7), circ(464, 836, 7), circ(412, 868, 7), circ(60, 790, 5), circ(500, 790, 5)];
    return {segs: s, circs: c};
  }

  function flipper(side) {
    var left = side === "L";
    var rest = left ? 0.52 : Math.PI - 0.52, up = left ? -0.46 : Math.PI + 0.46;
    return {side: side, px: left ? 180 : 380, py: 950, len: 88, r0: 13, r1: 7, rest: rest, up: up, ang: rest, omega: 0};
  }

  // Aus der Tischbeschreibung (tables.js) die Welt bauen.
  function buildWorld(def) {
    var f = frame(), segs = f.segs, circs = f.circs, sensors = [];
    var L = def.lanes;
    L.guides.forEach(function (x) { segs.push(seg(x, L.y0, x, L.y1, {r: 4})); circs.push(circ(x, L.y0, 5)); });
    L.xs.forEach(function (x, i) { sensors.push({x: x, y: (L.y0 + L.y1) / 2 + 6, r: 14, ev: "lane", i: i}); });
    (def.bumpers || []).forEach(function (b, i) { circs.push(circ(b.x, b.y, b.r, {kick: b.kick || 780, e: 0.6, tag: "bumper", i: i, label: b.label})); });
    (def.posts || []).forEach(function (p) { circs.push(circ(p.x, p.y, p.r || 6)); });
    (def.walls || []).forEach(function (w) { segs.push(seg(w[0], w[1], w[2], w[3], w[4])); });
    (def.drops || []).forEach(function (d, i) { segs.push(seg(d[0], d[1], d[2], d[3], {r: 4, e: 0.3, tag: "drop", i: i})); });
    (def.standups || []).forEach(function (d, i) { segs.push(seg(d[0], d[1], d[2], d[3], {r: 4, e: 0.35, tag: "standup", i: i})); });
    var ramps = (def.ramps || []).map(function (r, i) {
      (r.walls || []).forEach(function (w) { segs.push(seg(w[0], w[1], w[2], w[3], {r: 4, e: 0.3})); });
      var cum = [0];
      for (var k = 1; k < r.path.length; k++) cum.push(cum[k - 1] + Math.hypot(r.path[k][0] - r.path[k - 1][0], r.path[k][1] - r.path[k - 1][1]));
      return {i: i, entry: r.entry, path: r.path, cum: cum, len: cum[cum.length - 1], exit: r.exit, flash: 0};
    });
    if (def.orbit) sensors.push({x: def.orbit.x, y: def.orbit.y, r: def.orbit.r || 20, ev: "orbit", i: 0, up: true});
    var sp = def.spinner ? {x: def.spinner.x, y: def.spinner.y, w: def.spinner.w, ang: 0, spd: 0, half: 0} : null;
    if (def.spinner && def.spinner.walls) def.spinner.walls.forEach(function (w) { segs.push(seg(w[0], w[1], w[2], w[3], {r: 4})); });
    // Bewegliches Ziel (Glücksrad, Schurke, UFO, Bücherwurm …): fährt zwischen zwei Punkten hin und her
    var mv = null;
    if (def.mover) { mv = circ(def.mover.path[0][0], def.mover.path[0][1], def.mover.r || 16, {kick: 380, e: 0.6, tag: "mover"}); mv.path = def.mover.path; mv.speed = def.mover.speed || 0.45; mv.t = 0; mv.vx = 0; mv.vy = 0; circs.push(mv); }
    // Kickback in der linken Outlane: holt die Kugel zurück in die Inlane, wenn er leuchtet
    sensors.push({x: 40, y: 950, r: 18, ev: "kickback", i: 0});
    var sc = def.saucer ? {x: def.saucer.x, y: def.saucer.y, vx: def.saucer.vx, vy: def.saucer.vy, out: def.saucer.out || null, flash: 0} : null;
    return {segs: segs, circs: circs, sensors: sensors, ramps: ramps, spinner: sp, saucer: sc, mover: mv, attractors: (def.attractors || []).slice(),
      flippers: [flipper("L"), flipper("R")], nDrops: (def.drops || []).length, nStandups: (def.standups || []).length, nLanes: L.xs.length};
  }

  /* ---------- Kollision ---------- */
  // Kugel b gegen einen Punkt (px,py) mit Radius rad, Oberfläche bewegt sich mit (svx,svy). Gibt die Aufprallgeschwindigkeit zurück (0 = kein Kontakt).
  var rnd = Math.random;
  function contact(b, px, py, rad, svx, svy, o) {
    var dx = b.x - px, dy = b.y - py, d2 = dx * dx + dy * dy, min = R + rad;
    if (d2 >= min * min) return 0;
    var d = Math.sqrt(d2), nx, ny;
    if (d < 1e-6) { nx = 0; ny = -1; } else { nx = dx / d; ny = dy / d; }
    b.x = px + nx * min; b.y = py + ny * min;
    var rvx = b.vx - svx, rvy = b.vy - svy, vn = rvx * nx + rvy * ny;
    if (vn >= 0) return 1e-3;
    var tx = -ny, ty = nx, vt = (rvx * tx + rvy * ty) * (1 - o.f * Math.min(1, -vn / 200)), nvn = -vn * o.e;
    // Kicker schießen nie ganz gleich, sonst pendelt die Kugel ewig zwischen den Slingshots
    if (o.kick && o.on !== false && -vn > 30) { nvn = Math.max(nvn, o.kick * (0.82 + rnd() * 0.3)); vt += (rnd() - 0.5) * 160; }
    b.vx = svx + nx * nvn + tx * vt; b.vy = svy + ny * nvn + ty * vt;
    return -vn;
  }
  function closest(ax, ay, bx, by, x, y) {
    var dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy, t = l2 ? ((x - ax) * dx + (y - ay) * dy) / l2 : 0;
    return clamp(t, 0, 1);
  }
  function hitSeg(b, s) {
    if (!s.on) return 0;
    var t = closest(s.ax, s.ay, s.bx, s.by, b.x, b.y), px = s.ax + (s.bx - s.ax) * t, py = s.ay + (s.by - s.ay) * t;
    if (s.oneWay && (b.x - px) * s.oneWay.nx + (b.y - py) * s.oneWay.ny <= 0) return 0;
    return contact(b, px, py, s.r, 0, 0, s);
  }
  function hitCirc(b, c) { return c.on ? contact(b, c.x, c.y, c.r, c.vx || 0, c.vy || 0, c) : 0; }
  var FLIP_MAT = {e: 0.3, f: 0.02, kick: 0};
  function hitFlipper(b, fl) {
    var c = Math.cos(fl.ang), s = Math.sin(fl.ang), tx = fl.px + c * fl.len, ty = fl.py + s * fl.len;
    var t = closest(fl.px, fl.py, tx, ty, b.x, b.y), cx = fl.px + (tx - fl.px) * t, cy = fl.py + (ty - fl.py) * t;
    var rad = fl.r0 + (fl.r1 - fl.r0) * t;
    return contact(b, cx, cy, rad, -fl.omega * (cy - fl.py), fl.omega * (cx - fl.px), FLIP_MAT);
  }

  /* ---------- Spiel ---------- */
  var BALLS = 3;
  function Game(def, opts) {
    opts = opts || {};
    this.def = def; this.rand = opts.rand || Math.random;
    // Missionen kann die Seite pro Spiel neu zusammenstellen (Bücher-Tisch: Klassiker und eigene Bücher)
    this.missions = opts.missions || def.missions || [];
    this.w = buildWorld(def);
    this.input = {left: false, right: false, plunger: false};
    this.events = [];
    this.score = 0; this.ballNo = 1; this.extra = 0; this.over = false; this.started = true;
    this.balls = []; this.queue = []; this.pull = 0; this.time = 0;
    this.tiltMeter = 0; this.tilted = false; this.warned = false;
    this.mission = 0; this.progress = 0; this.level = 1; this.wizard = 0; this.mult = 1;
    this.locks = 0; this.lockLit = 0; this.multiball = false; this.save = 0; this.pause = 0;
    this.stats = {bumper: 0, ramp: 0, spin: 0, drop: 0, lanes: 0, missions: 0, mover: 0};
    this.hurry = null; this.frenzy = 0; this.kickLit = true; this.moverHits = 0;
    this.newBallState();
    this.spawnInLane(false);
  }
  var GP = Game.prototype;
  GP.emit = function (type, o) { var e = o || {}; e.type = type; this.events.push(e); if (this.events.length > 300) this.events.shift(); };
  GP.drainEvents = function () { var e = this.events; this.events = []; return e; };
  GP.newBallState = function () {
    var w = this.w;
    this.lanesLit = []; for (var i = 0; i < w.nLanes; i++) this.lanesLit.push(false);
    this.drops = []; for (i = 0; i < w.nDrops; i++) this.drops.push(false);
    this.standups = []; for (i = 0; i < w.nStandups; i++) this.standups.push(false);
    w.segs.forEach(function (s) { if (s.tag === "drop") s.on = true; });
    this.bonus = 0; this.bonusX = 1; this.tilted = false; this.warned = false; this.tiltMeter = 0;
    this.skillLane = -1; this.skillT = 0; this.combo = 0; this.comboT = 0; this.dropResetT = 0;
    this.kickLit = true; this.frenzy = 0; this.hurry = null;
  };
  GP.spawnInLane = function (auto) {
    var b = {x: 560, y: PLUNGER_Y - 3 - R, vx: 0, vy: 0, ramp: null, held: null, cool: 0, inside: {}, still: 0, auto: auto ? 0.5 : 0, launched: false, sx: 560, sy: PLUNGER_Y};
    this.balls.push(b);
    if (!auto) { this.skillLane = Math.floor(this.rand() * this.w.nLanes); }
    return b;
  };
  GP.inLane = function (b) { return !b.ramp && !b.held && b.x > LANE_X && b.y > 960 && Math.abs(b.vy) < 80 && Math.abs(b.vx) < 80; };
  GP.waiting = function () { var g = this; return this.balls.some(function (b) { return g.inLane(b); }); };
  GP.add = function (p, x, y, quiet) {
    if (this.frenzy > 0 && !quiet && p < 1000) p += 1500;
    p = Math.round(p * this.mult * (this.wizard > 0 ? 3 : 1));
    this.score += p;
    if (!quiet && p >= 1000) this.emit("points", {points: p, x: x, y: y});
    return p;
  };
  GP.nudge = function () {
    if (this.over || this.tilted) return;
    var g = this;
    this.balls.forEach(function (b) { if (!b.ramp && !b.held) { b.vx += (g.rand() - 0.5) * 170; b.vy -= 120; } });
    this.tiltMeter += 1;
    this.emit("nudge");
    if (this.tiltMeter > 3.2) {
      this.tilted = true; this.emit("tilt");
      this.w.circs.forEach(function (c) { if (c.tag === "bumper") c.on = false; });
    } else if (this.tiltMeter > 2.1 && !this.warned) { this.warned = true; this.emit("tiltWarn"); }
  };

  // Ein Spielereignis zählt für Missionen, Bonus und Punkte.
  GP.progressMission = function (ev, n) {
    var list = this.missions;
    if (!list.length || this.tilted) return;
    var m = list[this.mission % list.length];
    if (m.ev !== ev) return;
    this.progress += n || 1;
    var need = Math.ceil(m.n * (1 + (this.level - 1) * 0.5));
    if (this.progress < need) { this.emit("missionStep", {have: this.progress, need: need}); return; }
    this.progress = 0; this.stats.missions++;
    var pts = this.add((m.points || 10000) * this.level, 280, 500, true);
    this.emit("mission", {title: m.title, done: m.done || m.title, points: pts, i: this.mission % list.length});
    if (m.reward === "multiball") this.startMultiball();
    if (m.reward === "extraball") { this.extra++; this.emit("extraball"); }
    if (m.reward === "lock") { this.lockLit = Math.min(2, this.lockLit + 1); this.emit("lockLit"); }
    this.mission++;
    if (this.mission % list.length === 0) { this.level++; this.wizard = 30; this.emit("wizard"); }
  };
  GP.startMultiball = function () {
    if (this.tilted) return;
    var add = this.multiball ? 1 : 2;
    this.multiball = true; this.superLit = false; this.addedBall = false; this.save = Math.max(this.save, 15); this.locks = 0; this.lockLit = 0;
    for (var i = 0; i < add; i++) this.queue.push({t: 0.3 + i * 0.9});
    this.emit("multiball");
  };
  GP.onHit = function (o, b, imp) {
    if (o.cool > 0 && o.tag !== "drop") return;
    var g = this;
    switch (o.tag) {
      case "bumper":
        if (this.tilted) return;
        o.cool = 0.06; o.flash = 0.25; this.stats.bumper++;
        this.add(100, o.x, o.y); this.bonus += 20; this.emit("bumper", {x: o.x, y: o.y, i: o.i}); this.progressMission("bumper"); break;
      case "sling":
        if (this.tilted || imp < 60) return;
        o.cool = 0.1; o.flash = 0.2; this.add(10); this.emit("sling", {x: b.x, y: b.y, i: o.i}); this.progressMission("sling"); break;
      case "drop":
        if (!o.on) return;
        o.on = false; o.flash = 0.4; this.drops[o.i] = true; this.stats.drop++;
        this.add(750, b.x, b.y); this.bonus += 300; this.emit("drop", {x: b.x, y: b.y, i: o.i}); this.progressMission("drop");
        if (this.drops.every(Boolean)) {
          this.add(5000, b.x, b.y); this.emit("bank", {x: b.x, y: b.y}); this.progressMission("bank"); this.startFrenzy();
          this.dropResetT = 1.2;
        }
        break;
      case "standup":
        o.cool = 0.25; o.flash = 0.3;
        if (!this.standups[o.i]) { this.standups[o.i] = true; this.bonus += 300; }
        this.add(500, b.x, b.y); this.emit("standup", {x: b.x, y: b.y, i: o.i}); this.progressMission("standup");
        if (this.standups.every(Boolean)) {
          this.standups = this.standups.map(function () { return false; });
          this.lockLit = Math.min(2, this.lockLit + 1); this.add(3000, b.x, b.y); this.emit("standups"); this.emit("lockLit"); this.progressMission("standups");
        }
        break;
      case "mover":
        if (this.tilted) return;
        o.cool = 0.35; o.flash = 0.4; this.stats.mover++; this.moverHits++;
        var mp = this.add(5000 * this.level, o.x, o.y - 30); this.bonus += 1000;
        this.emit("mover", {x: o.x, y: o.y, n: this.moverHits, points: mp}); this.progressMission("mover");
        if (this.moverHits % 3 === 0) this.startHurry();
        break;
      default:
        if (imp > 380 && o.cool <= 0) { o.cool = 0.08; g.emit("wall", {v: imp, x: b.x, y: b.y}); }
    }
  };
  GP.onSensor = function (s, b) {
    if (s.ev === "lane") {
      if (this.skillT > 0 && s.i === this.skillLane && !this.tilted) { this.add(25000, s.x, s.y); this.emit("skill", {x: s.x, y: s.y}); }
      this.skillT = 0; this.skillLane = -1;
      if (this.tilted) return;
      this.add(300); this.bonus += 500;
      if (!this.lanesLit[s.i]) { this.lanesLit[s.i] = true; this.emit("lane", {i: s.i, x: s.x, y: s.y}); this.progressMission("lane"); }
      if (this.lanesLit.every(Boolean)) {
        this.lanesLit = this.lanesLit.map(function () { return false; });
        this.bonusX = Math.min(6, this.bonusX + 1); this.stats.lanes++;
        this.add(2500, s.x, s.y); this.emit("lanes", {x: s.x, y: s.y, bonusX: this.bonusX}); this.progressMission("lanes");
      }
    } else if (s.ev === "kickback") {
      if (!this.kickLit || this.tilted || b.vy < 0) return;
      this.kickLit = false;
      // Kugel kurz festhalten und oben in die linke Inlane setzen
      b.held = 0.45; b.release = {x: 40, y: 740, vx: 1000, vy: -1000}; b.vx = 0; b.vy = 0;
      this.add(2500, s.x, s.y - 60); this.emit("kickback", {x: s.x, y: s.y});
    } else if (s.ev === "orbit") {
      if (b.vy > -250 || this.tilted) return;
      this.add(2000, s.x, s.y); this.emit("orbit", {x: s.x, y: s.y}); this.progressMission("orbit");
    }
  };
  GP.onRamp = function (r, b) {
    r.flash = 0.6; this.stats.ramp++;
    if (this.tilted) return;
    this.combo = this.comboT > 0 ? this.combo + 1 : 1; this.comboT = 4;
    var pts = this.add(2500 * this.combo, r.exit.x, r.exit.y - 40);
    this.bonus += 1000;
    if (this.multiball) { var j = this.add(25000 + 5000 * this.combo, 280, 400, true); this.superLit = true; this.emit("jackpot", {points: j}); }
    else if (this.lockLit < 2) { this.lockLit++; this.emit("lockLit"); }
    this.emit("ramp", {i: r.i, combo: this.combo, points: pts});
    if (this.hurry) { var hv = this.add(this.hurry.v, 280, 400, true); this.emit("hurryCollect", {points: hv}); this.hurry = null; }
    this.progressMission("ramp");
  };
  GP.onSaucer = function (b) {
    var sc = this.w.saucer; sc.flash = 1;
    if (this.tilted) return;
    this.add(1500, sc.x, sc.y); this.bonus += 500;
    if (this.multiball && this.superLit) { this.superLit = false; var j = this.add(75000, sc.x, sc.y, true); this.emit("superjackpot", {points: j}); }
    else if (this.multiball) { if (!this.addedBall) { this.addedBall = true; this.queue.push({t: 0.4}); this.emit("addaball"); } }
    else if (this.lockLit > 0) {
      this.lockLit--; this.locks++;
      this.emit("lock", {n: this.locks});
      if (this.locks >= 2) this.startMultiball();
    } else this.mystery();
    this.emit("saucer", {x: sc.x, y: sc.y});
    this.progressMission("saucer");
  };

  // Mystery im Loch: eine zufällige Belohnung
  var MYSTERY = ["punkte", "kickback", "hurry", "frenzy", "bonusx", "save", "lock", "punkte", "frenzy", "extraball"];
  GP.mystery = function () {
    var r = this.rand(), a = MYSTERY[Math.floor(r * (MYSTERY.length - 1))];
    if (r > 0.97) a = "extraball";
    var pts = 0;
    if (a === "punkte") pts = this.add(25000 * this.level, 0, 0, true);
    if (a === "kickback") this.kickLit = true;
    if (a === "hurry") this.startHurry();
    if (a === "frenzy") this.startFrenzy();
    if (a === "bonusx") this.bonusX = Math.min(6, this.bonusX + 1);
    if (a === "save") this.save = Math.max(this.save, 20);
    if (a === "lock") this.lockLit = 2;
    if (a === "extraball") this.extra++;
    this.emit("mystery", {award: a, points: pts});
  };
  GP.startHurry = function () {
    if (this.tilted) return;
    this.hurry = {v: 100000 * this.level, t: 25};
    this.emit("hurryStart", {v: this.hurry.v});
  };
  GP.startFrenzy = function () { if (!this.tilted) { this.frenzy = 15; this.emit("frenzy"); } };

  GP.launch = function (b, power) {
    b.vy = -(1050 + 1450 * power); b.vx = 0; b.launched = true;
    if (b.auto) b.auto = 0;
    if (!this.multiball && this.save <= 0) this.save = 8;
    this.skillT = this.skillLane >= 0 && power > 0.05 ? 5 : 0;
    this.emit("launch", {power: power});
  };

  GP.update = function (dt) {
    if (this.over) return;
    dt = Math.min(dt, 1 / 20);
    this.time += dt;
    if (this.pause > 0) { this.pause -= dt; if (this.pause <= 0) this.nextBall(); return; }
    var g = this, w = this.w;
    // Flipper-Tasten: neu gedrückt dreht die beleuchteten Lanes weiter
    var L = this.input.left && !this.tilted, Rr = this.input.right && !this.tilted;
    if (L && !this._l) { this.emit("flip", {side: "L"}); this.rotateLanes(-1); }
    if (Rr && !this._r) { this.emit("flip", {side: "R"}); this.rotateLanes(1); }
    if (!L && this._l) this.emit("flipDown", {side: "L"});
    if (!Rr && this._r) this.emit("flipDown", {side: "R"});
    this._l = L; this._r = Rr;
    // Abzug: halten spannt, loslassen schießt
    var anyWait = this.waiting();
    if (this.input.plunger && anyWait) { if (this.pull === 0) this.emit("pull"); this.pull = Math.min(1, this.pull + dt / 0.9); }
    else if (this.pull > 0) {
      var pw = this.pull; this.pull = 0;
      this.balls.forEach(function (b) { if (g.inLane(b)) g.launch(b, pw); });
    }
    // Wartende Kugeln (Multiball, Ballsicherung) nacheinander in die freie Abschussbahn
    if (this.queue.length) {
      this.queue[0].t -= dt;
      var laneFree = !this.balls.some(function (b) { return b.x > LANE_X && b.y > 700; });
      if (this.queue[0].t <= 0 && laneFree) { this.queue.shift(); this.spawnInLane(true); }
    }
    this.balls.forEach(function (b) { if (b.auto > 0) { b.auto -= dt; if (b.auto <= 0 && g.inLane(b)) { g.launch(b, 0.82 + g.rand() * 0.12); b.auto = 0; } else if (b.auto <= 0) b.auto = 0.2; } });

    rnd = this.rand;
    var h = dt / SUB;
    for (var k = 0; k < SUB; k++) this.substep(h, L, Rr);

    // Zeitgeber
    [w.segs, w.circs].forEach(function (list) { list.forEach(function (o) { if (o.cool > 0) o.cool -= dt; if (o.flash > 0) o.flash -= dt; }); });
    w.ramps.forEach(function (r) { if (r.flash > 0) r.flash -= dt; });
    if (w.saucer && w.saucer.flash > 0) w.saucer.flash -= dt;
    if (this.save > 0 && this.balls.some(function (b) { return b.launched; })) this.save -= dt;
    if (this.skillT > 0) this.skillT -= dt;
    if (this.comboT > 0) this.comboT -= dt;
    if (this.frenzy > 0) { this.frenzy -= dt; if (this.frenzy <= 0) this.emit("frenzyEnd"); }
    if (this.hurry) { this.hurry.t -= dt; this.hurry.v = Math.max(20000 * this.level, this.hurry.v - 3000 * this.level * dt); if (this.hurry.t <= 0) { this.hurry = null; this.emit("hurryEnd"); } }
    var mv = w.mover;
    if (mv && dt > 0) {
      mv.t += dt * mv.speed; var f = (1 - Math.cos(mv.t * Math.PI)) / 2, a = mv.path[0], z = mv.path[1];
      var nx = a[0] + (z[0] - a[0]) * f, ny = a[1] + (z[1] - a[1]) * f;
      mv.vx = (nx - mv.x) / dt; mv.vy = (ny - mv.y) / dt; mv.x = nx; mv.y = ny;
    }
    if (this.wizard > 0) { this.wizard -= dt; if (this.wizard <= 0) this.emit("wizardEnd"); }
    this.tiltMeter = Math.max(0, this.tiltMeter - dt * 0.55);
    if (this.tiltMeter < 1) this.warned = false;
    if (this.dropResetT > 0) { this.dropResetT -= dt; if (this.dropResetT <= 0) this.resetDrops(); }
    var sp = w.spinner;
    if (sp && sp.spd > 0.05) {
      sp.ang += sp.spd * dt; sp.spd *= Math.exp(-1.6 * dt);
      var half = Math.floor(sp.ang / Math.PI);
      if (half > sp.half) { var n = half - sp.half; sp.half = half; this.stats.spin += n; if (!this.tilted) { this.add(100 * n, 0, 0, true); this.bonus += 20 * n; this.emit("spin", {n: n}); this.progressMission("spin", n); } }
    }
    // Hängende Kugel lösen (Ball-Suche wie im echten Gerät)
    this.balls.forEach(function (b) {
      if (b.ramp || b.held || g.inLane(b)) { b.still = 0; return; }
      var m = Math.hypot(b.x - b.sx, b.y - b.sy);
      if (m < 6) b.still += dt; else { b.still = 0; b.sx = b.x; b.sy = b.y; }
      if (b.still > 4) { b.vx += (g.rand() - 0.5) * 500; b.vy = -500; b.still = 0; g.emit("search"); }
    });
    this.drainCheck();
  };
  GP.rotateLanes = function (dir) {
    if (this.lanesLit.length < 2 || this.tilted) return;
    var a = this.lanesLit;
    if (dir > 0) a.unshift(a.pop()); else a.push(a.shift());
  };
  GP.resetDrops = function () {
    var g = this;
    this.drops = this.drops.map(function () { return false; });
    this.w.segs.forEach(function (s) { if (s.tag === "drop") { s.on = true; s.flash = 0.4; } });
    // Kugeln, die gerade auf einem Ziel liegen, bekommen beim Hochfahren einen kleinen Schubs (erledigt die Kollision von selbst)
    this.emit("dropReset");
    void g;
  };

  GP.substep = function (h, L, Rr) {
    var w = this.w, g = this;
    w.flippers.forEach(function (f) {
      var on = f.side === "L" ? L : Rr, target = on ? f.up : f.rest, spd = on ? 27 : 17;
      var d = target - f.ang, st = Math.sign(d) * spd * h;
      if (Math.abs(st) >= Math.abs(d)) { f.ang = target; f.omega = 0; } else { f.ang += st; f.omega = Math.sign(d) * spd; }
    });
    for (var i = 0; i < this.balls.length; i++) {
      var b = this.balls[i];
      if (b.ramp) { this.rampStep(b, h); continue; }
      if (b.held) {
        b.held -= h;
        if (b.held <= 0) {
          b.held = null; var sc = w.saucer;
          if (b.release) { b.x = b.release.x; b.y = b.release.y; b.vx = b.release.vx; b.vy = b.release.vy; b.release = null; b.inside = {}; continue; }
          if (sc.out) { b.x = sc.out.x; b.y = sc.out.y; }
          b.vx = sc.vx + (this.rand() - 0.5) * 60; b.vy = sc.vy; b.cool = 0.6; this.emit("eject", {x: b.x, y: b.y});
        }
        continue;
      }
      var py = b.y, px = b.x;
      b.vy += G * h;
      w.attractors.forEach(function (a) {
        var dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < a.R && d > 1) { var f = a.k * (1 - d / a.R); b.vx += dx / d * f * h; b.vy += dy / d * f * h; }
      });
      var sp = Math.hypot(b.vx, b.vy);
      if (sp > VMAX) { b.vx *= VMAX / sp; b.vy *= VMAX / sp; }
      b.x += b.vx * h; b.y += b.vy * h;
      for (var s = 0; s < w.segs.length; s++) { var o = w.segs[s], imp = hitSeg(b, o); if (imp) this.onHit(o, b, imp); }
      for (s = 0; s < w.circs.length; s++) { o = w.circs[s]; imp = hitCirc(b, o); if (imp) this.onHit(o, b, imp); }
      for (s = 0; s < 2; s++) hitFlipper(b, w.flippers[s]);
      // Sensoren (nur beim Hineinrollen)
      w.sensors.forEach(function (se, si) {
        var inn = Math.hypot(b.x - se.x, b.y - se.y) < se.r;
        if (inn && !b.inside[si]) g.onSensor(se, b);
        b.inside[si] = inn;
      });
      // Spinner: Kugel kreuzt die Linie
      var spn = w.spinner;
      if (spn && (py - spn.y) * (b.y - spn.y) < 0 && Math.abs(b.x - spn.x) < spn.w / 2) {
        spn.spd = Math.min(60, spn.spd + Math.abs(b.vy) / 45); this.emit("spinHit");
      }
      // Rampen-Einfahrt: nur nach oben
      for (s = 0; s < w.ramps.length; s++) {
        var r = w.ramps[s];
        if (b.vy < -100 && Math.hypot(b.x - r.entry.x, b.y - r.entry.y) < r.entry.r) {
          b.ramp = {r: r, s: 0, v: clamp(Math.hypot(b.vx, b.vy), 750, 1300)}; this.emit("rampEnter", {i: r.i}); break;
        }
      }
      if (b.ramp) continue;
      // Kickout-Loch
      var sc2 = w.saucer;
      if (sc2 && b.cool <= 0 && Math.hypot(b.x - sc2.x, b.y - sc2.y) < 13 && Math.hypot(b.vx, b.vy) < 1300) {
        b.held = 1.1; b.x = sc2.x; b.y = sc2.y; b.vx = 0; b.vy = 0; this.onSaucer(b); continue;
      }
      if (b.cool > 0) b.cool -= h;
      if (isNaN(b.x) || isNaN(b.y)) { b.x = px; b.y = py; b.vx = 0; b.vy = 0; }
    }
    // Kugeln untereinander
    for (i = 0; i < this.balls.length; i++) for (var j = i + 1; j < this.balls.length; j++) {
      var a = this.balls[i], c = this.balls[j];
      if (a.ramp || c.ramp || a.held || c.held) continue;
      var dx = c.x - a.x, dy = c.y - a.y, d2 = dx * dx + dy * dy;
      if (d2 < 4 * R * R && d2 > 1e-6) {
        var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ov = (2 * R - d) / 2;
        a.x -= nx * ov; a.y -= ny * ov; c.x += nx * ov; c.y += ny * ov;
        var rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { var imp2 = -rv * 0.95; a.vx -= nx * imp2; a.vy -= ny * imp2; c.vx += nx * imp2; c.vy += ny * imp2; if (-rv > 200) this.emit("clack", {x: a.x, y: a.y}); }
      }
    }
  };
  GP.rampStep = function (b, h) {
    var rp = b.ramp, r = rp.r;
    rp.s += rp.v * h;
    if (rp.s >= r.len) {
      b.ramp = null; b.x = r.exit.x; b.y = r.exit.y; b.vx = r.exit.vx; b.vy = r.exit.vy; b.inside = {};
      this.onRamp(r, b); return;
    }
    var k = 1; while (k < r.cum.length - 1 && r.cum[k] < rp.s) k++;
    var t = (rp.s - r.cum[k - 1]) / ((r.cum[k] - r.cum[k - 1]) || 1);
    var nx = r.path[k - 1][0] + (r.path[k][0] - r.path[k - 1][0]) * t, ny = r.path[k - 1][1] + (r.path[k][1] - r.path[k - 1][1]) * t;
    b.vx = (nx - b.x) / h; b.vy = (ny - b.y) / h; b.x = nx; b.y = ny;
  };
  GP.drainCheck = function () {
    var g = this, gone = 0;
    this.balls = this.balls.filter(function (b) {
      if (b.ramp || b.held) return true;
      if (b.y > H + 40 || b.x < -40 || b.x > W + 40) { gone++; return false; }
      return true;
    });
    if (!gone) return;
    for (var i = 0; i < gone; i++) {
      if (this.save > 0 && !this.tilted) { this.emit("save"); this.queue.push({t: 0.6}); }
      else this.emit("drain", {left: this.balls.length});
    }
    if (this.multiball && this.balls.length <= 1) { this.multiball = false; this.emit("multiballEnd"); }
    if (!this.balls.length && !this.queue.length) this.endBall();
    void g;
  };
  GP.endBall = function () {
    var b = this.tilted ? 0 : Math.round(this.bonus * this.bonusX);
    this.score += b;
    this.emit("bonus", {bonus: this.bonus, x: this.bonusX, total: b, tilted: this.tilted});
    this.pause = 2.4;
    this.w.circs.forEach(function (c) { if (c.tag === "bumper") c.on = true; });
  };
  GP.nextBall = function () {
    if (this.extra > 0) { this.extra--; this.emit("shootAgain"); }
    else this.ballNo++;
    if (this.ballNo > BALLS) { this.over = true; this.emit("gameover", {score: this.score}); return; }
    this.newBallState(); this.locks = 0; this.lockLit = Math.min(this.lockLit, 1);
    this.spawnInLane(false);
    this.emit("ball", {n: this.ballNo});
  };
  GP.currentMission = function () {
    var list = this.missions;
    if (!list.length) return null;
    var m = list[this.mission % list.length];
    return {title: m.title, text: m.text, have: this.progress, need: Math.ceil(m.n * (1 + (this.level - 1) * 0.5)), i: this.mission % list.length, ev: m.ev};
  };

  return {W: W, H: H, R: R, LANE_X: LANE_X, PLUNGER_Y: PLUNGER_Y, BALLS: BALLS, seg: seg, circ: circ, arcPts: arcPts, buildWorld: buildWorld, Game: Game, TABLES: {}};
});
