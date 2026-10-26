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

function makeDog(lookIdx) {
  var L = DOG_LOOKS[lookIdx || 0] || DOG_LOOKS[0];
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
  var hip = group(root, 0, 0.4, -0.17);
  var body = group(hip, 0, 0, 0.17);
  var torso = loftGeo([
    {z: -0.25, y: 0.0, w: 0.03, top: 0.03, bot: 0.03},
    {z: -0.222, y: 0.008, w: 0.07, top: 0.068, bot: 0.072},
    {z: -0.155, y: 0.012, w: 0.08, top: 0.072, bot: 0.08},
    {z: -0.065, y: 0.02, w: 0.072, top: 0.066, bot: 0.054},
    {z: 0.035, y: 0.012, w: 0.086, top: 0.072, bot: 0.11},
    {z: 0.115, y: 0.02, w: 0.088, top: 0.072, bot: 0.122},
    {z: 0.18, y: 0.035, w: 0.072, top: 0.068, bot: 0.106},
    {z: 0.222, y: 0.05, w: 0.036, top: 0.04, bot: 0.05}
  ], function (x, y, z) {
    // Brustflecken links und rechts vorn, kleiner Fleck unter der Rute.
    var chest = smooth(0.13, 0.19, z) * smooth(0.0, -0.045, y) * smooth(0.008, 0.022, Math.abs(x)) * (1 - smooth(-0.075, -0.1, y));
    var vent = smooth(-0.21, -0.245, z) * smooth(0.0, -0.03, y);
    return Math.max(chest, vent * 0.9);
  }, coat, tan, 18, 5);
  mesh(torso, mat, body);

  // Hals und Kopf
  var neck = group(body, 0, 0.045, 0.17);
  neck.rotation.x = -0.62;
  mesh(loftGeo([
    {z: -0.03, y: 0, w: 0.06, top: 0.062, bot: 0.075},
    {z: 0.04, y: 0, w: 0.05, top: 0.052, bot: 0.056},
    {z: 0.1, y: 0, w: 0.044, top: 0.046, bot: 0.046},
    {z: 0.135, y: 0, w: 0.04, top: 0.042, bot: 0.04}
  ], null, coat, tan, 14, 3), mat, neck);
  var collar = new THREE.Mesh(new THREE.TorusGeometry(0.053, 0.0055, 8, 28), plain(0xb3202a, 0.6));
  collar.position.z = 0.03; collar.scale.set(1, 1.08, 1); neck.add(collar); collar.castShadow = true;
  var tag = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.003, 12), new THREE.MeshStandardMaterial({color: 0xd9b44a, metalness: 0.8, roughness: 0.3}));
  tag.rotation.x = Math.PI / 2; tag.position.set(0, -0.064, 0.034); neck.add(tag);
  var head = group(neck, 0, 0.0, 0.135);
  head.scale.setScalar(1.12);
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
  ], function (x, y, z) {
    var rel = y - yc(z);
    var muzzle = smooth(0.045, 0.075, z) * smooth(0.012, -0.004, rel);
    var cheek = smooth(-0.03, 0.0, z) * (1 - smooth(0.06, 0.08, z)) * smooth(-0.012, -0.03, rel) * smooth(0.025, 0.04, Math.abs(x));
    var chin = smooth(0.0, 0.03, z) * smooth(-0.02, -0.04, rel);
    var nose = smooth(0.145, 0.155, z);
    return Math.max(muzzle, cheek, chin) * (1 - nose);
  }, coat, tan, 18, 4);
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
    brow.position.set(sx * 0.03, 0.036, 0.04); brow.scale.set(1.15, 0.7, 0.55); head.add(brow);
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
    var base = group(head, sx * 0.036, 0.045, -0.025);
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
  ], function (x, y, z) { return 1 - 0.75 * smooth(0.02, 0.03, z) * smooth(0.004, 0.0, Math.abs(Math.abs(x) - 0.008)) * smooth(0.0, 0.01, y); }, coat, tan, 12, 3);
  var legs = [];
  function frontLeg(sx) {
    var sh = group(body, sx * 0.058, -0.035, 0.12);
    seg(sh, 0.13, 0.036, 0.026, null, true);
    var el = group(sh, 0, -0.13, 0);
    seg(el, 0.165, 0.021, 0.016, function (x, y, z) { return smooth(0.06, 0.11, z) * (0.55 + 0.45 * smooth(0, 0.02, y)) + smooth(0.12, 0.15, z) * 0.45; });
    var wr = group(el, 0, -0.165, 0);
    seg(wr, 0.045, 0.016, 0.015, function () { return 1; });
    var paw = group(wr, 0, -0.048, 0.006); mesh(pawGeo, mat, paw);
    return {kind: "front", side: sx, a: sh, b: el, c: wr, paw: paw, rest: [0.28, -0.3, -0.18]};
  }
  function hindLeg(sx) {
    var th = group(hip, sx * 0.052, -0.005, 0.0);
    var thighGeo = loftGeo([
      {z: -0.03, y: 0, w: 0.035, top: 0.04, bot: 0.04},
      {z: 0.0, y: 0, w: 0.046, top: 0.06, bot: 0.05},
      {z: 0.07, y: 0, w: 0.04, top: 0.05, bot: 0.04},
      {z: 0.15, y: 0, w: 0.026, top: 0.03, bot: 0.026},
      {z: 0.165, y: 0, w: 0.02, top: 0.02, bot: 0.02}
    ], function (x, y, z) { return smooth(0.08, 0.14, z) * smooth(0.0, -0.02, x * sx) * 0.7; }, coat, tan, 12, 3);
    var tm = mesh(thighGeo, mat, th); tm.rotation.x = Math.PI / 2;
    var kn = group(th, 0, -0.15, 0);
    seg(kn, 0.16, 0.022, 0.015, function (x, y, z) { return smooth(0.02, 0.1, z) * (0.35 + 0.65 * smooth(0.005, -0.015, y)); });
    var ho = group(kn, 0, -0.16, 0);
    seg(ho, 0.1, 0.016, 0.014, function (x, y, z) { return smooth(0.0, 0.04, z) * 0.6 + 0.4 * smooth(0.04, 0.09, z); }, true);
    var paw = group(ho, 0, -0.102, 0.006); mesh(pawGeo, mat, paw);
    return {kind: "hind", side: sx, a: th, b: kn, c: ho, paw: paw, rest: [-0.38, 0.98, -0.6]};
  }
  // Reihenfolge wie in der Logik: links vorn, rechts vorn, links hinten, rechts hinten (links = +x).
  legs.push(frontLeg(1), frontLeg(-1), hindLeg(1), hindLeg(-1));

  // Rute: dünn, leicht nach oben gebogen
  var tail = group(body, 0, 0.055, -0.255);
  var tail2;
  (function () {
    var t1 = group(tail, 0, 0, 0);
    mesh(loftGeo([
      {z: -0.01, y: 0, w: 0.016, top: 0.016, bot: 0.016}, {z: 0.05, y: 0, w: 0.013, top: 0.013, bot: 0.013}, {z: 0.1, y: 0, w: 0.01, top: 0.01, bot: 0.01}, {z: 0.11, y: 0, w: 0.009, top: 0.009, bot: 0.009}
    ], null, coat, tan, 8, 3), mat, t1);
    tail2 = group(t1, 0, 0, 0.105);
    mesh(loftGeo([
      {z: -0.005, y: 0, w: 0.009, top: 0.009, bot: 0.009}, {z: 0.05, y: 0, w: 0.007, top: 0.007, bot: 0.007}, {z: 0.1, y: 0, w: 0.004, top: 0.004, bot: 0.004}, {z: 0.11, y: 0, w: 0.002, top: 0.002, bot: 0.002}
    ], null, coat, tan, 8, 3), mat, tail2);
  })();

  // Fürs Antippen: unsichtbarer, großzügiger Körper
  var hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.75), new THREE.MeshBasicMaterial({visible: false}));
  hit.position.set(0, 0.32, 0.05); root.add(hit);
  hit.userData.pick = {type: "dog"};

  var tmp = new THREE.Vector3();
  var api = {
    root: root, mouth: mouth, head: head, hit: hit, look: L,
    // d: Hundezustand aus der Logik (x, z, yaw, gait, phase, gaitBlend, pose, wag, wagPhase, look)
    update: function (d, time, dt) {
      var P = d.pose || {}, sit = P.sit || 0, down = P.down || 0, paw = P.paw || 0, sniff = P.sniff || 0, squat = P.squat || 0, pee = P.pee || 0, sleep = P.sleep || 0, shake = P.shake || 0, beg = P.beg || 0;
      root.position.x = d.x; root.position.z = d.z;
      root.rotation.y = d.yaw;
      var gait = d.gait || "stand", blend = d.gaitBlend || 0, ph = d.phase || 0;
      var amp = gait === "gallop" ? 0.62 : gait === "trot" ? 0.48 : 0.34;
      var lieF = Math.max(0, down - sit * 0.5);
      // Hüfte: Sitz kippt den Körper nach oben, Platz legt ihn flach ab.
      var drop = sit * 0.22 * (1 - down) + down * 0.25 + squat * 0.09;
      hip.position.y = 0.4 - drop;
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
        e.base.rotation.x = -0.2 + flap;
        e.base.rotation.y = 0.3 * sx;
        e.base.rotation.z = sx > 0 ? -(0.75 + (1 - perk) * 0.35) : (0.22 + (1 - perk) * 0.25);
        e.tip.rotation.x = (sx > 0 ? 0.75 : 1.35) + flap * 0.6;
        e.tip.rotation.z = sx > 0 ? -0.25 : 0.12;
      });
      // Rute wedelt
      var wag = d.wag || 0, wp = d.wagPhase || 0;
      tail.rotation.order = "YXZ";
      tail.rotation.y = Math.PI + Math.sin(wp) * (0.15 + 0.55 * wag);
      tail.rotation.x = -0.22 - wag * 0.22 + sleep * 0.6 + squat * -0.4 + down * 0.3;
      tail2.rotation.x = -0.25 - wag * 0.1;
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
      root.position.y = Math.abs(lift) < 0.25 ? lift : 0;
      root.updateMatrixWorld(true);
    }
  };
  root.traverse(function (o) { if (o.isMesh && o !== hit) o.userData.pick = {type: "dog"}; });
  return api;
}
