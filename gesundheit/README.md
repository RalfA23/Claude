# Gesundheit

Bereich der Lebensplattform unter `/gesundheit/`, Portal-Kachel „Gesundheit“ (Kennung `gesundheit`). Bündelt:

- **Huberman-Checkliste**: heutiger Stand und die letzten 7 Tage, Sprung in `/huberman/` (Checkliste und `#jahr`). Die Huberman-Seite bleibt eigenständig, ihre Daten bleiben unter `huberman/tag.JJJJ-MM-TT` und `huberman/bericht.JJJJ-MM-TT`; diese Seite liest sie nur.
- **Krafttraining**: Plan wählbar (2 oder 3 Tage, Ganzkörper oder Split, Studio mit Geräten oder Körpergewicht, Übungswechsel nach 6 oder 8 Wochen). Grundlage ist Ralfs 12-Wochen-Plan (Ganzkörper A+B+A, FitX, Woche 1 A-B-A, Woche 2 B-A-B). Woche 1–2 gleich, ab Woche 3 doppelte Progression, nach dem Wechsel eine leichte Lernwoche mit den neuen Übungen. Pro Übung Gewicht (oder Körpergewicht mit Zusatzgewicht) und Wiederholungen je Satz, mit Vorschlag fürs nächste Mal. Gespeichert unter `gesundheit/kraft.JJJJ-MM-TT`.
- **Woche**: Kraft- und Ausdauertage (Zone 2, Intervalle ab Woche 4, lange lockere Einheit) mit Häkchen unter `gesundheit/training.JJJJ-MM-TT`. Plan unter `gesundheit/einstellungen` (Tabelle `schach_docs`, nur ein Schrägstrich im Pfad).
- **Fortschritt**: Start- und letztes Gewicht pro Übung.
- **Starting Strength** (`/gesundheit/starting-strength/`): Langhantel-Anfängerprogramm nach Mark Rippetoe. Phase 1 bis 3, Training A (Kniebeuge, Drücken, Kreuzheben) und B (Kniebeuge, Bankdrücken, Kreuzheben, später Umsetzen, Klimmzüge) im Wechsel. Steigerung pro Training je Übung einstellbar (Start: Kreuzheben 5 kg, sonst 2,5 kg), Fehlversuch hält das Gewicht, nach dem dritten 10 % zurück. Aufwärmsätze und Scheiben pro Seite werden berechnet, Pausenuhr startet beim Abhaken eines Satzes. Protokoll mit Suche und Nachtragen, Fortschritt als Kurven, Programmwissen in eigenen Worten. Gespeichert unter `gesundheit/ss.stand`, `gesundheit/ss.aktiv` (laufendes Training) und `gesundheit/ss.e.<datum>-<hhmmss>`. Logik in `src/starting-strength/logik.js`, Tests in `test/`.
- **Workouts** (`/gesundheit/workouts/`): geführte Körpergewicht-Workouts in sechs Kategorien (Ganzkörper, Oberkörper, Beine, Rumpf, Cardio, Mobilität), Runden auf Zeit, Intervalle und Leitern, drei Stufen, optional Aufwärmen und Dehnen. Spieler mit Stoppuhr, Countdown-Ring, Piepton, deutscher Sprachansage und Bildschirm-wach. Übungsliste mit Ausführung und leichterer Variante, Verlauf mit Wochenziel und Bestzeiten. Gespeichert unter `gesundheit/wo.einstellungen` und `gesundheit/wo.e.<datum>-<hhmmss>`. Logik in `src/workouts/logik.js`.
- Beide haken den Tag unter `gesundheit/training.<datum>` ab und teilen `src/konto.js` (Speicher), `src/ton.js` (Signale) und `src/training.css`.
- **Wissen**: Kernpunkte aus Ralfs Brainiac-Einträgen zu Hubermans „Protocols“ und zum Gesundheitsprojekt.

Keine Befunde oder Rohdaten im Repo, das ist öffentlich. Die bleiben im iCloud-Ordner Claude/Gesundheit.

Freigabe: Konten mit der alten Kennung `huberman` in `module_access` sehen die Kachel weiter, alte Dashboard-Kacheln `kurs:huberman` werden zu `kurs:gesundheit`. Nicht in den Standardmodulen für neue Konten.
