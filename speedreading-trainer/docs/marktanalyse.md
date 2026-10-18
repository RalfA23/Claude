# Marktanalyse: Speed-Reading-Web-App (deutschsprachig)

Stand: Oktober 2026. Preise laut Store- bzw. Anbieterseiten und Vergleichsportalen; sie ändern sich häufig und sollten vor dem Launch noch einmal geprüft werden.

## 1. Wettbewerber

| App | Ansatz / Features | Preis |
|---|---|---|
| **Spreeder** (eReflect) | RSVP, Chunking, Übungen, bis 5 Profile, „adaptive“ KI-Pacing | Basis gratis; VIP **67 $ einmalig** (lifetime), 365 Tage Geld-zurück |
| **SwiftRead** (Browser/iOS/Mac) | RSVP mit Fixpunkt, Leiten durch Hervorheben, PDF/EPUB/Web/Kindle Cloud, TTS in über 90 Sprachen, Sync | Free mit Limits; Pro **19,99 $/Monat, 44,99 $/Quartal, 119,99 $/Jahr** |
| **Outread** (iOS) | RSVP, Fokus-Highlighter, Import von PDF/DOCX/RTF/TXT, Sync (Nutzer melden Probleme) | Freemium, Outread+ als Abo |
| **Reedy** (Android/Browser) | Spritz-ähnliches RSVP, Import, Übungen | Gratis, Premium-Upgrade gering |
| **AccelaReader** (Iris Reading) | Web-RSVP zum Einfügen von Text, nur Englisch | kostenlos (Lead-Magnet) |
| **Iris Reading** | Videokurse statt App | Foundation **79 $**, Bundle mit 3 Leveln **199 $** |
| **Bionic Reading** | Wortanfänge fett, Konvertierung, Export, Kindle | Premium ca. 2,95 $/30,49 $, Premium Plus 12,90 $/128,99 $ |
| **Readwise Reader** (kein Speed-Reader, aber Lese-Workflow) | Read-later, Highlights, KI-Zusammenfassungen | ca. **9,99 $/Monat** |
| **Jim Kwik / Mindvalley** | Kurs im Abo | 499 $/Jahr |
| **Legentas** (DE/EU) | Online-Kurs | 69 € (Studierende) / 129 € |
| **Schneller lesen** (HeKu IT GmbH, DE) | Übungen zu Blickspanne und Augenbewegung, Tests mit Verständnisfragen, Statistik | Android-App, älter |
| **Speed Reading – Trainer** (Android, 10 Sprachen inkl. DE) | RSVP, eigene Texte, **2 KI-Texte mit Quiz pro Tag gratis**, Tempo passt sich dem Quiz-Ergebnis an (unter 70 % langsamer, ab 90 % schneller) | Free + Pro-Abo |
| **KI-Apps 2025/26** (Speedreadify, TurboRead, Glyphi u. a.) | Fototext per OCR/KI, **KI-Verständnisquiz** (meist nur Premium) | Abo mit Testphase |

**Fazit:** Der Markt ist voll von englischen RSVP-Tools. Eine **deutschsprachige Web-App mit Konto, eigenen Texten und gemessenem Textverständnis** gibt es kaum; die deutschen Angebote sind alt, nur für Android oder reine Kurse. KI-Quizze sind ab 2025 der Trend, stecken aber fast immer hinter der Paywall und sind selten auf Deutsch.

## 2. Feature-Checkliste

### Must-have (MVP)
- Konto (E-Mail/Passwort, optional Magic Link), Fortschritt in der DB
- **Eingangstest:** Lesegeschwindigkeit in WPM **und** Textverständnis
- Lesemodi: RSVP (Wort oder Chunk, mit Fixationspunkt), Pacer (Zeile hervorheben) und normales Lesen als Vergleich
- Tempo, Chunk-Größe, Schrift, Kontrast und Dark Mode einstellbar; Pause und **Zurückspringen** (fehlende Regressionen schaden dem Verständnis)
- Kuratierte deutsche Übungstexte in Schwierigkeitsstufen
- **Verständnisfragen nach jedem Text**, daraus „effektive WPM“ (WPM × Quote)
- Eigene Texte einfügen (Copy & Paste)
- Statistik: Verlauf von WPM und Verständnis, Streak
- Mobil nutzbar (responsive/PWA), barrierearm (WCAG)
- DSGVO-Grundausstattung (siehe Abschnitt 5)

### Nice-to-have (später/Premium)
- **KI-Quiz zu eigenen Texten** (Multiple Choice und offene Fragen mit KI-Bewertung)
- KI-generierte Übungstexte nach Niveau und Thema, auch in Leichter Sprache
- Import von PDF, EPUB und URLs, Browser-Erweiterung
- Adaptives Training: Tempo passt sich dem Verständnis an
- Skimming-/Überflugtraining mit Fragen zur Kernaussage
- Wortschatz- und Vorwissensübungen (laut Forschung der eigentliche Hebel)
- Spaced-Repetition-Karten aus Texten, Vorlesen (TTS)
- Gamification: Ligen, Abzeichen, Ziele
- Lehrkräfte- oder Team-Accounts (B2B, Schulen, Unternehmen)

## 3. Differenzierung: evidenzbasiert statt Wunderversprechen

Die Forschung ist eindeutig: Laut der Übersicht von **Rayner, Schotter, Masson, Potter & Treiman (2016, Psychological Science in the Public Interest)** gibt es einen **Trade-off zwischen Tempo und Verständnis**. Geübte Erwachsene lesen 200–400 WPM. Augenbewegungen machen höchstens etwa 10 % der Lesezeit aus; der Engpass ist die Sprachverarbeitung. Bei RSVP kann man nicht zurückspringen, das senkt das Verständnis. **Snell (2024, Acta Psychologica)** fand für Bionic Reading **keinen Effekt** auf die Lesegeschwindigkeit.

Daraus folgt die Positionierung:
- **„Effektiv lesen“ statt „1000 WPM“.** Jede Session misst das Verständnis, die Hauptkennzahl ist die effektive WPM.
- **Ehrliche Kommunikation:** realistische Zuwächse (eher Routine und Skimming als 3× Tempo), Lernseite mit den Studien.
- **Normales Lesen als Kontrollbedingung**, damit Nutzer ihren echten Fortschritt sehen.
- **Deutsch als Kern:** deutsche Texte, Silben- und Komposita-Logik bei Chunking und Fixierung, deutsche Lesbarkeitsindizes (z. B. LIX, Flesch-Amstad).
- **Rechtlicher Hinweis zur Werbung:** Leistungsversprechen ohne Beleg („verdreifache dein Tempo“) können nach **UWG § 5 irreführend** sein. Die evidenzbasierte Linie ist also zugleich ein Abmahnschutz.

## 4. Preisempfehlung (deutscher Markt)

Deutsche Nutzer zahlen eher ungern für Abos, akzeptieren aber faire Jahrespreise und Einmalkäufe.

| Tarif | Inhalt | Preis |
|---|---|---|
| **Free** | Alle Lesemodi, Eingangstest, kuratierte Texte, eigene Texte per Paste, Basis-Statistik, **3 KI-Quizze pro Woche** | 0 € |
| **Plus** | Unbegrenzte KI-Quizze und KI-Texte, PDF/EPUB/URL-Import, ausführliche Statistik, adaptives Training | **4,99 €/Monat** oder **39 €/Jahr** |
| **Lifetime** (optional, zeitlich begrenzt für Early Adopters) | Plus dauerhaft, mit Fair-Use-Limit für KI | **79–99 € einmalig** |
| **Schule/Team** | Klassen, Auswertung für Lehrkräfte | ab ca. 2 €/Nutzer/Monat, AVV inklusive |

Begründung: Die Preise liegen deutlich unter SwiftRead (120 $/Jahr) und in der Nähe von Spreeder (67 $ einmalig). Die KI-Kosten pro Quiz liegen im Cent-Bereich, Limits im Free-Tarif schützen die Marge. Die Preise als Bruttopreise inkl. MwSt. angeben (PAngV). Zum Start alles kostenlos anbieten und die Bestandsnutzer später mit einem Rabatt übernehmen.

## 5. Rechtliches in Deutschland (keine Rechtsberatung)

**DSGVO/TDDDG**
- Datenschutzerklärung und **Impressum (§ 5 DDG)**
- Hosting in der EU, **AV-Verträge** mit Hoster, Mail-Dienst und KI-Anbieter
- Einwilligungsbanner für nicht notwendige Cookies und Tracking nach § 25 TDDDG; besser ein cookieloses Analytics-Tool
- Datensparsamkeit, Recht auf Löschung und Export, Passwörter gehasht
- Leseleistung ist kein Gesundheitsdatum. Funktionen für Legasthenie oder ADHS würden aber Art. 9 DSGVO berühren, deshalb vorsichtig formulieren.
- Eigene Texte von Nutzern, die an eine KI-API gehen: klar darauf hinweisen, Anbieter ohne Training auf Kundendaten wählen, bei US-Anbietern das Data Privacy Framework beachten oder EU-Endpunkte nutzen
- Minderjährige: Einwilligung erst ab 16 Jahren (Art. 8 DSGVO)

**Texte und Urheberrecht**
- Gemeinfrei sind Werke ab **70 Jahren nach dem Tod des Autors** (§ 64 UrhG). Übersetzungen und moderne Editionen können eigene Rechte haben.
- **Projekt Gutenberg-DE** (Cultural Assets GmbH): Die Nutzungsbedingungen erlauben nur die **private Nutzung**. Vervielfältigung, Veröffentlichung und Bearbeitung sind untersagt; Aufbereitung und Metadaten sind geschützt. **Nicht scrapen!** Alternativen: das Deutsche Textarchiv (CC BY-SA), Wikisource (CC BY-SA bzw. gemeinfrei), Project Gutenberg (gutenberg.org; die Lizenz-Hinweise müssen entfernt werden; für Deutschland gab es Zugangssperren) oder eigene Abschriften gemeinfreier Originale.
- Nutzertexte: In den AGB ein Upload nur bei eigenen Rechten bzw. zum privaten Gebrauch festlegen, keine öffentliche Freigabe fremder Texte. Hostprivileg und Notice-and-Takedown nach DSA einplanen.

**KI-Texte**
- Rein KI-generierte Texte sind in der Regel **nicht urheberrechtlich geschützt**. Man kann sie nutzen, aber nicht exklusiv schützen.
- **EU AI Act Art. 50:** Ab August 2026 gelten Transparenzpflichten, KI-generierte Inhalte also als solche kennzeichnen.
- Faktenfehler und Bias: Texte und Quizfragen stichprobenartig prüfen, Meldefunktion einbauen.

**Verbraucherrecht beim Monetarisieren:** **Kündigungsbutton** (§ 312k BGB), Widerrufsbelehrung mit Verzicht bei digitalen Inhalten, ordentliche AGB, Button „zahlungspflichtig bestellen“.

## Quellen
- Spreeder: https://marlvel.ai/apps/spreeder-speed-reading
- SwiftRead: https://apps.apple.com/app/id6470811151
- Outread: https://marlvel.ai/apps/outread-speed-reading
- Bionic Reading: https://apps.apple.com/to/app/bionic-reading/id1644658030
- Iris Reading, Legentas, Mindvalley: https://onlinecourseing.com/?p=34235
- AccelaReader: https://alternativeto.net/software/accelareader/about
- Speed Reading – Trainer: https://www.coddykit.com/de/apps/speed-reading
- Speedreadify: https://mwm.ai/apps/speedreadify/6758282393
- Schneller lesen (HeKu): https://www.bluestacks.com/campaign/com.heku.readingtrainer/de
- Readwise: https://www.readless.app/blog/readwise-reader-pricing-2026
- Rayner et al. 2016: https://www.psychologicalscience.org/observer/speed-reading-promises-are-too-good-to-be-true-scientists-find-2
- Snell 2024: https://research.vu.nl/en/publications/no-bionic-reading-does-not-work/
- Gutenberg-DE: https://projekt-gutenberg.org/nutzungsbedingungen/
