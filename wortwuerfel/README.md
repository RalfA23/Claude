# Wortwürfel

Buchstabenwürfel-Wortspiel nach dem Vorbild von Boggle. Läuft auf derselben GitHub-Pages-Seite wie die Trainer, unter `/wortwuerfel/`, und braucht keine Anmeldung. Einstellungen und Bilanz liegen im Browser (localStorage).

So wird gespielt:

- 16 Würfel mit deutscher Buchstabenverteilung (inklusive Ä, Ö, Ü und Qu) ergeben ein 4×4-Feld. Bretter mit weniger als 30 gebräuchlichen Wörtern werden neu gewürfelt.
- In der eingestellten Zeit (Standard drei Minuten) Wörter aus benachbarten Würfeln bilden, auch schräg, jeden Würfel nur einmal pro Wort. Wischen, Würfel antippen oder am Rechner tippen und Enter.
- Punkte nach Wortlänge wie im Original: 3–4 Buchstaben 1, 5 → 2, 6 → 3, 7 → 5, ab 8 → 11. „Qu“ zählt als zwei Buchstaben.
- Seltene Wörter aus dem Wörterbuch zählen, die Auswertung zeigt als „was noch drin war“ aber nur gebräuchliche Wörter; ein Tipp auf ein Wort zeigt seinen Weg.
- Zu zweit: nacheinander auf demselben Brett, gemeinsame Wörter werden gestrichen.
- Jedes Brett hat einen fünfstelligen Code. Mit demselben Code bekommt jeder dasselbe Brett, auch auf einem anderen Gerät.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Das ganze Spiel. |
| `src/woerter.txt` | Wörterbuch, sortiert und vorn-komprimiert (pro Zeile: `*` bei gebräuchlichen Wörtern, gemeinsame Buchstaben mit dem Vorgänger als Ziffer zur Basis 36, dann der Rest). Rund 617.000 Wortformen, davon etwa 74.000 gebräuchlich; 2,4 MB, gzip etwa 700 KB. Wegen der Häufigkeitsmarken steht die Datei unter CC BY-SA 4.0. |
| `wortliste.mjs` | Erzeugt `src/woerter.txt` neu aus der [deutschen Wortliste für Wortspiele](https://github.com/enz/german-wordlist) von Jan Enz (CC0) und markiert gebräuchliche Wörter (ab 15 Vorkommen) nach der [Häufigkeitsliste](https://github.com/hermitdave/FrequencyWords) von Hermit Dave (OpenSubtitles 2018, CC BY-SA 4.0). Nur nötig, wenn die Liste aufgefrischt werden soll. |
| `build.mjs` | Baut `dist/` (Seite, Wörterbuch, Manifest, Icons). |
| `public/` | Manifest und Icons. |

## Lokal bauen

```bash
cd wortwuerfel
node build.mjs
```
