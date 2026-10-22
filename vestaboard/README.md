# Vestaboard

Die Fallblatt-Anzeige aus Ralfs Mac-Bildschirmschoner als Kachel im Lernportal, unter `/vestaboard/`, ohne Anmeldung. Grundlage ist die Browser-Version „Mein Vestaboard“ (6×22 Kacheln, Split-Flap-Animation, Zeichensatz und acht Farbkacheln wie das Original).

- Gruß je Nutzer: Beim ersten Öffnen des Tages steht 20 Sekunden lang ein Gruß nach Tageszeit (Guten Morgen, Guten Tag, Guten Abend, Gute Nacht), danach geht es normal weiter. Die Anrede kommt aus der Portal-Anmeldung: zuerst `user_metadata.anrede` des Supabase-Kontos, sonst die Tabelle `ANREDEN` in `src/index.html` (Muster auf die E-Mail, z. B. Kudnick → „CAPICOP“). Ohne Anrede bleibt der gewohnte Morgengruß „Guten Morgen! Heute wird ein guter Tag“.
- Farbwelten je Nutzer: Wer in `ANREDEN` `farbwelten: true` hat (oder `user_metadata.farbwelten`), bekommt jede neue Nachricht in einer anderen Farbgebung: Kacheln und Rahmen wechseln, die Buchstaben leuchten zeilenweise in drei kräftigen Farben (Liste `FARBWELTEN` in `src/index.html`). Bisher gilt das für Kudnick. Die Uhr wechselt die Farbe nicht jede Minute, nur mit einer neuen Anzeige.
- Sonst startet es in der Rotation: Uhr, Wetter für Hamburg, Zitat der Stunde, Tagesschau-Schlagzeilen und Sprüche im Wechsel (alle 20 Sekunden). Countdowns sind vorerst aus.
- Wetter (Open-Meteo) und Tagesschau holt die Seite selbst. Termine gibt es hier nicht, die kennt nur der Bildschirmschoner auf dem Mac über sein Hintergrundskript.
- Eigener Text mit Farbkacheln, Uhr-Modus, Vollbild, Bildschirmschoner-Modus und Ton (Klackern erst nach „Ton an“). Einstellungen liegen im Browser.

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Anzeige. |
| `public/` | Manifest und Icon. |
| `build.mjs` | Kopiert alles nach `dist/`. |
