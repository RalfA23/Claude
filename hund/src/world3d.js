// 3D-Welt: Wohnung mit Möbeln (Wohnzimmer wie auf den Fotos mit weißen Bücherregalen), Garten, Park mit Teich,
// Bäumen, Bänken und Laternen, dazu die Spielfigur. Erwartet THREE und window.Hund im Modul-Scope.

function canvasTex(w, h, draw, rep) {
  var c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  if (rep) t.repeat.set(rep[0], rep[1]);
  return t;
}
function woodTex() {
  return canvasTex(512, 512, function (g, w, h) {
    g.fillStyle = "#cdbba2"; g.fillRect(0, 0, w, h);
    var R = Hund.rng(3), rows = 8;
    for (var r = 0; r < rows; r++) {
      var y = r * h / rows, off = R() * w;
      for (var k = -1; k < 3; k++) {
        var x = off + k * w * 0.62;
        var l = 205 + Math.floor(R() * 22) - 11;
        g.fillStyle = "rgb(" + l + "," + (l - 18) + "," + (l - 42) + ")"; g.fillRect(x, y + 1, w * 0.62 - 2, h / rows - 2);
        g.strokeStyle = "rgba(120,95,70,0.12)";
        for (var q = 0; q < 6; q++) { g.beginPath(); var yy = y + 4 + R() * (h / rows - 8); g.moveTo(x, yy); g.bezierCurveTo(x + 80, yy + R() * 6 - 3, x + 200, yy + R() * 6 - 3, x + w * 0.62, yy); g.stroke(); }
      }
      g.fillStyle = "rgba(90,70,50,0.35)"; g.fillRect(0, y, w, 1.5);
    }
  });
}
function tileTex(a, b, n) {
  return canvasTex(256, 256, function (g, w, h) {
    g.fillStyle = b; g.fillRect(0, 0, w, h);
    var s = w / n; g.fillStyle = a;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) g.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3);
  });
}

// Profil-Band entlang einer Polylinie (für Wege).
function ribbon(pts, width, y) {
  var pos = [], uv = [], idx = [], acc = 0;
  for (var i = 0; i < pts.length; i++) {
    var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = dz / l, nz = -dx / l;
    if (i) acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    pos.push(pts[i].x + nx * width / 2, y, pts[i].z + nz * width / 2, pts[i].x - nx * width / 2, y, pts[i].z - nz * width / 2);
    uv.push(0, acc / 3, 1, acc / 3);
    if (i) { var k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function buildWorld3D(scene, W) {
  var out = {walls: [], roof: null, lampMats: [], picks: [], rooms: {}, windows: []};
  var std = function (c, r, extra) { var m = new THREE.MeshStandardMaterial(Object.assign({color: c, roughness: r == null ? 0.8 : r}, extra || {})); return m; };
  function box(w, h, d, mat, x, y, z, parent, opts) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z);
    m.castShadow = !(opts && opts.noShadow); m.receiveShadow = true; (parent || scene).add(m); return m;
  }
  function tagPick(obj, pick) { obj.traverse(function (o) { if (o.isMesh) { o.userData.pick = pick; out.picks.push(o); } }); }

  /* Boden mit leichtem Farbrauschen */
  var gw = 260, gd = 290, gx = 64, gz = 72;
  var gg = new THREE.PlaneGeometry(gw, gd, gx, gz); gg.rotateX(-Math.PI / 2); gg.translate(0, 0, -15);
  var col = [], c = new THREE.Color(), R = Hund.rng(11), gp = gg.attributes.position;
  for (var i = 0; i < gp.count; i++) {
    var x = gp.getX(i), z = gp.getZ(i), n = Math.sin(x * 0.11) * Math.cos(z * 0.09) * 0.5 + R() * 0.5;
    c.setRGB(0.24 + n * 0.06, 0.42 + n * 0.08, 0.16 + n * 0.03);
    if (z < -110 && Math.abs(x) < 15) c.setRGB(0.27 + n * 0.04, 0.47 + n * 0.05, 0.18);
    col.push(c.r, c.g, c.b);
  }
  gg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  var ground = new THREE.Mesh(gg, new THREE.MeshStandardMaterial({vertexColors: true, roughness: 1}));
  ground.receiveShadow = true; scene.add(ground); out.ground = ground;

  /* Wege */
  var pathMat = std(0xcbb58f, 1, {polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2});
  var gardenMat = std(0x9a948a, 0.95, {polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2});
  W.paths.forEach(function (p) { var m = new THREE.Mesh(ribbon(p.pts, p.w, 0.015), p.garden ? gardenMat : pathMat); m.receiveShadow = true; scene.add(m); });

  /* Teich mit Ufer und Schilf */
  var water = new THREE.Mesh(new THREE.CircleGeometry(W.pond.r, 48), new THREE.MeshStandardMaterial({color: 0x3e6f86, roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.92}));
  water.rotation.x = -Math.PI / 2; water.position.set(W.pond.x, 0.03, W.pond.z); scene.add(water); out.water = water;
  var shore = new THREE.Mesh(new THREE.RingGeometry(W.pond.r - 0.1, W.pond.r + 0.9, 48), std(0x8d7c58, 1, {polygonOffset: true, polygonOffsetFactor: -1}));
  shore.rotation.x = -Math.PI / 2; shore.position.set(W.pond.x, 0.02, W.pond.z); scene.add(shore);
  var reedGeo = new THREE.CylinderGeometry(0.015, 0.025, 1.1, 4); reedGeo.translate(0, 0.55, 0);
  var reeds = new THREE.InstancedMesh(reedGeo, std(0x6b7d3a, 0.9), 160), mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3();
  for (i = 0; i < 160; i++) {
    var a = R() * Math.PI * 2; if (Math.sin(a) > 0.6) a += 1.4;
    var rr = W.pond.r + 0.2 + R() * 0.6;
    p3.set(W.pond.x + Math.sin(a) * rr, 0, W.pond.z + Math.cos(a) * rr); e.set((R() - 0.5) * 0.3, 0, (R() - 0.5) * 0.3); q.setFromEuler(e); s3.set(1, 0.6 + R() * 0.8, 1);
    reeds.setMatrixAt(i, mm.compose(p3, q, s3));
  }
  scene.add(reeds);
  // Enten
  out.ducks = [];
  for (i = 0; i < 3; i++) {
    var duck = new THREE.Group();
    box(0.28, 0.14, 0.16, std(i ? 0x8a6a4a : 0x5a5f3a, 0.7), 0, 0.08, 0, duck);
    var hd = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std(i ? 0x6b4e33 : 0x1f6b3a, 0.5)); hd.position.set(0.14, 0.2, 0); duck.add(hd);
    var bk = box(0.07, 0.025, 0.04, std(0xe0a020, 0.6), 0.2, 0.19, 0, duck);
    void bk; duck.position.set(W.pond.x, 0.03, W.pond.z); scene.add(duck); out.ducks.push({g: duck, a: i * 2.1, r: 3 + i * 1.6, sp: 0.08 + i * 0.03});
  }

  /* Bäume, Büsche, Blumen (instanziert) */
  var trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 2.4, 7); trunkGeo.translate(0, 1.2, 0);
  var laubGeo = new THREE.IcosahedronGeometry(1.7, 1); laubGeo.translate(0, 3.6, 0);
  var laub2Geo = new THREE.IcosahedronGeometry(1.2, 1); laub2Geo.translate(0.7, 4.4, 0.3);
  var nadelGeo = new THREE.ConeGeometry(1.5, 4.2, 8); nadelGeo.translate(0, 3.6, 0);
  var birkeGeo = new THREE.IcosahedronGeometry(1.25, 1); birkeGeo.translate(0, 3.9, 0);
  function inst(geo, mat, list, f) {
    if (!list.length) return null;
    var im = new THREE.InstancedMesh(geo, mat, list.length); im.castShadow = true; im.receiveShadow = true;
    list.forEach(function (t, k) { f(t, k); im.setMatrixAt(k, mm.compose(p3, q, s3)); });
    scene.add(im); return im;
  }
  function place(t, sc, rot) { p3.set(t.x, 0, t.z); e.set(0, rot || t.rot || 0, 0); q.setFromEuler(e); s3.set(sc, sc, sc); }
  var trees = W.trees, laub = trees.filter(function (t) { return t.type === "laub"; }), nadel = trees.filter(function (t) { return t.type === "nadel"; }), birke = trees.filter(function (t) { return t.type === "birke"; });
  inst(trunkGeo, std(0x5b4430, 0.9), trees.filter(function (t) { return t.type !== "birke"; }), function (t) { place(t, t.s); });
  inst(trunkGeo, std(0xe8e4dc, 0.7), birke, function (t) { place(t, t.s * 0.8); s3.set(t.s * 0.6, t.s, t.s * 0.6); });
  var lm = new THREE.MeshStandardMaterial({color: 0x4f7f34, roughness: 0.9, flatShading: true});
  var laubIm = inst(laubGeo, lm, laub, function (t) { place(t, t.s); });
  var laub2Im = inst(laub2Geo, lm, laub, function (t) { place(t, t.s); });
  inst(nadelGeo, new THREE.MeshStandardMaterial({color: 0x2f5a35, roughness: 0.9, flatShading: true}), nadel, function (t) { place(t, t.s); });
  inst(birkeGeo, new THREE.MeshStandardMaterial({color: 0x86a64a, roughness: 0.9, flatShading: true}), birke, function (t) { place(t, t.s); });
  [laubIm, laub2Im].forEach(function (im) { if (!im) return; laub.forEach(function (t, k) { var g = 0.85 + Hund.rng(k + 5)() * 0.3; im.setColorAt(k, new THREE.Color(0.3 * g, 0.5 * g, 0.2 * g)); }); });
  var bushGeo = new THREE.IcosahedronGeometry(0.9, 1); bushGeo.scale(1, 0.75, 1); bushGeo.translate(0, 0.55, 0);
  inst(bushGeo, new THREE.MeshStandardMaterial({color: 0x3e6b2c, roughness: 0.9, flatShading: true}), W.bushes, function (t) { place(t, t.s); });
  var flowerGeo = new THREE.IcosahedronGeometry(0.07, 0); flowerGeo.translate(0, 0.12, 0);
  var fl = new THREE.InstancedMesh(flowerGeo, new THREE.MeshStandardMaterial({roughness: 0.7}), W.flowers.length);
  var fcols = [0xf4d03f, 0xffffff, 0xe56b9e, 0x8e7cc3].map(function (h) { return new THREE.Color(h); });
  W.flowers.forEach(function (f, k) { p3.set(f.x, 0, f.z); q.identity(); s3.set(1, 1, 1); fl.setMatrixAt(k, mm.compose(p3, q, s3)); fl.setColorAt(k, fcols[f.c]); });
  scene.add(fl);

  /* Matsch */
  var mudMat = std(0x4a3626, 0.35, {polygonOffset: true, polygonOffsetFactor: -3});
  W.mud.forEach(function (m) { var me = new THREE.Mesh(new THREE.CircleGeometry(m.r, 20), mudMat); me.rotation.x = -Math.PI / 2; me.position.set(m.x, 0.018, m.z); me.scale.set(1, 0.75, 1); scene.add(me); });

  /* Bänke, Mülleimer, Laternen */
  var wood = std(0x8a5a32, 0.8), iron = std(0x2b2b2b, 0.5, {metalness: 0.4}), binMat = std(0x3d6b3a, 0.6);
  W.benches.forEach(function (b, n) {
    var g = new THREE.Group(); g.position.set(b.x, 0, b.z); g.rotation.y = b.yaw;
    box(1.8, 0.06, 0.45, wood, 0, 0.45, 0, g); box(1.8, 0.35, 0.05, wood, 0, 0.75, -0.22, g);
    box(0.06, 0.45, 0.4, iron, -0.8, 0.22, 0, g); box(0.06, 0.45, 0.4, iron, 0.8, 0.22, 0, g);
    scene.add(g); tagPick(g, {type: "obj", id: "bank" + n});
  });
  var lampHead = new THREE.MeshStandardMaterial({color: 0xfff1c9, emissive: 0xffd27a, emissiveIntensity: 0});
  out.lampMats.push(lampHead);
  W.lamps.forEach(function (l) {
    var g = new THREE.Group(); g.position.set(l.x, 0, l.z);
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.6, 8), iron); pole.position.y = 1.8; pole.castShadow = true; g.add(pole);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), lampHead); head.position.y = 3.7; g.add(head);
    scene.add(g);
  });
  W.objects.filter(function (o) { return o.kind === "eimer" && /^eimer_p/.test(o.id); }).forEach(function (o) {
    var g = new THREE.Group(); g.position.set(o.x, 0, o.z);
    var b = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.85, 12), binMat); b.position.y = 0.42; b.castShadow = true; g.add(b);
    var lid = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 12), iron); lid.position.y = 0.87; g.add(lid);
    scene.add(g); tagPick(g, {type: "obj", id: o.id});
  });

  /* Zäune */
  var fenceMat = std(0x6d5338, 0.9), picket = std(0xf3f1ea, 0.8);
  (W.fences || []).forEach(function (f) {
    var lot = f.x1 - f.x0 < 1 || (f.z0 < -120);
    var len = Math.max(f.x1 - f.x0, f.z1 - f.z0), alongX = f.x1 - f.x0 > f.z1 - f.z0;
    var cx = (f.x0 + f.x1) / 2, cz = (f.z0 + f.z1) / 2, mat = lot ? picket : fenceMat;
    [0.35, 0.8].forEach(function (yy) { box(alongX ? len : 0.05, 0.07, alongX ? 0.05 : len, mat, cx, yy, cz, null, {noShadow: true}); });
    var nPosts = Math.floor(len / (lot ? 0.3 : 2.5));
    var post = new THREE.InstancedMesh(new THREE.BoxGeometry(lot ? 0.08 : 0.1, lot ? 0.95 : 1.1, lot ? 0.03 : 0.1), mat, nPosts + 1);
    for (var k = 0; k <= nPosts; k++) { var t = k / nPosts; p3.set(alongX ? f.x0 + t * (f.x1 - f.x0) : cx, lot ? 0.47 : 0.55, alongX ? cz : f.z0 + t * (f.z1 - f.z0)); q.identity(); s3.set(1, 1, 1); post.setMatrixAt(k, mm.compose(p3, q, s3)); }
    post.castShadow = true; scene.add(post);
  });
  // Torpfosten mit Schild
  [-1.6, 1.6].forEach(function (x) { box(0.25, 1.6, 0.25, std(0x7a6a5a, 0.9), x, 0.8, -110); });
  var sign = box(2.6, 0.45, 0.06, std(0x2f4a2f, 0.8), 0, 1.75, -110.05);
  var st = canvasTex(512, 96, function (g, w, h) { g.fillStyle = "#2f4a2f"; g.fillRect(0, 0, w, h); g.fillStyle = "#f3f0e0"; g.font = "bold 54px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Stadtpark", w / 2, h / 2 + 2); });
  var signFace = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.42), new THREE.MeshStandardMaterial({map: st})); signFace.position.set(0, 1.75, -110.09); signFace.rotation.y = Math.PI; scene.add(signFace);
  var signFace2 = signFace.clone(); signFace2.position.z = -110.01; signFace2.rotation.y = 0; scene.add(signFace2); void sign;

  /* Haus: Böden, Wände (mit Schnittansicht), Fenster, Dach */
  var floorWood = woodTex(); floorWood.repeat.set(3, 3);
  var floors = {wohnen: new THREE.MeshStandardMaterial({map: floorWood, roughness: 0.6}), schlafen: new THREE.MeshStandardMaterial({map: floorWood, roughness: 0.6}),
    kueche: new THREE.MeshStandardMaterial({map: tileTex("#d9d4ca", "#b9b2a6", 8), roughness: 0.5}), bad: new THREE.MeshStandardMaterial({map: tileTex("#e8edf0", "#c4ccd2", 10), roughness: 0.3})};
  floors.kueche.map.repeat.set(2, 2); floors.bad.map.repeat.set(2.5, 2.5);
  W.rooms.forEach(function (r) {
    var w = r.x1 - r.x0, d = r.z1 - r.z0, f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floors[r.id]);
    f.rotation.x = -Math.PI / 2; f.position.set((r.x0 + r.x1) / 2, 0.02, (r.z0 + r.z1) / 2); f.receiveShadow = true; scene.add(f);
    f.material.map.repeat.set(w / 3.2, d / 3.2);
  });
  box(18.4, 0.2, 16.4, std(0x8f8a80, 1), 0, -0.115, -129, null, {noShadow: true});
  var wallMat = new THREE.MeshStandardMaterial({color: 0xf1efe9, roughness: 0.9});
  var wallOut = new THREE.MeshStandardMaterial({color: 0xe7dccb, roughness: 0.95});
  W.walls.forEach(function (b) {
    var w = b.x1 - b.x0, d = b.z1 - b.z0, g = new THREE.BoxGeometry(w, b.h, d); g.translate(0, b.h / 2, 0);
    var m = new THREE.Mesh(g, b.side === "i" ? wallMat : [wallOut, wallOut, wallMat, wallMat, wallOut, wallOut]);
    if (b.side !== "i") {
      // Außenwände: innen weiß, außen warm. Welche Seite innen ist, hängt von der Richtung ab.
      var mats = [wallOut, wallOut, wallOut, wallOut, wallOut, wallOut];
      if (b.side === "n") mats[5] = wallMat; if (b.side === "s") mats[4] = wallMat; if (b.side === "w") mats[0] = wallMat; if (b.side === "o") mats[1] = wallMat;
      m.material = mats;
    }
    m.position.set((b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2); m.castShadow = true; m.receiveShadow = true; scene.add(m);
    out.walls.push({mesh: m, box: b, cx: (b.x0 + b.x1) / 2, cz: (b.z0 + b.z1) / 2, cut: 1});
  });
  // Fenster in den Außenwänden: Glas mit Rahmen, ragt beidseitig etwas heraus
  var glass = new THREE.MeshStandardMaterial({color: 0x9cc3d8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.55});
  var frame = std(0xfafafa, 0.6);
  [[-6, -121, 0], [5.5, -121, 0], [-6, -137, 0], [5, -137, 0], [-9, -125, 1], [-9, -133, 1], [9, -125, 1], [9, -133, 1]].forEach(function (wp) {
    var g = new THREE.Group(); g.position.set(wp[0], 0, wp[1]); if (wp[2]) g.rotation.y = Math.PI / 2;
    box(1.6, 1.25, 0.26, frame, 0, 1.55, 0, g); var gl = box(1.45, 1.1, 0.27, glass, 0, 1.55, 0, g, {noShadow: true});
    scene.add(g); out.windows.push(g); void gl;
  });
  // Haustür als offener Türflügel
  var door = new THREE.Group(); door.position.set(-1.1, 0, -121); scene.add(door);
  box(0.06, 2.1, 1.3, std(0x6b4a2e, 0.6), 0, 1.05, -0.62, door); door.rotation.y = 0.3;
  out.door = door;
  // Dach (nur sichtbar, wenn man draußen ist)
  var roof = new THREE.Group(), roofMat = std(0x8c3b2a, 0.85, {side: THREE.DoubleSide});
  var rl = 18.8, rw = 8.6, rh = 3.4;
  [-1, 1].forEach(function (sx) {
    var pl = new THREE.Mesh(new THREE.PlaneGeometry(rl, Math.hypot(rw, rh)), roofMat);
    pl.rotation.order = "YXZ"; pl.rotation.x = -Math.PI / 2 + sx * Math.atan2(rh, rw) * -1; pl.position.set(0, 2.6 + rh / 2, -129 + sx * rw / 2);
    pl.rotation.x = sx > 0 ? -Math.PI / 2 + Math.atan2(rh, rw) : -Math.PI / 2 - Math.atan2(rh, rw);
    pl.castShadow = true; roof.add(pl);
  });
  var gable = new THREE.Shape(); gable.moveTo(-8.2, 0); gable.lineTo(8.2, 0); gable.lineTo(0, rh); gable.lineTo(-8.2, 0);
  [-9.05, 9.05].forEach(function (x) { var gm = new THREE.Mesh(new THREE.ShapeGeometry(gable), new THREE.MeshStandardMaterial({color: 0xe7dccb, side: THREE.DoubleSide})); gm.rotation.y = Math.PI / 2; gm.position.set(x, 2.6, -129); roof.add(gm); });
  scene.add(roof); out.roof = roof;

  /* Möbel */
  var white = std(0xf5f5f2, 0.6), oak = std(0xb08a5e, 0.6), dark = std(0x2b2b30, 0.4), fabric = std(0x6d7f95, 0.95), fabric2 = std(0xb6a796, 0.95);
  var built = {};
  W.furniture.forEach(function (f) {
    var w = f.x1 - f.x0, d = f.z1 - f.z0, cx = (f.x0 + f.x1) / 2, cz = (f.z0 + f.z1) / 2, g = new THREE.Group(); g.position.set(cx, 0, cz);
    switch (f.kind) {
      case "regal": buildShelf(g, w, f.h, d); break;
      case "tv":
        box(w, f.h, d, white, 0, f.h / 2, 0, g);
        box(1.6, 0.92, 0.05, dark, 0, f.h + 0.56, 0.05, g);
        var scr = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 0.84), new THREE.MeshStandardMaterial({color: 0x101820, emissive: 0x000000, roughness: 0.2})); scr.position.set(0, f.h + 0.56, 0.08); g.add(scr); out.tvScreen = scr;
        box(0.32, 0.18, 0.12, dark, 0.95, f.h + 0.09, 0, g); // Lautsprecher mit Display wie auf dem Foto
        box(0.6, 0.2, 0.14, std(0x1a1a1a, 0.4), -0.9, f.h + 0.1, 0, g); // Spielkonsole
        break;
      case "sofa":
        box(w, 0.42, d, fabric, 0, 0.21, 0, g); box(w, 0.45, 0.2, fabric, 0, 0.62, d / 2 - 0.1, g);
        box(0.18, 0.62, d, fabric, -w / 2 + 0.09, 0.31, 0, g); box(0.18, 0.62, d, fabric, w / 2 - 0.09, 0.31, 0, g);
        box(w - 0.4, 0.1, d - 0.25, std(0x7b8da3, 0.95), 0, 0.46, -0.08, g);
        // Kuscheldecke wie auf dem Foto
        box(0.9, 0.08, 0.7, std(0xb9bfc9, 1), 0.55, 0.53, -0.05, g);
        break;
      case "sessel": box(w, 0.4, d, fabric2, 0, 0.2, 0, g); box(w, 0.45, 0.18, fabric2, 0, 0.6, -d / 2 + 0.09, g); break;
      case "teppich": var rug = box(w, 0.012, d, std(0x9a8f86, 1), 0, 0.03, 0, g, {noShadow: true}); rug.castShadow = false; break;
      case "stehlampe":
        // schwarzer Kerzenleuchter wie auf dem Foto
        var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.8, 8), iron); stem.position.y = 0.9; g.add(stem);
        var foot = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.18, 8), iron); foot.position.y = 0.09; g.add(foot);
        var candle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10), std(0xfaf6ea, 0.7)); candle.position.y = 1.95; g.add(candle);
        break;
      case "theke":
        box(w, f.h - 0.04, d, white, 0, (f.h - 0.04) / 2, 0, g); box(w + 0.04, 0.04, d + 0.02, std(0x55504a, 0.4), 0, f.h - 0.02, 0, g);
        box(0.5, 0.02, 0.4, std(0x9aa0a6, 0.2, {metalness: 0.7}), 0, f.h + 0.005, 1.0, g); // Spüle
        box(0.55, 0.02, 0.5, std(0x111111, 0.3), 0, f.h + 0.005, -1.4, g); // Kochfeld
        box(w, 0.7, d, white, 0, 1.95, 0, g); // Hängeschränke
        break;
      case "kuehlschrank": box(w, f.h, d, std(0xdfe3e6, 0.35, {metalness: 0.3}), 0, f.h / 2, 0, g); box(0.03, 0.5, 0.04, dark, -w / 2 - 0.02, 1.2, d / 2 - 0.15, g); break;
      case "tisch":
        box(w, 0.05, d, oak, 0, f.h, 0, g);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(0.06, f.h, 0.06, oak, s[0] * (w / 2 - 0.08), f.h / 2, s[1] * (d / 2 - 0.08), g); });
        [[-0.5, -1], [0.5, -1], [-0.5, 1], [0.5, 1]].forEach(function (s) { box(0.42, 0.45, 0.42, oak, s[0] * w / 2 * 0.9, 0.22, s[1] * (d / 2 + 0.3), g); box(0.42, 0.45, 0.05, oak, s[0] * w / 2 * 0.9, 0.6, s[1] * (d / 2 + 0.5), g); });
        box(0.3, 0.12, 0.3, std(0xd9c27a, 0.6), 0, f.h + 0.08, 0, g);
        break;
      case "bett":
        box(w, 0.35, d, oak, 0, 0.18, 0, g); box(w - 0.1, 0.18, d - 0.1, white, 0, 0.44, 0.02, g);
        box(w - 0.1, 0.06, d * 0.62, std(0x7b93b3, 0.95), 0, 0.55, 0.38, g);
        box(0.6, 0.12, 0.4, white, -0.48, 0.58, -0.8, g); box(0.6, 0.12, 0.4, white, 0.48, 0.58, -0.8, g);
        box(w, 0.9, 0.08, oak, 0, 0.45, -d / 2 + 0.04, g);
        break;
      case "schrank": box(w, f.h, d, white, 0, f.h / 2, 0, g); box(0.02, 1.9, 0.02, std(0xcccccc, 0.5), 0, 1.0, d / 2 + 0.01, g); break;
      case "nachttisch": box(w, f.h, d, oak, 0, f.h / 2, 0, g); var lmp = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 12, 1, true), std(0xf2e6c9, 0.8, {side: THREE.DoubleSide})); lmp.position.y = f.h + 0.25; g.add(lmp); break;
      case "wanne": box(w, f.h, d, white, 0, f.h / 2, 0, g); var wt = box(w - 0.16, 0.02, d - 0.16, std(0x9fd0e6, 0.05, {transparent: true, opacity: 0.8}), 0, f.h - 0.06, 0, g, {noShadow: true}); out.tubWater = wt; wt.visible = false; break;
      case "klo": box(w, 0.42, d * 0.7, white, 0, 0.21, 0.05, g); box(w, 0.5, 0.18, white, 0, 0.6, -d / 2 + 0.09, g); break;
      case "waschbecken": box(w, 0.15, d, white, 0, 0.8, 0, g); box(0.15, 0.7, 0.15, white, 0, 0.4, 0, g); box(0.6, 0.8, 0.03, std(0xcfe3ea, 0.05, {metalness: 0.6}), 0, 1.5, -d / 2 + 0.01, g); break;
      case "eimer": var bin = new THREE.Mesh(new THREE.CylinderGeometry(w / 2, w / 2 * 0.9, f.h, 14), f.id === "eimer_g" ? std(0x2e3a46, 0.6) : std(0xb8bcc0, 0.3, {metalness: 0.5})); bin.position.y = f.h / 2; bin.castShadow = true; g.add(bin); break;
    }
    scene.add(g); built[f.id] = g;
  });
  // Körbchen, Näpfe
  var kb = W.objects.filter(function (o) { return o.id === "koerbchen"; })[0];
  var bed = new THREE.Group(); bed.position.set(kb.x, 0, kb.z);
  var ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.11, 10, 24), std(0x7a6a5e, 1)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.1; bed.add(ring); ring.castShadow = true;
  var cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 24), std(0xb9b1a6, 1)); cushion.position.y = 0.05; bed.add(cushion);
  scene.add(bed); built.koerbchen = bed;
  function bowl(o, color) { var g = new THREE.Group(); g.position.set(o.x, 0, o.z); var b = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.07, 18, 1, true), std(color, 0.3, {metalness: 0.6, side: THREE.DoubleSide})); b.position.y = 0.035; g.add(b); var bt = new THREE.Mesh(new THREE.CircleGeometry(0.1, 18), std(color, 0.3, {metalness: 0.6})); bt.rotation.x = -Math.PI / 2; bt.position.y = 0.004; g.add(bt); scene.add(g); return g; }
  var napf = bowl(W.objects.filter(function (o) { return o.id === "napf"; })[0], 0xc0392b), wn = bowl(W.objects.filter(function (o) { return o.id === "wassernapf"; })[0], 0x2e86c1);
  var food = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.05, 14), std(0x7a4a24, 0.9)); food.position.y = 0.03; napf.add(food); out.food = food;
  var wat = new THREE.Mesh(new THREE.CircleGeometry(0.115, 18), new THREE.MeshStandardMaterial({color: 0x8ec8e8, roughness: 0.05, transparent: true, opacity: 0.85})); wat.rotation.x = -Math.PI / 2; wat.position.y = 0.05; wn.add(wat); out.water2 = wat;
  built.napf = napf; built.wassernapf = wn;
  // Garten: Beete, Briefkasten
  [[-6, -117], [6, -118]].forEach(function (b) { var bed2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 1.2), std(0x5a4030, 1)); bed2.position.set(b[0], 0.07, b[1]); bed2.receiveShadow = true; scene.add(bed2); for (var k = 0; k < 14; k++) { var fm = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), std([0xe74c3c, 0xf1c40f, 0xffffff, 0xd35400][k % 4], 0.7)); fm.position.set(b[0] - 1.3 + (k % 7) * 0.43, 0.3, b[1] - 0.3 + Math.floor(k / 7) * 0.6); scene.add(fm); } });
  box(0.3, 0.3, 0.2, std(0xc0392b, 0.6), 1.6, 1.1, -110.4); box(0.06, 1.0, 0.06, iron, 1.6, 0.5, -110.4);

  // Antippen: jedes Objekt mit seinem Möbelstück verknüpfen
  W.objects.forEach(function (o) {
    var g = built[o.id] || built[o.kind];
    if (g) tagPick(g, {type: "obj", id: o.id});
  });
  // Tür antippbar machen: unsichtbare Fläche in der Öffnung
  var doorHit = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.4), new THREE.MeshBasicMaterial({visible: false})); doorHit.position.set(-0.4, 1.1, -121); scene.add(doorHit);
  doorHit.userData.pick = {type: "obj", id: "tuer"}; out.picks.push(doorHit);

  function buildShelf(g, w, h, d) {
    // Weiße Regale wie auf den Fotos: Fächer voller bunter Bücher, ein paar Figuren.
    var units = Math.round(d / 0.8), uw = d / units;
    var bookCols = [0xc0392b, 0x2e86c1, 0xf1c40f, 0x27ae60, 0x8e44ad, 0xe67e22, 0x1a1a1a, 0xecf0f1, 0x16a085, 0xd35400, 0xe84393, 0x34495e, 0xf5cba7, 0x7fb3d5];
    var R2 = Hund.rng(42), books = [], shelves = 6;
    box(w, h, 0.03, white, 0, h / 2, -d / 2, g); box(w, h, 0.03, white, 0, h / 2, d / 2, g);
    for (var u = 1; u < units; u++) box(w, h, 0.025, white, 0, h / 2, -d / 2 + u * uw, g);
    box(0.02, h, d, white, -w / 2 + 0.01, h / 2, 0, g);
    for (var sI = 0; sI <= shelves; sI++) box(w, 0.025, d, white, 0, 0.05 + sI * (h - 0.08) / shelves, 0, g);
    for (u = 0; u < units; u++) for (sI = 0; sI < shelves; sI++) {
      var z0 = -d / 2 + u * uw + 0.03, z1 = z0 + uw - 0.05, y0 = 0.065 + sI * (h - 0.08) / shelves, sh = (h - 0.08) / shelves - 0.04, zz = z0;
      if (R2() < 0.12) continue;
      while (zz < z1 - 0.03) {
        var bw = 0.025 + R2() * 0.03, bh = sh * (0.65 + R2() * 0.33);
        if (zz + bw > z1) break;
        books.push({z: zz + bw / 2, y: y0 + bh / 2, w: bw, h: bh, d: 0.17 + R2() * 0.08, c: bookCols[Math.floor(R2() * bookCols.length)]});
        zz += bw + 0.002;
        if (R2() < 0.04) zz += 0.12;
      }
    }
    var bi = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({roughness: 0.7}), books.length), cc = new THREE.Color();
    books.forEach(function (b, k) { p3.set(-w / 2 + 0.03 + b.d / 2 + 0.04, b.y, b.z); q.identity(); s3.set(b.d, b.h, b.w); bi.setMatrixAt(k, mm.compose(p3, q, s3)); bi.setColorAt(k, cc.set(b.c)); });
    bi.castShadow = true; g.add(bi);
    // kleine weiße Büste und schwarze Silhouette als Deko
    var bust = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), white); bust.position.set(0, 1.3, d / 2 - 0.3); g.add(bust);
    box(0.02, 0.2, 0.15, dark, 0.05, 0.98, -d / 2 + 0.5, g);
  }
  return out;
}

/* ---------- Spielfigur ---------- */
var PERSON_LOOKS = [
  {skin: 0xe2b896, hair: 0x6b5a4a, shirt: 0x34495e, pants: 0x2c3e50, shoes: 0x1b1b1b},
  {skin: 0xd8a47f, hair: 0x2b1d14, shirt: 0xb03a2e, pants: 0x4a4a4a, shoes: 0x3a2a1a}
];
function makePerson(lookIdx) {
  var L = PERSON_LOOKS[lookIdx || 0] || PERSON_LOOKS[0];
  var m = function (c, r) { return new THREE.MeshStandardMaterial({color: c, roughness: r == null ? 0.8 : r}); };
  var skin = m(L.skin, 0.6), shirt = m(L.shirt), pants = m(L.pants), shoes = m(L.shoes, 0.5), hair = m(L.hair, 0.9);
  var root = new THREE.Group();
  function cap(r, len, mat, parent, y) { var me = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat); me.position.y = y; me.castShadow = true; parent.add(me); return me; }
  function grp(parent, x, y, z) { var g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }
  var pelvis = grp(root, 0, 0.92, 0);
  cap(0.15, 0.1, pants, pelvis, 0.02).scale.set(1.15, 1, 0.8);
  var spine = grp(pelvis, 0, 0.08, 0);
  var torso = cap(0.17, 0.32, shirt, spine, 0.27); torso.scale.set(1.15, 1, 0.75);
  var neck = grp(spine, 0, 0.56, 0);
  cap(0.05, 0.06, skin, neck, 0.03);
  var head = grp(neck, 0, 0.12, 0);
  var hd = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 14), skin); hd.scale.set(0.95, 1.12, 1); hd.castShadow = true; head.add(hd);
  var hr = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), hair); hr.scale.set(0.97, 1.0, 1.02); hr.position.set(0, 0.02, -0.01); hr.rotation.x = -0.25; head.add(hr);
  var nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), skin); nose.position.set(0, -0.01, 0.115); head.add(nose);
  [-1, 1].forEach(function (s) { var e = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), m(0x222222, 0.3)); e.position.set(s * 0.04, 0.025, 0.1); head.add(e); });
  function limb(parent, x, y, l1, l2, r, mat1, mat2, endMat) {
    var a = grp(parent, x, y, 0); cap(r, l1 - 2 * r, mat1, a, -l1 / 2);
    var b = grp(a, 0, -l1, 0); cap(r * 0.85, l2 - 2 * r, mat2, b, -l2 / 2);
    var c = grp(b, 0, -l2, 0);
    return {a: a, b: b, c: c, end: endMat};
  }
  var arms = [-1, 1].map(function (s) { var l = limb(spine, s * 0.22, 0.5, 0.3, 0.27, 0.05, shirt, shirt); var hand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), skin); hand.position.y = -0.03; l.c.add(hand); return l; });
  var legs = [-1, 1].map(function (s) { var l = limb(pelvis, s * 0.1, -0.02, 0.45, 0.43, 0.075, pants, pants); var sh = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.26), shoes); sh.position.set(0, -0.03, 0.06); sh.castShadow = true; l.c.add(sh); return l; });
  var book = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.04), m(0xc0392b, 0.7)); book.visible = false; spine.add(book); book.position.set(0, 0.32, 0.3); book.rotation.x = -0.5;
  var bag = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), m(0x2e8b57, 0.6)); bag.visible = false; arms[0].c.add(bag); bag.position.y = -0.1;
  var hit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.5), new THREE.MeshBasicMaterial({visible: false})); hit.position.y = 0.9; root.add(hit);
  var tmp = new THREE.Vector3();
  return {
    root: root, hand: arms[0].c, handL: arms[1].c,
    update: function (p, time, dt) {
      root.position.set(p.x, 0, p.z); root.rotation.set(0, p.yaw, 0);
      var pose = p.pose || "stand", sp = Math.min(1, Math.abs(p.speed || 0) / 1.55), run = Math.abs(p.speed || 0) > 2.5;
      var ph = (p.phase || 0) * Math.PI * 2, sw = Math.sin(ph) * (run ? 0.75 : 0.5) * sp;
      pelvis.position.y = 0.92 + Math.abs(Math.cos(ph)) * 0.03 * sp; pelvis.rotation.set(0, 0, 0); spine.rotation.set(run ? 0.15 * sp : 0, 0, 0); head.rotation.set(0, 0, 0);
      legs[0].a.rotation.set(sw, 0, 0); legs[1].a.rotation.set(-sw, 0, 0);
      legs[0].b.rotation.set(Math.max(0, -Math.sin(ph)) * 0.9 * sp + 0.05, 0, 0); legs[1].b.rotation.set(Math.max(0, Math.sin(ph)) * 0.9 * sp + 0.05, 0, 0);
      arms[0].a.rotation.set(-sw * 0.8, 0, 0.08); arms[1].a.rotation.set(sw * 0.8, 0, -0.08);
      arms[0].b.rotation.set(-0.2 - (run ? 0.9 : 0.1) * sp, 0, 0); arms[1].b.rotation.set(-0.2 - (run ? 0.9 : 0.1) * sp, 0, 0);
      book.visible = false; bag.visible = !!p.bags;
      if (p.leash) { arms[0].a.rotation.x = -0.35; arms[0].b.rotation.x = -0.5; }
      if (pose === "sit") {
        pelvis.position.y = 0.5;
        legs.forEach(function (l) { l.a.rotation.x = -1.5; l.b.rotation.x = 1.5; });
        arms.forEach(function (a) { a.a.rotation.x = -0.4; a.b.rotation.x = -0.6; });
        spine.rotation.x = -0.1;
      } else if (pose === "lie") {
        pelvis.position.y = 0.62; pelvis.rotation.x = -Math.PI / 2;
        legs.forEach(function (l) { l.a.rotation.x = 0; l.b.rotation.x = 0.05; });
        arms.forEach(function (a) { a.a.rotation.x = 0; a.b.rotation.x = -0.1; });
        head.rotation.x = 0.2;
      } else if (pose === "bend") {
        pelvis.position.y = 0.58;
        legs.forEach(function (l) { l.a.rotation.x = -1.25; l.b.rotation.x = 2.0; });
        spine.rotation.x = 0.55; head.rotation.x = 0.3;
        arms.forEach(function (a) { a.a.rotation.x = -0.9; a.b.rotation.x = -0.3; });
      } else if (pose === "read") {
        book.visible = true;
        arms.forEach(function (a, i) { a.a.rotation.set(-0.5, 0, (i ? -1 : 1) * 0.25); a.b.rotation.x = -1.4; });
        head.rotation.x = 0.35;
      } else if (pose === "throw") {
        arms[0].a.rotation.set(-2.6, 0, 0.1); arms[0].b.rotation.x = -0.3;
      }
      if (p.holding && pose !== "throw") { arms[0].a.rotation.x = Math.min(arms[0].a.rotation.x, -0.3); arms[0].b.rotation.x = -0.9; }
      if (p.act && p.act.id === "baden") { spine.rotation.x = 0.7; pelvis.position.y = 0.6; legs.forEach(function (l) { l.a.rotation.x = -1.2; l.b.rotation.x = 1.9; }); arms.forEach(function (a, i) { a.a.rotation.x = -1.2 + Math.sin(time * 8 + i * 2) * 0.4; a.b.rotation.x = -0.4; }); }
      if (p.act && p.act.id === "aufwischen") { spine.rotation.x = 0.4; arms.forEach(function (a, i) { a.a.rotation.x = -0.8 + Math.sin(time * 6 + i) * 0.3; }); }
      if (p.act && (p.act.id === "essen" || p.act.id === "kochen")) { arms[0].a.rotation.x = -0.9 + Math.sin(time * 4) * 0.4; arms[0].b.rotation.x = -1.6; }
      root.updateMatrixWorld(true);
      void tmp;
    },
    handPos: function (v) { return arms[0].c.getWorldPosition(v); }
  };
}
