// Fachmodul KI (Fortgeschrittenen-Kurs): Sachtexte zu Grundbegriffen, Chancen, Risiken und Regulierung künstlicher Intelligenz in eigenen Worten.
// ref nennt die Quelle (Fachaufsatz, Rechtsakt oder Entscheidung). Keine Rechtsberatung.
// Die richtige Antwort steht in qs immer an erster Stelle, die App mischt sie.
window.KI = {
texts: [
{id:"KI1",kind:"ki",area:"Grundbegriffe",icon:"💡",title:"Was ist künstliche Intelligenz?",ref:"A. M. Turing, Computing Machinery and Intelligence, Mind 1950; McCarthy u. a., Antrag zum Dartmouth-Projekt 1955",card:"Den Begriff künstliche Intelligenz prägte John McCarthy 1955 im Antrag für eine Sommerkonferenz in Dartmouth.",paras:[
"Künstliche Intelligenz ist kein einzelnes Gerät und keine einzelne Methode, sondern ein Forschungsfeld der Informatik. Es beschäftigt sich mit Systemen, die Aufgaben lösen, für die man bei Menschen Intelligenz voraussetzen würde: Sprache verstehen, Bilder erkennen, Entscheidungen treffen oder Probleme planen. Eine allgemein anerkannte Definition gibt es bis heute nicht.",
"Als Vordenker gilt der britische Mathematiker Alan Turing. In seinem Aufsatz von 1950 fragte er, ob Maschinen denken können, und schlug statt einer Definition ein Imitationsspiel vor, das heute Turing-Test heißt: Kann ein Mensch im schriftlichen Gespräch nicht sicher unterscheiden, ob er mit einer Maschine oder einem Menschen spricht? Den Begriff künstliche Intelligenz prägte John McCarthy 1955 im Antrag für ein Forschungstreffen, das im Sommer 1956 am Dartmouth College stattfand.",
"Fachleute unterscheiden oft zwischen schwacher und starker künstlicher Intelligenz. Schwache oder enge KI löst klar umrissene Aufgaben, etwa Schach spielen, Texte übersetzen oder Spam erkennen. Alle heute eingesetzten Systeme gehören in diese Gruppe. Starke oder allgemeine KI wäre ein System, das Aufgaben aller Art so flexibel bewältigt wie ein Mensch. Ob und wann es so etwas geben wird, ist in der Forschung umstritten."
],qs:[
{q:"Wer prägte den Begriff künstliche Intelligenz?",a:["John McCarthy.","Alan Turing.","Konrad Zuse."]},
{q:"Was prüft der Turing-Test?",a:["Ob ein Mensch Maschine und Mensch im Gespräch unterscheiden kann.","Wie schnell ein Computer rechnet.","Ob eine Maschine Gefühle hat."]},
{q:"Zu welcher Gruppe gehören alle heute eingesetzten Systeme?",a:["Zur schwachen oder engen KI.","Zur starken KI.","Zur allgemeinen KI."]},
{q:"Wo fand das Forschungstreffen von 1956 statt?",a:["Am Dartmouth College.","In Cambridge.","Im Silicon Valley."]}
]},
{id:"KI2",kind:"ki",area:"Grundbegriffe",icon:"📊",title:"Maschinelles Lernen: Aus Beispielen lernen",ref:"Fachliteratur zum maschinellen Lernen, zum Beispiel T. Mitchell, Machine Learning, 1997",card:"Beim maschinellen Lernen schreibt niemand die Regeln, das System leitet sie aus Beispielen ab.",paras:[
"Klassische Programme folgen Regeln, die ein Mensch vorher aufgeschrieben hat. Beim maschinellen Lernen ist es umgekehrt: Das System bekommt Beispiele und leitet daraus selbst ein Modell ab, das auch auf neue Fälle passt. Ein Spamfilter etwa lernt aus Tausenden markierten E-Mails, welche Merkmale auf Werbung hindeuten, ohne dass jemand jede Regel einzeln festlegt.",
"Man unterscheidet drei Grundformen. Beim überwachten Lernen sind die Beispiele mit der richtigen Antwort versehen, etwa Fotos mit der Angabe Hund oder Katze. Beim unüberwachten Lernen fehlen solche Angaben, und das System sucht selbst nach Mustern und Gruppen in den Daten. Beim bestärkenden Lernen probiert ein System Handlungen aus und erhält Belohnungen oder Strafen, so wie ein Programm, das durch viele Partien gegen sich selbst ein Spiel erlernt.",
"Ob ein Modell taugt, zeigt sich erst an Daten, die es beim Lernen nicht gesehen hat. Deshalb teilt man die Daten in Trainings- und Testdaten auf. Ein häufiges Problem ist die Überanpassung: Das Modell lernt die Trainingsbeispiele samt ihren Zufälligkeiten auswendig und versagt dann bei neuen Fällen. Außerdem gilt ein alter Grundsatz der Informatik: Sind die Daten schlecht oder einseitig, wird es auch das Ergebnis sein."
],qs:[
{q:"Was unterscheidet maschinelles Lernen von klassischen Programmen?",a:["Das System leitet Regeln aus Beispielen ab.","Ein Mensch schreibt jede Regel.","Es braucht keine Daten."]},
{q:"Was kennzeichnet überwachtes Lernen?",a:["Die Beispiele sind mit der richtigen Antwort versehen.","Es gibt keine Beispiele.","Das System erhält nur Belohnungen."]},
{q:"Was ist Überanpassung?",a:["Das Modell lernt die Trainingsdaten auswendig und versagt bei neuen Fällen.","Das Modell ist zu klein.","Das Modell lernt zu langsam."]},
{q:"Wozu dienen Testdaten?",a:["Um das Modell an ungesehenen Daten zu prüfen.","Um das Modell schneller zu machen.","Um Speicher zu sparen."]}
]},
{id:"KI3",kind:"ki",area:"Grundbegriffe",icon:"🧠",title:"Neuronale Netze und Deep Learning",ref:"Rumelhart, Hinton, Williams, Nature 1986; Krizhevsky, Sutskever, Hinton, NeurIPS 2012; Nobelpreis Physik 2024",card:"2012 gewann ein tiefes neuronales Netz den ImageNet-Wettbewerb mit großem Abstand und löste den Deep-Learning-Boom aus.",paras:[
"Künstliche neuronale Netze sind lose vom Gehirn inspiriert. Sie bestehen aus vielen einfachen Recheneinheiten, die in Schichten angeordnet sind. Jede Einheit nimmt Zahlen auf, gewichtet sie, addiert sie und gibt ein Ergebnis an die nächste Schicht weiter. Was das Netz kann, steckt allein in diesen Gewichten. Beim Training werden sie Schritt für Schritt so verändert, dass der Fehler bei den Beispielen kleiner wird.",
"Das wichtigste Verfahren dafür ist die Fehlerrückführung, englisch Backpropagation. David Rumelhart, Geoffrey Hinton und Ronald Williams machten sie 1986 mit einem Aufsatz in der Zeitschrift Nature bekannt. Lange fehlte es aber an Rechenleistung und Daten. Den Durchbruch brachte 2012 ein Netz namens AlexNet, das den Bilderkennungswettbewerb ImageNet mit großem Abstand gewann. Es lief auf Grafikprozessoren, die ursprünglich für Computerspiele gebaut wurden.",
"Netze mit vielen Schichten nennt man tief, daher der Begriff Deep Learning. Sie stecken heute in Spracherkennung, Übersetzung, Bildbearbeitung und Sprachmodellen. 2024 erhielten John Hopfield und Geoffrey Hinton den Nobelpreis für Physik für grundlegende Arbeiten zu künstlichen neuronalen Netzen. Ein Nachteil bleibt: Bei Millionen oder Milliarden Gewichten lässt sich oft kaum nachvollziehen, warum ein Netz zu einem bestimmten Ergebnis kommt."
],qs:[
{q:"Wo steckt das Können eines neuronalen Netzes?",a:["In den Gewichten.","In der Bildschirmauflösung.","In fest programmierten Regeln."]},
{q:"Welches Netz gewann 2012 den ImageNet-Wettbewerb?",a:["AlexNet.","Deep Blue.","ELIZA."]},
{q:"Wofür wurden Grafikprozessoren ursprünglich gebaut?",a:["Für Computerspiele.","Für Banken.","Für Raumfahrt."]},
{q:"Wer erhielt 2024 den Physik-Nobelpreis für Arbeiten zu neuronalen Netzen?",a:["John Hopfield und Geoffrey Hinton.","Alan Turing und John McCarthy.","Demis Hassabis allein."]}
]},
{id:"KI4",kind:"ki",area:"Grundbegriffe",icon:"💬",title:"Große Sprachmodelle: Wie Chatbots schreiben",ref:"Vaswani u. a., Attention Is All You Need, 2017",card:"Ein Sprachmodell sagt immer nur das wahrscheinlich nächste Textstück voraus, auch wenn das Ergebnis klug wirkt.",paras:[
"Große Sprachmodelle wie die hinter ChatGPT, Claude oder Gemini sind neuronale Netze, die mit sehr großen Textmengen trainiert wurden. Ihre Grundaufgabe ist schlicht: Sie zerlegen Text in kleine Stücke, sogenannte Token, und sagen vorher, welches Token als nächstes wahrscheinlich folgt. Aus dieser Vorhersage, viele tausend Mal hintereinander ausgeführt, entstehen ganze Antworten.",
"Möglich wurde der heutige Stand durch die Transformer-Architektur, die Forschende 2017 in dem Aufsatz Attention Is All You Need vorstellten. Ihr Kern ist ein Aufmerksamkeitsmechanismus, mit dem das Modell bei jedem Wort gewichtet, welche anderen Wörter im Text dafür wichtig sind. Nach dem Vortraining folgt meist ein Feinschliff, bei dem Menschen Antworten bewerten, damit das Modell hilfreicher und sicherer antwortet. Öffentlich bekannt wurde die Technik mit der Veröffentlichung von ChatGPT am 30. November 2022.",
"Weil ein Sprachmodell Wahrscheinlichkeiten folgt und kein Faktenregister abfragt, kann es flüssig und überzeugend Falsches schreiben, etwa erfundene Quellen oder Aktenzeichen. Man spricht von Halluzinationen. Für den Alltag heißt das: Sprachmodelle eignen sich gut zum Entwerfen, Zusammenfassen und Erklären, ihre Angaben sollte man aber bei allem, was zählt, an der Quelle prüfen."
],qs:[
{q:"Was sagt ein Sprachmodell im Kern vorher?",a:["Das wahrscheinlich nächste Token.","Den nächsten Lottogewinn.","Die Meinung des Nutzers."]},
{q:"Wie heißt die Architektur aus dem Aufsatz von 2017?",a:["Transformer.","Perzeptron.","Expertensystem."]},
{q:"Was sind Halluzinationen?",a:["Überzeugend formulierte, aber falsche Angaben.","Bilder, die das Modell malt.","Fehler bei der Stromversorgung."]},
{q:"Wann wurde ChatGPT veröffentlicht?",a:["Am 30. November 2022.","Im Jahr 2017.","Im Jahr 1956."]}
]},
{id:"KI5",kind:"ki",area:"Chancen und Risiken",icon:"🌱",title:"Chancen: Wo KI heute hilft",ref:"Nobelpreis Chemie 2024 (AlphaFold); Jumper u. a., Nature 2021",card:"Für die Vorhersage von Proteinstrukturen mit KI gab es 2024 den Chemie-Nobelpreis.",paras:[
"Ein viel zitiertes Beispiel für den Nutzen von KI kommt aus der Biologie. Proteine falten sich zu dreidimensionalen Formen, die ihre Funktion bestimmen. Diese Form experimentell zu ermitteln, kostete oft Jahre. Das Programm AlphaFold von Google DeepMind sagt sie für viele Proteine mit hoher Genauigkeit aus der Abfolge der Bausteine vorher. Demis Hassabis und John Jumper erhielten dafür 2024 die Hälfte des Nobelpreises für Chemie, die andere Hälfte ging an David Baker für das Entwerfen neuer Proteine.",
"Im Alltag zeigt sich der Nutzen unauffälliger. Maschinelle Übersetzung macht fremdsprachige Texte zugänglich, Spracherkennung und automatische Bildbeschreibungen helfen Menschen mit Seh- oder Hörbehinderung, und Sprachmodelle erleichtern das Entwerfen von Texten, das Zusammenfassen langer Dokumente oder das Programmieren. In der Medizin werden Systeme erprobt und teils eingesetzt, die Ärztinnen und Ärzte beim Auswerten von Röntgen- oder Gewebebildern unterstützen.",
"Wie groß der Nutzen im Einzelfall ist, hängt stark von der Aufgabe ab. Studien finden für manche Tätigkeiten deutliche Zeitgewinne, für andere kaum Effekte. Am besten funktionieren Anwendungen, bei denen ein Mensch das Ergebnis prüft und die Verantwortung behält. Wer KI sinnvoll nutzen will, braucht deshalb eigenes Fachwissen, um Fehler zu erkennen."
],qs:[
{q:"Was sagt AlphaFold vorher?",a:["Die dreidimensionale Struktur von Proteinen.","Das Wetter.","Aktienkurse."]},
{q:"Welchen Preis erhielten Hassabis und Jumper 2024?",a:["Den Nobelpreis für Chemie.","Den Turing Award.","Den Friedensnobelpreis."]},
{q:"Wem helfen automatische Bildbeschreibungen besonders?",a:["Menschen mit Sehbehinderung.","Nur Programmierern.","Nur Fotografen."]},
{q:"Wann funktionieren KI-Anwendungen laut Text am besten?",a:["Wenn ein Mensch das Ergebnis prüft und verantwortlich bleibt.","Wenn niemand das Ergebnis prüft.","Wenn das System ganz allein entscheidet."]}
]},
{id:"KI6",kind:"ki",area:"Chancen und Risiken",icon:"⚠️",title:"Risiken: Verzerrung, Täuschung, Abhängigkeit",ref:"Buolamwini und Gebru, Gender Shades, 2018",card:"Gesichtsanalyse erkannte 2018 das Geschlecht dunkelhäutiger Frauen weit schlechter als das hellhäutiger Männer.",paras:[
"KI-Systeme übernehmen, was in ihren Daten steckt, auch Vorurteile. Bekannt wurde die Studie Gender Shades von Joy Buolamwini und Timnit Gebru aus dem Jahr 2018. Sie prüften kommerzielle Programme, die auf Fotos das Geschlecht bestimmen. Bei hellhäutigen Männern lag die Fehlerquote unter einem Prozent, bei dunkelhäutigen Frauen bei einigen Systemen über 30 Prozent. Solche Verzerrungen sind besonders heikel, wenn KI über Kredite, Bewerbungen oder Polizeieinsätze mitentscheidet.",
"Ein zweites Risiko ist Täuschung. Mit generativer KI lassen sich täuschend echte Bilder, Stimmen und Videos herstellen, sogenannte Deepfakes. Sie werden für Betrug eingesetzt, etwa wenn Anrufer die Stimme eines Angehörigen imitieren, für Desinformation und für bloßstellende Fälschungen. Dazu kommen Halluzinationen: Falsche Angaben, die so sicher formuliert sind, dass man sie leicht übernimmt.",
"Weitere offene Fragen betreffen den Datenschutz beim Training mit persönlichen Daten, das Urheberrecht an Trainingstexten und Bildern, den hohen Strombedarf großer Rechenzentren und die Konzentration der Technik bei wenigen Unternehmen. Schließlich besteht die Gefahr, dass Menschen eigene Fähigkeiten verlernen oder Ergebnissen unkritisch vertrauen. Viele Fachleute empfehlen deshalb, KI wie einen fleißigen, aber unzuverlässigen Mitarbeiter zu behandeln, dessen Arbeit man kontrolliert."
],qs:[
{q:"Was untersuchte die Studie Gender Shades?",a:["Fehlerquoten von Gesichtsanalyse nach Hautfarbe und Geschlecht.","Den Strombedarf von Rechenzentren.","Die Geschwindigkeit von Chatbots."]},
{q:"Was sind Deepfakes?",a:["Täuschend echte gefälschte Bilder, Stimmen oder Videos.","Besonders tiefe neuronale Netze.","Fehler in Datenbanken."]},
{q:"Wie hoch war die Fehlerquote bei hellhäutigen Männern?",a:["Unter einem Prozent.","Über 30 Prozent.","Genau 50 Prozent."]},
{q:"Wie sollte man KI laut vielen Fachleuten behandeln?",a:["Wie einen fleißigen, aber unzuverlässigen Mitarbeiter.","Wie eine unfehlbare Autorität.","Wie ein Spielzeug ohne Nutzen."]}
]},
{id:"KI7",kind:"ki",area:"Recht und Regeln",icon:"🇪🇺",title:"Die KI-Verordnung der EU",ref:"Verordnung (EU) 2024/1689 (KI-Verordnung), insbesondere Art. 4, 5, 6, 50, 99 und 113",card:"Die KI-Verordnung ordnet KI-Systeme nach Risiko: verboten, hochriskant, transparenzpflichtig oder frei.",paras:[
"Mit der Verordnung (EU) 2024/1689, kurz KI-Verordnung oder AI Act, hat die Europäische Union als erste große Rechtsordnung umfassende Regeln für künstliche Intelligenz geschaffen. Sie trat am 1. August 2024 in Kraft und gilt gestaffelt. Seit dem 2. Februar 2025 sind bestimmte Praktiken verboten, und Anbieter wie Betreiber müssen für ausreichende KI-Kompetenz ihres Personals sorgen. Seit dem 2. August 2025 gelten Pflichten für KI-Modelle mit allgemeinem Verwendungszweck, also etwa große Sprachmodelle. Der Großteil der übrigen Vorschriften gilt nach dem Gesetzestext ab dem 2. August 2026, einzelne Pflichten für Hochrisiko-Systeme ab dem 2. August 2027.",
"Der Ansatz ist risikobasiert. Verboten sind nach Artikel 5 etwa Systeme zur sozialen Bewertung von Menschen, manipulative Techniken, die Verhalten unbewusst steuern und Schaden verursachen, und Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen, von engen Ausnahmen abgesehen. Hochriskant sind Systeme in sensiblen Bereichen wie Bewerberauswahl, Kreditwürdigkeitsprüfung, Bildung oder Strafverfolgung. Für sie gelten Pflichten zu Risikomanagement, Datenqualität, Dokumentation und menschlicher Aufsicht.",
"Für andere Systeme gelten vor allem Transparenzpflichten nach Artikel 50: Menschen müssen erkennen können, dass sie mit einer KI sprechen, und Deepfakes sind als künstlich erzeugt zu kennzeichnen. Die meisten Anwendungen, etwa Spamfilter, bleiben ohne besondere Pflichten. Bei Verstößen gegen die Verbote drohen Geldbußen bis zu 35 Millionen Euro oder sieben Prozent des weltweiten Jahresumsatzes. Die Kommission hat im November 2025 vorgeschlagen, einzelne Fristen zu verschieben. Den jeweils aktuellen Stand sollte man im Amtsblatt der EU nachlesen."
],qs:[
{q:"Wann trat die KI-Verordnung in Kraft?",a:["Am 1. August 2024.","Am 25. Mai 2018.","Am 1. Januar 2030."]},
{q:"Wie ist der Ansatz der Verordnung?",a:["Risikobasiert.","Für alle Systeme gleich.","Nur freiwillig."]},
{q:"Was ist nach Artikel 5 zum Beispiel verboten?",a:["Soziale Bewertung von Menschen.","Spamfilter.","Maschinelle Übersetzung."]},
{q:"Wie hoch können Bußgelder bei verbotenen Praktiken sein?",a:["Bis 35 Millionen Euro oder sieben Prozent des Jahresumsatzes.","Höchstens 1.000 Euro.","Es gibt keine Bußgelder."]}
]},
{id:"KI8",kind:"ki",area:"Recht und Regeln",icon:"🔐",title:"KI und Datenschutz",ref:"Art. 6 DSGVO; EDSA, Stellungnahme 28/2024 vom 17. Dezember 2024",card:"Auch das Training von KI-Modellen mit personenbezogenen Daten braucht eine Rechtsgrundlage.",paras:[
"KI-Modelle werden mit riesigen Datenmengen trainiert, oft aus dem öffentlich zugänglichen Internet. Darunter sind zwangsläufig personenbezogene Daten: Namen, Fotos, Beiträge in Foren. Für die Datenschutz-Grundverordnung macht es keinen Unterschied, ob Daten öffentlich sind. Auch ihre Verarbeitung für ein Training braucht eine Rechtsgrundlage nach Artikel 6, und die Grundsätze wie Zweckbindung, Datenminimierung und Transparenz gelten ebenso.",
"Der Europäische Datenschutzausschuss, in dem die Aufsichtsbehörden der Mitgliedstaaten zusammenarbeiten, hat dazu im Dezember 2024 eine Stellungnahme veröffentlicht. Danach kann das berechtigte Interesse als Rechtsgrundlage in Betracht kommen, allerdings nur nach sorgfältiger Abwägung im Einzelfall. Ob ein fertiges Modell selbst noch personenbezogene Daten enthält oder als anonym gelten kann, ist ebenfalls im Einzelfall zu prüfen. Wurde ein Modell unrechtmäßig trainiert, kann das auch seinen späteren Einsatz belasten.",
"Für Nutzerinnen und Nutzer ergibt sich daraus ein praktischer Rat: Was man in einen Chatbot eingibt, kann je nach Anbieter und Einstellung gespeichert und zur Verbesserung des Systems verwendet werden. Vertrauliche Daten anderer Menschen, etwa von Kunden, Mandanten oder Patienten, gehören deshalb nur dann hinein, wenn es dafür eine Rechtsgrundlage und eine passende Vereinbarung mit dem Anbieter gibt. Die Betroffenenrechte auf Auskunft, Berichtigung und Löschung gelten auch gegenüber KI-Anbietern."
],qs:[
{q:"Braucht das Training mit öffentlich zugänglichen Daten eine Rechtsgrundlage?",a:["Ja, auch öffentliche Daten sind geschützt.","Nein, öffentliche Daten sind frei.","Nur bei Fotos."]},
{q:"Welche Rechtsgrundlage kann laut EDSA in Betracht kommen?",a:["Das berechtigte Interesse nach Abwägung.","Gar keine.","Nur ein Gesetz des Bundestags."]},
{q:"Wie ist die Frage zu beantworten, ob ein Modell anonym ist?",a:["Im Einzelfall.","Modelle sind immer anonym.","Modelle sind nie anonym."]},
{q:"Was rät der Text für Eingaben in Chatbots?",a:["Vertrauliche Daten anderer nur mit Rechtsgrundlage und Vereinbarung eingeben.","Alles eingeben, was hilft.","Nur Fotos eingeben."]}
]}
],
facts: [
"Der Begriff künstliche Intelligenz stammt aus einem Forschungsantrag von 1955.",
"Alan Turing stellte sein Imitationsspiel 1950 vor.",
"Die Transformer-Architektur wurde 2017 veröffentlicht.",
"ChatGPT erschien am 30. November 2022.",
"2024 gingen der Physik- und der Chemie-Nobelpreis an Arbeiten mit Bezug zu künstlicher Intelligenz.",
"Die KI-Verordnung der EU trat am 1. August 2024 in Kraft.",
"Seit dem 2. Februar 2025 müssen Unternehmen, die KI einsetzen, für KI-Kompetenz ihres Personals sorgen.",
"Ein Token ist ein Textstück, oft ein Wort oder ein Teil davon."
]
};

window.PACKS=(window.PACKS||[]).concat([Object.assign({id:"ki",order:2,course:"adv",icon:"🤖",name:"Fachmodul KI",eyebrow:"Fachmodul KI · Grundbegriffe, Chancen, Risiken, Regeln",fact:"KI-Fakt des Tages",mins:"zwei Minuten",refLabel:"Quelle",
  ranks:[["Neugierig","🔌"],["Prompt-Tipper","⌨️"],["Datensammler","🗃️"],["Modellbauer","🧩"],["KI-Kenner","🧠"],["KI-Weiser","👑"]],
  topic:"Das Fachmodul bringt Sachtexte zu künstlicher Intelligenz, zusammengestellt aus Fachaufsätzen, Rechtsakten und Entscheidungen und in eigenen Worten wiedergegeben. Keine Rechtsberatung."},window.KI)]);
