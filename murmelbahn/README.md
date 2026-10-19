# Murmelbahn

Eine Murmelbahn zum Zuschauen und Abschalten. Läuft auf derselben GitHub-Pages-Seite wie die Trainer, unter `/murmelbahn/`, und braucht keine Anmeldung und keine Bibliotheken.

- Bei jedem Start wird die Bahn neu gebaut: Zufallsfolge aus Rampen (Zickzack), Stiftfeldern (Galton-Brett), Schaufelrädern mit Trichter und Pilzen (Flipper-Bumper), dazu eine von sechs Farbwelten (Holz, Neon, Pastell, Wald, Nachtgold, Glut) und eine eigene Murmelfarbfamilie.
- Die Murmeln sind Glas, Wirbel, Metall oder Katzenauge und rollen unten in einen Aufzug, der sie oben wieder auf den Zulauf setzt. Die Bahn läuft also endlos.
- Tipp auf die Bahn setzt eine Murmel, der Regler stellt die Anzahl ein (1 bis 60, Start mit 8, im Browser gemerkt), „Neue Bahn“ baut um, Zeitlupe, Klang (Stifte klingen pentatonisch) und Pause.
- Die Adresse trägt `?bahn=12345`; mit derselben Nummer entsteht dieselbe Bahn wieder, auch auf einem anderen Gerät.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Bahn: Generator, Physik (Kreis gegen Strecke, Kreis gegen Kreis, bewegte Radarme), Zeichnen auf Canvas, Klang über WebAudio. |
| `public/` | Manifest und Icon. |
| `build.mjs` | Kopiert alles nach `dist/`. |
