# Lernen

Sammelkachel der Lebensplattform unter `/lernen/`, Portal-Kachel „Lernen“ (Kennung `lernen`). Bündelt Lesetraining (`/lesen/`), Lesetraining Fortgeschritten (`/lesen/?kurs=fortgeschritten`), Schachtraining (`/schach/`), Sprachen (`/sprachen/`), Bücher (`/buecher/`) und Klavier (`/klavier/`). Die Kurse behalten ihre Adressen und Daten.

Neuer Lernkurs: Eintrag in `COURSES` in `src/index.html` (Abschnitt `sec`, `id` = Freigabe-Kennung) und die Kennung in `LERN_IDS` in `portal/index.html` plus einen „Nur …“-Eintrag in `SUBMODS`.

Freigabe: Früher hatte jeder Kurs eine eigene Portal-Kachel. Alte Kennungen in `module_access` und `module_defaults` (`lesen`, `lesen-fortgeschritten`, `schach`, `sprachen`, `sprachen:<ordner>`, `buecher`) zeigen jetzt die Kachel Lernen, die Seite blendet dann nur diese Kurse ein. Wer `lernen` hat, sieht alle. Alte Dashboard-Kacheln `kurs:lesen` usw. werden zu einer Kachel `kurs:lernen`. Ohne Zeile in `module_access` oder als Admin sieht man alles.
