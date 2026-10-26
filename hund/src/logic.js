// Hundeleben-Logik: Wohnung, Garten und Park, Wegfindung, Mensch, Hund mit Bedürfnissen und eigenem Kopf,
// Uhr, Aktionen wie bei den Sims und die Aufgaben des Tages. Kein Zeichnen, kein Ton.
// Läuft im Browser (window.Hund) und in Node (require) für die Tests.
// Koordinaten in Metern, y nach oben. Blickrichtung yaw: vorwärts ist (sin yaw, cos yaw) in (x, z).
(function (root, factory) {
  var H = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = H;
  else root.Hund = H;
})(this, function () {
  "use strict";
  var TAU = Math.PI * 2, LEASH = 2.4, HEAR = 25, GRAV = 9.81;

  /* ---------- Werkzeuge ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function angDiff(a, b) { var d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
  function approach(v, t, step) { return v < t ? Math.min(t, v + step) : Math.max(t, v - step); }
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hashStr(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function fwd(yaw) { return {x: Math.sin(yaw), z: Math.cos(yaw)}; }
  // Rechts aus Sicht der Figur.
  function right(yaw) { return {x: -Math.cos(yaw), z: Math.sin(yaw)}; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.z - b.z); }
  function yawTo(a, b) { return Math.atan2(b.x - a.x, b.z - a.z); }
  function fmtTime(t) { t = ((Math.floor(t) % 1440) + 1440) % 1440; var h = Math.floor(t / 60), m = t % 60; return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m; }

  /* ---------- Welt: Park im Norden, Haus mit Garten im Süden ---------- */
  var HOUSE = {x0: -9, x1: 9, z0: -137, z1: -121};
  var LOT = {x0: -15, x1: 15, z0: -140, z1: -110};
  var ROOMS = [
    {id: "wohnen", name: "Wohnzimmer", x0: -9, x1: 3, z0: -129, z1: -121},
    {id: "kueche", name: "Küche", x0: 3, x1: 9, z0: -129, z1: -121},
    {id: "schlafen", name: "Schlafzimmer", x0: -9, x1: 1, z0: -137, z1: -129},
    {id: "bad", name: "Bad", x0: 1, x1: 9, z0: -137, z1: -129}
  ];
  function inHouse(e) { return e.x > HOUSE.x0 && e.x < HOUSE.x1 && e.z > HOUSE.z0 && e.z < HOUSE.z1; }
  function inPark(e) { return e.z > -109.6; }
  function roomOf(e) { for (var i = 0; i < ROOMS.length; i++) { var r = ROOMS[i]; if (e.x > r.x0 && e.x < r.x1 && e.z > r.z0 && e.z < r.z1) return r; } return null; }

  function segDist(px, pz, a, b) {
    var dx = b.x - a.x, dz = b.z - a.z, l = dx * dx + dz * dz, t = l ? clamp(((px - a.x) * dx + (pz - a.z) * dz) / l, 0, 1) : 0;
    return Math.hypot(px - a.x - t * dx, pz - a.z - t * dz);
  }
  function pathDist(W, x, z) {
    var best = 1e9;
    W.paths.forEach(function (p) { for (var i = 0; i < p.pts.length - 1; i++) best = Math.min(best, segDist(x, z, p.pts[i], p.pts[i + 1])); });
    return best;
  }

  function buildWorld(seed) {
    var R = rng(seed || 7);
    var W = {seed: seed || 7, half: 110, gate: {x: 0, z: -110}, pond: {x: 16, z: 20, r: 9}, paths: [], trees: [], bushes: [], benches: [], lamps: [], bins: [],
      sticks: [], flowers: [], mud: [], colliders: [], boxes: [], spots: [], walls: [], furniture: [], objects: [], house: HOUSE, lot: LOT, rooms: ROOMS};
    // Wände des Hauses (0,2 m dick) mit Türöffnungen. h = Höhe.
    function wall(x0, x1, z0, z1, side) { var b = {x0: x0, x1: x1, z0: z0, z1: z1, h: 2.6, kind: "wand", side: side}; W.walls.push(b); W.boxes.push(b); }
    var T = 0.1;
    wall(-9 - T, -1.1, -121 - T, -121 + T, "n"); wall(0.3, 9 + T, -121 - T, -121 + T, "n");
    wall(-9 - T, 9 + T, -137 - T, -137 + T, "s");
    wall(-9 - T, -9 + T, -137, -121, "w"); wall(9 - T, 9 + T, -137, -121, "o");
    wall(-9, -4.7, -129 - T, -129 + T, "i"); wall(-3.3, 3.6, -129 - T, -129 + T, "i"); wall(5.0, 9, -129 - T, -129 + T, "i");
    wall(3 - T, 3 + T, -129, -126.2, "i"); wall(3 - T, 3 + T, -124.8, -121, "i");
    wall(1 - T, 1 + T, -137, -129, "i");
    // Zäune: Grundstück und Park, Tor in der Mitte.
    function fence(x0, x1, z0, z1) { var b = {x0: x0, x1: x1, z0: z0, z1: z1, h: 1.1, kind: "zaun"}; W.boxes.push(b); W.fences = (W.fences || []).concat([b]); }
    fence(-110, -1.6, -110.1, -109.9); fence(1.6, 110, -110.1, -109.9);
    fence(-15.1, -14.9, -140, -110); fence(14.9, 15.1, -140, -110); fence(-15, 15, -140.1, -139.9);
    // Möbel: Kasten mit Höhe, dazu Objekte zum Antippen mit Stehplatz (use) und Blickrichtung.
    function furn(id, kind, x0, x1, z0, z1, h, extra) {
      var b = {id: id, kind: kind, x0: x0, x1: x1, z0: z0, z1: z1, h: h, solid: true};
      for (var k in extra || {}) b[k] = extra[k];
      W.furniture.push(b); if (b.solid) W.boxes.push(b); return b;
    }
    function obj(id, kind, name, x, z, ux, uz, extra) {
      var o = {id: id, kind: kind, name: name, x: x, z: z, use: {x: ux, z: uz}};
      for (var k in extra || {}) o[k] = extra[k];
      o.face = yawTo(o.use, o); W.objects.push(o); return o;
    }
    // Wohnzimmer: Bücherregale an der Westwand, Fernseher an der Südwand, Sofa davor, Körbchen, Ball.
    furn("regal", "regal", -8.9, -8.5, -128.4, -122.4, 2.1);
    furn("tv", "tv", -2.9, -0.3, -128.9, -128.45, 0.5);
    furn("sofa", "sofa", -2.8, -0.4, -124.5, -123.6, 0.85);
    furn("teppich", "teppich", -3.2, 0, -127.8, -125.2, 0.01, {solid: false});
    furn("lampe", "stehlampe", -3.55, -3.25, -128.8, -128.5, 1.9);
    furn("sessel", "sessel", -6.4, -5.4, -124.6, -123.6, 0.8);
    obj("regal", "regal", "Bücherregal", -8.5, -125.4, -7.7, -125.4);
    obj("sofa", "sofa", "Sofa", -1.6, -124.05, -1.6, -125.2, {seat: {x: -1.6, z: -124.1, yaw: Math.PI}});
    obj("tv", "tv", "Fernseher", -1.6, -128.7, -1.6, -127.6);
    obj("koerbchen", "koerbchen", "Körbchen", -6.6, -127.9, -6.6, -126.6, {bed: true});
    // Küche
    furn("theke", "theke", 8.35, 8.95, -128.8, -122.6, 0.92);
    furn("kuehlschrank", "kuehlschrank", 8.2, 8.95, -122.4, -121.25, 1.9);
    furn("tisch", "tisch", 4.8, 6.4, -126.4, -124.6, 0.76);
    obj("kuehlschrank", "kuehlschrank", "Kühlschrank", 8.55, -121.8, 7.6, -121.9);
    obj("theke", "theke", "Küchenzeile", 8.6, -125.7, 7.8, -125.7);
    obj("napf", "napf", "Futternapf", 4.0, -128.45, 4.0, -127.6);
    obj("wassernapf", "wassernapf", "Wassernapf", 4.7, -128.45, 4.7, -127.6);
    obj("eimer_k", "eimer", "Mülleimer", 7.6, -128.6, 7.6, -127.8);
    furn("eimer_k", "eimer", 7.4, 7.8, -128.85, -128.35, 0.6);
    // Schlafzimmer
    furn("bett", "bett", -8.9, -6.8, -136.9, -134.6, 0.55);
    furn("schrank", "schrank", -1.4, 0.85, -136.9, -136.3, 2.1);
    furn("nachttisch", "nachttisch", -6.7, -6.2, -136.9, -136.4, 0.5);
    obj("bett", "bett", "Bett", -7.85, -135.7, -6.2, -135.2, {lie: {x: -7.85, z: -135.9, yaw: 0}});
    // Bad
    furn("wanne", "wanne", 7.0, 8.9, -136.9, -136.0, 0.58);
    furn("klo", "klo", 1.6, 2.1, -136.95, -136.3, 0.45);
    furn("waschbecken", "waschbecken", 3.6, 4.4, -136.95, -136.5, 0.85);
    obj("wanne", "wanne", "Badewanne", 7.95, -136.45, 7.95, -135.3, {tub: {x: 7.95, z: -136.45}});
    // Garten: Beete und ein Baum, Mülltonne am Tor.
    obj("eimer_g", "eimer", "Mülltonne", 3.0, -111.2, 2.2, -111.8);
    furn("eimer_g", "eimer", 2.7, 3.3, -111.5, -110.9, 1.0);
    obj("tuer", "tuer", "Haustür", -0.4, -121, -0.4, -119.8);
    W.colliders.push({x: -9, z: -115, r: 0.4, kind: "baum"});
    W.trees.push({x: -9, z: -115, s: 1.2, type: "laub", rot: 1, kind: "baum", garden: true});
    W.spots.push({x: -9, z: -115, r: 0.4, kind: "baum"}, {x: 10, z: -116, r: 0.4, kind: "busch"});
    W.bushes.push({x: 10, z: -116, s: 0.9, rot: 0, kind: "busch"});
    W.colliders.push({x: 10, z: -116, r: 0.6, kind: "busch"});

    // Park: Rundweg, Zugang vom Tor, Querweg von West nach Ost.
    var loop = [];
    function loopPt(a) { var rr = 1 + 0.06 * Math.sin(3 * a + 1) + 0.04 * Math.sin(5 * a); return {x: Math.sin(a) * 46 * rr, z: Math.cos(a) * 38 * rr}; }
    for (var i = 0; i <= 72; i++) loop.push(loopPt(i / 72 * TAU));
    var south = loopPt(Math.PI), entry = [];
    for (i = 0; i <= 16; i++) { var t = i / 16; entry.push({x: 3.5 * Math.sin(t * TAU) * (1 - t) * t * 2, z: lerp(-110, south.z, t)}); }
    var cross = [];
    for (i = 0; i <= 30; i++) { t = i / 30; cross.push({x: lerp(-108, 108, t), z: 14 - 18 * t + 6 * Math.sin(t * Math.PI * 3)}); }
    var garden = [{x: -0.4, z: -121}, {x: -0.2, z: -116}, {x: 0, z: -110}];
    W.paths.push({id: "rund", pts: loop, w: 2.6}, {id: "tor", pts: entry, w: 2.4}, {id: "quer", pts: cross, w: 2.2}, {id: "garten", pts: garden, w: 1.4, garden: true});
    W.loop = loop;
    function free(x, z, r) {
      if (Math.abs(x) > W.half - 2 || z > W.half - 2 || z < -107) return false;
      if (Math.hypot(x - W.pond.x, z - W.pond.z) < W.pond.r + r) return false;
      for (var k = 0; k < W.colliders.length; k++) { var c = W.colliders[k]; if (Math.hypot(x - c.x, z - c.z) < c.r + r) return false; }
      return true;
    }
    function add(list, o, r, sniff) { list.push(o); if (r) W.colliders.push({x: o.x, z: o.z, r: r, kind: o.kind}); if (sniff) W.spots.push({x: o.x, z: o.z, r: r || 0.3, kind: o.kind}); return o; }
    function normal(pts, j) { var a = pts[Math.max(0, j - 1)], b = pts[Math.min(pts.length - 1, j + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1; return {x: dz / l, z: -dx / l}; }
    [6, 18, 30, 42, 54, 66].forEach(function (j, n) {
      var p = loop[j], nn = normal(loop, j), out = (p.x * nn.x + p.z * nn.z) > 0 ? 1 : -1;
      var b = {x: p.x + nn.x * out * 2.5, z: p.z + nn.z * out * 2.5, kind: "bank"};
      b.yaw = Math.atan2(-nn.x * out, -nn.z * out);
      add(W.benches, b, 0.9, true);
      var tx = nn.z, tz = -nn.x, bin = add(W.bins, {x: b.x + tx * 1.7, z: b.z - tz * 1.7, kind: "eimer"}, 0.3, true);
      obj("eimer_p" + n, "eimer", "Mülleimer", bin.x, bin.z, bin.x - nn.x * out * 1.0, bin.z - nn.z * out * 1.0);
      obj("bank" + n, "bank", "Parkbank", b.x, b.z, b.x - nn.x * out * 1.1, b.z - nn.z * out * 1.1);
    });
    for (i = 3; i < 72; i += 9) { var n2 = normal(loop, i), p2 = loop[i], o2 = (p2.x * n2.x + p2.z * n2.z) > 0 ? -1 : 1; add(W.lamps, {x: p2.x + n2.x * o2 * 1.9, z: p2.z + n2.z * o2 * 1.9, kind: "laterne"}, 0.15, true); }
    for (i = 3; i < 16; i += 3) { var e = entry[i]; add(W.lamps, {x: e.x + (i % 2 ? 2 : -2), z: e.z, kind: "laterne"}, 0.15, true); }
    function tree(x, z, edge) {
      var s = 0.8 + R() * 0.6, kinds = ["laub", "laub", "laub", "nadel", "birke"], k = kinds[Math.floor(R() * kinds.length)];
      if (pathDist(W, x, z) < 3.4 + s || !free(x, z, 2.2 * s)) return;
      add(W.trees, {x: x, z: z, s: s, type: k, edge: !!edge, rot: R() * TAU, kind: "baum"}, 0.32 * s, true);
    }
    for (var e2 = -104; e2 <= 104; e2 += 7) {
      tree(e2 + R() * 3, 105 + R() * 3, true); tree(-105 - R() * 3, e2 + R() * 3, true); tree(105 + R() * 3, e2 + R() * 3, true);
      if (Math.abs(e2) > 16) tree(e2 + R() * 3, -105 - R() * 1.5, true);
    }
    for (i = 0; i < 700 && W.trees.length < 210; i++) tree((R() * 2 - 1) * 100, (R() * 2 - 1) * 100, false);
    for (i = 0; i < 400 && W.bushes.length < 90; i++) {
      var bx = (R() * 2 - 1) * 100, bz = (R() * 2 - 1) * 100, bs = 0.6 + R() * 0.7;
      if (pathDist(W, bx, bz) > 2.6 + bs && free(bx, bz, bs + 0.4)) add(W.bushes, {x: bx, z: bz, s: bs, rot: R() * TAU, kind: "busch"}, 0.75 * bs, true);
    }
    // Matschpfützen neben den Wegen: wer durchläuft, wird dreckig.
    for (i = 0; i < 60 && W.mud.length < 7; i++) {
      var pj = loop[Math.floor(R() * 72)], nm = normal(loop, 3), mx = pj.x + (R() * 2 - 1) * 4, mz = pj.z + (R() * 2 - 1) * 4;
      if (pathDist(W, mx, mz) > 1.8 && free(mx, mz, 1.2)) W.mud.push({x: mx, z: mz, r: 0.9 + R() * 0.5});
      void nm;
    }
    // Stöcke: zwei gleich hinter dem Tor, der Rest unter Bäumen.
    var sid = 0;
    function stick(x, z) { if (free(x, z, 0.3) && Math.abs(x) < 104 && z < 104) W.sticks.push({id: "s" + (sid++), kind: "stock", x: x, y: 0.03, z: z, yaw: R() * TAU, len: 0.55 + R() * 0.25}); }
    stick(2.6, -102); stick(-3, -93);
    for (i = 0; i < 80 && W.sticks.length < 18; i++) { var tr = W.trees[Math.floor(R() * W.trees.length)]; if (tr.edge || tr.garden) continue; var a = R() * TAU; stick(tr.x + Math.sin(a) * 2, tr.z + Math.cos(a) * 2); }
    for (i = 0; i < 900; i++) {
      var fx = (R() * 2 - 1) * 104, fz = (R() * 2 - 1) * 104;
      if (fz > -105 && pathDist(W, fx, fz) > 2 && Math.hypot(fx - W.pond.x, fz - W.pond.z) > W.pond.r + 1) W.flowers.push({x: fx, z: fz, c: Math.floor(R() * 4)});
    }
    W.start = {x: -6.2, z: -134.2, yaw: Math.PI / 2};
    W.door = {x: -0.4, z: -122.0};
    return W;
  }

  /* ---------- Kollision ---------- */
  function pushBox(e, rad, b) {
    var cx = clamp(e.x, b.x0, b.x1), cz = clamp(e.z, b.z0, b.z1), dx = e.x - cx, dz = e.z - cz, d = Math.hypot(dx, dz);
    if (d >= rad) return false;
    if (d > 1e-6) { e.x = cx + dx / d * rad; e.z = cz + dz / d * rad; return true; }
    // Mittelpunkt im Kasten: auf dem kürzesten Weg hinaus.
    var l = e.x - b.x0, r = b.x1 - e.x, t = e.z - b.z0, u = b.z1 - e.z, m = Math.min(l, r, t, u);
    if (m === l) e.x = b.x0 - rad; else if (m === r) e.x = b.x1 + rad; else if (m === t) e.z = b.z0 - rad; else e.z = b.z1 + rad;
    return true;
  }
  function collide(e, rad, W) {
    for (var i = 0; i < W.colliders.length; i++) {
      var c = W.colliders[i], dx = e.x - c.x, dz = e.z - c.z;
      if (Math.abs(dx) > c.r + rad || Math.abs(dz) > c.r + rad) continue;
      var d = Math.hypot(dx, dz), m = c.r + rad;
      if (d < m) { if (d < 1e-6) { dx = 1; dz = 0; d = 1; } e.x = c.x + dx / d * m; e.z = c.z + dz / d * m; }
    }
    for (i = 0; i < W.boxes.length; i++) { var b = W.boxes[i]; if (e.x > b.x0 - rad - 0.01 && e.x < b.x1 + rad + 0.01 && e.z > b.z0 - rad - 0.01 && e.z < b.z1 + rad + 0.01) pushBox(e, rad, b); }
    var p = W.pond, pd = Math.hypot(e.x - p.x, e.z - p.z), pm = p.r + rad;
    if (pd < pm) { if (pd < 1e-6) pd = 1e-6; e.x = p.x + (e.x - p.x) / pd * pm; e.z = p.z + (e.z - p.z) / pd * pm; }
    e.x = clamp(e.x, -108.5, 108.5); e.z = clamp(e.z, -139.5, 108.5);
  }

  /* ---------- Wegfindung: Raster mit 0,5 m, A* mit Glättung ---------- */
  var NAV = {cs: 0.5, x0: -110, z0: -141, nx: 440, nz: 504};
  function buildNav(W, rad) {
    rad = rad == null ? 0.3 : rad;
    var cs = NAV.cs, nx = NAV.nx, nz = NAV.nz, g = new Uint8Array(nx * nz);
    function mark(x0, x1, z0, z1, test) {
      var i0 = Math.max(0, Math.floor((x0 - NAV.x0) / cs)), i1 = Math.min(nx - 1, Math.floor((x1 - NAV.x0) / cs));
      var j0 = Math.max(0, Math.floor((z0 - NAV.z0) / cs)), j1 = Math.min(nz - 1, Math.floor((z1 - NAV.z0) / cs));
      for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) { var cx = NAV.x0 + (i + 0.5) * cs, cz = NAV.z0 + (j + 0.5) * cs; if (test(cx, cz)) g[j * nx + i] = 1; }
    }
    W.colliders.forEach(function (c) { var r = c.r + rad; mark(c.x - r, c.x + r, c.z - r, c.z + r, function (x, z) { return Math.hypot(x - c.x, z - c.z) < r; }); });
    W.boxes.forEach(function (b) { mark(b.x0 - rad, b.x1 + rad, b.z0 - rad, b.z1 + rad, function (x, z) { return Math.hypot(x - clamp(x, b.x0, b.x1), z - clamp(z, b.z0, b.z1)) < rad; }); });
    var p = W.pond, pr = p.r + rad; mark(p.x - pr, p.x + pr, p.z - pr, p.z + pr, function (x, z) { return Math.hypot(x - p.x, z - p.z) < pr; });
    // Rand
    for (var j = 0; j < nz; j++) for (var i = 0; i < nx; i++) { var cx = NAV.x0 + (i + 0.5) * cs, cz = NAV.z0 + (j + 0.5) * cs; if (Math.abs(cx) > 108.5 || cz > 108.5 || cz < -139.5) g[j * nx + i] = 1; }
    return {g: g, nx: nx, nz: nz, gs: new Float32Array(nx * nz), came: new Int32Array(nx * nz), seen: new Uint32Array(nx * nz), gen: 0};
  }
  function cellOf(x, z) { return {i: Math.floor((x - NAV.x0) / NAV.cs), j: Math.floor((z - NAV.z0) / NAV.cs)}; }
  function blocked(N, x, z) { var c = cellOf(x, z); if (c.i < 0 || c.j < 0 || c.i >= N.nx || c.j >= N.nz) return true; return N.g[c.j * N.nx + c.i] === 1; }
  function nearestFree(N, i, j) {
    if (i >= 0 && j >= 0 && i < N.nx && j < N.nz && !N.g[j * N.nx + i]) return j * N.nx + i;
    for (var r = 1; r < 12; r++) for (var dj = -r; dj <= r; dj++) for (var di = -r; di <= r; di++) {
      if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
      var a = i + di, b = j + dj; if (a >= 0 && b >= 0 && a < N.nx && b < N.nz && !N.g[b * N.nx + a]) return b * N.nx + a;
    }
    return -1;
  }
  function los(N, ax, az, bx, bz) {
    var d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / 0.25);
    for (var k = 1; k < n; k++) { var t = k / n; if (blocked(N, ax + (bx - ax) * t, az + (bz - az) * t)) return false; }
    return true;
  }
  function findPath(N, sx, sz, tx, tz) {
    var s = cellOf(sx, sz), t = cellOf(tx, tz), si = nearestFree(N, s.i, s.j), ti = nearestFree(N, t.i, t.j);
    if (si < 0 || ti < 0) return null;
    var nx = N.nx, gen = ++N.gen, gs = N.gs, came = N.came, seen = N.seen, tI = ti % nx, tJ = Math.floor(ti / nx);
    var heap = [], fs = [];
    function push(i, f) { heap.push(i); fs.push(f); var k = heap.length - 1; while (k > 0) { var p = (k - 1) >> 1; if (fs[p] <= fs[k]) break; var a = heap[p]; heap[p] = heap[k]; heap[k] = a; var b = fs[p]; fs[p] = fs[k]; fs[k] = b; k = p; } }
    function pop() {
      var top = heap[0], li = heap.pop(), lf = fs.pop();
      if (heap.length) { heap[0] = li; fs[0] = lf; var k = 0; for (;;) { var l = 2 * k + 1, r = l + 1, m = k; if (l < heap.length && fs[l] < fs[m]) m = l; if (r < heap.length && fs[r] < fs[m]) m = r; if (m === k) break; var a = heap[m]; heap[m] = heap[k]; heap[k] = a; var b = fs[m]; fs[m] = fs[k]; fs[k] = b; k = m; } }
      return top;
    }
    function h(i) { var dx = Math.abs(i % nx - tI), dz = Math.abs(Math.floor(i / nx) - tJ); return (dx + dz) + (Math.SQRT2 - 2) * Math.min(dx, dz); }
    seen[si] = gen; gs[si] = 0; came[si] = -1; push(si, h(si));
    var found = false, steps = 0;
    while (heap.length && steps < 120000) {
      var c = pop(); steps++;
      if (c === ti) { found = true; break; }
      var ci = c % nx, cj = Math.floor(c / nx), gc = gs[c];
      for (var dj = -1; dj <= 1; dj++) for (var di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        var a = ci + di, b = cj + dj; if (a < 0 || b < 0 || a >= nx || b >= N.nz) continue;
        var ni = b * nx + a; if (N.g[ni]) continue;
        if (di && dj && (N.g[cj * nx + a] || N.g[b * nx + ci])) continue;
        var ng = gc + (di && dj ? Math.SQRT2 : 1);
        if (seen[ni] === gen && gs[ni] <= ng) continue;
        seen[ni] = gen; gs[ni] = ng; came[ni] = c; push(ni, ng + h(ni));
      }
    }
    if (!found) return null;
    var cells = []; for (var k = ti; k >= 0; k = came[k]) cells.push(k);
    cells.reverse();
    var pts = cells.map(function (q) { return {x: NAV.x0 + (q % nx + 0.5) * NAV.cs, z: NAV.z0 + (Math.floor(q / nx) + 0.5) * NAV.cs}; });
    pts[pts.length - 1] = blocked(N, tx, tz) ? pts[pts.length - 1] : {x: tx, z: tz};
    // Glätten: Punkte überspringen, solange freie Sicht besteht.
    var out = [{x: sx, z: sz}], cur = out[0], idx = 0;
    while (idx < pts.length - 1) {
      var far = idx + 1;
      for (var q = pts.length - 1; q > idx + 1; q--) if (los(N, cur.x, cur.z, pts[q].x, pts[q].z)) { far = q; break; }
      cur = pts[far]; out.push(cur); idx = far;
    }
    if (out.length === 1) out.push(pts[pts.length - 1]);
    out.shift();
    return out;
  }

  /* ---------- Gangarten ---------- */
  // Beine: links vorn, rechts vorn, links hinten, rechts hinten.
  var GAITS = {
    stand: {stride: 1, duty: 1, off: [0, 0, 0, 0]},
    walk: {stride: 0.5, duty: 0.62, off: [0.25, 0.75, 0, 0.5]},
    trot: {stride: 0.8, duty: 0.5, off: [0, 0.5, 0.5, 0]},
    gallop: {stride: 1.45, duty: 0.38, off: [0.55, 0.65, 0, 0.1]}
  };
  function pickGait(speed) { return speed < 0.08 ? "stand" : speed < 1.25 ? "walk" : speed < 3.3 ? "trot" : "gallop"; }
  // Pro Bein: Schwung s (-1 hinten bis 1 vorn) und Anheben l (0 bis 1).
  function legPose(gait, phase, leg) {
    var g = GAITS[gait] || GAITS.stand;
    if (gait === "stand") return {s: 0, l: 0};
    var p = ((phase + g.off[leg]) % 1 + 1) % 1;
    if (p < g.duty) return {s: 1 - 2 * (p / g.duty), l: 0};
    var q = (p - g.duty) / (1 - g.duty), sm = q * q * (3 - 2 * q);
    return {s: -1 + 2 * sm, l: Math.sin(Math.PI * q)};
  }

  /* ---------- Bedürfnisse ---------- */
  // Pro Spielminute; Werte 0 (dringend) bis 100 (alles gut).
  var DOG_NEEDS = [
    {id: "hunger", name: "Hunger", icon: "🍖", decay: 0.1},
    {id: "durst", name: "Durst", icon: "💧", decay: 0.13},
    {id: "blase", name: "Gassi", icon: "🌳", decay: 0.12},
    {id: "energie", name: "Energie", icon: "💤", decay: 0.07},
    {id: "spass", name: "Spaß", icon: "🎾", decay: 0.09},
    {id: "liebe", name: "Zuneigung", icon: "❤️", decay: 0.07},
    {id: "sauber", name: "Sauberkeit", icon: "🛁", decay: 0.02}
  ];
  var ME_NEEDS = [
    {id: "hunger", name: "Hunger", icon: "🍽️", decay: 0.08},
    {id: "energie", name: "Energie", icon: "⚡", decay: 0.06},
    {id: "spass", name: "Spaß", icon: "😊", decay: 0.06}
  ];
  function mood(n) { return (n.hunger * 1.2 + n.durst + n.blase * 1.2 + n.energie * 0.8 + n.spass + n.liebe * 1.2 + n.sauber * 0.6) / 7; }

  /* ---------- Aufgaben des Tages ---------- */
  var TASKS = {
    morgenrunde: {text: "Morgenrunde: {name} macht im Park sein Geschäft", until: 600},
    fruehstueck: {text: "Frühstück: Napf füllen", until: 600},
    wasser: {text: "Frisches Wasser hinstellen"},
    abendrunde: {text: "Abendrunde: {name} macht im Park sein Geschäft", from: 1020},
    abendessen: {text: "Abendessen: Napf füllen", from: 1020},
    leine: {text: "Häng {name} an die Leine"},
    haufen: {text: "Heb einen Haufen auf und wirf ihn in einen Mülleimer"},
    stock: {text: "Wirf im Park einen Stock, {name} soll ihn 3× bringen", need: 3},
    spielen: {text: "Spiel drinnen Ball: 2× werfen und bringen lassen", need: 2},
    sitz: {text: "Lass {name} Sitz machen"},
    platz: {text: "Lass {name} Platz machen"},
    pfote: {text: "Lass dir von {name} die Pfote geben"},
    kombi: {text: "Erst Sitz, dann Platz, dann Pfote", need: 3},
    komm: {text: "Ruf {name} aus mindestens 12 Metern zu dir"},
    teich: {text: "Geh mit {name} zum Teich"},
    bank: {text: "Mach im Park 5 Sekunden Pause an einer Bank", need: 5, unit: "s"},
    streicheln: {text: "Streichle {name} dreimal", need: 3},
    baden: {text: "Bade {name}"},
    lesen: {text: "Lies ein Buch aus dem Regal"},
    gruss: {text: "Lass die beiden Hunde sich beschnuppern"}
  };
  function makeTasks(day, seed, opts) {
    opts = opts || {};
    var R = rng((seed || 1) * 31 + day * 977), pool = ["haufen", "stock", "spielen", "sitz", "platz", "pfote", "kombi", "komm", "teich", "bank", "streicheln", "baden", "lesen"], pick = [];
    if (day === 1) pick.push("leine");
    while (pick.length < (day === 1 ? 4 : 3)) {
      var id = pool.splice(Math.floor(R() * pool.length), 1)[0];
      if (id === "kombi" && pick.some(function (x) { return x === "sitz" || x === "platz" || x === "pfote"; })) continue;
      if ((id === "sitz" || id === "platz" || id === "pfote") && pick.indexOf("kombi") >= 0) continue;
      pick.push(id);
    }
    var ids = ["morgenrunde", "fruehstueck", "wasser"].concat(pick, opts.multi ? ["gruss"] : [], ["abendrunde", "abendessen"]);
    return ids.map(function (k) { var d = TASKS[k]; return {id: k, text: d.text, need: d.need || 1, unit: d.unit || "", from: d.from, until: d.until, have: 0, done: false, failed: false}; });
  }

  /* ---------- Simulation ---------- */
  function Sim(opts) {
    opts = opts || {};
    this.W = opts.world || buildWorld(7);
    this.N = opts.nav || buildNav(this.W, 0.3);
    this.R = opts.rand || Math.random;
    this.seed = opts.seed || 1;
    this.multi = !!opts.multi;
    this.name = opts.name || "Hund";
    var s = this.W.start, kb = this.obj("koerbchen");
    this.p = {x: s.x, z: s.z, yaw: s.yaw, speed: 0, phase: 0, meters: 0, still: 0, holding: null, bags: 0, path: null, goal: null, act: null, pose: "stand", held: false};
    this.d = {x: kb.x, z: kb.z + 0.1, yaw: Math.PI * 0.5, speed: 0, vel: 0, phase: 0, gait: "stand", gaitBlend: 0, mode: "sleep", timer: 30, leash: false, taut: 0,
      pose: {sit: 0, down: 0, paw: 0, sniff: 0, squat: 0, pee: 0, sleep: 1, shake: 0, beg: 0}, wag: 0.2, wagPhase: 0, look: null, item: null, darm: 1, toPoop: 50, meters: 0,
      outMeters: 0, path: null, pathT: 0, pending: null, delay: 0, comeFrom: 0, mudCool: 0, bubble: null, think: 0};
    this.t = 7 * 60; this.day = 1; this.speed = 1; this.sleeping = false;
    this.need = {hunger: 75, durst: 70, blase: 45, energie: 95, spass: 70, liebe: 80, sauber: 90};
    this.me = {hunger: 65, energie: 95, spass: 70};
    this.bowl = {food: 0, water: 0.35};
    this.items = this.W.sticks.map(function (x) { return Object.assign({}, x, {state: "ground"}); });
    this.items.push({id: "ball", kind: "ball", x: -1.2, y: 0.06, z: -126.3, state: "ground", yaw: 0});
    this.poops = []; this.puddles = []; this.uid = 0;
    this.tasks = makeTasks(1, this.seed, {multi: this.multi});
    this.events = []; this.moodSum = 0; this.moodN = 0; this.history = [];
    this.stats = {meters: 0, walks: 0, fetched: 0, days: 0};
    if (opts.save) this.load(opts.save);
  }
  var S = Sim.prototype;
  S.obj = function (id) { for (var i = 0; i < this.W.objects.length; i++) if (this.W.objects[i].id === id) return this.W.objects[i]; return null; };
  S.emit = function (type, extra) { var e = {type: type}; for (var k in extra || {}) e[k] = extra[k]; this.events.push(e); return e; };
  S.say = function (text) { this.emit("say", {text: text}); };
  S.hour = function () { return (this.t % 1440) / 60; };
  S.night = function () { var h = this.hour(); return h >= 22 || h < 6; };
  S.text = function (s) { return String(s).replace(/\{name\}/g, this.name); };

  // Direkte Steuerung: {mx, mz} ist die gewünschte Laufrichtung in der Welt (Länge bis 1), run rennt. Bricht Wege und Aktionen ab.
  S.stepPlayer = function (inp, dt) {
    var p = this.p, W = this.W, mag = Math.min(1, Math.hypot(inp.mx || 0, inp.mz || 0)), manual = mag > 0.08;
    if (manual && (p.path || p.act || p.goal)) this.cancel();
    var target = 0, ox = p.x, oz = p.z;
    if (p.act) { p.speed = 0; }
    else if (manual) {
      var my = Math.atan2(inp.mx, inp.mz), df = angDiff(p.yaw, my);
      p.yaw += clamp(df, -1, 1) * Math.min(1, 9 * dt);
      target = mag * (inp.run ? 3.6 : 1.55) * clamp(Math.cos(df), 0.1, 1);
      p.speed = approach(p.speed, target, (target > p.speed ? 4 : 7) * dt);
    } else if (p.path) {
      var wp = p.path[0], dd = dist(p, wp), last = p.path.length === 1;
      if (dd < (last ? 0.12 : 0.35)) { p.path.shift(); if (!p.path.length) { p.path = null; this.arrive(); } }
      else {
        var ty = yawTo(p, wp); p.yaw += clamp(angDiff(p.yaw, ty), -1, 1) * Math.min(1, 10 * dt);
        target = (p.runPath ? 3.6 : 1.55) * clamp(Math.cos(angDiff(p.yaw, ty)), 0.2, 1);
        if (last) target = Math.min(target, dd * 3 + 0.2);
        p.speed = approach(p.speed, target, 5 * dt);
      }
    } else p.speed = approach(p.speed, 0, 6 * dt);
    if (!p.path && p.goal && !p.act) this.arrive();
    var v = fwd(p.yaw);
    p.x += v.x * p.speed * dt; p.z += v.z * p.speed * dt;
    if (!p.act) collide(p, 0.3, W);
    var moved = Math.hypot(p.x - ox, p.z - oz);
    p.meters += moved; this.stats.meters += moved;
    p.phase = (p.phase + moved / 1.5) % 1;
    p.still = moved < 0.05 * dt ? p.still + dt : 0;
    p.moving = moved > 0.1 * dt;
    if (p.act && p.act.face != null) p.yaw += angDiff(p.yaw, p.act.face) * Math.min(1, 8 * dt);
    return moved;
  };
  S.walkTo = function (x, z, goal) {
    var p = this.p; this.cancel();
    var path = findPath(this.N, p.x, p.z, x, z);
    if (!path) { this.say("Da kommst du nicht hin."); return false; }
    var len = 0, prev = p; path.forEach(function (q) { len += dist(prev, q); prev = q; });
    p.path = path; p.runPath = len > 30; p.goal = goal || null;
    if (!path.length) this.arrive();
    return true;
  };
  S.cancel = function () {
    var p = this.p;
    if (p.act && p.act.id === "baden" && this.d.mode === "bath") this.setDog("idle", 1);
    if (p.act && p.act.id === "schlafen") { this.sleeping = false; }
    p.path = null; p.goal = null; p.act = null; p.pose = "stand";
  };

  /* ---------- Aktionen ---------- */
  var ACTS = {
    fuettern: {label: "Futter einfüllen", dur: 2},
    wasser: {label: "Frisches Wasser einfüllen", dur: 2},
    essen: {label: "Etwas essen", dur: 20, me: {hunger: 3}},
    kochen: {label: "Kochen und essen", dur: 45, me: {hunger: 2, spass: 0.4}},
    fernsehen: {label: "Fernsehen", dur: 45, me: {spass: 1.3, energie: 0.05}, pose: "sit"},
    ausruhen: {label: "Ausruhen", dur: 30, me: {energie: 0.5}, pose: "sit"},
    lesen: {label: "Ein Buch lesen", dur: 40, me: {spass: 1.1}, pose: "read"},
    schlafen: {label: "Schlafen gehen", pose: "lie"},
    nickerchen: {label: "Nickerchen (1 Std.)", dur: 60, me: {energie: 0.6}, pose: "lie"},
    baden: {label: "{name} baden", dur: 15},
    koerbchen: {label: "{name} ins Körbchen schicken", dur: 0.3},
    aufwischen: {label: "Pfütze aufwischen", dur: 4},
    aufheben: {label: "Haufen in einen Beutel", dur: 1},
    wegwerfen: {label: "Beutel wegwerfen", dur: 1},
    nehmen: {label: "Aufheben", dur: 0.3},
    streicheln: {label: "Streicheln", dur: 3},
    anleinen: {label: "Anleinen", dur: 0.3},
    bank: {label: "Hinsetzen", dur: 15, me: {energie: 0.3, spass: 0.3}, pose: "sit"}
  };
  // Mögliche Aktionen für ein angetipptes Ziel: {type: "obj"|"dog"|"item"|"poop"|"puddle", id}.
  S.actionsFor = function (tg) {
    var self = this, p = this.p, d = this.d, out = [];
    function a(id, label, ok, why) { out.push({id: id, label: self.text(label || ACTS[id].label), ok: ok !== false, why: why || ""}); }
    if (tg.type === "dog") {
      a("streicheln");
      if (!d.leash) a("anleinen", "Anleinen"); else a("ableinen", "Leine ab");
      a("cmd:sitz", "Sitz"); a("cmd:platz", "Platz"); a("cmd:pfote", "Pfote geben"); a("cmd:komm", "Komm!");
      if (inHouse(d)) a("koerbchen");
      return out;
    }
    if (tg.type === "item") { var it = this.item(tg.id); if (it && it.state === "ground") a("nehmen", it.kind === "ball" ? "Ball aufheben" : "Stock aufheben", !p.holding, "Du hältst schon etwas."); return out; }
    if (tg.type === "poop") { a("aufheben"); return out; }
    if (tg.type === "puddle") { a("aufwischen"); return out; }
    var o = this.obj(tg.id); if (!o) return out;
    switch (o.kind) {
      case "napf": a("fuettern", null, this.bowl.food < 0.9, "Der Napf ist noch voll."); break;
      case "wassernapf": a("wasser"); break;
      case "kuehlschrank": a("essen"); break;
      case "theke": a("kochen"); break;
      case "sofa": a("fernsehen"); a("ausruhen"); break;
      case "tv": a("fernsehen"); break;
      case "regal": a("lesen"); break;
      case "bett":
        var h = this.hour(), late = h >= 20 || h < 5;
        a("schlafen", late ? "Schlafen bis 7 Uhr" : "Schlafen (erst ab 20 Uhr)", late && inHouse(d), late ? "Hol erst " + this.name + " ins Haus." : "Es ist noch zu früh.");
        a("nickerchen"); break;
      case "wanne": a("baden", null, inHouse(d), "Hol erst " + this.name + " ins Haus."); break;
      case "koerbchen": a("koerbchen"); break;
      case "eimer": a("wegwerfen", p.bags ? "Beutel wegwerfen (" + p.bags + ")" : "Beutel wegwerfen", p.bags > 0, "Du hast keinen Beutel dabei."); break;
      case "bank": a("bank"); break;
      case "tuer": a("tuer", inHouse(p) ? "Rausgehen" : "Reingehen"); break;
    }
    return out;
  };
  S.item = function (id) { for (var i = 0; i < this.items.length; i++) if (this.items[i].id === id) return this.items[i]; return null; };
  S.targetPos = function (tg) {
    if (tg.type === "dog") return this.d;
    if (tg.type === "item") return this.item(tg.id);
    if (tg.type === "poop") return this.poops.filter(function (q) { return q.id === tg.id; })[0];
    if (tg.type === "puddle") return this.puddles.filter(function (q) { return q.id === tg.id; })[0];
    return this.obj(tg.id);
  };
  // Aktion bestellen: hingehen, dann ausführen. Kommandos wirken sofort.
  S.order = function (actId, tg) {
    var self = this, p = this.p, d = this.d;
    if (actId.indexOf("cmd:") === 0) return this.command(actId.slice(4));
    if (actId === "ableinen") { this.setLeash(false); return true; }
    var pos = this.targetPos(tg); if (!pos) return false;
    var use, face;
    if (actId === "tuer") { var inside = inHouse(p); use = inside ? {x: -0.4, z: -119.6} : {x: -0.4, z: -122.4}; this.walkTo(use.x, use.z, null); return true; }
    if (tg.type === "obj") { use = pos.use; face = pos.face; }
    else { var ang = yawTo(pos, p), r = tg.type === "dog" ? 0.75 : 0.55; use = {x: pos.x + Math.sin(ang) * r, z: pos.z + Math.cos(ang) * r}; face = ang + Math.PI; }
    if (tg.type === "dog" && (actId === "streicheln" || actId === "anleinen")) {
      if (["sleep", "eat", "drink", "bath"].indexOf(d.mode) < 0) { this.setDog("wait", 8); }
    }
    if (actId === "koerbchen") { this.sendToBed(); if (tg.type === "dog") return true; }
    if (actId === "baden") { this.setDog("toBath", 30); }
    var goal = {act: actId, tg: tg, face: face};
    if (dist(p, use) < 0.4) { p.goal = goal; this.arrive(); return true; }
    return this.walkTo(use.x, use.z, goal) || void self;
  };
  S.arrive = function () {
    var p = this.p, g = p.goal; p.goal = null;
    if (!g) return;
    var A = ACTS[g.act] || {dur: 0.3}, pos = this.targetPos(g.tg);
    if (!pos) return;
    if (g.tg.type === "dog" && dist(p, this.d) > 1.6) { this.order(g.act, g.tg); return; }
    var face = g.tg.type === "obj" ? yawTo(p, pos) : yawTo(p, pos);
    var dur = A.dur;
    if (g.act === "schlafen") { var wake = this.t % 1440 < 420 ? this.t - this.t % 1440 + 420 : this.t - this.t % 1440 + 1440 + 420; dur = wake - this.t; this.sleeping = true; this.sendToBed(); }
    if (g.act === "baden" && this.d.mode !== "bath") { this.setDog("toBath", 30); }
    var o = g.tg.type === "obj" ? pos : null;
    if (o && o.seat && (g.act === "fernsehen" || g.act === "ausruhen")) { p.x = o.seat.x; p.z = o.seat.z; face = o.seat.yaw; }
    if (o && o.lie) { p.x = o.lie.x; p.z = o.lie.z; face = o.lie.yaw; }
    if (o && o.kind === "bank") { face = yawTo(o, p); p.x = o.x + Math.sin(face) * 0.15; p.z = o.z + Math.cos(face) * 0.15; }
    p.act = {id: g.act, tg: g.tg, left: dur, total: dur, face: face, label: this.text(A.label)};
    p.pose = A.pose || (g.act === "streicheln" || g.act === "aufheben" || g.act === "fuettern" || g.act === "wasser" || g.act === "aufwischen" || g.act === "nehmen" || g.act === "anleinen" ? "bend" : "stand");
  };
  S.finish = function (act) {
    var p = this.p, d = this.d, n = this.need, tg = act.tg, self = this;
    p.act = null; p.pose = "stand";
    switch (act.id) {
      case "fuettern": this.bowl.food = 1; n.liebe = Math.min(100, n.liebe + 4); this.emit("fed"); this.task("fed"); break;
      case "wasser": this.bowl.water = 1; this.emit("watered"); this.task("watered"); break;
      case "lesen": this.task("read"); break;
      case "schlafen": this.wake(); break;
      case "baden": n.sauber = 100; n.spass = Math.max(0, n.spass - 6); this.setDog("shake", 1.6); this.emit("bath"); this.task("bath"); break;
      case "aufwischen": this.puddles = this.puddles.filter(function (q) { return q.id !== tg.id; }); this.emit("mopped"); break;
      case "aufheben": this.poops = this.poops.filter(function (q) { return q.id !== tg.id; }); p.bags++; this.emit("bagged"); break;
      case "wegwerfen": var k = p.bags; p.bags = 0; for (var i = 0; i < k; i++) this.task("binned"); this.emit("binned", {n: k}); break;
      case "nehmen": var it = this.item(tg.id); if (it && it.state === "ground" && !p.holding) { it.state = "player"; it.thrown = false; p.holding = it.id; } break;
      case "streicheln": n.liebe = Math.min(100, n.liebe + 18); n.spass = Math.min(100, n.spass + 4); this.emit("pet"); this.task("pet"); if (d.mode === "wait" || d.mode === "petted") this.setDog("sit", 4); break;
      case "anleinen": this.setLeash(true); break;
    }
    void self;
  };
  S.tickAct = function (gm) {
    var p = this.p, a = p.act; if (!a) return;
    var A = ACTS[a.id] || {};
    if (A.me) for (var k in A.me) this.me[k] = clamp(this.me[k] + A.me[k] * gm, 0, 100);
    if (a.id === "schlafen") this.me.energie = clamp(this.me.energie + 0.25 * gm, 0, 100);
    if (a.id === "streicheln") { this.d.mode === "wait" && this.setDog("petted", 2); }
    if (a.id === "baden" && this.d.mode !== "bath") { a.left += gm; if (a.waitDog == null) a.waitDog = 0; a.waitDog += gm; if (a.waitDog > 20) { this.say(this.name + " will nicht in die Wanne."); p.act = null; p.pose = "stand"; this.setDog("idle", 2); } return; }
    a.left -= gm;
    if (a.left <= 0) this.finish(a);
  };

  /* ---------- Kommandos, Leine, Werfen ---------- */
  S.command = function (cmd) {
    var d = this.d, p = this.p, dd = dist(d, p);
    if (d.mode === "sleep") { this.setDog("idle", 2); this.say(this.name + " wacht auf."); }
    if (dd > HEAR) { this.say(this.name + " ist zu weit weg und hört dich nicht."); return false; }
    if (cmd === "pfote" && dd > 1.9) { this.say("Geh näher an " + this.name + " heran, dann gibt es die Pfote."); return false; }
    if (d.mode === "bath" || d.mode === "toBath") return false;
    d.pending = cmd; d.delay = 0.35 + this.R() * 0.25;
    this.emit("cmd", {cmd: cmd});
    return true;
  };
  S.doCommand = function (cmd) {
    var d = this.d, p = this.p, dd = dist(d, p);
    this.dropItem();
    if (cmd === "komm") { if (dd < 1.6) { this.setDog("sit", 6); } else { d.comeFrom = dd; this.setDog("come", 30); } return; }
    if (cmd === "sitz") { this.setDog("sit", 8); d.stayAt = {x: p.x, z: p.z}; return; }
    if (cmd === "platz") { this.setDog("down", 10); d.stayAt = {x: p.x, z: p.z}; return; }
    if (cmd === "pfote") { this.setDog("paw", 2.6); d.pawGiven = false; return; }
  };
  S.setLeash = function (on) {
    var d = this.d, p = this.p;
    if (on && !d.leash && dist(d, p) > 2.2) { this.say("Geh näher an " + this.name + " heran."); return false; }
    d.leash = on;
    if (on) { this.dropItem(); if (["explore", "fetch", "sleep", "eat", "drink"].indexOf(d.mode) >= 0) this.setDog("follow", 3); }
    this.emit(on ? "leashOn" : "leashOff"); if (on) this.task("leashOn");
    return true;
  };
  S.dropItem = function () {
    var d = this.d; if (!d.item) return;
    var it = this.item(d.item), f = fwd(d.yaw);
    if (it) { it.state = "ground"; it.x = d.x + f.x * 0.45; it.z = d.z + f.z * 0.45; it.y = it.kind === "ball" ? 0.06 : 0.03; var c = {x: it.x, z: it.z}; collide(c, 0.1, this.W); it.x = c.x; it.z = c.z; }
    d.item = null;
  };
  // Werfen: Richtung Blick oder auf einen Punkt. Drinnen sanfter.
  S.throwItem = function (tx, tz) {
    var p = this.p, it = this.item(p.holding); if (!it) return false;
    this.cancel();
    if (tx != null) p.yaw = yawTo(p, {x: tx, z: tz});
    var f = fwd(p.yaw), h = {x: p.x + f.x * 0.3, z: p.z + f.z * 0.3}, indoor = inHouse(p);
    var want = tx != null ? clamp(Math.hypot(tx - p.x, tz - p.z), 2, indoor ? 6 : 22) : (indoor ? 4 : 15);
    var vy = indoor ? 2.4 : 4.6, tFlight = (vy + Math.sqrt(vy * vy + 2 * GRAV * 1.4)) / GRAV, vh = want / tFlight;
    it.state = "flying"; it.thrown = true; it.x = h.x; it.y = 1.4; it.z = h.z; it.vx = f.x * vh; it.vy = vy; it.vz = f.z * vh; it.spin = it.kind === "ball" ? 3 : 9; it.pitch = 0; it.yaw = p.yaw + Math.PI / 2;
    p.holding = null; p.pose = "throw"; p.throwT = 0.4;
    this.emit("throw", {kind: it.kind});
    return true;
  };
  S.stepItems = function (dt) {
    var W = this.W;
    this.items.forEach(function (s) {
      if (s.state !== "flying") return;
      var ox = s.x, oz = s.z;
      s.vy -= GRAV * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt; s.pitch = (s.pitch || 0) + s.spin * dt;
      var pd = Math.hypot(s.x - W.pond.x, s.z - W.pond.z);
      if (pd < W.pond.r + 0.3 && s.y < 0.5) { var nx = (s.x - W.pond.x) / pd, nz = (s.z - W.pond.z) / pd, dot = s.vx * nx + s.vz * nz; if (dot < 0) { s.vx -= 2 * dot * nx; s.vz -= 2 * dot * nz; } s.x = W.pond.x + nx * (W.pond.r + 0.3); s.z = W.pond.z + nz * (W.pond.r + 0.3); }
      for (var i = 0; i < W.colliders.length; i++) { var c = W.colliders[i]; if (c.kind === "baum" && s.y < 3 && Math.hypot(s.x - c.x, s.z - c.z) < c.r + 0.1) { s.x = ox; s.z = oz; s.vx *= -0.4; s.vz *= -0.4; } }
      for (i = 0; i < W.boxes.length; i++) {
        var b = W.boxes[i];
        if (s.y < b.h && s.x > b.x0 - 0.05 && s.x < b.x1 + 0.05 && s.z > b.z0 - 0.05 && s.z < b.z1 + 0.05) {
          var inX = ox > b.x0 - 0.05 && ox < b.x1 + 0.05, inZ = oz > b.z0 - 0.05 && oz < b.z1 + 0.05;
          if (!inX) { s.x = ox; s.vx *= -0.45; } else if (!inZ) { s.z = oz; s.vz *= -0.45; } else { s.y = b.h + 0.04; s.vy = Math.abs(s.vy) * 0.3; }
        }
      }
      if (Math.abs(s.x) > 108) { s.x = clamp(s.x, -108, 108); s.vx *= -0.4; }
      if (s.z > 108 || s.z < -139) { s.z = clamp(s.z, -139, 108); s.vz *= -0.4; }
      var floor = s.kind === "ball" ? 0.06 : 0.03;
      if (s.y <= floor) {
        s.y = floor;
        if (Math.abs(s.vy) > (s.kind === "ball" ? 0.8 : 1.5)) { s.vy = -s.vy * (s.kind === "ball" ? 0.55 : 0.3); s.vx *= 0.7; s.vz *= 0.7; s.spin *= 0.6; }
        else { s.vy = 0; var fr = s.kind === "ball" ? 2 : 6; s.vx *= Math.exp(-fr * dt); s.vz *= Math.exp(-fr * dt); if (Math.hypot(s.vx, s.vz) < 0.2) { s.state = "ground"; s.pitch = 0; } }
      }
    });
  };

  /* ---------- Hund ---------- */
  S.setDog = function (mode, timer) { var d = this.d; d.mode = mode; d.timer = timer || 0; d.path = null; if (mode !== "sit" && mode !== "down") d.entered = null; };
  S.sendToBed = function () { var d = this.d; if (inHouse(d)) { this.dropItem(); this.setDog("toBed", 40); } };
  // Laufen zum Ziel: direkt bei freier Sicht, sonst über den Wegfinder.
  S.goTo = function (tx, tz, maxSpeed, stop, dt, extra) {
    var d = this.d, dd = Math.hypot(tx - d.x, tz - d.z), aim = {x: tx, z: tz};
    if (dd > stop + 0.05 && !los(this.N, d.x, d.z, tx, tz) && dd > 0.8) {
      d.pathT -= dt;
      var end = d.path && d.path.length ? d.path[d.path.length - 1] : null;
      if (!d.path || d.pathT <= 0 || (end && Math.hypot(end.x - tx, end.z - tz) > 1.5)) { d.path = findPath(this.N, d.x, d.z, tx, tz); d.pathT = 1.2; }
      while (d.path && d.path.length > 1 && dist(d, d.path[0]) < 0.4) d.path.shift();
      if (d.path && d.path.length) { aim = d.path[0]; if (d.path.length > 1) stop = 0; }
    } else d.path = null;
    return this.steer(aim.x, aim.z, maxSpeed, stop, dt, extra) && dd;
  };
  S.steer = function (tx, tz, maxSpeed, stop, dt, extra) {
    var d = this.d, dx = tx - d.x, dz = tz - d.z, dd = Math.hypot(dx, dz), want = 0;
    if (dd > stop) {
      want = Math.min(maxSpeed, (dd - stop) * 2.4 + (extra || 0));
      var ty = Math.atan2(dx, dz), diff = angDiff(d.yaw, ty);
      d.yaw += clamp(diff, -1, 1) * Math.min(1, (3 + d.speed) * dt) * 1.6;
      want *= clamp(0.3 + 0.7 * Math.cos(diff), 0.15, 1);
    }
    d.speed = approach(d.speed, want, (want > d.speed ? 7 : 9) * dt);
    return Math.max(dd, 1e-3);
  };
  S.face = function (tx, tz, dt) { var d = this.d, ty = Math.atan2(tx - d.x, tz - d.z); d.yaw += clamp(angDiff(d.yaw, ty), -1, 1) * Math.min(1, 4 * dt); };
  S.heel = function () { var p = this.p, f = fwd(p.yaw), r = right(p.yaw); return {x: p.x - r.x * 0.75 + f.x * 0.35, z: p.z - r.z * 0.75 + f.z * 0.35}; };
  S.front = function (dd) { var p = this.p, f = fwd(p.yaw); return {x: p.x + f.x * (dd || 1), z: p.z + f.z * (dd || 1)}; };
  S.hand = function () { var p = this.p, f = fwd(p.yaw), r = right(p.yaw); return {x: p.x + r.x * 0.32 + f.x * 0.15, y: 0.92, z: p.z + r.z * 0.32 + f.z * 0.15}; };
  S.collar = function () { var d = this.d, f = fwd(d.yaw); return {x: d.x + f.x * 0.3, z: d.z + f.z * 0.3}; };

  // Was will der Hund gerade? Wird in freien Momenten aufgerufen.
  S.think = function () {
    var d = this.d, p = this.p, n = this.need, R = this.R, inH = inHouse(d), outside = !inH, self = this;
    d.bubble = null;
    if (this.sleeping && inH) { this.sendToBed(); return; }
    if (outside && n.blase < (inPark(d) ? 85 : 30)) {
      var sp = this.spotNear(d.leash ? LEASH + 1.6 : 10);
      if (sp) { d.spot = sp; d.wantPee = true; this.setDog("sniff", 0); d.sniffT = 1.5 + R() * 1.5; return; }
      if (inPark(d) && (n.blase < 45 || (n.blase < 60 && pathDist(this.W, d.x, d.z) > 1.0))) { this.setDog("pee", 2.4); return; }
    }
    if (outside && d.darm >= 1 && d.toPoop <= 0 && pathDist(this.W, d.x, d.z) > 1.4) { this.setDog("poop", 3.2); this.emit("squat"); return; }
    if (inH && n.blase < 25) { this.setDog("whine", 12); d.bubble = "blase"; return; }
    if (inH && inHouse(p) && n.hunger < 60 && this.bowl.food > 0.05) { this.setDog("eat", 60); return; }
    if (inH && inHouse(p) && n.durst < 60 && this.bowl.water > 0.05) { this.setDog("drink", 60); return; }
    if (inH && (n.energie < 25 || (this.night() && !p.moving)) && !d.leash) { this.setDog("toBed", 40); return; }
    if (inH && n.spass < 45 && !p.holding && !d.leash) {
      var toy = this.items.filter(function (it) { return it.state === "ground" && inHouse(it); })[0];
      if (toy) { d.toy = toy.id; this.setDog("getToy", 25); return; }
    }
    // Ein anderer Hund in der Nähe (zu zweit): hin und beschnuppern.
    var od = (this.others || []).filter(function (o) { return o.dog && dist(o.dog, d) < 7; })[0];
    if (od && (this.t - (d.greetT || -999)) > 20) { d.greetT = this.t; d.spot = {x: od.dog.x, z: od.dog.z, r: 0.35, greet: true}; this.setDog("sniff", 0); d.sniffT = 2.5; return; }
    // Nichts Dringendes: dabei sein, schnüffeln, herumstromern oder sich hinlegen.
    var urgent = DOG_NEEDS.filter(function (k) { return n[k.id] < 35; }).sort(function (a, b) { return n[a.id] - n[b.id]; })[0];
    if (urgent) d.bubble = urgent.id;
    if (d.leash) { this.setDog("follow", 2 + R() * 4); return; }
    if (outside) {
      if (dist(d, p) > 10) { this.setDog("follow", 2); return; }
      if (R() < 0.45) { var s2 = this.spotNear(11); if (s2) { d.spot = s2; this.setDog("sniff", 0); d.sniffT = 2 + R() * 3; return; } }
      if (R() < 0.5) { d.target = this.roam(); this.setDog("explore", 4 + R() * 4); return; }
      this.setDog("follow", 2 + R() * 3); return;
    }
    if (p.moving || dist(d, p) > 4 || roomOf(d) !== roomOf(p)) { this.setDog("follow", 2 + R() * 2); return; }
    if (R() < 0.5) { this.setDog("rest", 8 + R() * 12); return; }
    var fu = this.W.furniture.filter(function (f) { return roomOf({x: (f.x0 + f.x1) / 2, z: (f.z0 + f.z1) / 2}) === roomOf(p); });
    if (fu.length && R() < 0.6) { var f2 = fu[Math.floor(R() * fu.length)]; d.spot = {x: (f2.x0 + f2.x1) / 2, z: (f2.z0 + f2.z1) / 2, r: Math.max(f2.x1 - f2.x0, f2.z1 - f2.z0) / 2}; this.setDog("sniff", 0); d.sniffT = 2 + R() * 2; return; }
    this.setDog("idle", 2 + R() * 3);
    void self;
  };
  S.spotNear = function (radius) {
    var d = this.d, p = this.p, R = this.R, N = this.N;
    var c = this.W.spots.filter(function (s) {
      if (dist(s, p) > radius || dist(s, d) > radius + 2) return false;
      var a = yawTo(s, d), r = s.r + 0.5;
      return los(N, d.x, d.z, s.x + Math.sin(a) * r, s.z + Math.cos(a) * r);
    });
    return c.length ? c[Math.floor(R() * c.length)] : null;
  };
  S.roam = function () {
    var p = this.p, W = this.W, R = this.R;
    for (var i = 0; i < 12; i++) {
      var a = R() * TAU, r = 3 + R() * 8, t = {x: p.x + Math.sin(a) * r, z: p.z + Math.cos(a) * r};
      if (!blocked(this.N, t.x, t.z) && !inHouse(t) && Math.hypot(t.x - W.pond.x, t.z - W.pond.z) > W.pond.r + 1) return t;
    }
    return this.heel();
  };

  S.stepDog = function (dt, gm) {
    var d = this.d, p = this.p, n = this.need, R = this.R, W = this.W, self = this;
    var dp = dist(d, p), pose = {sit: 0, down: 0, paw: 0, sniff: 0, squat: 0, pee: 0, sleep: 0, shake: 0, beg: 0};
    d.look = null; var wagT = 0.45;
    if (d.pending) { d.delay -= dt; if (d.delay <= 0) { var c = d.pending; d.pending = null; this.doCommand(c); } }
    // Geworfenes: frei laufend rennt der Hund hinterher (außer er schläft, frisst oder badet).
    var flying = null; this.items.forEach(function (s) { if (s.thrown && (s.state === "flying" || s.state === "ground")) flying = s; });
    if (flying && !d.leash && !d.item && ["follow", "explore", "sniff", "sit", "down", "idle", "rest", "beg", "wait", "whine"].indexOf(d.mode) >= 0 && dist(d, flying) < HEAR + 10) { this.setDog("fetch", 30); d.fetch = flying.id; this.emit("bark"); }
    d.timer -= dt;
    var free = false;
    switch (d.mode) {
      case "idle": d.speed = approach(d.speed, 0, 8 * dt); if (dp < 5) { d.look = {x: p.x, z: p.z}; } if (d.timer <= 0) free = true; break;
      case "rest": d.speed = approach(d.speed, 0, 8 * dt); pose.down = 1; wagT = 0.15; if (d.timer <= 0 || p.moving && dp > 3) free = true; break;
      case "follow": {
        var target = d.leash || !inHouse(d) ? this.heel() : this.nearPlayer();
        var dh = this.goTo(target.x, target.z, 5.8, d.leash ? 0.25 : 0.9, dt, dist(d, target) < 2.5 ? Math.abs(p.speed) * 0.9 : 0);
        if (d.speed < 0.2 && dh < 1.2) self.face(d.x + Math.sin(p.yaw), d.z + Math.cos(p.yaw), dt);
        if (d.timer <= 0) { d.timer = 1.5; if (!(p.moving && d.leash && R() < 0.6)) free = true; }
        break;
      }
      case "explore": {
        if (!d.target) d.target = this.roam();
        var de = this.goTo(d.target.x, d.target.z, 3.2, 0.4, dt);
        if (de < 0.6 || d.timer <= 0 || dist(d.target, p) > 13) { d.target = null; free = true; }
        break;
      }
      case "sniff": {
        var s = d.spot, ds = s ? this.goTo(s.x, s.z, 3, s.r + 0.45, dt) : 0;
        if (s && ds < s.r + 0.7) {
          d.sniffT -= dt; pose.sniff = 1; this.face(s.x, s.z, dt); wagT = 0.3;
          if (!inHouse(d)) n.spass = Math.min(100, n.spass + 0.6 * dt);
          if (s.greet && !s.done) { s.done = true; n.spass = Math.min(100, n.spass + 10); this.emit("greet"); this.task("greet"); }
          if (d.sniffT <= 0 && d.wantPee && n.blase < 85) { d.wantPee = false; this.setDog("pee", 2.4); break; }
        }
        if (!s || d.sniffT <= 0 || d.taut > 0.8 || (!d.leash && dp > 13)) { d.spot = null; d.wantPee = false; free = true; }
        break;
      }
      case "pee": {
        d.speed = approach(d.speed, 0, 10 * dt); pose.pee = 1; wagT = 0.1;
        if (d.timer <= 0) { n.blase = 100; this.emit("pee", {x: d.x, z: d.z, park: inPark(d)}); this.task("pee", {park: inPark(d)}); free = true; }
        break;
      }
      case "poop": {
        d.speed = approach(d.speed, 0, 10 * dt); pose.squat = 1; wagT = 0.1;
        if (d.timer <= 0) {
          var b = fwd(d.yaw), q = {id: "h" + (++this.uid), x: d.x - b.x * 0.34, z: d.z - b.z * 0.34, inHouse: inHouse(d)};
          this.poops.push(q); d.darm = Math.max(0, d.darm - 1); d.toPoop = 60 + R() * 80;
          this.emit("poop", {x: q.x, z: q.z, park: inPark(d)}); this.task("poop", {park: inPark(d)}); free = true;
        }
        break;
      }
      case "fetch": {
        var st = this.item(d.fetch); wagT = 1;
        if (!st || st.state === "player" || st.state === "dog") { free = true; break; }
        var df = this.goTo(st.x, st.z, inHouse(d) ? 4 : 7.5, 0.3, dt);
        if (df < 0.55 && st.y < 0.25) { st.state = "dog"; d.item = st.id; d.fetchKind = st.kind; st.thrown = false; this.setDog("bring", 30); this.emit("picked"); }
        if (d.timer <= 0) free = true;
        break;
      }
      case "getToy": {
        var toy = this.item(d.toy); wagT = 0.8;
        if (!toy || toy.state !== "ground") { free = true; break; }
        var dt2 = this.goTo(toy.x, toy.z, 3, 0.3, dt);
        if (dt2 < 0.5) { toy.state = "dog"; d.item = toy.id; this.setDog("bringToy", 25); }
        if (d.timer <= 0) free = true;
        break;
      }
      case "bring": case "bringToy": {
        var fp = this.front(0.9); wagT = 1;
        var db = this.goTo(fp.x, fp.z, 6, 0.15, dt);
        if (db < 0.45 || (dp < 1.15 && d.speed < 0.5)) {
          this.face(p.x, p.z, dt);
          var it = this.item(d.item), kind = it && it.kind;
          this.dropItem();
          if (it && !p.holding && dist(it, p) < 1.6) { it.state = "player"; p.holding = it.id; }
          if (d.mode === "bring") { n.spass = Math.min(100, n.spass + 12); this.stats.fetched++; this.emit("fetched", {kind: kind, park: inPark(d)}); this.task("fetched", {kind: kind, park: inPark(d)}); this.setDog("beg", 6); }
          else { this.setDog("beg", 20); d.bubble = "spass"; this.emit("wantsPlay"); }
        }
        if (d.timer <= 0) free = true;
        break;
      }
      case "beg": d.speed = approach(d.speed, 0, 8 * dt); pose.sit = 1; pose.beg = 1; wagT = 1; if (dp < 8) { this.face(p.x, p.z, dt); d.look = {x: p.x, z: p.z}; } if (d.timer <= 0 || dp > 4) free = true; break;
      case "come": {
        var fc = this.front(0.85); wagT = 1;
        var dc = this.goTo(fc.x, fc.z, 7, 0.15, dt);
        if (dc < 0.45) { this.emit("came", {from: d.comeFrom}); this.task("came", {from: d.comeFrom}); this.setDog("sit", 5); d.stayAt = {x: p.x, z: p.z}; }
        if (d.timer <= 0) free = true;
        break;
      }
      case "wait": case "petted": {
        d.speed = approach(d.speed, 0, 10 * dt); pose.sit = 1; wagT = d.mode === "petted" ? 1 : 0.7; this.face(p.x, p.z, dt); d.look = {x: p.x, z: p.z};
        if (d.timer <= 0) free = true;
        break;
      }
      case "sit": case "down": case "paw": {
        d.speed = approach(d.speed, 0, 10 * dt);
        if (dp < 6) { this.face(p.x, p.z, dt); d.look = {x: p.x, z: p.z}; }
        if (d.mode === "sit") pose.sit = 1;
        if (d.mode === "down") pose.down = 1;
        if (d.mode === "paw") {
          pose.sit = 1; wagT = 0.9;
          if (d.timer < 2.1) { pose.paw = 1; if (!d.pawGiven && d.timer < 1.8) { d.pawGiven = true; n.liebe = Math.min(100, n.liebe + 3); this.emit("paw"); this.task("paw"); } }
          if (d.timer <= 0) { this.setDog("sit", 3); d.stayAt = {x: p.x, z: p.z}; }
          break;
        }
        if (d.entered !== d.mode) { d.entered = d.mode; this.emit(d.mode === "sit" ? "sit" : "down"); this.task(d.mode === "sit" ? "sit" : "down"); }
        var moved = d.stayAt ? dist(d.stayAt, p) : 0;
        if (d.timer <= 0 || moved > (d.leash ? 2.5 : 7) || d.taut > 0.3) { d.stayAt = null; free = true; }
        break;
      }
      case "whine": {
        var door = W.door; d.bubble = "blase"; wagT = 0.5;
        var dw = this.goTo(door.x, door.z - 0.4, 3, 0.3, dt);
        if (dw < 0.6) { this.face(door.x, door.z + 3, dt); pose.sit = 1; if (d.timer <= 0) { this.emit("whine"); d.timer = 10; } }
        if (!inHouse(d) || n.blase >= 25 || d.leash) free = true;
        break;
      }
      case "eat": case "drink": {
        var bw = this.obj(d.mode === "eat" ? "napf" : "wassernapf");
        var de2 = this.goTo(bw.x, bw.z + 0.55, 3, 0.15, dt);
        if (de2 < 0.35) {
          this.face(bw.x, bw.z, dt); pose.sniff = 1; wagT = 0.6;
          if (d.mode === "eat") { var take = Math.min(this.bowl.food, 0.04 * gm); this.bowl.food -= take; n.hunger = Math.min(100, n.hunger + take * 75); d.ate = (d.ate || 0) + take; if (this.bowl.food <= 0.001 || n.hunger >= 99.5) { if (d.ate > 0.4) { d.darm = Math.min(2, d.darm + 1); d.toPoop = Math.min(d.toPoop, 40 + R() * 60); } d.ate = 0; this.emit("ate"); free = true; } }
          else { var tk = Math.min(this.bowl.water, 0.05 * gm); this.bowl.water -= tk; n.durst = Math.min(100, n.durst + tk * 110); if (this.bowl.water <= 0.001 || n.durst >= 99.5) { this.emit("drank"); free = true; } }
        }
        if (d.timer <= 0 || !inHouse(d)) free = true;
        break;
      }
      case "toBed": {
        var kb = this.obj("koerbchen");
        var dk = this.goTo(kb.x, kb.z, 2.5, 0.12, dt);
        if (dk < 0.3) this.setDog("sleep", 30);
        if (d.timer <= 0 || !inHouse(d)) free = true;
        break;
      }
      case "sleep": {
        d.speed = approach(d.speed, 0, 8 * dt); pose.down = 1; pose.sleep = 1; wagT = 0;
        n.energie = Math.min(100, n.energie + 0.45 * gm);
        if (d.timer <= 0) { d.timer = 5; if (!this.sleeping && n.energie > 92 && !this.night()) free = true; else if (!this.sleeping && (n.blase < 20 || n.hunger < 35)) free = true; }
        break;
      }
      case "toBath": {
        var tub = this.obj("wanne").tub, dtb = this.goTo(tub.x, tub.z + 1.1, 3, 0.2, dt);
        if (dtb < 0.4) { d.x = tub.x; d.z = tub.z; d.yaw = Math.PI / 2; this.setDog("bath", 999); }
        if (d.timer <= 0) free = true;
        break;
      }
      case "bath": {
        var tb = this.obj("wanne").tub; d.x = tb.x; d.z = tb.z; d.speed = 0; wagT = 0.05; pose.sit = 0.3;
        if ((!p.act || p.act.id !== "baden") && !(p.goal && p.goal.act === "baden")) { this.setDog("shake", 1.4); d.x = tb.x; d.z = tb.z + 0.95; }
        break;
      }
      case "shake": d.speed = 0; pose.shake = 1; if (d.timer <= 0) free = true; break;
      default: free = true;
    }
    if (free) { d.think = 0; this.think(); }
    // Notfall: Blase leer. Drinnen gibt es eine Pfütze.
    if (n.blase <= 0) {
      n.blase = 100;
      if (inHouse(d)) { this.puddles.push({id: "p" + (++this.uid), x: d.x, z: d.z}); this.emit("accident"); }
      else { this.emit("pee", {x: d.x, z: d.z, park: inPark(d)}); this.task("pee", {park: inPark(d)}); }
    }
    // Bewegung und Kollision. In der Wanne steht er fest.
    var f = fwd(d.yaw), ox = d.x, oz = d.z;
    if (d.mode !== "bath") { d.x += f.x * d.speed * dt; d.z += f.z * d.speed * dt; collide(d, 0.22, W); }
    // Leine: der Hund bleibt in Leinenlänge. Beim Geschäft hält er den Menschen fest.
    d.taut = 0; p.held = false;
    if (d.leash) {
      var h = this.hand(), cl = this.collar(), lx = cl.x - h.x, lz = cl.z - h.z, ll = Math.hypot(lx, lz);
      if (ll > LEASH) {
        var over = ll - LEASH;
        if (d.mode === "poop" || d.mode === "pee") { p.x += lx / ll * over; p.z += lz / ll * over; p.speed = Math.min(p.speed, 0.2); p.held = true; collide(p, 0.3, W); }
        else { d.x -= lx / ll * over; d.z -= lz / ll * over; d.taut = over * 10 + 0.5; collide(d, 0.22, W); }
      }
    }
    var moved2 = Math.hypot(d.x - ox, d.z - oz);
    if (moved2 > 1.5) moved2 = 0; // Sprung (Wanne, Neustart)
    d.meters += moved2;
    if (!inHouse(d)) { d.toPoop -= moved2; d.outMeters += moved2; }
    n.energie = Math.max(0, n.energie - moved2 * 0.012);
    var v = moved2 / Math.max(dt, 1e-4);
    d.vel = lerp(d.vel || 0, v, Math.min(1, dt * 10));
    d.gait = pickGait(d.vel);
    d.phase = (d.phase + moved2 / GAITS[d.gait === "stand" ? "walk" : d.gait].stride) % 1;
    d.gaitBlend = approach(d.gaitBlend, d.vel > 0.08 ? 1 : 0, dt * 5);
    // Matsch macht dreckig.
    d.mudCool -= dt;
    if (d.mudCool <= 0) W.mud.forEach(function (m) { if (Math.hypot(d.x - m.x, d.z - m.z) < m.r) { n.sauber = Math.max(0, n.sauber - 25); d.mudCool = 8; self.emit("dirty"); } });
    for (var k in d.pose) d.pose[k] = approach(d.pose[k], pose[k], dt * (k === "paw" ? 5 : k === "shake" ? 8 : 3.5));
    d.wag = approach(d.wag, wagT, dt * 1.5);
    d.wagPhase = (d.wagPhase + dt * (2 + d.wag * 9)) % TAU;
  };
  S.nearPlayer = function () {
    var p = this.p, d = this.d, a = yawTo(p, d), r = 1.3;
    return {x: p.x + Math.sin(a) * r, z: p.z + Math.cos(a) * r};
  };

  /* ---------- Aufgaben ---------- */
  S.bump = function (id, n, abs) {
    var t = this.tasks.filter(function (x) { return x.id === id && !x.done && !x.failed; })[0], tm = this.t % 1440;
    if (!t) return null;
    if (t.from != null && tm < t.from) return null;
    if (t.until != null && tm >= t.until && this.t < 1440) return null;
    t.have = abs ? Math.max(t.have, n) : t.have + n;
    if (t.have >= t.need) { t.have = t.need; t.done = true; this.emit("taskDone", {task: t, text: this.text(t.text)}); return t; }
    return null;
  };
  S.task = function (type, ev) {
    ev = ev || {};
    switch (type) {
      case "leashOn": return this.bump("leine", 1);
      case "pee": case "poop": if (ev.park) return this.bump("morgenrunde", 1) || this.bump("abendrunde", 1); return null;
      case "fed": return this.bump("fruehstueck", 1) || this.bump("abendessen", 1);
      case "watered": return this.bump("wasser", 1);
      case "binned": return this.bump("haufen", 1);
      case "fetched": if (ev.kind === "stock" && ev.park) return this.bump("stock", 1); if (ev.kind === "ball" && !ev.park) return this.bump("spielen", 1); return null;
      case "sit": return this.bump("sitz", 1) || this.kombi(0);
      case "down": return this.bump("platz", 1) || this.kombi(1);
      case "paw": return this.bump("pfote", 1) || this.kombi(2);
      case "came": return ev.from >= 12 ? this.bump("komm", 1) : null;
      case "pet": return this.bump("streicheln", 1);
      case "bath": return this.bump("baden", 1);
      case "read": return this.bump("lesen", 1);
      case "greet": return this.bump("gruss", 1);
    }
    return null;
  };
  S.kombi = function (step) {
    var t = this.tasks.filter(function (x) { return x.id === "kombi" && !x.done; })[0];
    if (!t) return null;
    if (t.have === step) return this.bump("kombi", 1);
    t.have = step === 0 ? 1 : 0;
    if (step === 0) return null;
    return null;
  };
  S.taskTick = function (dt) {
    var p = this.p, d = this.d, W = this.W, tm = this.t % 1440, self = this;
    var pond = W.pond;
    if (Math.hypot(p.x - pond.x, p.z - pond.z) < pond.r + 5 && Math.hypot(d.x - pond.x, d.z - pond.z) < pond.r + 5) this.bump("teich", 1);
    var bt = this.tasks.filter(function (x) { return x.id === "bank" && !x.done; })[0];
    if (bt) { if (p.act && p.act.id === "bank") this.bump("bank", dt); else if (!(p.act && p.act.id === "bank")) bt.have = 0; }
    this.tasks.forEach(function (t) { if (!t.done && !t.failed && t.until != null && tm >= t.until && self.t < 1440) { t.failed = true; self.emit("taskFailed", {task: t, text: self.text(t.text)}); } });
  };

  /* ---------- Uhr, Schlafen, neuer Tag ---------- */
  S.wake = function () {
    var done = this.tasks.filter(function (t) { return t.done; }).length, total = this.tasks.length;
    var m = this.moodN ? this.moodSum / this.moodN : mood(this.need);
    var score = 0.6 * done / total + 0.4 * m / 100, stars = clamp(Math.round(1 + 4 * score), 1, 5);
    var rec = {day: this.day, done: done, total: total, mood: Math.round(m), stars: stars};
    this.history.push(rec); if (this.history.length > 60) this.history.shift();
    this.stats.days++;
    this.day++; this.t = 7 * 60; this.sleeping = false; this.moodSum = 0; this.moodN = 0;
    this.tasks = makeTasks(this.day, this.seed, {multi: this.multi});
    this.p.pose = "stand";
    var bed = this.obj("bett"); this.p.x = bed.use.x; this.p.z = bed.use.z;
    if (this.d.mode === "sleep") this.d.timer = 2;
    this.emit("dayEnd", rec);
  };
  // dt: echte Sekunden. Liefert die vergangenen Spielminuten.
  S.step = function (dt, inp) {
    dt = Math.min(dt, 0.1);
    var mult = this.sleeping ? 90 : this.speed;
    if (!mult) return 0;
    var gm = dt * mult, n = this.need, me = this.me, d = this.d, self = this;
    var mdt = this.sleeping ? Math.min(dt * 6, 0.1) : dt; // im Schlaf schneller, damit der Hund ins Körbchen findet
    this.t += gm;
    if (this.t >= 1440 + 240 && !this.sleeping) this.collapse();
    // Bedürfnisse
    DOG_NEEDS.forEach(function (k) {
      var r = k.decay;
      if (d.mode === "sleep") { if (k.id === "blase" || k.id === "hunger" || k.id === "durst") r *= 0.35; if (k.id === "energie") r = 0; if (k.id === "spass" || k.id === "liebe") r *= 0.2; }
      if (!inHouse(d) && k.id === "spass") r = -0.3; // draußen macht Spaß
      n[k.id] = clamp(n[k.id] - r * gm, 0, 100);
    });
    if (this.sleeping) n.blase = Math.max(n.blase, 3);
    ME_NEEDS.forEach(function (k) { var r = k.decay; if (self.sleeping && k.id !== "energie") r *= 0.3; if (self.sleeping && k.id === "energie") r = 0; me[k.id] = clamp(me[k.id] - r * gm, 0, 100); });
    this.stepPlayer(inp || {}, mdt);
    this.tickAct(gm);
    this.stepItems(mdt);
    this.stepDog(mdt, gm);
    this.taskTick(dt);
    if (!this.sleeping) { this.moodSum += mood(n) * gm; this.moodN += gm; }
    var p = this.p; if (p.throwT) { p.throwT -= dt; if (p.throwT <= 0) { p.throwT = 0; if (p.pose === "throw") p.pose = "stand"; } }
    return gm;
  };
  S.collapse = function () {
    var bed = this.obj("bett"), kb = this.obj("koerbchen");
    this.cancel(); this.p.x = bed.use.x; this.p.z = bed.use.z;
    if (!inHouse(this.d)) { this.d.x = kb.x; this.d.z = kb.z; this.d.leash = false; this.d.item = null; }
    this.say("Du bist vor Müdigkeit eingeschlafen.");
    this.p.goal = {act: "schlafen", tg: {type: "obj", id: "bett"}}; this.arrive();
  };

  /* ---------- Speichern ---------- */
  S.save = function () {
    var p = this.p, d = this.d;
    return {v: 1, day: this.day, t: Math.round(this.t * 10) / 10, name: this.name, need: this.need, me: this.me, bowl: this.bowl, tasks: this.tasks,
      poops: this.poops, puddles: this.puddles, uid: this.uid, history: this.history, stats: this.stats, moodSum: this.moodSum, moodN: this.moodN,
      p: {x: p.x, z: p.z, yaw: p.yaw, bags: p.bags, holding: p.holding}, d: {x: d.x, z: d.z, yaw: d.yaw, leash: d.leash, darm: d.darm, toPoop: d.toPoop},
      items: this.items.filter(function (it) { return it.state === "ground" || it.state === "player"; }).map(function (it) { return {id: it.id, x: it.x, z: it.z, state: it.state}; }), at: Date.now()};
  };
  S.load = function (s) {
    if (!s || s.v !== 1) return;
    var self = this;
    ["day", "t", "name", "uid", "history", "stats", "moodSum", "moodN"].forEach(function (k) { if (s[k] != null) self[k] = s[k]; });
    ["need", "me", "bowl"].forEach(function (k) { if (s[k]) Object.assign(self[k], s[k]); });
    if (Array.isArray(s.tasks) && s.tasks.length) this.tasks = s.tasks;
    if (Array.isArray(s.poops)) this.poops = s.poops;
    if (Array.isArray(s.puddles)) this.puddles = s.puddles;
    if (s.p) { Object.assign(this.p, {x: s.p.x, z: s.p.z, yaw: s.p.yaw, bags: s.p.bags || 0}); }
    if (s.d) { Object.assign(this.d, {x: s.d.x, z: s.d.z, yaw: s.d.yaw, leash: !!s.d.leash, darm: s.d.darm || 0, toPoop: s.d.toPoop || 60}); this.setDog("idle", 1); this.d.pose.sleep = 0; this.d.pose.down = 0; }
    (s.items || []).forEach(function (x) { var it = self.item(x.id); if (it) { it.x = x.x; it.z = x.z; it.state = x.state === "player" ? "player" : "ground"; } });
    if (s.p && s.p.holding && this.item(s.p.holding)) this.p.holding = s.p.holding; else this.items.forEach(function (it) { if (it.state === "player") it.state = "ground"; });
    collide(this.p, 0.3, this.W); collide(this.d, 0.22, this.W);
  };

  return {
    TAU: TAU, LEASH: LEASH, clamp: clamp, lerp: lerp, angDiff: angDiff, rng: rng, hashStr: hashStr, fwd: fwd, right: right, dist: dist, yawTo: yawTo, fmtTime: fmtTime,
    HOUSE: HOUSE, LOT: LOT, ROOMS: ROOMS, inHouse: inHouse, inPark: inPark, roomOf: roomOf,
    buildWorld: buildWorld, pathDist: pathDist, collide: collide, NAV: NAV, buildNav: buildNav, findPath: findPath, los: los, blocked: blocked,
    GAITS: GAITS, pickGait: pickGait, legPose: legPose,
    DOG_NEEDS: DOG_NEEDS, ME_NEEDS: ME_NEEDS, mood: mood, TASKS: TASKS, makeTasks: makeTasks, ACTS: ACTS, Sim: Sim
  };
});
