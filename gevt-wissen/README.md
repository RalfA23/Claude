# GEVT-Wissensdatenbank (Ving Tsun Wissen)

Web-App für Handy und Rechner, mit der Ralf seiner GEVT-Wissensdatenbank (GE Ving Tsun, Sifu Göksel Erdogan) Fragen stellt, getippt oder gesprochen. Die Antwort trennt Göksels Lehre von Ralfs eigenen Mitschriften, nennt die Quellen und zeigt, zu welchem Grad das Thema gehört. Auf Wunsch wird sie vorgelesen. Läuft unter `/gevt/` auf derselben Seite wie Lese- und Schachtraining und steht bewusst nicht im Lernportal.

## Schutz

- **Keine Lehrinhalte im Repository.** Die Texte liegen nur in Supabase, je Abschnitt mit AES-256-GCM verschlüsselt. Der Schlüssel (`GEVT_DATA_KEY`) ist ein Secret der Edge Function.
- **Nur die Edge Function liest die Inhalte.** `gevt_chunks` hat Row Level Security ohne Policies; die Seite bekommt nur die Antwort und die Überschriften der verwendeten Abschnitte, nie den Bestand.
- **Login plus Einzelfreigabe.** Anmeldung mit dem gemeinsamen Konto; zusätzlich muss das Konto in `gevt_members` stehen. Freigaben nur von Hand im SQL-Editor, keine Einladungscodes.
- **Linkschutz.** Die Seite öffnet sich nur mit dem Schlüssel aus dem privaten Link (`…/gevt/#k=…`). Im Code steht nur dessen SHA-256 (`build.mjs`).
- **Kopierhürde.** Antworten lassen sich nicht markieren, kopieren oder drucken. Das hält nur vom bequemen Kopieren ab, nicht von Bildschirmfotos.
- **Kostenbremse.** Höchstens 150 Fragen pro Person und Tag (`GEVT_DAILY_LIMIT`).

## Einrichten (einmal)

1. SQL aus `supabase/migrations/0001_gevt.sql` im SQL-Editor ausführen und das eigene Konto als `admin` in `gevt_members` eintragen (Befehl steht oben in der Datei).
2. Secret setzen: `GEVT_DATA_KEY` = 32 Zufallsbytes in Base64 (`openssl rand -base64 32`) oder eine lange Passphrase (mindestens 20 Zeichen). `ANTHROPIC_API_KEY` ist schon für `generate-text` gesetzt.
3. Edge Function `gevt-ask` aus `supabase/functions/gevt-ask/index.ts` deployen (`supabase functions deploy gevt-ask`).
4. Inhalte einlesen: Seite öffnen, Einstellungen › Inhalte einlesen, Datei `gevt-import.json` wählen.

## Inhalte aktualisieren

`gevt-import.json` erzeugt das Skript `make_import.py` (liegt nicht im Repository, sondern bei den Wissensdateien in iCloud Drive › Claude › GEVT-App) aus den zehn GEVT-Dateien und den YouTube-Transkripten. Danach in der App erneut einlesen; der alte Stand wird ersetzt.

## Technik

- `src/index.html`: die ganze Seite (Anmeldung, Chat, Vorlesen, Spracheingabe, Import für Admins).
- `supabase/functions/gevt-ask`: entschlüsselt die Abschnitte in den Speicher, sucht per BM25, lässt Claude Haiku die Frage für die Suche aufbereiten (Diktatfehler bei kantonesischen Begriffen) und Claude Sonnet die Antwort streamen.
