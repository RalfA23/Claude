# Claude-Projekte von Ralf

- [portal](portal/) – Startseite der Lebensplattform: frei anpassbares Dashboard mit Kacheln aus einer Galerie (Kurse, Uhr, Lektion, Schach-Wertung, To-Dos, Notizen, Entspannungsecke, Verkaufsassistent, IStR-Vortrag und mehr). Kacheln lassen sich ziehen, in der Größe ändern, ausblenden und entfernen; das Layout liegt im Konto (Supabase, Tabelle `schach_docs`, Pfad `portal/dashboard`) und lokal als Rückfall.
- [speedreading-trainer](speedreading-trainer/) – 8-Wochen-Speedreading-Kurs als Web-App für Handy und Rechner.
- [schach-trainer](schach-trainer/) – Schachtraining auf dem Weg zu 1500 Elo: Woodpecker-Aufgaben am Brett, Smirnov-Lektionen, tägliche Abfrage und Fortschrittskontrolle. Läuft unter `/schach/` auf derselben Seite wie das Lesetraining.
- [gevt-wissen](gevt-wissen/) – Fragen an die eigene GE-Ving-Tsun-Wissensdatenbank, nur mit privatem Link und Freigabe; die Inhalte liegen verschlüsselt in Supabase, nicht hier.
- [goetterquiz](goetterquiz/) – Wissensspiel nach dem Vorbild von „Powerplay: The Game of the Gods“: vier Götter, Duelle, Mutationen, Fragen aus allen Bereichen und aus dem Lesetraining. Läuft unter `/quiz/`.
- [wortwuerfel](wortwuerfel/) – Buchstabenwürfel-Wortspiel nach dem Vorbild von Boggle: 4×4-Würfelfeld, drei Minuten, deutsches Wörterbuch mit rund 617.000 Wortformen, allein oder zu zweit. Läuft unter `/wortwuerfel/`.
- [huberman](huberman/) – Huberman-Protokolle als Tages-Checkliste mit Jahresüberblick, jedes Konto mit eigenen Häkchen. Läuft unter `/huberman/`.
- [sprachen](sprachen/) – Sprachen lernen mit Schwerpunkt Sprechen: Startseite unter `/sprachen/`, jede Sprache als eigener Ordner (`niederlaendisch/`, `japanisch/`, `thai/`), Stand je Sprache in `schach_docs` unter `sprachen/<ordner>/fortschritt`.
