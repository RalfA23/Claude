# Speedreading-Trainer

Ein 8-Wochen-Kurs zum schnelleren Lesen auf Deutsch, als Web-App für Handy und Rechner. 48 feste Lektionen (6 pro Woche, je etwa 15 Minuten), Einstiegstest und Tests in Woche 2, 4, 6 und 8, ein Lesefenster mit Pacer (Zeile, Sinngruppen, Wortanzeige), Verständnisfragen, ein Pacer-Tempo, das sich nach dem Verständnis richtet, sowie Stufen, Serien und Erfolge.

Gemessen wird die **effektive Leserate**: Wörter pro Minute mal Anteil richtiger Antworten. Die App verspricht bewusst keine Wunderwerte; die Forschungslage steht in [docs/recherche.md](docs/recherche.md), die Marktanalyse in [docs/marktanalyse.md](docs/marktanalyse.md).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/trainer.html` | Die komplette App (Texte, Kurslogik, Lesefenster, Tests). Dieselbe Datei läuft auch als Claude-Artifact „Ralfs Lesetraining“. |
| `src/shell.html` | HTML-Rahmen für die gehostete Version (PWA, Konten). |
| `src/hosted.js` | Anmeldung per E-Mail-Link, Speicherung und KI-Texte über Supabase. |
| `public/` | Manifest, Icons, Service Worker, Impressum- und Datenschutz-Vorlage. |
| `build.mjs` | Baut `dist/` ohne weitere Abhängigkeiten. |
| `supabase/` | Datenbankschema mit Row Level Security und die Edge Function `generate-text`. |

Speicher und KI sind austauschbar: Die App nutzt `window.SR_STORAGE` und `window.SR_AI`, wenn vorhanden, sonst die Claude-Artifact-Funktionen, sonst nur den Browser.

## Zugang nur per Link

Die Seite öffnet sich nur mit dem Schlüssel aus dem Einladungslink (`…/Claude/#k=SCHLÜSSEL`) und merkt ihn sich danach auf dem Gerät. In `src/shell.html` steht nur der SHA-256-Wert des Schlüssels. Neuer Schlüssel: zufällige Zeichenfolge aus Buchstaben und Ziffern wählen, `printf %s SCHLÜSSEL | sha256sum` rechnen und den Wert bei `HASH` eintragen; alte Links gelten dann nicht mehr. Das hält die Seite von Zufallsbesuchern und Suchmaschinen fern, ist aber kein echter Zugriffsschutz, solange das Repository öffentlich ist.

## Lokal starten

```bash
cd speedreading-trainer
node build.mjs
npx serve dist
```

Ohne Konfiguration läuft alles lokal im Browser, ohne Konto.

## Veröffentlichen mit Konten

1. **GitHub Pages einschalten:** Repository → Settings → Pages → Source: „GitHub Actions“. Jeder Push auf `main` baut und veröffentlicht die App.
2. **Supabase-Projekt anlegen** (Region EU, z. B. Frankfurt).
   - SQL aus `supabase/migrations/0001_init.sql` ausführen.
   - Authentication → URL Configuration: die Pages-Adresse als Site URL und Redirect URL eintragen.
3. **Repository-Variablen setzen** (Settings → Secrets and variables → Actions → Variables): `SR_SUPABASE_URL` und `SR_SUPABASE_ANON_KEY`. Beide Werte sind öffentlich, die Daten schützt Row Level Security.
4. **KI-Texte (optional):**
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=...
   supabase functions deploy generate-text
   ```
   Die Funktion nutzt `claude-opus-5-5` mit niedrigem Aufwand, strukturierter JSON-Ausgabe und automatischem Ausweichmodell bei Ablehnungen. Pro Person sind 10 Texte am Tag möglich (`AI_DAILY_LIMIT`).
5. **Impressum und Datenschutz** in `public/` ausfüllen, bevor andere die App nutzen.

## Texte

Alle mitgelieferten Übungs- und Testtexte sind eigene Sachtexte. KI-Texte werden in der App als „KI-Text“ gekennzeichnet. Für weitere Texte eignen sich gemeinfreie Quellen wie Wikisource oder das Deutsche Textarchiv, nicht Projekt Gutenberg-DE (nur private Nutzung).
