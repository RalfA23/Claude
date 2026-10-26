# Flipper

Flipper für die Lebensplattform unter `/flipper/`, erreichbar über die Kachel „Spiele“ (`/spiele/`). Freigabe-Kennung `flipper` (oder `spiele` für alle Spiele).

- **Fünf Tische** (`src/tables.js`): „Goldene Ära“ (Retro mit Glockentönen), „Kapow City“ (Comic mit Sprechblasen, Nerd-Sprüchen und N-E-R-D-Lanes), „Protokoll“ (ein Huberman-Tag: Morgenlicht, Kältebad-Rampe mit Looping, Fokus-Spinner, Zone 2, NSDR, Schlaf als REM-Multiball; der Himmel wandert mit den Missionen von Sonnenaufgang bis Nacht) „Orbit 9“ (Weltraum mit Planeten-Schwerkraft, schwarzem Loch und Wurmloch) und „Bibliothek“ (Holz und grünes Leder, Fallziele als Buchrücken, Bücherwurm als wanderndes Ziel). Direkt starten mit `#klassik`, `#comic`, `#huberman`, `#weltraum`, `#buecher`.
- **Bibliothek**: `F.CLASSICS` hält 36 Klassiker der Weltliteratur, `F.bookMissions(library, rand)` stellt pro Spiel fünf davon als Missionen zusammen und fügt eines deiner Bücher ein (bevorzugt „lese ich gerade“). Die eigene Liste kommt aus der Bücher-App: localStorage `buecher-<user>` und schach_docs `buecher/buch.%`, abgelegt in `F.LIBRARY`.
- **Gimmicks**: wanderndes Ziel pro Tisch (Glücksrad, Dr. Chaos, Koffein, UFO, Bücherwurm), drei Treffer starten den Hurry-up (Rampe holt den fallenden Wert), Kickback links einmal pro Kugel, Mystery im Loch, Frenzy nach voller Fallziel-Reihe (+1.500 auf alles), Add-a-Ball im Multiball, Zeitlupe und Blitze bei Jackpots, Vibration am Handy.
- **Physik** (`src/engine.js`): eigene Kugelphysik mit 10 Teilschritten pro Bild, Flipper mit Oberflächengeschwindigkeit, Pop-Bumper, Slingshots, Fallziele, Standziele, Spinner, Rampen, Kickout-Loch, Einbahntor, Rütteln mit Tilt, Ballsuche bei hängender Kugel.
- **Regeln**: drei Kugeln, Skillshot, Lanes für den Bonus-Multiplikator (mit den Flippertasten drehen), Rampen schalten Locks frei, zwei Locks starten den Multiball, im Multiball gibt die Rampe den Jackpot und danach das Loch den Super-Jackpot. Jeder Tisch hat eigene Missionen; alle geschafft gibt 30 Sekunden Wizard-Modus mit dreifachen Punkten.
- **Klang** (`src/sound.js`): alles per WebAudio erzeugt, eigene Klangfarbe und Musik pro Tisch, Ton und Musik einzeln schaltbar.
- **Bild** (`src/render.js`): Punktedisplay mit 5×7-Pixelschrift, Tischkunst wird pro Größe vorgezeichnet.
- **Rekorde**: `localStorage` (`flipper-scores`) und im Konto in `schach_docs` unter `flipper/score.<tisch>` (`{best, top, spiele}`), nur ein Schrägstrich im Pfad.

Bedienung: linke oder rechte Bildschirmhälfte tippen, rechts halten und loslassen schießt ab. Tastatur: Pfeiltasten oder Shift für die Flipper, Leertaste für den Abschuss, Pfeil hoch rüttelt, P pausiert.

```
cd flipper && npm test && node build.mjs
```
