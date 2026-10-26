# Bücher

Wissensplattform für Bücher als Kurs der Lebensplattform, unter `/buecher/`. Jedes Konto hat seine eigene Bücherliste.

- Eintragen: „＋ Buch“, Titel tippen oder diktieren (Vorschläge über die Supabase-Funktion `buch-suche`: Open Library, lobid für deutsche Bücher, Google Books) oder die ISBN mit der Kamera scannen bzw. ein Foto vom Strichcode nehmen (BarcodeDetector, wenn er EAN-13 kann, sonst ZXing aus `public/zxing-browser.min.js`, MIT). Claude kann Bücher auch im Chat direkt ins Konto schreiben.
- Pro Buch: Status (will lesen, lese gerade, gelesen), Sterne, Genre, Schlagwörter, Kurzzusammenfassung mit Kernthesen (vorlesbar) und „Meine Besonderheiten und Learnings“ als mehrere Einträge mit Datum, auch diktierbar.
- Suche über Titel, Autor, Schlagwörter, Zusammenfassung und Learnings; Filter nach Status und Schlagwort.
- Zusammenfassungen, nur aus sicherem Wissen (unbekannte Bücher werden als unbekannt markiert):
  - Knopf „Zusammenfassung erstellen“: Supabase-Funktion `buch-zusammenfassung` (Quelle in `supabase/`). Admins nutzen den Projektschlüssel `ANTHROPIC_API_KEY`, alle anderen ihren eigenen Schlüssel, der nur im Browser liegt und pro Anfrage mitgeht.
  - „In Claude fragen“ öffnet claude.ai mit fertiger Frage, „Antwort einfügen“ übernimmt die Antwort.
  - „Im Chat anfragen“ setzt `requested`, dann trägt Claude die Zusammenfassung im Chat ein.
- Speicherung: Supabase `schach_docs`, Pfad `buecher/buch.<id>` (nur ein Schrägstrich erlaubt), zusätzlich im Browser.
- Die Portal-Kachel zeigt die Zahl der Bücher und das zuletzt eingetragene.

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Seite. |
| `public/` | Manifest und Icon. |
| `supabase/buch-zusammenfassung/` | Edge Function für die Zusammenfassungen. |
| `supabase/buch-suche/` | Edge Function für die Buchsuche nach ISBN oder Titel. |
| `build.mjs` | Kopiert alles nach `dist/`. |
