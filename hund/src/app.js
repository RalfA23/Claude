// Hundeleben: Spielschleife, Kamera, Bedienung (antippen wie bei den Sims, Tastatur, Joystick), Anzeige,
// Ton, Speichern (Browser und Konto) und Spazieren zu zweit über Supabase Realtime.
// Erwartet THREE, Hund (Logik), makeDog, DOG_BREEDS, dogBreed, buildWorld3D und makePerson im Modul-Scope.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var SAVE_KEY = "hund-stand-v1", SET_KEY = "hund-einstellungen";
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function el(tag, attrs, kids) {
    var d = document.createElement(tag);
    for (var k in attrs || {}) { if (k === "text") d.textContent = attrs[k]; else if (k === "class") d.className = attrs[k]; else if (k.slice(0, 2) === "on") d.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] != null) d.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) d.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return d;
  }
  var settings = Object.assign({name: "", look: 0, breed: "pinscher", gender: "m", sound: true, joy: null}, store(SET_KEY) || {});
  function saveSettings() { store(SET_KEY, settings); }

  /* ---------- Welt, Szene, Licht ---------- */
  var W = Hund.buildWorld(7), N = Hund.buildNav(W, 0.3);
  var canvas = $("cv"), mobile = matchMedia("(pointer: coarse)").matches;
  var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: !mobile || devicePixelRatio < 2, powerPreference: "high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.6 : 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x9fcbe8, 45, 150);
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 400);
  var hemi = new THREE.HemisphereLight(0xdfefff, 0x5a6a3a, 0.9); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xfff2dd, 2.4); sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  var sc = sun.shadow.camera; sc.left = -18; sc.right = 18; sc.top = 18; sc.bottom = -18; sc.near = 1; sc.far = 120; sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.04;
  scene.add(sun); scene.add(sun.target);
  var nightLight = new THREE.PointLight(0xffd9a0, 0, 16, 1.6); scene.add(nightLight);
  var world = buildWorld3D(scene, W);

  /* ---------- Figuren ---------- */
  var dog = null, person = null;
  function setPerson() { if (person) scene.remove(person.root); person = makePerson(0, settings.gender); scene.add(person.root); }
  function setDogLook() { if (dog) scene.remove(dog.root); dog = makeDog(settings.look || 0, settings.breed); scene.add(dog.root); }
  setPerson(); setDogLook();
  var plumbob = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), new THREE.MeshStandardMaterial({color: 0x37d058, emissive: 0x1c8a30, emissiveIntensity: 0.8, roughness: 0.3}));
  plumbob.scale.set(1, 1.7, 1); scene.add(plumbob);
  var leashMat = new THREE.MeshStandardMaterial({color: 0xb3202a, roughness: 0.6}), leash = null;
  var marker = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.3, 24), new THREE.MeshBasicMaterial({color: 0xffcf4a, transparent: true, opacity: 0, depthWrite: false}));
  marker.rotation.x = -Math.PI / 2; scene.add(marker);
  var itemMeshes = {}, poopMeshes = {}, puddleMeshes = {};
  var stickMat = new THREE.MeshStandardMaterial({color: 0x7a5533, roughness: 0.9}), ballMat = new THREE.MeshStandardMaterial({color: 0xc9e04a, roughness: 0.7});
  function itemMesh(it) {
    var g = new THREE.Group();
    if (it.kind === "ball") { var b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), ballMat); b.castShadow = true; g.add(b); }
    else { var s = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, it.len || 0.6, 6), stickMat); s.rotation.z = Math.PI / 2; s.castShadow = true; g.add(s); var tw = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.01, 0.15, 5), stickMat); tw.position.set(0.1, 0.05, 0); tw.rotation.z = -0.6; g.add(tw); }
    var hit = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 4), new THREE.MeshBasicMaterial({visible: false})); g.add(hit);
    hit.userData.pick = {type: "item", id: it.id};
    scene.add(g); return {g: g, hit: hit};
  }
  var poopMat = new THREE.MeshStandardMaterial({color: 0x4e3018, roughness: 0.5}), puddleMat = new THREE.MeshStandardMaterial({color: 0xd9c45a, roughness: 0.05, transparent: true, opacity: 0.6, depthWrite: false});
  function poopMesh(q) {
    var g = new THREE.Group(); g.position.set(q.x, 0, q.z);
    [[0, 0.03, 0.05], [0.01, 0.07, 0.038], [0, 0.1, 0.025]].forEach(function (a) { var s = new THREE.Mesh(new THREE.SphereGeometry(a[2], 10, 8), poopMat); s.position.set(a[0], a[1], 0); s.scale.y = 0.8; g.add(s); });
    var hit = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 4), new THREE.MeshBasicMaterial({visible: false})); g.add(hit); hit.userData.pick = {type: "poop", id: q.id};
    scene.add(g); return {g: g, hit: hit};
  }
  function puddleMesh(q) {
    var m = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), puddleMat); m.rotation.x = -Math.PI / 2; m.position.set(q.x, 0.035, q.z); m.scale.set(1, 0.7, 1); scene.add(m);
    m.userData.pick = {type: "puddle", id: q.id};
    return {g: m, hit: m};
  }

  /* ---------- Spielstand ---------- */
  var sim = null, running = false, accSave = null;
  function newSim(save) {
    sim = new Hund.Sim({world: W, nav: N, name: settings.name || "Hund", seed: (save && save.seed) || Math.floor(Math.random() * 1e6) + 1, multi: !!Net.code, save: save});
    if (save && save.seed) sim.seed = save.seed;
    Object.keys(itemMeshes).forEach(function (k) { scene.remove(itemMeshes[k].g); }); itemMeshes = {};
    sim.items.forEach(function (it) { itemMeshes[it.id] = itemMesh(it); });
    warned = {}; lastTaskKey = "";
    cam.fx = sim.p.x; cam.fz = sim.p.z;
  }
  function saveLocal() { if (!sim) return; var s = sim.save(); s.seed = sim.seed; store(SAVE_KEY, {sim: s, name: sim.name, look: settings.look, breed: settings.breed, gender: settings.gender}); return s; }
  function saveAll(force) {
    var s = saveLocal(); if (!s || !Acc.user) return;
    var now = Date.now(); if (!force && now - Acc.last < 60000) return; Acc.last = now;
    Acc.sb.from("schach_docs").upsert({user_id: Acc.user.id, path: "hund/stand", data: {sim: s, name: sim.name, look: settings.look, breed: settings.breed, gender: settings.gender}, updated_at: new Date().toISOString()}).then(function () {}, function () {});
  }
  var Acc = {sb: null, user: null, last: 0};
  setInterval(function () { if (running) saveAll(false); }, 5000);
  document.addEventListener("visibilitychange", function () { if (document.hidden && running) saveAll(true); });
  window.addEventListener("pagehide", function () { if (running) saveAll(true); });

  /* ---------- Kamera ---------- */
  var cam = {yaw: Math.PI * 0.85, pitch: 0.92, dist: innerWidth < innerHeight ? 13 : 10, fx: 0, fz: 0, fy: 0.6};
  function resize() { var w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  window.addEventListener("resize", resize);
  function placeCamera(dt) {
    var p = sim ? sim.p : W.start, k = Math.min(1, dt * 6);
    cam.fx += (p.x - cam.fx) * k; cam.fz += (p.z - cam.fz) * k;
    var cp = Math.cos(cam.pitch), d = cam.dist;
    camera.position.set(cam.fx + Math.sin(cam.yaw) * cp * d, cam.fy + Math.sin(cam.pitch) * d, cam.fz + Math.cos(cam.yaw) * cp * d);
    camera.lookAt(cam.fx, cam.fy, cam.fz);
  }

  /* ---------- Licht nach Uhrzeit ---------- */
  var skyDay = new THREE.Color(0x9fcbe8), skyDusk = new THREE.Color(0xe9a36d), skyNight = new THREE.Color(0x0c1530), skyC = new THREE.Color();
  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function lighting(t) {
    var h = (t % 1440) / 60, el = Math.sin(Math.PI * (h - 6) / 14.5), day = smooth(-0.08, 0.3, el), dusk = smooth(0.35, 0.0, Math.abs(el)) * smooth(-0.25, 0.05, el);
    skyC.copy(skyNight).lerp(skyDay, day).lerp(skyDusk, dusk * 0.6);
    scene.background = skyC; scene.fog.color.copy(skyC);
    var az = Math.PI * (h - 6) / 12;
    var fx = cam.fx, fz = cam.fz;
    sun.position.set(fx + Math.cos(az) * 30, 8 + Math.max(0.05, el) * 40, fz - 18 + Math.sin(az) * 10);
    sun.target.position.set(fx, 0, fz);
    sun.intensity = 2.6 * day + 0.25 * (1 - day);
    sun.color.setHSL(0.1, 0.6, 0.6 + 0.3 * day);
    hemi.intensity = 0.28 + 0.75 * day;
    world.lampMats.forEach(function (m) { m.emissiveIntensity = (1 - day) * 2.2; });
    var inside = sim && Hund.inHouse(sim.p), room = sim && Hund.roomOf(sim.p);
    nightLight.intensity = (1 - day) * (inside ? 14 : 5);
    if (room) nightLight.position.set((room.x0 + room.x1) / 2, 2.3, (room.z0 + room.z1) / 2);
    else nightLight.position.set(fx, 3.5, fz);
    return day;
  }

  /* ---------- Ton (alles per WebAudio) ---------- */
  var AC = null;
  function audio() { if (!settings.sound) return null; if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (AC.state === "suspended") AC.resume(); return AC; }
  function noiseBuf(ac) { if (noiseBuf.b) return noiseBuf.b; var b = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noiseBuf.b = b; return b; }
  function bark(vol) {
    var ac = audio(); if (!ac) return;
    var t = ac.currentTime;
    for (var k = 0; k < 2; k++) {
      var t0 = t + k * 0.22, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), n = ac.createBufferSource(), ng = ac.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(520, t0); o.frequency.exponentialRampToValueAtTime(260, t0 + 0.12);
      f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 2;
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.22 * (vol || 1), t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      n.buffer = noiseBuf(ac); ng.gain.setValueAtTime(0.12 * (vol || 1), t0); ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
      o.connect(f); n.connect(ng); ng.connect(f); f.connect(g); g.connect(ac.destination);
      o.start(t0); o.stop(t0 + 0.16); n.start(t0); n.stop(t0 + 0.1);
    }
  }
  function tone(freqs, dur, type, vol) {
    var ac = audio(); if (!ac) return;
    freqs.forEach(function (fq, i) {
      var t0 = ac.currentTime + i * dur * 0.6, o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "sine"; o.frequency.value = fq; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol || 0.12, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    });
  }
  function whine() { var ac = audio(); if (!ac) return; var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(900, t); o.frequency.linearRampToValueAtTime(1300, t + 0.3); o.frequency.linearRampToValueAtTime(800, t + 0.7); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.75); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.8); }
  function chirp() { var ac = audio(); if (!ac) return; var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), b = 2400 + Math.random() * 1600; o.frequency.setValueAtTime(b, t); for (var i = 0; i < 4; i++) o.frequency.linearRampToValueAtTime(b * (i % 2 ? 0.8 : 1.25), t + 0.05 * (i + 1)); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.025, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.3); }

  /* ---------- Anzeige ---------- */
  var toastsBox = $("toasts");
  function toast(text, kind) {
    var t = el("div", {class: "toast " + (kind || ""), text: text}); toastsBox.appendChild(t);
    while (toastsBox.children.length > 4) toastsBox.removeChild(toastsBox.firstChild);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 500); }, kind === "good" ? 3800 : 4600);
  }
  function needColor(v) { return v > 60 ? "#4cd964" : v > 30 ? "#ffcc00" : "#ff5a4f"; }
  var needEls = {};
  function buildNeeds() {
    var box = $("needList"); box.replaceChildren(); needEls = {};
    Hund.DOG_NEEDS.forEach(function (k) { var bar = el("i"), row = el("div", {class: "need", title: k.name}, [el("span", {text: k.icon}), el("b", {text: k.name}), el("em", {}, [bar])]); box.appendChild(row); needEls["d_" + k.id] = bar; });
    var me = $("meList"); me.replaceChildren();
    Hund.ME_NEEDS.forEach(function (k) { var bar = el("i"), row = el("div", {class: "need", title: k.name}, [el("span", {text: k.icon}), el("b", {text: k.name}), el("em", {}, [bar])]); me.appendChild(row); needEls["m_" + k.id] = bar; });
  }
  function updateNeeds() {
    Hund.DOG_NEEDS.forEach(function (k) { var v = sim.need[k.id], b = needEls["d_" + k.id]; b.style.width = Math.max(3, v) + "%"; b.style.background = needColor(v); });
    Hund.ME_NEEDS.forEach(function (k) { var v = sim.me[k.id], b = needEls["m_" + k.id]; b.style.width = Math.max(3, v) + "%"; b.style.background = needColor(v); });
    var m = Hund.mood(sim.need);
    $("moodDot").style.background = needColor(m); $("dogName").textContent = sim.name;
    $("needChip").replaceChildren.apply($("needChip"), Hund.DOG_NEEDS.filter(function (k) { return sim.need[k.id] < 40; }).map(function (k) { return el("span", {text: k.icon, style: "--c:" + needColor(sim.need[k.id])}); }));
    if (!$("needChip").children.length) $("needChip").textContent = "😊";
  }
  var lastTaskKey = "";
  function updateTasks() {
    var key = sim.day + "|" + sim.tasks.map(function (t) { return t.id + t.have + t.done + t.failed; }).join(",");
    if (key === lastTaskKey) return; lastTaskKey = key;
    var box = $("taskList"); box.replaceChildren();
    var done = 0;
    sim.tasks.forEach(function (t) {
      if (t.done) done++;
      var time = t.until != null ? "bis " + Hund.fmtTime(t.until) : t.from != null ? "ab " + Hund.fmtTime(t.from) : "";
      var prog = t.need > 1 && !t.done ? " (" + Math.floor(t.have) + "/" + t.need + (t.unit ? " " + t.unit : "") + ")" : "";
      box.appendChild(el("li", {class: t.done ? "done" : t.failed ? "failed" : ""}, [el("span", {class: "ck", text: t.done ? "✓" : t.failed ? "✗" : "○"}), el("span", {text: sim.text(t.text) + prog}), time ? el("small", {text: time}) : null]));
    });
    $("taskCount").textContent = done + "/" + sim.tasks.length;
  }
  function updateClock() {
    var tm = sim.t % 1440, wd = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][(sim.day - 1) % 7];
    $("clock").textContent = "Tag " + sim.day + " · " + wd + " " + Hund.fmtTime(tm);
    [].forEach.call(document.querySelectorAll("#speed button"), function (b) { b.classList.toggle("on", +b.dataset.s === sim.speed); });
    $("bThrow").hidden = !sim.p.holding;
    $("bLeash").classList.toggle("on", sim.d.leash);
    $("bLeash").lastChild.textContent = sim.d.leash ? "Leine ab" : "Anleinen";
    $("bags").hidden = !sim.p.bags; $("bags").textContent = "🛍️ " + sim.p.bags;
  }
  var tv = new THREE.Vector3();
  function screenPos(x, y, z) { tv.set(x, y, z).project(camera); return {x: (tv.x * 0.5 + 0.5) * canvas.clientWidth, y: (-tv.y * 0.5 + 0.5) * canvas.clientHeight, vis: tv.z < 1 && tv.z > -1}; }
  var BUBBLE = {hunger: "🍖", durst: "💧", blase: "🌳", energie: "💤", spass: "🎾", liebe: "❤️", sauber: "🛁"};
  function updateFloating() {
    var d = sim.d, b = $("bubble"), icon = null;
    if (d.mode === "sleep") icon = "💤"; else if (d.mode === "whine") icon = "🚪🌳"; else if (d.mode === "beg" && d.bubble === "spass") icon = "🎾"; else if (d.bubble) icon = BUBBLE[d.bubble];
    if (icon) { var s = screenPos(d.x, 0.95, d.z); b.hidden = !s.vis; b.style.transform = "translate(" + (s.x - 22) + "px," + (s.y - 50) + "px)"; b.textContent = icon; } else b.hidden = true;
    var a = sim.p.act, lab = $("actLabel");
    if (a && a.id !== "schlafen") {
      var s2 = screenPos(sim.p.x, 2.15, sim.p.z), left = Math.max(0, Math.ceil(a.left));
      lab.hidden = !s2.vis; lab.style.transform = "translate(calc(" + s2.x + "px - 50%)," + (s2.y - 30) + "px)";
      $("actText").textContent = a.label + (a.total > 1 ? " · " + left + " Min." : "");
      $("actBar").style.width = (a.total > 0 ? 100 * (1 - a.left / a.total) : 0) + "%";
    } else lab.hidden = true;
    $("sleepShade").hidden = !sim.sleeping;
    Object.keys(Net.others).forEach(function (id) {
      var o = Net.others[id], tag = Net.tags[id]; if (!o.view || !tag) return;
      var s3 = screenPos(o.view.p.x, 2.2, o.view.p.z); tag.hidden = !s3.vis; tag.style.transform = "translate(calc(" + s3.x + "px - 50%)," + (s3.y - 20) + "px)";
    });
  }

  /* ---------- Ereignisse aus der Simulation ---------- */
  var warned = {};
  function handleEvents() {
    var evs = sim.events.splice(0), nm = sim.name;
    evs.forEach(function (e) {
      switch (e.type) {
        case "say": toast(sim.text(e.text)); break;
        case "taskDone": toast("✓ " + e.text, "good"); tone([660, 880, 1320], 0.18, "sine", 0.1); break;
        case "taskFailed": toast("Verpasst: " + e.text, "bad"); break;
        case "fed": toast("Napf gefüllt."); tone([520], 0.08, "triangle", 0.08); break;
        case "watered": toast("Frisches Wasser steht bereit."); break;
        case "accident": toast("Oh nein, " + nm + " hat in die Wohnung gemacht. Tipp die Pfütze an und wisch sie auf.", "bad"); break;
        case "poop": toast(nm + " hat einen Haufen gemacht. Antippen, einpacken und in einen Mülleimer werfen."); break;
        case "bagged": toast("Eingepackt. Jetzt ab in einen Mülleimer."); tone([440], 0.06, "square", 0.04); break;
        case "binned": toast("Entsorgt. Danke!"); break;
        case "whine": whine(); if (!warned.whine) { warned.whine = 1; toast(nm + " winselt an der Haustür und muss dringend raus."); } break;
        case "dirty": toast(nm + " ist durch Matsch gelaufen und braucht nachher ein Bad."); break;
        case "bark": bark(1); break;
        case "throw": tone([300], 0.05, "triangle", 0.05); break;
        case "fetched": bark(0.6); break;
        case "greet": toast("Die Hunde beschnuppern sich."); bark(0.8); break;
        case "wantsPlay": toast(nm + " bringt dir den Ball und will spielen."); break;
        case "bath": toast("Frisch gebadet."); break;
        case "pet": tone([700, 900], 0.1, "sine", 0.05); break;
        case "dayEnd": showDayEnd(e); break;
        case "leashOn": tone([380, 500], 0.06, "triangle", 0.05); break;
      }
    });
    // Warnungen, wenn ein Bedürfnis kippt
    Hund.DOG_NEEDS.forEach(function (k) {
      var v = sim.need[k.id];
      if (v < 22 && !warned[k.id]) { warned[k.id] = 1; toast({hunger: nm + " hat Hunger. Füll den Napf in der Küche.", durst: nm + " hat Durst. Frisches Wasser in den Wassernapf.", blase: nm + " muss raus. Anleinen und ab in den Park.", energie: nm + " ist müde.", spass: nm + " langweilt sich. Ball werfen oder raus in den Park.", liebe: nm + " möchte gestreichelt werden.", sauber: nm + " ist schmutzig. Ab in die Badewanne."}[k.id]); }
      if (v > 45) warned[k.id] = 0;
    });
  }
  function showDayEnd(r) {
    $("deTitle").textContent = "Tag " + r.day + " ist vorbei";
    $("deStars").textContent = "★★★★★".slice(0, r.stars) + "☆☆☆☆☆".slice(0, 5 - r.stars);
    $("deText").textContent = r.done + " von " + r.total + " Aufgaben geschafft, " + sim.name + " war im Schnitt zu " + r.mood + " % zufrieden.";
    $("dayEnd").hidden = false; saveAll(true);
  }

  /* ---------- Darstellung pro Bild ---------- */
  var clockT = 0, uiT = 0, birdT = 0;
  function sync(dt, time) {
    var p = sim.p, d = sim.d;
    person.update({x: p.x, z: p.z, yaw: p.yaw, speed: p.speed, phase: p.phase, pose: p.pose, act: p.act, leash: d.leash, holding: p.holding, bags: p.bags}, time, dt);
    dog.update(d, time, dt);
    if (d.mode === "bath") dog.root.position.y += 0.08;
    // Plumbob über dem Hund, Farbe nach Laune
    var m = Hund.mood(sim.need), c = new THREE.Color(needColor(m));
    plumbob.material.color.copy(c); plumbob.material.emissive.copy(c).multiplyScalar(0.5);
    dog.head.getWorldPosition(tv); plumbob.position.set(tv.x, tv.y + 0.32 + Math.sin(time * 2) * 0.02, tv.z); plumbob.rotation.y = time * 1.5;
    // Leine
    if (leash) { scene.remove(leash); leash.geometry.dispose(); leash = null; }
    if (d.leash) {
      var h = person.handPos(new THREE.Vector3()), c2 = new THREE.Vector3(); dog.head.parent.getWorldPosition(c2);
      var mid = h.clone().lerp(c2, 0.5), len = h.distanceTo(c2), sag = Math.max(0.02, Math.sqrt(Math.max(0, 2.7 * 2.7 - len * len)) * 0.35);
      mid.y -= sag;
      leash = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([h, mid, c2]), 20, 0.007, 5, false), leashMat); leash.castShadow = true; scene.add(leash);
    }
    // Gegenstände
    sim.items.forEach(function (it) {
      var im = itemMeshes[it.id]; if (!im) return;
      var g = im.g;
      if (it.state === "dog") { dog.mouth.getWorldPosition(tv); g.position.copy(tv); g.rotation.set(0, d.yaw + Math.PI / 2, 0); }
      else if (it.state === "player") { person.handPos(tv); g.position.copy(tv); g.rotation.set(0, p.yaw + Math.PI / 2, 0.6); }
      else { g.position.set(it.x, it.y || 0.03, it.z); g.rotation.set(0, it.yaw || 0, it.pitch || 0); }
    });
    syncList(sim.poops, poopMeshes, poopMesh);
    syncList(sim.puddles, puddleMeshes, puddleMesh);
    // Wohnung: Näpfe, Fernseher, Badewanne
    world.food.scale.set(1, Math.max(0.01, sim.bowl.food), 1); world.food.visible = sim.bowl.food > 0.02;
    world.water2.visible = sim.bowl.water > 0.02; world.water2.position.y = 0.012 + 0.04 * sim.bowl.water;
    var watching = p.act && p.act.id === "fernsehen";
    world.tvScreen.material.emissive.setRGB(watching ? 0.25 + 0.15 * Math.sin(time * 7) : 0, watching ? 0.35 + 0.1 * Math.sin(time * 3) : 0, watching ? 0.5 : 0);
    world.tubWater.visible = !!(p.act && p.act.id === "baden");
    world.ducks.forEach(function (k) { k.a += k.sp * dt; k.g.position.set(W.pond.x + Math.cos(k.a) * k.r, 0.03, W.pond.z + Math.sin(k.a) * k.r); k.g.rotation.y = -k.a; });
    // Schnittansicht: drinnen werden die Wände zur Kamera hin abgesenkt, draußen gibt es ein Dach.
    var inside = Hund.inHouse(p) || (Hund.inHouse({x: cam.fx, z: cam.fz}));
    var cx = camera.position.x - cam.fx, cz = camera.position.z - cam.fz, cl = Math.hypot(cx, cz) || 1;
    world.walls.forEach(function (w) {
      var cut = inside && ((w.cx - cam.fx) * cx + (w.cz - cam.fz) * cz) / cl > 0.4;
      var target = cut ? 0.12 : 1; w.cut += (target - w.cut) * Math.min(1, dt * 8); w.mesh.scale.y = w.cut;
    });
    world.windows.forEach(function (g) { g.visible = !inside || world.walls.every(function () { return true; }); });
    world.roof.visible = !inside;
    world.windows.forEach(function (g) { var wx = g.position.x - cam.fx, wz = g.position.z - cam.fz; g.visible = !(inside && (wx * cx + wz * cz) / cl > 0.4); });
    world.door.visible = !(inside && ((world.door.position.x - cam.fx) * cx + (world.door.position.z - cam.fz) * cz) / cl > 0.4);
    // Markierung fürs Antippen
    if (marker.material.opacity > 0) { marker.material.opacity = Math.max(0, marker.material.opacity - dt * 0.8); marker.scale.setScalar(1 + (0.8 - marker.material.opacity) * 0.6); }
    Net.render(dt, time);
  }
  function syncList(list, meshes, make) {
    var seen = {};
    list.forEach(function (q) { seen[q.id] = 1; if (!meshes[q.id]) meshes[q.id] = make(q); });
    Object.keys(meshes).forEach(function (id) { if (!seen[id]) { scene.remove(meshes[id].g); delete meshes[id]; } });
  }

  /* ---------- Eingabe: Antippen, Ziehen, Zoomen, Tastatur, Joystick ---------- */
  var keys = {}, joy = {x: 0, y: 0, id: null}, pointers = {}, drag = null, pinch = null;
  window.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    keys[e.code] = true;
    if (!running) return;
    if (e.code === "Space") { e.preventDefault(); if (sim.p.holding) sim.throwItem(); }
    if (e.code === "Digit1") sim.command("komm"); if (e.code === "Digit2") sim.command("sitz"); if (e.code === "Digit3") sim.command("platz"); if (e.code === "Digit4") sim.command("pfote");
    if (e.code === "KeyL") leashBtn();
    if (e.code === "KeyP") setSpeed(sim.speed ? 0 : 1);
    if (e.code === "Escape") closeMenu();
  });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });
  window.addEventListener("blur", function () { keys = {}; });
  function readInput(dt) {
    var x = 0, y = 0;
    if (keys.KeyW || keys.ArrowUp) y += 1; if (keys.KeyS || keys.ArrowDown) y -= 1;
    if (keys.KeyD || keys.ArrowRight) x += 1; if (keys.KeyA || keys.ArrowLeft) x -= 1;
    if (keys.KeyQ) cam.yaw += dt * 1.8; if (keys.KeyE) cam.yaw -= dt * 1.8;
    x += joy.x; y += joy.y;
    var fx = -Math.sin(cam.yaw), fz = -Math.cos(cam.yaw), rx = -fz, rz = fx;
    return {mx: fx * y + rx * x, mz: fz * y + rz * x, run: !!(keys.ShiftLeft || keys.ShiftRight) || Math.hypot(joy.x, joy.y) > 0.92};
  }
  canvas.addEventListener("pointerdown", function (e) {
    canvas.setPointerCapture(e.pointerId); pointers[e.pointerId] = {x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now()};
    var ids = Object.keys(pointers);
    if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), dist: cam.dist}; drag = null; }
    else drag = {moved: false};
    audio();
  });
  canvas.addEventListener("pointermove", function (e) {
    var pt = pointers[e.pointerId]; if (!pt) return;
    var dx = e.clientX - pt.x, dy = e.clientY - pt.y; pt.x = e.clientX; pt.y = e.clientY;
    var ids = Object.keys(pointers);
    if (pinch && ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]], dd = Math.hypot(a.x - b.x, a.y - b.y); cam.dist = Math.max(3, Math.min(30, pinch.dist * pinch.d / Math.max(20, dd))); return; }
    if (drag && (drag.moved || Math.hypot(e.clientX - pt.sx, e.clientY - pt.sy) > 8)) {
      drag.moved = true; closeMenu();
      cam.yaw -= dx * 0.008; cam.pitch = Math.max(0.25, Math.min(1.35, cam.pitch + dy * 0.006));
    }
  });
  function endPointer(e) {
    var pt = pointers[e.pointerId]; delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (pt && drag && !drag.moved && running && performance.now() - pt.t < 600) tap(e.clientX, e.clientY);
    if (!Object.keys(pointers).length) drag = null;
  }
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", function (e) { delete pointers[e.pointerId]; pinch = null; drag = null; });
  canvas.addEventListener("wheel", function (e) { e.preventDefault(); cam.dist = Math.max(3, Math.min(30, cam.dist * (e.deltaY > 0 ? 1.1 : 0.9))); }, {passive: false});
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  // Joystick
  var joyEl = $("joy"), knob = $("knob");
  function joyShow() { joyEl.hidden = !(settings.joy == null ? mobile : settings.joy); }
  joyEl.addEventListener("pointerdown", function (e) { joy.id = e.pointerId; joyEl.setPointerCapture(e.pointerId); joyMove(e); audio(); });
  joyEl.addEventListener("pointermove", function (e) { if (e.pointerId === joy.id) joyMove(e); });
  function joyEnd() { joy.id = null; joy.x = joy.y = 0; knob.style.transform = ""; }
  joyEl.addEventListener("pointerup", joyEnd); joyEl.addEventListener("pointercancel", joyEnd);
  function joyMove(e) {
    var r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
    var dx = (e.clientX - cx) / R, dy = (e.clientY - cy) / R, l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
    joy.x = dx; joy.y = -dy; knob.style.transform = "translate(" + dx * R * 0.6 + "px," + dy * R * 0.6 + "px)";
  }

  // Antippen: Ziel suchen, Aktionsmenü zeigen oder hingehen
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function pickables() {
    var list = world.picks.slice(); list.push(dog.hit);
    Object.keys(itemMeshes).forEach(function (k) { var it = sim.item(k); if (it && it.state === "ground") list.push(itemMeshes[k].hit); });
    Object.keys(poopMeshes).forEach(function (k) { list.push(poopMeshes[k].hit); });
    Object.keys(puddleMeshes).forEach(function (k) { list.push(puddleMeshes[k].hit); });
    return list;
  }
  function tap(cx, cy) {
    closeMenu();
    var r = canvas.getBoundingClientRect();
    ndc.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(pickables(), false), hit = null;
    for (var i = 0; i < hits.length; i++) { if (hits[i].object.userData.pick) { hit = hits[i]; break; } }
    var gp = new THREE.Vector3(); ray.ray.intersectPlane(groundPlane, gp);
    // Kleine Ziele großzügig: liegt ein Haufen, Stock oder Ball nahe am Bodenpunkt, gilt er als getroffen.
    if (!hit && gp) {
      var near = null, best = 0.6;
      sim.poops.forEach(function (q) { var dd = Math.hypot(q.x - gp.x, q.z - gp.z); if (dd < best) { best = dd; near = {type: "poop", id: q.id}; } });
      sim.items.forEach(function (it) { if (it.state !== "ground") return; var dd = Math.hypot(it.x - gp.x, it.z - gp.z); if (dd < best) { best = dd; near = {type: "item", id: it.id}; } });
      if (near) return openMenu(near, cx, cy);
    }
    if (hit) return openMenu(hit.object.userData.pick, cx, cy);
    if (gp) {
      if (sim.p.holding) return openMenu({type: "ground", x: gp.x, z: gp.z}, cx, cy);
      walkMark(gp.x, gp.z); sim.walkTo(gp.x, gp.z);
    }
  }
  function walkMark(x, z) { marker.position.set(x, 0.05, z); marker.material.opacity = 0.9; marker.scale.setScalar(1); }
  var menuEl = $("menu");
  function openMenu(tg, cx, cy) {
    var acts, title;
    if (tg.type === "ground") { title = "Hier"; acts = [{id: "walk", label: "Hierhin gehen", ok: true}, {id: "throwAt", label: sim.item(sim.p.holding).kind === "ball" ? "Ball hierhin werfen" : "Stock hierhin werfen", ok: true}]; }
    else {
      acts = sim.actionsFor(tg);
      var o = tg.type === "obj" ? sim.obj(tg.id) : null;
      title = tg.type === "dog" ? sim.name : o ? o.name : tg.type === "poop" ? "Haufen" : tg.type === "puddle" ? "Pfütze" : tg.type === "item" ? (sim.item(tg.id).kind === "ball" ? "Ball" : "Stock") : "";
      if (o && o.kind === "tuer") { sim.order("tuer", tg); return; }
    }
    if (!acts.length) return;
    menuEl.replaceChildren(el("h3", {text: title}));
    acts.forEach(function (a) {
      menuEl.appendChild(el("button", {type: "button", class: a.ok ? "" : "off", text: a.label, title: a.ok ? "" : a.why, onclick: function () {
        if (!a.ok) { toast(a.why); closeMenu(); return; }
        closeMenu();
        if (a.id === "walk") { walkMark(tg.x, tg.z); sim.walkTo(tg.x, tg.z); return; }
        if (a.id === "throwAt") { sim.throwItem(tg.x, tg.z); return; }
        var pos = sim.targetPos(tg); if (pos && a.id.indexOf("cmd:") !== 0 && a.id !== "ableinen") walkMark(pos.use ? pos.use.x : pos.x, pos.use ? pos.use.z : pos.z);
        sim.order(a.id, tg);
      }}));
    });
    menuEl.hidden = false;
    var w = menuEl.offsetWidth, h = menuEl.offsetHeight;
    menuEl.style.left = Math.max(8, Math.min(innerWidth - w - 8, cx - w / 2)) + "px";
    menuEl.style.top = Math.max(60, Math.min(innerHeight - h - 8, cy - h - 12)) + "px";
  }
  function closeMenu() { menuEl.hidden = true; }

  /* ---------- Knöpfe ---------- */
  function setSpeed(s) { sim.speed = s; updateClock(); }
  [].forEach.call(document.querySelectorAll("#speed button"), function (b) { b.addEventListener("click", function () { setSpeed(+b.dataset.s); }); });
  function leashBtn() { if (sim.d.leash) sim.setLeash(false); else if (Hund.dist(sim.d, sim.p) < 2.2) sim.setLeash(true); else { sim.order("anleinen", {type: "dog"}); } }
  $("bKomm").onclick = function () { sim.command("komm"); };
  $("bSitz").onclick = function () { sim.command("sitz"); };
  $("bPlatz").onclick = function () { sim.command("platz"); };
  $("bPfote").onclick = function () { sim.command("pfote"); };
  $("bLeash").onclick = leashBtn;
  $("bThrow").onclick = function () { sim.throwItem(); };
  $("actCancel").onclick = function () { sim.cancel(); };
  function soundLabel() { $("bSound").textContent = settings.sound ? "🔊" : "🔈"; $("sSound").textContent = settings.sound ? "🔊 Ton an" : "🔈 Ton aus"; }
  $("bSound").onclick = $("sSound").onclick = function () { settings.sound = !settings.sound; saveSettings(); soundLabel(); };
  soundLabel();
  $("bHelp").onclick = $("sHelp").onclick = function () { $("help").hidden = false; };
  $("helpClose").onclick = function () { $("help").hidden = true; };
  $("bMenu").onclick = function () { $("start").hidden = false; running = false; renderStart(); };
  $("deClose").onclick = function () { $("dayEnd").hidden = true; };
  $("needHead").onclick = function () { $("needs").classList.toggle("open"); };
  $("taskHead").onclick = function () { $("tasks").classList.toggle("open"); };
  $("bJoy").onclick = function () { settings.joy = joyEl.hidden; saveSettings(); joyShow(); };
  if (innerWidth > 760) { $("needs").classList.add("open"); $("tasks").classList.add("open"); }

  /* ---------- Startbildschirm ---------- */
  var startSave = null;
  function renderStart() {
    var s = store(SAVE_KEY), box = $("looks");
    startSave = s && s.sim ? s : null;
    if (accSave && (!startSave || (accSave.sim && accSave.sim.at > (startSave.sim.at || 0)))) startSave = accSave;
    $("nameIn").value = settings.name || (startSave && startSave.name) || "";
    function pick(on, title, sw, label, fn) { return el("button", {type: "button", class: "look" + (on ? " on" : ""), title: title, onclick: function () { fn(); saveSettings(); renderStart(); }}, [sw, el("small", {text: label})]); }
    function swatch(L) { return el("span", {style: "background:linear-gradient(135deg," + L.coat + " 55%," + L.tan + " 56%)"}); }
    var gbox = $("genders"); gbox.replaceChildren();
    [["m", "👨", "Mann"], ["w", "👩", "Frau"]].forEach(function (g) {
      gbox.appendChild(pick(settings.gender === g[0], g[2], el("span", {class: "emo", text: g[1]}), g[2], function () { settings.gender = g[0]; setPerson(); }));
    });
    var bbox = $("breeds"); bbox.replaceChildren();
    DOG_BREEDS.forEach(function (B) {
      bbox.appendChild(pick(settings.breed === B.id, B.name, swatch(B.looks[0]), B.name, function () { if (settings.breed !== B.id) settings.look = 0; settings.breed = B.id; setDogLook(); }));
    });
    box.replaceChildren();
    dogBreed(settings.breed).looks.forEach(function (L, i) {
      box.appendChild(pick(i === (settings.look || 0), L.name, swatch(L), L.name, function () { settings.look = i; setDogLook(); }));
    });
    $("resume").hidden = !startSave && !sim;
    if (sim) $("resume").textContent = "Weiterspielen (Tag " + sim.day + ", " + Hund.fmtTime(sim.t) + ")";
    else if (startSave) $("resume").textContent = "Weiterspielen (Tag " + startSave.sim.day + ", " + Hund.fmtTime(startSave.sim.t) + ")";
    $("newGame").textContent = sim || startSave ? "Neu anfangen" : "Los geht's";
  }
  function begin(save) {
    settings.name = ($("nameIn").value || "").trim().slice(0, 20) || settings.name || "Hund"; saveSettings();
    if (save === "keep" && sim) { sim.name = settings.name; }
    else { newSim(save); }
    $("start").hidden = true; running = true; buildNeeds(); updateNeeds(); lastTaskKey = ""; updateTasks(); updateClock(); joyShow();
    if (!save) setTimeout(function () { toast("Guten Morgen! " + sim.name + " schläft noch im Körbchen. Rechts stehen die Aufgaben für heute.", "good"); }, 600);
    if (!save) setTimeout(function () { toast("Tipp auf Dinge in der Wohnung, um etwas zu tun. Zum Beispiel auf den Napf in der Küche."); }, 5200);
    saveLocal();
  }
  $("resume").onclick = function () { if (sim) begin("keep"); else begin(startSave.sim); };
  $("newGame").onclick = function () { if ((sim || startSave) && !confirm("Neu anfangen? Der bisherige Spielstand wird überschrieben.")) return; sim = null; begin(null); };
  $("nameIn").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); (startSave || sim ? $("resume") : $("newGame")).click(); } });

  /* ---------- Zu zweit (Supabase Realtime) ---------- */
  var Net = {
    sb: null, user: null, ch: null, lobby: null, code: null, others: {}, tags: {}, people: {}, sendT: 0,
    init: async function () {
      var cfg = window.SR_CONFIG || {};
      try {
        if (!cfg.supabaseUrl || !window.supabase) return;
        Net.sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
        var r = await Net.sb.auth.getSession(); Net.user = r.data && r.data.session ? r.data.session.user : null;
        if (!Net.user) return;
        Acc.sb = Net.sb; Acc.user = Net.user;
        var a = await Net.sb.from("schach_docs").select("data").eq("user_id", Net.user.id).eq("path", "hund/stand").maybeSingle();
        if (a && !a.error && a.data && a.data.data && a.data.data.sim) { accSave = a.data.data; if (!running) renderStart(); }
        Net.lobby = Net.sb.channel("hund-lobby", {config: {presence: {key: Net.user.id}}});
        Net.lobby.on("presence", {event: "sync"}, function () { var st = Net.lobby.presenceState(), m = {}; Object.keys(st).forEach(function (k) { m[k] = st[k][0]; }); Net.people = m; Net.renderPanel(); });
        Net.lobby.subscribe(function (s) { if (s === "SUBSCRIBED") Net.adv(); });
        var m = /zuzweit=([a-z0-9]{4,8})/.exec(location.hash);
        if (m) Net.join(m[1]);
      } catch (e) {}
      Net.renderPanel();
    },
    myName: function () { var m = (Net.user && Net.user.user_metadata) || {}; return String(m.poker_name || m.gq_name || ((Net.user && Net.user.email) || "Gast").split("@")[0]).slice(0, 20); },
    adv: function () { if (Net.lobby) Net.lobby.track({name: Net.myName(), dog: settings.name || "Hund", code: Net.code, at: Date.now()}); },
    join: function (code) {
      Net.leave();
      Net.code = code; if (sim) { sim.multi = true; if (!sim.tasks.some(function (t) { return t.id === "gruss"; })) sim.tasks.splice(sim.tasks.length - 2, 0, {id: "gruss", text: Hund.TASKS.gruss.text, need: 1, unit: "", have: 0, done: false, failed: false}); lastTaskKey = ""; }
      Net.ch = Net.sb.channel("hund-" + code, {config: {presence: {key: Net.user.id}, broadcast: {self: false}}});
      Net.ch.on("broadcast", {event: "st"}, function (x) { var o = x.payload; if (!o || !o.id) return; var cur = Net.others[o.id] || (Net.others[o.id] = {}); cur.st = o; cur.at = Date.now(); });
      Net.ch.on("broadcast", {event: "bye"}, function (x) { if (x.payload && x.payload.id) Net.drop(x.payload.id); });
      Net.ch.on("presence", {event: "leave"}, function (x) { (x.leftPresences || []).forEach(function (p) { Net.drop(p.id); }); });
      Net.ch.subscribe(function (s) { if (s === "SUBSCRIBED") { Net.ch.track({id: Net.user.id, name: Net.myName()}); toast("Ihr seid zu zweit unterwegs. Trefft euch im Park!", "good"); } });
      location.hash = "zuzweit=" + code; Net.adv(); Net.renderPanel();
    },
    leave: function () {
      if (Net.ch) { try { Net.ch.send({type: "broadcast", event: "bye", payload: {id: Net.user.id}}); Net.sb.removeChannel(Net.ch); } catch (e) {} }
      Net.ch = null; Net.code = null; Object.keys(Net.others).forEach(Net.drop); if (location.hash.indexOf("zuzweit") >= 0) history.replaceState(null, "", location.pathname + location.search);
      Net.adv(); Net.renderPanel();
    },
    drop: function (id) { var o = Net.others[id]; if (!o) return; if (o.view) { scene.remove(o.view.person.root); scene.remove(o.view.dog.root); if (o.view.leash) scene.remove(o.view.leash); } if (Net.tags[id]) { Net.tags[id].remove(); delete Net.tags[id]; } delete Net.others[id]; },
    send: function (dt) {
      if (!Net.ch || !sim) return;
      Net.sendT -= dt; if (Net.sendT > 0) return; Net.sendT = 0.12;
      var p = sim.p, d = sim.d, held = p.holding ? sim.item(p.holding) : null, fly = sim.items.filter(function (it) { return it.state === "flying" || it.state === "dog"; })[0];
      var r = function (v) { return Math.round(v * 100) / 100; };
      Net.ch.send({type: "broadcast", event: "st", payload: {id: Net.user.id, n: Net.myName(), dn: sim.name, look: settings.look || 0, br: settings.breed, g: settings.gender,
        p: {x: r(p.x), z: r(p.z), yaw: r(p.yaw), speed: r(p.speed), phase: r(p.phase), pose: p.pose, holding: held ? held.kind : null, bags: p.bags},
        d: {x: r(d.x), z: r(d.z), yaw: r(d.yaw), vel: r(d.vel || 0), gait: d.gait, phase: r(d.phase), gaitBlend: r(d.gaitBlend), pose: d.pose, wag: r(d.wag), wagPhase: r(d.wagPhase), leash: d.leash, mode: d.mode},
        it: fly ? {k: fly.kind, x: r(fly.x), y: r(fly.y || 0), z: r(fly.z), s: fly.state} : null}});
    },
    render: function (dt, time) {
      var others = [];
      Object.keys(Net.others).forEach(function (id) {
        var o = Net.others[id], st = o.st; if (!st) return;
        if (Date.now() - o.at > 15000) { Net.drop(id); return; }
        if (!o.view) {
          var obr = dogBreed(st.br), olook = st.look || 0;
          if (obr.id === settings.breed && olook === (settings.look || 0)) olook = (olook + 1) % obr.looks.length;
          o.view = {person: makePerson(1, st.g), dog: makeDog(olook, obr.id), p: Object.assign({}, st.p), d: JSON.parse(JSON.stringify(st.d))};
          scene.add(o.view.person.root); scene.add(o.view.dog.root);
          Net.tags[id] = el("div", {class: "tag", text: st.n + " & " + st.dn}); $("tags").appendChild(Net.tags[id]);
        }
        var v = o.view, k = Math.min(1, dt * 10);
        ["x", "z"].forEach(function (a) { v.p[a] += (st.p[a] - v.p[a]) * k; v.d[a] += (st.d[a] - v.d[a]) * k; });
        v.p.yaw += Hund.angDiff(v.p.yaw, st.p.yaw) * k; v.d.yaw += Hund.angDiff(v.d.yaw, st.d.yaw) * k;
        ["speed", "phase", "pose", "holding", "bags"].forEach(function (a) { v.p[a] = st.p[a]; });
        ["vel", "gait", "phase", "gaitBlend", "pose", "wag", "wagPhase", "leash", "mode"].forEach(function (a) { v.d[a] = st.d[a]; });
        v.person.update({x: v.p.x, z: v.p.z, yaw: v.p.yaw, speed: v.p.speed, phase: v.p.phase, pose: v.p.pose, leash: v.d.leash, holding: v.p.holding, bags: v.p.bags}, time, dt);
        v.dog.update(v.d, time, dt);
        if (v.leash) { scene.remove(v.leash); v.leash.geometry.dispose(); v.leash = null; }
        if (v.d.leash) { var h = v.person.handPos(new THREE.Vector3()), c = new THREE.Vector3(); v.dog.head.parent.getWorldPosition(c); var mid = h.clone().lerp(c, 0.5); mid.y -= 0.25; v.leash = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([h, mid, c]), 16, 0.007, 5, false), leashMat); scene.add(v.leash); }
        others.push({dog: {x: v.d.x, z: v.d.z}});
      });
      if (sim) sim.others = others;
    },
    renderPanel: function () {
      var box = $("netBody"); if (!box) return;
      box.replaceChildren();
      if (!Net.user) { box.appendChild(el("p", {text: "Zu zweit geht es mit deinem Konto der Lebensplattform. Melde dich im Portal an, dann kannst du mit anderen spazieren gehen."})); box.appendChild(el("a", {class: "btn primary", href: "../", text: "Zum Portal"})); return; }
      if (Net.code) {
        var link = location.origin + location.pathname + "#zuzweit=" + Net.code, n = Object.keys(Net.others).length;
        box.appendChild(el("p", {text: n ? "Ihr seid zu zweit. Trefft euch im Park und lasst die Hunde sich beschnuppern." : "Warte auf Besuch. Schick diesen Link:"}));
        box.appendChild(el("div", {class: "row"}, [el("input", {type: "text", value: link, readonly: "", onclick: function (e) { e.target.select(); }}),
          el("button", {type: "button", class: "primary", text: "Teilen", onclick: function () { if (navigator.share) navigator.share({title: "Hundeleben", text: "Komm mit Gassi gehen!", url: link}).catch(function () {}); else { navigator.clipboard.writeText(link).then(function () { toast("Link kopiert."); }); } }})]));
        box.appendChild(el("button", {type: "button", text: "Spaziergang verlassen", onclick: function () { Net.leave(); }}));
        return;
      }
      var open = Object.keys(Net.people).filter(function (k) { return k !== Net.user.id && Net.people[k] && Net.people[k].code; });
      box.appendChild(el("p", {text: open.length ? "Gerade unterwegs:" : "Gerade ist niemand unterwegs. Eröffne einen Spaziergang, die anderen sehen ihn sofort."}));
      open.forEach(function (k) { var pp = Net.people[k]; box.appendChild(el("div", {class: "row item"}, [el("span", {text: pp.name + " mit " + pp.dog}), el("button", {type: "button", class: "primary", text: "Mitgehen", onclick: function () { Net.join(pp.code); }})])); });
      box.appendChild(el("button", {type: "button", class: "primary", text: "Spaziergang eröffnen", onclick: function () { Net.join(Math.random().toString(36).slice(2, 8)); }}));
    }
  };
  $("bNet").onclick = $("sNet").onclick = function () { $("net").hidden = !$("net").hidden; Net.renderPanel(); };
  $("netClose").onclick = function () { $("net").hidden = true; };

  /* ---------- Schleife ---------- */
  var last = performance.now(), time = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    if (running && sim) {
      sim.step(dt, readInput(dt));
      handleEvents();
      clockT -= dt; if (clockT <= 0) { clockT = 0.25; updateClock(); updateNeeds(); updateTasks(); }
      birdT -= dt; if (birdT <= 0) { birdT = 2 + Math.random() * 6; var h = (sim.t % 1440) / 60; if (!Hund.inHouse(sim.p) && h > 5.5 && h < 20.5 && sim.speed) chirp(); }
      Net.send(dt);
    } else if (sim) { readInput(dt); }
    if (sim) { placeCamera(dt); lighting(sim.t); sync(dt, time); updateFloating(); }
    else { cam.yaw += dt * 0.08; placeCamera(dt); lighting(9 * 60); dog.update({x: W.objects[3].x, z: W.objects[3].z, yaw: 0.5, pose: {sleep: 1, down: 1}, wag: 0, wagPhase: 0}, time, dt); }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  resize();
  cam.fx = W.start.x; cam.fz = W.start.z;
  renderStart();
  Net.init();
  requestAnimationFrame(frame);
  window.__hund = {get sim() { return sim; }, cam: cam, tap: tap, begin: begin, renderer: renderer, project: screenPos};
  document.title = "Hundeleben";
})();
