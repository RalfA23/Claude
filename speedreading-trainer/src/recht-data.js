// Fachmodul Recht (Fortgeschrittenen-Kurs): trockene Fachtexte zu Datenschutz, Zivilrecht und Steuerrecht in eigenen Worten.
// Grundlage sind Gesetzestexte und veröffentlichte Entscheidungen. ref nennt die Rechtsgrundlage. Keine Rechtsberatung.
// Die richtige Antwort steht in qs immer an erster Stelle, die App mischt sie.
window.RECHT = {
texts: [
{id:"D1",kind:"recht",area:"Datenschutz",icon:"🔐",title:"Datenschutz: Grundsätze und Rechtsgrundlagen",ref:"Art. 5 und 6 DSGVO",card:"Ohne Rechtsgrundlage ist jede Verarbeitung personenbezogener Daten verboten.",paras:[
"Die Datenschutz-Grundverordnung gilt seit dem 25. Mai 2018 unmittelbar in allen Mitgliedstaaten der Europäischen Union. Sie regelt die Verarbeitung personenbezogener Daten, also aller Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Artikel 5 nennt die Grundsätze der Verarbeitung: Rechtmäßigkeit, Verarbeitung nach Treu und Glauben und Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung sowie Integrität und Vertraulichkeit.",
"Hinzu kommt die Rechenschaftspflicht. Der Verantwortliche muss die Einhaltung dieser Grundsätze nicht nur gewährleisten, sondern auch nachweisen können. Das verschiebt die Darlegungslast praktisch auf die Stelle, die Daten verarbeitet.",
"Artikel 6 Absatz 1 verlangt für jede Verarbeitung eine Rechtsgrundlage. Es besteht ein Verbot mit Erlaubnisvorbehalt. Als Erlaubnistatbestände kommen in Betracht: die Einwilligung der betroffenen Person, die Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen, eine rechtliche Verpflichtung, der Schutz lebenswichtiger Interessen, die Wahrnehmung einer Aufgabe im öffentlichen Interesse sowie berechtigte Interessen des Verantwortlichen oder eines Dritten. Letztere setzen eine Abwägung voraus: Die Interessen oder Grundrechte der betroffenen Person dürfen nicht überwiegen."
],qs:[
{q:"Welches Prinzip gilt nach Artikel 6 für die Datenverarbeitung?",a:["Verbot mit Erlaubnisvorbehalt.","Erlaubnis mit Verbotsvorbehalt.","Freie Verarbeitung ohne Voraussetzung."]},
{q:"Was bedeutet Rechenschaftspflicht?",a:["Der Verantwortliche muss die Einhaltung der Grundsätze nachweisen können.","Die Behörde muss alles nachweisen.","Betroffene müssen ihre Rechte belegen."]},
{q:"Welche Rechtsgrundlage setzt eine Interessenabwägung voraus?",a:["Berechtigte Interessen des Verantwortlichen.","Einwilligung.","Rechtliche Verpflichtung."]},
{q:"Seit wann gilt die DSGVO unmittelbar?",a:["Seit dem 25. Mai 2018.","Seit 1995.","Seit 2022."]}
]},
{id:"D2",kind:"recht",area:"Datenschutz",icon:"🌍",title:"Datenübermittlung in die USA: Schrems II",ref:"EuGH, Urteil vom 16. Juli 2020, C-311/18; Art. 44 ff. DSGVO",card:"Der EuGH kippte 2020 das Privacy Shield, Standardvertragsklauseln blieben mit Prüfpflicht.",paras:[
"Personenbezogene Daten dürfen nach den Artikeln 44 ff. der Datenschutz-Grundverordnung nur dann in ein Land außerhalb der Union übermittelt werden, wenn dort ein im Wesentlichen gleichwertiges Schutzniveau gewährleistet ist. Dies kann durch einen Angemessenheitsbeschluss der Kommission, durch geeignete Garantien wie Standardvertragsklauseln oder durch Ausnahmetatbestände geschehen.",
"Mit Urteil vom 16. Juli 2020 in der Rechtssache C-311/18, bekannt als Schrems II, erklärte der Gerichtshof der Europäischen Union den Durchführungsbeschluss zum EU-US-Privacy-Shield für ungültig. Der Gerichtshof sah das Schutzniveau in den Vereinigten Staaten wegen der Zugriffsmöglichkeiten von Behörden und unzureichender Rechtsschutzmöglichkeiten der Betroffenen als nicht gleichwertig an.",
"Die Standardvertragsklauseln der Kommission erklärte der Gerichtshof dagegen nicht für ungültig. Er verlangte aber, dass Datenexporteur und Empfänger im Einzelfall prüfen, ob im Zielland ein gleichwertiges Schutzniveau besteht, und gegebenenfalls zusätzliche Maßnahmen ergreifen. Am 10. Juli 2023 erließ die Kommission einen neuen Angemessenheitsbeschluss für Übermittlungen an Unternehmen, die am EU-US Data Privacy Framework teilnehmen."
],qs:[
{q:"Was erklärte der EuGH in Schrems II für ungültig?",a:["Den Beschluss zum EU-US-Privacy-Shield.","Die Standardvertragsklauseln.","Die gesamte DSGVO."]},
{q:"Was verlangte der EuGH bei Standardvertragsklauseln?",a:["Eine Prüfung im Einzelfall und gegebenenfalls zusätzliche Maßnahmen.","Ein Verbot jeder Übermittlung.","Nichts, sie sind immer ausreichend."]},
{q:"Warum sah der EuGH das US-Schutzniveau als nicht gleichwertig an?",a:["Wegen Behördenzugriffen und unzureichendem Rechtsschutz.","Wegen fehlender Verträge.","Wegen zu hoher Strafen."]},
{q:"Was geschah am 10. Juli 2023?",a:["Neuer Angemessenheitsbeschluss zum Data Privacy Framework.","Die DSGVO trat in Kraft.","Das Privacy Shield wurde eingeführt."]}
]},
{id:"D3",kind:"recht",area:"Datenschutz",icon:"🍪",title:"Cookies und Einwilligung: Planet49",ref:"EuGH, Urteil vom 1. Oktober 2019, C-673/17",card:"Ein vorangekreuztes Kästchen ist keine wirksame Einwilligung in Cookies.",paras:[
"In der Rechtssache Planet49 ging es um ein Online-Gewinnspiel. Teilnehmer mussten ein Kästchen mit der Einwilligung in Werbung abwählen und fanden ein bereits angekreuztes Kästchen für die Speicherung von Cookies vor. Der Bundesgerichtshof legte dem Gerichtshof der Europäischen Union Fragen zur Wirksamkeit einer solchen Einwilligung vor.",
"Mit Urteil vom 1. Oktober 2019 in der Rechtssache C-673/17 entschied der Gerichtshof, dass eine Einwilligung nicht wirksam ist, wenn die Speicherung von Informationen oder der Zugriff auf Informationen im Endgerät durch ein voreingestelltes Ankreuzkästchen erlaubt wird, das der Nutzer abwählen muss. Eine Einwilligung setze ein aktives Verhalten voraus. Das gelte unabhängig davon, ob es sich um personenbezogene Daten handelt.",
"Außerdem müsse der Anbieter angeben, wie lange die Cookies aktiv sind und ob Dritte Zugriff erhalten. Der Bundesgerichtshof setzte die Vorgaben mit Urteil vom 28. Mai 2020 für das deutsche Recht um. Seit dem 1. Dezember 2021 regelt § 25 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes den Zugriff auf Endeinrichtungen. Notwendige Cookies, die für den ausdrücklich gewünschten Dienst erforderlich sind, benötigen keine Einwilligung."
],qs:[
{q:"Was entschied der EuGH zum voreingestellten Kästchen?",a:["Es begründet keine wirksame Einwilligung.","Es ist ausreichend.","Es ist nur bei Werbung unzulässig."]},
{q:"Was setzt eine Einwilligung laut Urteil voraus?",a:["Ein aktives Verhalten des Nutzers.","Schweigen des Nutzers.","Einen Hinweis im Impressum."]},
{q:"Was musste der Anbieter zusätzlich angeben?",a:["Die Funktionsdauer der Cookies und den Zugriff Dritter.","Seine Umsatzzahlen.","Die Serverstandorte."]},
{q:"Brauchen unbedingt notwendige Cookies eine Einwilligung?",a:["Nein, wenn sie für den gewünschten Dienst erforderlich sind.","Ja, immer.","Nur bei Kindern."]}
]},
{id:"D4",kind:"recht",area:"Datenschutz",icon:"⚖️",title:"Schadensersatz bei Datenschutzverstößen",ref:"Art. 82 DSGVO; EuGH, C-300/21; BGH, Urteil vom 18. November 2024, VI ZR 10/24",card:"Schon der Kontrollverlust über Daten kann ein ersatzfähiger Schaden sein.",paras:[
"Artikel 82 der Datenschutz-Grundverordnung gewährt jeder Person, der wegen eines Verstoßes ein materieller oder immaterieller Schaden entstanden ist, einen Anspruch auf Schadensersatz gegen den Verantwortlichen oder den Auftragsverarbeiter. Voraussetzung sind ein Verstoß, ein Schaden und ein ursächlicher Zusammenhang.",
"Der Gerichtshof der Europäischen Union stellte mit Urteil vom 4. Mai 2023 in der Rechtssache C-300/21 klar, dass nicht jeder Verstoß automatisch einen Anspruch begründet. Ein Schaden muss tatsächlich entstanden sein. Zugleich verneinte der Gerichtshof eine Erheblichkeitsschwelle: Der immaterielle Schaden muss nicht eine bestimmte Schwere erreichen. Die Höhe bemisst sich nach dem nationalen Recht, wobei Gleichwertigkeit und Effektivität zu wahren sind.",
"Der Bundesgerichtshof entschied am 18. November 2024 unter dem Aktenzeichen VI ZR 10/24 über Fälle, in denen Daten von Nutzern einer Plattform durch automatisiertes Abgreifen, sogenanntes Scraping, öffentlich geworden waren. Er hielt fest, dass bereits der Verlust der Kontrolle über personenbezogene Daten einen immateriellen Schaden darstellen kann, ohne dass weitere Beeinträchtigungen nachgewiesen werden müssen. Im entschiedenen Fall hielt er einen Betrag von 100 Euro für angemessen."
],qs:[
{q:"Was verlangt Artikel 82 DSGVO für einen Schadensersatzanspruch?",a:["Verstoß, Schaden und Ursächlichkeit.","Nur einen Verstoß.","Nur eine Beschwerde."]},
{q:"Was stellte der EuGH 2023 klar?",a:["Ein bloßer Verstoß genügt nicht, es muss ein Schaden entstehen.","Jeder Verstoß begründet Schadensersatz.","Nur erhebliche Schäden zählen."]},
{q:"Gibt es nach dem EuGH eine Erheblichkeitsschwelle?",a:["Nein.","Ja, 500 Euro.","Ja, bei Gesundheitsdaten."]},
{q:"Was kann nach dem BGH bereits ein immaterieller Schaden sein?",a:["Der Verlust der Kontrolle über personenbezogene Daten.","Ein Werbebrief.","Eine Kontosperrung."]}
]},
{id:"Z1",kind:"recht",area:"Zivilrecht",icon:"🤝",title:"Vertragsschluss: Angebot und Annahme",ref:"§§ 145 bis 151 BGB",card:"Schweigen ist im Zivilrecht in der Regel keine Annahme.",paras:[
"Ein Vertrag kommt durch zwei übereinstimmende Willenserklärungen zustande, Angebot und Annahme. Das Angebot muss so bestimmt sein, dass die Annahme durch ein bloßes Ja erfolgen kann. Wesentliche Vertragsbestandteile, bei einem Kauf etwa Kaufgegenstand und Preis, müssen daher feststehen.",
"Wer einem anderen ein Angebot macht, ist nach § 145 des Bürgerlichen Gesetzbuchs an dieses gebunden, es sei denn, er hat die Bindung ausgeschlossen. Ein Angebot unter Anwesenden kann nur sofort angenommen werden, ein Angebot unter Abwesenden nach § 147 bis zu dem Zeitpunkt, in dem der Antragende den Eingang der Antwort unter regelmäßigen Umständen erwarten darf. Wird ein Angebot nicht rechtzeitig angenommen, erlischt es nach § 146.",
"Schweigen auf ein Angebot gilt grundsätzlich nicht als Annahme. Ausnahmen bestehen im Handelsrecht: Das Schweigen auf ein kaufmännisches Bestätigungsschreiben kann nach den Grundsätzen des Handelsbrauchs Vertragsinhalt werden, wenn der Empfänger nicht unverzüglich widerspricht. Eine Anzeige in einem Schaufenster oder ein Katalog ist regelmäßig kein bindendes Angebot, sondern eine Aufforderung zur Abgabe von Angeboten."
],qs:[
{q:"Wie kommt ein Vertrag zustande?",a:["Durch Angebot und Annahme.","Durch Schweigen.","Durch Eintrag in ein Register."]},
{q:"Was regelt § 145 BGB?",a:["Die Bindung an ein Angebot.","Die Verjährung.","Die Anfechtung."]},
{q:"Was gilt für Schweigen auf ein Angebot?",a:["Es ist grundsätzlich keine Annahme.","Es ist immer eine Annahme.","Es macht das Angebot unwirksam."]},
{q:"Was ist ein Schaufensterpreis rechtlich in der Regel?",a:["Eine Aufforderung zur Abgabe von Angeboten.","Ein bindendes Angebot.","Eine Annahme."]}
]},
{id:"Z2",kind:"recht",area:"Zivilrecht",icon:"⏳",title:"Verjährung von Ansprüchen",ref:"§§ 194, 195, 199 BGB",card:"Die regelmäßige Verjährung dauert drei Jahre und beginnt zum Jahresende.",paras:[
"Das Recht, von einem anderen ein Tun oder Unterlassen zu verlangen, unterliegt nach § 194 des Bürgerlichen Gesetzbuchs der Verjährung. Die Verjährung lässt den Anspruch nicht untergehen. Sie gibt dem Schuldner ein Leistungsverweigerungsrecht, auf das er sich berufen muss.",
"Die regelmäßige Verjährungsfrist beträgt nach § 195 drei Jahre. Sie beginnt nach § 199 Absatz 1 mit dem Schluss des Jahres, in dem der Anspruch entstanden ist und der Gläubiger von den anspruchsbegründenden Umständen und der Person des Schuldners Kenntnis erlangt hat oder ohne grobe Fahrlässigkeit hätte erlangen müssen. Ein im März 2023 entstandener und bekannter Anspruch verjährt demnach mit Ablauf des 31. Dezember 2026.",
"Unabhängig von der Kenntnis gelten Höchstfristen. Schadensersatzansprüche wegen der Verletzung von Leben, Körper, Gesundheit oder Freiheit verjähren nach § 199 Absatz 2 spätestens in 30 Jahren. Sonstige Schadensersatzansprüche verjähren nach Absatz 3 spätestens in zehn Jahren ab Entstehung oder in 30 Jahren ab dem schädigenden Ereignis. Die Verjährung kann unter anderem durch Verhandlungen, durch die Erhebung einer Klage oder durch die Zustellung eines Mahnbescheids gehemmt werden."
],qs:[
{q:"Wie lang ist die regelmäßige Verjährungsfrist?",a:["Drei Jahre.","Ein Jahr.","Zehn Jahre."]},
{q:"Wann beginnt sie nach § 199 Absatz 1?",a:["Mit dem Schluss des Jahres der Entstehung und Kenntnis.","Mit der Entstehung des Anspruchs.","Mit der Klageerhebung."]},
{q:"Wann verjährt ein im März 2023 entstandener und bekannter Anspruch?",a:["Mit Ablauf des 31. Dezember 2026.","Im März 2026.","Im März 2033."]},
{q:"Was bewirkt die Verjährung?",a:["Ein Leistungsverweigerungsrecht des Schuldners.","Das Erlöschen des Anspruchs von selbst.","Die Pflicht zur Zahlung doppelt."]}
]},
{id:"Z3",kind:"recht",area:"Zivilrecht",icon:"↩️",title:"Das Widerrufsrecht im Fernabsatz",ref:"§§ 312g, 355, 356 BGB",card:"Ohne korrekte Belehrung erlischt das Widerrufsrecht spätestens nach zwölf Monaten und 14 Tagen.",paras:[
"Verbraucher, die Waren im Fernabsatz oder außerhalb von Geschäftsräumen bestellen, haben nach § 312g des Bürgerlichen Gesetzbuchs ein Widerrufsrecht. Der Widerruf ist nach § 355 innerhalb von 14 Tagen zu erklären. Eine Begründung ist nicht erforderlich. Zur Fristwahrung genügt die rechtzeitige Absendung der Erklärung.",
"Bei einem Warenkauf beginnt die Frist nach § 356 Absatz 2 frühestens, sobald der Verbraucher die Ware erhalten hat. Bei mehreren Waren in einer Bestellung, die getrennt geliefert werden, kommt es auf den Erhalt der letzten Ware an. Voraussetzung für den Fristbeginn ist außerdem, dass der Unternehmer den Verbraucher ordnungsgemäß über das Widerrufsrecht informiert hat.",
"Fehlt die Belehrung, erlischt das Widerrufsrecht nach § 356 Absatz 3 Satz 2 spätestens zwölf Monate und 14 Tage nach dem Beginn der regulären Frist. Ausnahmen vom Widerrufsrecht regelt § 312g Absatz 2, zum Beispiel für Waren, die nach Kundenspezifikation angefertigt werden, für schnell verderbliche Waren oder für versiegelte Waren, die aus Gründen des Gesundheitsschutzes nicht zur Rückgabe geeignet sind, wenn die Versiegelung nach der Lieferung entfernt wurde."
],qs:[
{q:"Wie lang ist die Widerrufsfrist?",a:["14 Tage.","7 Tage.","30 Tage."]},
{q:"Muss der Widerruf begründet werden?",a:["Nein.","Ja, schriftlich.","Ja, nur bei Mängeln."]},
{q:"Wann erlischt das Recht bei fehlender Belehrung spätestens?",a:["Zwölf Monate und 14 Tage nach Beginn der regulären Frist.","Nie.","Nach 30 Tagen."]},
{q:"Welche Ware ist ein Beispiel für eine Ausnahme?",a:["Nach Kundenspezifikation angefertigte Ware.","Ein Buch.","Ein Fernseher."]}
]},
{id:"Z4",kind:"recht",area:"Zivilrecht",icon:"🛠️",title:"Mängelhaftung im Kaufrecht",ref:"§§ 434, 437, 438, 477 BGB",card:"In den ersten zwölf Monaten wird beim Verbrauchsgüterkauf vermutet, dass der Mangel schon bei Übergabe vorlag.",paras:[
"Ist die gekaufte Sache mangelhaft, stehen dem Käufer nach § 437 des Bürgerlichen Gesetzbuchs bestimmte Rechte zu. Er kann Nacherfüllung verlangen, also Reparatur oder Lieferung einer mangelfreien Sache, vom Vertrag zurücktreten oder den Kaufpreis mindern und unter weiteren Voraussetzungen Schadensersatz oder Ersatz vergeblicher Aufwendungen verlangen. In der Regel hat die Nacherfüllung Vorrang, bevor der Käufer zurücktreten oder mindern kann.",
"Ob ein Mangel vorliegt, richtet sich nach § 434. Die Sache muss den vereinbarten und den objektiv üblichen Anforderungen entsprechen. Die Verjährungsfrist für Mängelansprüche beträgt nach § 438 Absatz 1 Nummer 3 bei beweglichen Sachen zwei Jahre ab Ablieferung. Bei Bauwerken gilt eine Frist von fünf Jahren.",
"Beim Verbrauchsgüterkauf, also dem Kauf einer Sache durch einen Verbraucher von einem Unternehmer, wird nach § 477 vermutet, dass ein Mangel, der sich innerhalb eines Jahres seit Gefahrübergang zeigt, bereits bei der Übergabe vorlag. Diese Beweislastumkehr galt vor dem 1. Januar 2022 nur für sechs Monate. Der Unternehmer kann die Vermutung entkräften, indem er nachweist, dass die Sache bei Übergabe mangelfrei war."
],qs:[
{q:"Welches Recht hat meist Vorrang?",a:["Die Nacherfüllung.","Der Rücktritt.","Die Minderung."]},
{q:"Wie lang ist die Verjährung bei beweglichen Sachen?",a:["Zwei Jahre ab Ablieferung.","Ein Jahr.","Fünf Jahre."]},
{q:"Wie lange gilt die Beweislastumkehr beim Verbrauchsgüterkauf seit 2022?",a:["Ein Jahr.","Sechs Monate.","Zwei Jahre."]},
{q:"Wer kann die Vermutung entkräften?",a:["Der Unternehmer, durch den Nachweis der Mangelfreiheit bei Übergabe.","Der Käufer.","Niemand."]}
]},
{id:"S1",kind:"recht",area:"Steuerrecht",icon:"🧾",title:"Die sieben Einkunftsarten",ref:"§ 2 Absatz 1 EStG",card:"Das Einkommensteuerrecht kennt genau sieben Einkunftsarten, eine Einkunft außerhalb davon bleibt steuerfrei.",paras:[
"Der Einkommensteuer unterliegen nach § 2 Absatz 1 des Einkommensteuergesetzes nur Einkünfte aus sieben abschließend aufgezählten Einkunftsarten. Es handelt sich um Einkünfte aus Land- und Forstwirtschaft, aus Gewerbebetrieb, aus selbständiger Arbeit, aus nichtselbständiger Arbeit, aus Kapitalvermögen, aus Vermietung und Verpachtung sowie sonstige Einkünfte im Sinne des § 22.",
"Die Einkunftsarten werden in zwei Gruppen eingeteilt. Bei den ersten drei Arten, den Gewinneinkunftsarten, ist der Gewinn zu ermitteln, in der Regel als Unterschied zwischen Betriebseinnahmen und Betriebsausgaben oder durch Betriebsvermögensvergleich. Bei den übrigen vier, den Überschusseinkunftsarten, werden die Einnahmen den Werbungskosten gegenübergestellt.",
"Wichtig ist die Folge der Aufzählung: Was unter keine der sieben Arten fällt, ist nicht steuerbar. Ein Lottogewinn oder eine Erbschaft zählt daher nicht zu den Einkünften im Sinne des Einkommensteuergesetzes. Eine Erbschaft kann aber der Erbschaftsteuer unterliegen. Die Zuordnung zu einer Einkunftsart entscheidet auch über Freibeträge, Pauschalen und den Zeitpunkt der Besteuerung."
],qs:[
{q:"Wie viele Einkunftsarten kennt § 2 EStG?",a:["Sieben.","Fünf.","Zehn."]},
{q:"Welche Arten sind Gewinneinkunftsarten?",a:["Land- und Forstwirtschaft, Gewerbebetrieb, selbständige Arbeit.","Kapitalvermögen, Vermietung, sonstige.","Nichtselbständige Arbeit und Vermietung."]},
{q:"Womit werden bei Überschusseinkünften die Einnahmen verglichen?",a:["Mit den Werbungskosten.","Mit dem Betriebsvermögen.","Mit der Umsatzsteuer."]},
{q:"Was gilt für Einkünfte außerhalb der sieben Arten?",a:["Sie sind nicht einkommensteuerbar.","Sie werden pauschal besteuert.","Sie sind immer Gewerbe."]}
]},
{id:"S2",kind:"recht",area:"Steuerrecht",icon:"💶",title:"Umsatzsteuer: Steuersätze, Vorsteuer, Kleinunternehmer",ref:"§§ 12, 15, 19 UStG",card:"Wer Vorsteuer abziehen will, braucht eine ordnungsgemäße Rechnung.",paras:[
"Die Umsatzsteuer belastet den Verbrauch. Unternehmer schulden sie auf ihre Umsätze, geben sie aber über den Preis an die Kunden weiter. Der allgemeine Steuersatz beträgt nach § 12 Absatz 1 des Umsatzsteuergesetzes 19 Prozent. Für bestimmte Umsätze, etwa viele Lebensmittel und Bücher, gilt ein ermäßigter Satz von sieben Prozent.",
"Damit nicht jede Handelsstufe doppelt belastet wird, dürfen Unternehmer nach § 15 die ihnen von anderen Unternehmern in Rechnung gestellte Umsatzsteuer als Vorsteuer abziehen. Sie zahlen an das Finanzamt nur die Differenz zwischen der geschuldeten Umsatzsteuer und der abziehbaren Vorsteuer. Voraussetzung ist unter anderem eine Rechnung, die die gesetzlich vorgeschriebenen Angaben enthält, etwa Namen und Anschrift der Beteiligten, Steuernummer oder Umsatzsteuer-Identifikationsnummer, Datum, Menge und Art der Leistung, Entgelt und Steuerbetrag.",
"Kleinunternehmer erheben nach § 19 keine Umsatzsteuer und können im Gegenzug keine Vorsteuer abziehen. Seit dem 1. Januar 2025 liegt die Grenze bei einem Umsatz von höchstens 25.000 Euro im Vorjahr und höchstens 100.000 Euro im laufenden Jahr. Wird die zweite Grenze überschritten, endet die Kleinunternehmerregelung sofort."
],qs:[
{q:"Wie hoch ist der allgemeine Umsatzsteuersatz?",a:["19 Prozent.","7 Prozent.","16 Prozent."]},
{q:"Was ist Vorsteuer?",a:["Die von anderen Unternehmern in Rechnung gestellte Umsatzsteuer.","Eine Steuer auf Gewinne.","Die Steuer vor Gründung."]},
{q:"Was brauchen Unternehmer für den Vorsteuerabzug?",a:["Eine ordnungsgemäße Rechnung.","Nur eine Quittung.","Einen Mündlichen Auftrag."]},
{q:"Wann endet seit 2025 die Kleinunternehmerregelung sofort?",a:["Bei Überschreiten von 100.000 Euro im laufenden Jahr.","Bei 17.500 Euro.","Nie."]}
]},
{id:"S3",kind:"recht",area:"Steuerrecht",icon:"📅",title:"Fristen in der Abgabenordnung",ref:"§§ 169, 170, 355 AO",card:"Ein Steuerbescheid kann in der Regel nur vier Jahre nach Ablauf des Jahres geändert oder erlassen werden, aber nicht immer.",paras:[
"Die Festsetzungsfrist bestimmt, bis wann das Finanzamt eine Steuer festsetzen oder einen Bescheid ändern darf. Sie beträgt nach § 169 Absatz 2 der Abgabenordnung vier Jahre für die meisten Steuern, darunter Einkommen- und Umsatzsteuer. Bei leichtfertiger Steuerverkürzung beträgt sie fünf Jahre, bei Steuerhinterziehung zehn Jahre.",
"Die Frist beginnt nach § 170 grundsätzlich mit Ablauf des Kalenderjahres, in dem die Steuer entstanden ist. Ist eine Steuererklärung einzureichen, beginnt sie dagegen erst mit Ablauf des Kalenderjahres, in dem die Erklärung eingereicht wird, spätestens jedoch mit Ablauf des dritten Kalenderjahres, das auf das Steuerjahr folgt. Man nennt dies die Anlaufhemmung. Für das Jahr 2022 endet die Frist danach bei rechtzeitiger Abgabe regelmäßig Ende 2027, wenn die Erklärung im Jahr 2023 eingereicht wurde.",
"Gegen einen Steuerbescheid ist der Einspruch nach § 355 innerhalb eines Monats nach Bekanntgabe zulässig. Ein per Post versandter Bescheid gilt nach § 122 Absatz 2 kraft gesetzlicher Fiktion erst einige Tage nach der Aufgabe zur Post als bekannt gegeben. Wer die Frist versäumt, wird unter engen Voraussetzungen durch Wiedereinsetzung in den vorigen Stand geschützt, wenn er ohne Verschulden verhindert war."
],qs:[
{q:"Wie lang ist die regelmäßige Festsetzungsfrist für Einkommensteuer?",a:["Vier Jahre.","Ein Jahr.","Zehn Jahre."]},
{q:"Wie lang ist sie bei Steuerhinterziehung?",a:["Zehn Jahre.","Vier Jahre.","Zwei Jahre."]},
{q:"Was ist die Anlaufhemmung?",a:["Der Fristbeginn verschiebt sich bei Pflicht zur Steuererklärung.","Eine Strafe für spät Zahlende.","Eine Verkürzung der Frist."]},
{q:"Wie lange läuft die Einspruchsfrist?",a:["Einen Monat ab Bekanntgabe.","Eine Woche.","Ein Jahr."]}
]},
{id:"S4",kind:"recht",area:"Steuerrecht",icon:"🗺️",title:"Doppelbesteuerungsabkommen",ref:"OECD-Musterabkommen; § 34c EStG; § 50d EStG",card:"Doppelbesteuerungsabkommen verteilen das Besteuerungsrecht zwischen zwei Staaten.",paras:[
"Wer in einem Staat wohnt und Einkünfte aus einem anderen Staat bezieht, kann in beiden Staaten steuerpflichtig sein, im Wohnsitzstaat wegen seiner unbeschränkten Steuerpflicht und im Quellenstaat wegen der dortigen Einkünfte. Doppelbesteuerungsabkommen, kurz DBA, verteilen das Besteuerungsrecht zwischen den Vertragsstaaten. Deutschland hat solche Abkommen mit über 90 Staaten geschlossen, die meisten orientieren sich am Musterabkommen der OECD.",
"Die Abkommen knüpfen zunächst an die Ansässigkeit an. Eine Person mit Wohnsitz in beiden Staaten wird nach einer Reihe von Kriterien einem Staat zugeordnet, vor allem nach dem Mittelpunkt der Lebensinteressen. Gewerbliche Gewinne eines Unternehmens dürfen im Quellenstaat in der Regel nur besteuert werden, wenn es dort eine Betriebsstätte unterhält, also eine feste Geschäftseinrichtung.",
"Zur Vermeidung der Doppelbesteuerung kennen die Abkommen zwei Methoden. Bei der Freistellungsmethode nimmt der Wohnsitzstaat die Einkünfte von der Besteuerung aus, behält sich aber oft vor, sie bei der Berechnung des Steuersatzes zu berücksichtigen, der sogenannte Progressionsvorbehalt. Bei der Anrechnungsmethode besteuert er sie, rechnet aber die im Quellenstaat gezahlte Steuer an. Besteht kein Abkommen, kann die ausländische Steuer nach § 34c des Einkommensteuergesetzes angerechnet oder abgezogen werden."
],qs:[
{q:"Was regeln Doppelbesteuerungsabkommen?",a:["Die Verteilung des Besteuerungsrechts zwischen zwei Staaten.","Die Höhe der Zölle.","Die Gründung von Unternehmen."]},
{q:"Woran knüpfen sie zuerst an?",a:["An die Ansässigkeit.","An die Staatsangehörigkeit allein.","An die Höhe der Einkünfte."]},
{q:"Was ist eine Betriebsstätte?",a:["Eine feste Geschäftseinrichtung im Quellenstaat.","Ein Wohnsitz.","Ein Bankkonto."]},
{q:"Was bedeutet die Anrechnungsmethode?",a:["Der Wohnsitzstaat besteuert und rechnet die ausländische Steuer an.","Der Wohnsitzstaat verzichtet vollständig.","Beide Staaten besteuern voll."]}
]},
{id:"S5",kind:"recht",area:"Steuerrecht",icon:"🏠",title:"Das Grundsteuer-Urteil des Bundesverfassungsgerichts",ref:"BVerfG, Urteil vom 10. April 2018, 1 BvL 11/14 u. a.",card:"Die Einheitswerte für die Grundsteuer waren verfassungswidrig und lösten die Reform aus.",paras:[
"Die Grundsteuer wurde in Westdeutschland auf Basis von Einheitswerten erhoben, die auf den Wertverhältnissen von 1964 beruhten, in Ostdeutschland auf Werten von 1935. Eine regelmäßige Neubewertung war gesetzlich zwar vorgesehen, fand aber nicht statt. Mehrere Finanzgerichte und Eigentümer bezweifelten deshalb, dass die Bewertung mit dem Grundgesetz vereinbar ist.",
"Mit Urteil vom 10. April 2018 erklärte der Erste Senat des Bundesverfassungsgerichts die Vorschriften zur Einheitsbewertung für Grundvermögen in den alten Bundesländern für unvereinbar mit dem allgemeinen Gleichheitssatz des Artikels 3 Absatz 1 des Grundgesetzes. Der lange Zeitraum ohne Neubewertung führe zu gravierenden Ungleichbehandlungen, die sich nicht mehr rechtfertigen ließen.",
"Das Gericht ordnete aber keine sofortige Nichtigkeit an. Der Gesetzgeber erhielt bis zum 31. Dezember 2019 Zeit für eine Neuregelung. Danach durften die alten Vorschriften noch bis zum 31. Dezember 2024 angewendet werden. Der Bundesgesetzgeber beschloss die Reform 2019, wobei die Länder durch eine Öffnungsklausel eigene Modelle regeln dürfen. Die neue Grundsteuer wird seit dem 1. Januar 2025 erhoben."
],qs:[
{q:"Welcher Maßstab wurde für verfassungswidrig erklärt?",a:["Die veralteten Einheitswerte.","Die Hebesätze.","Der Steuersatz."]},
{q:"Gegen welche Verfassungsnorm verstieß die Einheitsbewertung laut Urteil?",a:["Gegen den allgemeinen Gleichheitssatz.","Gegen die Meinungsfreiheit.","Gegen das Eigentumsrecht allein."]},
{q:"Bis wann musste der Gesetzgeber neu regeln?",a:["Bis zum 31. Dezember 2019.","Bis 2018.","Bis 2030."]},
{q:"Seit wann wird die neue Grundsteuer erhoben?",a:["Seit dem 1. Januar 2025.","Seit 2018.","Seit 2020."]}
]}
],
facts: [
"Datenschutz-Bußgelder können bis zu 20 Millionen Euro oder vier Prozent des weltweiten Jahresumsatzes betragen, je nachdem, was höher ist.",
"Die DSGVO gilt seit dem 25. Mai 2018.",
"Der Begriff Schrems II steht für ein Urteil des Europäischen Gerichtshofs vom 16. Juli 2020.",
"Die regelmäßige Verjährung im Zivilrecht beträgt drei Jahre und beginnt zum Jahresende.",
"Das Widerrufsrecht im Fernabsatz beträgt 14 Tage.",
"Die Mängelrechte beim Kauf einer beweglichen Sache verjähren nach zwei Jahren.",
"Ein Einspruch gegen einen Steuerbescheid muss innerhalb eines Monats eingelegt werden.",
"Der Regelsteuersatz der Umsatzsteuer beträgt 19 Prozent, der ermäßigte Satz sieben Prozent.",
"Der Bundesfinanzhof hat seinen Sitz in München.",
"Das Bürgerliche Gesetzbuch trat am 1. Januar 1900 in Kraft."
]
};
