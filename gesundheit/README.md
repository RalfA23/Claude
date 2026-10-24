# Gesundheit

Bereich der Lebensplattform unter `/gesundheit/`, Portal-Kachel „Gesundheit“ (Kennung `gesundheit`). Bündelt:

- **Huberman-Checkliste**: heutiger Stand und die letzten 7 Tage, Sprung in `/huberman/` (Checkliste und `#jahr`). Die Huberman-Seite bleibt eigenständig, ihre Daten bleiben unter `huberman/tag.JJJJ-MM-TT` und `huberman/bericht.JJJJ-MM-TT`; diese Seite liest sie nur.
- **Krafttraining**: Plan wählbar (2 oder 3 Tage, Ganzkörper oder Split, Studio mit Geräten oder Körpergewicht, Übungswechsel nach 6 oder 8 Wochen). Grundlage ist Ralfs 12-Wochen-Plan (Ganzkörper A+B+A, FitX, Woche 1 A-B-A, Woche 2 B-A-B). Woche 1–2 gleich, ab Woche 3 doppelte Progression, nach dem Wechsel eine leichte Lernwoche mit den neuen Übungen. Pro Übung Gewicht (oder Körpergewicht mit Zusatzgewicht) und Wiederholungen je Satz, mit Vorschlag fürs nächste Mal. Gespeichert unter `gesundheit/kraft.JJJJ-MM-TT`.
- **Woche**: Kraft- und Ausdauertage (Zone 2, Intervalle ab Woche 4, lange lockere Einheit) mit Häkchen unter `gesundheit/training.JJJJ-MM-TT`. Plan unter `gesundheit/einstellungen` (Tabelle `schach_docs`, nur ein Schrägstrich im Pfad).
- **Fortschritt**: Start- und letztes Gewicht pro Übung.
- **Wissen**: Kernpunkte aus Ralfs Brainiac-Einträgen zu Hubermans „Protocols“ und zum Gesundheitsprojekt.

Keine Befunde oder Rohdaten im Repo, das ist öffentlich. Die bleiben im iCloud-Ordner Claude/Gesundheit.

Freigabe: Konten mit der alten Kennung `huberman` in `module_access` sehen die Kachel weiter, alte Dashboard-Kacheln `kurs:huberman` werden zu `kurs:gesundheit`. Nicht in den Standardmodulen für neue Konten.
