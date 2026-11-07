/* Starting Strength (lineare Anfängerprogression nach Mark Rippetoe), eigene Umsetzung.
   Reine Logik ohne DOM, damit sie im Browser und in node --test läuft. */
(function (root) {
  "use strict";

  const UEBUNGEN = {
    kniebeuge: {n: "Kniebeuge", k: "Kniebeuge", saetze: 3, wdh: 5, steig: 2.5, kurz: "KB"},
    druecken: {n: "Drücken (stehend)", k: "Drücken", saetze: 3, wdh: 5, steig: 2.5, kurz: "DR"},
    bank: {n: "Bankdrücken", k: "Bankdrücken", saetze: 3, wdh: 5, steig: 2.5, kurz: "BD"},
    kreuzheben: {n: "Kreuzheben", k: "Kreuzheben", saetze: 1, wdh: 5, steig: 5, kurz: "KH"},
    umsetzen: {n: "Umsetzen (Power Clean)", k: "Umsetzen", saetze: 5, wdh: 3, steig: 2.5, kurz: "US"},
    klimmzug: {n: "Klimmzüge", k: "Klimmzüge", saetze: 3, wdh: 0, steig: 0, kg: true, kurz: "KZ"}
  };

  /* Phase 1: A = Kniebeuge, Drücken, Kreuzheben · B = Kniebeuge, Bankdrücken, Kreuzheben.
     Phase 2: in B ersetzt Umsetzen das Kreuzheben.
     Phase 3: in A wechseln Kreuzheben und Umsetzen, in B kommen Klimmzüge dazu. */
  const PHASEN = {
    1: {n: "Phase 1", t: "Einstieg: zweimal Kreuzheben pro Woche, schnelle Steigerung."},
    2: {n: "Phase 2", t: "Umsetzen kommt dazu, sobald das Kreuzheben schwer wird."},
    3: {n: "Phase 3", t: "Klimmzüge dazu, Kreuzheben und Umsetzen wechseln sich ab."}
  };

  const STANDARD = {
    phase: 1, naechstes: "A", koerpergewicht: 90, stange: 20,
    scheiben: [25, 20, 15, 10, 5, 2.5, 1.25],
    gewichte: {kniebeuge: 20, druecken: 20, bank: 25, kreuzheben: 60, umsetzen: 40},
    steig: {kniebeuge: 2.5, druecken: 2.5, bank: 2.5, kreuzheben: 5, umsetzen: 2.5},
    fehl: {}, pause: {leicht: 120, schwer: 180, nachFehl: 300},
    phase3Zug: "kreuzheben"
  };

  function neuerStand(alt) {
    const s = JSON.parse(JSON.stringify(STANDARD));
    if (alt && typeof alt === "object") {
      for (const k of Object.keys(alt)) {
        if (["gewichte", "steig", "fehl", "pause"].includes(k) && alt[k] && typeof alt[k] === "object") Object.assign(s[k], alt[k]);
        else if (alt[k] !== undefined) s[k] = alt[k];
      }
    }
    return s;
  }

  function plan(stand, welches) {
    const w = welches || stand.naechstes || "A";
    const p = Number(stand.phase) || 1;
    if (w === "A") {
      const zug = p === 3 ? (stand.phase3Zug === "umsetzen" ? "umsetzen" : "kreuzheben") : "kreuzheben";
      return ["kniebeuge", "druecken", zug];
    }
    if (p === 1) return ["kniebeuge", "bank", "kreuzheben"];
    if (p === 2) return ["kniebeuge", "bank", "umsetzen"];
    return ["kniebeuge", "bank", "klimmzug"];
  }

  /* Gewicht auf das kleinste ladbare Stück abrunden (zwei kleinste Scheiben). */
  function schritt(stand) {
    const sc = (stand.scheiben || STANDARD.scheiben).filter(x => x > 0);
    return sc.length ? Math.min(...sc) * 2 : 2.5;
  }
  function runden(kg, stand) {
    const st = schritt(stand);
    return Math.max(stand.stange, Math.floor((kg + 1e-9) / st) * st);
  }
  const rund2 = x => Math.round(x * 100) / 100;

  /* Scheiben pro Seite, größte zuerst. */
  function scheibenProSeite(kg, stand) {
    let rest = rund2((kg - stand.stange) / 2);
    const out = [];
    if (rest <= 0) return out;
    const sc = (stand.scheiben || STANDARD.scheiben).slice().sort((a, b) => b - a);
    for (const p of sc) { while (rest + 1e-9 >= p) { out.push(p); rest = rund2(rest - p); } }
    return out;
  }

  /* Aufwärmsätze: leere Stange 2x5, dann Stufen bei etwa 40, 60 und 80 Prozent.
     Beim Kreuzheben und Umsetzen ohne leere Stange (Hantel liegt auf dem Boden). */
  function aufwaermen(uebung, arbeit, stand) {
    const u = UEBUNGEN[uebung];
    if (!u || u.kg) return [];
    const stange = stand.stange;
    if (arbeit <= stange) return [];
    const boden = uebung === "kreuzheben" || uebung === "umsetzen";
    const stufen = boden ? [[0.4, 5, 2], [0.6, 3, 1], [0.85, 2, 1]] : [[0.4, 5, 1], [0.6, 3, 1], [0.8, 2, 1]];
    const reps = uebung === "umsetzen" ? 3 : 0;
    const out = [];
    if (!boden) out.push({kg: stange, wdh: 5, anzahl: 2});
    let zuletzt = boden ? 0 : stange;
    for (const [pz, w, n] of stufen) {
      const kg = runden(arbeit * pz, stand);
      if (kg <= zuletzt || kg >= arbeit) continue;
      out.push({kg, wdh: reps || w, anzahl: n});
      zuletzt = kg;
    }
    if (boden && !out.length) out.push({kg: stange, wdh: reps || 5, anzahl: 1});
    return out;
  }

  /* Neues Training aus dem Stand. */
  function neuesTraining(stand, welches, datum) {
    const w = welches || stand.naechstes || "A";
    return {
      workout: w, phase: Number(stand.phase) || 1, datum,
      koerpergewicht: stand.koerpergewicht || null,
      uebungen: plan(stand, w).map(id => {
        const u = UEBUNGEN[id];
        const kg = u.kg ? 0 : Math.max(stand.stange, Number(stand.gewichte[id]) || stand.stange);
        return {id, kg, ziel: u.wdh, saetze: Array.from({length: u.saetze}, () => null), warm: aufwaermen(id, kg, stand).map(() => false)};
      }),
      notiz: ""
    };
  }

  function geschafft(ue) {
    const u = UEBUNGEN[ue.id];
    if (u.kg) return ue.saetze.some(x => x !== null);
    return ue.saetze.length > 0 && ue.saetze.every(x => x !== null && x >= ue.ziel);
  }

  /* Training abschließen: Gewichte steigern oder bei Fehlversuchen halten,
     nach dem dritten Fehlversuch am selben Gewicht um 10 Prozent zurück. */
  function abschliessen(stand, tr) {
    const s = neuerStand(stand);
    const meldungen = [];
    for (const ue of tr.uebungen) {
      const u = UEBUNGEN[ue.id];
      if (u.kg) continue;
      const gemacht = ue.saetze.some(x => x !== null);
      if (!gemacht) { meldungen.push(u.k + ": nicht gemacht, Gewicht bleibt " + fmt(ue.kg) + " kg."); s.gewichte[ue.id] = ue.kg; continue; }
      if (geschafft(ue)) {
        const neu = rund2(ue.kg + (Number(s.steig[ue.id]) || u.steig));
        s.gewichte[ue.id] = neu; s.fehl[ue.id] = 0;
        meldungen.push(u.k + ": geschafft, nächstes Mal " + fmt(neu) + " kg.");
      } else {
        const f = (Number(s.fehl[ue.id]) || 0) + 1;
        if (f >= 3) {
          const neu = runden(ue.kg * 0.9, s);
          s.gewichte[ue.id] = neu; s.fehl[ue.id] = 0;
          meldungen.push(u.k + ": dritter Fehlversuch, zurück auf " + fmt(neu) + " kg und wieder hocharbeiten.");
        } else {
          s.gewichte[ue.id] = ue.kg; s.fehl[ue.id] = f;
          meldungen.push(u.k + ": nicht alle Wiederholungen, " + fmt(ue.kg) + " kg noch einmal (Fehlversuch " + f + " von 3).");
        }
      }
    }
    s.naechstes = tr.workout === "A" ? "B" : "A";
    if (Number(tr.phase) === 3 && tr.workout === "A") s.phase3Zug = s.phase3Zug === "umsetzen" ? "kreuzheben" : "umsetzen";
    if (tr.koerpergewicht) s.koerpergewicht = tr.koerpergewicht;
    return {stand: s, meldungen};
  }

  function fmt(x) { return String(rund2(x)).replace(".", ","); }

  function pauseFuer(ue, satzWdh, stand) {
    if (satzWdh !== null && satzWdh < ue.ziel) return stand.pause.nachFehl;
    return ue.id === "kniebeuge" || ue.id === "kreuzheben" ? stand.pause.schwer : stand.pause.leicht;
  }

  const api = {UEBUNGEN, PHASEN, STANDARD, neuerStand, plan, runden, scheibenProSeite, aufwaermen, neuesTraining, geschafft, abschliessen, pauseFuer, fmt};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SS = api;
})(typeof window !== "undefined" ? window : globalThis);
