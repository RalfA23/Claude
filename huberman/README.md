# Huberman-Protokolle

Tages-Checkliste nach Andrew Hubermans „Protocols“ als Kurs der Lebensplattform, unter `/huberman/`. 31 Punkte von morgens bis nachts, Jahresüberblick und Nachschlagewerk mit allen 47 Routinen. Grundlage ist Ralfs Claude-Seite „Huberman Protokolle im Alltag“.

- Jedes Konto hat seine eigene Checkliste. Häkchen und Aufsteh-/Bettzeit liegen in Supabase (Tabelle `schach_docs`, Pfade `huberman/tag/JJJJ-MM-TT` und `huberman/einstellungen`), dazu als Rückfall im Browser, getrennt nach Konto.
- Ohne Anmeldung zeigt die Seite einen Hinweis aufs Portal.
- Admins (Ralf) öffnen aus dem Portal weiter die bisherige Claude-Seite mit Verlauf und Abendauswertung.

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Seite. |
| `public/` | Manifest und Icon. |
| `build.mjs` | Kopiert alles nach `dist/`. |
