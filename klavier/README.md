# Klavier

Klavier lernen wie mit Flowkey, unter `/klavier/`, Karte auf der Seite Lernen (Freigabe-Kennung `klavier`, gehört zum Überpunkt `lernen`). Das Handy steht neben dem Klavier, die Noten laufen auf einem Notensystem mit, darunter eine Tastatur mit den nächsten Tasten (rechte Hand blau, linke Hand orange).

- **Eingabe**: Mikrofon (Standard), MIDI-Kabel (Web MIDI, nicht auf dem iPhone) oder nur die Bildschirmtasten. Antippen der Bildschirmtasten zählt immer als Anschlag.
- **Warten**: Die Noten bleiben stehen, bis alle erwarteten Töne frisch angeschlagen sind. Falsche Töne werden rot angezeigt und gezählt. Ergebnis = Stellen ohne Fehler.
- **Im Tempo**: ein Takt Einzählen, dann laufen die Noten im eingestellten Tempo (40–120 %). Ein Ton zählt, wenn er 0,25 s vor bis 0,45 s nach seiner Zeit kommt. Metronom zuschaltbar.
- **Anhören**: Die App spielt das Stück mit einem einfachen Klavierklang (WebAudio) vor.
- Wer nur eine Hand übt, hört die andere leise mit (abschaltbar). Der 🔊-Knopf spielt die nächsten Töne vor.
- **Sterne** (nur mit allen Händen des Stücks): ★ Warten mit 70 %, ★★ Tempo ab 70 % mit 80 % Treffern, ★★★ Tempo 100 % mit 90 % Treffern.

Stücke und Übungen in `src/lieder.js` (Notenschrift dort oben erklärt, B ist die englische Schreibweise für H): Stufe 1 Erste Schritte, 2 Erste Lieder (Entchen, Mary, Hänschen klein, Weihnachtsmann, Jingle Bells, Old MacDonald, Bruder Jakob, Ode an die Freude), 3 Linke Hand, 4 Beide Hände, 5 Akkorde, 6 Tonleitern, 7 Bekannte Melodien (Happy Birthday, Stille Nacht, Greensleeves, Kanon von Pachelbel), 8 Klassik (Kleine Nachtmusik, Menuett in G, Präludium in C, Für Elise), 9 Notentrainer mit Zufallsnoten. Eine Stufe gilt als dran, wenn die vorige zur Hälfte Sterne hat; spätere bleiben spielbar, nur blasser. Nur gemeinfreie Melodien, aktuelle Popsongs sind urheberrechtlich geschützt. Alles gemeinfrei bzw. selbst gesetzt.

Tonerkennung in `src/klang.js`: Analyser mit FFT 8192 ohne Glättung, Echo- und Rauschunterdrückung aus. Spitzen im Spektrum werden per Parabel genau bestimmt; die Stärke eines Tons ist die gewichtete Summe der Spitzen an Grundton und Obertönen (±45 Cent) nach Abzug des Grundrauschens (die ersten 0,7 s nach dem Start misst der Raum). Ab C3 muss der Grundton hörbar sein, und ein Ton eine Oktave oder Duodezime darunter mit kräftigem Grundton macht den oberen zum bloßen Oberton. Ein Anschlag zählt, wenn ein Ton neu auftaucht oder seine Stärke deutlich springt (Wiederholung). Der eigene Klang der App wird für das Mikrofon ausgeblendet. Empfindlichkeit 1–10 verschiebt die Mindestlautstärke.

Speicher (Tabelle `schach_docs`, nur ein Schrägstrich im Pfad): `klavier/stand` (`lieder.<id>` mit `sterne`, `best`, `gespielt`, `zuletzt`, `haende`), `klavier/tag.JJJJ-MM-TT` (`sek`, `minuten`, `stuecke`, `done` ab 5 Minuten oder einem geschafften Stück), `klavier/einstellungen`. Ohne Anmeldung nur im Browser.

Test: `node --test test/*.test.mjs` prüft Notenschrift, Taktlängen aller Stücke und die Tonerkennung mit künstlichem Klavierklang (Einzeltöne C3–C6, Akkorde, Oktav-Obertöne, tiefe Basstöne).
