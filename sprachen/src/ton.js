// Gemeinsame Sprachausgabe aller Sprachen (dist/ton.js, aus einer Sprache ../ton.js, Hilfe unter ../hilfe/).
// Umgeht bekannte Browserfehler: cancel() direkt vor speak() verschluckt den Satz (Chrome, Safari), iOS spricht erst nach einem
// ersten Ton aus einer Berührung, Chrome verliert Äußerungen ohne Referenz und bleibt manchmal pausiert hängen.
// Fehlt eine Stimme oder kommt kein Ton, blendet Ton.speak einmal einen Hinweis mit Link zur Hilfe ein.
(function () {
  var syn = window.speechSynthesis || null, keep = [], unlocked = false, hinted = false;
  var NAMES = {de: "deutsche", nl: "niederländische", ja: "japanische", th: "thailändische", ko: "koreanische", en: "englische"};
  var GOOD = /google|natural|online|premium|enhanced|siri|kyoko|otoya|kanya|yuna|xander|claire/i;
  var base = (document.currentScript && document.currentScript.src || "").replace(/ton\.js(\?.*)?$/, "");

  function all() { try { return syn ? syn.getVoices() : []; } catch (e) { return []; } }
  function voices(lang) {
    var p = String(lang || "").slice(0, 2).toLowerCase();
    return all().filter(function (v) { return String(v.lang).replace("_", "-").toLowerCase().slice(0, 2) === p; });
  }
  // Beste Stimme: genaue Region und bekannte gute Namen zuerst
  function voice(lang, prefer) {
    var vs = voices(lang), full = String(lang).toLowerCase(), re = prefer || GOOD;
    function exact(v) { return String(v.lang).replace("_", "-").toLowerCase() === full; }
    return vs.filter(function (v) { return exact(v) && re.test(v.name); })[0] || vs.filter(exact)[0] || vs.filter(function (v) { return re.test(v.name); })[0] || vs[0] || null;
  }

  // iOS: der erste Ton muss aus einer Berührung kommen, danach dürfen auch Zeitgeber sprechen
  function unlock() {
    if (unlocked || !syn) return; unlocked = true;
    try { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; keep.push(u); syn.speak(u); } catch (e) {}
  }
  ["touchend", "pointerdown", "keydown"].forEach(function (ev) { document.addEventListener(ev, unlock, true); });

  function hint(msg) {
    if (hinted || !document.body) return; hinted = true;
    var d = document.createElement("div");
    d.setAttribute("role", "status");
    d.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9999;max-width:560px;margin:0 auto;background:#1f4e79;color:#fff;border-radius:12px;padding:12px 14px;font:15px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);display:flex;gap:10px;align-items:center";
    var t = document.createElement("span"); t.style.flex = "1"; t.textContent = msg + " ";
    var a = document.createElement("a"); a.href = base + "hilfe/"; a.textContent = "So stellst du den Ton ein →"; a.style.cssText = "color:#fff;font-weight:700";
    t.appendChild(a);
    var x = document.createElement("button"); x.type = "button"; x.textContent = "✕"; x.setAttribute("aria-label", "Schließen");
    x.style.cssText = "background:none;border:0;color:#fff;font-size:18px;cursor:pointer;padding:4px";
    x.onclick = function () { d.remove(); };
    d.appendChild(t); d.appendChild(x); document.body.appendChild(d);
  }

  function say(text, o, res) {
    var u = new SpeechSynthesisUtterance(text), started = false, done = false;
    var v = typeof o.voice === "object" && o.voice ? o.voice : null;
    if (!v) { var vs = voices(o.lang); v = typeof o.voice === "number" && vs[o.voice] ? vs[o.voice] : voice(o.lang, o.prefer); }
    u.lang = o.lang; try { if (v) u.voice = v; } catch (e) {}
    u.rate = o.rate || 1; u.pitch = o.pitch || 1; u.volume = 1;
    keep.push(u); if (keep.length > 20) keep.shift();
    function fin() { if (done) return; done = true; res(); }
    u.onstart = function () { started = true; };
    u.onend = fin;
    u.onerror = function (e) { if (e && e.error === "not-allowed") hint("Der Browser hat den Ton blockiert. Tippe einmal auf 🔊."); fin(); };
    try { if (syn.paused) syn.resume(); syn.speak(u); } catch (e) { fin(); return; }
    setTimeout(function () {
      if (started || done) return;
      if (!syn.speaking && !syn.pending) {
        var n = NAMES[String(o.lang).slice(0, 2)];
        hint(!v && all().length ? "Auf diesem Gerät fehlt eine " + (n || "passende") + " Stimme." : "Es kommt kein Ton?");
      }
    }, 2500);
    setTimeout(fin, 2500 + String(text).length * 400 / (o.rate || 1));
  }

  // Ton.speak(text, {lang, rate, pitch, voice: Index oder Stimme, prefer: RegExp}) → Promise, löst nach dem Satz auf
  function speak(text, o) {
    o = o || {};
    return new Promise(function (res) {
      if (!syn || !window.SpeechSynthesisUtterance) { hint("Dieser Browser kann nicht vorlesen."); return res(); }
      text = String(text || "").replace(/\s+/g, " ").trim();
      if (!text) return res();
      // Läuft schon etwas, erst abbrechen und kurz warten, sonst verschlucken Chrome und Safari den neuen Satz
      if (syn.speaking || syn.pending) { syn.cancel(); setTimeout(function () { say(text, o, res); }, 80); }
      else say(text, o, res);
    });
  }

  window.Ton = {
    speak: speak,
    stop: function () { if (syn) syn.cancel(); },
    voices: voices,
    voice: voice,
    ready: function () { return all().length > 0; },
    supported: !!syn,
    helpUrl: base + "hilfe/"
  };
  all(); // stößt in Chrome das Laden der Stimmen an
})();
