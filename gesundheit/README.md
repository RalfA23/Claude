# Gesundheit

Bereich der Lebensplattform unter `/gesundheit/`, Portal-Kachel „Gesundheit“ (Kennung `gesundheit`). Bündelt:

- **Huberman-Checkliste**: heutiger Stand und die letzten 7 Tage, Sprung in `/huberman/` (Checkliste und `#jahr`). Die Huberman-Seite bleibt eigenständig, ihre Daten bleiben unter `huberman/tag.JJJJ-MM-TT` und `huberman/bericht.JJJJ-MM-TT`; diese Seite liest sie nur.
- **Trainingswoche**: Wochenplan nach Hubermans Sport-Protokoll mit Ralfs 12-Wochen-Ganzkörperplan (A+B+A, FitX Mo/Mi/Fr). Häkchen pro Tag unter `gesundheit/training.JJJJ-MM-TT`, Planstart unter `gesundheit/einstellungen` (Tabelle `schach_docs`, nur ein Schrägstrich im Pfad).
- **Wissen**: Kernpunkte aus Ralfs Brainiac-Einträgen zu Hubermans „Protocols“ und zum Gesundheitsprojekt.

Keine Befunde oder Rohdaten im Repo, das ist öffentlich. Die bleiben im iCloud-Ordner Claude/Gesundheit.

Freigabe: Konten mit der alten Kennung `huberman` in `module_access` sehen die Kachel weiter, alte Dashboard-Kacheln `kurs:huberman` werden zu `kurs:gesundheit`. Nicht in den Standardmodulen für neue Konten.
