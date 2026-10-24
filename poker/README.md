# Poker

Texas Hold'em No Limit für die Lebensplattform, erreichbar unter `/poker/` und als Kachel „Poker“ im Portal.

- **Gegen den Computer:** 1 bis 8 Bots (vorsichtig, solide, wild), drei Stärken, Blinds steigen auf Wunsch alle 10 Hände. Das laufende Spiel liegt im Browser (`poker-lokal`) und lässt sich fortsetzen.
- **Mit anderen:** Lobby über Supabase Realtime (`poker-lobby`, Presence), Tische als eigene Kanäle (`poker-tisch-<id>`). Keine Tabelle nötig.
  Der Browser des Gastgebers mischt und führt die Engine. Eigene Karten gehen per ECDH/AES-GCM verschlüsselt nur an den jeweiligen Spieler, Aktionen kommen verschlüsselt zurück.
  Geht der Gastgeber, übernimmt der nächste Spieler und die laufende Hand wird mit den Ständen vom Handanfang neu gegeben.
- **Statistik:** im Browser und im Konto (`schach_docs`, Pfad `poker/stand`).

Aufbau: `src/engine.js` (Regeln, Handbewertung, Side Pots, Bots), `src/net.js` (Mehrspieler-Tisch), `src/index.html` (Oberfläche). `build.mjs` bettet beides in die Seite ein.

Tests: `npm test` (Handbewertung gegen eine Referenz, Setzregeln, Side Pots, Bot-Simulation, Mehrspieler mit Fake-Realtime).
