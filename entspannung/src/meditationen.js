// Gesprochene Meditationen und die Planung ihrer Länge. Wird beim Bauen in die Seite eingefügt, der Test liest dieselbe Datei.
// Aufbau: intro und outro werden immer gesprochen, core-Abschnitte kommen nach Priorität p dazu (1 zuerst), bis die Sprechzeit
// etwa die Hälfte der gewählten Länge füllt. Die übrige Zeit wird auf die Pausen verteilt. "~" steht für eine lange Stille.
var MEDITATIONEN = [
  {id: "bodyscan", i: "🫧", t: "Body-Scan", s: "Mit der Aufmerksamkeit von den Füßen bis zum Scheitel wandern und loslassen.",
    intro: ["Willkommen zum Body-Scan.", "Mach es dir bequem, im Sitzen oder im Liegen.", "Wenn es sich gut anfühlt, schließ die Augen. Sonst richte den Blick weich auf einen Punkt vor dir.", "Atme ein paar Mal etwas tiefer ein, und lang wieder aus.", "~", "Bei dieser Übung wanderst du mit deiner Aufmerksamkeit durch den Körper. Du musst nichts verändern. Du nimmst nur wahr, was da ist."],
    core: [
      {p: 1, x: ["Richte deine Aufmerksamkeit zuerst auf die Füße.", "Spüre die Fersen, die Fußsohlen, die Zehen.", "Vielleicht fühlst du Wärme oder Kühle, den Kontakt zum Boden, ein Kribbeln, oder auch gar nichts.", "Alles ist in Ordnung, so wie es ist.", "~", "Stell dir vor, dein Atem könnte bis in die Füße fließen. Mit jedem Ausatmen dürfen sie ein wenig schwerer werden."]},
      {p: 3, x: ["Wandere nun langsam nach oben, zu den Unterschenkeln und den Knien.", "Spüre die Waden, die Schienbeine, die Kniekehlen.", "Dann die Oberschenkel, vorne und hinten.", "Nimm wahr, wo die Beine aufliegen und wie viel Gewicht sie tragen.", "~", "Lass die Beine ganz schwer werden und vom Boden tragen."]},
      {p: 4, x: ["Komm mit der Aufmerksamkeit zum Becken und zum Gesäß.", "Spüre die Auflagefläche und das Gewicht, das nach unten sinkt.", "Vielleicht gibt es hier eine Spannung, die beim Ausatmen ein wenig nachlassen darf.", "~"]},
      {p: 2, x: ["Jetzt geht die Aufmerksamkeit zum Bauch.", "Beobachte, wie sich die Bauchdecke beim Einatmen hebt, und beim Ausatmen wieder senkt.", "Du musst den Atem nicht lenken. Er kommt und geht von allein.", "~", "Wenn Gedanken auftauchen, ist das ganz normal. Bemerke sie freundlich, und kehre zurück zum Bauch."]},
      {p: 5, x: ["Wandere weiter zur Brust.", "Spüre, wie sich der Brustkorb mit jedem Atemzug weitet, und wieder zusammenzieht.", "Vielleicht nimmst du sogar deinen Herzschlag wahr.", "Dann wandere zum Rücken. Zum unteren Rücken, zur Mitte, zu den Schulterblättern.", "~", "Lass den Rücken weich werden und sich anlehnen."]},
      {p: 2, x: ["Komm nun zu den Schultern.", "Hier sammelt sich oft die Anspannung des Tages.", "Lass die Schultern beim nächsten Ausatmen ein kleines Stück sinken.", "Und noch ein Stück.", "~", "Spüre die Oberarme, die Ellbogen, die Unterarme."]},
      {p: 4, x: ["Wandere weiter zu den Händen.", "Spüre die Handflächen, die Handrücken, jeden einzelnen Finger.", "Vielleicht pulsiert es leicht. Vielleicht sind die Hände warm.", "~", "Lass die Hände ganz locker liegen."]},
      {p: 3, x: ["Komm mit der Aufmerksamkeit zum Nacken.", "Spüre, wie der Kopf getragen wird.", "Wandere über den Hinterkopf nach oben, bis zum Scheitel.", "~"]},
      {p: 1, x: ["Nun zum Gesicht.", "Lass die Stirn glatt und weit werden.", "Lass die Augen weich in ihren Höhlen ruhen.", "Löse den Kiefer, sodass zwischen den Zähnen ein wenig Platz entsteht.", "Lass auch die Zunge locker liegen.", "~"]},
      {p: 1, x: ["Und jetzt nimm deinen ganzen Körper wahr, von den Füßen bis zum Scheitel.", "Ein Körper, der atmet.", "Der dich jeden Tag trägt.", "~", "Ruh einfach in diesem Gefühl.", "~"]}
    ],
    outro: ["Langsam kommst du zum Ende dieser Meditation.", "Vertiefe den Atem ein wenig.", "Bewege Finger und Zehen.", "Und wenn du so weit bist, öffne die Augen und komm zurück."]},

  {id: "atem", i: "🌬️", t: "Atem", s: "Der Atem als Anker: ankommen, beobachten, zählen, immer wieder zurückkehren.",
    intro: ["Willkommen zur Atemmeditation.", "Setz dich aufrecht und bequem hin. Die Füße stehen auf dem Boden, die Hände ruhen auf den Oberschenkeln.", "Schließ die Augen, oder senke den Blick.", "~", "In den nächsten Minuten ist dein Atem der Anker. Immer wenn du abschweifst, kehrst du einfach zu ihm zurück."],
    core: [
      {p: 1, x: ["Spüre zuerst, wie du sitzt.", "Das Gewicht des Körpers, den Kontakt zur Sitzfläche, die Füße auf dem Boden.", "Hier bist du. Genau jetzt.", "~"]},
      {p: 1, x: ["Richte deine Aufmerksamkeit nun auf den Atem.", "Wo spürst du ihn am deutlichsten?", "Vielleicht an der Nasenspitze, wo die Luft kühl hinein und etwas wärmer hinaus strömt.", "Vielleicht in der Brust, oder im Bauch.", "Wähle einen Ort, und bleib dort.", "~"]},
      {p: 2, x: ["Beobachte den Atem, ohne ihn zu verändern.", "Jeder Atemzug ist ein bisschen anders. Mal länger, mal kürzer, mal tiefer, mal flacher.", "Du musst nichts richtig machen. Nur zuschauen.", "~"]},
      {p: 2, x: ["Wenn es dir hilft, zähle die Atemzüge.", "Einatmen, ausatmen, eins.", "Einatmen, ausatmen, zwei.", "Zähle bis zehn, und beginne dann wieder bei eins.", "Verlierst du den Faden, ist das kein Fehler. Fang einfach wieder bei eins an.", "~", "~"]},
      {p: 3, x: ["Irgendwann wirst du merken, dass du in Gedanken bist.", "Genau dieser Moment des Bemerkens ist die eigentliche Übung.", "Sag innerlich: Denken. Und kehre freundlich zum Atem zurück.", "Ohne Ärger, ohne Bewertung. Immer wieder.", "~"]},
      {p: 4, x: ["Lass das Ausatmen nun etwas länger werden als das Einatmen.", "Zähle beim Einatmen bis vier, und beim Ausatmen bis sechs.", "Ein langes Ausatmen sagt deinem Nervensystem: Alles ist sicher.", "~", "Kehr dann wieder zum natürlichen Atem zurück."]},
      {p: 3, x: ["Achte jetzt auf die kleinen Pausen zwischen den Atemzügen.", "Den Moment, nachdem die Luft hineingeströmt ist, bevor sie wieder hinausgeht.", "Und den Moment der Stille, nachdem du ausgeatmet hast.", "In diesen Pausen ist es ganz still.", "~"]},
      {p: 4, x: ["Weite die Aufmerksamkeit nun aus.", "Spüre, wie der ganze Körper mit dem Atem mitschwingt.", "Die Schultern heben und senken sich ganz leicht, der Bauch weitet sich, die Flanken dehnen sich.", "~"]},
      {p: 1, x: ["Lass jetzt jede Technik los.", "Sei einfach da, und atme.", "~"]}
    ],
    outro: ["Wir kommen zum Ende.", "Nimm noch einen bewussten, tiefen Atemzug.", "Spüre, wie du dich jetzt fühlst.", "Nimm diese Ruhe mit in deinen Tag. Du kannst jederzeit zu deinem Atem zurückkehren."]},

  {id: "dankbarkeit", i: "🙏", t: "Dankbarkeit", s: "Den Blick auf das richten, was gut ist: Menschen, Momente, Gemeistertes.",
    intro: ["Willkommen zur Dankbarkeitsmeditation.", "Setz oder leg dich bequem hin, und schließ die Augen.", "Atme dreimal tief ein, und langsam wieder aus.", "~", "Wir richten den Blick heute auf das, was gut ist in deinem Leben. Das Kleine genauso wie das Große."],
    core: [
      {p: 1, x: ["Beginne bei dir selbst.", "Dein Körper atmet, ohne dass du daran denken musst. Dein Herz schlägt, Tag und Nacht.", "Sag innerlich danke, für diesen Körper, der dich trägt.", "~"]},
      {p: 2, x: ["Denk an etwas Kleines, das dir heute oder gestern gutgetan hat.", "Vielleicht ein Kaffee, ein Sonnenstrahl, ein gutes Gespräch, ein Lied.", "Hol diesen Moment so lebendig wie möglich zurück. Was hast du gesehen, gehört, gefühlt?", "~", "Lass das angenehme Gefühl ein wenig größer werden."]},
      {p: 1, x: ["Denk nun an einen Menschen, für den du dankbar bist.", "Sieh sein Gesicht vor dir.", "Erinnere dich an einen Moment, in dem dieser Mensch für dich da war.", "~", "Sag innerlich: Danke, dass es dich gibt."]},
      {p: 3, x: ["Denk an dein Zuhause.", "Ein Dach über dem Kopf, ein Bett, sauberes Wasser, etwas zu essen.", "Vieles davon ist so selbstverständlich, dass wir es kaum noch sehen.", "~"]},
      {p: 2, x: ["Denk jetzt an eine Herausforderung, die du gemeistert hast.", "Vielleicht war sie schwer, als du mittendrin warst.", "Was hast du daraus gelernt? Was ist daraus gewachsen?", "~", "Auch dafür darfst du dankbar sein. Und auch dir selbst."]},
      {p: 3, x: ["Denk an etwas, das du gut kannst.", "Etwas, das du gelernt hast, mit Geduld und Übung.", "Spüre ein wenig Stolz und Freude darüber.", "~"]},
      {p: 4, x: ["Richte die Aufmerksamkeit nun auf die Welt um dich herum.", "Das Wasser, die Bäume, der Wind, der Himmel über der Stadt.", "Die Natur gibt uns so viel, einfach so.", "~"]},
      {p: 4, x: ["Denk an etwas, auf das du dich freust.", "Ein Treffen, eine Reise, ein ruhiger Abend.", "Lass die Vorfreude jetzt schon spürbar werden.", "~"]},
      {p: 1, x: ["Leg, wenn du magst, eine Hand aufs Herz.", "Spüre die Wärme deiner Hand.", "Lass das Gefühl von Dankbarkeit sich im ganzen Körper ausbreiten.", "~"]}
    ],
    outro: ["Langsam kommst du zum Ende.", "Nimm dir vor, heute einen Moment der Dankbarkeit bewusst wahrzunehmen. Oder einem Menschen danke zu sagen.", "Atme tief ein, bewege dich ein wenig, und öffne die Augen."]},

  {id: "schlaf", i: "🌙", t: "Schlaf", s: "Schwer werden, Gedanken ablegen, einen sicheren Ort finden und hinübergleiten.", leise: true,
    intro: ["Willkommen zur Meditation für den Schlaf.", "Leg dich bequem hin, deck dich zu, und mach das Licht aus.", "Du musst jetzt nichts mehr erledigen. Der Tag ist vorbei.", "~", "Wenn du während der Meditation einschläfst, ist das genau richtig."],
    core: [
      {p: 1, x: ["Atme durch die Nase ein, und lass die Luft langsam durch den Mund wieder ausströmen.", "Wie ein langer, leiser Seufzer.", "Noch einmal. Ein durch die Nase. Und lang aus.", "~", "Lass den Atem dann von selbst fließen, ruhig und gleichmäßig."]},
      {p: 1, x: ["Spüre, wie das Bett dich trägt.", "Du musst dich nicht festhalten. Das Bett hält dich.", "Mit jedem Ausatmen sinkst du ein wenig tiefer in die Matratze.", "~"]},
      {p: 2, x: ["Deine Füße werden schwer und warm.", "Die Schwere steigt langsam in die Beine.", "Die Beine liegen ganz ruhig. Schwer, und entspannt.", "~"]},
      {p: 2, x: ["Die Wärme breitet sich im Bauch aus.", "Der Rücken sinkt in die Matratze.", "Die Brust hebt und senkt sich, ganz langsam.", "~"]},
      {p: 3, x: ["Die Arme werden schwer.", "Die Hände liegen locker, die Finger sind entspannt.", "~"]},
      {p: 2, x: ["Dein Gesicht wird weich.", "Die Stirn ist glatt, die Augenlider sind schwer.", "Der Kiefer ist locker, die Zunge liegt ruhig.", "~"]},
      {p: 3, x: ["Wenn Gedanken an den Tag auftauchen, stell dir vor, du legst sie in eine Kiste.", "Du machst den Deckel zu, und stellst die Kiste beiseite.", "Morgen kannst du sie wieder öffnen, wenn du willst. Jetzt ist Ruhezeit.", "~"]},
      {p: 4, x: ["Stell dir einen Ort vor, an dem du dich vollkommen sicher fühlst.", "Vielleicht ein Strand am Abend, mit leisem Wellenrauschen.", "Vielleicht eine Hütte im Wald, mit einem warmen Feuer.", "Du bist dort ganz in Ruhe.", "~", "Hör die Geräusche dieses Ortes. Spür die Luft auf deiner Haut.", "~"]},
      {p: 4, x: ["Zähle jetzt mit mir langsam rückwärts. Mit jeder Zahl sinkst du tiefer in die Ruhe.", "Zehn.", "Neun.", "Acht.", "Sieben.", "Sechs.", "Fünf.", "Vier.", "Drei.", "Zwei.", "Eins.", "~"]},
      {p: 1, x: ["Es gibt nichts mehr zu tun.", "Nur noch atmen, und loslassen.", "~"]}
    ],
    outro: ["Bleib einfach liegen.", "Lass dich vom Schlaf tragen.", "Gute Nacht."]},

  {id: "fokus", i: "🎯", t: "Fokus", s: "Aufmerksamkeit trainieren wie einen Muskel und klar in die nächste Aufgabe gehen.",
    intro: ["Willkommen zur Fokusmeditation.", "Setz dich aufrecht hin. Wach, und doch entspannt.", "Lass die Augen offen und richte den Blick auf einen Punkt vor dir. Oder schließ sie.", "~", "In den nächsten Minuten trainierst du deine Aufmerksamkeit, wie einen Muskel."],
    core: [
      {p: 1, x: ["Richte deine Aufmerksamkeit auf einen einzigen Punkt.", "Das kann ein Punkt vor dir sein, oder das Gefühl des Atems an der Nasenspitze.", "Halte die Aufmerksamkeit genau dort.", "~"]},
      {p: 1, x: ["Der Geist wird wandern. Das gehört dazu.", "Jedes Mal, wenn du es bemerkst und zurückkehrst, wird dein Fokus stärker.", "Wie eine Wiederholung beim Krafttraining.", "~"]},
      {p: 2, x: ["Zähle jetzt zehn Atemzüge, ganz bewusst.", "Bei jedem Ausatmen eine Zahl.", "Wenn du dich verzählst, beginne wieder bei eins.", "~", "~"]},
      {p: 2, x: ["Öffne die Aufmerksamkeit jetzt für Geräusche.", "Nimm sie wahr, ohne sie zu benennen. Nah und fern, laut und leise.", "~", "Dann kehre zurück zu deinem einen Punkt.", "Spüre den Unterschied zwischen weiter und enger Aufmerksamkeit.", "~"]},
      {p: 3, x: ["Denk an die Aufgabe, die als Nächstes vor dir liegt.", "Was ist das eine Wichtigste, das du heute erledigen willst?", "Sieh dich, wie du ruhig und konzentriert daran arbeitest.", "~"]},
      {p: 3, x: ["Was könnte dich dabei ablenken?", "Das Handy, Mails, ein Gedanke, der immer wieder kommt?", "Mach dir einen Plan: Wenn diese Ablenkung kommt, dann tue ich das hier.", "~"]},
      {p: 4, x: ["Spüre deine aufrechte Haltung.", "Die Wirbelsäule ist lang, der Scheitel strebt nach oben.", "Wach und ruhig zugleich.", "~"]},
      {p: 4, x: ["Gedanken ziehen vorüber wie Wolken am Himmel.", "Du bist der Himmel, nicht die Wolken.", "Lass sie ziehen, und bleib bei deinem Punkt.", "~"]},
      {p: 1, x: ["Halte jetzt noch einmal den Fokus. Ganz ruhig, ganz klar.", "~"]}
    ],
    outro: ["Wir kommen zum Ende.", "Nimm drei kräftige Atemzüge.", "Öffne die Augen ganz, schau dich um, und nimm die Klarheit mit zu deiner nächsten Aufgabe."]},

  {id: "stress", i: "🍃", t: "Stress lösen", s: "Physiologischer Seufzer, Anspannung spüren und loslassen, Gedanken ziehen lassen.",
    intro: ["Willkommen. Diese Meditation hilft dir, Stress loszulassen.", "Setz dich hin oder leg dich, so wie es gerade geht.", "Du darfst so ankommen, wie du bist. Auch angespannt und unruhig.", "~"],
    core: [
      {p: 1, x: ["Beginnen wir mit dem physiologischen Seufzer.", "Atme durch die Nase ein. Und dann noch einmal kurz nach, obendrauf.", "Und jetzt lang und langsam durch den Mund aus.", "~", "Noch einmal. Zweimal ein durch die Nase. Lang aus durch den Mund.", "~", "Und ein drittes Mal.", "~"]},
      {p: 1, x: ["Nimm wahr, wo du den Stress im Körper spürst.", "Vielleicht im Nacken, im Kiefer, im Bauch, oder in der Brust.", "Du musst ihn nicht wegmachen. Erkenne ihn nur. Ah, da ist Anspannung.", "~"]},
      {p: 2, x: ["Atme jetzt in diese Stelle hinein.", "Stell dir vor, mit dem Einatmen kommt Raum dazu.", "Und mit dem Ausatmen fließt ein Teil der Spannung hinaus.", "~"]},
      {p: 2, x: ["Mach jetzt beide Hände zu Fäusten. Fest, aber ohne Schmerz.", "Halte die Spannung.", "Und lass los.", "Spür den Unterschied.", "Zieh die Schultern hoch zu den Ohren. Halten.", "Und lass sie fallen.", "~"]},
      {p: 3, x: ["Was beschäftigt dich gerade am meisten?", "Frag dich: Kann ich daran in diesem Moment etwas ändern?", "Wenn nicht, darfst du es für diese paar Minuten ablegen.", "Wenn ja, nimm dir einen kleinen nächsten Schritt vor. Nur einen.", "~"]},
      {p: 3, x: ["Komm mit den Sinnen ins Hier und Jetzt.", "Was hörst du gerade?", "Was spürst du auf der Haut? Die Kleidung, die Luft, die Temperatur.", "Wie fühlt sich der Boden unter dir an?", "~"]},
      {p: 4, x: ["Leg eine Hand auf die Brust oder den Bauch.", "Sag dir innerlich: Das ist gerade schwer. Und ich darf freundlich mit mir sein.", "~", "So, wie du es mit einem guten Freund wärst."]},
      {p: 4, x: ["Stell dir vor, du sitzt an einem Fluss.", "Jeder belastende Gedanke ist ein Blatt, das du aufs Wasser legst.", "Sieh zu, wie das Wasser die Blätter langsam davonträgt.", "~", "~"]},
      {p: 1, x: ["Spüre jetzt, wie es dir geht.", "Vielleicht ist es ein bisschen ruhiger geworden. Vielleicht auch nicht. Beides ist in Ordnung.", "~"]}
    ],
    outro: ["Wir kommen zum Ende.", "Atme noch einmal tief durch die Nase ein, und lang durch den Mund aus.", "Den Seufzer kannst du jederzeit nutzen, wenn es wieder eng wird.", "Öffne langsam die Augen."]}
];

// Meditation des Tages: reihum nach Tagesnummer, für alle Geräte gleich (das Portal nutzt dieselbe Reihenfolge).
function meditationDesTages(datum) {
  var p = String(datum).split("-").map(Number), n = Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 864e5);
  return MEDITATIONEN[((n % MEDITATIONEN.length) + MEDITATIONEN.length) % MEDITATIONEN.length];
}

// Plan für eine Länge in Minuten. cps: geschätzte Zeichen pro Sekunde der Stimme.
// Ergebnis: Sätze mit Pausengewicht w und Mindestpause min (Sekunden) danach. Die echte Pause rechnet der Spieler
// unterwegs neu aus der Restzeit, damit die Länge auch bei schnelleren oder langsameren Stimmen passt.
function planMeditation(m, minuten, cps) {
  var T = minuten * 60, ziel = T * (minuten <= 4 ? 0.5 : 0.45), len = function (xs) { return xs.filter(function (s) { return s !== "~"; }).join(" ").length / cps; };
  var sprech = len(m.intro) + len(m.outro), nimm = {};
  var reihe = m.core.map(function (c, i) { return {c: c, i: i}; }).sort(function (a, b) { return a.c.p - b.c.p || a.i - b.i; });
  reihe.forEach(function (r, k) { var d = len(r.c.x); if (k === 0 || sprech + d <= ziel) { nimm[r.i] = true; sprech += d; } });
  var bloecke = [m.intro].concat(m.core.filter(function (c, i) { return nimm[i]; }).map(function (c) { return c.x; }), [m.outro]);
  var items = [];
  bloecke.forEach(function (b, bi) {
    b.forEach(function (s) {
      var last = items[items.length - 1];
      if (s === "~") { if (last) { last.w += 5; last.min = Math.max(last.min, 4); } return; }
      items.push({text: s, w: 1, min: 1.2});
    });
    var last = items[items.length - 1];
    if (last && bi < bloecke.length - 1) { last.w += 2; last.min = Math.max(last.min, 2.5); }
  });
  items[items.length - 1].w = 0; items[items.length - 1].min = 0;
  return {items: items, sprech: sprech, abschnitte: bloecke.length - 2, von: m.core.length};
}
