// Nerd-Ecke: Comic-Wissen und nutzloses Wissen. Jeder Text schaltet beim Lesen eine Sammelkarte frei.
// Die richtige Antwort steht in qs immer an erster Stelle, die App mischt sie.
window.NERD = {
texts: [
{id:"N1",kind:"nerd",icon:"🦸",title:"Superman und das Auto auf dem Titelbild",card:"Superman konnte anfangs nur weit springen. Das Kryptonit stammt aus dem Radio.",paras:[
"Im Jahr 1938 erschien am Kiosk ein Heft, das ein ganzes Genre begründete. Auf dem Titel von Action Comics Nr. 1 hebt ein Mann im blauen Anzug mit rotem Umhang ein grünes Auto über den Kopf und schmettert es gegen einen Felsen. Das Heft kostete zehn Cent, und die Figur hieß Superman.",
"Erfunden hatten ihn zwei Jugendliche aus Cleveland: der Texter Jerry Siegel und der Zeichner Joe Shuster. Sie hatten ihre Idee jahrelang vergeblich Verlagen angeboten. Für die Rechte an Superman erhielten sie am Ende 130 Dollar und verloren damit die Kontrolle über ihre Figur. Erst Jahrzehnte später sprach ihnen der Verlag eine Rente zu.",
"Anfangs konnte Superman noch nicht fliegen. Er sprang sehr weit, ungefähr so, wie ein Mensch auf einem kleineren Planeten springen würde. Das Fliegen kam erst später dazu. Auch das Kryptonit, seine berühmte Schwäche, erfand nicht der Comic, sondern eine Radioserie im Jahr 1943.",
"Mit dem Erfolg entstand ein neuer Heldentyp: der Superheld mit Kostüm, Umhang und Geheimidentität. Der Verlag DC trägt bis heute den Namen seines Detektivhefts, denn DC steht für Detective Comics."],
qs:[
{q:"Was kostete das Heft mit Supermans erstem Auftritt?",a:["Zehn Cent","Einen Dollar","Fünfzig Cent"]},
{q:"Wer erfand Superman?",a:["Jerry Siegel und Joe Shuster","Stan Lee und Jack Kirby","Bob Kane und Bill Finger"]},
{q:"Wie viel bekamen die Erfinder für die Rechte?",a:["130 Dollar","130.000 Dollar","13 Dollar"]},
{q:"Was konnte Superman am Anfang noch nicht?",a:["Fliegen","Springen","Autos heben"]}]},

{id:"N2",kind:"nerd",icon:"🦇",title:"Batman, Robin und der Joker",card:"Der Joker hat sein Gesicht von einem Stummfilmstar: Vorbild war »Der Mann, der lacht«.",paras:[
"Ein Jahr nach Superman, im Mai 1939, folgte in Detective Comics Nr. 27 der nächste große Held: Batman. Anders als Superman hatte er keine Superkräfte, sondern setzte auf Training, Technik und eine furchteinflößende Verkleidung. Seine Geschichte, der Mord an den Eltern des jungen Bruce Wayne, wurde erst im Lauf der ersten Hefte erzählt.",
"Als Erfinder gilt offiziell der Zeichner Bob Kane. Viele der Ideen steuerte aber der Autor Bill Finger bei, etwa das dunkle Cape, die spitzen Ohren der Maske und den Namen Bruce Wayne. Finger wurde lange nicht genannt. Erst seit 2015 führt DC ihn offiziell als Mitschöpfer auf.",
"Schon 1940 bekam Batman einen Partner: Robin, den jungen Zirkusartisten Dick Grayson. Der Grund war praktisch. Mit einem Gesprächspartner musste Batman seine Pläne nicht mehr in Gedanken sagen, und jüngere Leser hatten jemanden, mit dem sie sich vergleichen konnten.",
"Die Gegner wurden fast berühmter als der Held. Der Joker trat 1940 im ersten Heft einer eigenen Batman-Reihe auf. Sein Aussehen geht auf den Schauspieler Conrad Veidt im Stummfilm »Der Mann, der lacht« von 1928 zurück, dessen Gesicht zu einem Dauergrinsen verzogen war."],
qs:[
{q:"Wann erschien Batman zum ersten Mal?",a:["Im Mai 1939","Im Mai 1949","Im Mai 1929"]},
{q:"Wer wird seit 2015 offiziell als Mitschöpfer genannt?",a:["Bill Finger","Jerry Siegel","Joe Shuster"]},
{q:"Was war Robin ursprünglich?",a:["Ein Zirkusartist","Ein Polizist","Ein Reporter"]},
{q:"Welcher Film gilt als Vorbild für den Joker?",a:["Der Mann, der lacht","Metropolis","Nosferatu"]}]},

{id:"N3",kind:"nerd",icon:"🕷️",title:"Marvel und die Helden mit Macken",card:"Spider-Man ist ein Teenager mit Geldsorgen. Das war 1962 ein Bruch mit allen Regeln.",paras:[
"Bis zum Beginn der 1960er-Jahre wirkten Superhelden meist makellos. Dann veränderte ein Verlag das Genre, der damals schon Jahrzehnte alt war: Marvel. Der Autor Stan Lee und der Zeichner Jack Kirby brachten im November 1961 das Heft Fantastic Four Nr. 1 heraus, die Geschichte einer Familie, die nach einem Raumflug Superkräfte bekommt und sich dauernd streitet.",
"Neu war, dass die Helden Probleme hatten wie ihre Leser. 1962 folgte Spider-Man, erdacht von Lee und dem Zeichner Steve Ditko. Peter Parker ist ein Schüler mit Geldsorgen, Streit mit dem Chef und Ärger mit Mädchen. Seine Maske verdeckt ein ganz normales Teenagergesicht.",
"Aus dieser Zeit stammen auch Hulk und Thor (beide 1962) sowie Iron Man, die Avengers und die X-Men (1963).",
"Stan Lee schrieb nach der sogenannten Marvel-Methode: Er gab den Zeichnern nur eine grobe Handlung, sie zeichneten das Heft, und erst danach schrieb er die Dialoge. Darum gelten Zeichner wie Kirby und Ditko heute als echte Miterfinder. Lee selbst hatte in vielen Marvel-Filmen einen kurzen Gastauftritt. Er starb 2018."],
qs:[
{q:"Mit welchem Heft begann 1961 der Aufstieg von Marvel?",a:["Fantastic Four Nr. 1","Spider-Man Nr. 1","Avengers Nr. 1"]},
{q:"Wer zeichnete Spider-Man ursprünglich?",a:["Steve Ditko","Jack Kirby","Bob Kane"]},
{q:"Wie ging die Marvel-Methode?",a:["Erst grobe Handlung, dann Zeichnung, dann Dialoge","Erst Dialoge, dann Zeichnung","Der Zeichner schrieb alles allein"]},
{q:"Was war an den neuen Helden neu?",a:["Sie hatten Alltagsprobleme","Sie waren unverwundbar","Sie hatten keine Masken"]}]},

{id:"N4",kind:"nerd",icon:"🛡️",title:"Asterix und das gallische Dorf",card:"Gallier enden auf -ix, Römer auf -us. In Asterix verrät schon der Name, wer wo steht.",paras:[
"Am 29. Oktober 1959 erschien in der französischen Zeitschrift Pilote die erste Folge einer Serie über ein kleines gallisches Dorf, das im Jahr 50 vor Christus als einziges noch den Römern trotzt.",
"Erfunden haben Asterix der Texter René Goscinny und der Zeichner Albert Uderzo. Goscinny schrieb die Witze, Uderzo gab den Figuren ihr Gesicht. Der erste Band, Asterix der Gallier, erschien 1961 als Album.",
"Das Geheimnis des Dorfs ist der Zaubertrank des Druiden Miraculix, der übermenschliche Kräfte verleiht. Obelix muss ihn nicht trinken, denn er fiel als Kind in den Kessel. Dazu kommen der Hund Idefix, der Häuptling Majestix und der Barde Troubadix, den alle fesseln und knebeln, weil er so schlecht singt.",
"Die Namen sind ein Sprachspiel. Gallier enden auf -ix, Römer auf -us, Briten auf -ax. Goscinny starb 1977, danach schrieb und zeichnete Uderzo allein weiter. Er starb 2020. Asterix-Hefte gibt es in weit über hundert Sprachen und Dialekten."],
qs:[
{q:"Wo erschien die erste Folge von Asterix?",a:["In der Zeitschrift Pilote","In einer belgischen Tageszeitung","In einem Kinofilm"]},
{q:"Wer zeichnete Asterix?",a:["Albert Uderzo","René Goscinny","Hergé"]},
{q:"Warum muss Obelix den Zaubertrank nicht trinken?",a:["Er fiel als Kind in den Kessel","Er ist ein Römer","Er mag ihn nicht"]},
{q:"Auf welche Silbe enden die Namen der Römer?",a:["-us","-ix","-ax"]}]},

{id:"N5",kind:"nerd",icon:"🚀",title:"Tim und Struppi und die Reise zum Mond",card:"Tim betrat den Mond schon in den frühen 1950ern, rund 15 Jahre vor Apollo 11.",paras:[
"Am 10. Januar 1929 erschien in einer belgischen Kinderbeilage der erste Streifen mit einem jungen Reporter mit Haartolle und seinem weißen Hund. Gezeichnet hatte ihn der Belgier Georges Remi, der sich Hergé nannte. Der Name entstand aus den vertauschten Initialen R und G, französisch ausgesprochen.",
"Tim reist durch die ganze Welt: in die Sowjetunion, in den Kongo, nach Amerika, nach China und Tibet. Vieles in den frühen Heften sieht man heute kritisch, weil die Darstellung fremder Länder von Vorurteilen geprägt war. Hergé überarbeitete später mehrere Bände.",
"Berühmt wurde er für den klaren Strich, den man ligne claire nennt: gleichmäßige Linien, flache Farben, kaum Schatten. Berühmt war auch seine Genauigkeit. Für die beiden Mondabenteuer, die in den frühen 1950er-Jahren erschienen, ließ er sich beraten. Tim betritt darin den Mond, rund fünfzehn Jahre vor Apollo 11.",
"Insgesamt entstanden 24 Alben. Das letzte, Tim und die Alpha-Kunst, blieb unvollendet, als Hergé 1983 starb. In seinem Testament verfügte er, dass niemand die Serie weiterführen darf."],
qs:[
{q:"In welchem Jahr erschien der erste Tim-Streifen?",a:["1929","1949","1969"]},
{q:"Wie entstand der Name Hergé?",a:["Aus den vertauschten Initialen R und G","Aus dem Namen seiner Stadt","Aus einem Spitznamen seines Hundes"]},
{q:"Was bedeutet ligne claire?",a:["Gleichmäßige Linien, flache Farben, kaum Schatten","Kräftige Schraffuren","Nur Schwarzweiß"]},
{q:"Wie viele Alben entstanden insgesamt?",a:["24","12","50"]}]},

{id:"N6",kind:"nerd",icon:"🦆",title:"Erika Fuchs und die Sprache von Entenhausen",card:"»Seufz« und »ächz« heißen Erikative, benannt nach der Übersetzerin Erika Fuchs.",paras:[
"Micky Maus erblickte 1928 im Trickfilm Steamboat Willie das Licht der Leinwand. In Deutschland wurde die Maus aber erst durch ein Heft zur Hausfreundin: Seit 1951 erscheint das Micky Maus Magazin.",
"Die Comics stammen oft von amerikanischen Zeichnern. Besonders Carl Barks gab der Welt von Entenhausen ihr Gesicht. Er erfand 1947 Dagobert Duck, den reichsten Erpel der Welt, samt seinem riesigen Geldspeicher.",
"Ihre deutsche Stimme bekamen die Enten von Erika Fuchs. Die promovierte Kunsthistorikerin übersetzte ab 1951 fast vier Jahrzehnte lang die Geschichten und machte sie zu Literatur. Von ihr stammen Sätze wie »Dem Ingeniör ist nichts zu schwör« und viele Lautwörter in den Sprechblasen.",
"Sie schrieb Wörter wie »seufz«, »ächz«, »schluck« und »grübel« ohne Endung in die Blasen. Sprachwissenschaftler nennen solche Wörter bis heute Erikative, nach ihr."],
qs:[
{q:"Seit wann erscheint das Micky Maus Magazin in Deutschland?",a:["Seit 1951","Seit 1928","Seit 1975"]},
{q:"Wer erfand Dagobert Duck?",a:["Carl Barks","Walt Disney","Erika Fuchs"]},
{q:"Wer übersetzte die Geschichten ins Deutsche?",a:["Erika Fuchs","Gudrun Penndorf","Astrid Lindgren"]},
{q:"Was ist ein Erikativ?",a:["Ein Lautwort wie seufz ohne Endung","Ein Spitzname für Enten","Ein Zeichenstil"]}]},

{id:"N7",kind:"nerd",icon:"🎌",title:"Manga: Lesen von hinten nach vorn",card:"Manga liest man von rechts nach links, auch die Bilder auf der Seite.",paras:[
"Wer in Japan ein Comicheft aufschlägt, beginnt von hinten. Manga werden von rechts nach links gelesen, und auch die Bilder auf einer Seite folgen dieser Richtung. Das Medium hat in Japan einen großen Anteil am Buchmarkt und wird von allen Altersgruppen gelesen.",
"Als Vater des modernen Manga gilt Osamu Tezuka, 1928 geboren und eigentlich ausgebildeter Arzt. Ab 1952 zeichnete er Astro Boy, die Geschichte eines Roboterjungen. Er arbeitete filmisch: große Augen, wechselnde Perspektiven und viele Bilder für eine einzige Bewegung.",
"1963 wurde aus Astro Boy eine Fernsehserie. Sie gilt als der Beginn des Anime, wie man die japanische Zeichentrickkunst heute nennt.",
"Heute gibt es Manga für jede Zielgruppe: Shōnen für Jungen, Shōjo für Mädchen, Seinen und Josei für Erwachsene. Die erfolgreichste Serie, One Piece von Eiichirō Oda, läuft seit 1997 und hat sich mehrere hundert Millionen Mal verkauft."],
qs:[
{q:"In welcher Richtung liest man Manga?",a:["Von rechts nach links","Von links nach rechts","Von unten nach oben"]},
{q:"Wer gilt als Vater des modernen Manga?",a:["Osamu Tezuka","Eiichirō Oda","Hergé"]},
{q:"Welche Serie wurde 1963 zur Fernsehserie?",a:["Astro Boy","One Piece","Asterix"]},
{q:"Wofür steht Shōjo?",a:["Manga für Mädchen","Manga für Erwachsene","Manga für Jungen"]}]},

{id:"N8",kind:"nerd",icon:"🐶",title:"Peanuts und die Mondfähre Snoopy",card:"Die Mondfähre von Apollo 10 hieß Snoopy, die Kommandokapsel Charlie Brown.",paras:[
"Charlie Brown, Snoopy, Lucy und Linus: Die Comicstrips Peanuts erschienen von Oktober 1950 bis Februar 2000. In dieser Zeit zeichnete Charles M. Schulz insgesamt 17.897 Streifen, jeden davon selbst und ohne Assistenten.",
"Schulz erzählte von alltäglichen Sorgen: Einsamkeit, Angst vor Ablehnung, kleine Hoffnungen. Charlie Brown verliert fast jedes Baseballspiel und schafft es nie, den Football zu schießen, den Lucy im letzten Moment wegzieht.",
"Der Hund Snoopy ist mit seiner Fantasie der Star. Er kämpft als Weltkriegsflieger gegen den Roten Baron und schreibt Romane, die mit »Es war eine dunkle und stürmische Nacht« beginnen.",
"Als die USA 1969 Apollo 10 zum Mond schickten, wählte die Besatzung ihre Rufnamen aus den Peanuts: Die Kommandokapsel hieß Charlie Brown, die Mondfähre Snoopy. Bis heute vergibt die NASA den Silver Snoopy Award für besondere Verdienste um die Sicherheit.",
"Schulz starb im Februar 2000, einen Tag bevor sein letzter Sonntagsstrip erschien."],
qs:[
{q:"Wie viele Peanuts-Streifen zeichnete Schulz?",a:["17.897","1.789","178.970"]},
{q:"Wie hieß die Mondfähre von Apollo 10?",a:["Snoopy","Charlie Brown","Linus"]},
{q:"Wer zeichnete die Streifen?",a:["Schulz allein","Ein Team von Assistenten","Walt Disney"]},
{q:"Gegen wen kämpft Snoopy als Flieger?",a:["Gegen den Roten Baron","Gegen den Joker","Gegen Dagobert Duck"]}]},

{id:"N9",kind:"nerd",icon:"💬",title:"Sprechblasen und der Comics Code",card:"Die Gelbe Presse hat ihren Namen wohl von einem Comic: The Yellow Kid.",paras:[
"Comics erzählen mit Bildern und Text zugleich. Die Sprechblase ist dabei nicht ihre erste Form, frühe Bildergeschichten setzten den Text unter die Bilder. Als Wegbereiter gilt The Yellow Kid von Richard F. Outcault aus den 1890er-Jahren, ein Junge im gelben Nachthemd, dessen Sprüche zunächst auf dem Hemd standen.",
"Zwei große Zeitungen stritten damals um den Zeichner. Als Gelbe Presse bezeichnet man seither reißerische Blätter, und der Name wird auf diese Figur zurückgeführt.",
"In den 1950er-Jahren geriet das Medium in die Kritik. Der Psychiater Fredric Wertham warnte 1954 in seinem Buch Seduction of the Innocent vor angeblichen Gefahren für Jugendliche. Im selben Jahr befasste sich ein Ausschuss des US-Senats mit Horrorcomics.",
"Die Verlage reagierten mit einer Selbstkontrolle, dem Comics Code. Wer das Siegel wollte, musste Verbrechen stets bestrafen und durfte kaum Gewalt zeigen. Das Siegel verlor erst in den 2000er-Jahren an Bedeutung. 2011 gaben es die letzten Verlage auf."],
qs:[
{q:"Wer zeichnete The Yellow Kid?",a:["Richard F. Outcault","Charles M. Schulz","Stan Lee"]},
{q:"Welches Buch erschien 1954?",a:["Seduction of the Innocent","Fantastic Four","Die Gelbe Presse"]},
{q:"Was war der Comics Code?",a:["Eine Selbstkontrolle der Verlage","Ein Gesetz des Senats","Ein Zeichenstil"]},
{q:"Wann gaben die letzten Verlage das Siegel auf?",a:["2011","1971","1954"]}]},

{id:"N10",kind:"nerd",icon:"📡",title:"Wörter mit überraschender Herkunft",card:"Bluetooth heißt nach einem Wikingerkönig, sein Logo zeigt dessen Runen-Initialen.",paras:[
"Manche Wörter erzählen kleine Geschichten. Bluetooth, die Funktechnik für Kopfhörer und Lautsprecher, ist nach einem dänischen König benannt: Harald Blauzahn, der im 10. Jahrhundert Dänemark und Norwegen einte. Die Technik sollte Geräte verbinden, wie er die Stämme verband. Das Logo ist eine Verschmelzung der Runen für seine Initialen H und B.",
"Das Wort Roboter stammt aus dem Tschechischen: robota heißt Frondienst oder schwere Arbeit. Der Schriftsteller Karel Čapek benutzte es 1920 in dem Theaterstück R.U.R. Erfunden habe das Wort, sagte er später, sein Bruder Josef.",
"Auch Metalle haben Spitznamen von Bergleuten. Kobalt kommt von Kobold, weil die Bergleute glaubten, böse Geister verdürben das Erz. Nickel geht auf Kupfernickel zurück, ein Erz, das wie Kupfer aussah, aber keines lieferte.",
"Beim Spam stand ein Dosenfleisch Pate. In einem Sketch der britischen Gruppe Monty Python kommt das Wort so oft vor, dass es alles übertönt. Daraus wurde der Name für lästige Massenmails. Und das Emoji hat nichts mit Emotion zu tun: Es ist japanisch und setzt sich aus e für Bild und moji für Schriftzeichen zusammen."],
qs:[
{q:"Nach wem ist Bluetooth benannt?",a:["Nach Harald Blauzahn","Nach einem Erfinder namens Blue","Nach Leif Eriksson"]},
{q:"Woher stammt das Wort Roboter?",a:["Aus dem Tschechischen, robota heißt Frondienst","Aus dem Griechischen","Aus dem Englischen"]},
{q:"Wer soll das Wort Roboter erfunden haben?",a:["Josef Čapek","Karel Čapek","Isaac Asimov"]},
{q:"Was bedeutet das e in Emoji?",a:["Bild","Gefühl","Elektro"]}]},

{id:"N11",kind:"nerd",icon:"🪐",title:"Kosmos-Kuriositäten",card:"Auf der Venus ist ein Tag länger als ein Jahr.",paras:[
"Auf der Venus ist ein Tag länger als ein Jahr. Der Planet braucht für eine Drehung um sich selbst rund 243 Erdentage, für einen Umlauf um die Sonne aber nur etwa 225.",
"Außerdem dreht sich die Venus in die falsche Richtung. Die meisten Planeten rotieren von West nach Ost. Die Venus rotiert entgegengesetzt, und dort geht die Sonne im Westen auf.",
"Der Merkur ist der Sonne am nächsten und braucht für eine Runde nur 88 Tage. Dafür dreht er sich so langsam, dass ein Sonnentag dort, also die Zeit von Sonnenaufgang zu Sonnenaufgang, rund 176 Erdentage dauert, genau zwei Merkurjahre.",
"Auch der Mond ist nicht fest an seinem Platz. Er entfernt sich von der Erde jedes Jahr um etwa 3,8 Zentimeter. Gemessen wird das mit Laserstrahlen, die von Spiegeln zurückgeworfen werden, welche Apollo-Astronauten auf dem Mond aufgestellt haben.",
"Das Licht der Sonne braucht gut acht Minuten bis zur Erde. Wer zur Sonne schaut, sieht sie also so, wie sie vor etwa acht Minuten war."],
qs:[
{q:"Was ist auf der Venus länger?",a:["Ein Tag als ein Jahr","Ein Jahr als ein Tag","Beides gleich lang"]},
{q:"Wo geht auf der Venus die Sonne auf?",a:["Im Westen","Im Osten","Im Norden"]},
{q:"Wie weit entfernt sich der Mond jährlich?",a:["Etwa 3,8 Zentimeter","Etwa 3,8 Meter","Etwa 38 Kilometer"]},
{q:"Wie lange braucht das Sonnenlicht bis zur Erde?",a:["Gut acht Minuten","Etwa acht Sekunden","Etwa acht Stunden"]}]},

{id:"N12",kind:"nerd",icon:"🕹️",title:"Pong, Pac-Man und Tetris",card:"Pac-Man heißt nach dem japanischen Lautwort für Mampfen: paku-paku.",paras:[
"1972 kam mit Pong das erste kommerziell erfolgreiche Videospiel in Kneipen und Spielhallen. Zwei Striche schlagen einen Punkt hin und her, mehr nicht. Hersteller war die US-Firma Atari, gegründet von Nolan Bushnell. Entwickelt hat das Spiel Allan Alcorn.",
"1980 erschien in Japan Pac-Man. Der Name geht auf das japanische Lautwort paku-paku zurück, das das Klappen eines Mundes beim Essen beschreibt. Der Designer Toru Iwatani wollte ein Spiel, das auch Frauen und Paare anspricht, und ließ den Helden nicht schießen, sondern fressen.",
"Tetris entwickelte 1984 der Informatiker Alexei Paschitnow in Moskau. Der Name verbindet tetra, das griechische Wort für vier, denn jeder Stein besteht aus vier Quadraten, mit Tennis, seinem Lieblingssport.",
"Berühmt machte das Spiel 1989 der Game Boy von Nintendo, dem Tetris beilag. Weil das Spiel auf dem tragbaren Gerät so gut passte, verkaufte sich der Game Boy millionenfach."],
qs:[
{q:"Wann erschien Pong?",a:["1972","1982","1962"]},
{q:"Woher kommt der Name Pac-Man?",a:["Vom Lautwort paku-paku für Mampfen","Vom Namen des Designers","Von einem Gericht"]},
{q:"Wo entwickelte Paschitnow Tetris?",a:["In Moskau","In Tokio","In Kalifornien"]},
{q:"Was bedeutet tetra im Namen Tetris?",a:["Vier","Drei","Zehn"]}]},

{id:"N13",kind:"nerd",icon:"🖖",title:"Star Trek, Star Wars und Klingonisch",card:"Klingonisch hat eine eigene Grammatik, entworfen vom Sprachwissenschaftler Marc Okrand.",paras:[
"Im September 1966 lief die erste Folge von Star Trek im amerikanischen Fernsehen. Erfinder Gene Roddenberry wollte eine Zukunft zeigen, in der Menschen verschiedener Herkunft zusammenarbeiten. Die Besatzung der Enterprise war für das Fernsehen der 1960er-Jahre bemerkenswert gemischt.",
"Die Serie wurde nach nur drei Staffeln eingestellt. Doch Wiederholungen machten sie zum Kult. Es entstand eine große Fangemeinde, und aus ihr wurden Filme und neue Serien.",
"Für den Film Star Trek III von 1984 entwarf der Sprachwissenschaftler Marc Okrand die Sprache der Klingonen, mit eigener Grammatik und festem Wortschatz. Sie wird bis heute von Fans gelernt.",
"1977 kam Star Wars von George Lucas in die Kinos. Den Zusatz Episode IV: Eine neue Hoffnung erhielt der Film erst 1981 bei einer Wiederaufführung. Lucas hatte sich an den Rechten für Spielzeug beteiligen lassen, was das Geschäft in Hollywood veränderte."],
qs:[
{q:"Wann lief die erste Folge von Star Trek?",a:["Im September 1966","Im September 1977","Im September 1984"]},
{q:"Wer entwarf die Sprache Klingonisch?",a:["Marc Okrand","George Lucas","Gene Roddenberry"]},
{q:"In welchem Jahr kam Star Wars ins Kino?",a:["1977","1966","1984"]},
{q:"Wann erhielt der Film den Zusatz Episode IV?",a:["1981 bei einer Wiederaufführung","Schon 1977","2005"]}]}
],
facts: [
"Ein Oktopus hat drei Herzen und blaues Blut.",
"Wombats machen würfelförmigen Kot. So bleibt er auf Steinen liegen und markiert das Revier.",
"Bananen sind leicht radioaktiv, weil sie Kalium enthalten. Die Strahlung ist völlig harmlos.",
"Haie gibt es schon länger als Bäume.",
"Auf der Venus ist ein Tag länger als ein Jahr.",
"Das Licht der Sonne ist gut acht Minuten unterwegs, bis es die Erde erreicht.",
"Der Mond entfernt sich jedes Jahr um etwa 3,8 Zentimeter von der Erde.",
"Wasser ist bei 4 Grad Celsius am dichtesten. Darum schwimmt Eis oben auf dem See.",
"Das Wort Roboter kommt vom tschechischen robota, Frondienst.",
"Bluetooth heißt nach dem Wikingerkönig Harald Blauzahn.",
"Die Mondfähre von Apollo 10 hieß Snoopy.",
"Superman konnte in den ersten Heften nicht fliegen, sondern nur weit springen.",
"Charles M. Schulz zeichnete alle 17.897 Peanuts-Streifen allein.",
"Hergé erfand sein Pseudonym aus den vertauschten Initialen R und G seines Namens Remi.",
"Tetris-Erfinder Alexei Paschitnow baute das Spiel 1984 in Moskau.",
"Die Gelbe Presse hat ihren Namen von einem Comic: The Yellow Kid."
]
};

/* Paket 2: Hunde, Tiramisu und 80er-Easter-Eggs (themenfreie Fakten in eigenen Worten). */
window.NERD.texts.push(
{id:"N14",kind:"nerd",icon:"🐕",title:"Vom Wolf zum Hund",card:"Vor rund 14.000 Jahren wurde in Bonn-Oberkassel ein Mensch gemeinsam mit zwei Hunden begraben.",paras:[
"Der Hund ist das älteste Haustier des Menschen. Er stammt vom Wolf ab, genauer von Wölfen, die sich irgendwann den Lagerplätzen von Jägern und Sammlern näherten. Wie und wann genau das geschah, ist unter Forschern bis heute umstritten. Die Schätzungen reichen von mindestens 15.000 bis zu 40.000 Jahren.",
"Ein berührender Fund stammt aus Deutschland. 1914 entdeckten Arbeiter in einem Steinbruch bei Bonn-Oberkassel ein Doppelgrab, das etwa 14.000 Jahre alt ist. Darin lagen ein Mann und eine Frau, und bei ihnen die Knochen von zwei Hunden. Einer der Hunde war als junges Tier schwer krank gewesen und muss gepflegt worden sein, sonst hätte er so lange nicht überlebt.",
"Heute gibt es eine riesige Vielfalt. Der internationale Dachverband FCI erkennt über 340 Rassen an, vom winzigen Chihuahua bis zur riesigen Deutschen Dogge. Trotz aller Unterschiede gehören alle Hunde zu einer einzigen Art."
],qs:[
{q:"Von welchem Tier stammt der Hund ab?",a:["Vom Wolf.","Vom Fuchs.","Vom Schakal."]},
{q:"Was fand man bei Bonn-Oberkassel?",a:["Ein etwa 14.000 Jahre altes Doppelgrab mit einem Hund.","Ein Wolfsrudel.","Eine Hundefigur aus Gold."]},
{q:"Was verrät der Fund über einen der Hunde?",a:["Er war als Jungtier krank und wurde gepflegt.","Er war ein Jagdhund.","Er war ein Wolf."]},
{q:"Wie viele Rassen erkennt die FCI an?",a:["Über 340.","Etwa 20.","Rund 5.000."]}
]},
{id:"N15",kind:"nerd",icon:"👃",title:"Die Superkraft der Hundenase",card:"Ein Hund hat je nach Rasse 125 bis 300 Millionen Riechzellen, der Mensch nur etwa fünf bis sechs Millionen.",paras:[
"Die Nase ist das wichtigste Sinnesorgan des Hundes. Je nach Rasse besitzt er etwa 125 bis 300 Millionen Riechzellen, der Mensch dagegen nur etwa fünf bis sechs Millionen. Auch der Teil des Gehirns, der Gerüche verarbeitet, ist beim Hund im Verhältnis deutlich größer.",
"Hunde atmen beim Schnüffeln anders als wir. Forscher beobachteten, dass beim Ausatmen die Luft seitlich durch Schlitze der Nase entweicht. So wird die Luft vor den Nasenlöchern nicht weggeblasen, und neue Duftstoffe strömen nach. Dazu kommt ein zusätzliches Organ im Gaumen, das Jacobson-Organ, das besonders auf Botenstoffe anspricht.",
"Wegen dieser Fähigkeiten arbeiten Hunde als Rettungs-, Spür- und Suchhunde. Sie finden verschüttete Menschen unter Lawinen, Sprengstoff am Flughafen oder vermisste Personen. Die feuchte Nase hilft dabei, Duftteilchen aufzunehmen. Und noch etwas: Der Nasenabdruck jedes Hundes ist einzigartig, ähnlich wie ein Fingerabdruck."
],qs:[
{q:"Wie viele Riechzellen hat der Mensch ungefähr?",a:["Fünf bis sechs Millionen.","Fünf bis sechs Milliarden.","Fünfzig Millionen."]},
{q:"Was passiert beim Ausatmen eines schnüffelnden Hundes?",a:["Die Luft entweicht seitlich, neue Düfte strömen nach.","Er hält den Atem an.","Er atmet durch das Maul."]},
{q:"Wie heißt das zusätzliche Organ im Gaumen?",a:["Jacobson-Organ.","Riechkolben.","Nasenspiegel."]},
{q:"Was ist bei jedem Hund einzigartig?",a:["Der Nasenabdruck.","Die Zahl der Zähne.","Die Pfotengröße."]}
]},
{id:"N16",kind:"nerd",icon:"🚀",title:"Berühmte Hunde: Laika, Hachiko und Balto",card:"Laika flog 1957 als erstes Lebewesen in eine Erdumlaufbahn.",paras:[
"Laika war eine Straßenhündin aus Moskau. Am 3. November 1957 startete sie an Bord von Sputnik 2 und wurde das erste Lebewesen in einer Erdumlaufbahn. Eine Rückkehr war nicht vorgesehen. Lange hieß es, sie sei nach einer Woche gestorben. Erst 2002 wurde bekannt, dass sie schon nach wenigen Stunden an Überhitzung starb.",
"Hachiko war ein Akita aus Japan. Seinen Besitzer, einen Professor, begleitete er täglich zum Bahnhof Shibuya in Tokio und holte ihn abends dort ab. Als der Professor 1925 an der Universität starb, kehrte der Hund fast zehn Jahre lang jeden Tag zum Bahnhof zurück. Heute steht dort eine Bronzestatue des treuen Wartenden.",
"Balto wurde 1925 weltberühmt. In der Stadt Nome in Alaska brach die Diphtherie aus, und ein Medikament musste im Winter über viele Hundert Kilometer herbeigeschafft werden. Hundeschlittenteams brachten das Serum in einem Staffellauf. Balto führte das Gespann auf der letzten Etappe. Im Central Park in New York erinnert eine Statue daran."
],qs:[
{q:"Womit flog Laika ins All?",a:["Mit Sputnik 2.","Mit Apollo 11.","Mit Gemini."]},
{q:"Seit wann ist ihre wahre Todesursache bekannt?",a:["Seit 2002.","Seit 1957.","Seit 1925."]},
{q:"Wo wartete Hachiko jahrelang auf sein Herrchen?",a:["Am Bahnhof Shibuya in Tokio.","Am Hafen von Osaka.","Vor einer Schule."]},
{q:"Was transportierten die Hundeschlitten 1925 nach Nome?",a:["Ein Serum gegen Diphtherie.","Post und Zeitungen.","Lebensmittel für den Winter."]}
]},
{id:"N17",kind:"nerd",icon:"🎾",title:"Was Hunde verstehen",card:"Der Border Collie Chaser kannte über 1.000 Spielzeugnamen.",paras:[
"Wie viel verstehen Hunde von unserer Sprache? Der amerikanische Psychologe John Pilley brachte seinem Border Collie Chaser den Namen von Spielzeugen bei. Als er 2011 darüber berichtete, kannte die Hündin die Namen von 1.022 Gegenständen und holte jeden einzelnen auf Zuruf aus einem Haufen heraus. Sie konnte sogar unbekannte Namen durch Ausschluss zuordnen.",
"Auch bei Gesten sind Hunde stark. Studien zeigten, dass sie dem Zeigefinger eines Menschen folgen und besser verstehen, worauf er zeigt, als zum Beispiel Schimpansen. Diese Fähigkeit hat sich offenbar im Zusammenleben mit uns entwickelt.",
"Sogar das Schwanzwedeln verrät etwas. Forscher um Giorgio Vallortigara berichteten 2007, dass Hunde den Schwanz bei positiven Eindrücken eher nach rechts und bei Angst eher nach links wedeln. Andere Hunde bemerken den Unterschied und reagieren darauf."
],qs:[
{q:"Wie viele Spielzeugnamen kannte Chaser?",a:["1.022.","22.","10.000."]},
{q:"Wie ordnete sie unbekannte Namen zu?",a:["Durch Ausschluss.","Durch Zufall.","Gar nicht."]},
{q:"Womit schnitten Hunde in Studien besser ab als Schimpansen?",a:["Mit dem Verstehen von Zeigegesten.","Mit Rechnen.","Mit Klettern."]},
{q:"Wohin wedeln Hunde bei positiven Eindrücken eher?",a:["Nach rechts.","Nach links.","Gar nicht."]}
]},
{id:"N18",kind:"nerd",icon:"🍰",title:"Tiramisu: Zieh mich hoch",card:"Tirami su heißt wörtlich: zieh mich hoch.",paras:[
"Das Tiramisu ist eines der bekanntesten italienischen Desserts. Sein Name bedeutet auf Italienisch „zieh mich hoch“, gemeint ist wohl der Muntermacher aus Kaffee, Zucker und Eiern. Das klassische Rezept schichtet in Espresso getränkte Löffelbiskuits, eine Creme aus Mascarpone, Eigelb und Zucker und bestäubt das Ganze mit Kakao.",
"Woher es stammt, ist umstritten. Viele nennen die Stadt Treviso in Venetien. Dort soll es in den 1960er oder 1970er Jahren im Restaurant Le Beccherie entstanden sein. Auch die Region Friaul-Julisch Venetien beansprucht das Dessert für sich, und 2017 nahm man es in die Liste der traditionellen Lebensmittel der Region auf.",
"Über Italien hinaus wurde das Tiramisu zum Klassiker, bei dem jeder sein eigenes Rezept hat. Manche geben Marsala oder Amaretto dazu. Weil die klassische Creme rohe Eier enthält, sollte man das Dessert frisch zubereiten und gut gekühlt aufbewahren."
],qs:[
{q:"Was bedeutet der Name Tiramisu?",a:["Zieh mich hoch.","Süßer Kuss.","Kleiner Kaffee."]},
{q:"Welche Zutat gehört zur klassischen Creme?",a:["Mascarpone.","Quark.","Sahnejoghurt."]},
{q:"Aus welcher Stadt soll es nach vielen Angaben stammen?",a:["Treviso.","Neapel.","Mailand."]},
{q:"Was ist bei der Zubereitung wegen der rohen Eier wichtig?",a:["Frisch zubereiten und gut kühlen.","Tagelang offen stehen lassen.","Erhitzen auf 100 Grad."]}
]},
{id:"N19",kind:"nerd",icon:"🥚",title:"Das erste Easter Egg der Spielegeschichte",card:"Warren Robinett versteckte 1979 im Atari-Spiel Adventure seinen Namen.",paras:[
"Easter Eggs sind versteckte Überraschungen in Spielen, Filmen und Programmen. Als eines der ersten bekannten gilt ein Raum im Atari-Spiel Adventure von 1979. Der Entwickler Warren Robinett versteckte darin seinen Namen. Atari erlaubte damals nicht, dass Entwickler in den Spielen genannt wurden.",
"Um zu dem geheimen Raum zu gelangen, musste man einen einzelnen, kaum sichtbaren Pixel im Spiel aufsammeln und damit zu einer bestimmten Wand gehen. Dort öffnete sich ein Raum, in dem in bunten Buchstaben der Name des Programmierers stand.",
"Atari entdeckte das Geheimnis erst nach der Auslieferung. Eine Rückholung wäre zu teuer gewesen, also ließ man es dabei. Aus dieser Geschichte stammt das Wort: Ein Atari-Verantwortlicher soll den Begriff Easter Egg geprägt haben, weil man Ostereier suchen muss. Heute gehören Easter Eggs zur Kultur von Spielen und Software."
],qs:[
{q:"In welchem Spiel steckt das berühmte frühe Easter Egg?",a:["Adventure von Atari.","Pac-Man.","Tetris."]},
{q:"Wer versteckte es?",a:["Warren Robinett.","Steve Jobs.","Shigeru Miyamoto."]},
{q:"Was versteckte er?",a:["Seinen Namen in einem geheimen Raum.","Eine Karte.","Ein Lied."]},
{q:"Warum tat er das?",a:["Entwickler wurden damals nicht in den Spielen genannt.","Er wollte Geld sparen.","Es war ein Fehler."]}
]},
{id:"N20",kind:"nerd",icon:"👾",title:"Die 80er: Von Pac-Man zum Game Boy",card:"Der Game Boy kam 1989 auf den Markt und wurde mit Tetris ausgeliefert.",paras:[
"Die 1980er Jahre waren das goldene Zeitalter der Spielhallen. 1980 erschien in Japan Pac-Man und wurde schnell zur weltweiten Ikone. Ein Jahr später stellte Nintendo Donkey Kong vor. In diesem Spiel tritt zum ersten Mal die Figur auf, die später als Mario berühmt wurde, damals noch unter dem Namen Jumpman.",
"Zu Hause eroberten Konsolen die Wohnzimmer. Nintendo brachte 1983 in Japan den Famicom heraus, der in Europa und den USA später als NES erschien. Gleichzeitig stiegen Heimcomputer wie der Commodore 64 zum Massenprodukt auf. Dieser Rechner wurde millionenfach verkauft und prägte viele Spieler.",
"1989 folgte der Game Boy, eine tragbare Konsole mit grünlichem Bildschirm. Das Spiel Tetris, das der Russe Alexei Paschitnow 1984 erfunden hatte, wurde mitgeliefert und machte das Gerät zum Welterfolg. Eine Generation wuchs mit diesen Pixeln auf, und die Nostalgie dafür ist bis heute groß."
],qs:[
{q:"In welchem Jahr erschien Pac-Man in Japan?",a:["1980.","1975.","1989."]},
{q:"Wie hieß Mario in Donkey Kong?",a:["Jumpman.","Luigi.","Wario."]},
{q:"Mit welchem Spiel wurde der Game Boy ausgeliefert?",a:["Tetris.","Pac-Man.","Pong."]},
{q:"Welcher Heimcomputer wurde millionenfach verkauft?",a:["Der Commodore 64.","Der Atari 2600.","Der Game Boy."]}
]},
{id:"N21",kind:"nerd",icon:"🎮",title:"Der Konami-Code",card:"Hoch, hoch, runter, runter, links, rechts, links, rechts, B, A: der Cheat, den fast jeder Spieler kennt.",paras:[
"Der Konami-Code ist die vielleicht berühmteste Tastenfolge der Spielegeschichte: Hoch, hoch, runter, runter, links, rechts, links, rechts, B, A, dazu Start. Entwickelt hat ihn Kazuhisa Hashimoto beim Spielehersteller Konami für die Umsetzung des Weltraum-Shooters Gradius auf Nintendos Konsole 1986.",
"Hashimoto fand das Spiel beim Testen zu schwer und baute sich eine Abkürzung ein, die ihn mit allen Waffen ausstattete. Eigentlich wollte er den Code vor der Veröffentlichung wieder entfernen. Er vergaß es, und so blieb er im Spiel. Spieler entdeckten ihn und verbreiteten ihn weltweit.",
"Konami baute den Code in viele weitere Spiele ein, zum Beispiel in Contra, wo er dem Spieler 30 Leben schenkt. Inzwischen steckt er in zahlreichen Webseiten und Programmen als Easter Egg. Auch in dieser Lern-App wartet ein Sticker auf alle, die ihn auf der Tastatur eingeben."
],qs:[
{q:"Wer entwickelte den Konami-Code?",a:["Kazuhisa Hashimoto.","Shigeru Miyamoto.","Alexei Paschitnow."]},
{q:"Für welches Spiel entstand er?",a:["Gradius.","Tetris.","Pong."]},
{q:"Warum baute er ihn ein?",a:["Er fand das Spiel beim Testen zu schwer.","Als Werbung.","Es war ein Befehl."]},
{q:"Wie viele Leben schenkt er in Contra?",a:["30.","3.","99."]}
]}
);
window.NERD.facts.push(
"Das erste Tiramisu-Rezept soll in den 1960er oder 1970er Jahren in Treviso aufgetaucht sein.",
"Hunde haben je nach Rasse 125 bis 300 Millionen Riechzellen, der Mensch nur etwa fünf bis sechs Millionen.",
"Laika flog am 3. November 1957 mit Sputnik 2 ins All.",
"Der Game Boy kam 1989 auf den Markt.",
"Das Wort Easter Egg stammt von versteckten Überraschungen, die schon 1979 in einem Atari-Spiel auftauchten."
);
window.PACKS=(window.PACKS||[]).concat([Object.assign({id:"nerd",order:1,course:"basic",icon:"🤓",name:"Nerd-Ecke",eyebrow:"Nerd-Ecke · Comics, Games und nutzloses Wissen",fact:"Nerd-Fakt des Tages",mins:"eine Minute",
  ranks:[["Kiosk-Gucker","👀"],["Heftchen-Leser","📖"],["Sammler","🎴"],["Kenner","🧐"],["Nerd","🤓"],["Nerd-Legende","👑"]],topic:""},window.NERD)]);
