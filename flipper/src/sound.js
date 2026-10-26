// Klang: alles per WebAudio erzeugt, keine Dateien. Jeder Tisch hat seine eigene Klangfarbe (chime, cartoon, soft, synth)
// und eine kleine Hintergrundmusik (swing, funk, ambient, synthwave), die sich getrennt abschalten lässt.
(function (root) {
  "use strict";
  var ctx = null, master, sfxBus, musBus, noiseBuf, on = true, musicOn = false, style = "chime", musicStyle = null, seqTimer = 0, step = 0, nextT = 0;
  var last = {};

  function ensure() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      master = ctx.createGain(); master.gain.value = 0.8; master.connect(comp); comp.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
      musBus = ctx.createGain(); musBus.gain.value = 0.22; musBus.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }
  function now() { return ctx.currentTime; }
  function env(g, t, a, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  // Ein Ton: Frequenz f (optional Gleiten nach f2), Dauer, Wellenform, Lautstärke, Verzögerung, Ziel
  function tone(f, dur, type, vol, f2, delay, bus, attack) {
    var t = now() + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, attack || 0.005, vol || 0.2, dur);
    o.connect(g); g.connect(bus || sfxBus); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  function noise(dur, freq, vol, type, q, delay, f2, bus) {
    var t = now() + (delay || 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; fl.type = type || "lowpass"; fl.frequency.setValueAtTime(freq, t); fl.Q.value = q || 1;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, 0.002, vol || 0.2, dur);
    s.connect(fl); fl.connect(g); g.connect(bus || sfxBus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  // Glocke: mehrere unharmonische Teiltöne wie bei den alten Glockenspielen in den Geräten
  function bell(f, vol, delay, len) {
    [1, 2.76, 5.4, 8.93].forEach(function (m, i) { tone(f * m, (len || 1.2) / (1 + i * 0.8), "sine", (vol || 0.18) / (1 + i * 1.4), 0, delay); });
  }
  function arp(notes, gap, type, vol, len, delay) { notes.forEach(function (n, i) { tone(n, len || 0.18, type || "square", vol || 0.1, 0, (delay || 0) + i * gap); }); }
  var N = function (semi) { return 440 * Math.pow(2, (semi - 9) / 12); }; // 0 = C4

  function thunk(f) { noise(0.06, 900, 0.22, "lowpass"); tone(f || 95, 0.08, "sine", 0.3, 50); }

  // Klangrezepte pro Stil. Ereignisse ohne Rezept bleiben still.
  var V = {
    chime: {
      bumper: function () { bell(N(24 + [0, 4, 7][Math.floor(Math.random() * 3)]), 0.16); thunk(70); },
      sling: function () { thunk(110); bell(N(19), 0.08, 0, 0.5); },
      drop: function () { noise(0.05, 2400, 0.2, "bandpass", 3); bell(N(28), 0.12, 0, 0.6); },
      bank: function () { bell(N(24), 0.16); bell(N(28), 0.16, 0.12); bell(N(31), 0.16, 0.24); bell(N(36), 0.2, 0.36, 1.6); },
      standup: function () { bell(N(31), 0.1, 0, 0.5); },
      spin: function () { noise(0.015, 3500, 0.12, "highpass"); },
      lane: function () { bell(N(36), 0.1, 0, 0.6); },
      lanes: function () { [0, 4, 7, 12].forEach(function (s, i) { bell(N(24 + s), 0.12, i * 0.09, 0.9); }); },
      ramp: function () { [0, 7, 12, 16, 19].forEach(function (s, i) { bell(N(19 + s), 0.11, i * 0.06, 0.8); }); },
      rampEnter: function () { noise(0.4, 300, 0.08, "bandpass", 2, 0, 1600); },
      saucer: function () { thunk(60); bell(N(12), 0.14, 0.05, 1.5); },
      multiball: function () { [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach(function (s, i) { bell(N(19 + s), 0.13, i * 0.1, 0.9); }); },
      jackpot: function () { for (var i = 0; i < 8; i++) bell(N(24 + (i % 2) * 7), 0.14, i * 0.07, 0.6); },
      drain: function () { bell(N(12), 0.14, 0, 1.5); bell(N(7), 0.14, 0.3, 1.5); bell(N(0), 0.16, 0.6, 2); }
    },
    cartoon: {
      bumper: function () { var f = 260 + Math.random() * 140; tone(f, 0.18, "sine", 0.22, f * 2.6); tone(f / 2, 0.12, "triangle", 0.15, f); },
      sling: function () { tone(500, 0.08, "square", 0.08, 1400); },
      drop: function () { tone(240, 0.22, "triangle", 0.3, 70); noise(0.08, 600, 0.15); },
      bank: function () { arp([N(12), N(16), N(19), N(24)], 0.08, "square", 0.09, 0.15); noise(0.4, 4000, 0.12, "highpass", 1, 0.3); },
      standup: function () { tone(880, 0.07, "square", 0.08, 660); },
      spin: function () { tone(1800 + Math.random() * 400, 0.025, "square", 0.04); },
      lane: function () { tone(660, 0.12, "sine", 0.15, 1320); },
      lanes: function () { arp([N(24), N(28), N(31), N(36)], 0.07, "square", 0.08); },
      ramp: function () { tone(300, 0.5, "sine", 0.2, 1800); tone(303, 0.5, "triangle", 0.1, 1810); },
      rampEnter: function () { tone(200, 0.3, "sawtooth", 0.05, 600); },
      saucer: function () { tone(120, 0.3, "square", 0.12, 60); noise(0.3, 500, 0.15); },
      eject: function () { tone(150, 0.2, "sine", 0.25, 900); },
      multiball: function () { arp([N(12), N(12), N(12), N(16), N(19), N(24)], 0.11, "square", 0.1, 0.12); arp([N(0), N(4), N(7)], 0.33, "sawtooth", 0.06, 0.3); },
      jackpot: function () { arp([N(24), N(28), N(31), N(36), N(40), N(43)], 0.05, "square", 0.08); noise(0.5, 3000, 0.1, "highpass", 1, 0.3); },
      drain: function () { [N(7), N(6), N(5), N(4)].forEach(function (f, i) { var o = tone(f, i === 3 ? 0.9 : 0.35, "sawtooth", 0.12, i === 3 ? f * 0.9 : 0, i * 0.38, 0, 0.03); void o; }); }
    },
    soft: {
      bumper: function () { var p = [0, 2, 4, 7, 9]; tone(N(24 + p[Math.floor(Math.random() * 5)]), 0.5, "sine", 0.16); tone(N(36), 0.2, "triangle", 0.03); },
      sling: function () { tone(N(12), 0.12, "triangle", 0.12, 0, 0, 0, 0.002); },
      drop: function () { tone(N(31), 0.7, "sine", 0.14); tone(N(43), 0.3, "sine", 0.05); },
      bank: function () { [0, 4, 7, 11, 14].forEach(function (s, i) { tone(N(19 + s), 1.4, "sine", 0.1, 0, i * 0.12, 0, 0.05); }); },
      standup: function () { tone(N(28), 0.5, "sine", 0.1); },
      spin: function () { noise(0.02, 5000, 0.05, "highpass"); },
      lane: function () { tone(N(31), 0.6, "sine", 0.1); },
      lanes: function () { [0, 7, 12, 16].forEach(function (s, i) { tone(N(24 + s), 1, "sine", 0.09, 0, i * 0.1); }); },
      ramp: function () { for (var i = 0; i < 7; i++) tone(N(36 + [0, 2, 7, 9, 12, 14, 19][i]), 0.6, "sine", 0.06, 0, i * 0.05); noise(0.8, 6000, 0.05, "highpass"); },
      rampEnter: function () { noise(0.9, 8000, 0.06, "highpass", 1, 0, 2000); },
      saucer: function () { tone(N(-12), 1.6, "sine", 0.22, 0, 0, 0, 0.2); tone(N(-5), 1.6, "sine", 0.1, 0, 0.1, 0, 0.3); },
      multiball: function () { [0, 4, 7, 11, 14, 19].forEach(function (s, i) { tone(N(12 + s), 2.4, "sine", 0.08, 0, i * 0.15, 0, 0.4); }); },
      jackpot: function () { [0, 4, 7, 12, 16, 19, 24].forEach(function (s, i) { tone(N(24 + s), 0.8, "sine", 0.08, 0, i * 0.06); }); },
      drain: function () { [12, 7, 4, 0].forEach(function (s, i) { tone(N(12 + s), 1, "sine", 0.1, 0, i * 0.25, 0, 0.05); }); }
    },
    synth: {
      bumper: function () { tone(1400 + Math.random() * 500, 0.14, "square", 0.08, 180); },
      sling: function () { tone(900, 0.09, "sawtooth", 0.07, 2400); },
      drop: function () { noise(0.35, 1800, 0.25, "lowpass", 1, 0, 120); tone(90, 0.3, "sine", 0.25, 35); },
      bank: function () { noise(0.8, 3000, 0.22, "lowpass", 1, 0, 80); arp([N(24), N(31), N(36)], 0.1, "sawtooth", 0.07); },
      standup: function () { tone(2200, 0.06, "square", 0.05, 1800); },
      spin: function () { tone(3000, 0.02, "sine", 0.05); },
      lane: function () { tone(N(36), 0.12, "square", 0.06); tone(N(43), 0.12, "square", 0.05, 0, 0.06); },
      lanes: function () { arp([N(24), N(28), N(31), N(35), N(36)], 0.05, "sawtooth", 0.07); },
      ramp: function () { tone(120, 0.7, "sawtooth", 0.12, 1800); tone(121, 0.7, "sawtooth", 0.1, 1810); },
      rampEnter: function () { noise(0.5, 200, 0.12, "bandpass", 4, 0, 4000); },
      saucer: function () { tone(110, 1.2, "sine", 0.35, 28); noise(1, 400, 0.12, "lowpass", 1, 0, 60); },
      eject: function () { tone(60, 0.4, "sawtooth", 0.15, 900); },
      multiball: function () { for (var i = 0; i < 16; i++) tone(N(12 + [0, 7, 12, 15][i % 4] + (i > 7 ? 5 : 0)), 0.12, "sawtooth", 0.06, 0, i * 0.08); },
      jackpot: function () { for (var i = 0; i < 10; i++) tone(N(24 + i * 2), 0.1, "square", 0.06, 0, i * 0.04); },
      drain: function () { tone(800, 1.2, "sawtooth", 0.1, 40); noise(1, 1000, 0.1, "lowpass", 1, 0, 60); }
    }
  };
  // Für alle Tische gleich
  var COMMON = {
    flip: function () { thunk(); }, flipDown: function () { noise(0.03, 500, 0.06); },
    pull: function () { noise(0.6, 200, 0.06, "bandpass", 3, 0, 900); },
    launch: function (e) { noise(0.12, 900, 0.3, "lowpass"); tone(160, 0.25, "triangle", 0.15 + e.power * 0.1, 60); },
    wall: function (e) { noise(0.03, 1800, Math.min(0.12, e.v / 8000), "bandpass", 2); },
    clack: function () { noise(0.025, 3500, 0.12, "bandpass", 3); },
    nudge: function () { noise(0.12, 120, 0.4, "lowpass"); },
    tiltWarn: function () { tone(110, 0.4, "sawtooth", 0.1); tone(116, 0.4, "sawtooth", 0.1); },
    tilt: function () { for (var i = 0; i < 3; i++) { tone(98, 0.3, "sawtooth", 0.14, 0, i * 0.4); tone(104, 0.3, "square", 0.08, 0, i * 0.4); } },
    knock: function () { tone(55, 0.25, "sine", 0.6, 30); noise(0.08, 400, 0.4); },
    mission: function () { [0, 4, 7, 12, 16].forEach(function (s, i) { tone(N(24 + s), 0.25, "triangle", 0.1, 0, i * 0.09); }); },
    skill: function () { [0, 7, 12, 19, 24].forEach(function (s, i) { tone(N(24 + s), 0.15, "square", 0.06, 0, i * 0.05); }); },
    lockLit: function () { tone(N(31), 0.12, "triangle", 0.08); tone(N(36), 0.2, "triangle", 0.08, 0, 0.1); },
    lock: function () { tone(N(12), 0.2, "square", 0.08); tone(N(19), 0.3, "square", 0.08, 0, 0.15); },
    save: function () { tone(N(24), 0.12, "triangle", 0.1); tone(N(31), 0.2, "triangle", 0.1, 0, 0.1); },
    bonus: function () { for (var i = 0; i < 6; i++) tone(N(24 + i), 0.06, "square", 0.04, 0, i * 0.12); },
    gameover: function () { [7, 4, 0, -5].forEach(function (s, i) { tone(N(12 + s), 0.5, "triangle", 0.12, 0, i * 0.3); }); }
  };
  var ALIAS = {superjackpot: "jackpot", wizard: "multiball", extraball: "knock", shootAgain: "knock", standups: "bank", orbit: "lane"};

  function play(e) {
    if (!on || !ctx) return;
    var t = e.type, v = V[style] || V.chime;
    var tm = now();
    if (last[t] && tm - last[t] < (t === "spin" ? 0.03 : 0.045)) return;
    last[t] = tm;
    try {
      if (v[t]) v[t](e); else if (COMMON[t]) COMMON[t](e);
      else if (ALIAS[t]) { var a = ALIAS[t]; if (v[a]) v[a](e); else if (COMMON[a]) COMMON[a](e); }
    } catch (err) {}
  }

  /* ---------- Musik: kleiner Sequenzer mit Vorausplanung ---------- */
  var SONGS = {
    swing: {bpm: 132, steps: 16, play: function (s, t) {
      var bass = [0, 4, 7, 9, 12, 9, 7, 4, 5, 9, 12, 14, 7, 11, 14, 11];
      if (s % 2 === 0) schedTone(N(-12 + bass[s]), 0.22, "triangle", 0.5, t);
      if (s % 4 === 2) [12, 16, 19].forEach(function (x) { schedTone(N(x + (s >= 8 ? 5 : 0)), 0.1, "square", 0.05, t); });
      if (s % 2 === 1) schedNoise(0.04, 7000, 0.12, t);
    }},
    funk: {bpm: 104, steps: 16, play: function (s, t) {
      var b = [0, -1, 0, 12, -1, 10, 0, -1, 7, -1, 0, 12, -1, 3, 5, 7];
      if (b[s] >= 0) schedTone(N(-12 + b[s]), 0.12, "sawtooth", 0.25, t, 600);
      if (s % 8 === 4) schedNoise(0.12, 2500, 0.35, t);
      if (s % 8 === 0) schedTone(60, 0.15, "sine", 0.7, t, 0, 40);
      schedNoise(0.02, 8000, 0.06, t);
    }},
    ambient: {bpm: 60, steps: 16, play: function (s, t) {
      var ch = [[0, 7, 11, 16], [5, 9, 12, 16], [9, 12, 16, 19], [7, 11, 14, 19]][Math.floor(s / 4)];
      if (s % 4 === 0) ch.forEach(function (x) { schedTone(N(x), 3.8, "sine", 0.07, t, 0, 0, 1.2); });
      if (s % 2 === 1 && Math.random() < 0.5) schedTone(N(24 + [0, 2, 4, 7, 9][Math.floor(Math.random() * 5)]), 1.2, "sine", 0.05, t);
    }},
    synthwave: {bpm: 112, steps: 16, play: function (s, t) {
      var root = [0, 0, -4, -2][Math.floor(s / 4)];
      schedTone(N(-12 + root), 0.1, "sawtooth", 0.3, t, 500);
      schedTone(N(12 + root + [0, 7, 12, 15][s % 4]), 0.1, "square", 0.08, t, 2200);
      if (s % 4 === 0) schedTone(55, 0.2, "sine", 0.8, t, 0, 30);
      if (s % 8 === 4) schedNoise(0.2, 1800, 0.3, t);
    }}
  };
  function schedTone(f, dur, type, vol, t, lp, f2, attack) {
    var o = ctx.createOscillator(), g = ctx.createGain(), dst = g;
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, attack || 0.01, vol, dur);
    if (lp) { var fl = ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = lp; o.connect(fl); fl.connect(g); } else o.connect(g);
    dst.connect(musBus); o.start(t); o.stop(t + dur + 0.05);
  }
  function schedNoise(dur, freq, vol, t) {
    var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; fl.type = "highpass"; fl.frequency.value = freq; env(g, t, 0.002, vol, dur);
    s.connect(fl); fl.connect(g); g.connect(musBus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  function scheduler() {
    var song = SONGS[musicStyle]; if (!song || !ctx) return;
    var spb = 60 / song.bpm / 4;
    while (nextT < ctx.currentTime + 0.15) { try { song.play(step, nextT); } catch (e) {} step = (step + 1) % song.steps; nextT += spb; }
  }
  function startMusic() {
    stopMusic();
    if (!musicOn || !on || !ensure() || !musicStyle) return;
    step = 0; nextT = ctx.currentTime + 0.1; seqTimer = setInterval(scheduler, 40);
  }
  function stopMusic() { if (seqTimer) clearInterval(seqTimer); seqTimer = 0; }

  root.FlipperSound = {
    unlock: function () { if (on) ensure(); },
    setTable: function (theme) { style = theme.sound || "chime"; musicStyle = theme.music || null; if (seqTimer) startMusic(); },
    setOn: function (v) { on = v; if (!v) stopMusic(); else { ensure(); if (musicOn) startMusic(); } },
    setMusic: function (v) { musicOn = v; if (v) startMusic(); else stopMusic(); },
    pauseMusic: stopMusic, resumeMusic: function () { if (musicOn && on) startMusic(); },
    play: play
  };
})(this);
