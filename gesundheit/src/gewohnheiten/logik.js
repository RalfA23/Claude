/* Gewohnheiten-Tracker mit Jahresplan: Datum, Trainingsplan pro Tag, Serien und Jahreszahlen.
   Reine Logik ohne DOM (Browser und node --test). */
(function (root) {
  "use strict";

  const pad = n => String(n).padStart(2, "0");
  const iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
  const wdIndex = d => (d.getDay() + 6) % 7; // Mo = 0
  const monday = d => addDays(d, -wdIndex(d));
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate(); // m = 0..11

  /* Trainingswoche wie auf der Gesundheitsseite (gesundheit/einstellungen: freq "2" oder "3", start).
     3 Tage: Mo/Mi/Fr Kraft, Di Zone 2, Do Intervalle, Sa lang locker, So Ruhe.
     2 Tage: Mo/Do Kraft, Di Zone 2, Mi Intervalle, Fr Zone 2, Sa lang locker, So Ruhe. */
  const WOCHE = {
    "3": ["kraft", "ausdauer", "kraft", "intervall", "kraft", "lang", "ruhe"],
    "2": ["kraft", "ausdauer", "intervall", "kraft", "ausdauer", "lang", "ruhe"]
  };
  const ART = {
    kraft: {t: "Kraft", lang: "Krafttraining"},
    ausdauer: {t: "Zone 2", lang: "Zone 2, 30 bis 45 Min locker"},
    intervall: {t: "Intervalle", lang: "Intervalle 4 × 4"},
    lang: {t: "Lang locker", lang: "45 bis 60 Min zügig gehen oder Rad"},
    ruhe: {t: "Ruhe", lang: "Ruhetag, Spaziergang und Beweglichkeit"}
  };

  /* Was steht an diesem Tag im Plan? null = vor dem Planstart. */
  function planTag(d, settings) {
    const s = settings || {};
    if (s.start && /^\d{4}-\d\d-\d\d$/.test(s.start) && d < parse(s.start)) return null;
    const woche = WOCHE[s.freq === "2" ? "2" : "3"];
    return woche[wdIndex(d)];
  }
  /* Planwoche (1 = erste Woche ab Start), null ohne Start. */
  function planWoche(d, settings) {
    const s = settings || {};
    if (!s.start || !/^\d{4}-\d\d-\d\d$/.test(s.start)) return null;
    return Math.floor((monday(d) - monday(parse(s.start))) / (7 * 864e5)) + 1;
  }
  const istTraining = art => !!art && art !== "ruhe";

  /* Serie: aufeinanderfolgende erledigte Tage bis heute.
     Ist heute noch offen, zählt die Serie bis gestern (der Tag läuft ja noch).
     zaehlt(d) sagt, ob ein Tag überhaupt zählt (beim Training nur geplante Trainingstage). */
  function serie(done, heute, zaehlt) {
    const z = zaehlt || (() => true);
    let d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate()), n = 0, guard = 0;
    if (z(d) && !done(iso(d))) d = addDays(d, -1);
    while (guard++ < 3700) {
      if (!z(d)) { d = addDays(d, -1); continue; }
      if (!done(iso(d))) break;
      n++; d = addDays(d, -1);
    }
    return n;
  }
  /* Längste Serie im Jahr y (Tage, die nicht zählen, unterbrechen nicht). */
  function laengsteSerie(done, y, bis, zaehlt) {
    const z = zaehlt || (() => true);
    let best = 0, cur = 0;
    for (let d = new Date(y, 0, 1); d.getFullYear() === y && d <= bis; d = addDays(d, 1)) {
      const k = iso(d);
      if (!z(d)) continue;
      if (done(k)) { cur++; if (cur > best) best = cur; }
      else cur = 0;
    }
    return best;
  }
  /* Jahreszahlen: erledigt, fällig (bis heute), Quote in Prozent. */
  function jahr(done, y, heute, zaehlt) {
    const z = zaehlt || (() => true);
    let erledigt = 0, faellig = 0;
    for (let d = new Date(y, 0, 1); d.getFullYear() === y && d <= heute; d = addDays(d, 1)) {
      const on = done(iso(d));
      if (on) erledigt++;
      if (z(d)) faellig++;
    }
    return {erledigt, faellig, quote: faellig ? Math.min(100, Math.round(erledigt / faellig * 100)) : 0};
  }
  /* „Nie zweimal aussetzen“: gestern fällig und offen. */
  function gesternVerpasst(done, heute, zaehlt) {
    const z = zaehlt || (() => true), g = addDays(heute, -1);
    return z(g) && !done(iso(g));
  }

  /* Standardvorlage, solange keine eigene Liste gespeichert ist. Training ist fest und kommt aus dem Plan. */
  const VORLAGE = [
    {id: "training", n: "Training nach Plan", i: "🏋️", f: "acc", fest: true},
    {id: "schritte", n: "8.000 Schritte", i: "🚶", f: "ok"},
    {id: "lesen", n: "10 Minuten lesen", i: "📖", f: "acc2"},
    {id: "meditation", n: "Meditation oder Boxatmung", i: "🧘", f: "dusk"}
  ];
  const FARBEN = ["acc", "acc2", "ok", "dusk", "gold"];

  function neueId(name, vorhanden) {
    let base = String(name || "").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "gewohnheit";
    if (base === "training") base = "training-2";
    let id = base, i = 2;
    while (vorhanden.includes(id)) id = base + "-" + i++;
    return id;
  }

  root.GW = {pad, iso, parse, addDays, wdIndex, daysInMonth, WOCHE, ART, planTag, planWoche, istTraining, serie, laengsteSerie, jahr, gesternVerpasst, VORLAGE, FARBEN, neueId};
})(typeof window !== "undefined" ? window : globalThis);
