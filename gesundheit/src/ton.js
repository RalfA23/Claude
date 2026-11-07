/* Signale für die Trainingsseiten: Piepton, deutsche Sprachausgabe, Vibration, Bildschirm wach halten. */
(function () {
  "use strict";
  let ctx = null, lock = null, stimme = null;
  const an = () => { try { return localStorage.getItem("gesundheit-ton") !== "aus"; } catch (e) { return true; } };

  function waehleStimme() {
    if (!("speechSynthesis" in window)) return;
    const v = speechSynthesis.getVoices().filter(x => /^de(-|_|$)/i.test(x.lang));
    stimme = v.find(x => /de-DE/i.test(x.lang) && /premium|enhanced|anna|helena|petra|google/i.test(x.name)) || v.find(x => /de-DE/i.test(x.lang)) || v[0] || null;
  }
  if ("speechSynthesis" in window) { waehleStimme(); speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", waehleStimme); }

  const Ton = {
    get an() { return an(); },
    set an(v) { try { localStorage.setItem("gesundheit-ton", v ? "an" : "aus"); } catch (e) {} },
    /* Muss einmal durch eine Berührung freigeschaltet werden (iOS). */
    entsperren() {
      try { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); } catch (e) {}
    },
    piep(hoch, lang) {
      if (!an()) return;
      try {
        this.entsperren(); if (!ctx) return;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = hoch ? 1175 : 784; o.type = "sine";
        const t = ctx.currentTime, d = lang ? 0.45 : 0.16;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d + 0.05);
      } catch (e) {}
    },
    sag(text) {
      if (!an() || !("speechSynthesis" in window)) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = "de-DE"; if (stimme) u.voice = stimme; u.rate = 1.02;
        speechSynthesis.speak(u);
      } catch (e) {}
    },
    vibrier(muster) { try { if (navigator.vibrate) navigator.vibrate(muster || 200); } catch (e) {} },
    async wach(ja) {
      try {
        if (ja && !lock && navigator.wakeLock) { lock = await navigator.wakeLock.request("screen"); lock.addEventListener("release", () => { lock = null; }); }
        if (!ja && lock) { await lock.release(); lock = null; }
      } catch (e) {}
    }
  };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && Ton._wachGewuenscht) Ton.wach(true); });
  window.Ton = Ton;
})();
