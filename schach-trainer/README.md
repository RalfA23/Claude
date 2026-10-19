# Schachtraining

Web-App für Handy und Rechner auf dem Weg zu 1500 Elo (Lichess Rapid). Sie läuft auf derselben GitHub-Pages-Seite wie das Lesetraining, unter `/schach/`, und nutzt dasselbe Supabase-Projekt und dieselben Konten.

Was drin ist:

- **Heute:** eine Tagesaufgabe aus einem Wochenplan (vier Mal Woodpecker, drei Mal Smirnov-Lektion, zufällig gemischt, Verpasstes wird am nächsten Tag nachgeholt) und die Abfrage des Tages (eigene Fehlerstellung und Woodpecker-Aufgabe am Brett, eine Theoriefrage).
- **Woodpecker:** die 222 leichten Aufgaben aus „The Woodpecker Method“ als interaktives Brett. Nur legale Züge, die Seite prüft gegen die Lösung und spielt die Antwort des Gegners.
- **Smirnov:** sechs Kurzlektionen mit Übungsstellungen aus den eigenen Partien und Links zu Clips auf YouTube.
- **Fortschritt:** Trainingsminuten, Lichess-Wertung, Trefferquote je Runde, grobe Fehler pro Partie, Tagebuch.
- **Eintragen:** Partien, Lektionen aus den gekauften Kursen, Rapid-Wertung, einmalige Datenübernahme aus der Claude-Seite.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/trainer.tpl.html` | Die komplette App als Vorlage. Dieselbe Vorlage läuft auch als Claude-Artifact. |
| `src/data/` | Aufgaben (`wp.json`), Lösungszüge (`lines.json`), eigene Fehlerstellungen (`ef.json`), Wertungsverlauf, chess.js. |
| `src/shell.html` | HTML-Rahmen für die gehostete Version (PWA). |
| `src/hosted.js` | Anmeldung und Speicherung über Supabase. Stellt `window.claude.use("db")` bereit, damit die Seite unverändert läuft. |
| `public/` | Manifest, Icons, Service Worker. |
| `supabase/migrations/0001_schach.sql` | Tabelle `schach_docs` mit Row Level Security. |
| `build.mjs` | Füllt die Vorlage mit den Daten und baut `dist/`. |

## Lokal bauen

```bash
cd schach-trainer
node build.mjs          # ohne Konfiguration: läuft ohne Speicherung
SR_SUPABASE_URL=… SR_SUPABASE_ANON_KEY=… node build.mjs
```

## Veröffentlichen

Der Workflow `.github/workflows/speedreading-pages.yml` baut beide Apps und legt das Schachtraining unter `/schach/` ab, mit der Konfiguration des Lesetrainings. Voraussetzung ist die Tabelle aus `supabase/migrations/0001_schach.sql` im Supabase-Projekt. Sie wird einmal im SQL-Editor ausgeführt. Ohne Tabelle zeigt die Seite beim Speichern Fehler an.

## Daten

Die Seite speichert pro Person Dokumente nach dem Muster `stand/woodpecker`, `stand/heute`, `sitzungen/<id>` und `wertungen/<id>`. Die Aufgaben stammen aus dem Buch „The Woodpecker Method“ und sind nur für das eigene Training gedacht.
