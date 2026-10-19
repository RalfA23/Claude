# Götterquiz

Wissensspiel nach dem Vorbild von „Powerplay: The Game of the Gods“ (Arcana, 1986). Läuft auf derselben GitHub-Pages-Seite wie die Trainer, unter `/quiz/`, und braucht keine Anmeldung. Einstellungen, Bilanz, eigene Fragen und ein laufendes Spiel liegen im Browser (localStorage).

So wird gespielt:

- Zwei bis vier Götter (Apollon, Hermes, Hekate, Aphrodite), jeweils Mensch oder Computer, führen je vier Krieger auf einem isometrischen 8×8-Brett.
- Die Farbe des Feldes bestimmt den Bereich der Frage: Allgemeinwissen, Geschichte und Geografie, Wissenschaft und Technik, Sport und Freizeit. Die Antworten liegen in den vier Himmelsrichtungen (Pfeiltasten oder Tippen), mit Bedenkzeit.
- Richtig: Weisheitspunkte und ein Zug in eine der acht Richtungen. Vier Teleporterfelder werfen auf ein anderes Teleporterfeld.
- Zug auf einen Gegner: Duell mit derselben Frage für beide. Der Verlierer fällt eine Stufe ab, auf der untersten scheidet er aus.
- Mit 25 Weisheitspunkten mutiert ein Krieger: Herkules, Zyklop, Minotaurus, Satyr. Höhere Stufen bekommen schwerere Fragen.
- Gewonnen hat, wer als letzter Krieger hat, mit Rundenlimit der Gott mit der meisten Macht.
- Eigene Fragen lassen sich auf der Startseite eintragen (wie der Fragen-Compiler des Originals).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Das ganze Spiel. Der Platzhalter `__FRAGEN__` wird beim Bauen gefüllt. |
| `src/fragen.mjs` | Eigener Fragenkatalog: vier Bereiche, je vier Stufen. |
| `build.mjs` | Liest zusätzlich die Fragen der Lesetexte und der Nerd-Ecke aus `../speedreading-trainer/src` und baut `dist/`. |
| `public/` | Manifest und Icons. |

Neue Lesetexte landen mit dem nächsten Bau automatisch im Quiz. Ihre Bereichszuordnung steht in `build.mjs` (`CAT`), Texte ohne Eintrag zählen als Allgemeinwissen. Fragen, die nur mit dem Text verständlich sind („laut Text“, „Hauptaussage“), werden weggelassen.

## Lokal bauen

```bash
cd goetterquiz
node build.mjs
```
