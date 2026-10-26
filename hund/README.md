# Hundeleben

Lebenssimulation mit dem eigenen Pinscher, wie bei den Sims, unter `/hund/`. Erreichbar über die Kachel „Spiele“ (`/spiele/`), Freigabe-Kennung `hund` (oder `spiele` für alle Spiele).

- **Hund** (`src/dog3d.js`): nach den Fotos gebaut, schlanker Pinscher, schwarz mit lohfarbenen Abzeichen (Punkte über den Augen, Fang, Backen, Brustflecken, Unterbeine), halb stehende Kippohren, das rechte mit geknickter Spitze, dünne Rute, rotes Halsband. Profilkörper mit Vertexfarben, Gangarten Schritt, Trab und Galopp, Posen Sitz, Platz, Pfote, Schnüffeln, Bein heben, Geschäft, Schlafen, Schütteln, Betteln mit schiefem Kopf. Drei weitere Fellfarben für den zweiten Hund.
- **Welt** (`src/world3d.js`): Wohnung mit Wohnzimmer (weiße Bücherregale, Fernseher, Sofa, Kerzenleuchter, Körbchen), Küche (Näpfe, Kühlschrank, Tisch), Schlafzimmer und Bad mit Wanne. Garten mit Tor zum Stadtpark: Rundweg, Teich mit Enten, Bäume, Bänke, Laternen, Mülleimer, Matschpfützen. Drinnen werden die Wände zur Kamera hin abgesenkt, draußen hat das Haus ein Dach. Licht nach Uhrzeit mit Abend und Nacht.
- **Simulation** (`src/logic.js`, ohne Zeichnen, mit Tests): Uhr (eine Spielminute pro Sekunde, Pause und Vorspulen), Bedürfnisse des Hundes (Hunger, Durst, Gassi, Energie, Spaß, Zuneigung, Sauberkeit) und des Menschen (Hunger, Energie, Spaß). Der Hund handelt selbst: frisst und trinkt, schläft im Körbchen, bringt den Ball, winselt an der Tür, macht im Park an Bäumen und Laternen sein Geschäft und drinnen eine Pfütze, wenn niemand mit ihm rausgeht. Wegfindung (A* auf 0,5-m-Raster) durch Türen und um Möbel.
- **Aktionen wie bei den Sims**: Dinge antippen und aus dem Menü wählen (Futter einfüllen, Wasser, Essen, Kochen, Fernsehen, Lesen, Schlafen, Nickerchen, Hund baden, Pfütze aufwischen, Haufen einpacken und wegwerfen, Stock oder Ball aufheben und werfen, Streicheln, Anleinen). Kommandos Komm, Sitz, Platz, Pfote.
- **Aufgaben des Tages**: Morgenrunde bis 10 Uhr, Frühstück, Wasser, Abendrunde und Abendessen ab 17 Uhr, dazu jeden Tag drei aus Haufen einsammeln, Stock 3× bringen, Ball spielen, Sitz, Platz, Pfote, Kombi, Komm aus 12 m, Teich, Bank, Streicheln, Baden, Lesen. Schlafen ab 20 Uhr beendet den Tag mit Sternen.
- **Alltag** (seit Oktober 2026): Wochentage mit Homeoffice am Schreibtisch (Geld), Futter- und Leckerlivorrat, Bestellungen bringt der Postbote. Über den Tag entstehen neue Aufgaben aus einem Tagesplan (`makePlan`): Post, Besuch mit Hund im Garten, geklaute Socke, Regen (nasser Hund). Im Park laufen Spaziergänger mit Hunden, Jogger und Kinder (`npcs`), je nach Uhrzeit mehr oder weniger. Der Mensch hat zusätzlich das Bedürfnis Kontakte.
- **Erziehung**: Können pro Kommando (`skills`), der Hund folgt mit einer Wahrscheinlichkeit aus Können, Laune, Leine und Ablenkung. Leckerli direkt nach dem Befolgen erhöht das Können, Tricks üben am Hund kostet 2 Leckerli. Kommandos Bleib, Fuß, Aus, Dreh dich, Rolle, Parcours.
- **Wochenende**: Samstag 10 bis 12 Uhr Hundeschule auf dem Übungsplatz (Westwiese, `W.field`) mit Trainerin, fünf Übungen (Fuß, Bleib, Rückruf, neuer Trick, Parcours mit Hürden und Slalom) und Abzeichen. Sonntagnachmittag Hundewiese am Teich.
- **Zu zweit** über Supabase Realtime: Kanal `hund-lobby` (Presence, offene Spaziergänge) und `hund-<code>` (Positionen von Mensch, Hund und Stock, 8 pro Sekunde). Einladen per Link `#zuzweit=<code>`. Gemeinsame Aufgabe: die Hunde sollen sich beschnuppern.
- **Speichern**: `localStorage` (`hund-stand-v1`, Einstellungen in `hund-einstellungen`) und im Konto in `schach_docs` unter `hund/stand` (nur ein Schrägstrich im Pfad).
- **three.js** 0.170 liegt als `public/three.module.min.js` bei (MIT, Lizenz daneben), damit nichts von einem CDN abhängt.

Bedienung: Boden antippen zum Hingehen, Dinge oder den Hund antippen für das Aktionsmenü. Ziehen dreht die Kamera, Mausrad oder zwei Finger zoomen. Tastatur: WASD oder Pfeile laufen, Shift rennt, Q/E dreht, 1 bis 0 Kommandos, R Leckerli, L Leine, Leertaste wirft, P Pause.

```
cd hund && npm test && node build.mjs
```
