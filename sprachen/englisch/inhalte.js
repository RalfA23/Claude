// Lektionen Englisch für Deutschsprachige. Jede Lektion: Sätze [en, de], ein Dialog mit Rollen A/B, ein Lesetext mit Fragen und (Fortgeschritten) Sprechaufgaben.
// Stufe "a1" = Anfänger (A1 bis A2), "b1" = Fortgeschritten (B1 bis B2). Lückentexte und Übungsrunden entstehen aus den Sätzen.
// Optional "tip": ein kurzer Hinweis auf eine typische Stolperfalle für Deutsche, steht oben in der Lektion.
window.EN_UNITS = [
{
  id: "hello", track: "a1", icon: "👋", title: "Begrüßen und verabschieden", en: "Greetings",
  tip: "„How are you?“ ist meist nur ein Gruß. Kurz antworten („Fine, thanks. And you?“) reicht, keine Krankengeschichte.",
  phrases: [
    ["Good morning.", "Guten Morgen."],
    ["Good afternoon.", "Guten Tag. (nachmittags)"],
    ["Good evening.", "Guten Abend."],
    ["How are you?", "Wie geht es dir?"],
    ["I'm fine, thanks. And you?", "Mir geht's gut, danke. Und dir?"],
    ["Nice to see you again.", "Schön, dich wiederzusehen."],
    ["See you tomorrow!", "Bis morgen!"],
    ["Have a nice day!", "Schönen Tag noch!"],
    ["Thank you very much.", "Vielen Dank."],
    ["You're welcome.", "Gern geschehen."]
  ],
  dialog: { title: "Morgens im Treppenhaus", roles: ["Nachbarin Emma", "Du"], lines: [
    ["A", "Good morning! How are you?", "Guten Morgen! Wie geht's?"],
    ["B", "Good morning, Emma! I'm fine, thanks. And you?", "Guten Morgen, Emma! Gut, danke. Und dir?"],
    ["A", "Not bad, thank you. Off to work?", "Nicht schlecht, danke. Auf dem Weg zur Arbeit?"],
    ["B", "Yes, I'm a bit late today.", "Ja, ich bin heute etwas spät dran."],
    ["A", "Oh, then I won't keep you. Have a nice day!", "Oh, dann halte ich dich nicht auf. Schönen Tag noch!"],
    ["B", "Thanks, you too. See you later!", "Danke, dir auch. Bis später!"]
  ]},
  text: { title: "Tom and Emma",
    en: "Tom lives in a small flat in London. Every morning he meets his neighbour Emma on the stairs. Emma always says: Good morning, Tom! How are you? Tom always says: Fine, thanks. Then he walks to the station.",
    de: "Tom wohnt in einer kleinen Wohnung in London. Jeden Morgen trifft er seine Nachbarin Emma im Treppenhaus. Emma sagt immer: Guten Morgen, Tom! Wie geht's? Tom sagt immer: Gut, danke. Dann geht er zum Bahnhof.",
    questions: [
      ["Where does Tom live?", ["In London", "In Manchester", "In Hamburg"]],
      ["Who is Emma?", ["His neighbour", "His sister", "His boss"]],
      ["Where does Tom go after that?", ["To the station", "To the shop", "To the park"]]
    ]}
},
{
  id: "introduce", track: "a1", icon: "🙋", title: "Sich vorstellen", en: "Introducing yourself",
  tip: "Deutsche sagen gern „I am coming from Germany“. Richtig ist „I come from Germany“ oder „I'm from Germany“.",
  phrases: [
    ["My name is Thomas.", "Ich heiße Thomas."],
    ["What's your name?", "Wie heißt du?"],
    ["I'm from Germany.", "Ich komme aus Deutschland."],
    ["I live in Hamburg.", "Ich wohne in Hamburg."],
    ["Where are you from?", "Woher kommst du?"],
    ["I speak a little English.", "Ich spreche ein bisschen Englisch."],
    ["Nice to meet you.", "Freut mich, dich kennenzulernen."],
    ["Could you say that again, please?", "Kannst du das bitte wiederholen?"],
    ["Could you speak more slowly, please?", "Kannst du bitte langsamer sprechen?"],
    ["Sorry, I don't understand.", "Entschuldigung, ich verstehe das nicht."]
  ],
  dialog: { title: "Auf einer Party", roles: ["Sarah", "Du"], lines: [
    ["A", "Hi, I'm Sarah. What's your name?", "Hallo, ich bin Sarah. Wie heißt du?"],
    ["B", "Hi Sarah, my name is Thomas.", "Hallo Sarah, ich heiße Thomas."],
    ["A", "Nice to meet you, Thomas. Where are you from?", "Freut mich, Thomas. Woher kommst du?"],
    ["B", "I'm from Germany. I live in Hamburg.", "Ich komme aus Deutschland. Ich wohne in Hamburg."],
    ["A", "Your English is really good!", "Dein Englisch ist richtig gut!"],
    ["B", "Thank you, but I only speak a little English.", "Danke, aber ich spreche nur ein bisschen Englisch."],
    ["A", "Don't worry, I understand you perfectly.", "Keine Sorge, ich verstehe dich bestens."],
    ["B", "Nice to meet you too, Sarah.", "Freut mich auch, Sarah."]
  ]},
  text: { title: "This is Mark",
    en: "This is Mark. Mark is from Scotland, but he lives in Bristol now. He is forty years old and works in a hospital. Mark speaks English, French and a little German. At the weekend he likes to go hiking.",
    de: "Das ist Mark. Mark kommt aus Schottland, wohnt aber jetzt in Bristol. Er ist vierzig Jahre alt und arbeitet in einem Krankenhaus. Mark spricht Englisch, Französisch und ein bisschen Deutsch. Am Wochenende wandert er gern.",
    questions: [
      ["Where does Mark live now?", ["In Bristol", "In Scotland", "In London"]],
      ["Where does Mark work?", ["In a hospital", "In a school", "In a bank"]],
      ["What does he like to do at the weekend?", ["Go hiking", "Go swimming", "Cook"]]
    ]}
},
{
  id: "numbers", track: "a1", icon: "🕒", title: "Zahlen, Uhrzeit und Preise", en: "Numbers, time and prices",
  tip: "Vorsicht: „half three“ (kurz für „half past three“) ist 3:30, also halb vier. Wer an „halb drei“ denkt, kommt eine Stunde zu spät.",
  phrases: [
    ["One, two, three, four, five.", "Eins, zwei, drei, vier, fünf."],
    ["Six, seven, eight, nine, ten.", "Sechs, sieben, acht, neun, zehn."],
    ["What time is it?", "Wie spät ist es?"],
    ["It's three o'clock.", "Es ist drei Uhr."],
    ["It's half past three.", "Es ist halb vier."],
    ["It's quarter past two.", "Es ist Viertel nach zwei."],
    ["How much is this?", "Wie viel kostet das?"],
    ["That's five pounds, please.", "Das macht fünf Pfund, bitte."],
    ["Today is Monday.", "Heute ist Montag."],
    ["My birthday is in May.", "Ich habe im Mai Geburtstag."]
  ],
  dialog: { title: "Am Marktstand", roles: ["Verkäufer", "Du"], lines: [
    ["B", "Excuse me, how much are the apples?", "Entschuldigung, was kosten die Äpfel?"],
    ["A", "Two pounds a kilo.", "Zwei Pfund das Kilo."],
    ["B", "I'd like one kilo, please.", "Ich hätte gern ein Kilo, bitte."],
    ["A", "Here you are. Anything else?", "Bitte schön. Sonst noch etwas?"],
    ["B", "No, thanks. What time do you close today?", "Nein, danke. Wann machen Sie heute zu?"],
    ["A", "At five o'clock. That's two pounds, please.", "Um fünf Uhr. Das macht zwei Pfund, bitte."],
    ["B", "Here you go. Thank you!", "Bitte sehr. Danke!"]
  ]},
  text: { title: "A busy Saturday",
    en: "On Saturday Lucy gets up at eight o'clock. At nine she goes to the market. She buys bread, cheese and some flowers. Everything costs twelve pounds. At half past twelve she has lunch with her brother.",
    de: "Am Samstag steht Lucy um acht Uhr auf. Um neun geht sie zum Markt. Sie kauft Brot, Käse und ein paar Blumen. Alles kostet zwölf Pfund. Um halb eins isst sie mit ihrem Bruder zu Mittag.",
    questions: [
      ["When does Lucy get up?", ["At eight o'clock", "At nine o'clock", "At seven o'clock"]],
      ["How much does everything cost?", ["Twelve pounds", "Twenty pounds", "Two pounds"]],
      ["Who does she have lunch with?", ["Her brother", "Her mother", "Her friend"]]
    ]}
},
{
  id: "cafe", track: "a1", icon: "☕", title: "Im Café und im Pub", en: "At the café and the pub",
  tip: "„I become a coffee“ heißt „Ich verwandle mich in einen Kaffee“. Bestellen geht mit „Can I have …?“ oder „I'd like …“.",
  phrases: [
    ["Can I have a coffee, please?", "Kann ich einen Kaffee haben, bitte?"],
    ["I'd like a cup of tea with milk.", "Ich hätte gern eine Tasse Tee mit Milch."],
    ["A pint of lager, please.", "Ein großes Helles, bitte."],
    ["Is this table free?", "Ist dieser Tisch frei?"],
    ["Could I see the menu, please?", "Könnte ich bitte die Karte sehen?"],
    ["For here or to take away?", "Zum Hiertrinken oder zum Mitnehmen?"],
    ["Can I pay by card?", "Kann ich mit Karte zahlen?"],
    ["The bill, please.", "Die Rechnung, bitte."],
    ["That was delicious.", "Das war sehr lecker."],
    ["Keep the change.", "Stimmt so."]
  ],
  dialog: { title: "Im Café an der Ecke", roles: ["Bedienung", "Du"], lines: [
    ["A", "Hi there, what can I get you?", "Hallo, was darf es sein?"],
    ["B", "Can I have a large cappuccino, please?", "Kann ich einen großen Cappuccino haben, bitte?"],
    ["A", "Sure. For here or to take away?", "Klar. Zum Hiertrinken oder zum Mitnehmen?"],
    ["B", "For here, please. And a piece of carrot cake.", "Zum Hiertrinken, bitte. Und ein Stück Karottenkuchen."],
    ["A", "Good choice. That's six pounds fifty.", "Gute Wahl. Das macht sechs Pfund fünfzig."],
    ["B", "Can I pay by card?", "Kann ich mit Karte zahlen?"],
    ["A", "Of course. Just tap here.", "Natürlich. Einfach hier dranhalten."]
  ]},
  text: { title: "The local pub",
    en: "In Britain the pub is more than a bar. People meet there after work, watch football or have Sunday lunch. You usually order at the bar and pay straight away. In many pubs you can also bring your dog.",
    de: "In Großbritannien ist der Pub mehr als eine Bar. Man trifft sich dort nach der Arbeit, schaut Fußball oder isst Sonntagsessen. Man bestellt meistens an der Theke und zahlt sofort. In vielen Pubs darf man auch seinen Hund mitbringen.",
    questions: [
      ["Where do you usually order in a pub?", ["At the bar", "At the table", "Online"]],
      ["When do you pay?", ["Straight away", "When you leave", "At the end of the month"]],
      ["What can you often bring to the pub?", ["Your dog", "Your own food", "Your own beer"]]
    ]}
},
{
  id: "shopping", track: "a1", icon: "🛍️", title: "Einkaufen", en: "Shopping",
  tip: "Ein „Handy“ heißt „mobile phone“ (britisch) oder „cell phone“ (amerikanisch). „Handy“ ist im Englischen ein Adjektiv: praktisch.",
  phrases: [
    ["I'm just looking, thanks.", "Ich schaue nur, danke."],
    ["Do you have this in a smaller size?", "Haben Sie das in einer kleineren Größe?"],
    ["Can I try it on?", "Kann ich es anprobieren?"],
    ["Where are the changing rooms?", "Wo sind die Umkleiden?"],
    ["It's too expensive.", "Das ist zu teuer."],
    ["I'll take it.", "Ich nehme es."],
    ["Do you need a bag?", "Brauchen Sie eine Tüte?"],
    ["Where can I find the milk?", "Wo finde ich die Milch?"],
    ["Is there a discount?", "Gibt es einen Rabatt?"],
    ["Can I return it if it doesn't fit?", "Kann ich es zurückgeben, wenn es nicht passt?"]
  ],
  dialog: { title: "Im Kleidergeschäft", roles: ["Verkäuferin", "Du"], lines: [
    ["A", "Hello, can I help you?", "Hallo, kann ich Ihnen helfen?"],
    ["B", "Yes, please. Do you have this jumper in a medium?", "Ja, bitte. Haben Sie diesen Pullover in M?"],
    ["A", "Let me check. Yes, here you are.", "Ich schaue mal. Ja, bitte schön."],
    ["B", "Thanks. Can I try it on?", "Danke. Kann ich ihn anprobieren?"],
    ["A", "Of course. The changing rooms are over there.", "Natürlich. Die Umkleiden sind dort drüben."],
    ["B", "It fits perfectly. I'll take it.", "Er passt perfekt. Ich nehme ihn."],
    ["A", "Great. Do you need a bag?", "Prima. Brauchen Sie eine Tüte?"],
    ["B", "No, thanks. I have one.", "Nein, danke. Ich habe eine."]
  ]},
  text: { title: "Shopping on the high street",
    en: "Every British town has a high street with shops, cafés and banks. Many shops are open on Sundays, but often only for six hours. Big supermarkets are usually outside the town centre. A lot of people now shop online.",
    de: "Jede britische Stadt hat eine Hauptstraße mit Läden, Cafés und Banken. Viele Geschäfte haben sonntags geöffnet, aber oft nur sechs Stunden. Große Supermärkte liegen meist außerhalb der Innenstadt. Viele Leute kaufen heute online ein.",
    questions: [
      ["What is a high street?", ["The main shopping street", "A motorway", "A tall building"]],
      ["How long are many shops open on Sundays?", ["Six hours", "All day", "They are closed"]],
      ["Where are big supermarkets usually?", ["Outside the town centre", "On the high street", "Next to the station"]]
    ]}
},
{
  id: "directions", track: "a1", icon: "🧭", title: "Nach dem Weg fragen", en: "Asking for directions",
  tip: "Höflich anfangen mit „Excuse me“. „Sorry“ benutzt man eher, wenn man jemanden angerempelt hat oder etwas nicht verstanden hat.",
  phrases: [
    ["Excuse me, where is the station?", "Entschuldigung, wo ist der Bahnhof?"],
    ["Is it far from here?", "Ist es weit von hier?"],
    ["Go straight on.", "Gehen Sie geradeaus."],
    ["Turn left at the traffic lights.", "Biegen Sie an der Ampel links ab."],
    ["Take the second road on the right.", "Nehmen Sie die zweite Straße rechts."],
    ["It's next to the bank.", "Es ist neben der Bank."],
    ["It's opposite the church.", "Es ist gegenüber der Kirche."],
    ["It's about ten minutes on foot.", "Es sind etwa zehn Minuten zu Fuß."],
    ["Which bus goes to the city centre?", "Welcher Bus fährt ins Stadtzentrum?"],
    ["I think I'm lost.", "Ich glaube, ich habe mich verlaufen."]
  ],
  dialog: { title: "Auf der Straße", roles: ["Passant", "Du"], lines: [
    ["B", "Excuse me, can you help me? I'm looking for the museum.", "Entschuldigung, können Sie mir helfen? Ich suche das Museum."],
    ["A", "Sure. Go straight on and turn left at the traffic lights.", "Klar. Gehen Sie geradeaus und an der Ampel links."],
    ["B", "Left at the traffic lights. Is it far?", "An der Ampel links. Ist es weit?"],
    ["A", "No, it's about five minutes on foot. It's opposite the park.", "Nein, etwa fünf Minuten zu Fuß. Es ist gegenüber vom Park."],
    ["B", "Great, thank you so much!", "Super, vielen Dank!"],
    ["A", "No problem. Enjoy the museum!", "Kein Problem. Viel Spaß im Museum!"]
  ]},
  text: { title: "The Tube",
    en: "The London Underground is called the Tube. It is the oldest underground railway in the world. There are eleven lines, and each line has its own colour. You can pay with a bank card or an Oyster card. Remember to stand on the right on the escalators.",
    de: "Die Londoner U-Bahn heißt Tube. Sie ist die älteste U-Bahn der Welt. Es gibt elf Linien, und jede Linie hat ihre eigene Farbe. Man kann mit Bankkarte oder Oyster-Karte zahlen. Auf den Rolltreppen steht man rechts.",
    questions: [
      ["What is the Tube?", ["The London Underground", "A bus", "A river"]],
      ["How many lines are there?", ["Eleven", "Seven", "Twenty"]],
      ["Where do you stand on the escalators?", ["On the right", "On the left", "In the middle"]]
    ]}
},
{
  id: "family", track: "a1", icon: "👨‍👩‍👧", title: "Familie und Freunde", en: "Family and friends",
  tip: "„Who“ fragt nach dem Subjekt ohne „do“: „Who lives here?“, nicht „Who does live here?“.",
  phrases: [
    ["I have two children.", "Ich habe zwei Kinder."],
    ["My daughter is twelve years old.", "Meine Tochter ist zwölf Jahre alt."],
    ["My son lives in Berlin.", "Mein Sohn wohnt in Berlin."],
    ["Are you married?", "Bist du verheiratet?"],
    ["This is my wife.", "Das ist meine Frau."],
    ["My parents live in the countryside.", "Meine Eltern wohnen auf dem Land."],
    ["I have an older brother and a younger sister.", "Ich habe einen älteren Bruder und eine jüngere Schwester."],
    ["We often visit my grandparents.", "Wir besuchen oft meine Großeltern."],
    ["He's my best friend.", "Er ist mein bester Freund."],
    ["Do you have any brothers or sisters?", "Hast du Geschwister?"]
  ],
  dialog: { title: "Fotos zeigen", roles: ["Kollegin Kate", "Du"], lines: [
    ["A", "Is that a photo of your family?", "Ist das ein Foto von deiner Familie?"],
    ["B", "Yes, this is my wife and these are our two children.", "Ja, das ist meine Frau und das sind unsere zwei Kinder."],
    ["A", "They're lovely! How old are they?", "Die sind süß! Wie alt sind sie?"],
    ["B", "My daughter is twelve and my son is nine.", "Meine Tochter ist zwölf und mein Sohn ist neun."],
    ["A", "Do you have any brothers or sisters?", "Hast du Geschwister?"],
    ["B", "Yes, an older brother. He lives in Canada.", "Ja, einen älteren Bruder. Er wohnt in Kanada."]
  ]},
  text: { title: "Sunday lunch",
    en: "Every Sunday the Taylor family has lunch together. Grandma cooks roast beef with potatoes and vegetables. Her son brings the dessert, and the grandchildren lay the table. After lunch they all go for a walk.",
    de: "Jeden Sonntag isst Familie Taylor gemeinsam zu Mittag. Oma kocht Roastbeef mit Kartoffeln und Gemüse. Ihr Sohn bringt den Nachtisch mit, und die Enkel decken den Tisch. Nach dem Essen gehen alle spazieren.",
    questions: [
      ["Who cooks the lunch?", ["Grandma", "The son", "The grandchildren"]],
      ["What does the son bring?", ["The dessert", "The wine", "The flowers"]],
      ["What do they do after lunch?", ["They go for a walk", "They watch TV", "They sleep"]]
    ]}
},
{
  id: "day", track: "a1", icon: "🌞", title: "Mein Tag", en: "My day",
  tip: "Bei he, she, it kommt im Präsens ein -s ans Verb: „She works“, „He gets up“. Das vergessen fast alle.",
  phrases: [
    ["I get up at seven o'clock.", "Ich stehe um sieben Uhr auf."],
    ["I have breakfast at home.", "Ich frühstücke zu Hause."],
    ["I go to work by bike.", "Ich fahre mit dem Rad zur Arbeit."],
    ["She works from home on Fridays.", "Freitags arbeitet sie von zu Hause."],
    ["I have lunch at one.", "Ich esse um eins zu Mittag."],
    ["I finish work at five.", "Ich habe um fünf Feierabend."],
    ["In the evening I cook dinner.", "Abends koche ich."],
    ["I usually go to bed at eleven.", "Normalerweise gehe ich um elf ins Bett."],
    ["What do you do in your free time?", "Was machst du in deiner Freizeit?"],
    ["I like reading and going for walks.", "Ich lese gern und gehe gern spazieren."]
  ],
  dialog: { title: "In der Kaffeeküche", roles: ["Kollege Ben", "Du"], lines: [
    ["A", "You look tired. What time did you get up?", "Du siehst müde aus. Wann bist du aufgestanden?"],
    ["B", "At six. I always get up early.", "Um sechs. Ich stehe immer früh auf."],
    ["A", "Wow. How do you get to work?", "Wow. Wie kommst du zur Arbeit?"],
    ["B", "I usually go by bike. It takes twenty minutes.", "Meistens mit dem Rad. Das dauert zwanzig Minuten."],
    ["A", "And what do you do in the evening?", "Und was machst du abends?"],
    ["B", "I cook dinner and then I read a book.", "Ich koche und dann lese ich ein Buch."]
  ]},
  text: { title: "Anna's week",
    en: "Anna is a nurse. She works three days a week at the hospital and two days at home. On Mondays she goes swimming before work. On Wednesdays she meets her friends for dinner. At the weekend she sleeps late.",
    de: "Anna ist Krankenpflegerin. Sie arbeitet drei Tage pro Woche im Krankenhaus und zwei Tage zu Hause. Montags geht sie vor der Arbeit schwimmen. Mittwochs trifft sie Freunde zum Abendessen. Am Wochenende schläft sie lange.",
    questions: [
      ["What is Anna's job?", ["She is a nurse", "She is a teacher", "She is a cook"]],
      ["What does she do on Mondays?", ["She goes swimming", "She meets friends", "She sleeps late"]],
      ["When does she sleep late?", ["At the weekend", "On Wednesdays", "Every day"]]
    ]}
},
{
  id: "weather", track: "a1", icon: "🌦️", title: "Wetter und Small Talk", en: "Weather and small talk",
  tip: "Über das Wetter reden ist in England ein Ritual. Einfach zustimmen und eine Frage zurückgeben, dann läuft das Gespräch.",
  phrases: [
    ["Lovely day, isn't it?", "Schöner Tag, oder?"],
    ["It's raining again.", "Es regnet schon wieder."],
    ["It's quite cold today.", "Es ist ziemlich kalt heute."],
    ["The sun is shining.", "Die Sonne scheint."],
    ["It's going to rain later.", "Es wird später regnen."],
    ["Did you have a nice weekend?", "Hattest du ein schönes Wochenende?"],
    ["Yes, it was great, thanks.", "Ja, es war toll, danke."],
    ["Have you got any plans for the holidays?", "Hast du Pläne für die Ferien?"],
    ["How was your trip?", "Wie war deine Reise?"],
    ["What a pity!", "Wie schade!"]
  ],
  dialog: { title: "An der Bushaltestelle", roles: ["Fremde", "Du"], lines: [
    ["A", "Terrible weather today, isn't it?", "Furchtbares Wetter heute, oder?"],
    ["B", "Yes, it's been raining all morning.", "Ja, es regnet schon den ganzen Morgen."],
    ["A", "They say it's going to be sunny tomorrow.", "Es soll morgen sonnig werden."],
    ["B", "That would be nice. Are you going somewhere?", "Das wäre schön. Fahren Sie irgendwohin?"],
    ["A", "Just into town for some shopping. And you?", "Nur in die Stadt zum Einkaufen. Und Sie?"],
    ["B", "I'm meeting a friend for lunch. Oh, here's the bus!", "Ich treffe eine Freundin zum Mittagessen. Oh, da kommt der Bus!"]
  ]},
  text: { title: "British weather",
    en: "People say the British talk about the weather all the time. That is true, because it changes very quickly. In the morning it can be sunny and in the afternoon it can rain. That is why many people always carry an umbrella.",
    de: "Man sagt, die Briten reden ständig über das Wetter. Das stimmt, denn es ändert sich sehr schnell. Morgens kann die Sonne scheinen und nachmittags kann es regnen. Deshalb haben viele Leute immer einen Regenschirm dabei.",
    questions: [
      ["Why do the British talk about the weather?", ["It changes very quickly", "It is always hot", "It never rains"]],
      ["What can happen in the afternoon?", ["It can rain", "It can snow every day", "Nothing"]],
      ["What do many people always carry?", ["An umbrella", "Sunglasses", "A coat"]]
    ]}
},
{
  id: "travel", track: "a1", icon: "🚆", title: "Unterwegs: Hotel, Bahn, Flughafen", en: "Travelling",
  tip: "„I have a reservation“ ist gut, „I have reserved“ klingt deutsch. Und „single“ ist eine einfache Fahrt, „return“ hin und zurück.",
  phrases: [
    ["I have a reservation in the name of Becker.", "Ich habe eine Reservierung auf den Namen Becker."],
    ["What time is breakfast?", "Wann gibt es Frühstück?"],
    ["Could I have a wake-up call at seven?", "Könnte ich um sieben geweckt werden?"],
    ["A return ticket to Oxford, please.", "Eine Rückfahrkarte nach Oxford, bitte."],
    ["Which platform does the train leave from?", "Von welchem Gleis fährt der Zug?"],
    ["Is this seat taken?", "Ist dieser Platz besetzt?"],
    ["The train is delayed.", "Der Zug hat Verspätung."],
    ["Where is the check-in desk?", "Wo ist der Check-in-Schalter?"],
    ["I'd like a window seat, please.", "Ich hätte gern einen Fensterplatz, bitte."],
    ["My suitcase hasn't arrived.", "Mein Koffer ist nicht angekommen."]
  ],
  dialog: { title: "An der Hotelrezeption", roles: ["Rezeption", "Du"], lines: [
    ["A", "Good evening, welcome to the Grand Hotel.", "Guten Abend, willkommen im Grand Hotel."],
    ["B", "Good evening. I have a reservation in the name of Becker.", "Guten Abend. Ich habe eine Reservierung auf den Namen Becker."],
    ["A", "Yes, a double room for three nights. Could I see your passport?", "Ja, ein Doppelzimmer für drei Nächte. Darf ich Ihren Pass sehen?"],
    ["B", "Here you are. What time is breakfast?", "Bitte schön. Wann gibt es Frühstück?"],
    ["A", "From seven to ten in the restaurant.", "Von sieben bis zehn im Restaurant."],
    ["B", "And is there Wi-Fi in the room?", "Und gibt es WLAN im Zimmer?"],
    ["A", "Yes, the password is on your key card. Enjoy your stay!", "Ja, das Passwort steht auf Ihrer Schlüsselkarte. Angenehmen Aufenthalt!"]
  ]},
  text: { title: "A trip to Edinburgh",
    en: "Last summer Paul took the train from London to Edinburgh. The journey took four and a half hours. He stayed in a small hotel near the castle. Every day he walked through the old town, and in the evening he listened to music in a pub.",
    de: "Letzten Sommer fuhr Paul mit dem Zug von London nach Edinburgh. Die Fahrt dauerte viereinhalb Stunden. Er wohnte in einem kleinen Hotel nahe der Burg. Jeden Tag lief er durch die Altstadt, und abends hörte er in einem Pub Musik.",
    questions: [
      ["How did Paul travel to Edinburgh?", ["By train", "By plane", "By car"]],
      ["Where was his hotel?", ["Near the castle", "At the airport", "By the sea"]],
      ["What did he do in the evening?", ["He listened to music in a pub", "He went to the cinema", "He went to bed early"]]
    ]}
},
{
  id: "sounds", track: "a1", icon: "👅", title: "Aussprache: th, w und v", en: "Pronunciation",
  tip: "Für „th“ die Zungenspitze leicht zwischen die Zähne legen. „w“ mit runden Lippen wie ein kurzes „u“, „v“ mit Oberzähnen auf der Unterlippe wie im Deutschen.",
  phrases: [
    ["I think it's Thursday.", "Ich glaube, es ist Donnerstag."],
    ["Thank you for everything.", "Danke für alles."],
    ["This is the third time.", "Das ist das dritte Mal."],
    ["My mother and father are together.", "Meine Mutter und mein Vater sind zusammen."],
    ["We went to the west coast.", "Wir sind an die Westküste gefahren."],
    ["What would you like to drink?", "Was möchtest du trinken?"],
    ["The view is very beautiful.", "Die Aussicht ist sehr schön."],
    ["We have a very good wine.", "Wir haben einen sehr guten Wein."],
    ["Three thousand thirsty thinkers.", "Dreitausend durstige Denker."],
    ["Where were we?", "Wo waren wir stehengeblieben?"]
  ],
  dialog: { title: "Weinabend", roles: ["Gastgeber Will", "Du"], lines: [
    ["A", "Welcome! What would you like to drink?", "Willkommen! Was möchtest du trinken?"],
    ["B", "I think I'd like a glass of white wine.", "Ich glaube, ich hätte gern ein Glas Weißwein."],
    ["A", "Very good choice. It's from the west of France.", "Sehr gute Wahl. Er ist aus Westfrankreich."],
    ["B", "Thank you. The view from your window is wonderful.", "Danke. Die Aussicht aus deinem Fenster ist wunderbar."],
    ["A", "Thanks! We moved here three weeks ago.", "Danke! Wir sind vor drei Wochen hergezogen."],
    ["B", "Well, I think it's worth it!", "Also, ich finde, das lohnt sich!"]
  ]},
  text: { title: "Tongue twisters",
    en: "Tongue twisters are fun and they help with pronunciation. Try this one: Which witch wished which wicked wish? Or this one: The thirty-three thieves thought that they thrilled the throne throughout Thursday. Start slowly and then speak faster.",
    de: "Zungenbrecher machen Spaß und helfen bei der Aussprache. Probier diesen: Welche Hexe wünschte welchen bösen Wunsch? Oder diesen: Die dreiunddreißig Diebe dachten, sie hätten den Thron den ganzen Donnerstag begeistert. Fang langsam an und sprich dann schneller.",
    questions: [
      ["Why are tongue twisters useful?", ["They help with pronunciation", "They teach grammar", "They are short"]],
      ["How many thieves are there?", ["Thirty-three", "Thirteen", "Three"]],
      ["How should you start?", ["Slowly", "Very fast", "Loudly"]]
    ]}
},
{
  id: "phone", track: "b1", icon: "📞", title: "Telefonieren und Termine", en: "Phone calls and appointments",
  tip: "Am Telefon sagt man „This is Thomas speaking“ oder „It's Thomas“, nicht „Here is Thomas“.",
  phrases: [
    ["Hello, this is Thomas Becker speaking.", "Hallo, hier spricht Thomas Becker."],
    ["Could I speak to Mrs Jones, please?", "Könnte ich bitte mit Frau Jones sprechen?"],
    ["I'm afraid she's in a meeting at the moment.", "Leider ist sie gerade in einer Besprechung."],
    ["Can I leave a message?", "Kann ich eine Nachricht hinterlassen?"],
    ["I'd like to make an appointment.", "Ich möchte einen Termin vereinbaren."],
    ["Would Tuesday afternoon suit you?", "Würde Ihnen Dienstagnachmittag passen?"],
    ["I'm afraid I can't make it on Tuesday.", "Dienstag schaffe ich leider nicht."],
    ["Could we move it to Thursday?", "Könnten wir es auf Donnerstag verschieben?"],
    ["Let me just check my diary.", "Ich schaue kurz in meinen Kalender."],
    ["I'll send you a confirmation by email.", "Ich schicke Ihnen eine Bestätigung per E-Mail."]
  ],
  dialog: { title: "Termin beim Steuerberater", roles: ["Sekretariat", "Du"], lines: [
    ["A", "Good morning, Miller and Partners. How can I help you?", "Guten Morgen, Miller und Partner. Wie kann ich Ihnen helfen?"],
    ["B", "Good morning, this is Thomas Becker. I'd like to make an appointment with Mr Miller.", "Guten Morgen, hier ist Thomas Becker. Ich möchte einen Termin bei Herrn Miller."],
    ["A", "Certainly. Would next Tuesday at ten suit you?", "Gern. Würde Ihnen nächsten Dienstag um zehn passen?"],
    ["B", "I'm afraid I can't make it on Tuesday. Is Thursday possible?", "Dienstag schaffe ich leider nicht. Geht Donnerstag?"],
    ["A", "Let me check. Thursday at two would work.", "Ich schaue mal. Donnerstag um zwei ginge."],
    ["B", "Perfect, Thursday at two then.", "Perfekt, dann Donnerstag um zwei."],
    ["A", "Lovely. I'll send you a confirmation by email.", "Wunderbar. Ich schicke Ihnen eine Bestätigung per E-Mail."]
  ]},
  text: { title: "Phone manners",
    en: "In English phone calls, people are often very polite and a little indirect. Instead of saying no, they say I'm afraid that won't be possible. Small talk at the beginning is normal, even in business. At the end people often repeat the most important details to avoid misunderstandings.",
    de: "Bei englischen Telefonaten sind die Leute oft sehr höflich und etwas indirekt. Statt nein zu sagen, sagen sie: Ich fürchte, das wird nicht möglich sein. Small Talk am Anfang ist normal, sogar geschäftlich. Am Ende wiederholt man oft die wichtigsten Details, um Missverständnisse zu vermeiden.",
    questions: [
      ["How do English speakers often say no?", ["Indirectly and politely", "Very directly", "They never say no"]],
      ["What is normal at the beginning of a call?", ["Small talk", "Silence", "Giving your address"]],
      ["Why do people repeat details at the end?", ["To avoid misunderstandings", "To be funny", "Because the line is bad"]]
    ]},
  speak: [
    ["You need to cancel a meeting. Call and suggest a new date.", "Du musst ein Treffen absagen. Ruf an und schlag einen neuen Termin vor.", "Hello, this is Thomas Becker. I'm afraid I can't make our meeting on Friday because something urgent has come up. Could we move it to next Monday or Tuesday? Please let me know what suits you best."],
    ["Leave a voicemail for a colleague.", "Hinterlasse einer Kollegin eine Sprachnachricht.", "Hi Kate, it's Thomas. I'm just calling about the report for tomorrow. I've sent you the latest version by email. Could you have a quick look and call me back when you have a minute? Thanks a lot."]
  ]
},
{
  id: "work", track: "b1", icon: "💼", title: "Über die Arbeit sprechen", en: "Talking about work",
  tip: "„I work here since five years“ ist falsch. Richtig: „I've been working here for five years“ (Dauer bis heute = present perfect).",
  phrases: [
    ["What do you do for a living?", "Was machst du beruflich?"],
    ["I work as a lawyer for an international firm.", "Ich arbeite als Anwalt für eine internationale Kanzlei."],
    ["I've been working here for five years.", "Ich arbeite seit fünf Jahren hier."],
    ["I'm responsible for tax issues.", "Ich bin für Steuerfragen zuständig."],
    ["I spend a lot of time in meetings.", "Ich verbringe viel Zeit in Besprechungen."],
    ["The best thing about my job is the variety.", "Das Beste an meinem Job ist die Abwechslung."],
    ["Sometimes the workload is quite heavy.", "Manchmal ist die Arbeitsbelastung ziemlich hoch."],
    ["We work closely with colleagues abroad.", "Wir arbeiten eng mit Kollegen im Ausland zusammen."],
    ["I'm thinking about changing jobs.", "Ich überlege, den Job zu wechseln."],
    ["What are your strengths?", "Was sind Ihre Stärken?"]
  ],
  dialog: { title: "Vorstellungsgespräch", roles: ["Personalerin", "Du"], lines: [
    ["A", "Thanks for coming in. Could you tell me a bit about yourself?", "Danke, dass Sie gekommen sind. Erzählen Sie etwas über sich?"],
    ["B", "Of course. I've been working as a tax advisor for eight years.", "Gern. Ich arbeite seit acht Jahren als Steuerberater."],
    ["A", "And what are you responsible for in your current role?", "Und wofür sind Sie in Ihrer jetzigen Stelle zuständig?"],
    ["B", "Mainly international clients and cross-border questions.", "Hauptsächlich internationale Mandanten und grenzüberschreitende Fragen."],
    ["A", "Why do you want to leave?", "Warum möchten Sie wechseln?"],
    ["B", "I'm looking for a new challenge and I'd like to work in an international team.", "Ich suche eine neue Herausforderung und möchte in einem internationalen Team arbeiten."],
    ["A", "That sounds great. Do you have any questions for us?", "Klingt gut. Haben Sie Fragen an uns?"],
    ["B", "Yes. What does a typical day look like here?", "Ja. Wie sieht hier ein typischer Tag aus?"]
  ]},
  text: { title: "Working from home",
    en: "Since the pandemic many companies have allowed their staff to work from home two or three days a week. Most employees appreciate the flexibility and save time on commuting. However, some managers worry that teamwork suffers. As a result, many offices now have fixed team days when everyone comes in.",
    de: "Seit der Pandemie erlauben viele Firmen ihren Mitarbeitenden, zwei oder drei Tage pro Woche von zu Hause zu arbeiten. Die meisten schätzen die Flexibilität und sparen Pendelzeit. Manche Führungskräfte befürchten jedoch, dass die Teamarbeit leidet. Deshalb gibt es in vielen Büros jetzt feste Teamtage, an denen alle kommen.",
    questions: [
      ["What do most employees appreciate?", ["The flexibility", "The long commute", "The fixed hours"]],
      ["What do some managers worry about?", ["That teamwork suffers", "That people work too much", "That offices are too small"]],
      ["What do many offices have now?", ["Fixed team days", "No desks", "Free lunch"]]
    ]},
  speak: [
    ["Describe your job to someone you've just met.", "Beschreibe jemandem, den du gerade kennengelernt hast, deinen Job.", "I'm a lawyer and I specialise in international tax law. I advise companies that do business in several countries. It can be quite complex, but I really enjoy the variety and working with people from different cultures."],
    ["What would your dream job look like?", "Wie sähe dein Traumjob aus?", "My dream job would combine travelling and working with people. I'd like to have flexible hours and a team that I can rely on. Ideally I would work four days a week and spend the rest of my time with my family."]
  ]
},
{
  id: "past", track: "b1", icon: "🏝️", title: "Erzählen, was war", en: "Talking about the past",
  tip: "Mit Zeitangabe in der Vergangenheit (yesterday, last year, in 2019) steht das simple past: „I went“, nicht „I have gone“.",
  phrases: [
    ["Last summer we went to Cornwall.", "Letzten Sommer waren wir in Cornwall."],
    ["We stayed in a little cottage by the sea.", "Wir wohnten in einem kleinen Häuschen am Meer."],
    ["The weather was better than expected.", "Das Wetter war besser als erwartet."],
    ["Have you ever been to Ireland?", "Warst du schon mal in Irland?"],
    ["I've never tried surfing.", "Ich habe noch nie Surfen ausprobiert."],
    ["While we were walking, it started to rain.", "Während wir spazieren gingen, fing es an zu regnen."],
    ["I used to play the piano as a child.", "Als Kind habe ich früher Klavier gespielt."],
    ["We had already eaten when they arrived.", "Wir hatten schon gegessen, als sie ankamen."],
    ["It was the best holiday I've ever had.", "Es war der beste Urlaub, den ich je hatte."],
    ["What did you do at the weekend?", "Was hast du am Wochenende gemacht?"]
  ],
  dialog: { title: "Nach dem Urlaub", roles: ["Kollegin Lisa", "Du"], lines: [
    ["A", "Welcome back! How was your holiday?", "Willkommen zurück! Wie war dein Urlaub?"],
    ["B", "Fantastic, thanks. We went to Cornwall for two weeks.", "Fantastisch, danke. Wir waren zwei Wochen in Cornwall."],
    ["A", "Oh, I've never been there. What did you do?", "Oh, da war ich noch nie. Was habt ihr gemacht?"],
    ["B", "We walked along the coast and I tried surfing for the first time.", "Wir sind an der Küste gewandert und ich habe zum ersten Mal Surfen probiert."],
    ["A", "Brave! Did you manage to stand up?", "Mutig! Hast du es geschafft aufzustehen?"],
    ["B", "Only once, but I fell into the water about fifty times.", "Nur einmal, aber ich bin etwa fünfzig Mal ins Wasser gefallen."],
    ["A", "That sounds like a great story!", "Das klingt nach einer tollen Geschichte!"]
  ]},
  text: { title: "A lucky mistake",
    en: "A few years ago Sarah booked a flight to Dublin, but she accidentally chose the wrong date. When she arrived at the airport, her flight had already left. She was furious at first. While she was waiting for the next flight, she started talking to a woman who was also travelling to Ireland. Today they are business partners.",
    de: "Vor ein paar Jahren buchte Sarah einen Flug nach Dublin, wählte aber aus Versehen das falsche Datum. Als sie am Flughafen ankam, war ihr Flug schon weg. Zuerst war sie wütend. Während sie auf den nächsten Flug wartete, kam sie mit einer Frau ins Gespräch, die auch nach Irland reiste. Heute sind die beiden Geschäftspartnerinnen.",
    questions: [
      ["What was Sarah's mistake?", ["She chose the wrong date", "She forgot her passport", "She went to the wrong airport"]],
      ["How did she feel at first?", ["Furious", "Happy", "Tired"]],
      ["What are the two women today?", ["Business partners", "Sisters", "Neighbours"]]
    ]},
  speak: [
    ["Tell a friend about your last holiday.", "Erzähl einer Freundin von deinem letzten Urlaub.", "Last year we went to Scotland for ten days. We rented a car and drove through the Highlands. The landscape was amazing, although it rained almost every day. The best moment was when we saw a group of deer right next to the road."],
    ["Describe a day that didn't go as planned.", "Beschreibe einen Tag, der anders lief als geplant.", "Once I had an important meeting in Munich, but my train was cancelled. I tried to rent a car, but there were none left. In the end I joined the meeting by video from a café at the station, and it actually went really well."]
  ]
},
{
  id: "opinion", track: "b1", icon: "💬", title: "Meinung sagen und diskutieren", en: "Giving your opinion",
  tip: "„I mean“ heißt nicht „ich meine (dass)“, sondern „also, sprich“. Für eine Meinung: „I think“, „In my opinion“ oder „I'd say“.",
  phrases: [
    ["In my opinion, that's a good idea.", "Meiner Meinung nach ist das eine gute Idee."],
    ["I see your point, but I'm not sure.", "Ich verstehe, was du meinst, aber ich bin nicht sicher."],
    ["I totally agree with you.", "Da stimme ich dir völlig zu."],
    ["I'm afraid I don't agree.", "Da bin ich leider anderer Meinung."],
    ["That's a fair point.", "Das ist ein berechtigter Einwand."],
    ["On the one hand it's cheaper, on the other hand it takes longer.", "Einerseits ist es billiger, andererseits dauert es länger."],
    ["What do you think about it?", "Was hältst du davon?"],
    ["It depends on the situation.", "Das kommt auf die Situation an."],
    ["Let me put it another way.", "Lass es mich anders sagen."],
    ["To be honest, I'm not convinced.", "Ehrlich gesagt bin ich nicht überzeugt."]
  ],
  dialog: { title: "Diskussion beim Abendessen", roles: ["Freund James", "Du"], lines: [
    ["A", "I think everyone should work only four days a week.", "Ich finde, alle sollten nur vier Tage die Woche arbeiten."],
    ["B", "I see your point, but would that work for every job?", "Ich verstehe dich, aber würde das bei jedem Job funktionieren?"],
    ["A", "Maybe not for hospitals, but for most office jobs.", "Vielleicht nicht im Krankenhaus, aber bei den meisten Bürojobs."],
    ["B", "That's a fair point. People would probably be more motivated.", "Berechtigt. Die Leute wären wahrscheinlich motivierter."],
    ["A", "Exactly. And they'd have more time for their families.", "Genau. Und sie hätten mehr Zeit für ihre Familien."],
    ["B", "On the other hand, some companies might lose money.", "Andererseits könnten manche Firmen Geld verlieren."],
    ["A", "True. I guess it depends on the company.", "Stimmt. Kommt wohl auf die Firma an."]
  ]},
  text: { title: "Cars in the city",
    en: "More and more European cities are trying to reduce car traffic in their centres. Supporters say this makes the air cleaner and the streets safer for children and cyclists. Critics argue that shops lose customers and that older people find it harder to get around. Most experts agree that good public transport is the key.",
    de: "Immer mehr europäische Städte versuchen, den Autoverkehr in ihren Zentren zu verringern. Befürworter sagen, das mache die Luft sauberer und die Straßen sicherer für Kinder und Radfahrer. Kritiker wenden ein, dass Läden Kundschaft verlieren und ältere Menschen schwerer vorankommen. Die meisten Fachleute sind sich einig, dass guter Nahverkehr der Schlüssel ist.",
    questions: [
      ["What are many cities trying to do?", ["Reduce car traffic", "Build more roads", "Close all shops"]],
      ["What do critics say?", ["Shops lose customers", "The air gets worse", "Children are less safe"]],
      ["What do most experts see as the key?", ["Good public transport", "Cheaper petrol", "More parking"]]
    ]},
  speak: [
    ["Should mobile phones be banned in schools? Give your opinion.", "Sollten Handys an Schulen verboten sein? Sag deine Meinung.", "In my opinion, phones should not be allowed during lessons, because they distract students. On the other hand, they can be useful for research. So I'd say a clear rule is better than a total ban."],
    ["Is it better to live in the city or in the countryside?", "Lebt man besser in der Stadt oder auf dem Land?", "It depends on your stage of life. When you're young, the city offers more jobs, culture and nightlife. But with children, I think the countryside is great because there's more space and nature. Personally, I'd like to live near a city but not in the centre."]
  ]
},
{
  id: "doctor", track: "b1", icon: "🩺", title: "Beim Arzt", en: "At the doctor's",
  tip: "„I have a cold“ = Ich bin erkältet. „I'm cold“ = Mir ist kalt. Und „become“ heißt werden, nicht bekommen.",
  phrases: [
    ["I haven't been feeling well for a few days.", "Ich fühle mich seit ein paar Tagen nicht gut."],
    ["I've got a headache and a sore throat.", "Ich habe Kopfschmerzen und Halsschmerzen."],
    ["I think I've got a temperature.", "Ich glaube, ich habe Fieber."],
    ["It hurts when I swallow.", "Es tut weh, wenn ich schlucke."],
    ["How long have you had these symptoms?", "Wie lange haben Sie diese Beschwerden schon?"],
    ["Are you allergic to anything?", "Sind Sie gegen etwas allergisch?"],
    ["Take two tablets three times a day.", "Nehmen Sie dreimal täglich zwei Tabletten."],
    ["You should stay in bed for a couple of days.", "Sie sollten ein paar Tage im Bett bleiben."],
    ["Do I need a prescription for this?", "Brauche ich dafür ein Rezept?"],
    ["Get well soon!", "Gute Besserung!"]
  ],
  dialog: { title: "In der Praxis", roles: ["Ärztin", "Du"], lines: [
    ["A", "Good morning. What seems to be the problem?", "Guten Morgen. Was fehlt Ihnen denn?"],
    ["B", "I haven't been feeling well for three days.", "Ich fühle mich seit drei Tagen nicht gut."],
    ["A", "What kind of symptoms do you have?", "Was für Beschwerden haben Sie?"],
    ["B", "I've got a headache, a sore throat and a slight temperature.", "Ich habe Kopfschmerzen, Halsschmerzen und leichtes Fieber."],
    ["A", "It sounds like a virus. You should rest and drink plenty of water.", "Klingt nach einem Virus. Sie sollten sich ausruhen und viel trinken."],
    ["B", "Do I need any medicine?", "Brauche ich Medikamente?"],
    ["A", "Paracetamol is fine, up to four times a day. Get well soon!", "Paracetamol ist in Ordnung, bis zu viermal am Tag. Gute Besserung!"]
  ]},
  text: { title: "The NHS",
    en: "In Britain most medical care is provided by the National Health Service, or NHS. It was founded in 1948 and is paid for through taxes. Patients first register with a GP, a general practitioner. If necessary, the GP refers them to a specialist. Waiting times can be long, but treatment is free at the point of use.",
    de: "In Großbritannien wird die meiste medizinische Versorgung vom National Health Service, kurz NHS, geleistet. Er wurde 1948 gegründet und wird über Steuern finanziert. Patienten melden sich zuerst bei einem Hausarzt an. Wenn nötig, überweist dieser an einen Facharzt. Die Wartezeiten können lang sein, aber die Behandlung ist bei Inanspruchnahme kostenlos.",
    questions: [
      ["How is the NHS paid for?", ["Through taxes", "By private insurance", "By the patients"]],
      ["Who do patients see first?", ["A GP", "A specialist", "A pharmacist"]],
      ["What can be a problem?", ["Long waiting times", "High prices", "No doctors at all"]]
    ]},
  speak: [
    ["Call the surgery and describe your symptoms.", "Ruf in der Praxis an und beschreib deine Beschwerden.", "Hello, I'd like to see a doctor today if possible. I've had a bad cough and a temperature since Monday, and now my chest hurts when I breathe. Is there an appointment available this afternoon?"],
    ["Call in sick at work.", "Melde dich bei der Arbeit krank.", "Hi, it's Thomas. I'm afraid I won't be able to come in today. I've got a temperature and I'm going to see the doctor this morning. I'll keep you updated, and I can answer urgent emails from home."]
  ]
},
{
  id: "meetings", track: "b1", icon: "🗂️", title: "Meetings und E-Mails im Beruf", en: "Meetings and emails",
  tip: "„Can we make a meeting?“ klingt deutsch. Besser: „Can we arrange a meeting?“ oder „Shall we set up a call?“.",
  phrases: [
    ["Shall we get started?", "Wollen wir anfangen?"],
    ["The aim of today's meeting is to agree on a budget.", "Ziel des heutigen Treffens ist, uns auf ein Budget zu einigen."],
    ["Could you walk us through the figures?", "Könnten Sie uns durch die Zahlen führen?"],
    ["Sorry to interrupt, but could I add something?", "Entschuldigung, darf ich kurz etwas ergänzen?"],
    ["Let's come back to that later.", "Lass uns später darauf zurückkommen."],
    ["Who will take care of that?", "Wer kümmert sich darum?"],
    ["To sum up, we've agreed on three points.", "Zusammengefasst haben wir uns auf drei Punkte geeinigt."],
    ["I'm writing to follow up on our call.", "Ich schreibe Ihnen im Anschluss an unser Telefonat."],
    ["Please find the document attached.", "Anbei finden Sie das Dokument."],
    ["I look forward to hearing from you.", "Ich freue mich auf Ihre Antwort."]
  ],
  dialog: { title: "Projektbesprechung", roles: ["Projektleiterin Claire", "Du"], lines: [
    ["A", "Right, shall we get started? Thomas, could you give us an update?", "So, fangen wir an? Thomas, gibst du uns ein Update?"],
    ["B", "Sure. We're on track, but the client wants some changes.", "Klar. Wir liegen im Plan, aber der Kunde will ein paar Änderungen."],
    ["A", "What kind of changes?", "Was für Änderungen?"],
    ["B", "Mainly the timeline. They'd like the first draft by the end of the month.", "Vor allem den Zeitplan. Sie hätten den ersten Entwurf gern bis Monatsende."],
    ["A", "That's tight. Can we manage it?", "Das ist knapp. Schaffen wir das?"],
    ["B", "I think so, if we get one more person on the team.", "Ich denke schon, wenn wir noch eine Person ins Team bekommen."],
    ["A", "Okay, I'll look into that. Can you send me a short summary by email?", "Okay, ich kümmere mich darum. Schickst du mir eine kurze Zusammenfassung per Mail?"],
    ["B", "Of course, I'll send it this afternoon.", "Natürlich, ich schicke sie heute Nachmittag."]
  ]},
  text: { title: "Writing better emails",
    en: "A good business email is short and clear. The subject line should tell the reader what the email is about. Start with a friendly greeting, explain your request in the first paragraph and say exactly what you need and by when. British readers often prefer a softer tone, so phrases like Would you mind or Could you possibly are very common.",
    de: "Eine gute geschäftliche E-Mail ist kurz und klar. Die Betreffzeile sollte sagen, worum es geht. Beginne mit einem freundlichen Gruß, erkläre dein Anliegen im ersten Absatz und sag genau, was du bis wann brauchst. Britische Leser mögen oft einen weicheren Ton, deshalb sind Wendungen wie Would you mind oder Could you possibly sehr üblich.",
    questions: [
      ["What should the subject line do?", ["Tell the reader what the email is about", "Be very long", "Contain a joke"]],
      ["Where should you explain your request?", ["In the first paragraph", "At the very end", "In the subject line only"]],
      ["What kind of tone do British readers often prefer?", ["A softer tone", "A very direct tone", "A funny tone"]]
    ]},
  speak: [
    ["Open a meeting and present the agenda.", "Eröffne ein Meeting und stell die Tagesordnung vor.", "Good morning everyone, thanks for joining. Today we have three points on the agenda. First, a quick update on the project. Second, the budget for next year. And finally, any other business. We should be finished in about forty-five minutes."],
    ["Politely disagree with a colleague in a meeting.", "Widersprich höflich einem Kollegen im Meeting.", "I see what you mean, and I agree that we need to save money. However, I'm not sure that cutting the training budget is the best solution. Could we look at other options first, for example travel costs?"]
  ]
},
{
  id: "complaints", track: "b1", icon: "🧾", title: "Beschweren und Probleme lösen", en: "Complaints and problems",
  tip: "Englische Beschwerden beginnen meist weich: „I'm sorry to bother you, but …“. Zu direkt wirkt schnell unhöflich.",
  phrases: [
    ["I'm sorry to bother you, but there's a problem with my room.", "Entschuldigen Sie die Störung, aber es gibt ein Problem mit meinem Zimmer."],
    ["The heating doesn't seem to be working.", "Die Heizung scheint nicht zu funktionieren."],
    ["I booked a room with a sea view.", "Ich habe ein Zimmer mit Meerblick gebucht."],
    ["My flight has been cancelled.", "Mein Flug wurde gestrichen."],
    ["Am I entitled to compensation?", "Habe ich Anspruch auf eine Entschädigung?"],
    ["I'd like to speak to the manager, please.", "Ich möchte bitte den Geschäftsführer sprechen."],
    ["Could you possibly sort it out today?", "Könnten Sie das eventuell heute regeln?"],
    ["I'd like a refund, please.", "Ich hätte gern mein Geld zurück."],
    ["That's not what we agreed.", "Das ist nicht das, was wir vereinbart haben."],
    ["Thank you for sorting that out so quickly.", "Danke, dass Sie das so schnell geklärt haben."]
  ],
  dialog: { title: "Am Flughafenschalter", roles: ["Mitarbeiter der Airline", "Du"], lines: [
    ["B", "Excuse me, my flight to Hamburg has been cancelled. What can I do?", "Entschuldigung, mein Flug nach Hamburg wurde gestrichen. Was kann ich tun?"],
    ["A", "I'm very sorry about that. Let me see what I can find for you.", "Das tut mir sehr leid. Ich schaue, was ich für Sie finden kann."],
    ["B", "I really need to be home by tomorrow morning.", "Ich muss wirklich bis morgen früh zu Hause sein."],
    ["A", "There's a flight at seven tomorrow morning. Would that work?", "Es gibt einen Flug morgen früh um sieben. Würde das gehen?"],
    ["B", "That's fine. But where am I supposed to stay tonight?", "Das passt. Aber wo soll ich heute Nacht bleiben?"],
    ["A", "We'll book you a hotel near the airport and give you a meal voucher.", "Wir buchen Ihnen ein Hotel am Flughafen und geben Ihnen einen Essensgutschein."],
    ["B", "Thank you. And am I entitled to compensation?", "Danke. Und habe ich Anspruch auf eine Entschädigung?"],
    ["A", "Yes, you can claim it online. Here's the link.", "Ja, Sie können sie online beantragen. Hier ist der Link."]
  ]},
  text: { title: "A polite complaint",
    en: "When something goes wrong, British people often apologise first, even when it is not their fault. A typical complaint might begin with: I'm sorry, but I think there might be a small problem. This can confuse visitors, who may not realise that the person is actually quite annoyed. It helps to listen carefully to the words might, slightly and a bit.",
    de: "Wenn etwas schiefläuft, entschuldigen sich Briten oft zuerst, auch wenn es nicht ihre Schuld ist. Eine typische Beschwerde könnte so beginnen: Entschuldigung, aber ich glaube, es könnte ein kleines Problem geben. Das kann Besucher verwirren, die nicht merken, dass die Person eigentlich ziemlich verärgert ist. Es hilft, genau auf Wörter wie might, slightly und a bit zu achten.",
    questions: [
      ["What do British people often do first?", ["Apologise", "Shout", "Leave"]],
      ["Why can this confuse visitors?", ["They don't realise the person is annoyed", "They don't understand the words", "It is too loud"]],
      ["Which words should you listen for?", ["Might, slightly and a bit", "Yes and no", "Please and thank you"]]
    ]},
  speak: [
    ["Your hotel room is noisy and dirty. Complain at reception.", "Dein Hotelzimmer ist laut und schmutzig. Beschwer dich an der Rezeption.", "I'm sorry to bother you, but I'm not happy with my room. It's right next to the lift, so it's very noisy, and the bathroom hasn't been cleaned. Would it be possible to move to a quieter room this evening?"],
    ["An online order arrived damaged. Explain it on the phone.", "Eine Online-Bestellung kam beschädigt an. Erklär es am Telefon.", "Hello, I'm calling about order number four five six. The coffee machine arrived yesterday, but the box was damaged and the glass jug is broken. I'd like a replacement as soon as possible, or otherwise a full refund."]
  ]
},
{
  id: "falsefriends", track: "b1", icon: "🪤", title: "Stolperfallen für Deutsche", en: "False friends",
  tip: "False friends klingen wie deutsche Wörter, bedeuten aber etwas anderes: actually (eigentlich), eventually (schließlich), sensible (vernünftig), gift (Geschenk).",
  phrases: [
    ["Actually, I'm from Hamburg.", "Eigentlich komme ich aus Hamburg."],
    ["Eventually we found the hotel.", "Schließlich fanden wir das Hotel."],
    ["That's a very sensible decision.", "Das ist eine sehr vernünftige Entscheidung."],
    ["She's very sensitive to criticism.", "Sie ist sehr empfindlich gegenüber Kritik."],
    ["I'll get a new phone tomorrow.", "Ich bekomme morgen ein neues Handy."],
    ["My boss is in a bad mood.", "Mein Chef hat schlechte Laune."],
    ["The chef recommended the fish.", "Der Koch hat den Fisch empfohlen."],
    ["Can you lend me your pen?", "Kannst du mir deinen Stift leihen?"],
    ["I'll have the steak, rare please.", "Ich nehme das Steak, blutig bitte."],
    ["We should become more flexible.", "Wir sollten flexibler werden."]
  ],
  dialog: { title: "Missverständnis im Büro", roles: ["Kollege Oliver", "Du"], lines: [
    ["A", "Did you get the email from the new client?", "Hast du die Mail vom neuen Kunden bekommen?"],
    ["B", "Yes. Actually, I wanted to ask you about it.", "Ja. Eigentlich wollte ich dich danach fragen."],
    ["A", "Sure. What's the problem?", "Klar. Was ist das Problem?"],
    ["B", "They want a meeting next week, but our boss is on holiday.", "Sie wollen nächste Woche ein Treffen, aber unser Chef ist im Urlaub."],
    ["A", "Then I think the sensible thing is to suggest a video call.", "Dann ist es wohl am vernünftigsten, einen Videocall vorzuschlagen."],
    ["B", "Good idea. And eventually we can meet in person.", "Gute Idee. Und irgendwann später können wir uns persönlich treffen."],
    ["A", "Exactly. Shall I write to them?", "Genau. Soll ich ihnen schreiben?"],
    ["B", "That would be great, thanks.", "Das wäre super, danke."]
  ]},
  text: { title: "Dangerous words",
    en: "Some English words look German but mean something completely different. A German who says I will become a steak might get strange looks, because become means werden. A chef is not your boss but a cook. And if you tell someone that you are sensible, you are not saying that you are sensitive but that you are reasonable. Learning these false friends early saves a lot of embarrassment.",
    de: "Manche englischen Wörter sehen deutsch aus, bedeuten aber etwas völlig anderes. Ein Deutscher, der sagt I will become a steak, wird seltsam angeschaut, denn become heißt werden. Ein chef ist nicht der Chef, sondern ein Koch. Und wer sagt, er sei sensible, sagt nicht, dass er sensibel ist, sondern vernünftig. Wer diese falschen Freunde früh lernt, erspart sich viele peinliche Momente.",
    questions: [
      ["What does become mean?", ["Werden", "Bekommen", "Bestellen"]],
      ["What is a chef?", ["A cook", "A boss", "A waiter"]],
      ["What does sensible mean?", ["Reasonable", "Sensitive", "Sad"]]
    ]},
  speak: [
    ["Explain one false friend to an English colleague.", "Erklär einer englischen Kollegin einen falschen Freund.", "In German we have the word Handy, which means mobile phone. But in English, handy means useful or practical. So when Germans say they forgot their handy, English speakers are often a bit confused."],
    ["Tell a short story using actually, eventually and sensible.", "Erzähl eine kurze Geschichte mit actually, eventually und sensible.", "Actually, I wanted to drive to the coast last weekend. But the weather forecast was terrible, so the sensible thing was to stay at home. Eventually the sun came out on Sunday and we went for a long walk instead."]
  ]
},
{
  id: "culture", track: "b1", icon: "🫖", title: "Britisch und amerikanisch", en: "British and American English",
  tip: "Gleiche Sprache, andere Wörter: flat/apartment, lift/elevator, holiday/vacation, queue/line. Im Kurs kannst du oben bei ⚙️ die Aussprache umstellen.",
  phrases: [
    ["We're going on holiday next week.", "Wir fahren nächste Woche in den Urlaub."],
    ["We're going on vacation next week.", "Wir fahren nächste Woche in Urlaub. (amerikanisch)"],
    ["Let's take the lift to the third floor.", "Lass uns mit dem Aufzug in den dritten Stock fahren."],
    ["Could you take out the rubbish?", "Könntest du den Müll rausbringen?"],
    ["Could you take out the trash?", "Könntest du den Müll rausbringen? (amerikanisch)"],
    ["There's a long queue at the post office.", "Bei der Post ist eine lange Schlange."],
    ["I'll have chips with my burger.", "Ich nehme Pommes zu meinem Burger."],
    ["Can I have the check, please?", "Kann ich die Rechnung haben? (amerikanisch)"],
    ["That's not bad at all.", "Das ist gar nicht schlecht. (britisch: richtig gut)"],
    ["Quite good, I suppose.", "Ganz gut, denke ich. (britisch: eher mittelmäßig)"]
  ],
  dialog: { title: "Zwei Freunde, zwei Englisch", roles: ["Amerikaner Jake", "Du"], lines: [
    ["A", "So how was London? Did you like your apartment?", "Und, wie war London? Hat dir deine Wohnung gefallen?"],
    ["B", "You mean my flat? It was tiny, but the view was brilliant.", "Du meinst meine Wohnung? Winzig, aber die Aussicht war genial."],
    ["A", "Brilliant? You sound British already!", "Brilliant? Du klingst schon britisch!"],
    ["B", "Well, everyone said it. And they queue for everything.", "Na ja, alle sagen das. Und sie stehen für alles Schlange."],
    ["A", "Here we just say stand in line. What about the food?", "Bei uns sagt man einfach stand in line. Und das Essen?"],
    ["B", "Not bad at all. The fish and chips were excellent.", "Gar nicht schlecht. Fish and Chips waren ausgezeichnet."],
    ["A", "Chips? You mean fries, right?", "Chips? Du meinst Pommes, oder?"],
    ["B", "Exactly. And crisps are your chips. It's very confusing!", "Genau. Und crisps sind eure Chips. Sehr verwirrend!"]
  ]},
  text: { title: "British understatement",
    en: "British English is famous for understatement. If a British colleague says your proposal is quite interesting, they may not be impressed at all. If they say it is not bad, they might actually love it. Americans tend to be more enthusiastic and direct, so a British not bad can sound disappointing to them. When in doubt, ask a friendly follow-up question.",
    de: "Britisches Englisch ist berühmt für Understatement. Wenn ein britischer Kollege deinen Vorschlag quite interesting nennt, ist er vielleicht gar nicht beeindruckt. Sagt er not bad, findet er ihn womöglich großartig. Amerikaner sind meist begeisterter und direkter, deshalb kann ein britisches not bad für sie enttäuschend klingen. Im Zweifel freundlich nachfragen.",
    questions: [
      ["What might quite interesting mean in Britain?", ["Not very impressed", "Absolutely fantastic", "Very funny"]],
      ["How are Americans described?", ["More enthusiastic and direct", "More indirect", "More quiet"]],
      ["What should you do when in doubt?", ["Ask a friendly follow-up question", "Say nothing", "Change the topic"]]
    ]},
  speak: [
    ["Explain to a friend what you find typically British.", "Erkläre einer Freundin, was du typisch britisch findest.", "For me, typically British is queuing politely, drinking tea with milk and talking about the weather. I also love the dry sense of humour. People often say the opposite of what they mean, and you have to listen very carefully."],
    ["Would you rather visit the UK or the USA? Why?", "Würdest du lieber Großbritannien oder die USA besuchen? Warum?", "I'd rather visit the USA next, because I've already been to London twice. I'd love to see the national parks in the west, like Yosemite and the Grand Canyon. The distances are huge, so I'd probably rent a car and plan at least three weeks."]
  ]
}
];
