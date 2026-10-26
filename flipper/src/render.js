// Zeichnen: Punktedisplay (DMD) oben, darunter der Tisch. Hintergrund und Rampen werden einmal pro Größe vorgezeichnet,
// bewegliche Teile (Lichter, Flipper, Kugeln, Effekte) jedes Bild neu. Jeder Tisch hat eigene Kunst (art.*).
(function (root) {
  "use strict";
  var F = root.Flipper;
  var W = F.W, H = F.H, DMDH = 120, TOTAL = H + DMDH;
  var TAU = Math.PI * 2;

  function seeded(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function fmt(n) { return Math.round(n).toLocaleString("de-DE"); }
  function mk(w, h) { var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }

  // Umriss des Spielfelds (für Clip und Füllung)
  function fieldPath(c) {
    c.beginPath(); c.moveTo(20, H); c.lineTo(20, 280); c.arc(300, 280, 280, Math.PI, TAU); c.lineTo(580, H); c.closePath();
  }
  function star(c, x, y, r1, r2, n, rot) {
    c.beginPath();
    for (var i = 0; i < n * 2; i++) { var r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    c.closePath();
  }

  /* ---------- Tischkunst ---------- */
  var art = {
    klassik: function (c, def, th) {
      // Holzgehäuse außen
      var wood = c.createLinearGradient(0, 0, W, 0); wood.addColorStop(0, "#5b3417"); wood.addColorStop(0.5, "#7a4a22"); wood.addColorStop(1, "#4d2a12");
      c.fillStyle = wood; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(0,0,0,.18)"; c.lineWidth = 1.5;
      for (var i = 0; i < 40; i++) { c.beginPath(); var y = i * 29 + 5; c.moveTo(0, y); c.bezierCurveTo(150, y + 12, 400, y - 10, W, y + 6); c.stroke(); }
      c.save(); fieldPath(c); c.clip();
      var g = c.createRadialGradient(280, 620, 40, 280, 520, 640); g.addColorStop(0, "#8c1c16"); g.addColorStop(0.55, "#4a0f0c"); g.addColorStop(1, "#1c0606");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      // Sonnenstrahlen
      for (i = 0; i < 28; i++) { c.fillStyle = i % 2 ? "rgba(232,179,65,.10)" : "rgba(232,179,65,.03)"; c.beginPath(); c.moveTo(280, 690); var a0 = i / 28 * TAU, a1 = (i + 1) / 28 * TAU; c.arc(280, 690, 900, a0, a1); c.closePath(); c.fill(); }
      // Art-déco-Bögen oben
      c.strokeStyle = "rgba(232,179,65,.45)"; c.lineWidth = 2;
      for (i = 0; i < 4; i++) { c.beginPath(); c.arc(300, 280, 236 - i * 16, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); }
      // Titel
      c.textAlign = "center"; c.fillStyle = "#f3d27a"; c.font = "700 46px " + th.font; c.shadowColor = "rgba(0,0,0,.6)"; c.shadowBlur = 8;
      c.fillText("Goldene Ära", 280, 712); c.shadowBlur = 0;
      c.font = "italic 18px " + th.font; c.fillStyle = "#e9d6a6"; c.fillText("★  seit 1976  ★", 280, 740);
      // Chromkugeln als Deko
      [[60, 200], [500, 200]].forEach(function (p) { var gg = c.createRadialGradient(p[0] - 4, p[1] - 4, 1, p[0], p[1], 12); gg.addColorStop(0, "#fff"); gg.addColorStop(1, "#888"); c.fillStyle = gg; c.beginPath(); c.arc(p[0], p[1], 9, 0, TAU); c.fill(); });
      c.restore();
    },
    comic: function (c, def, th) {
      c.fillStyle = "#111"; c.fillRect(0, 0, W, H);
      c.save(); fieldPath(c); c.clip();
      c.fillStyle = "#ffd21f"; c.fillRect(0, 0, W, H);
      // Actionlinien aus der Mitte
      for (var i = 0; i < 36; i++) { c.fillStyle = i % 2 ? "rgba(255,255,255,.35)" : "rgba(255,140,0,.22)"; c.beginPath(); c.moveTo(280, 520); c.arc(280, 520, 1000, i / 36 * TAU, (i + 1) / 36 * TAU); c.closePath(); c.fill(); }
      // Rasterpunkte, zum Rand hin größer
      c.fillStyle = "rgba(230,0,126,.28)";
      for (var y = 0; y < H; y += 14) for (var x = (y / 14 % 2) * 7; x < W; x += 14) {
        var d = Math.hypot(x - 280, y - 520) / 600, r = Math.max(0, d * 4.2 - 0.6);
        if (r > 0.3) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
      }
      // Skyline oben
      var rnd = seeded(42); c.fillStyle = "rgba(0,160,233,.55)";
      for (x = 40; x < 540; x += 26 + rnd() * 14) { var hh = 40 + rnd() * 90; c.fillRect(x, 200 - hh + 60, 22 + rnd() * 10, hh); }
      c.fillStyle = "rgba(255,255,255,.7)";
      for (x = 46; x < 540; x += 9) if (rnd() < 0.35) c.fillRect(x, 200 + rnd() * 50, 3, 4);
      // Comicpanel-Rahmen
      c.strokeStyle = "#111"; c.lineWidth = 5;
      c.strokeRect(40, 640, 160, 100); c.strokeRect(360, 640, 160, 100);
      // Titel im Sternenblitz
      c.fillStyle = "#e6007e"; star(c, 280, 690, 120, 70, 14, 0.2); c.fill(); c.lineWidth = 5; c.stroke();
      c.textAlign = "center"; c.font = "64px " + th.font; c.lineJoin = "round";
      c.save(); c.translate(280, 700); c.rotate(-0.08);
      c.lineWidth = 10; c.strokeStyle = "#111"; c.strokeText("KAPOW", 0, 0); c.fillStyle = "#fff36b"; c.fillText("KAPOW", 0, 0);
      c.font = "30px " + th.font; c.lineWidth = 7; c.strokeText("CITY", 0, 34); c.fillStyle = "#fff"; c.fillText("CITY", 0, 34);
      c.restore();
      // Kleine Nerd-Sprüche in den Panels
      c.font = "20px " + th.font; c.fillStyle = "#111"; c.textAlign = "center";
      c.fillText("42!", 120, 676); c.font = "15px " + th.font; c.fillText("RESPAWN IN 3…2…1", 120, 704); c.fillText("+1 INT", 120, 726);
      c.font = "20px " + th.font; c.fillText("GG WP", 440, 676); c.font = "15px " + th.font; c.fillText("SAVE GAME?", 440, 704); c.fillText("D20 = KRIT!", 440, 726);
      c.restore();
    },
    huberman: function (c, def, th) {
      // Gehäuse dunkel, der Himmel wird pro Bild nach Tageszeit gezeichnet (sky)
      c.fillStyle = "#0e1622"; c.fillRect(0, 0, W, H);
      c.save(); fieldPath(c); c.clip(); c.clearRect(0, 0, W, H);
      // Hügel unten
      c.fillStyle = "rgba(10,22,34,.55)";
      c.beginPath(); c.moveTo(20, 760); c.bezierCurveTo(140, 670, 220, 720, 300, 690); c.bezierCurveTo(380, 660, 460, 700, 540, 680); c.lineTo(540, H); c.lineTo(20, H); c.fill();
      c.fillStyle = "rgba(10,22,34,.75)";
      c.beginPath(); c.moveTo(20, 800); c.bezierCurveTo(160, 740, 260, 790, 360, 760); c.bezierCurveTo(440, 740, 500, 770, 540, 760); c.lineTo(540, H); c.lineTo(20, H); c.fill();
      // Tagesbogen mit Uhrzeiten
      c.strokeStyle = "rgba(255,255,255,.25)"; c.setLineDash([3, 9]); c.lineWidth = 2;
      c.beginPath(); c.arc(280, 690, 230, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.setLineDash([]);
      c.fillStyle = "rgba(255,255,255,.55)"; c.font = "600 14px " + th.font; c.textAlign = "center";
      [["06", 1.08], ["09", 1.27], ["12", 1.5], ["15", 1.73], ["21", 1.92]].forEach(function (p) { var a = Math.PI * p[1]; c.fillText(p[0], 280 + Math.cos(a) * 252, 690 + Math.sin(a) * 252 + 5); });
      // Titel
      c.fillStyle = "rgba(255,255,255,.9)"; c.font = "700 40px " + th.font; c.fillText("PROTOKOLL", 280, 712);
      c.font = "600 13px " + th.font; c.fillStyle = "rgba(255,255,255,.7)"; c.fillText("LICHT · KÄLTE · FOKUS · BEWEGUNG · SCHLAF", 280, 736);
      // Schneeflocken an der Kältebad-Rampe
      c.strokeStyle = "rgba(200,240,255,.7)"; c.lineWidth = 2;
      [[60, 480], [180, 470], [70, 560]].forEach(function (p) { for (var k = 0; k < 3; k++) { var a = k * Math.PI / 3; c.beginPath(); c.moveTo(p[0] - Math.cos(a) * 9, p[1] - Math.sin(a) * 9); c.lineTo(p[0] + Math.cos(a) * 9, p[1] + Math.sin(a) * 9); c.stroke(); } });
      c.restore();
    },
    weltraum: function (c, def, th) {
      c.fillStyle = "#05040f"; c.fillRect(0, 0, W, H);
      c.save(); fieldPath(c); c.clip();
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0a0626"); g.addColorStop(0.6, "#120a35"); g.addColorStop(1, "#2a0b3d");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      [[140, 300, 220, "rgba(255,61,242,.16)"], [420, 520, 260, "rgba(33,212,253,.12)"], [260, 120, 200, "rgba(122,92,255,.18)"]].forEach(function (n) {
        var rg = c.createRadialGradient(n[0], n[1], 0, n[0], n[1], n[2]); rg.addColorStop(0, n[3]); rg.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = rg; c.fillRect(0, 0, W, H);
      });
      var rnd = seeded(9);
      for (var i = 0; i < 260; i++) { c.fillStyle = "rgba(255,255,255," + (0.25 + rnd() * 0.7) + ")"; var s = rnd() < 0.08 ? 2 : 1; c.fillRect(rnd() * W, rnd() * H, s, s); }
      // Synthwave-Gitter
      c.strokeStyle = "rgba(255,61,242,.45)"; c.lineWidth = 1.5;
      for (i = 0; i < 9; i++) { var y = 690 + Math.pow(i / 8, 1.8) * 300; c.beginPath(); c.moveTo(20, y); c.lineTo(540, y); c.stroke(); }
      for (i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(280 + i * 14, 690); c.lineTo(280 + i * 90, 1000); c.stroke(); }
      // Sonne am Horizont
      var sg = c.createLinearGradient(0, 600, 0, 690); sg.addColorStop(0, "#ffd34d"); sg.addColorStop(1, "#ff3df2");
      c.fillStyle = sg; c.beginPath(); c.arc(280, 690, 70, Math.PI, TAU); c.fill();
      c.fillStyle = "#120a35"; for (i = 0; i < 5; i++) c.fillRect(200, 640 + i * 10, 160, 3 + i);
      c.textAlign = "center"; c.font = "900 46px " + th.font; c.shadowColor = "#21d4fd"; c.shadowBlur = 16; c.fillStyle = "#e9fbff";
      c.fillText("ORBIT 9", 280, 740); c.shadowBlur = 0;
      c.restore();
    }
  };

  /* ---------- Renderer ---------- */
  function Renderer(canvas) {
    this.cv = canvas; this.c = canvas.getContext("2d");
    this.fx = []; this.pops = []; this.msgs = []; this.shake = 0; this.flashT = 0; this.t = 0;
    this.dmdCache = {key: null}; this.dmdDots = null;
  }
  var RP = Renderer.prototype;
  RP.setGame = function (game) { this.g = game; this.def = game.def; this.th = game.def.theme; this.fx = []; this.pops = []; this.msgs = []; this.bg = null; this.resize(); };
  RP.resize = function () {
    var r = this.cv.getBoundingClientRect(), dpr = Math.min(2, root.devicePixelRatio || 1);
    this.cw = r.width; this.ch = r.height; this.dpr = dpr;
    this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
    this.s = Math.min(r.width / W, r.height / TOTAL); this.ox = (r.width - W * this.s) / 2; this.oy = (r.height - TOTAL * this.s) / 2;
    if (this.def) this.prerender();
  };
  RP.toWorld = function (cx) { return (cx - this.ox) / this.s; };
  RP.prerender = function () {
    var k = this.s * this.dpr, def = this.def, th = this.th, w = this.g.w;
    var bg = mk(W * k, H * k), c = bg.getContext("2d"); c.scale(k, k);
    art[def.id](c, def, th);
    // Feste Teile: Wände, Führungen, Pfosten, Slingshots
    c.lineCap = "round"; c.lineJoin = "round";
    w.segs.forEach(function (s) {
      if (s.tag === "drop" || s.tag === "standup" || s.tag === "plunger") return;
      if (s.tag === "gate") { c.strokeStyle = rgba(th.rail.length === 7 ? th.rail : "#888888", 0.7); c.lineWidth = 3; c.beginPath(); c.moveTo(s.ax, s.ay); c.lineTo(s.bx, s.by); c.stroke(); return; }
      c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = s.r * 2 + 4; c.beginPath(); c.moveTo(s.ax + 2, s.ay + 3); c.lineTo(s.bx + 2, s.by + 3); c.stroke();
      c.strokeStyle = th.rail; c.lineWidth = s.r * 2 + 1; c.beginPath(); c.moveTo(s.ax, s.ay); c.lineTo(s.bx, s.by); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; c.beginPath(); c.moveTo(s.ax - 1, s.ay - 1); c.lineTo(s.bx - 1, s.by - 1); c.stroke();
    });
    // Slingshot-Flächen
    [[[96, 762], [96, 836], [148, 868]], [[464, 762], [464, 836], [412, 868]]].forEach(function (p) {
      c.fillStyle = rgba(th.accent.length === 7 ? th.accent : "#888888", 0.85); c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.lineTo(p[1][0], p[1][1]); c.lineTo(p[2][0], p[2][1]); c.closePath(); c.fill();
      c.strokeStyle = th.rail; c.lineWidth = 3; c.stroke();
    });
    w.circs.forEach(function (o) { if (o.tag !== "post") return; c.fillStyle = th.rail; c.beginPath(); c.arc(o.x, o.y, o.r, 0, TAU); c.fill(); c.fillStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.arc(o.x - o.r * 0.3, o.y - o.r * 0.3, o.r * 0.35, 0, TAU); c.fill(); });
    // Abschussbahn
    c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(F.LANE_X + 3, 340, 580 - F.LANE_X - 6, F.PLUNGER_Y - 340);
    // Lane-Beschriftungen
    c.textAlign = "center"; c.font = "700 16px " + th.font; c.fillStyle = th.wall;
    def.lanes.xs.forEach(function (x, i) { c.fillText(def.lanes.labels[i], x, def.lanes.y1 + 50); });
    this.bg = bg;
    // Rampen als eigene Ebene über den Kugeln
    var rl = mk(W * k, H * k), rc = rl.getContext("2d"); rc.scale(k, k); rc.lineCap = "round"; rc.lineJoin = "round";
    w.ramps.forEach(function (r) {
      var path = function () { rc.beginPath(); r.path.forEach(function (p, i) { if (i) rc.lineTo(p[0], p[1]); else rc.moveTo(p[0], p[1]); }); };
      rc.shadowColor = "rgba(0,0,0,.45)"; rc.shadowOffsetX = 6; rc.shadowOffsetY = 10; rc.shadowBlur = 8;
      path(); rc.strokeStyle = th.rampEdge; rc.lineWidth = 34; rc.stroke();
      rc.shadowColor = "transparent";
      rc.globalCompositeOperation = "destination-out"; path(); rc.lineWidth = 27; rc.stroke();
      rc.globalCompositeOperation = "source-over"; path(); rc.strokeStyle = th.ramp; rc.lineWidth = 27; rc.stroke();
      path(); rc.strokeStyle = "rgba(255,255,255,.25)"; rc.lineWidth = 2; rc.stroke();
    });
    this.ramps = rl;
    this.dmdCache.key = null; this.dmdDots = null;
  };

  /* ---------- Effekte aus Spielereignissen ---------- */
  var BUBBLES = ["POW!", "BAM!", "ZAP!", "KAPOW!", "WHAM!", "BOOM!", "ZONK!", "KRACK!", "SPLAT!", "WUMMS!"];
  var HUBER = {bumper: ["Puls ↑", "Zone 2", "Dopamin", "Atmen"], drop: ["☀ Licht", "Lux!", "Cortisol-Peak", "Wach!"], spin: ["Fokus"], ramp: ["❄ 11 °C", "Brrr!", "Kälte!"]};
  RP.burst = function (x, y, color, n, speed) {
    for (var i = 0; i < n; i++) { var a = Math.random() * TAU, v = (0.3 + Math.random()) * (speed || 260); this.fx.push({x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.4, t: 0, c: color, s: 2 + Math.random() * 3}); }
    if (this.fx.length > 400) this.fx.splice(0, this.fx.length - 400);
  };
  RP.pop = function (text, x, y, o) { this.pops.push(Object.assign({text: text, x: x, y: y, t: 0, life: 1.1, size: 22}, o || {})); if (this.pops.length > 30) this.pops.shift(); };
  RP.message = function (big, small, dur) { this.msgs.push({big: big, small: small || "", t: dur || 1.8}); if (this.msgs.length > 6) this.msgs.shift(); };
  RP.handle = function (e) {
    var th = this.th, id = this.def.id, T = this.def.texts, g = this.g;
    switch (e.type) {
      case "bumper":
        this.burst(e.x, e.y, th.light, 10, 220);
        if (id === "comic" && Math.random() < 0.55) this.pop(BUBBLES[Math.floor(Math.random() * BUBBLES.length)], e.x + (Math.random() - 0.5) * 40, e.y - 40, {style: "bubble", size: 26, rot: (Math.random() - 0.5) * 0.5});
        else if (id === "huberman" && Math.random() < 0.3) this.pop(HUBER.bumper[Math.floor(Math.random() * 4)], e.x, e.y - 34, {size: 16, color: "#fff"});
        else if (id === "weltraum") this.burst(e.x, e.y, th.accent2, 8, 360);
        break;
      case "sling": this.burst(e.x, e.y, th.accent, 6, 160); if (id === "comic" && Math.random() < 0.3) this.pop(Math.random() < 0.5 ? "ZING!" : "BOING!", e.x, e.y - 30, {style: "bubble", size: 20}); break;
      case "drop":
        this.burst(e.x, e.y, th.accent2, id === "weltraum" ? 26 : 12, id === "weltraum" ? 340 : 200);
        if (id === "comic") this.pop(["UFF!", "ARGH!", "NEIN!", "AUTSCH!"][e.i % 4], e.x + 30, e.y - 20, {style: "bubble", size: 22});
        if (id === "huberman") this.pop(HUBER.drop[e.i % 4], e.x, e.y + 30, {size: 16, color: "#ffe28a"});
        break;
      case "bank": this.message(T.bank, "", 1.8); this.shake = 6; break;
      case "lanes": this.message(T.lanes, "BONUS × " + e.bonusX, 1.8); break;
      case "skill": this.message(T.skill, "+ 25.000", 2); this.burst(e.x, e.y, th.light, 30, 300); break;
      case "ramp":
        this.message(e.combo > 1 ? "COMBO × " + e.combo : T.ramp, fmt(e.points), 1.4);
        var ex = this.def.ramps[e.i].exit; this.burst(ex.x, ex.y - 20, th.rampEdge, 14, 200);
        if (id === "huberman") this.pop(HUBER.ramp[Math.floor(Math.random() * 3)], ex.x - 40, ex.y - 60, {size: 18, color: "#bfe8ff"});
        if (id === "comic") this.pop("SWOOSH!", ex.x, ex.y - 60, {style: "bubble", size: 24});
        break;
      case "orbit": this.message(T.orbit, "+ 2.000", 1.2); break;
      case "saucer": this.burst(e.x, e.y, th.accent, 16, 200); if (id === "weltraum") this.shake = 5; break;
      case "lockLit": this.message(T.lockLit, "", 1.4); break;
      case "lock": this.message(T.lock, e.n + " / 2", 1.6); break;
      case "multiball": this.message(T.multiball, "", 3); this.shake = 12; this.flashT = 0.6; if (id === "comic") this.pop("TEAM-UP!", 280, 450, {style: "bubble", size: 48, life: 2}); break;
      case "multiballEnd": this.message("MULTIBALL VORBEI", "", 1.5); break;
      case "jackpot": this.message(T.jackpot, fmt(e.points), 2.2); this.flashT = 0.4; this.shake = 8; break;
      case "superjackpot": this.message(T.superjackpot, fmt(e.points), 2.6); this.flashT = 0.7; this.shake = 14; break;
      case "mission": this.message(e.done.toUpperCase(), "+ " + fmt(e.points), 2.4); this.flashT = 0.35; if (id === "comic") this.pop(["MISSION!", "SIEG!", "LEVEL UP!"][e.i % 3], 280, 480, {style: "bubble", size: 40, life: 1.6}); break;
      case "missionStep": break;
      case "extraball": this.message(T.extraball, "", 2.2); break;
      case "shootAgain": this.message(T.shootAgain, "", 1.6); break;
      case "wizard": this.message(T.wizard, "30 SEK. PUNKTE × 3", 3); this.flashT = 1; this.shake = 14; break;
      case "wizardEnd": this.message(T.wizard + " VORBEI", "", 1.5); break;
      case "save": this.message(T.save, "", 1.6); break;
      case "tiltWarn": this.message(T.tiltWarn, "NICHT SO WILD", 1.5); this.shake = 8; break;
      case "tilt": this.message(T.tilt, "", 3); this.shake = 14; break;
      case "nudge": this.shake = Math.max(this.shake, 6); break;
      case "bonus": this.message(e.tilted ? "KEIN BONUS" : "BONUS " + fmt(e.bonus) + " × " + e.x, e.tilted ? "" : "= " + fmt(e.total), 2.3); break;
      case "ball": this.message("KUGEL " + e.n, "", 1.6); break;
      case "points": this.pop("+" + fmt(e.points), e.x, e.y, {size: 18, color: th.light, float: true}); break;
      case "gameover": this.message("GAME OVER", fmt(e.score), 4); break;
      case "eject": this.burst(e.x, e.y, th.accent2, 10, 180); break;
    }
  };

  /* ---------- Punktedisplay: echte 5×7-Pixelschrift auf 128×24 Punkten ---------- */
  var GLYPHS = {
    A: "0E11111F111111", B: "1E11111E11111E", C: "0E11101010110E", D: "1E11111111111E", E: "1F10101E10101F", F: "1F10101E101010",
    G: "0E1110171111 0F", H: "1111111F111111", I: "0E04040404040E", J: "07020202 02120C", K: "11121418141211", L: "1010101010101F",
    M: "111B1515111111", N: "11111915131111", O: "0E11111111110E", P: "1E11111E101010", Q: "0E11111115120D", R: "1E11111E141211",
    S: "0F10100E01011E", T: "1F040404040404", U: "1111111111110E", V: "1111111111 0A04", W: "1111111515150A", X: "11110A040A1111",
    Y: "11110A04040404", Z: "1F01020408101F", "Ä": "0A000E111F1111", "Ö": "0A000E1111110E", "Ü": "0A00111111110E",
    "0": "0E111315191 10E", "1": "040C040404040E", "2": "0E11010204081F", "3": "1F02040201110E", "4": "02060A121F0202", "5": "1F101E0101110E",
    "6": "0608101E11110E", "7": "1F010204080808", "8": "0E11110E11110E", "9": "0E11110F01020C", ".": "0000000000 0C0C", ",": "00000000 0C0408",
    ":": "000C0C000C0C00", "-": "0000001F000000", "+": "0004041F040400", "/": "01010204081010", "!": "04040404040004", "?": "0E110102040004",
    "×": "00110A040A1100", "=": "00001F001F0000", "%": "18190204081303", "(": "02040808080402", ")": "08040202020408", "'": "04040800000000",
    "♥": "000A1F1F0E0400", "★": "04041F0E0E1B00", "&": "0C121408151 20D", "#": "0A0A1F0A1F0A0A", "°": "0C120C00000000", "·": "00000004000000"
  };
  var GL = {};
  Object.keys(GLYPHS).forEach(function (k) {
    var h = GLYPHS[k].replace(/ /g, ""), rows = [];
    for (var i = 0; i < 7; i++) rows.push(parseInt(h.substr(i * 2, 2), 16) || 0);
    var used = rows.reduce(function (a, b) { return a | b; }, 0), l = 0, r = 4;
    while (l < 4 && !(used & (16 >> l))) l++;
    while (r > l && !(used & (16 >> r))) r--;
    GL[k] = {rows: rows, l: used ? l : 0, w: used ? r - l + 1 : 3};
  });
  function glyph(ch) { return GL[ch] || GL[ch.toUpperCase()] || null; }
  function textWidth(t, sx) { var w = 0; for (var i = 0; i < t.length; i++) { var gph = glyph(t[i]); w += ((gph ? gph.w : 3) + 1) * sx; } return Math.max(0, w - sx); }
  function blit(buf, t, x, y, sx, sy) {
    for (var i = 0; i < t.length; i++) {
      var gph = glyph(t[i]);
      if (gph) for (var ry = 0; ry < 7; ry++) for (var cx = 0; cx < gph.w; cx++) if (gph.rows[ry] & (16 >> (cx + gph.l)))
        for (var a = 0; a < sx; a++) for (var b = 0; b < sy; b++) { var px = Math.round(x) + cx * sx + a, py = y + ry * sy + b; if (px >= 0 && px < 128 && py >= 0 && py < 24) buf[py * 128 + px] = 1; }
      x += ((gph ? gph.w : 3) + 1) * sx;
    }
  }
  RP.dmdText = function () {
    var g = this.g, m = this.msgs[0], blink = Math.floor(this.t * 4) % 2;
    if (m) return {big: m.big, small: m.small, msg: true, blink: blink};
    var mi = g.currentMission(), small = "KUGEL " + Math.min(g.ballNo, F.BALLS) + (g.extra ? " +EB" : "") + (mi ? " · " + mi.title + " " + mi.have + "/" + mi.need : "");
    if (g.waiting() && !g.multiball) small = "KUGEL " + g.ballNo + " · ABZUG HALTEN UND LOSLASSEN";
    if (g.multiball) small = "MULTIBALL · RAMPE = JACKPOT";
    if (g.wizard > 0) small = this.def.texts.wizard + " " + Math.ceil(g.wizard) + "S · PUNKTE × 3";
    return {big: fmt(g.score), small: small, msg: false, blink: 0};
  };
  RP.drawDMD = function (c) {
    var d = this.dmdText(), big = d.big.toUpperCase().replace(/ß/g, "SS"), small = (d.small || "").toUpperCase().replace(/ß/g, "SS");
    var sw = textWidth(small, 1), scroll = sw > 126 ? Math.floor(this.t * 24) % (sw + 30) : 0;
    var key = big + "|" + small + "|" + (d.msg ? d.blink : "") + "|" + scroll;
    var dc = this.dmdCache;
    if (dc.key !== key || !this.dmdDots) {
      dc.key = key;
      var buf = new Uint8Array(128 * 24);
      var bw2 = textWidth(big, 2);
      if (bw2 <= 128) blit(buf, big, (128 - bw2) / 2, small ? 0 : 5, 2, 2);
      else { var bw1 = textWidth(big, 1); blit(buf, big, bw1 <= 128 ? (128 - bw1) / 2 : 1, small ? 0 : 5, 1, 2); }
      if (small) {
        if (sw <= 126) blit(buf, small, (128 - sw) / 2, 16, 1, 1);
        else { blit(buf, small, 128 - scroll, 16, 1, 1); blit(buf, small, 128 - scroll + sw + 30, 16, 1, 1); }
      }
      if (d.msg && d.blink) for (var i = 0; i < 128; i++) { buf[i] = buf[i] || (i % 4 === 0 ? 1 : 0); buf[23 * 128 + i] = i % 4 === 2 ? 1 : buf[23 * 128 + i]; }
      var k = this.s * this.dpr, pitch = W / 128;
      var out = this.dmdDots && this.dmdDots.width === Math.round(W * k) ? this.dmdDots : (this.dmdDots = mk(W * k, 24 * pitch * k));
      var o = out.getContext("2d"); o.setTransform(k, 0, 0, k, 0, 0); o.clearRect(0, 0, W, 24 * pitch);
      o.fillStyle = rgba(this.th.dmd, 0.08);
      for (var yy = 0; yy < 24; yy++) for (var xx = 0; xx < 128; xx++) if (!buf[yy * 128 + xx]) { o.beginPath(); o.arc(xx * pitch + pitch / 2, yy * pitch + pitch / 2, pitch * 0.38, 0, TAU); o.fill(); }
      o.fillStyle = this.th.dmd; o.shadowColor = this.th.dmd; o.shadowBlur = 3 * k;
      o.beginPath();
      for (yy = 0; yy < 24; yy++) for (xx = 0; xx < 128; xx++) if (buf[yy * 128 + xx]) { o.moveTo(xx * pitch + pitch * 0.92, yy * pitch + pitch / 2); o.arc(xx * pitch + pitch / 2, yy * pitch + pitch / 2, pitch * 0.42, 0, TAU); }
      o.fill(); o.shadowBlur = 0;
    }
    c.fillStyle = "#0b0b0b"; c.fillRect(6, -DMDH + 4, W - 12, DMDH - 8);
    c.strokeStyle = "#2a2a2a"; c.lineWidth = 3; c.strokeRect(6, -DMDH + 4, W - 12, DMDH - 8);
    c.drawImage(this.dmdDots, 0, -DMDH + (DMDH - 24 * W / 128) / 2, W, 24 * W / 128);
  };

  /* ---------- Zeichnen pro Bild ---------- */
  RP.sky = function (c) {
    // Huberman: Himmel nach Tageszeit, die mit den Missionen fortschreitet
    var g = this.g, n = this.def.missions.length, mi = g.currentMission();
    var p = ((g.mission % n) + (mi ? Math.min(1, mi.have / mi.need) : 0)) / n; if (g.wizard > 0) p = 0.35 + 0.1 * Math.sin(this.t);
    var stops = [[0, "#3a2a5a", "#f08a4b"], [0.25, "#4f8fc9", "#ffd08a"], [0.5, "#5fb3e8", "#cfeaff"], [0.7, "#4a3b78", "#e07a5f"], [0.85, "#141b3a", "#4b3a78"], [1, "#070b1c", "#1b2a4f"]];
    var a = stops[0], b = stops[stops.length - 1];
    for (var i = 0; i < stops.length - 1; i++) if (p >= stops[i][0] && p <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
    var f = (p - a[0]) / ((b[0] - a[0]) || 1);
    function mix(h1, h2) { var x = parseInt(h1.slice(1), 16), y = parseInt(h2.slice(1), 16), r = [16, 8, 0].map(function (s) { return Math.round((x >> s & 255) * (1 - f) + (y >> s & 255) * f); }); return "rgb(" + r.join(",") + ")"; }
    c.save(); fieldPath(c); c.clip();
    var gr = c.createLinearGradient(0, 0, 0, 800); gr.addColorStop(0, mix(a[1], b[1])); gr.addColorStop(1, mix(a[2], b[2]));
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    // Sonne oder Mond auf dem Tagesbogen
    var ang = Math.PI * (1.05 + 0.9 * Math.min(1, p / 0.8)), sx = 280 + Math.cos(ang) * 230, sy = 690 + Math.sin(ang) * 230;
    if (p < 0.8) { var sg = c.createRadialGradient(sx, sy, 4, sx, sy, 70); sg.addColorStop(0, "rgba(255,240,180,1)"); sg.addColorStop(0.3, "rgba(255,200,90,.6)"); sg.addColorStop(1, "rgba(255,200,90,0)"); c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, 70, 0, TAU); c.fill(); }
    else {
      c.fillStyle = "rgba(255,255,255," + Math.min(1, (p - 0.75) * 4) + ")"; var rnd = seeded(3);
      for (i = 0; i < 70; i++) { var tw = 0.5 + 0.5 * Math.sin(this.t * 2 + i); c.globalAlpha = Math.min(1, (p - 0.75) * 4) * tw; c.fillRect(rnd() * W, rnd() * 600, 2, 2); }
      c.globalAlpha = 1; c.fillStyle = "#f4f1e0"; c.beginPath(); c.arc(420, 160, 26, 0, TAU); c.fill(); c.fillStyle = mix(a[1], b[1]); c.beginPath(); c.arc(432, 152, 24, 0, TAU); c.fill();
    }
    c.restore();
  };
  RP.light = function (c, x, y, r, on, label, color) {
    var th = this.th;
    c.fillStyle = on ? (color || th.light) : th.off; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    if (on) { c.save(); c.globalAlpha = 0.35; c.fillStyle = color || th.light; c.beginPath(); c.arc(x, y, r * 2, 0, TAU); c.fill(); c.restore(); }
    c.strokeStyle = "rgba(0,0,0,.4)"; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    if (label) { c.fillStyle = on ? "#222" : "rgba(255,255,255,.55)"; c.font = "700 " + Math.round(r * 1.1) + "px " + th.font; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, x, y + 1); c.textBaseline = "alphabetic"; }
  };
  RP.arrow = function (c, x, y, ang, on, color) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.fillStyle = on ? (color || this.th.light) : this.th.off; c.globalAlpha = on ? 1 : 0.7;
    c.beginPath(); c.moveTo(0, -16); c.lineTo(11, 8); c.lineTo(0, 3); c.lineTo(-11, 8); c.closePath(); c.fill();
    if (on) { c.shadowColor = color || this.th.light; c.shadowBlur = 14; c.fill(); }
    c.restore();
  };
  // Wohin der Pfeil der aktuellen Mission zeigt
  RP.missionTarget = function () {
    var g = this.g, w = g.w, mi = g.currentMission(); if (!mi) return null;
    var avg = function (list) { var x = 0, y = 0; list.forEach(function (s) { x += (s.ax + s.bx) / 2; y += (s.ay + s.by) / 2; }); return {x: x / list.length, y: y / list.length}; };
    switch (mi.ev) {
      case "bank": var d = avg(w.segs.filter(function (s) { return s.tag === "drop"; })); return {x: d.x, y: d.y + 70};
      case "standups": d = avg(w.segs.filter(function (s) { return s.tag === "standup"; })); return {x: Math.min(d.x, 480) + (d.x < 280 ? 50 : -20), y: d.y + 40};
      case "ramp": return {x: w.ramps[0].entry.x, y: w.ramps[0].entry.y + 120};
      case "spin": return w.spinner ? {x: w.spinner.x, y: w.spinner.y + 60} : null;
      case "saucer": return w.saucer ? {x: w.saucer.x, y: w.saucer.y + 44} : null;
      case "lanes": return {x: 280, y: this.def.lanes.y1 + 80};
      case "bumper": var b = w.circs.filter(function (c) { return c.tag === "bumper"; }); return b.length ? {x: b[b.length > 2 ? 2 : 0].x, y: b[b.length > 2 ? 2 : 0].y + 60} : null;
    }
    return null;
  };
  RP.flipperShape = function (c, f) {
    var th = this.th, cs = Math.cos(f.ang), sn = Math.sin(f.ang), tx = f.px + cs * f.len, ty = f.py + sn * f.len;
    var nx = -sn, ny = cs;
    c.beginPath();
    c.moveTo(f.px + nx * f.r0, f.py + ny * f.r0); c.lineTo(tx + nx * f.r1, ty + ny * f.r1);
    c.arc(tx, ty, f.r1, f.ang + Math.PI / 2, f.ang - Math.PI / 2, true);
    c.lineTo(f.px - nx * f.r0, f.py - ny * f.r0);
    c.arc(f.px, f.py, f.r0, f.ang - Math.PI / 2, f.ang + Math.PI / 2, true);
    c.closePath();
    c.save(); c.shadowColor = "rgba(0,0,0,.5)"; c.shadowOffsetX = 3; c.shadowOffsetY = 5; c.shadowBlur = 6; c.fillStyle = th.flipper; c.fill(); c.restore();
    c.strokeStyle = th.flipperEdge; c.lineWidth = 4; c.stroke();
    c.fillStyle = th.flipperEdge; c.beginPath(); c.arc(f.px, f.py, 4, 0, TAU); c.fill();
  };
  RP.ball = function (c, b, scale) {
    var th = this.th, r = F.R * (scale || 1);
    c.fillStyle = "rgba(0,0,0,.35)"; c.beginPath(); c.arc(b.x + 3 * (scale || 1), b.y + 5 * (scale || 1), r, 0, TAU); c.fill();
    var g = c.createRadialGradient(b.x - r * 0.4, b.y - r * 0.45, r * 0.1, b.x, b.y, r);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, th.ball); g.addColorStop(1, "#4a4f57");
    c.fillStyle = g; c.beginPath(); c.arc(b.x, b.y, r, 0, TAU); c.fill();
    if (this.def.id === "weltraum") { c.strokeStyle = "rgba(33,212,253,.6)"; c.lineWidth = 2; c.beginPath(); c.arc(b.x, b.y, r + 2, 0, TAU); c.stroke(); }
  };

  RP.draw = function (dt) {
    var c = this.c, g = this.g, w = g.w, th = this.th, def = this.def, t = (this.t += dt);
    if (!this.bg) return;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
    var k = this.s * this.dpr, sx = 0, sy = 0;
    if (this.shake > 0) { sx = (Math.random() - 0.5) * this.shake; sy = (Math.random() - 0.5) * this.shake; this.shake = Math.max(0, this.shake - dt * 40); }
    c.setTransform(k, 0, 0, k, (this.ox + sx * this.s) * this.dpr, (this.oy + (DMDH + sy) * this.s) * this.dpr);
    this.drawDMD(c);
    if (th.sky) this.sky(c);
    c.drawImage(this.bg, 0, 0, W, H);

    // Lane-Lichter (Skillshot-Lane blinkt)
    var self = this, blink = Math.floor(t * 5) % 2 === 0;
    def.lanes.xs.forEach(function (x, i) {
      var on = g.lanesLit[i] || (i === g.skillLane && g.waiting() && blink) || (g.skillT > 0 && i === g.skillLane && blink);
      self.light(c, x, def.lanes.y1 + 24, 10, on, "", i === g.skillLane ? th.accent2 : null);
    });
    // Bonus-Multiplikator-Lichter
    for (var i = 2; i <= 6; i++) self.light(c, 200 + (i - 2) * 40, 800, 9, g.bonusX >= i, i + "×");
    // Lock-Lichter und Missionsfortschritt
    self.light(c, 245, 840, 8, g.lockLit > 0 || g.locks > 0, "L");
    self.light(c, 315, 840, 8, g.lockLit > 1 || g.locks > 1, "L");
    self.light(c, 280, 872, 10, g.extra > 0 || (g.save > 0 && blink), g.save > 0 ? "♥" : "EB", g.save > 0 ? th.accent2 : null);
    // Missionspfeil
    var mt = this.missionTarget(); if (mt && !g.tilted) this.arrow(c, mt.x, mt.y, 0, blink, th.accent);
    // Rampenpfeil
    w.ramps.forEach(function (r) { self.arrow(c, r.entry.x, r.entry.y + 85, 0, g.multiball ? blink : g.lockLit < 2, g.multiball ? th.accent2 : th.light); });

    // Ziele
    w.segs.forEach(function (s) {
      if (s.tag !== "drop" && s.tag !== "standup") return;
      var mx = (s.ax + s.bx) / 2, my = (s.ay + s.by) / 2, ang = Math.atan2(s.by - s.ay, s.bx - s.ax), len = Math.hypot(s.bx - s.ax, s.by - s.ay);
      c.save(); c.translate(mx, my); c.rotate(ang);
      if (s.tag === "drop") {
        if (s.on) { c.fillStyle = s.flash > 0 ? "#fff" : th.accent2; c.fillRect(-len / 2, -6, len, 12); c.fillStyle = "rgba(255,255,255,.6)"; c.fillRect(-len / 2 + 3, -3, len - 6, 3); c.strokeStyle = "#111"; c.lineWidth = 1.5; c.strokeRect(-len / 2, -6, len, 12); }
        else { c.fillStyle = "rgba(0,0,0,.55)"; c.fillRect(-len / 2, -3, len, 6); }
      } else {
        var lit = g.standups[s.i];
        c.fillStyle = s.flash > 0 ? "#fff" : lit ? th.light : th.accent; c.fillRect(-len / 2, -5, len, 10); c.strokeStyle = "#111"; c.lineWidth = 1.5; c.strokeRect(-len / 2, -5, len, 10);
      }
      c.restore();
    });
    // Slingshot-Blitz
    w.segs.forEach(function (s) { if (s.tag === "sling" && s.flash > 0) { c.strokeStyle = th.light; c.lineWidth = 8; c.globalAlpha = s.flash * 5; c.beginPath(); c.moveTo(s.ax, s.ay); c.lineTo(s.bx, s.by); c.stroke(); c.globalAlpha = 1; } });
    // Spinner
    var sp = w.spinner;
    if (sp) {
      var hgt = Math.abs(Math.cos(sp.ang)) * 12 + 2;
      c.fillStyle = "rgba(0,0,0,.4)"; c.fillRect(sp.x - sp.w / 2 - 3, sp.y - 2, sp.w + 6, 4);
      c.fillStyle = th.accent; c.fillRect(sp.x - sp.w / 2, sp.y - hgt / 2, sp.w, hgt);
      c.fillStyle = "rgba(255,255,255,.7)"; c.fillRect(sp.x - sp.w / 2, sp.y - hgt / 2, sp.w, Math.min(2, hgt));
    }
    // Kickout-Loch
    var sc = w.saucer;
    if (sc) {
      if (def.id === "weltraum") {
        for (i = 0; i < 4; i++) { c.strokeStyle = "rgba(255," + (120 + i * 30) + ",242," + (0.5 - i * 0.1) + ")"; c.lineWidth = 3; c.beginPath(); c.ellipse(sc.x, sc.y, 22 + i * 7, 10 + i * 3, t * (1.5 - i * 0.2), 0, TAU); c.stroke(); }
        c.fillStyle = "#000"; c.beginPath(); c.arc(sc.x, sc.y, 15, 0, TAU); c.fill();
        c.strokeStyle = g.lockLit > 0 && blink ? th.light : "rgba(255,255,255,.4)"; c.lineWidth = 2; c.stroke();
      } else {
        c.fillStyle = "#000"; c.beginPath(); c.arc(sc.x, sc.y, 15, 0, TAU); c.fill();
        c.strokeStyle = (g.lockLit > 0 || g.superLit) && blink ? th.light : th.rail; c.lineWidth = 4; c.stroke();
        if (def.id === "huberman") { c.fillStyle = "rgba(255,255,255,.75)"; c.font = "700 11px " + th.font; c.textAlign = "center"; c.fillText("SCHLAF", sc.x, sc.y + 32); }
        if (def.id === "comic") { c.fillStyle = "#111"; c.font = "13px " + th.font; c.textAlign = "center"; c.fillText("VERSTECK", sc.x, sc.y + 32); }
      }
    }
    // Bumper
    w.circs.forEach(function (o) {
      if (o.tag !== "bumper") return;
      var fl = o.flash > 0 ? o.flash / 0.25 : 0;
      if (def.id === "weltraum") {
        if (o.i === 0) {
          var pg = c.createRadialGradient(o.x - 10, o.y - 12, 4, o.x, o.y, o.r); pg.addColorStop(0, "#ffb3f6"); pg.addColorStop(0.6, "#8a3dd1"); pg.addColorStop(1, "#2b0f52");
          c.fillStyle = "rgba(255,61,242," + (0.15 + fl * 0.4) + ")"; c.beginPath(); c.arc(o.x, o.y, o.r + 14, 0, TAU); c.fill();
          c.fillStyle = pg; c.beginPath(); c.arc(o.x, o.y, o.r, 0, TAU); c.fill();
          c.strokeStyle = "rgba(33,212,253,.85)"; c.lineWidth = 4; c.beginPath(); c.ellipse(o.x, o.y, o.r + 22, 9, -0.35, 0, TAU); c.stroke();
          c.fillStyle = pg; c.beginPath(); c.arc(o.x, o.y, o.r, Math.PI + 0.1, TAU - 0.5); c.fill();
        } else {
          c.fillStyle = "rgba(33,212,253," + (0.15 + fl * 0.5) + ")"; c.beginPath(); c.arc(o.x, o.y, o.r + 8, 0, TAU); c.fill();
          var mg = c.createRadialGradient(o.x - 5, o.y - 6, 2, o.x, o.y, o.r); mg.addColorStop(0, "#fff"); mg.addColorStop(1, "#7b8597");
          c.fillStyle = mg; c.beginPath(); c.arc(o.x, o.y, o.r, 0, TAU); c.fill();
          c.fillStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.arc(o.x + 5, o.y + 3, 4, 0, TAU); c.arc(o.x - 6, o.y + 6, 2.5, 0, TAU); c.fill();
        }
        return;
      }
      if (def.id === "comic") {
        c.fillStyle = fl ? "#fff36b" : th.bumper; star(c, o.x, o.y, o.r + 8 + fl * 6, o.r - 2, 10, t * 0.5 + o.i); c.fill(); c.strokeStyle = "#111"; c.lineWidth = 3; c.stroke();
        c.fillStyle = "#fff"; c.beginPath(); c.arc(o.x, o.y, o.r * 0.62, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = "#111"; c.font = Math.round(o.r * 0.62) + "px " + th.font; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(o.label, o.x, o.y + 1); c.textBaseline = "alphabetic";
        return;
      }
      c.fillStyle = "rgba(0,0,0,.35)"; c.beginPath(); c.arc(o.x + 3, o.y + 5, o.r, 0, TAU); c.fill();
      if (fl) { c.fillStyle = rgba(th.light, 0.5 * fl); c.beginPath(); c.arc(o.x, o.y, o.r + 14, 0, TAU); c.fill(); }
      c.fillStyle = th.bumper; c.beginPath(); c.arc(o.x, o.y, o.r, 0, TAU); c.fill();
      c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 2; c.stroke();
      var cg = c.createRadialGradient(o.x - 6, o.y - 8, 2, o.x, o.y, o.r * 0.75); cg.addColorStop(0, "#fff"); cg.addColorStop(1, fl ? th.light : th.bumperCap);
      c.fillStyle = cg; c.beginPath(); c.arc(o.x, o.y - 2, o.r * 0.72, 0, TAU); c.fill();
      c.fillStyle = th.bumper; c.font = "700 " + Math.round(o.r * 0.55) + "px " + th.font; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(o.label, o.x, o.y - 1); c.textBaseline = "alphabetic";
    });
    // Abzug
    var pl = g.pull, py = F.PLUNGER_Y + 4 + pl * 36;
    c.strokeStyle = "#999"; c.lineWidth = 2; c.beginPath();
    for (i = 0; i <= 10; i++) c.lineTo(552 + (i % 2) * 16, py + 6 + i * (H - py - 6) / 10);
    c.stroke();
    c.fillStyle = th.accent; c.fillRect(546, py - 4, 28, 10);
    // Flipper und Kugeln
    w.flippers.forEach(function (f) { self.flipperShape(c, f); });
    g.balls.forEach(function (b) { if (!b.ramp) self.ball(c, b); });
    c.drawImage(this.ramps, 0, 0, W, H);
    w.ramps.forEach(function (r) { if (r.flash > 0) { c.save(); c.globalAlpha = Math.min(1, r.flash * 2) * 0.6; c.strokeStyle = th.light; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); r.path.forEach(function (p, j) { if (j) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.stroke(); c.restore(); } });
    g.balls.forEach(function (b) { if (b.ramp) self.ball(c, b, 1.15); });

    // Partikel und Texte
    this.fx = this.fx.filter(function (p) { p.t += dt; return p.t < p.life; });
    this.fx.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; c.globalAlpha = 1 - p.t / p.life; c.fillStyle = p.c; c.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); });
    c.globalAlpha = 1;
    this.pops = this.pops.filter(function (p) { p.t += dt; return p.t < p.life; });
    this.pops.forEach(function (p) {
      var a = 1 - Math.max(0, (p.t - p.life * 0.6) / (p.life * 0.4)), sc = p.style === "bubble" ? Math.min(1, p.t * 9) : 1;
      c.save(); c.globalAlpha = a; c.translate(p.x, p.y - (p.float ? p.t * 40 : 0)); c.rotate(p.rot || 0); c.scale(sc, sc);
      c.textAlign = "center"; c.textBaseline = "middle";
      if (p.style === "bubble") {
        c.font = p.size + "px " + th.font; var tw = c.measureText(p.text).width;
        c.fillStyle = "#fff"; star(c, 0, 0, tw * 0.75 + 14, tw * 0.55 + 6, 12, 0.3); c.fill(); c.strokeStyle = "#111"; c.lineWidth = 3; c.stroke();
        c.lineWidth = 5; c.strokeStyle = "#111"; c.strokeText(p.text, 0, 2); c.fillStyle = "#e6007e"; c.fillText(p.text, 0, 2);
      } else {
        c.font = "700 " + p.size + "px " + th.font; c.lineWidth = 4; c.strokeStyle = "rgba(0,0,0,.6)"; c.strokeText(p.text, 0, 0); c.fillStyle = p.color || "#fff"; c.fillText(p.text, 0, 0);
      }
      c.restore();
    });
    // Blitz bei Jackpot und Multiball, Tilt-Schleier
    if (this.flashT > 0) { this.flashT -= dt; c.fillStyle = rgba(th.light, Math.max(0, this.flashT) * 0.6); c.fillRect(0, 0, W, H); }
    if (g.tilted) { c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(0, 0, W, H); c.fillStyle = "#ff3b30"; c.font = "900 90px " + th.font; c.textAlign = "center"; c.globalAlpha = blink ? 1 : 0.6; c.fillText("TILT", 280, 520); c.globalAlpha = 1; }
    if (g.wizard > 0) { c.strokeStyle = rgba(th.light, 0.4 + 0.4 * Math.sin(t * 8)); c.lineWidth = 8; fieldPath(c); c.stroke(); }
    // Nachrichten laufen ab
    if (this.msgs.length) { this.msgs[0].t -= dt; if (this.msgs[0].t <= 0) this.msgs.shift(); }
  };
  // Kleines Vorschaubild eines Tisches fürs Auswahlmenü
  Renderer.preview = function (def, canvas) {
    var g = new F.Game(def, {rand: function () { return 0.3; }});
    var r = new Renderer(canvas); r.g = g; r.def = def; r.th = def.theme;
    var cw = canvas.width, ch = canvas.height; r.dpr = 1; r.cw = cw; r.ch = ch;
    r.s = Math.min(cw / W, ch / TOTAL); r.ox = (cw - W * r.s) / 2; r.oy = (ch - TOTAL * r.s) / 2;
    r.prerender(); r.draw(0.016);
  };
  root.FlipperRenderer = Renderer;
})(this);
