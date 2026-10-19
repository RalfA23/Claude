# Götterquiz

Wissensspiel nach dem Vorbild von „Powerplay: The Game of the Gods“ (Arcana, 1986). Läuft auf derselben GitHub-Pages-Seite wie die Trainer, unter `/quiz/`, und braucht für das Brettspiel keine Anmeldung. Einstellungen, Bilanz, eigene Fragen und ein laufendes Spiel liegen im Browser (localStorage).

So wird gespielt:

- Zwei bis vier Götter (Apollon, Hermes, Hekate, Aphrodite), jeweils Mensch oder Computer, führen je vier selbst gewählte Helden auf einem isometrischen 8×8-Brett. Acht Helden mit eigener Fähigkeit: Herakles, Achilles, Odysseus, Perseus, Atalante, Pythia, Hippolyta, Chiron.
- Die Farbe des Feldes bestimmt den Bereich der Frage: Allgemeinwissen, Geschichte und Geografie, Wissenschaft und Technik, Sport und Freizeit. Die Antworten liegen in den vier Himmelsrichtungen (Pfeiltasten oder Tippen), mit Bedenkzeit.
- Richtig: Weisheitspunkte und ein Zug in eine der acht Richtungen. Vier Teleporterfelder werfen auf ein anderes Teleporterfeld.
- Zug auf einen Gegner: Duell als Tauziehen über mehrere Fragen an einem von fünf Schauplätzen (Hades, Medusa, Olymp, Labyrinth, Skylla und Charybdis), jeder mit eigener Regel. Der Verlierer fällt eine Stufe ab, auf der untersten scheidet er aus.
- Mit 25 Weisheitspunkten mutiert ein Held: Sterblicher, Held, Halbgott, Titan. Höhere Stufen haben mehr Kraft im Duell und bekommen schwerere Fragen.
- Launen der Götter: Zu Beginn mancher Runden greift ein Gott ein (Zeus' Gunst, Nebel des Hades, Athenes Weisheit, Hermes' Streich).
- Übungsrunde mit zehn Fragen ohne Brett.
- Götterduell online: asynchrone Duelle gegen andere angemeldete Nutzer (sieben gleiche Fragen), mit Ruhmeshalle. Braucht die Tabelle aus `supabase/migrations/0001_goetterquiz.sql`, einmal im SQL-Editor ausführen. Die Anmeldung kommt aus dem Lernportal (gleiche Supabase-Sitzung).
- Gewonnen hat, wer als letzter Krieger hat, mit Rundenlimit der Gott mit der meisten Macht.
- Eigene Fragen lassen sich auf der Startseite eintragen (wie der Fragen-Compiler des Originals).
- Das Spiel merkt sich im Browser, welche Fragen schon dran waren (`gq-seen`), über alle Spiele hinweg. Erst wenn alle Fragen eines Bereichs gestellt sind, kommen die am längsten zurückliegenden wieder.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Das ganze Spiel. Der Platzhalter `__FRAGEN__` wird beim Bauen gefüllt. |
| `src/fragen.mjs` | Eigener Fragenkatalog: vier Bereiche, je vier Stufen. |
| `src/fragen-mehr.mjs` | Zweiter Katalog im gleichen Format (480 Fragen, je Bereich und Stufe 30). |
| `build.mjs` | Liest zusätzlich die Fragen der Lesetexte und der Nerd-Ecke aus `../speedreading-trainer/src` und baut `dist/`. |
| `public/` | Manifest und Icons. |

Neue Lesetexte landen mit dem nächsten Bau automatisch im Quiz. Ihre Bereichszuordnung steht in `build.mjs` (`CAT`), Texte ohne Eintrag zählen als Allgemeinwissen. Fragen, die nur mit dem Text verständlich sind („laut Text“, „Hauptaussage“), werden weggelassen.

## Lokal bauen

```bash
cd goetterquiz
node build.mjs
```
