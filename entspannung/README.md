# Entspannung

Bereich der Lebensplattform unter `/entspannung/`, Portal-Kachel „Entspannung“ (Kennung `entspannung`). Zwei Teile:

- **Boxatmung**: ein Punkt wandert die Kanten eines Quadrats entlang (links hoch einatmen, oben halten, rechts runter ausatmen, unten halten). Dauer je Phase einstellbar (Standard 4 Sekunden, Vorlagen 3-3-3-3, 5-5-5-5, 4-4-6-2), Gesamtdauer 2, 4, 6, 10 Minuten oder offen, Rundenzähler. Optional sanfte Töne, gesprochene Ansage (gut im Auto) und Vibration (nur Android).
- **Meditation**: sechs gesprochene Meditationen (Body-Scan, Atem, Dankbarkeit, Schlaf, Fokus, Stress lösen), selbst geschrieben in `src/meditationen.js`. Länge 3 bis 10 Minuten: Einleitung und Schluss immer, Kernabschnitte nach Priorität, bis etwa die Hälfte gesprochen ist; die Pausen rechnet der Spieler unterwegs aus der Restzeit neu, damit die Länge auch bei schnelleren oder langsameren Stimmen passt. Das gemessene Sprechtempo wird gemerkt.
- **Meditation des Tages**: reihum nach Datum (`meditationDesTages`), auf allen Geräten gleich. Das Portal nutzt dieselbe Reihenfolge (`MEDITATION_REIHE` in `portal/index.html`), bei neuen Meditationen beide anpassen.

Sprachausgabe über `../sprachen/ton.js` (`Ton.speak`, Hilfe unter `/sprachen/hilfe/`). Die Qualität hängt von der Browserstimme ab, echte Audiodateien wären später möglich.

Speicher (Tabelle `schach_docs`, nur ein Schrägstrich im Pfad): `entspannung/tag.JJJJ-MM-TT` mit `meditationen` (id, min, sek, fertig, at), `box` (runden, sek), `minuten`, `done` (eine Meditation zu Ende gehört oder mindestens 4 Runden Boxatmung); `entspannung/einstellungen`. Ohne Anmeldung nur im Browser. Nicht in den Standardmodulen für neue Konten.

Test: `node --test test/*.test.mjs` prüft Texte, Längenplanung und Meditation des Tages.
