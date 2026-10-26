// 3D-Hund nach den Fotos: schlanker Pinscher, kurzes schwarzes Fell mit lohfarbenen Abzeichen
// (Punkte über den Augen, Fang, Backen, Brustflecken, Unterbeine, Pfoten), halb stehende Kippohren,
// das rechte stärker geknickt, dünne Rute, braune Augen. Alles aus Profilkörpern mit Vertexfarben.
// Erwartet THREE und window.Hund im Modul-Scope. Hund schaut entlang +z, Pfoten auf y = 0.
var DOG_LOOKS = [
  {id: "pinscher", name: "Schwarz-loh (wie auf den Fotos)", coat: "#151110", tan: "#a8582a", inner: "#5a3322", eye: "#3a1d0c"},
  {id: "rot", name: "Hirschrot", coat: "#8a4a22", tan: "#b8743e", inner: "#6b3a22", eye: "#3a1d0c"},
  {id: "schoko", name: "Schoko-loh", coat: "#3f2518", tan: "#b97a45", inner: "#5c3320", eye: "#4a2a12"},
  {id: "grau", name: "Blau-loh", coat: "#3c4148", tan: "#b07a4c", inner: "#5d4a44", eye: "#3a2410"}
];
// Rassen: Proportionen relativ zum Pinscher, Ohr- und Rutenform, Zeichnung (loh, uni, sattel, weiss).
// size skaliert den ganzen Hund, leg die Beinlänge, len den Rumpf, wide Breite und Tiefe.
var DOG_BREEDS = [
  {id: "pinscher", name: "Pinscher", size: 1, leg: 1, len: 1, wide: 1, muzzle: 1, head: 1, ear: "kipp", earSize: 1, tail: "duenn", pattern: "loh", looks: DOG_LOOKS},
  {id: "dackel", name: "Dackel", size: 1.05, leg: 0.5, len: 1.55, wide: 1.2, thick: 1.35, muzzle: 1.12, head: 1.05, ear: "haenge", earSize: 1.45, tail: "duenn", tailLen: 1.15, pattern: "uni", looks: [
    {name: "Rot", coat: "#9a4f22", tan: "#c07d45", inner: "#7a3e1c", eye: "#3a1d0c"},
    {name: "Schwarz-loh", coat: "#141010", tan: "#a8582a", inner: "#5a3322", eye: "#3a1d0c", pattern: "loh"},
    {name: "Rauhaar", coat: "#6a5845", tan: "#a08a6c", inner: "#4e4033", eye: "#3a1d0c"}]},
  {id: "labrador", name: "Labrador", size: 1.42, leg: 0.95, len: 1.05, wide: 1.4, thick: 1.5, muzzle: 0.9, head: 1.15, headW: 1.3, ear: "haenge", earSize: 1.05, tail: "otter", pattern: "uni", looks: [
    {name: "Blond", coat: "#d6ad70", tan: "#ecd2a0", inner: "#b88a52", eye: "#4a2a12"},
    {name: "Schwarz", coat: "#141212", tan: "#2c2724", inner: "#2a2220", eye: "#3a1d0c"},
    {name: "Schoko", coat: "#4a2b1b", tan: "#6e4630", inner: "#3c2216", eye: "#5a3a1a"}]},
  {id: "schaefer", name: "Schäferhund", size: 1.55, leg: 1.0, len: 1.15, wide: 1.18, muzzle: 1.18, head: 1.04, ear: "steh", earSize: 1.4, tail: "buschig", pattern: "sattel", looks: [
    {name: "Schwarz-braun", coat: "#1a1512", tan: "#b4773a", inner: "#6b4426", eye: "#3a1d0c"},
    {name: "Schwarz", coat: "#141212", tan: "#24201e", inner: "#3a2a24", eye: "#3a1d0c", pattern: "uni"}]},
  {id: "collie", name: "Border Collie", size: 1.3, leg: 0.95, len: 1.05, wide: 1.1, muzzle: 1.06, head: 1.04, ear: "halb", earSize: 1.1, tail: "buschig", pattern: "weiss", looks: [
    {name: "Schwarz-weiß", coat: "#141212", tan: "#f0ede6", inner: "#5a3a34", eye: "#3a1d0c"},
    {name: "Braun-weiß", coat: "#5a3320", tan: "#f0ede6", inner: "#6a3a28", eye: "#5a3a1a"}]}
];
function dogBreed(id) { for (var i = 0; i < DOG_BREEDS.length; i++) if (DOG_BREEDS[i].id === id) return DOG_BREEDS[i]; return DOG_BREEDS[0]; }

function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

// Profilkörper entlang +z. Querschnitte {z, y, w, top, bot}: Mitte y, halbe Breite w, Radius nach oben/unten.
// paint(x, y, z) liefert 0 (Fellfarbe) bis 1 (Abzeichen).
function loftGeo(sections, paint, cA, cB, radial, sub) {
  radial = radial || 14; sub = sub || 4;
  var pts = [];
  function cr(p0, p1, p2, p3, t) { var t2 = t * t, t3 = t2 * t; return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3); }
  for (var i = 0; i < sections.length - 1; i++) {
    var s0 = sections[Math.max(0, i - 1)], s1 = sections[i], s2 = sections[i + 1], s3 = sections[Math.min(sections.length - 1, i + 2)];
    for (var k = 0; k < sub; k++) {
      var t = k / sub, o = {};
      ["z", "y", "w", "top", "bot"].forEach(function (key) { o[key] = cr(s0[key], s1[key], s2[key], s3[key], t); });
      o.w = Math.max(0.001, o.w); o.top = Math.max(0.001, o.top); o.bot = Math.max(0.001, o.bot);
      pts.push(o);
    }
  }
  pts.push(Object.assign({}, sections[sections.length - 1]));
  var pos = [], col = [], idx = [], c = new THREE.Color();
  function vert(x, y, z) { pos.push(x, y, z); var a = paint ? paint(x, y, z) : 0; c.copy(cA).lerp(cB, a); col.push(c.r, c.g, c.b); }
  pts.forEach(function (s) {
    for (var j = 0; j < radial; j++) {
      var a = j / radial * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      vert(sa * s.w, s.y + (ca > 0 ? ca * s.top : ca * s.bot), s.z);
    }
  });
  var n = pts.length;
  for (i = 0; i < n - 1; i++) for (var j2 = 0; j2 < radial; j2++) {
    var a0 = i * radial + j2, a1 = i * radial + (j2 + 1) % radial, b0 = a0 + radial, b1 = a1 + radial;
    idx.push(a0, b0, a1, a1, b0, b1);
  }
  // Kappen
  var first = pts[0], last = pts[n - 1];
  var cs = pos.length / 3; vert(0, first.y, first.z - Math.min(first.w, first.top) * 0.6);
  var ce = pos.length / 3; vert(0, last.y, last.z + Math.min(last.w, last.top) * 0.6);
  for (j2 = 0; j2 < radial; j2++) {
    idx.push(cs, (j2 + 1) % radial, j2);
    idx.push(ce, (n - 1) * radial + j2, (n - 1) * radial + (j2 + 1) % radial);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function makeDog(lookIdx, breedId) {
  var B = dogBreed(breedId), L = B.looks[lookIdx || 0] || B.looks[0];
  var PAT = L.pattern || B.pattern, LEG = B.leg, LEN = B.len, WID = B.wide, THK = B.thick || Math.sqrt(WID);
  // Zeichnung: base ist die Pinscher-Zeichnung des Körperteils, die anderen Muster leiten sich davon ab.
  function pat(part, base) {
    if (PAT === "loh") return base;
    if (PAT === "uni") return function (x, y, z) { return (base ? base(x, y, z) : 0) * 0.35; };
    if (PAT === "sattel") return function (x, y, z) {
      if (part === "torso") return 1 - smooth(-0.015, 0.035, y) * smooth(-0.25, -0.2, z) * (1 - smooth(0.08, 0.16, z));
      if (part === "head") return 1 - smooth(0.06, 0.11, z) * 0.85;
      if (part === "neck") return 0.75 * smooth(0.02, -0.03, y) + 0.25;
      if (part === "tail") return 0;
      return 1;
    };
    return function (x, y, z) {
      if (part === "torso") return Math.max(smooth(0.06, 0.16, z) * smooth(0.01, -0.05, y), smooth(-0.02, 0.06, z) * smooth(-0.06, -0.1, y));
      if (part === "head") return Math.max(smooth(0.012, 0.004, Math.abs(x)) * smooth(-0.03, 0.0, z) * smooth(-0.01, 0.02, y), smooth(0.08, 0.11, z) * 0.9);
      if (part === "neck") return smooth(0.0, -0.035, y);
      if (part === "tail") return smooth(0.03, 0.09, z);
      if (part === "upper") return 0;
      if (part === "lower") return smooth(0.03, 0.09, z);
      return 1;
    };
  }
  // Nachträglich strecken, ohne die Zeichnung zu verschieben.
  function sc(g, x, y, z) { g.scale(x, y, z); g.computeVertexNormals(); return g; }
  var coat = new THREE.Color(L.coat), tan = new THREE.Color(L.tan);
  var mat = new THREE.MeshPhysicalMaterial({vertexColors: true, roughness: 0.42, metalness: 0, sheen: 0.7, sheenRoughness: 0.45, sheenColor: new THREE.Color(0x6b5a50), clearcoat: 0.15, clearcoatRoughness: 0.6});
  var plain = function (hex, rough) { return new THREE.MeshStandardMaterial({color: hex, roughness: rough == null ? 0.5 : rough}); };
  var root = new THREE.Group(); root.name = "hund";
  var meshes = [];
  function mesh(geo, m, parent) { var me = new THREE.Mesh(geo, m || mat); me.castShadow = true; me.receiveShadow = false; parent.add(me); meshes.push(me); return me; }
  function group(parent, x, y, z) { var g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); parent.add(g); return g; }
  // Bein-Segment: Profil entlang +z, gedreht, sodass es nach unten zeigt.
  function seg(parent, len, r0, r1, paint, back) {
    var g = loftGeo([
      {z: -r0 * 0.6, y: 0, w: r0 * 0.75, top: r0 * 0.75, bot: r0 * 0.75},
      {z: 0, y: 0, w: r0, top: r0 * (back ? 1.1 : 1), bot: r0},
      {z: len * 0.5, y: 0, w: (r0 + r1) / 2, top: (r0 + r1) / 2, bot: (r0 + r1) / 2},
      {z: len, y: 0, w: r1, top: r1, bot: r1},
      {z: len + r1 * 0.6, y: 0, w: r1 * 0.7, top: r1 * 0.7, bot: r1 * 0.7}
    ], paint, coat, tan, 10, 3);
    var m = mesh(g, mat, parent); m.rotation.x = Math.PI / 2;
    return m;
  }

  // Aufbau: root (Boden) → hip (Drehpunkt an der Hüfte für Sitz und Platz) → body.
  root.scale.setScalar(B.size);
  var HIP = 0.4 * LEG + 0.02 * (1 - LEG);
  var hip = group(root, 0, HIP, -0.17 * LEN);
  var body = group(hip, 0, 0, 0.17 * LEN);
  var torso = loftGeo([
    {z: -0.25, y: 0.0, w: 0.03, top: 0.03, bot: 0.03},
    {z: -0.222, y: 0.008, w: 0.07, top: 0.068, bot: 0.072},
    {z: -0.155, y: 0.012, w: 0.08, top: 0.072, bot: 0.08},
    {z: -0.065, y: 0.02, w: 0.072, top: 0.066, bot: 0.054},
    {z: 0.035, y: 0.012, w: 0.086, top: 0.072, bot: 0.11},
    {z: 0.115, y: 0.02, w: 0.088, top: 0.072, bot: 0.122},
    {z: 0.18, y: 0.035, w: 0.072, top: 0.068, bot: 0.106},
    {z: 0.222, y: 0.05, w: 0.036, top: 0.04, bot: 0.05}
  ], pat("torso", function (x, y, z) {
    // Brustflecken links und rechts vorn, kleiner Fleck unter der Rute.
    var chest = smooth(0.13, 0.19, z) * smooth(0.0, -0.045, y) * smooth(0.008, 0.022, Math.abs(x)) * (1 - smooth(-0.075, -0.1, y));
    var vent = smooth(-0.21, -0.245, z) * smooth(0.0, -0.03, y);
    return Math.max(chest, vent * 0.9);
  }), coat, tan, 18, 5);
  mesh(sc(torso, WID, Math.pow(WID, 0.85), LEN), mat, body);

  // Hals und Kopf
  var neck = group(body, 0, 0.045 * WID, 0.17 * LEN);
  neck.rotation.x = -0.62;
  mesh(loftGeo([
    {z: -0.03, y: 0, w: 0.06, top: 0.062, bot: 0.075},
    {z: 0.04, y: 0, w: 0.05, top: 0.052, bot: 0.056},
    {z: 0.1, y: 0, w: 0.044, top: 0.046, bot: 0.046},
    {z: 0.135, y: 0, w: 0.04, top: 0.042, bot: 0.04}
  ], pat("neck", null), coat, tan, 14, 3), mat, neck).scale.set(WID, WID, 1);
  var collar = new THREE.Mesh(new THREE.TorusGeometry(0.053, 0.0055, 8, 28), plain(0xb3202a, 0.6));
  collar.position.z = 0.03; collar.scale.set(WID, 1.08 * WID, 1); neck.add(collar); collar.castShadow = true;
  var tag = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.003, 12), new THREE.MeshStandardMaterial({color: 0xd9b44a, metalness: 0.8, roughness: 0.3}));
  tag.rotation.x = Math.PI / 2; tag.position.set(0, -0.064 * WID, 0.034); neck.add(tag);
  var head = group(neck, 0, 0.0, 0.135);
  head.scale.set(1.12 * B.head * (B.headW || 1), 1.12 * B.head, 1.12 * B.head * B.muzzle);
  function yc(z) { return z < 0.03 ? 0 : z < 0.07 ? -0.012 * (z - 0.03) / 0.04 : -0.012 - 0.02 * (z - 0.07) / 0.09; }
  var headGeo = loftGeo([
    {z: -0.07, y: 0.005, w: 0.03, top: 0.03, bot: 0.03},
    {z: -0.045, y: 0.005, w: 0.052, top: 0.054, bot: 0.045},
    {z: -0.005, y: 0.0, w: 0.06, top: 0.058, bot: 0.05},
    {z: 0.035, y: -0.002, w: 0.05, top: 0.044, bot: 0.046},
    {z: 0.07, y: -0.012, w: 0.033, top: 0.03, bot: 0.036},
    {z: 0.115, y: -0.024, w: 0.026, top: 0.023, bot: 0.029},
    {z: 0.15, y: -0.03, w: 0.021, top: 0.019, bot: 0.024},
    {z: 0.163, y: -0.03, w: 0.012, top: 0.012, bot: 0.014}
  ], pat("head", function (x, y, z) {
    var rel = y - yc(z);
    var muzzle = smooth(0.045, 0.075, z) * smooth(0.012, -0.004, rel);
    var cheek = smooth(-0.03, 0.0, z) * (1 - smooth(0.06, 0.08, z)) * smooth(-0.012, -0.03, rel) * smooth(0.025, 0.04, Math.abs(x));
    var chin = smooth(0.0, 0.03, z) * smooth(-0.02, -0.04, rel);
    var nose = smooth(0.145, 0.155, z);
    return Math.max(muzzle, cheek, chin) * (1 - nose);
  }), coat, tan, 18, 4);
  mesh(headGeo, mat, head);
  // Augen, Lohpunkte darüber, Nase
  var eyeMat = new THREE.MeshPhysicalMaterial({color: L.eye, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05});
  var lidMat = new THREE.MeshStandardMaterial({color: L.coat, roughness: 0.5});
  var eyes = [], lids = [];
  [-1, 1].forEach(function (sx) {
    var e = new THREE.Mesh(new THREE.SphereGeometry(0.0125, 16, 12), eyeMat);
    e.position.set(sx * 0.033, 0.016, 0.043); e.scale.set(1, 0.85, 0.8); head.add(e); eyes.push(e);
    var hl = new THREE.Mesh(new THREE.SphereGeometry(0.0032, 8, 6), new THREE.MeshBasicMaterial({color: 0xffffff}));
    hl.position.set(sx * 0.004 + 0.003, 0.005, 0.009); e.add(hl);
    var lid = new THREE.Mesh(new THREE.SphereGeometry(0.0135, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
    lid.position.copy(e.position); lid.rotation.x = 0.4; lid.scale.set(1, 0.05, 0.85); head.add(lid); lids.push(lid);
    var brow = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 8), plain(L.tan, 0.5));
    brow.position.set(sx * 0.03, 0.036, 0.04); brow.scale.set(1.15, 0.7, 0.55); head.add(brow); brow.visible = PAT === "loh";
  });
  var nose = new THREE.Mesh(new THREE.SphereGeometry(0.017, 16, 12), new THREE.MeshPhysicalMaterial({color: 0x101010, roughness: 0.35, clearcoat: 0.4}));
  nose.position.set(0, -0.026, 0.155); nose.scale.set(1.05, 0.78, 0.8); head.add(nose); nose.castShadow = true;
  // Maul für den Stock: ein Punkt vorn unter der Nase
  var mouth = group(head, 0, -0.05, 0.11);

  // Ohren: Grundteil steht schräg, die Spitze knickt ab. Innen rotbraun.
  function earShape(w, h) { var s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.quadraticCurveTo(-w * 0.55, h * 0.6, -w * 0.05, h); s.quadraticCurveTo(w * 0.15, h * 1.02, w * 0.3, h * 0.92); s.quadraticCurveTo(w * 0.62, h * 0.45, w / 2, 0); s.lineTo(-w / 2, 0); return s; }
  var outerM = new THREE.MeshStandardMaterial({color: L.coat, roughness: 0.55, side: THREE.DoubleSide});
  var innerM = new THREE.MeshStandardMaterial({color: L.inner, roughness: 0.7, side: THREE.DoubleSide});
  var ears = [];
  [-1, 1].forEach(function (sx) {
    var hang = B.ear === "haenge", es = B.earSize || 1;
    var base = hang ? group(head, sx * 0.066, 0.03, -0.012) : group(head, sx * 0.036, 0.045, -0.025);
    // Bei Schlappohren zeigt die Innenseite zum Kopf: z spiegeln.
    base.scale.set(es, es * (hang ? 1.1 : 1), hang ? -es : es);
    var baseO = new THREE.Mesh(new THREE.ShapeGeometry(earShape(0.06, 0.044), 6), outerM); base.add(baseO);
    var baseI = new THREE.Mesh(new THREE.ShapeGeometry(earShape(0.046, 0.04), 6), innerM); baseI.position.set(0, 0.002, 0.003); base.add(baseI);
    var tip = group(base, 0.004, 0.041, 0);
    var tipShape = new THREE.Shape(); tipShape.moveTo(-0.028, 0); tipShape.quadraticCurveTo(-0.022, 0.034, 0.004, 0.05); tipShape.quadraticCurveTo(0.026, 0.03, 0.026, 0); tipShape.lineTo(-0.028, 0);
    var tipO = new THREE.Mesh(new THREE.ShapeGeometry(tipShape, 6), outerM); tip.add(tipO);
    var tipI = new THREE.Mesh(new THREE.ShapeGeometry(tipShape, 6), innerM); tipI.scale.set(0.8, 0.85, 1); tipI.position.set(0, 0.001, 0.003); tip.add(tipI);
    baseO.castShadow = tipO.castShadow = true;
    ears.push({base: base, tip: tip, side: sx});
  });

  // Beine. Vorn: Schulter → Ellbogen → Fußwurzel → Pfote. Hinten: Hüfte → Knie → Sprunggelenk → Pfote.
  var pawGeo = loftGeo([
    {z: -0.022, y: 0.0, w: 0.016, top: 0.012, bot: 0.012},
    {z: 0.0, y: 0.0, w: 0.024, top: 0.017, bot: 0.012},
    {z: 0.026, y: -0.002, w: 0.024, top: 0.013, bot: 0.011},
    {z: 0.042, y: -0.004, w: 0.016, top: 0.009, bot: 0.009}
  ], pat("paw", function (x, y, z) { return 1 - 0.75 * smooth(0.02, 0.03, z) * smooth(0.004, 0.0, Math.abs(Math.abs(x) - 0.008)) * smooth(0.0, 0.01, y); }), coat, tan, 12, 3);
  sc(pawGeo, THK, THK, Math.sqrt(THK));
  var legs = [];
  function frontLeg(sx) {
    var sh = group(body, sx * 0.058 * WID, -0.035 * WID, 0.12 * LEN);
    seg(sh, 0.13 * LEG, 0.036 * THK, 0.026 * THK, pat("upper", null), true);
    var el = group(sh, 0, -0.13 * LEG, 0);
    seg(el, 0.165 * LEG, 0.021 * THK, 0.016 * THK, pat("lower", function (x, y, z) { return smooth(0.06, 0.11, z / LEG) * (0.55 + 0.45 * smooth(0, 0.02, y)) + smooth(0.12, 0.15, z / LEG) * 0.45; }));
    var wr = group(el, 0, -0.165 * LEG, 0);
    seg(wr, 0.045 * LEG, 0.016 * THK, 0.015 * THK, pat("foot", function () { return 1; }));
    var paw = group(wr, 0, -0.048 * LEG, 0.006); mesh(pawGeo, mat, paw);
    return {kind: "front", side: sx, a: sh, b: el, c: wr, paw: paw, rest: [0.28, -0.3, -0.18]};
  }
  function hindLeg(sx) {
    var th = group(hip, sx * 0.052 * WID, -0.005, 0.0);
    var thighGeo = loftGeo([
      {z: -0.03, y: 0, w: 0.035, top: 0.04, bot: 0.04},
      {z: 0.0, y: 0, w: 0.046, top: 0.06, bot: 0.05},
      {z: 0.07, y: 0, w: 0.04, top: 0.05, bot: 0.04},
      {z: 0.15, y: 0, w: 0.026, top: 0.03, bot: 0.026},
      {z: 0.165, y: 0, w: 0.02, top: 0.02, bot: 0.02}
    ], pat("upper", function (x, y, z) { return smooth(0.08, 0.14, z) * smooth(0.0, -0.02, x * sx) * 0.7; }), coat, tan, 12, 3);
    var tm = mesh(sc(thighGeo, THK, Math.pow(WID, 0.8), LEG), mat, th); tm.rotation.x = Math.PI / 2;
    var kn = group(th, 0, -0.15 * LEG, 0);
    seg(kn, 0.16 * LEG, 0.022 * THK, 0.015 * THK, pat("lower", function (x, y, z) { return smooth(0.02, 0.1, z / LEG) * (0.35 + 0.65 * smooth(0.005, -0.015, y)); }));
    var ho = group(kn, 0, -0.16 * LEG, 0);
    seg(ho, 0.1 * LEG, 0.016 * THK, 0.014 * THK, pat("foot", function (x, y, z) { return smooth(0.0, 0.04, z / LEG) * 0.6 + 0.4 * smooth(0.04, 0.09, z / LEG); }), true);
    var paw = group(ho, 0, -0.102 * LEG, 0.006); mesh(pawGeo, mat, paw);
    return {kind: "hind", side: sx, a: th, b: kn, c: ho, paw: paw, rest: [-0.38, 0.98, -0.6]};
  }
  // Reihenfolge wie in der Logik: links vorn, rechts vorn, links hinten, rechts hinten (links = +x).
  legs.push(frontLeg(1), frontLeg(-1), hindLeg(1), hindLeg(-1));

  // Rute: dünn, leicht nach oben gebogen
  // Rutenformen: duenn (Pinscher), otter (Labrador, dick und kräftig), buschig (Schäferhund, Collie, hängt tiefer).
  var TAIL = {duenn: {w: [0.016, 0.013, 0.01, 0.009, 0.009, 0.007, 0.004, 0.002], l: 1, x: 0, b: 0},
    otter: {w: [0.034, 0.03, 0.024, 0.02, 0.02, 0.016, 0.01, 0.005], l: 1.25, x: 1.0, b: -0.2},
    buschig: {w: [0.026, 0.034, 0.036, 0.034, 0.034, 0.032, 0.024, 0.01], l: 1.55, x: 1.7, b: -0.5}}[B.tail] || {};
  var TL = (TAIL.l || 1) * (B.tailLen || 1), TW = TAIL.w;
  var tail = group(body, 0, 0.055 * WID, -0.255 * LEN);
  var tail2;
  (function () {
    var t1 = group(tail, 0, 0, 0);
    mesh(loftGeo([
      {z: -0.01, y: 0, w: TW[0], top: TW[0], bot: TW[0]}, {z: 0.05 * TL, y: 0, w: TW[1], top: TW[1], bot: TW[1]}, {z: 0.1 * TL, y: 0, w: TW[2], top: TW[2], bot: TW[2]}, {z: 0.11 * TL, y: 0, w: TW[3], top: TW[3], bot: TW[3]}
    ], pat("tail", null), coat, tan, 8, 3), mat, t1);
    tail2 = group(t1, 0, 0, 0.105 * TL);
    mesh(loftGeo([
      {z: -0.005, y: 0, w: TW[4], top: TW[4], bot: TW[4]}, {z: 0.05 * TL, y: 0, w: TW[5], top: TW[5], bot: TW[5]}, {z: 0.1 * TL, y: 0, w: TW[6], top: TW[6], bot: TW[6]}, {z: 0.11 * TL, y: 0, w: TW[7], top: TW[7], bot: TW[7]}
    ], pat("tail", null), coat, tan, 8, 3), mat, tail2);
  })();

  // Fürs Antippen: unsichtbarer, großzügiger Körper
  var hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.75), new THREE.MeshBasicMaterial({visible: false}));
  hit.position.set(0, 0.32, 0.05); root.add(hit);
  hit.userData.pick = {type: "dog"};

  var tmp = new THREE.Vector3();
  var api = {
    root: root, mouth: mouth, head: head, hit: hit, look: L, breed: B,
    // d: Hundezustand aus der Logik (x, z, yaw, gait, phase, gaitBlend, pose, wag, wagPhase, look)
    update: function (d, time, dt) {
      var P = d.pose || {}, sit = P.sit || 0, down = P.down || 0, paw = P.paw || 0, sniff = P.sniff || 0, squat = P.squat || 0, pee = P.pee || 0, sleep = P.sleep || 0, shake = P.shake || 0, beg = P.beg || 0;
      root.position.set(d.x, 0, d.z);
      root.rotation.y = d.yaw;
      var gait = d.gait || "stand", blend = d.gaitBlend || 0, ph = d.phase || 0;
      var amp = gait === "gallop" ? 0.62 : gait === "trot" ? 0.48 : 0.34;
      var lieF = Math.max(0, down - sit * 0.5);
      // Hüfte: Sitz kippt den Körper nach oben, Platz legt ihn flach ab.
      var drop = (sit * 0.22 * (1 - down) + down * 0.25 + squat * 0.09) * (0.3 + 0.7 * LEG);
      hip.position.y = HIP - drop;
      hip.rotation.x = -0.58 * sit * (1 - down) - squat * 0.12;
      var bob = gait === "gallop" ? Math.sin(ph * Math.PI * 2) * 0.02 : Math.sin(ph * Math.PI * 4) * 0.007;
      hip.position.y += bob * blend;
      body.rotation.x = gait === "gallop" ? Math.sin(ph * Math.PI * 2 + 1) * 0.07 * blend : 0;
      hip.rotation.z = Math.sin(time * 38) * 0.22 * shake;
      legs.forEach(function (lg, i) {
        var lp = Hund.legPose(gait, ph, i), s = lp.s * blend, l = lp.l * blend;
        var r = lg.rest, a = r[0], b = r[1], c = r[2];
        if (lg.kind === "front") {
          a += -s * amp; b += l * 1.1; c += l * 0.9;
          // Sitz: Vorderbeine bleiben senkrecht, Platz: nach vorn gestreckt.
          a += 0.58 * sit * (1 - down);
          a += lieF * -1.2; b += lieF * -0.2; c += lieF * 0.1;
          if (lg.side < 0) { a += paw * -1.25; b += paw * 0.75; c += paw * 0.5; }
          lg.a.rotation.z = 0;
        } else {
          a += -s * amp * 0.9; b += l * 0.55; c += -l * 0.85;
          var fold = Math.max(sit, down);
          a += fold * -0.25; b += fold * 1.45; c += fold * -1.95;
          a += squat * -0.45; b += squat * 0.7; c += squat * -0.5;
          lg.a.rotation.z = lg.side > 0 ? pee * 1.15 : 0;
          if (lg.side > 0) { b += pee * 0.5; }
        }
        lg.a.rotation.x = a; lg.b.rotation.x = b; lg.c.rotation.x = c;
      });
      // Kopf: schaut zum Ziel, schnüffelt, legt sich zum Schlafen ab, neigt sich beim Betteln.
      var lookYaw = 0;
      if (d.look) lookYaw = Math.max(-0.8, Math.min(0.8, Hund.angDiff(d.yaw, Math.atan2(d.look.x - d.x, d.look.z - d.z))));
      neck.rotation.y += (lookYaw * 0.7 - neck.rotation.y) * Math.min(1, dt * 5);
      neck.rotation.x = -0.62 + 0.58 * sit * (1 - down) * 0.75 + sniff * 1.0 + sleep * 0.95 - down * 0.3 - beg * 0.1 + (gait === "gallop" ? 0.35 * blend : 0) + Math.sin(ph * Math.PI * 4) * 0.03 * blend;
      head.rotation.x = 0.62 + 0.12 - 0.58 * sit * (1 - down) * 0.45 + sniff * 0.3 - sleep * 0.3 + down * 0.25;
      head.rotation.z = beg * 0.28 * Math.sin(time * 1.3);
      head.rotation.y = lookYaw * 0.3;
      // Ohren: aufmerksam bei guter Laune, flattern beim Laufen
      var perk = 0.4 + 0.6 * Math.min(1, (d.wag || 0) * 1.3);
      var flap = Math.sin(ph * Math.PI * 4) * 0.12 * blend + Math.sin(time * 40) * 0.5 * shake;
      ears.forEach(function (e) {
        // Rechtes Ohr (-x) steht und knickt die Spitze nach vorn, linkes Ohr (+x) kippt halb zur Seite.
        var sx = e.side;
        if (B.ear === "haenge") {
          // Schlappohren liegen seitlich am Kopf und schwingen beim Laufen.
          e.base.rotation.set(flap * 0.5 + 0.1, sx * Math.PI / 2, -sx * (2.95 - (perk - 0.4) * 0.15) + flap * 0.3 * sx);
          e.tip.rotation.set(0.1 + flap * 0.4, 0, 0);
          return;
        }
        e.base.rotation.x = -0.2 + flap;
        e.base.rotation.y = 0.3 * sx;
        if (B.ear === "steh") {
          e.base.rotation.z = -sx * (0.22 + (1 - perk) * 0.2);
          e.tip.rotation.x = 0.05 + flap * 0.3; e.tip.rotation.z = 0;
          return;
        }
        if (B.ear === "halb") {
          e.base.rotation.z = -sx * (0.35 + (1 - perk) * 0.2);
          e.tip.rotation.x = 1.15 + flap * 0.6; e.tip.rotation.z = 0;
          return;
        }
        e.base.rotation.z = sx > 0 ? -(0.75 + (1 - perk) * 0.35) : (0.22 + (1 - perk) * 0.25);
        e.tip.rotation.x = (sx > 0 ? 0.75 : 1.35) + flap * 0.6;
        e.tip.rotation.z = sx > 0 ? -0.25 : 0.12;
      });
      // Rute wedelt
      var wag = d.wag || 0, wp = d.wagPhase || 0;
      tail.rotation.order = "YXZ";
      tail.rotation.y = Math.PI + Math.sin(wp) * (0.15 + 0.55 * wag);
      tail.rotation.x = -0.22 - wag * 0.22 + sleep * 0.6 + squat * -0.4 + down * 0.3 + (TAIL.x || 0) * (1 - wag * 0.5);
      tail2.rotation.x = -0.25 - wag * 0.1 + (TAIL.b || 0);
      tail2.rotation.y = Math.sin(wp - 0.6) * 0.3 * wag;
      // Augen zu im Schlaf, Atmen
      lids.forEach(function (l) { l.scale.y = 0.05 + sleep * 0.95; });
      body.scale.set(1 + Math.sin(time * (sleep ? 1.6 : 3)) * 0.012, 1, 1);
      // Pfoten auf den Boden: tiefste Pfote berührt y = 0.
      root.updateMatrixWorld(true);
      var minY = 1e9;
      legs.forEach(function (lg) { lg.paw.getWorldPosition(tmp); minY = Math.min(minY, tmp.y); });
      var bellyY = 1e9;
      if (down > 0.5) { body.getWorldPosition(tmp); bellyY = tmp.y - 0.11; }
      var lift = -Math.min(minY - 0.013, bellyY);
      root.position.y = Math.abs(lift) < 0.4 ? lift : 0;
      root.updateMatrixWorld(true);
    }
  };
  root.traverse(function (o) { if (o.isMesh && o !== hit) o.userData.pick = {type: "dog"}; });
  return api;
}
