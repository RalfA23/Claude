# Murmelbahn

Eine Murmelbahn als Design-Skulptur zum Zuschauen und Abschalten, angelehnt an die Art von Designer-Murmelbahnen wie Marbolous (eigene Umsetzung, keine fremden Grafiken). Läuft unter `/murmelbahn/`, ohne Anmeldung und ohne Bibliotheken.

- Aufbau: zwei Edelstahldrähte als Bahn, 10-mm-Murmeln, in der Mitte ein gläserner Lift mit Stahlkappe, unten ein gedrechselter Holzsockel (Birke, Nussbaum, Weiß, Schwarz). Speichen halten die Bahn am Lift, einige Messing-Klangstäbe klingen, wenn eine Murmel vorbeirollt.
- Jede Bahn wird neu gebogen: Folge aus Spirale, Blüte (Radius schwingt in Blättern), Welle (Gefälle wechselt) und Schnecke (wandert nach innen oder außen). Pro Umdrehung fällt die Bahn mindestens 38 mm, so berühren sich die Windungen nie.
- Lift-Modi: Dauerlauf, Intervall (Murmeln sammeln sich 20 s unten, dann fährt der Lift eine Runde) und Hebel (Lift läuft nur, solange man den Hebel drückt oder die Leertaste hält).
- Bedienung: Ziehen dreht und kippt die Skulptur, Mausrad oder zwei Finger zoomen, Doppelklick setzt zurück. Regler für die Anzahl (1 bis 60, Start mit 8), Hell/Dunkel, langsames Drehen, Zeitlupe, Klang (Rollen auf Stahl, Klicken, Klangstäbe) und Pause. Einstellungen merkt sich der Browser.
- Die Adresse trägt `?bahn=12345`; mit derselben Nummer entsteht dieselbe Bahn wieder.

## Physik

Jede Murmel hat nur eine Lage `s` entlang der Bahn und ein Tempo `v`. Beschleunigung aus dem Gefälle für eine Kugel, die auf zwei Schienen rollt (Faktor 0,565), dazu Luft- und Rollwiderstand. Murmeln stoßen sich entlang der Bahn und stauen sich vor dem Lift.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/index.html` | Die ganze Skulptur: Bahngenerator, Physik, eigene 3D-Projektion auf Canvas, Klang über WebAudio. |
| `public/` | Manifest und Icon. |
| `build.mjs` | Kopiert alles nach `dist/`. |
