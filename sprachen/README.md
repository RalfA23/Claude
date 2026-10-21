# Sprachen

Kachel „Sprachen“ der Lebensplattform, unter `/sprachen/`. Die Startseite (`src/index.html`) zeigt eine Karte pro Sprache mit Stufe, Punkten und Serie.

- Jede Sprache ist ein eigener Ordner mit `index.html`: `niederlaendisch/`, `japanisch/`, `thai/`, `koreanisch/`, `englisch/`. `build.mjs` kopiert jeden Ordner nach `dist/<ordner>/` und prüft, dass alle Skripte parsen. Workflow und Portal muss eine neue Sprache nicht anfassen, nur ihren Ordner anlegen und in `LANGS` in `src/index.html` eintragen.
- Anmeldung und Speicher kommen aus dem Portal (`../../config.js` aus Sicht einer Sprache). Jede Sprache speichert ihren Stand in `schach_docs` unter `sprachen/<ordner>/fortschritt` als `{punkte, serie, stufe, stufeName?, …}`; Startseite und Portal-Kachel lesen diese Felder.

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Startseite mit der Sprachauswahl. |
| `public/` | Manifest und Icon. |
| `<sprache>/` | Die Seiten einer Sprache. |
| `build.mjs` | Baut `dist/`. |
