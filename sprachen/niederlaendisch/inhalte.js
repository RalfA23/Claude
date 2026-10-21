// Lektionen Niederländisch. Jede Lektion: Sätze [nl, de], ein Dialog mit Rollen A/B, ein Lesetext mit Fragen und (Fortgeschritten) Sprechaufgaben.
// Stufe "a1" = Anfänger, "b1" = Fortgeschritten (A2 bis B1). Lückentexte und Übungsrunden entstehen aus den Sätzen.
window.NL_UNITS = [
{
  id: "groeten", track: "a1", icon: "👋", title: "Begrüßen und verabschieden", nl: "Groeten",
  phrases: [
    ["Goedemorgen.", "Guten Morgen."],
    ["Goedemiddag.", "Guten Tag. (nachmittags)"],
    ["Goedenavond.", "Guten Abend."],
    ["Hoe gaat het met je?", "Wie geht es dir?"],
    ["Het gaat goed, dank je.", "Es geht gut, danke."],
    ["En met jou?", "Und dir?"],
    ["Tot ziens!", "Auf Wiedersehen!"],
    ["Tot morgen!", "Bis morgen!"],
    ["Dank je wel.", "Vielen Dank."],
    ["Graag gedaan.", "Gern geschehen."]
  ],
  dialog: { title: "Morgens an der Haustür", roles: ["Nachbarin Sanne", "Du"], lines: [
    ["A", "Goedemorgen! Hoe gaat het met je?", "Guten Morgen! Wie geht es dir?"],
    ["B", "Goedemorgen! Het gaat goed, dank je. En met jou?", "Guten Morgen! Es geht gut, danke. Und dir?"],
    ["A", "Ook goed, dank je wel.", "Auch gut, vielen Dank."],
    ["B", "Fijn! Tot morgen!", "Schön! Bis morgen!"],
    ["A", "Tot morgen!", "Bis morgen!"]
  ]},
  text: { title: "Anna en Piet",
    nl: "Anna woont in Utrecht. Elke ochtend zegt ze goedemorgen tegen de buurman. De buurman heet Piet. Piet zegt altijd: Hoe gaat het, Anna? Anna zegt dan: Goed, dank je!",
    de: "Anna wohnt in Utrecht. Jeden Morgen sagt sie guten Morgen zum Nachbarn. Der Nachbar heißt Piet. Piet sagt immer: Wie geht's, Anna? Anna sagt dann: Gut, danke!",
    questions: [
      ["Waar woont Anna?", ["In Utrecht", "In Amsterdam", "In Hamburg"]],
      ["Hoe heet de buurman?", ["Piet", "Jan", "Kees"]],
      ["Wat zegt Anna?", ["Goed, dank je!", "Tot morgen!", "Graag gedaan."]]
    ]}
},
{
  id: "voorstellen", track: "a1", icon: "🙋", title: "Sich vorstellen", nl: "Jezelf voorstellen",
  phrases: [
    ["Ik heet Thomas.", "Ich heiße Thomas."],
    ["Hoe heet jij?", "Wie heißt du?"],
    ["Ik kom uit Duitsland.", "Ich komme aus Deutschland."],
    ["Ik woon in Hamburg.", "Ich wohne in Hamburg."],
    ["Waar kom jij vandaan?", "Woher kommst du?"],
    ["Ik spreek een beetje Nederlands.", "Ich spreche ein bisschen Niederländisch."],
    ["Leuk je te ontmoeten.", "Schön, dich kennenzulernen."],
    ["Kun je dat herhalen?", "Kannst du das wiederholen?"],
    ["Kun je langzamer praten?", "Kannst du langsamer sprechen?"],
    ["Ik begrijp het niet.", "Ich verstehe es nicht."]
  ],
  dialog: { title: "Auf einer Party", roles: ["Sanne", "Du"], lines: [
    ["A", "Hallo, ik heet Sanne. Hoe heet jij?", "Hallo, ich heiße Sanne. Wie heißt du?"],
    ["B", "Hallo Sanne, ik heet Thomas.", "Hallo Sanne, ich heiße Thomas."],
    ["A", "Waar kom jij vandaan?", "Woher kommst du?"],
    ["B", "Ik kom uit Duitsland. Ik woon in Hamburg.", "Ich komme aus Deutschland. Ich wohne in Hamburg."],
    ["A", "Je spreekt goed Nederlands!", "Du sprichst gut Niederländisch!"],
    ["B", "Dank je, ik spreek een beetje Nederlands.", "Danke, ich spreche ein bisschen Niederländisch."],
    ["A", "Leuk je te ontmoeten!", "Schön, dich kennenzulernen!"],
    ["B", "Ook leuk je te ontmoeten.", "Auch schön, dich kennenzulernen."]
  ]},
  text: { title: "Dit is Mark",
    nl: "Dit is Mark. Mark komt uit Nederland en woont in Rotterdam. Hij is veertig jaar en werkt in de haven. Mark spreekt Nederlands, Engels en een beetje Duits. In het weekend fietst hij graag.",
    de: "Das ist Mark. Mark kommt aus den Niederlanden und wohnt in Rotterdam. Er ist vierzig Jahre alt und arbeitet im Hafen. Mark spricht Niederländisch, Englisch und ein bisschen Deutsch. Am Wochenende fährt er gern Rad.",
    questions: [
      ["Waar woont Mark?", ["In Rotterdam", "In Utrecht", "In Den Haag"]],
      ["Hoe oud is Mark?", ["Veertig jaar", "Dertig jaar", "Vijftig jaar"]],
      ["Wat doet Mark in het weekend?", ["Hij fietst", "Hij zwemt", "Hij kookt"]]
    ]}
},
{
  id: "getallen", track: "a1", icon: "🕒", title: "Zahlen und Uhrzeit", nl: "Getallen en tijd",
  phrases: [
    ["Een, twee, drie, vier, vijf.", "Eins, zwei, drei, vier, fünf."],
    ["Zes, zeven, acht, negen, tien.", "Sechs, sieben, acht, neun, zehn."],
    ["Hoe laat is het?", "Wie spät ist es?"],
    ["Het is drie uur.", "Es ist drei Uhr."],
    ["Het is half vier.", "Es ist halb vier."],
    ["Het is kwart over twee.", "Es ist Viertel nach zwei."],
    ["Hoeveel kost dat?", "Wie viel kostet das?"],
    ["Dat kost vijf euro.", "Das kostet fünf Euro."],
    ["Vandaag is het maandag.", "Heute ist Montag."],
    ["Morgen is het dinsdag.", "Morgen ist Dienstag."]
  ],
  dialog: { title: "Am Bahnsteig", roles: ["Reisende", "Du"], lines: [
    ["A", "Pardon, hoe laat is het?", "Entschuldigung, wie spät ist es?"],
    ["B", "Het is half drie.", "Es ist halb drei."],
    ["A", "Dank je. Hoe laat gaat de trein naar Amsterdam?", "Danke. Wann fährt der Zug nach Amsterdam?"],
    ["B", "Om kwart over drie.", "Um Viertel nach drei."],
    ["A", "Dan heb ik nog tijd voor een koffie!", "Dann habe ich noch Zeit für einen Kaffee!"],
    ["B", "Ja, nog drie kwartier.", "Ja, noch eine Dreiviertelstunde."]
  ]},
  text: { title: "De dag van Jan",
    nl: "Jan staat om zeven uur op. Om half acht eet hij een boterham met kaas. De bus gaat om acht uur. Jan werkt van negen tot vijf. Om zes uur is hij weer thuis.",
    de: "Jan steht um sieben Uhr auf. Um halb acht isst er ein Butterbrot mit Käse. Der Bus fährt um acht Uhr. Jan arbeitet von neun bis fünf. Um sechs Uhr ist er wieder zu Hause.",
    questions: [
      ["Hoe laat staat Jan op?", ["Om zeven uur", "Om acht uur", "Om zes uur"]],
      ["Wat eet Jan?", ["Een boterham met kaas", "Een ei", "Een appel"]],
      ["Hoe laat is Jan weer thuis?", ["Om zes uur", "Om vijf uur", "Om negen uur"]]
    ]}
},
{
  id: "cafe", track: "a1", icon: "☕", title: "Im Café", nl: "In het café",
  phrases: [
    ["Wat wilt u drinken?", "Was möchten Sie trinken?"],
    ["Ik wil graag een koffie.", "Ich hätte gern einen Kaffee."],
    ["Een thee, alstublieft.", "Einen Tee, bitte."],
    ["Met melk en suiker?", "Mit Milch und Zucker?"],
    ["Zonder suiker, graag.", "Ohne Zucker, bitte."],
    ["Heeft u ook appeltaart?", "Haben Sie auch Apfelkuchen?"],
    ["Mag ik de rekening?", "Darf ich die Rechnung haben?"],
    ["Kan ik met de kaart betalen?", "Kann ich mit Karte bezahlen?"],
    ["Het is heel lekker!", "Es ist sehr lecker!"],
    ["Proost!", "Prost!"]
  ],
  dialog: { title: "Bestellen", roles: ["Kellner", "Du"], lines: [
    ["A", "Goedemiddag, wat wilt u drinken?", "Guten Tag, was möchten Sie trinken?"],
    ["B", "Ik wil graag een koffie.", "Ich hätte gern einen Kaffee."],
    ["A", "Met melk en suiker?", "Mit Milch und Zucker?"],
    ["B", "Met melk, zonder suiker. Heeft u ook appeltaart?", "Mit Milch, ohne Zucker. Haben Sie auch Apfelkuchen?"],
    ["A", "Ja, met slagroom?", "Ja, mit Sahne?"],
    ["B", "Ja, graag!", "Ja, gern!"],
    ["A", "Alstublieft. Eet smakelijk!", "Bitte schön. Guten Appetit!"],
    ["B", "Dank u wel. Mag ik straks de rekening?", "Vielen Dank. Darf ich nachher die Rechnung haben?"]
  ]},
  text: { title: "Café De Gouden Leeuw",
    nl: "Café De Gouden Leeuw ligt aan een gracht in Amsterdam. Veel mensen drinken hier 's ochtends koffie. De appeltaart is beroemd: hij is groot en heel lekker. Op een zonnige dag zitten de gasten buiten op het terras.",
    de: "Das Café De Gouden Leeuw liegt an einer Gracht in Amsterdam. Viele Leute trinken hier morgens Kaffee. Der Apfelkuchen ist berühmt: Er ist groß und sehr lecker. An einem sonnigen Tag sitzen die Gäste draußen auf der Terrasse.",
    questions: [
      ["Waar ligt het café?", ["Aan een gracht", "Op het strand", "Naast het station"]],
      ["Wat is beroemd?", ["De appeltaart", "De thee", "De soep"]],
      ["Waar zitten de gasten als de zon schijnt?", ["Buiten op het terras", "Binnen bij de bar", "In de keuken"]]
    ]}
},
{
  id: "boodschappen", track: "a1", icon: "🧀", title: "Einkaufen", nl: "Boodschappen doen",
  phrases: [
    ["Ik ga naar de supermarkt.", "Ich gehe zum Supermarkt."],
    ["Ik heb brood en kaas nodig.", "Ich brauche Brot und Käse."],
    ["Waar vind ik de melk?", "Wo finde ich die Milch?"],
    ["Een kilo appels, alstublieft.", "Ein Kilo Äpfel, bitte."],
    ["Een stuk jonge kaas, graag.", "Ein Stück jungen Käse, bitte."],
    ["Mag ik even proeven?", "Darf ich kurz probieren?"],
    ["Heeft u een tasje?", "Haben Sie eine Tüte?"],
    ["Dat is alles.", "Das ist alles."],
    ["Het is in de aanbieding.", "Es ist im Angebot."],
    ["Wilt u het bonnetje?", "Möchten Sie den Kassenbon?"]
  ],
  dialog: { title: "Beim Käsehändler", roles: ["Käsehändler", "Du"], lines: [
    ["A", "Goedemorgen! Zegt u het maar.", "Guten Morgen! Was darf es sein?"],
    ["B", "Goedemorgen, een stuk jonge kaas, graag.", "Guten Morgen, ein Stück jungen Käse, bitte."],
    ["A", "Wilt u even proeven?", "Möchten Sie kurz probieren?"],
    ["B", "Ja, graag. Lekker!", "Ja, gern. Lecker!"],
    ["A", "Hoeveel wilt u?", "Wie viel möchten Sie?"],
    ["B", "Een pond, alstublieft.", "Ein Pfund, bitte."],
    ["A", "Anders nog iets?", "Sonst noch etwas?"],
    ["B", "Nee, dat is alles. Hoeveel kost het?", "Nein, das ist alles. Wie viel kostet es?"],
    ["A", "Zes euro vijftig.", "Sechs Euro fünfzig."]
  ]},
  text: { title: "Markt in Gouda",
    nl: "Op zaterdag is er markt in Gouda. Daar kopen mensen kaas, vis, groente en bloemen. Veel toeristen komen voor de kaasmarkt. Lisa koopt een stuk oude kaas en een bos tulpen. Ze betaalt met haar telefoon.",
    de: "Am Samstag ist Markt in Gouda. Dort kaufen die Leute Käse, Fisch, Gemüse und Blumen. Viele Touristen kommen wegen des Käsemarkts. Lisa kauft ein Stück alten Käse und einen Strauß Tulpen. Sie bezahlt mit ihrem Handy.",
    questions: [
      ["Wanneer is er markt in Gouda?", ["Op zaterdag", "Op maandag", "Op zondag"]],
      ["Wat koopt Lisa?", ["Kaas en tulpen", "Vis en brood", "Appels en melk"]],
      ["Hoe betaalt Lisa?", ["Met haar telefoon", "Contant", "Met een cheque"]]
    ]}
},
{
  id: "weg", track: "a1", icon: "🧭", title: "Nach dem Weg fragen", nl: "De weg vragen",
  phrases: [
    ["Pardon, waar is het station?", "Entschuldigung, wo ist der Bahnhof?"],
    ["Ga rechtdoor.", "Geh geradeaus."],
    ["Ga linksaf.", "Geh nach links."],
    ["Ga rechtsaf.", "Geh nach rechts."],
    ["Het is aan de linkerkant.", "Es ist auf der linken Seite."],
    ["Is het ver?", "Ist es weit?"],
    ["Het is vijf minuten lopen.", "Es sind fünf Minuten zu Fuß."],
    ["Neem de tweede straat rechts.", "Nimm die zweite Straße rechts."],
    ["Waar is de bushalte?", "Wo ist die Bushaltestelle?"],
    ["Ik ben verdwaald.", "Ich habe mich verlaufen."]
  ],
  dialog: { title: "Zum Museum", roles: ["Passantin", "Du"], lines: [
    ["B", "Pardon, mag ik u iets vragen?", "Entschuldigung, darf ich Sie etwas fragen?"],
    ["A", "Natuurlijk.", "Natürlich."],
    ["B", "Waar is het Rijksmuseum?", "Wo ist das Rijksmuseum?"],
    ["A", "Ga hier rechtdoor tot de brug. Daarna linksaf.", "Gehen Sie hier geradeaus bis zur Brücke. Danach links."],
    ["B", "Is het ver?", "Ist es weit?"],
    ["A", "Nee, het is tien minuten lopen.", "Nein, es sind zehn Minuten zu Fuß."],
    ["B", "Hartelijk bedankt!", "Herzlichen Dank!"],
    ["A", "Graag gedaan. Veel plezier!", "Gern geschehen. Viel Spaß!"]
  ]},
  text: { title: "Fietsen in Nederland",
    nl: "In Nederland fietsen veel mensen. Er zijn zelfs meer fietsen dan mensen! Fietsers hebben eigen paden, vaak van rood asfalt. Pas op als je loopt: het fietspad is niet voor voetgangers.",
    de: "In den Niederlanden fahren viele Menschen Rad. Es gibt sogar mehr Fahrräder als Menschen! Radfahrer haben eigene Wege, oft aus rotem Asphalt. Pass auf, wenn du zu Fuß gehst: Der Radweg ist nicht für Fußgänger.",
    questions: [
      ["Waarvan zijn er meer dan mensen?", ["Fietsen", "Auto's", "Honden"]],
      ["Welke kleur hebben fietspaden vaak?", ["Rood", "Blauw", "Groen"]],
      ["Voor wie is het fietspad niet bedoeld?", ["Voor voetgangers", "Voor fietsers", "Voor kinderen op de fiets"]]
    ]}
},
{
  id: "familie", track: "a1", icon: "👨‍👩‍👧", title: "Familie", nl: "Familie",
  phrases: [
    ["Heb je broers of zussen?", "Hast du Geschwister?"],
    ["Ik heb een broer en een zus.", "Ich habe einen Bruder und eine Schwester."],
    ["Mijn moeder heet Ingrid.", "Meine Mutter heißt Ingrid."],
    ["Mijn vader is gepensioneerd.", "Mein Vater ist im Ruhestand."],
    ["Ik ben getrouwd.", "Ich bin verheiratet."],
    ["We hebben twee kinderen.", "Wir haben zwei Kinder."],
    ["Mijn dochter zit op school.", "Meine Tochter geht zur Schule."],
    ["Mijn opa is tachtig jaar.", "Mein Opa ist achtzig Jahre alt."],
    ["Hoe oud ben je?", "Wie alt bist du?"],
    ["Ik ben vijftig jaar.", "Ich bin fünfzig Jahre alt."]
  ],
  dialog: { title: "Im Park", roles: ["Femke", "Du"], lines: [
    ["A", "Heb jij kinderen?", "Hast du Kinder?"],
    ["B", "Ja, ik heb een dochter.", "Ja, ich habe eine Tochter."],
    ["A", "Hoe oud is ze?", "Wie alt ist sie?"],
    ["B", "Ze is vijftien. En jij?", "Sie ist fünfzehn. Und du?"],
    ["A", "Ik heb twee zoons. Ze zijn acht en tien.", "Ich habe zwei Söhne. Sie sind acht und zehn."],
    ["B", "Wat leuk! Spelen ze graag buiten?", "Wie schön! Spielen sie gern draußen?"],
    ["A", "Ja, ze voetballen elke dag.", "Ja, sie spielen jeden Tag Fußball."]
  ]},
  text: { title: "Familie De Vries",
    nl: "Familie De Vries woont in een huis in Haarlem. Vader Peter is leraar en moeder Femke is arts. Ze hebben drie kinderen: Daan, Emma en Sem. Op zondag eten ze samen pannenkoeken bij oma.",
    de: "Familie De Vries wohnt in einem Haus in Haarlem. Vater Peter ist Lehrer und Mutter Femke ist Ärztin. Sie haben drei Kinder: Daan, Emma und Sem. Am Sonntag essen sie zusammen Pfannkuchen bei Oma.",
    questions: [
      ["Wat doet Femke?", ["Ze is arts", "Ze is lerares", "Ze is kok"]],
      ["Hoeveel kinderen hebben ze?", ["Drie", "Twee", "Vier"]],
      ["Wat eten ze op zondag?", ["Pannenkoeken", "Pizza", "Soep"]]
    ]}
},
{
  id: "dag", track: "a1", icon: "🌞", title: "Mein Tag", nl: "Mijn dag",
  phrases: [
    ["Ik sta om zeven uur op.", "Ich stehe um sieben Uhr auf."],
    ["Ik drink koffie bij het ontbijt.", "Ich trinke Kaffee zum Frühstück."],
    ["Ik ga met de fiets naar mijn werk.", "Ich fahre mit dem Rad zur Arbeit."],
    ["Tussen de middag eet ik een broodje.", "Mittags esse ich ein Brötchen."],
    ["Ik werk tot vijf uur.", "Ich arbeite bis fünf Uhr."],
    ["Daarna kook ik.", "Danach koche ich."],
    ["Daarna kijk ik televisie.", "Danach sehe ich fern."],
    ["Ik ga om elf uur naar bed.", "Ich gehe um elf Uhr ins Bett."],
    ["Wat doe je in het weekend?", "Was machst du am Wochenende?"],
    ["Ik sport drie keer per week.", "Ich mache dreimal pro Woche Sport."]
  ],
  dialog: { title: "Verabredung zum Essen", roles: ["Lotte", "Du"], lines: [
    ["A", "Wat doe jij morgen?", "Was machst du morgen?"],
    ["B", "Morgen werk ik tot drie uur. Daarna ga ik naar de sportschool.", "Morgen arbeite ich bis drei Uhr. Danach gehe ich ins Fitnessstudio."],
    ["A", "Zullen we morgenavond samen eten?", "Wollen wir morgen Abend zusammen essen?"],
    ["B", "Goed idee! Hoe laat?", "Gute Idee! Um wie viel Uhr?"],
    ["A", "Om zeven uur bij mij?", "Um sieben Uhr bei mir?"],
    ["B", "Prima, ik neem een fles wijn mee.", "Prima, ich bringe eine Flasche Wein mit."]
  ]},
  text: { title: "Sophie werkt 's nachts",
    nl: "Sophie is verpleegkundige in een ziekenhuis in Groningen. Soms werkt ze 's nachts. Dan slaapt ze overdag en staat ze om drie uur 's middags op. Na het werk fietst ze naar huis, ook als het regent.",
    de: "Sophie ist Krankenpflegerin in einem Krankenhaus in Groningen. Manchmal arbeitet sie nachts. Dann schläft sie tagsüber und steht um drei Uhr nachmittags auf. Nach der Arbeit fährt sie mit dem Rad nach Hause, auch wenn es regnet.",
    questions: [
      ["Waar werkt Sophie?", ["In een ziekenhuis", "Op een school", "In een winkel"]],
      ["Wanneer slaapt ze als ze 's nachts werkt?", ["Overdag", "Nooit", "'s Avonds"]],
      ["Hoe gaat ze naar huis?", ["Met de fiets", "Met de bus", "Met de auto"]]
    ]}
},
{
  id: "weer", track: "a1", icon: "🌦️", title: "Das Wetter", nl: "Het weer",
  phrases: [
    ["Wat voor weer is het?", "Wie ist das Wetter?"],
    ["Het regent.", "Es regnet."],
    ["De zon schijnt.", "Die Sonne scheint."],
    ["Het waait hard.", "Es ist sehr windig."],
    ["Het is koud vandaag.", "Es ist kalt heute."],
    ["Het is lekker warm.", "Es ist schön warm."],
    ["Morgen gaat het sneeuwen.", "Morgen wird es schneien."],
    ["Neem een paraplu mee.", "Nimm einen Regenschirm mit."],
    ["Het is twintig graden.", "Es sind zwanzig Grad."],
    ["Wat een mooi weer!", "Was für ein schönes Wetter!"]
  ],
  dialog: { title: "Smalltalk über das Wetter", roles: ["Kollege Bas", "Du"], lines: [
    ["A", "Wat een weer, hè!", "Was für ein Wetter, oder!"],
    ["B", "Ja, het regent al de hele dag.", "Ja, es regnet schon den ganzen Tag."],
    ["A", "En het waait ook hard.", "Und es ist auch sehr windig."],
    ["B", "Morgen wordt het beter, zeggen ze.", "Morgen wird es besser, sagen sie."],
    ["A", "Echt? Dan gaan we naar het strand!", "Echt? Dann gehen wir an den Strand!"],
    ["B", "Neem toch maar een jas mee.", "Nimm trotzdem lieber eine Jacke mit."]
  ]},
  text: { title: "Nederlands weer",
    nl: "Het Nederlandse weer verandert snel. 's Ochtends schijnt de zon, 's middags regent het en 's avonds waait het hard. Daarom hebben veel Nederlanders altijd een regenjas bij zich. Maar ze fietsen gewoon door, bij elk weer.",
    de: "Das niederländische Wetter ändert sich schnell. Morgens scheint die Sonne, mittags regnet es und abends ist es sehr windig. Deshalb haben viele Niederländer immer eine Regenjacke dabei. Aber sie fahren einfach weiter Rad, bei jedem Wetter.",
    questions: [
      ["Hoe is het Nederlandse weer?", ["Het verandert snel", "Het is altijd zonnig", "Het is altijd koud"]],
      ["Wat hebben veel Nederlanders altijd bij zich?", ["Een regenjas", "Een zonnebril", "Een muts"]],
      ["Wat doen ze bij elk weer?", ["Ze fietsen", "Ze blijven thuis", "Ze zwemmen"]]
    ]}
},
{
  id: "reizen", track: "a1", icon: "🚆", title: "Unterwegs: Hotel und Bahn", nl: "Op reis",
  phrases: [
    ["Ik heb een kamer gereserveerd.", "Ich habe ein Zimmer reserviert."],
    ["Op naam van Schmidt.", "Auf den Namen Schmidt."],
    ["Hoe laat is het ontbijt?", "Wann gibt es Frühstück?"],
    ["Is er wifi?", "Gibt es WLAN?"],
    ["Wat is het wachtwoord?", "Wie lautet das Passwort?"],
    ["Een kaartje naar Amsterdam, alstublieft.", "Eine Fahrkarte nach Amsterdam, bitte."],
    ["Enkele reis of retour?", "Einfache Fahrt oder hin und zurück?"],
    ["Van welk spoor vertrekt de trein?", "Von welchem Gleis fährt der Zug ab?"],
    ["De trein heeft vertraging.", "Der Zug hat Verspätung."],
    ["Waar kan ik mijn koffer laten?", "Wo kann ich meinen Koffer lassen?"]
  ],
  dialog: { title: "Im Hotel ankommen", roles: ["Rezeption", "Du"], lines: [
    ["A", "Goedenavond, welkom in Hotel Zeezicht.", "Guten Abend, willkommen im Hotel Zeezicht."],
    ["B", "Goedenavond, ik heb een kamer gereserveerd op naam van Schmidt.", "Guten Abend, ich habe ein Zimmer auf den Namen Schmidt reserviert."],
    ["A", "Ja, voor drie nachten. Hier is uw sleutel, kamer twaalf.", "Ja, für drei Nächte. Hier ist Ihr Schlüssel, Zimmer zwölf."],
    ["B", "Dank u. Hoe laat is het ontbijt?", "Danke. Wann gibt es Frühstück?"],
    ["A", "Van zeven tot tien uur.", "Von sieben bis zehn Uhr."],
    ["B", "En is er wifi?", "Und gibt es WLAN?"],
    ["A", "Ja, het wachtwoord staat op uw sleutelkaart.", "Ja, das Passwort steht auf Ihrer Schlüsselkarte."]
  ]},
  text: { title: "Met de trein",
    nl: "Met de trein reis je makkelijk door Nederland. De treinen rijden vaak, soms elke tien minuten. Je betaalt met een OV-chipkaart of gewoon met je bankpas. Van Amsterdam naar Utrecht duurt het maar een halfuur.",
    de: "Mit dem Zug reist man bequem durch die Niederlande. Die Züge fahren oft, manchmal alle zehn Minuten. Man bezahlt mit einer OV-Chipkarte oder einfach mit der Bankkarte. Von Amsterdam nach Utrecht dauert es nur eine halbe Stunde.",
    questions: [
      ["Hoe vaak rijden de treinen soms?", ["Elke tien minuten", "Elk uur", "Eén keer per dag"]],
      ["Waarmee kun je betalen?", ["Met je bankpas", "Alleen contant", "Met een cheque"]],
      ["Hoe lang duurt Amsterdam–Utrecht?", ["Een halfuur", "Twee uur", "Vijf minuten"]]
    ]}
},
{
  id: "afspraken", track: "b1", icon: "📞", title: "Termine am Telefon", nl: "Afspraken maken",
  phrases: [
    ["Ik wil graag een afspraak maken.", "Ich möchte gern einen Termin vereinbaren."],
    ["Komt donderdagmiddag u uit?", "Passt Ihnen Donnerstagnachmittag?"],
    ["Dat komt me helaas niet goed uit.", "Das passt mir leider nicht."],
    ["Kunnen we de afspraak verzetten?", "Können wir den Termin verschieben?"],
    ["Ik bel u straks even terug.", "Ich rufe Sie nachher kurz zurück."],
    ["Met wie spreek ik?", "Mit wem spreche ich?"],
    ["Kunt u een bericht doorgeven?", "Können Sie eine Nachricht weitergeben?"],
    ["Ik ben vandaag slecht bereikbaar.", "Ich bin heute schlecht erreichbar."],
    ["Zullen we volgende week afspreken?", "Sollen wir uns nächste Woche verabreden?"],
    ["Ik stuur je een uitnodiging per mail.", "Ich schicke dir eine Einladung per Mail."]
  ],
  dialog: { title: "Anruf im Büro", roles: ["Sekretärin Eva", "Du"], lines: [
    ["A", "Kantoor Bakker, met Eva.", "Büro Bakker, Eva am Apparat."],
    ["B", "Goedemorgen, u spreekt met Thomas Weber. Ik wil graag een afspraak maken met meneer Bakker.", "Guten Morgen, hier spricht Thomas Weber. Ich möchte gern einen Termin mit Herrn Bakker vereinbaren."],
    ["A", "Dat kan. Komt dinsdag om tien uur u uit?", "Das geht. Passt Ihnen Dienstag um zehn Uhr?"],
    ["B", "Dat komt me helaas niet goed uit. Kan het ook in de middag?", "Das passt mir leider nicht. Geht es auch nachmittags?"],
    ["A", "Om half drie is hij nog vrij.", "Um halb drei hat er noch frei."],
    ["B", "Perfect, dan noteer ik dat.", "Perfekt, dann notiere ich mir das."],
    ["A", "Prima. Tot dinsdag, meneer Weber!", "Prima. Bis Dienstag, Herr Weber!"]
  ]},
  text: { title: "De agenda",
    nl: "Nederlanders plannen veel. Wie met vrienden wil eten, spreekt vaak weken van tevoren af. Iedereen kijkt eerst in zijn agenda. Spontaan langskomen is minder gewoon dan in veel andere landen. Een kop koffie met een collega kan daarentegen altijd.",
    de: "Niederländer planen viel. Wer mit Freunden essen will, verabredet sich oft Wochen im Voraus. Jeder schaut zuerst in seinen Kalender. Spontan vorbeikommen ist weniger üblich als in vielen anderen Ländern. Eine Tasse Kaffee mit einem Kollegen geht dagegen immer.",
    questions: [
      ["Wat doen Nederlanders vaak als ze met vrienden willen eten?", ["Weken van tevoren afspreken", "Spontaan langskomen", "Nooit samen eten"]],
      ["Wat is minder gewoon?", ["Spontaan langskomen", "Koffie drinken", "In de agenda kijken"]],
      ["Wat kan altijd?", ["Een kop koffie met een collega", "Een groot feest", "Een middagdutje"]]
    ]},
  speak: [
    ["Vertel wat je volgende week allemaal gepland hebt.", "Erzähl, was du nächste Woche alles geplant hast.", "Maandag werk ik op kantoor. Dinsdagavond ga ik sporten. Woensdag heb ik een afspraak bij de tandarts en in het weekend bezoek ik vrienden."],
    ["Je moet een afspraak verzetten. Bel en leg uit waarom.", "Du musst einen Termin verschieben. Ruf an und erkläre warum.", "Goedemorgen, met Thomas Weber. Ik heb morgen om tien uur een afspraak, maar dat komt me helaas niet goed uit. Kunnen we de afspraak verzetten naar donderdag?"]
  ]
},
{
  id: "werk", track: "b1", icon: "💼", title: "Über die Arbeit sprechen", nl: "Over werk praten",
  phrases: [
    ["Wat voor werk doe je?", "Was arbeitest du?"],
    ["Ik werk als jurist bij een bedrijf.", "Ich arbeite als Jurist in einer Firma."],
    ["Daarnaast geef ik les.", "Außerdem unterrichte ich."],
    ["Ik werk twee dagen per week thuis.", "Ich arbeite zwei Tage pro Woche zu Hause."],
    ["Ik heb het deze week erg druk.", "Ich habe diese Woche sehr viel zu tun."],
    ["We hebben morgen een vergadering.", "Wir haben morgen eine Besprechung."],
    ["Kun je me hierbij helpen?", "Kannst du mir dabei helfen?"],
    ["De deadline is vrijdag.", "Die Deadline ist Freitag."],
    ["Mijn collega's zijn heel aardig.", "Meine Kollegen sind sehr nett."],
    ["Ik vind mijn werk interessant, maar soms stressvol.", "Ich finde meine Arbeit interessant, aber manchmal stressig."]
  ],
  dialog: { title: "In der Kaffeepause", roles: ["Collega Ruud", "Du"], lines: [
    ["A", "Wat voor werk doe jij eigenlijk?", "Was arbeitest du eigentlich?"],
    ["B", "Ik ben jurist. Ik werk bij een bedrijf en daarnaast geef ik les.", "Ich bin Jurist. Ich arbeite in einer Firma und unterrichte außerdem."],
    ["A", "Interessant! Werk je veel thuis?", "Interessant! Arbeitest du viel zu Hause?"],
    ["B", "Twee dagen per week. De andere dagen ben ik op kantoor.", "Zwei Tage pro Woche. Die anderen Tage bin ich im Büro."],
    ["A", "Wat vind je het leukst aan je werk?", "Was gefällt dir an deiner Arbeit am besten?"],
    ["B", "Het lesgeven. Ik werk graag met studenten.", "Das Unterrichten. Ich arbeite gern mit Studierenden."]
  ]},
  text: { title: "Werken in Nederland",
    nl: "In Nederland werken veel mensen in deeltijd, vaak vier dagen per week. De vrije dag gebruiken ze voor de kinderen, voor sport of voor hun hobby's. Ook de lunch is anders dan in Duitsland: meestal eten collega's een boterham in de kantine en geen warme maaltijd.",
    de: "In den Niederlanden arbeiten viele Menschen in Teilzeit, oft vier Tage pro Woche. Den freien Tag nutzen sie für die Kinder, für Sport oder für ihre Hobbys. Auch das Mittagessen ist anders als in Deutschland: Meist essen Kollegen ein Butterbrot in der Kantine und keine warme Mahlzeit.",
    questions: [
      ["Hoeveel dagen per week werken veel Nederlanders?", ["Vier", "Vijf", "Drie"]],
      ["Waarvoor gebruiken ze de vrije dag?", ["Voor kinderen, sport of hobby's", "Voor extra werk", "Voor een tweede baan"]],
      ["Wat eten collega's meestal als lunch?", ["Een boterham", "Een warme maaltijd", "Niets"]]
    ]},
  speak: [
    ["Beschrijf je werk: wat doe je en wat vind je leuk?", "Beschreibe deine Arbeit: Was machst du und was gefällt dir?", "Ik werk als jurist bij een bedrijf. Ik lees veel contracten en geef advies. Daarnaast geef ik les. Het lesgeven vind ik het leukst, omdat ik graag met mensen werk."],
    ["Hoe ziet een normale werkdag eruit?", "Wie sieht ein normaler Arbeitstag aus?", "Ik begin om half negen. Eerst lees ik mijn mail, daarna heb ik vaak een vergadering. Tussen de middag eet ik een broodje en om vijf uur ga ik naar huis."]
  ]
},
{
  id: "verleden", track: "b1", icon: "🏝️", title: "Erzählen, was war", nl: "Het verleden",
  phrases: [
    ["Wat heb je gisteren gedaan?", "Was hast du gestern gemacht?"],
    ["Ik heb de hele dag gewerkt.", "Ich habe den ganzen Tag gearbeitet."],
    ["We zijn naar het strand gegaan.", "Wir sind an den Strand gefahren."],
    ["Ik heb een goed boek gelezen.", "Ich habe ein gutes Buch gelesen."],
    ["Ze is met de trein gekomen.", "Sie ist mit dem Zug gekommen."],
    ["Vorig jaar zijn we in Zeeland geweest.", "Letztes Jahr waren wir in Zeeland."],
    ["Heb je goed geslapen?", "Hast du gut geschlafen?"],
    ["Ik ben mijn sleutels vergeten.", "Ich habe meine Schlüssel vergessen."],
    ["Toen ik jong was, speelde ik veel buiten.", "Als ich jung war, spielte ich viel draußen."],
    ["Het was een gezellige avond.", "Es war ein gemütlicher Abend."]
  ],
  dialog: { title: "Montagmorgen", roles: ["Collega Ilse", "Du"], lines: [
    ["A", "Hoe was je weekend?", "Wie war dein Wochenende?"],
    ["B", "Heel leuk! We zijn naar Texel geweest.", "Sehr schön! Wir waren auf Texel."],
    ["A", "O, wat hebben jullie gedaan?", "Oh, was habt ihr gemacht?"],
    ["B", "We hebben over het eiland gefietst en vis gegeten.", "Wir sind über die Insel geradelt und haben Fisch gegessen."],
    ["A", "Hebben jullie ook zeehonden gezien?", "Habt ihr auch Seehunde gesehen?"],
    ["B", "Ja, er lagen er een paar op het strand in de zon.", "Ja, ein paar lagen am Strand in der Sonne."],
    ["A", "Wat gezellig. Ik ben thuisgebleven en heb geklust.", "Wie schön. Ich bin zu Hause geblieben und habe gewerkelt."]
  ]},
  text: { title: "Langs de kust",
    nl: "Vorige zomer heeft Tom een fietstocht langs de kust gemaakt. Hij is in Den Helder begonnen en tien dagen later in Vlissingen aangekomen. Onderweg heeft hij op campings geslapen. Eén keer heeft het drie dagen achter elkaar geregend, maar hij is toch doorgegaan.",
    de: "Letzten Sommer hat Tom eine Radtour entlang der Küste gemacht. Er hat in Den Helder angefangen und ist zehn Tage später in Vlissingen angekommen. Unterwegs hat er auf Campingplätzen geschlafen. Einmal hat es drei Tage hintereinander geregnet, aber er ist trotzdem weitergefahren.",
    questions: [
      ["Waar is Tom begonnen?", ["In Den Helder", "In Vlissingen", "In Utrecht"]],
      ["Hoe lang duurde de tocht?", ["Tien dagen", "Drie dagen", "Een maand"]],
      ["Wat deed Tom toen het drie dagen regende?", ["Hij is doorgegaan", "Hij is naar huis gegaan", "Hij is in een hotel gebleven"]]
    ]},
  speak: [
    ["Vertel over je laatste vakantie.", "Erzähl von deinem letzten Urlaub.", "Vorig jaar zijn we naar Zeeland geweest. We hebben veel gefietst en op het strand gelegen. Het weer was mooi en we hebben lekker vis gegeten."],
    ["Wat heb je gisteren gedaan?", "Was hast du gestern gemacht?", "Gisteren heb ik eerst gewerkt. Daarna ben ik naar de sportschool gegaan en 's avonds heb ik gekookt en een film gekeken."]
  ]
},
{
  id: "mening", track: "b1", icon: "💬", title: "Meinung sagen", nl: "Je mening geven",
  phrases: [
    ["Ik vind dat een goed idee.", "Ich finde das eine gute Idee."],
    ["Volgens mij klopt dat niet.", "Meiner Meinung nach stimmt das nicht."],
    ["Daar ben ik het mee eens.", "Da stimme ich zu."],
    ["Daar ben ik het niet mee eens.", "Da stimme ich nicht zu."],
    ["Aan de ene kant is het duur, aan de andere kant is het handig.", "Einerseits ist es teuer, andererseits ist es praktisch."],
    ["Wat vind jij ervan?", "Was hältst du davon?"],
    ["Dat hangt ervan af.", "Das kommt darauf an."],
    ["Ik twijfel nog.", "Ich bin mir noch unsicher."],
    ["Eerlijk gezegd heb ik geen zin.", "Ehrlich gesagt habe ich keine Lust."],
    ["Je hebt gelijk.", "Du hast recht."]
  ],
  dialog: { title: "Urlaubsplanung", roles: ["Partnerin", "Du"], lines: [
    ["A", "Zullen we dit jaar met de auto op vakantie gaan?", "Wollen wir dieses Jahr mit dem Auto in Urlaub fahren?"],
    ["B", "Volgens mij is de trein beter.", "Meiner Meinung nach ist der Zug besser."],
    ["A", "Waarom? De auto is toch handiger?", "Warum? Das Auto ist doch praktischer?"],
    ["B", "Aan de ene kant wel, aan de andere kant sta je vaak in de file.", "Einerseits schon, andererseits steht man oft im Stau."],
    ["A", "Daar heb je gelijk in. Maar de trein is duur.", "Da hast du recht. Aber der Zug ist teuer."],
    ["B", "Dat hangt ervan af. Als je vroeg boekt, valt het mee.", "Das kommt darauf an. Wenn man früh bucht, hält es sich in Grenzen."]
  ]},
  text: { title: "Een autovrij centrum?",
    nl: "Moet het centrum van de stad autovrij worden? Veel bewoners vinden van wel: het is stiller, schoner en veiliger voor kinderen. Winkeliers zijn bang dat er minder klanten komen. In Utrecht en Groningen is het centrum al grotendeels autovrij, en de winkels doen het daar nog steeds goed.",
    de: "Soll die Innenstadt autofrei werden? Viele Bewohner finden ja: Es ist ruhiger, sauberer und sicherer für Kinder. Ladenbesitzer haben Angst, dass weniger Kunden kommen. In Utrecht und Groningen ist die Innenstadt schon großteils autofrei, und den Geschäften geht es dort immer noch gut.",
    questions: [
      ["Waarom zijn veel bewoners voor een autovrij centrum?", ["Het is stiller, schoner en veiliger", "Het is goedkoper", "Er zijn meer parkeerplaatsen"]],
      ["Waar zijn winkeliers bang voor?", ["Minder klanten", "Meer lawaai", "Hogere huur"]],
      ["Hoe gaat het met de winkels in Groningen?", ["Nog steeds goed", "Slecht", "Ze zijn dicht"]]
    ]},
  speak: [
    ["Wat vind je van een autovrij centrum? Geef twee argumenten.", "Was hältst du von einer autofreien Innenstadt? Nenne zwei Argumente.", "Ik vind een autovrij centrum een goed idee. Aan de ene kant is het stiller en veiliger, aan de andere kant is het voor oudere mensen soms lastig. Maar met goede bussen kan het wel."],
    ["Trein of auto: wat vind jij beter voor een vakantie?", "Zug oder Auto: Was findest du für einen Urlaub besser?", "Volgens mij is de trein beter. Je staat niet in de file en je kunt onderweg lezen. Aan de andere kant is de auto handiger als je veel bagage hebt."]
  ]
},
{
  id: "huisarts", track: "b1", icon: "🩺", title: "Beim Hausarzt", nl: "Bij de huisarts",
  phrases: [
    ["Ik voel me niet lekker.", "Ich fühle mich nicht gut."],
    ["Ik heb hoofdpijn.", "Ich habe Kopfschmerzen."],
    ["Sinds wanneer heeft u er last van?", "Seit wann haben Sie Beschwerden?"],
    ["Ik heb koorts.", "Ich habe Fieber."],
    ["Ik ben verkouden.", "Ich bin erkältet."],
    ["U moet een paar dagen rust nemen.", "Sie müssen ein paar Tage Ruhe halten."],
    ["Waar is de dichtstbijzijnde apotheek?", "Wo ist die nächste Apotheke?"],
    ["Drie keer per dag één tablet.", "Dreimal täglich eine Tablette."],
    ["Beterschap!", "Gute Besserung!"],
    ["Ik moet me ziek melden.", "Ich muss mich krankmelden."]
  ],
  dialog: { title: "In der Praxis", roles: ["Hausärztin", "Du"], lines: [
    ["A", "Goedemorgen, wat kan ik voor u doen?", "Guten Morgen, was kann ich für Sie tun?"],
    ["B", "Ik voel me al een paar dagen niet lekker.", "Ich fühle mich schon ein paar Tage nicht gut."],
    ["A", "Wat voor klachten heeft u?", "Was für Beschwerden haben Sie?"],
    ["B", "Ik heb hoofdpijn en een beetje koorts.", "Ich habe Kopfschmerzen und ein bisschen Fieber."],
    ["A", "Dan bent u waarschijnlijk verkouden. Neem rust en drink veel water.", "Dann sind Sie wahrscheinlich erkältet. Ruhen Sie sich aus und trinken Sie viel Wasser."],
    ["B", "Moet ik medicijnen nemen?", "Muss ich Medikamente nehmen?"],
    ["A", "Paracetamol mag, maximaal drie keer per dag. Beterschap!", "Paracetamol ist in Ordnung, höchstens dreimal am Tag. Gute Besserung!"]
  ]},
  text: { title: "De huisarts",
    nl: "In Nederland ga je bij ziekte eerst naar de huisarts. Die verwijst je zo nodig door naar een specialist in het ziekenhuis. Zonder verwijzing kun je meestal niet direct naar een specialist. Huisartsen schrijven niet snel antibiotica voor; vaak is het advies: rust nemen en afwachten.",
    de: "In den Niederlanden geht man bei Krankheit zuerst zum Hausarzt. Der überweist einen wenn nötig an einen Facharzt im Krankenhaus. Ohne Überweisung kann man meist nicht direkt zum Facharzt. Hausärzte verschreiben nicht schnell Antibiotika; oft lautet der Rat: ausruhen und abwarten.",
    questions: [
      ["Naar wie ga je eerst als je ziek bent?", ["Naar de huisarts", "Naar het ziekenhuis", "Naar de apotheek"]],
      ["Wat lukt meestal niet zonder verwijzing?", ["Direct naar een specialist gaan", "Naar de apotheek gaan", "De huisarts bellen"]],
      ["Wat is vaak het advies?", ["Rust nemen en afwachten", "Antibiotica nemen", "Veel sporten"]]
    ]},
  speak: [
    ["Je belt de huisarts. Beschrijf je klachten.", "Du rufst beim Hausarzt an. Beschreibe deine Beschwerden.", "Goedemorgen, ik voel me sinds drie dagen niet lekker. Ik heb hoofdpijn en een beetje koorts. Kan ik vandaag nog langskomen?"],
    ["Meld je ziek bij je werk.", "Melde dich bei der Arbeit krank.", "Hallo, met Thomas. Ik moet me helaas ziek melden. Ik heb koorts en blijf vandaag thuis. Ik denk dat ik morgen weer kan werken."]
  ]
},
{
  id: "cultuur", track: "b1", icon: "🧡", title: "Kultur und Feste", nl: "Cultuur en feesten",
  phrases: [
    ["Op Koningsdag draagt iedereen oranje.", "Am Königstag trägt jeder Orange."],
    ["Het is hier erg gezellig.", "Es ist hier sehr gemütlich."],
    ["Zullen we iets gaan drinken?", "Sollen wir etwas trinken gehen?"],
    ["Ik trakteer!", "Ich gebe einen aus!"],
    ["Gefeliciteerd met je verjaardag!", "Herzlichen Glückwunsch zum Geburtstag!"],
    ["Gefeliciteerd met je zus!", "Glückwunsch zum Geburtstag deiner Schwester!"],
    ["Op pakjesavond geven we elkaar cadeautjes.", "Am Nikolausabend schenken wir uns Geschenke."],
    ["Doe maar gewoon, dan doe je al gek genoeg.", "Benimm dich normal, das ist schon verrückt genug."],
    ["Hij is een echte Hollander.", "Er ist ein echter Holländer."],
    ["Lekker, hè, die stroopwafels?", "Lecker, oder, diese Sirupwaffeln?"]
  ],
  dialog: { title: "Geburtstag im Kreis", roles: ["Gastgeberin Marloes", "Du"], lines: [
    ["B", "Gefeliciteerd met je verjaardag!", "Herzlichen Glückwunsch zum Geburtstag!"],
    ["A", "Dank je wel! Kom binnen.", "Vielen Dank! Komm rein."],
    ["B", "Hier, een klein cadeautje.", "Hier, ein kleines Geschenk."],
    ["A", "Wat lief! Wil je koffie met taart?", "Wie lieb! Möchtest du Kaffee und Kuchen?"],
    ["B", "Graag. Wie zijn er allemaal?", "Gern. Wer ist alles da?"],
    ["A", "Mijn ouders en mijn zus. Ga lekker zitten, iedereen zit al in de kring.", "Meine Eltern und meine Schwester. Setz dich, alle sitzen schon im Kreis."],
    ["B", "Hallo allemaal! Gefeliciteerd met Marloes!", "Hallo zusammen! Glückwunsch zu Marloes' Geburtstag!"]
  ]},
  text: { title: "Koningsdag",
    nl: "Op 27 april is het Koningsdag. Dan viert Nederland de verjaardag van de koning. Overal zijn vrijmarkten, waar mensen hun oude spullen op straat verkopen. Iedereen draagt oranje en in de grachten van Amsterdam varen boten vol feestende mensen.",
    de: "Am 27. April ist Königstag. Dann feiern die Niederlande den Geburtstag des Königs. Überall gibt es Flohmärkte, auf denen die Leute ihre alten Sachen auf der Straße verkaufen. Alle tragen Orange und auf den Grachten in Amsterdam fahren Boote voller feiernder Menschen.",
    questions: [
      ["Wanneer is het Koningsdag?", ["Op 27 april", "Op 5 december", "Op 1 januari"]],
      ["Wat doen mensen op de vrijmarkt?", ["Ze verkopen oude spullen", "Ze kopen alleen bloemen", "Ze spelen voetbal"]],
      ["Welke kleur draagt iedereen?", ["Oranje", "Rood", "Blauw"]]
    ]},
  speak: [
    ["Vertel hoe jij je verjaardag viert.", "Erzähl, wie du deinen Geburtstag feierst.", "Mijn verjaardag vier ik meestal thuis met familie en vrienden. We eten samen en drinken een glas wijn. Een grote kring zoals in Nederland hebben we niet."],
    ["Wat is typisch Duits en wat typisch Nederlands?", "Was ist typisch deutsch und was typisch niederländisch?", "Typisch Nederlands is fietsen bij elk weer en een boterham als lunch. Typisch Duits is volgens mij een warme lunch en veel regels. Maar beide landen houden van gezelligheid."]
  ]
}
];
