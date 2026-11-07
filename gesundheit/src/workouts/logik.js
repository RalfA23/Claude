/* Geführte Körpergewicht-Workouts: Übungen, Workouts und der Ablauf als Schrittfolge.
   Reine Daten und Logik ohne DOM (Browser und node --test). */
(function (root) {
  "use strict";

  /* s = Sekunden pro Wiederholung (für die Dauerschätzung), seite = je Seite, zeit = wird auf Zeit gemacht */
  const UEBUNGEN = {
    kniebeuge: {n: "Kniebeugen", g: "Beine", s: 2.5, h: "Füße schulterbreit, Hüfte nach hinten, mindestens bis die Oberschenkel waagerecht sind, Fersen bleiben am Boden.", e: "Halbe Tiefe oder an einem Stuhl"},
    hockstreck: {n: "Hocksprünge", g: "Beine", s: 3, h: "Tiefe Kniebeuge, dann explosiv nach oben springen, weich landen und direkt in die nächste Beuge.", e: "Kniebeugen ohne Sprung"},
    ausfallschritt: {n: "Ausfallschritte", g: "Beine", s: 3, h: "Großer Schritt nach vorn, hinteres Knie fast zum Boden, Oberkörper aufrecht, abwechselnd links und rechts.", e: "Rückwärts-Ausfallschritt mit Halt"},
    ausfallsprung: {n: "Ausfallsprünge", g: "Beine", s: 3, h: "Aus dem Ausfallschritt hochspringen und in der Luft die Beine wechseln.", e: "Ausfallschritte ohne Sprung"},
    bulgarisch: {n: "Bulgarische Kniebeuge", g: "Beine", s: 4, seite: true, h: "Hinterer Fuß auf Stuhl oder Bank, vorderes Bein beugen bis der Oberschenkel waagerecht ist.", e: "Normaler Ausfallschritt"},
    beckenheben: {n: "Beckenheben", g: "Beine", s: 2.5, h: "Rückenlage, Füße nah am Gesäß, Becken hochdrücken bis Knie, Hüfte und Schultern eine Linie bilden, oben kurz anspannen.", e: "Kleinere Bewegung"},
    wadenheben: {n: "Wadenheben", g: "Beine", s: 1.8, h: "Auf einer Stufe oder flach, langsam ganz hoch auf die Zehen und kontrolliert ab.", e: "Mit Halt an der Wand"},
    wandsitzen: {n: "Wandsitzen", g: "Beine", zeit: true, h: "Rücken an die Wand, Knie im rechten Winkel, Arme nicht auf die Beine stützen.", e: "Höher sitzen"},
    aufsteiger: {n: "Aufsteiger", g: "Beine", s: 3, h: "Auf Stuhl oder Stufe steigen, oben ganz aufrichten, abwechselnd das Führungsbein wechseln.", e: "Niedrigere Stufe"},
    liegestuetz: {n: "Liegestütze", g: "Oberkörper", s: 2.5, h: "Hände etwas weiter als schulterbreit, Körper eine Linie, Brust fast zum Boden, Ellbogen etwa 45 Grad vom Körper.", e: "Auf den Knien oder an einer Bank"},
    knieliegestuetz: {n: "Liegestütze auf Knien", g: "Oberkörper", s: 2.2, h: "Wie Liegestütze, aber auf den Knien. Hüfte bleibt gestreckt.", e: "An der Wand"},
    diamant: {n: "Enge Liegestütze", g: "Oberkörper", s: 2.8, h: "Hände unter der Brust eng zusammen, Ellbogen streifen am Körper entlang. Trainiert vor allem den Trizeps.", e: "Auf den Knien"},
    schulterlieg: {n: "Schulter-Liegestütze", g: "Oberkörper", s: 3, h: "Hüfte hoch wie ein umgedrehtes V, Kopf zwischen den Händen Richtung Boden senken und hochdrücken.", e: "Füße auf dem Boden, kleiner Bewegungsweg"},
    dips: {n: "Dips am Stuhl", g: "Oberkörper", s: 2.5, h: "Hände hinter dir auf Stuhlkante, Beine nach vorn, Ellbogen bis 90 Grad beugen und hochdrücken.", e: "Beine anwinkeln"},
    klimmzug: {n: "Klimmzüge", g: "Oberkörper", s: 4, h: "Aus dem Hang mit gestreckten Armen hochziehen, bis das Kinn über der Stange ist, kontrolliert ab.", e: "Mit Band oder nur langsam ablassen"},
    tischrudern: {n: "Rudern unter dem Tisch", g: "Oberkörper", s: 3, h: "Unter einen stabilen Tisch legen, Kante greifen, Brust zur Kante ziehen, Körper gerade.", e: "Knie angewinkelt"},
    burpee: {n: "Burpees", g: "Ganzkörper", s: 4, h: "In die Hocke, Beine nach hinten in den Stütz, Brust zum Boden, Beine zurück, aufrichten und mit Klatschen über dem Kopf springen.", e: "Ohne Liegestütz und ohne Sprung"},
    hampelmann: {n: "Hampelmänner", g: "Cardio", s: 1, h: "Beine auseinander springen und Arme über den Kopf, zurück in die Ausgangsstellung, locker und schnell.", e: "Seitlich tippen statt springen"},
    kniehebe: {n: "Kniehebelauf", g: "Cardio", s: 0.6, h: "Auf der Stelle laufen, Knie bis Hüfthöhe, Arme mitnehmen.", e: "Gehen mit hohen Knien"},
    bergsteiger: {n: "Bergsteiger", g: "Rumpf", s: 0.8, h: "Im Liegestütz die Knie abwechselnd schnell zur Brust ziehen, Hüfte bleibt unten.", e: "Langsam im Wechsel"},
    seilspringen: {n: "Seilspringen", g: "Cardio", s: 0.5, h: "Locker auf den Fußballen, Handgelenke drehen das Seil. Ohne Seil die Bewegung andeuten.", e: "Ohne Seil"},
    laufen: {n: "Laufen", g: "Cardio", s: 0.3, einheit: "m", h: "Zügiges Tempo, das du über die ganze Strecke halten kannst.", e: "Zügig gehen"},
    situp: {n: "Sit-ups", g: "Rumpf", s: 2.5, h: "Rückenlage, Knie gebeugt, mit Schwung aus dem Bauch ganz hoch und kontrolliert zurück.", e: "Crunches"},
    crunch: {n: "Crunches", g: "Rumpf", s: 1.8, h: "Rückenlage, nur die Schulterblätter vom Boden heben, Blick zur Decke.", e: "Kleinere Bewegung"},
    plank: {n: "Unterarmstütz", g: "Rumpf", zeit: true, h: "Unterarme unter den Schultern, Körper eine gerade Linie, Bauch und Gesäß fest.", e: "Auf den Knien"},
    seitstuetz: {n: "Seitstütz", g: "Rumpf", zeit: true, seite: true, h: "Auf einem Unterarm, Füße übereinander, Hüfte hoch, Körper eine Linie.", e: "Unteres Knie am Boden"},
    schulterklopf: {n: "Stütz mit Schulterklopfen", g: "Rumpf", s: 1.2, h: "Im hohen Liegestütz abwechselnd die gegenüberliegende Schulter antippen, Hüfte ruhig halten.", e: "Füße weiter auseinander"},
    beinheben: {n: "Beinheben", g: "Rumpf", s: 2.5, h: "Rückenlage, Hände unter dem Po, gestreckte Beine langsam heben und senken, unten nicht ablegen.", e: "Knie gebeugt"},
    drehung: {n: "Russische Drehung", g: "Rumpf", s: 1, h: "Sitzen, Oberkörper leicht zurück, Füße heben, Hände abwechselnd links und rechts neben die Hüfte.", e: "Füße am Boden"},
    superman: {n: "Superman", g: "Rumpf", s: 2.5, h: "Bauchlage, Arme und Beine gleichzeitig leicht anheben, kurz halten, ablegen.", e: "Nur Arme oder nur Beine"},
    hollow: {n: "Schiffchen halten", g: "Rumpf", zeit: true, h: "Rückenlage, Lendenwirbel am Boden, Schultern und gestreckte Beine knapp über dem Boden halten.", e: "Knie anziehen"},
    katzekuh: {n: "Katze-Kuh", g: "Mobilität", zeit: true, h: "Vierfüßlerstand, im Wechsel Rücken rund machen und durchhängen lassen, mit dem Atem.", e: ""},
    raupe: {n: "Raupe", g: "Mobilität", s: 6, h: "Aus dem Stand vorbeugen, mit den Händen in den Liegestütz laufen und zurück.", e: "Knie beugen"},
    weltdehnung: {n: "Ausfallschritt mit Drehung", g: "Mobilität", zeit: true, seite: true, h: "Tiefer Ausfallschritt, gleichseitigen Ellbogen Richtung Boden, dann Arm zur Decke aufdrehen.", e: "Hinteres Knie ablegen"},
    hueftbeuger: {n: "Hüftbeuger-Dehnung", g: "Mobilität", zeit: true, seite: true, h: "Kniender Ausfallschritt, Becken nach vorn schieben, Gesäß anspannen.", e: ""},
    kindhaltung: {n: "Kindhaltung", g: "Mobilität", zeit: true, h: "Auf die Fersen setzen, Arme lang nach vorn, Stirn ablegen, ruhig atmen.", e: ""},
    armkreisen: {n: "Armkreisen", g: "Mobilität", zeit: true, h: "Große Kreise vorwärts und rückwärts, Schultern locker.", e: ""},
    beinpendel: {n: "Beinpendel", g: "Mobilität", zeit: true, seite: true, h: "An der Wand festhalten, ein Bein locker vor und zurück schwingen.", e: ""},
    oberschenkel: {n: "Oberschenkel-Dehnung", g: "Mobilität", zeit: true, seite: true, h: "Im Stand eine Ferse zum Gesäß ziehen, Knie zeigen nach unten.", e: "Mit Halt an der Wand"},
    vorbeuge: {n: "Vorbeuge im Sitzen", g: "Mobilität", zeit: true, h: "Beine lang, Rücken lang, aus der Hüfte nach vorn beugen.", e: "Knie leicht gebeugt"}
  };

  const KATEGORIEN = ["Ganzkörper", "Oberkörper", "Beine", "Rumpf", "Cardio", "Mobilität"];
  const LEVEL = {1: "Einsteiger", 2: "Fortgeschritten", 3: "Profi"};

  /* typ "runden": Runden auf Zeit, Wiederholungen je Übung (Zahl oder Liste pro Runde), {z: Sek} für Halteübungen.
     typ "intervall": jede Übung arbeit Sekunden, dann pause Sekunden. */
  const WORKOUTS = [
    {id: "alster", n: "Alster", k: "Ganzkörper", l: 1, typ: "runden", runden: 3, pause: 60, t: "Der ruhige Einstieg: alles dabei, nichts zu wild.",
      ue: [["kniebeuge", 10], ["knieliegestuetz", 8], ["ausfallschritt", 10], ["hampelmann", 20], ["plank", {z: 20}]]},
    {id: "elbe", n: "Elbe", k: "Ganzkörper", l: 2, typ: "runden", runden: 4, pause: 0, t: "Vier Runden auf Zeit. Pausen machst du, wann du sie brauchst.",
      ue: [["burpee", 10], ["kniebeuge", 20], ["liegestuetz", 12], ["bergsteiger", 20], ["situp", 15]]},
    {id: "sturmflut", n: "Sturmflut", k: "Ganzkörper", l: 3, typ: "runden", runden: 5, pause: 0, t: "Fünf harte Runden. Ziel: unter 30 Minuten.",
      ue: [["burpee", 15], ["hockstreck", 20], ["liegestuetz", 20], ["bergsteiger", 30], ["situp", 20]]},
    {id: "hagenbeck", n: "Hagenbeck", k: "Ganzkörper", l: 2, typ: "intervall", runden: 3, arbeit: 40, ruhe: 20, rundenpause: 60, t: "Zirkel mit 40 Sekunden Arbeit und 20 Sekunden Pause.",
      ue: [["kniebeuge"], ["liegestuetz"], ["ausfallschritt"], ["bergsteiger"], ["beckenheben"]]},
    {id: "fischmarkt", n: "Fischmarkt", k: "Ganzkörper", l: 1, typ: "intervall", runden: 1, arbeit: 30, ruhe: 10, rundenpause: 0, t: "Zwölf Übungen, je 30 Sekunden. Rund sieben Minuten, perfekt für zwischendurch.",
      ue: [["hampelmann"], ["wandsitzen"], ["liegestuetz"], ["crunch"], ["aufsteiger"], ["kniebeuge"], ["dips"], ["plank"], ["kniehebe"], ["ausfallschritt"], ["schulterklopf"], ["seitstuetz"]]},
    {id: "michel", n: "Michel", k: "Oberkörper", l: 2, typ: "runden", runden: 5, pause: 45, t: "Brust, Schultern und Arme. Saubere Wiederholungen vor Tempo.",
      ue: [["liegestuetz", 10], ["dips", 12], ["schulterlieg", 8], ["tischrudern", 10], ["schulterklopf", 20]]},
    {id: "kranhaus", n: "Kranhaus", k: "Oberkörper", l: 1, typ: "runden", runden: 3, pause: 60, t: "Oberkörper für den Anfang, mit Liegestützen auf den Knien.",
      ue: [["knieliegestuetz", 10], ["tischrudern", 8], ["dips", 8], ["superman", 12]]},
    {id: "elbphilharmonie", n: "Elbphilharmonie", k: "Oberkörper", l: 3, typ: "runden", runden: 1, pause: 0, t: "Leiter von 10 bis 1: in jeder Runde eine Wiederholung weniger.",
      ue: [["klimmzug", [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], ["liegestuetz", [20, 18, 16, 14, 12, 10, 8, 6, 4, 2]], ["diamant", [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]], leiter: 10},
    {id: "deich", n: "Deich", k: "Beine", l: 2, typ: "runden", runden: 4, pause: 45, t: "Beine und Po, mit Wandsitzen zum Schluss jeder Runde.",
      ue: [["kniebeuge", 20], ["ausfallschritt", 16], ["beckenheben", 15], ["wadenheben", 20], ["wandsitzen", {z: 30}]]},
    {id: "landungsbruecken", n: "Landungsbrücken", k: "Beine", l: 3, typ: "runden", runden: 5, pause: 0, t: "Sprungkraft und Ausdauer in den Beinen.",
      ue: [["hockstreck", 20], ["ausfallsprung", 20], ["bulgarisch", 10], ["wandsitzen", {z: 45}]]},
    {id: "stadtpark", n: "Stadtpark", k: "Beine", l: 1, typ: "runden", runden: 3, pause: 60, t: "Kräftige Beine ohne Sprünge.",
      ue: [["kniebeuge", 12], ["aufsteiger", 12], ["beckenheben", 12], ["wadenheben", 15]]},
    {id: "speicherstadt", n: "Speicherstadt", k: "Rumpf", l: 2, typ: "intervall", runden: 3, arbeit: 40, ruhe: 20, rundenpause: 45, t: "Rumpf rundherum: vorn, seitlich, hinten.",
      ue: [["plank"], ["bergsteiger"], ["drehung"], ["beinheben"], ["seitstuetz"], ["superman"]]},
    {id: "hafenkante", n: "Hafenkante", k: "Rumpf", l: 1, typ: "runden", runden: 3, pause: 45, t: "Kurzes Bauchprogramm für den Anfang.",
      ue: [["crunch", 15], ["plank", {z: 20}], ["beinheben", 10], ["drehung", 20]]},
    {id: "leuchtturm", n: "Leuchtturm", k: "Rumpf", l: 3, typ: "runden", runden: 4, pause: 0, t: "Harter Rumpf mit langen Haltezeiten.",
      ue: [["situp", 25], ["hollow", {z: 45}], ["beinheben", 20], ["schulterklopf", 30], ["plank", {z: 60}]]},
    {id: "blankenese", n: "Blankenese", k: "Cardio", l: 2, typ: "intervall", runden: 4, arbeit: 30, ruhe: 15, rundenpause: 60, t: "Puls hoch, kurze Pausen.",
      ue: [["hampelmann"], ["kniehebe"], ["bergsteiger"], ["hockstreck"]]},
    {id: "kiez", n: "Kiez", k: "Cardio", l: 3, typ: "intervall", runden: 8, arbeit: 20, ruhe: 10, rundenpause: 0, t: "Acht Runden 20 Sekunden Vollgas, 10 Sekunden Pause. Vier Minuten, die sich lang anfühlen.",
      ue: [["burpee"]]},
    {id: "elbstrand", n: "Elbstrand", k: "Cardio", l: 2, typ: "runden", runden: 3, pause: 0, t: "Laufen und Kraft im Wechsel. Draußen oder auf dem Laufband.",
      ue: [["laufen", 400], ["burpee", 10], ["kniebeuge", 20]]},
    {id: "hafenfaehre", n: "Hafenfähre", k: "Cardio", l: 1, typ: "intervall", runden: 3, arbeit: 30, ruhe: 30, rundenpause: 30, t: "Lockeres Cardio mit gleich langen Pausen.",
      ue: [["hampelmann"], ["kniehebe"], ["seilspringen"]]},
    {id: "plantenunblomen", n: "Planten un Blomen", k: "Mobilität", l: 1, typ: "intervall", runden: 1, arbeit: 45, ruhe: 10, rundenpause: 0, t: "Beweglichkeit für Hüfte, Rücken und Schultern. Gut an Ruhetagen oder nach dem Krafttraining.",
      ue: [["katzekuh"], ["raupe"], ["weltdehnung"], ["hueftbeuger"], ["oberschenkel"], ["vorbeuge"], ["kindhaltung"]]},
    {id: "morgenrunde", n: "Morgenrunde", k: "Mobilität", l: 1, typ: "intervall", runden: 1, arbeit: 40, ruhe: 5, rundenpause: 0, t: "Fünf Minuten zum Wachwerden.",
      ue: [["armkreisen"], ["katzekuh"], ["beinpendel"], ["weltdehnung"], ["kniebeuge"]]}
  ];

  const AUFWAERMEN = [["hampelmann", 30], ["armkreisen", 30], ["beinpendel", 30], ["kniebeuge", 30], ["weltdehnung", 30]];
  const DEHNEN = [["hueftbeuger", 30], ["oberschenkel", 30], ["vorbeuge", 30], ["kindhaltung", 40]];

  /* Stufe: 1 leichter, 2 normal, 3 härter. Wirkt auf Wiederholungen, Haltezeiten und Rundenzahl. */
  const FAKTOR = {1: 0.7, 2: 1, 3: 1.3};
  const rundeWdh = (x, st) => Math.max(1, Math.round(x * FAKTOR[st || 2]));
  function rundenFuer(w, st) {
    if (w.leiter) return w.leiter;
    const r = w.runden + (st === 3 ? 1 : 0) - (st === 1 && w.runden > 2 ? 1 : 0);
    return Math.max(1, r);
  }

  function schritteFuerSeite(ue, sek, extra) {
    const u = UEBUNGEN[ue];
    if (u.seite) {
      const h = Math.max(10, Math.round(sek / 2));
      return [Object.assign({typ: "zeit", ue, sek: h, seite: "links"}, extra), Object.assign({typ: "zeit", ue, sek: h, seite: "rechts"}, extra)];
    }
    return [Object.assign({typ: "zeit", ue, sek}, extra)];
  }

  /* Workout in eine Folge von Schritten auflösen. */
  function schritte(w, opt) {
    const o = Object.assign({stufe: 2, aufwaermen: false, dehnen: false}, opt || {});
    const st = o.stufe;
    const out = [];
    if (o.aufwaermen) AUFWAERMEN.forEach(([id, s]) => out.push(...schritteFuerSeite(id, s, {abschnitt: "Aufwärmen"})));
    const R = rundenFuer(w, st);
    for (let r = 1; r <= R; r++) {
      w.ue.forEach(([id, wdh], i) => {
        const u = UEBUNGEN[id];
        const letzte = i === w.ue.length - 1;
        if (w.typ === "intervall") {
          out.push(...schritteFuerSeite(id, Math.round(w.arbeit * (st === 3 ? 1.15 : st === 1 ? 0.85 : 1)), {runde: r, runden: R, abschnitt: "Workout"}));
          const ende = letzte && r === R;
          const ps = letzte && w.rundenpause ? w.rundenpause : w.ruhe;
          if (!ende && ps) out.push({typ: "pause", sek: ps, runde: r, runden: R, abschnitt: "Workout", rundenende: letzte && !!w.rundenpause});
        } else if (wdh && typeof wdh === "object" && !Array.isArray(wdh)) {
          out.push(...schritteFuerSeite(id, rundeWdh(wdh.z, st), {runde: r, runden: R, abschnitt: "Workout"}));
        } else {
          const basis = Array.isArray(wdh) ? wdh[r - 1] : wdh;
          const n = u.einheit ? Math.round(basis * FAKTOR[st] / 50) * 50 || basis : rundeWdh(basis, st);
          out.push({typ: "wdh", ue: id, wdh: n, runde: r, runden: R, abschnitt: "Workout"});
        }
      });
      const rp = w.typ === "intervall" ? 0 : w.pause;
      if (r < R && rp) out.push({typ: "pause", sek: rp, runde: r, runden: R, abschnitt: "Workout", rundenende: true});
    }
    if (o.dehnen) DEHNEN.forEach(([id, s]) => out.push(...schritteFuerSeite(id, s, {abschnitt: "Dehnen"})));
    return out;
  }

  function dauerSek(w, opt) {
    return schritte(w, opt).reduce((a, s) => a + (s.typ === "wdh" ? s.wdh * (UEBUNGEN[s.ue].s || 2.5) + 5 : s.sek), 0);
  }

  function zeitText(sek) {
    sek = Math.max(0, Math.round(sek));
    const h = Math.floor(sek / 3600), m = Math.floor(sek % 3600 / 60), s = sek % 60;
    const p = n => String(n).padStart(2, "0");
    return h ? h + ":" + p(m) + ":" + p(s) : m + ":" + p(s);
  }

  /* Was sagt die Stimme an? */
  function ansage(s) {
    if (s.typ === "pause") return s.rundenende ? "Pause, " + s.sek + " Sekunden. Gleich kommt Runde " + (s.runde + 1) + "." : "Pause, " + s.sek + " Sekunden.";
    const u = UEBUNGEN[s.ue];
    const seite = s.seite ? ", " + s.seite : "";
    if (s.typ === "zeit") return s.sek + " Sekunden " + u.n + seite;
    return s.wdh + (u.einheit ? " Meter " : " ") + u.n;
  }

  /* Vorschlag für heute: was zuletzt am längsten nicht dran war, passend zur Kategorie, die am längsten her ist. */
  function vorschlag(verlauf, heute) {
    const letzteKat = {}, letztesW = {};
    for (const v of verlauf) {
      const w = WORKOUTS.find(x => x.id === v.id); if (!w) continue;
      if (!letzteKat[w.k] || v.datum > letzteKat[w.k]) letzteKat[w.k] = v.datum;
      if (!letztesW[w.id] || v.datum > letztesW[w.id]) letztesW[w.id] = v.datum;
    }
    const kats = KATEGORIEN.filter(k => k !== "Mobilität").sort((a, b) => (letzteKat[a] || "").localeCompare(letzteKat[b] || ""));
    const kat = kats[0];
    const seed = Number(String(heute || "").replace(/-/g, "")) || 0;
    const kand = WORKOUTS.filter(w => w.k === kat).sort((a, b) => (letztesW[a.id] || "").localeCompare(letztesW[b.id] || "") || ((a.id.length + seed) % 3) - ((b.id.length + seed) % 3));
    return kand[0] || WORKOUTS[0];
  }

  const api = {UEBUNGEN, KATEGORIEN, LEVEL, WORKOUTS, schritte, dauerSek, zeitText, ansage, vorschlag, rundenFuer};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WO = api;
})(typeof window !== "undefined" ? window : globalThis);
