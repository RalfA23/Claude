# Weltkarte

Große Weltkarte als Kurs der Lebensplattform, unter `/weltkarte/`. Jeder Ort ist ein Pin, entweder „War ich“ (orange) oder „Will ich hin“ (blau, mit Stern), mit Name, Datum, Notiz und Bildern. Ein Klick auf „Ansehen“ öffnet die Andenken-Seite des Ortes mit allen Bildern in groß.

- Karte: Leaflet mit OpenStreetMap-Kacheln in deutscher Beschriftung (tile.openstreetmap.de), Ortssuche über Nominatim. Beides ohne Schlüssel.
- Neue Orte: auf die Karte tippen und „Hier Pin setzen“, oder „＋ Ort“ und den Ort suchen.
- Jedes Konto hat seine eigene Karte. Orte liegen in Supabase (Tabelle `schach_docs`, Pfad `weltkarte/ort.<id>`), jedes Bild als eigene Zeile `weltkarte/bild.<id>.<bild>` (die Tabelle erlaubt nur einen Schrägstrich im Pfad). Bilder werden im Browser auf höchstens 1600 px verkleinert und erst beim Öffnen eines Ortes geladen. Die Orte ohne Bilder liegen zusätzlich im Browser.
- Ohne Anmeldung zeigt die Seite die leere Karte und einen Hinweis aufs Portal.
- Die Portal-Kachel zeigt, wie viele Orte besucht und wie viele geplant sind.

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Seite. |
| `public/` | Manifest und Icon. |
| `build.mjs` | Kopiert alles nach `dist/`. |
