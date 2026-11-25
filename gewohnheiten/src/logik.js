/* Gewohnheiten-Tracker (Monat und Jahr): Datum, Trainingsplan pro Tag, Serien und Jahreszahlen.
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

  /* Das Training aus dem Plan der Gesundheitsseite lässt sich als Gewohnheit dazunehmen. */
  const TRAINING = {id: "training", n: "Training nach Plan", i: "🏋️", f: "acc"};
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

  /* Monatskalender: Liste von Wochen (Mo–So), leere Felder als null. m = 0..11 */
  function monat(y, m) {
    const erste = new Date(y, m, 1), vor = wdIndex(erste), n = daysInMonth(y, m), out = [];
    let w = new Array(vor).fill(null);
    for (let t = 1; t <= n; t++) { w.push(new Date(y, m, t)); if (w.length === 7) { out.push(w); w = []; } }
    if (w.length) { while (w.length < 7) w.push(null); out.push(w); }
    return out;
  }
  /* Monatszahlen bis heute: erledigt und fällig. */
  function monatZahlen(done, y, m, heute, zaehlt) {
    const z = zaehlt || (() => true);
    let erledigt = 0, faellig = 0;
    for (let t = 1; t <= daysInMonth(y, m); t++) {
      const d = new Date(y, m, t); if (d > heute) break;
      if (done(iso(d))) erledigt++;
      if (z(d)) faellig++;
    }
    return {erledigt, faellig, quote: faellig ? Math.min(100, Math.round(erledigt / faellig * 100)) : 0};
  }

  /* ---------- GEVT-Tagesaufgaben: drei Bereiche, Anzahl per Würfel, Wiederholung über die Statistik ----------
     form: rollierend durch die Formen, Anzahl = Durchgänge.
     denk: Nachdenk-Aufgabe zu einem Prinzip, Anzahl = Minuten.
     frei: Übung aus Notizen, Masterclass und Videos, Anzahl = Wiederholungen. */
  const GEVT_BEREICHE = {
    form: {titel: "Form", icon: "🥋", einheit: ["Durchgang", "Durchgänge"], min: 2, max: 6,
      themen: ["Siu Nim Tau", "Chum Kiu", "Biu Tze", "Holzpuppenform"]},
    denk: {titel: "Nachdenken · Prinzip", icon: "💭", einheit: ["Minute", "Minuten"], min: 3, max: 10,
      themen: ["Mittellinie", "Entspannung und Lockerheit", "Struktur und Erdung", "Ökonomie der Bewegung", "Vorwärtsdruck", "Kleben und Folgen", "Gleichzeitig angreifen und abwehren", "Timing und Distanz", "Ellbogenposition", "Kraft aus dem Boden"]},
    puppe: {titel: "Holzpuppe", icon: "🪵", einheit: ["Wiederholung", "Wiederholungen"], min: 3, max: 10,
      themen: ["Tan Sao und Fook Sao an der Puppe", "Bong Sao und Lap Sao an der Puppe", "Pak Sao und Fauststoß an der Puppe", "Gaan Sao an der Puppe", "Tritte an der Puppe", "Schrittarbeit um die Puppe", "ein Abschnitt der Holzpuppenform", "eine Holzpuppenübung aus der Masterclass", "eine Holzpuppenübung aus meinen Notizbüchern"]},
    frei: {titel: "Allein üben", icon: "📜", einheit: ["Wiederholung", "Wiederholungen"], min: 3, max: 10,
      themen: ["Kettenfauststoß", "Stand (Yee Jee Kim Yeung Ma)", "Drehen im Stand", "Schrittarbeit", "Tan Sao, Bong Sao und Fook Sao in der Luft", "Pak Sao und Lap Sao als Schattenübung", "Ellbogenschläge", "Tritte", "Fauststoß am Wandsack", "eine Übung aus der Masterclass für allein", "eine Übung aus einem YouTube-Video von Sifu Göksel für allein", "eine Übung aus meinen Notizbüchern für allein"]}
  };
  /* Doppelmesser (Baat Jaam Dao): eigene Karte mit eigenem Haken gevt-messer (Ralf, 2026-11-25). */
  GEVT_BEREICHE.messer = {titel: "Doppelmesser", icon: "🔪", einheit: ["Wiederholung", "Wiederholungen"], min: 3, max: 10,
    themen: ["Erster Abschnitt der Doppelmesserform", "Zweiter Abschnitt der Doppelmesserform", "Dritter Abschnitt der Doppelmesserform", "Vierter Abschnitt der Doppelmesserform", "Doppelmesserform komplett", "Schrittarbeit mit den Messern", "Grundschnitte und Stiche", "Abwehrtechniken mit den Messern", "Griff, Handgelenk und Messerwechsel", "eine Doppelmesserübung aus der Masterclass", "eine Doppelmesserübung aus meinen Notizbüchern"]};
  const GEVT_REIHE = ["form", "puppe", "frei"], GEVT_ALLE = GEVT_REIHE.concat(["denk", "messer"]);  // denk und messer sind eigene Rubriken mit eigenem Haken
  const einheit = (b, n) => GEVT_BEREICHE[b].einheit[n === 1 ? 0 : 1];
  function wuerfel(min, max, rnd) { const r = (rnd || Math.random)(); return min + Math.floor(r * (max - min + 1)); }

  /* Statistik aus allen Tagesdokumenten: nur Tage, die abgehakt sind, zählen.
     docs = {datum: {form: {thema, anzahl}, …}}, erledigt(datum) -> bool.
     Ergebnis: {bereich: {thema: {tage, summe, zuletzt}}} */
  function gevtStatistik(docs, erledigt) {
    const out = {}; for (const b of GEVT_ALLE) out[b] = {};
    for (const [datum, doc] of Object.entries(docs || {})) {
      if (!doc) continue;
      for (const b of GEVT_ALLE) {
        const a = doc[b]; if (!a || !a.thema || !erledigt(datum, b)) continue;
        const z = out[b][a.thema] || (out[b][a.thema] = {tage: 0, summe: 0, zuletzt: ""});
        z.tage++; z.summe += Number(a.anzahl) || 0;
        if (datum > z.zuletzt) z.zuletzt = datum;
      }
    }
    return out;
  }
  /* Nächstes Thema: am seltensten geübt, bei Gleichstand am längsten her, dann Reihenfolge der Liste.
     So kommt jedes Thema regelmäßig wieder (rollierend). versuch > 0 nimmt das nächste in dieser Reihenfolge. */
  function gevtNaechstes(b, stat, versuch) {
    const t = GEVT_BEREICHE[b].themen, st = (stat && stat[b]) || {};
    const sortiert = t.map((x, i) => ({x, i, n: (st[x] || {}).tage || 0, z: (st[x] || {}).zuletzt || ""}))
      .sort((a, c) => a.n - c.n || (a.z < c.z ? -1 : a.z > c.z ? 1 : 0) || a.i - c.i);
    return sortiert[(versuch || 0) % sortiert.length].x;
  }
  /* Antwort der Wissensdatenbank zerlegen: STUFE-Zeile, AUFGABE-Zeile, Erläuterung, QUELLEN. */
  /* Frühere Aufgaben eines Bereichs (neueste zuerst, ohne heute), damit die Wissensdatenbank nichts wiederholt. */
  function gevtFrueher(docs, b, heute, n) {
    return Object.keys(docs || {}).filter(d => d < heute && docs[d] && docs[d][b] && docs[d][b].aufgabe)
      .sort().reverse().slice(0, n || 12).map(d => docs[d][b].aufgabe);
  }

  function gevtZerlegen(t) {
    let stufe = "", aufgabe = "";
    const m = t.match(/^\s*STUFE:\s*(.*)\n?/);
    if (m) { stufe = m[1].trim(); t = t.slice(m[0].length); }
    const q = t.search(/^\s*QUELLEN:?\s*$/m);
    let quellen = "";
    if (q >= 0) { quellen = t.slice(q).replace(/^\s*QUELLEN:?\s*$/m, "").trim(); t = t.slice(0, q); }
    const a = t.match(/^\s*\**AUFGABE:?\**:?\s*(.+)$/mi);
    if (a) { aufgabe = a[1].replace(/\*\*/g, "").trim(); t = t.replace(a[0], ""); }
    let erklaerung = t.replace(/^\s*\**ERL(Ä|AE)UTERUNG:?\**:?\s*/mi, "").trim();
    if (!aufgabe) { const satz = erklaerung.match(/^[^.!?\n]+[.!?]?/); aufgabe = satz ? satz[0].replace(/\*\*/g, "").trim() : ""; }
    return {stufe, aufgabe, erklaerung, quellen};
  }

  root.GW = {GEVT_BEREICHE, GEVT_REIHE, GEVT_ALLE, einheit, wuerfel, gevtStatistik, gevtNaechstes, gevtFrueher, gevtZerlegen, monat, monatZahlen, pad, iso, parse, addDays, wdIndex, daysInMonth, WOCHE, ART, planTag, planWoche, istTraining, serie, laengsteSerie, jahr, gesternVerpasst, TRAINING, FARBEN, neueId};
})(typeof window !== "undefined" ? window : globalThis);
