// Stücke und Übungen für die Klavier-App, dazu der Parser für die kurze Notenschrift. Läuft im Browser und im Test (node --test).
//
// Notenschrift je Hand, Tokens durch Leerzeichen getrennt:
//   C4, F#4, Bb3   Ton mit Oktave (C4 = eingestrichenes c, MIDI 60)
//   [C4E4G4]       Akkord
//   r              Pause
//   _1 / _135      Fingersatz (bei Akkorden je Ton eine Ziffer)
//   :2 / :0.5      Dauer in Zähleinheiten des Takts (bei 4/4 Viertel, bei 3/8 Achtel); ohne Angabe gilt die vorige Dauer
//   |              Taktstrich (nur zur Kontrolle, der Test prüft die Taktlängen)

const NOTE_STUFEN = {C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6};
const NOTE_HALBTON = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};

function parseTon(s) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(s);
  if (!m) throw new Error("Unbekannter Ton: " + s);
  const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0, okt = +m[3];
  return {midi: 12 * (okt + 1) + NOTE_HALBTON[m[1]] + acc, step: okt * 7 + NOTE_STUFEN[m[1]], acc};
}

// Eine Hand in Ereignisse zerlegen: [{t, d, notes: [{midi, step, acc, finger}]}], dazu die Taktlängen zur Kontrolle.
function parseHand(text) {
  const events = [], takte = [];
  let t = 0, d = 1, taktStart = 0;
  for (const tok of String(text || "").trim().split(/\s+/).filter(Boolean)) {
    if (tok === "|") { takte.push(+(t - taktStart).toFixed(4)); taktStart = t; continue; }
    const m = /^(\[[^\]]+\]|[A-G][#b]?-?\d|r)(?:_(\d+))?(?::([\d.]+))?$/.exec(tok);
    if (!m) throw new Error("Unbekanntes Zeichen: " + tok);
    if (m[3]) d = +m[3];
    if (m[1] !== "r") {
      const teile = m[1][0] === "[" ? m[1].slice(1, -1).match(/[A-G][#b]?-?\d/g) : [m[1]];
      const finger = m[2] ? m[2].split("").map(Number) : [];
      events.push({t, d, notes: teile.map((s, i) => Object.assign(parseTon(s), {finger: finger[i] || 0}))});
    }
    t += d;
  }
  if (t > taktStart) takte.push(+(t - taktStart).toFixed(4));
  return {events, takte, laenge: t};
}

// Beide Hände zu Schritten zusammenführen: gleiche Zeit = ein Schritt. Jeder Ton weiß, zu welcher Hand er gehört.
function ablauf(lied) {
  const map = new Map();
  let laenge = 0;
  for (const hand of ["r", "l"]) {
    const text = hand === "r" ? lied.rechts : lied.links;
    if (!text) continue;
    const p = parseHand(text);
    laenge = Math.max(laenge, p.laenge);
    for (const ev of p.events) {
      const key = ev.t.toFixed(4);
      if (!map.has(key)) map.set(key, {t: ev.t, notes: []});
      for (const n of ev.notes) map.get(key).notes.push(Object.assign({hand, d: ev.d}, n));
    }
  }
  const schritte = [...map.values()].sort((a, b) => a.t - b.t);
  for (const s of schritte) s.notes.sort((a, b) => a.midi - b.midi);
  return {schritte, laenge, takt: lied.takt || [4, 4], auftakt: lied.auftakt || 0};
}

function haendeVon(lied) { return (lied.rechts ? "r" : "") + (lied.links ? "l" : ""); }

// Zufällige Stammtöne für den Notentrainer (ohne direkte Wiederholung). rnd: Zufallsfunktion 0..1.
function notentrainer(art, anzahl, rnd) {
  const bereich = art === "bass" ? ["C3", "B3"] : art === "beide" ? ["C3", "G5"] : ["C4", "G5"];
  const von = parseTon(bereich[0]).step, bis = parseTon(bereich[1]).step, buch = "CDEFGAB";
  const r = [], l = [];
  let alt = -1;
  for (let i = 0; i < anzahl; i++) {
    let s;
    do { s = von + Math.floor(rnd() * (bis - von + 1)); } while (s === alt);
    alt = s;
    const ton = buch[((s % 7) + 7) % 7] + Math.floor(s / 7);
    const links = art === "bass" || (art === "beide" && s < 28);
    (links ? l : r).push(ton + ":1"); (links ? r : l).push("r:1");
    if (i % 4 === 3 && i < anzahl - 1) { r.push("|"); l.push("|"); }
  }
  const lied = {takt: [4, 4]};
  if (r.some(x => x[0] !== "r" && x !== "|")) lied.rechts = r.join(" ");
  if (l.some(x => x[0] !== "r" && x !== "|")) lied.links = l.join(" ");
  return lied;
}

const STUFEN = [
  {nr: 1, titel: "Erste Schritte", text: "Rechte Hand in der C-Lage: Daumen auf dem C in der Mitte, jeder Finger hat seine Taste."},
  {nr: 2, titel: "Erste Lieder", text: "Bekannte Melodien mit der rechten Hand, zuerst im Fünftonraum, dann mit kleinen Sprüngen."},
  {nr: 3, titel: "Linke Hand", text: "Der Bassschlüssel: kleiner Finger auf dem tiefen C, die linke Hand lernt laufen."},
  {nr: 4, titel: "Beide Hände", text: "Melodie rechts, Grundtöne links. Erst langsam im Warten-Modus, dann im Tempo."},
  {nr: 5, titel: "Akkorde", text: "Dreiklänge auf C, F und G, Kadenz mit Bass und gebrochene Akkorde."},
  {nr: 6, titel: "Tonleitern", text: "C-Dur und G-Dur mit Daumenuntersatz, einzeln und mit beiden Händen."},
  {nr: 7, titel: "Bekannte Melodien", text: "Stücke, die jeder kennt: Happy Birthday, Stille Nacht, Greensleeves und der Kanon von Pachelbel."},
  {nr: 8, titel: "Klassik", text: "Eine kleine Nachtmusik, Menuett in G, das Präludium in C von Bach und der Anfang von Für Elise."},
  {nr: 9, titel: "Notentrainer", text: "Zufällige Noten lesen und sofort spielen, bis es ohne Nachdenken geht."}
];

const ENTCHEN = "C4 D4 E4 F4 | G4:2 G4:2 | A4:1 A4 A4 A4 | G4:4 | A4:1 A4 A4 A4 | G4:4 | F4:1 F4 F4 F4 | E4:2 E4:2 | D4:1 D4 D4 D4 | C4:4";
const ODE = "E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | E4:1.5 D4:0.5 D4:2 | E4:1 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | D4:1.5 C4:0.5 C4:2";
const MORGEN = "C4 C4 G4 G4 | A4 A4 G4:2 | F4:1 F4 E4 E4 | D4 D4 C4:2 | G4:1 G4 F4 F4 | E4 E4 D4:2 | G4:1 G4 F4 F4 | E4 E4 D4:2 | C4:1 C4 G4 G4 | A4 A4 G4:2 | F4:1 F4 E4 E4 | D4 D4 C4:2";

const LIEDER = [
  {id: "cde", stufe: 1, titel: "C, D, E", info: "Drei Töne mit Daumen, Zeigefinger und Mittelfinger.", bpm: 72,
    rechts: "C4_1 D4_2 E4_3 D4_2 | C4_1 D4_2 E4_3 D4_2 | C4_1:2 E4_3:2 | C4_1:4"},
  {id: "fuenf", stufe: 1, titel: "Fünf Finger", info: "Von C bis G und zurück, jeder Finger einmal.", bpm: 72,
    rechts: "C4_1 D4_2 E4_3 F4_4 | G4_5:2 F4_4:1 E4_3 | D4_2 C4_1 D4_2 E4_3 | C4_1:4"},
  {id: "sprung", stufe: 1, titel: "Terzen springen", info: "Kleine Sprünge: C, E, G. Die Hand bleibt liegen.", bpm: 72,
    rechts: "C4_1 E4_3 G4_5 E4_3 | C4_1:2 G4_5:2 | E4_3:1 D4_2 F4_4 D4_2 | C4_1:4"},

  {id: "entchen", stufe: 2, titel: "Alle meine Entchen", info: "Für das A streckt sich der kleine Finger einen Ton weiter.", bpm: 90,
    rechts: ENTCHEN},
  {id: "mary", stufe: 2, titel: "Mary hat ein kleines Lamm", info: "Nur C, D, E und einmal G. Die Hand bleibt ganz ruhig liegen.", bpm: 96,
    rechts: "E4_3 D4_2 C4_1 D4_2 | E4_3 E4 E4:2 | D4_2:1 D4 D4:2 | E4_3:1 G4_5 G4:2 | E4_3:1 D4_2 C4_1 D4_2 | E4_3 E4 E4 E4 | D4_2 D4 E4_3 D4_2 | C4_1:4"},
  {id: "haenschen", stufe: 2, titel: "Hänschen klein", info: "Im Fünftonraum C bis G, mit langen Tönen zum Ausruhen.", bpm: 96,
    rechts: "G4:1 E4 E4:2 | F4:1 D4 D4:2 | C4:1 D4 E4 F4 | G4 G4 G4:2 | G4:1 E4 E4:2 | F4:1 D4 D4:2 | C4:1 E4 G4 G4 | C4:4 | D4:1 D4 D4 D4 | D4 E4 F4:2 | E4:1 E4 E4 E4 | E4 F4 G4:2 | G4:1 E4 E4:2 | F4:1 D4 D4:2 | C4:1 E4 G4 G4 | C4:4"},
  {id: "morgen", stufe: 2, titel: "Morgen kommt der Weihnachtsmann", info: "Die Melodie von „Twinkle, Twinkle“, mit einem Sprung zum G.", bpm: 96,
    rechts: MORGEN},
  {id: "jingle", stufe: 2, titel: "Jingle Bells", info: "Der Refrain, fast nur E, F und G, mit einem Sprung runter zum C.", bpm: 108,
    rechts: "E4 E4 E4:2 | E4:1 E4 E4:2 | E4:1 G4 C4:1.5 D4:0.5 | E4:4 | F4:1 F4 F4 F4 | F4 E4 E4 E4:0.5 E4 | E4:1 D4 D4 E4 | D4:2 G4:2 | E4:1 E4 E4:2 | E4:1 E4 E4:2 | E4:1 G4 C4:1.5 D4:0.5 | E4:4 | F4:1 F4 F4 F4 | F4 E4 E4 E4:0.5 E4 | G4:1 G4 F4 D4 | C4:4"},
  {id: "oldmac", stufe: 2, titel: "Old MacDonald", info: "Der Daumen rutscht kurz runter zum G und A unter dem C.", bpm: 100,
    rechts: "C4 C4 C4 G3 | A3 A3 G3:2 | E4:1 E4 D4 D4 | C4:3 G3:1 | C4:1 C4 C4 G3 | A3 A3 G3:2 | E4:1 E4 D4 D4 | C4:4"},
  {id: "jakob", stufe: 2, titel: "Bruder Jakob", info: "Mit Achteln in der dritten Zeile und dem tiefen G unter dem C.", bpm: 100,
    rechts: "C4 D4 E4 C4 | C4 D4 E4 C4 | E4 F4 G4:2 | E4:1 F4 G4:2 | G4:0.5 A4 G4 F4 E4:1 C4 | G4:0.5 A4 G4 F4 E4:1 C4 | C4 G3 C4:2 | C4:1 G3 C4:2"},
  {id: "ode", stufe: 2, titel: "Ode an die Freude", info: "Beethovens Melodie, mit punktierten Vierteln am Zeilenende.", bpm: 100,
    rechts: ODE},

  {id: "bass5", stufe: 3, titel: "Bass: Fünf Finger", info: "Kleiner Finger auf dem C unter der Mitte, Daumen auf dem G.", bpm: 72,
    links: "C3_5 D3_4 E3_3 F3_2 | G3_1:2 F3_2:1 E3_3 | D3_4 C3_5 D3_4 E3_3 | C3_5:4"},
  {id: "bassterzen", stufe: 3, titel: "Bass: Grundtöne", info: "C und G im Wechsel, so klingt später die Begleitung.", bpm: 80,
    links: "C3_5:2 G3_1:2 | C3_5:2 G3_1:2 | E3_3:1 D3_4 C3_5 D3_4 | C3_5:4"},
  {id: "entchenlinks", stufe: 3, titel: "Entchen links", info: "Alle meine Entchen eine Oktave tiefer mit der linken Hand.", bpm: 84,
    links: "C3 D3 E3 F3 | G3:2 G3:2 | A3:1 A3 A3 A3 | G3:4 | A3:1 A3 A3 A3 | G3:4 | F3:1 F3 F3 F3 | E3:2 E3:2 | D3:1 D3 D3 D3 | C3:4"},

  {id: "parallel", stufe: 4, titel: "Parallel spielen", info: "Beide Daumen zeigen zur Mitte, beide Hände laufen gleich.", bpm: 66,
    rechts: "C4_1 D4_2 E4_3 F4_4 | G4_5 F4_4 E4_3 D4_2 | C4_1:4", links: "C3_5 D3_4 E3_3 F3_2 | G3_1 F3_2 E3_3 D3_4 | C3_5:4"},
  {id: "odebeide", stufe: 4, titel: "Ode an die Freude mit Bass", info: "Links nur C und G als lange Töne.", bpm: 90,
    rechts: ODE, links: "C3:4 | G2:4 | C3:4 | G2:4 | C3:4 | G2:4 | C3:4 | G2:2 C3:2"},
  {id: "morgenbeide", stufe: 4, titel: "Weihnachtsmann mit Bass", info: "Halbe Noten links, die Melodie bleibt wie gelernt.", bpm: 88,
    rechts: MORGEN, links: "C3:4 | F3:2 C3:2 | F3:2 C3:2 | G3:2 C3:2 | C3:2 G3:2 | C3:2 G3:2 | C3:2 G3:2 | C3:2 G3:2 | C3:4 | F3:2 C3:2 | F3:2 C3:2 | G3:2 C3:2"},

  {id: "dreiklaenge", stufe: 5, titel: "Drei Dreiklänge", info: "C-Dur, F-Dur und G-Dur in der bequemsten Lage, alle Töne gleichzeitig.", bpm: 60,
    rechts: "[C4E4G4]_135:4 | [C4F4A4]_125:4 | [B3D4G4]_125:4 | [C4E4G4]_135:4"},
  {id: "kadenz", stufe: 5, titel: "Kadenz mit Bass", info: "Rechts Akkorde, links der Grundton dazu.", bpm: 66,
    rechts: "[C4E4G4]:2 [C4F4A4]:2 | [C4E4G4]:2 [B3D4G4]:2 | [C4E4G4]:4", links: "C3:2 F3:2 | C3:2 G3:2 | C3:4"},
  {id: "gebrochen", stufe: 5, titel: "Gebrochene Akkorde", info: "Die Akkordtöne nacheinander, wie in vielen Begleitungen.", bpm: 72,
    rechts: "C4:0.5 G4 E4 G4 C4 G4 E4 G4 | C4 A4 F4 A4 C4 A4 F4 A4 | B3 G4 D4 G4 B3 G4 D4 G4 | C4:4"},

  {id: "cdurrechts", stufe: 6, titel: "C-Dur rechts", info: "Nach dem E geht der Daumen unter dem Mittelfinger durch zum F.", bpm: 80,
    rechts: "C4_1:1 D4_2 E4_3 F4_1 | G4_2 A4_3 B4_4 C5_5 | B4_4 A4_3 G4_2 F4_1 | E4_3 D4_2 C4_1:2"},
  {id: "cdurlinks", stufe: 6, titel: "C-Dur links", info: "Beim G kreuzt der Mittelfinger über den Daumen zum A.", bpm: 80,
    links: "C3_5:1 D3_4 E3_3 F3_2 | G3_1 A3_3 B3_2 C4_1 | B3_2 A3_3 G3_1 F3_2 | E3_3 D3_4 C3_5:2"},
  {id: "cdurbeide", stufe: 6, titel: "C-Dur beidhändig", info: "Beide Hände zusammen, die Untersätze kommen an verschiedenen Stellen.", bpm: 66,
    rechts: "C4_1:1 D4_2 E4_3 F4_1 | G4_2 A4_3 B4_4 C5_5 | B4_4 A4_3 G4_2 F4_1 | E4_3 D4_2 C4_1:2",
    links: "C3_5:1 D3_4 E3_3 F3_2 | G3_1 A3_3 B3_2 C4_1 | B3_2 A3_3 G3_1 F3_2 | E3_3 D3_4 C3_5:2"},
  {id: "gdur", stufe: 6, titel: "G-Dur rechts", info: "Die erste schwarze Taste: Fis mit dem vierten Finger.", bpm: 80,
    rechts: "G4_1:1 A4_2 B4_3 C5_1 | D5_2 E5_3 F#5_4 G5_5 | F#5_4 E5_3 D5_2 C5_1 | B4_3 A4_2 G4_1:2"},

  {id: "birthday", stufe: 7, titel: "Happy Birthday", info: "Im Dreiertakt mit Auftakt und dem großen Sprung zum hohen G.", bpm: 100, takt: [3, 4], auftakt: 1,
    rechts: "G4:0.5 G4 | A4:1 G4 C5 | B4:2 G4:0.5 G4 | A4:1 G4 D5 | C5:2 G4:0.5 G4 | G5:1 E5 C5 | B4 A4 F5:0.5 F5 | E5:1 C5 D5 | C5:3"},
  {id: "stillenacht", stufe: 7, titel: "Stille Nacht", info: "Im wiegenden 6/8-Takt, gezählt wird in Achteln.", bpm: 150, takt: [6, 8],
    rechts: "G4:1.5 A4:0.5 G4:1 E4:3 | G4:1.5 A4:0.5 G4:1 E4:3 | D5:2 D5:1 B4:3 | C5:2 C5:1 G4:3 | A4:2 A4:1 C5:1.5 B4:0.5 A4:1 | G4:1.5 A4:0.5 G4:1 E4:3 | A4:2 A4:1 C5:1.5 B4:0.5 A4:1 | G4:1.5 A4:0.5 G4:1 E4:3 | D5:2 D5:1 F5:1.5 D5:0.5 B4:1 | C5:3 E5:3 | C5:1.5 G4:0.5 E4:1 G4:1.5 F4:0.5 D4:1 | C4:6"},
  {id: "greensleeves", stufe: 7, titel: "Greensleeves", info: "Altes englisches Lied in a-Moll, mit Gis als einziger schwarzer Taste.", bpm: 100, takt: [3, 4], auftakt: 1,
    rechts: "A4:1 | C5:2 D5:1 | E5:1.5 F5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:2 A4:1 | A4:1.5 G#4:0.5 A4:1 | B4:2 G#4:1 | E4:2 A4:1 | C5:2 D5:1 | E5:1.5 F5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:1.5 B4:0.5 A4:1 | G#4:1.5 F#4:0.5 G#4:1 | A4:3"},
  {id: "kanon", stufe: 7, titel: "Kanon von Pachelbel", info: "Die berühmte Basslinie links, rechts die Melodie in halben Noten. Nach C-Dur versetzt.", bpm: 72,
    rechts: "E5:2 D5:2 | C5:2 B4:2 | A4:2 G4:2 | A4:2 B4:2 | C5:2 B4:2 | A4:2 G4:2 | F4:2 E4:2 | F4:2 G4:2 | E4:4",
    links: "C3:2 G2:2 | A2:2 E2:2 | F2:2 C3:2 | F2:2 G2:2 | C3:2 G2:2 | A2:2 E2:2 | F2:2 C3:2 | F2:2 G2:2 | C3:4"},

  {id: "nachtmusik", stufe: 8, titel: "Eine kleine Nachtmusik", info: "Mozarts Anfang in G-Dur mit kurzen Pausen und Fis.", bpm: 112,
    rechts: "G4:1 r:0.5 D4:0.5 G4:1 r:0.5 D4:0.5 | G4:0.5 D4 G4 B4 D5:2 | C5:1 r:0.5 A4:0.5 C5:1 r:0.5 A4:0.5 | C5:0.5 A4 F#4 A4 D4:2 | G4:4"},
  {id: "menuett", stufe: 8, titel: "Menuett in G", info: "Christian Petzold, früher Bach zugeschrieben. Erste acht Takte, Bass vereinfacht.", bpm: 96, takt: [3, 4],
    rechts: "D5:1 G4:0.5 A4 B4 C5 | D5:1 G4 G4 | E5:1 C5:0.5 D5 E5 F#5 | G5:1 G4 G4 | C5:1 D5:0.5 C5 B4 A4 | B4:1 C5:0.5 B4 A4 G4 | F#4:1 G4:0.5 A4 B4 G4 | A4:3",
    links: "G3:2 A3:1 | B3:3 | C4:3 | B3:3 | A3:3 | G3:3 | D4:1 B3 G3 | D4:2 D3:1"},
  {id: "praeludium", stufe: 8, titel: "Präludium in C (Bach)", info: "Die ersten vier Takte als gebrochene Akkorde mit der rechten Hand, in Sechzehnteln.", bpm: 56,
    rechts: "C4:0.25 E4 G4 C5 E5 G4 C5 E5 C4 E4 G4 C5 E5 G4 C5 E5 | C4 D4 A4 D5 F5 A4 D5 F5 C4 D4 A4 D5 F5 A4 D5 F5 | B3 D4 G4 D5 F5 G4 D5 F5 B3 D4 G4 D5 F5 G4 D5 F5 | C4 E4 G4 C5 E5 G4 C5 E5 C4 E4 G4 C5 E5 G4 C5 E5"},
  {id: "elise", stufe: 8, titel: "Für Elise (Anfang)", info: "Beethoven, die ersten acht Takte. Zählzeit ist die Achtel, also langsam anfangen.", bpm: 132, takt: [3, 8], auftakt: 1,
    rechts: "E5:0.5 D#5 | E5 D#5 E5 B4 D5 C5 | A4:1 r:0.5 C4 E4 A4 | B4:1 r:0.5 E4 G#4 B4 | C5:1 r:0.5 E4 E5 D#5 | E5 D#5 E5 B4 D5 C5 | A4:1 r:0.5 C4 E4 A4 | B4:1 r:0.5 E4 C5 B4 | A4:3",
    links: "r:1 | r:3 | A2:0.5 E3 A3 r:1.5 | E2:0.5 E3 G#3 r:1.5 | A2:0.5 E3 A3 r:1.5 | r:3 | A2:0.5 E3 A3 r:1.5 | E2:0.5 E3 G#3 r:1.5 | A2:0.5 E3 A3 r:1.5"},

  {id: "noten-violin", stufe: 9, titel: "Violinschlüssel", info: "16 zufällige Noten von C bis G'' für die rechte Hand.", bpm: 60, trainer: "violin"},
  {id: "noten-bass", stufe: 9, titel: "Bassschlüssel", info: "16 zufällige Noten von C bis H für die linke Hand.", bpm: 60, trainer: "bass"},
  {id: "noten-beide", stufe: 9, titel: "Beide Schlüssel", info: "16 zufällige Noten, mal oben, mal unten.", bpm: 60, trainer: "beide"}
];

// Für den Notentrainer jedes Mal neue Noten, sonst das Stück wie notiert.
function liedFuer(lied, rnd) {
  if (!lied.trainer) return lied;
  return Object.assign({}, lied, notentrainer(lied.trainer, 16, rnd || Math.random));
}
