# Spiele

Sammelkachel der Lebensplattform unter `/spiele/`, Portal-Kachel „Spiele“ (Kennung `spiele`). Bündelt Flipper (`/flipper/`), Götterquiz (`/quiz/`), Wortwürfel (`/wortwuerfel/`), Poker (`/poker/`), Murmelbahn (`/murmelbahn/`) und Vestaboard (`/vestaboard/`). Die Spiele behalten ihre Adressen und Daten, ihr Zurück-Link führt jetzt hierher.

Freigabe: Früher hatte jedes Spiel eine eigene Portal-Kachel. Alte Kennungen in `module_access` und `module_defaults` (`quiz`, `wortwuerfel`, `murmelbahn`, `vestaboard`, `poker`) zeigen jetzt die Kachel Spiele, die Seite blendet dann nur diese Spiele ein. Wer `spiele` hat, sieht alle. Alte Dashboard-Kacheln `kurs:quiz` usw. werden zu einer Kachel `kurs:spiele`. Ohne Zeile in `module_access` oder als Admin sieht man alles.
