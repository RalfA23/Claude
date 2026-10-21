// Lektionen Türkisch. Jede Lektion: Sätze [tr, de], ein Grammatik-Tipp, ein Dialog mit Rollen A/B, ein Lesetext mit Fragen und (Fortgeschritten) Sprechaufgaben.
// Stufe "a1" = Anfänger, "b1" = Fortgeschritten (A2 bis B1). Lückentexte und Übungsrunden entstehen aus den Sätzen.
window.TR_UNITS = [
{
  id: "selam", track: "a1", icon: "👋", title: "Begrüßen und verabschieden", tr: "Selamlaşma",
  tip: ["Aussprache in einem Satz", "Türkisch schreibt man, wie man spricht. c = dsch (cami), ç = tsch (çay), ş = sch (şeker), s immer scharf, z = weiches s, y = j. ı ohne Punkt ist ein dumpfes i. ğ spricht man nicht, es dehnt den Vokal davor. Mehr unter „Aussprache“ auf der Startseite."],
  phrases: [
    ["Merhaba!", "Hallo!"],
    ["Günaydın.", "Guten Morgen."],
    ["İyi akşamlar.", "Guten Abend."],
    ["Nasılsın?", "Wie geht es dir?"],
    ["İyiyim, teşekkür ederim.", "Mir geht es gut, danke."],
    ["Sen nasılsın?", "Und wie geht es dir?"],
    ["Hoşça kal!", "Mach's gut! (sagt, wer geht)"],
    ["Güle güle!", "Tschüss! (sagt, wer bleibt)"],
    ["Teşekkürler.", "Danke."],
    ["Rica ederim.", "Gern geschehen."]
  ],
  dialog: { title: "Morgens an der Haustür", roles: ["Nachbarin Ayşe", "Du"], lines: [
    ["A", "Günaydın! Nasılsın?", "Guten Morgen! Wie geht es dir?"],
    ["B", "Günaydın! İyiyim, teşekkür ederim. Sen nasılsın?", "Guten Morgen! Mir geht es gut, danke. Und dir?"],
    ["A", "Ben de iyiyim, sağ ol.", "Mir geht es auch gut, danke."],
    ["B", "Çok güzel! İyi günler!", "Sehr schön! Einen schönen Tag!"],
    ["A", "Sana da iyi günler!", "Dir auch einen schönen Tag!"]
  ]},
  text: { title: "Ayşe ve Mehmet",
    tr: "Ayşe İzmir'de oturuyor. Her sabah komşusuna günaydın diyor. Komşusunun adı Mehmet. Mehmet her zaman soruyor: Nasılsın, Ayşe? Ayşe de diyor: İyiyim, teşekkürler!",
    de: "Ayşe wohnt in Izmir. Jeden Morgen sagt sie ihrem Nachbarn guten Morgen. Der Nachbar heißt Mehmet. Mehmet fragt immer: Wie geht's, Ayşe? Und Ayşe sagt: Gut, danke!",
    questions: [
      ["Ayşe nerede oturuyor?", ["İzmir'de", "İstanbul'da", "Ankara'da"]],
      ["Komşunun adı ne?", ["Mehmet", "Ali", "Can"]],
      ["Ayşe ne diyor?", ["İyiyim, teşekkürler!", "Hoşça kal!", "Rica ederim."]]
    ]}
},
{
  id: "tanisma", track: "a1", icon: "🙋", title: "Sich vorstellen", tr: "Tanışma",
  tip: ["„Ich bin“ als Endung", "„Ich bin“ hängt man einfach an: Almanyalı + yım = Almanyalıyım (ich bin aus Deutschland), öğretmen + im = öğretmenim (ich bin Lehrer). Der Vokal der Endung passt sich dem Wort an: Das ist die Vokalharmonie, erklärt unter „Vokalharmonie & Endungen“."],
  phrases: [
    ["Benim adım Thomas.", "Mein Name ist Thomas."],
    ["Senin adın ne?", "Wie heißt du?"],
    ["Almanyalıyım.", "Ich komme aus Deutschland."],
    ["Hamburg'da oturuyorum.", "Ich wohne in Hamburg."],
    ["Nerelisin?", "Woher kommst du?"],
    ["Biraz Türkçe konuşuyorum.", "Ich spreche ein bisschen Türkisch."],
    ["Tanıştığımıza memnun oldum.", "Freut mich, dich kennenzulernen."],
    ["Tekrar eder misin?", "Kannst du das wiederholen?"],
    ["Daha yavaş konuşur musun?", "Kannst du langsamer sprechen?"],
    ["Anlamadım.", "Ich habe es nicht verstanden."]
  ],
  dialog: { title: "Auf einer Feier", roles: ["Elif", "Du"], lines: [
    ["A", "Merhaba, benim adım Elif. Senin adın ne?", "Hallo, ich heiße Elif. Wie heißt du?"],
    ["B", "Merhaba Elif, benim adım Thomas.", "Hallo Elif, ich heiße Thomas."],
    ["A", "Nerelisin?", "Woher kommst du?"],
    ["B", "Almanyalıyım. Hamburg'da oturuyorum.", "Ich komme aus Deutschland. Ich wohne in Hamburg."],
    ["A", "Türkçen çok iyi!", "Dein Türkisch ist sehr gut!"],
    ["B", "Teşekkürler, biraz Türkçe konuşuyorum.", "Danke, ich spreche ein bisschen Türkisch."],
    ["A", "Tanıştığımıza memnun oldum!", "Freut mich, dich kennenzulernen!"],
    ["B", "Ben de memnun oldum.", "Mich auch."]
  ]},
  text: { title: "Bu Murat",
    tr: "Bu Murat. Murat Türkiyeli ve Antalya'da oturuyor. Kırk yaşında ve bir otelde çalışıyor. Murat Türkçe, İngilizce ve biraz Almanca konuşuyor. Hafta sonu denizde yüzmeyi seviyor.",
    de: "Das ist Murat. Murat kommt aus der Türkei und wohnt in Antalya. Er ist vierzig Jahre alt und arbeitet in einem Hotel. Murat spricht Türkisch, Englisch und ein bisschen Deutsch. Am Wochenende schwimmt er gern im Meer.",
    questions: [
      ["Murat nerede oturuyor?", ["Antalya'da", "İzmir'de", "Bursa'da"]],
      ["Murat kaç yaşında?", ["Kırk yaşında", "Otuz yaşında", "Elli yaşında"]],
      ["Murat hafta sonu ne yapıyor?", ["Denizde yüzüyor", "Bisiklete biniyor", "Yemek pişiriyor"]]
    ]}
},
{
  id: "sayilar", track: "a1", icon: "🕒", title: "Zahlen und Uhrzeit", tr: "Sayılar ve saat",
  tip: ["Zahlen als Baukasten", "on (10) + bir (1) = on bir (11), yirmi beş (25), yüz elli (150). „Saat kaç?“ heißt „Wie spät ist es?“, „Saat kaçta?“ heißt „Um wie viel Uhr?“, Antwort: „Üçte.“ (um drei). Die Endung -de/-da/-te/-ta bedeutet „in, an, um“. Nach einer Zahl steht keine Mehrzahl: üç gün (drei Tage)."],
  phrases: [
    ["Bir, iki, üç, dört, beş.", "Eins, zwei, drei, vier, fünf."],
    ["Altı, yedi, sekiz, dokuz, on.", "Sechs, sieben, acht, neun, zehn."],
    ["Saat kaç?", "Wie spät ist es?"],
    ["Saat üç.", "Es ist drei Uhr."],
    ["Saat üç buçuk.", "Es ist halb vier."],
    ["Saat ikiyi çeyrek geçiyor.", "Es ist Viertel nach zwei."],
    ["Bu ne kadar?", "Wie viel kostet das?"],
    ["Beş lira.", "Fünf Lira."],
    ["Bugün pazartesi.", "Heute ist Montag."],
    ["Yarın salı.", "Morgen ist Dienstag."]
  ],
  dialog: { title: "Am Busbahnhof", roles: ["Reisende", "Du"], lines: [
    ["A", "Affedersiniz, saat kaç?", "Entschuldigung, wie spät ist es?"],
    ["B", "Saat iki buçuk.", "Es ist halb drei."],
    ["A", "Teşekkürler. İzmir otobüsü saat kaçta kalkıyor?", "Danke. Um wie viel Uhr fährt der Bus nach Izmir?"],
    ["B", "Saat üçü çeyrek geçe.", "Um Viertel nach drei."],
    ["A", "O zaman bir çay için vaktim var!", "Dann habe ich noch Zeit für einen Tee!"],
    ["B", "Evet, daha kırk beş dakika var.", "Ja, es sind noch fünfundvierzig Minuten."]
  ]},
  text: { title: "Ali'nin günü",
    tr: "Ali saat yedide kalkıyor. Yedi buçukta peynirli simit yiyor. Otobüs saat sekizde geliyor. Ali dokuzdan beşe kadar çalışıyor. Saat altıda tekrar evde.",
    de: "Ali steht um sieben Uhr auf. Um halb acht isst er einen Simit mit Käse. Der Bus kommt um acht Uhr. Ali arbeitet von neun bis fünf. Um sechs Uhr ist er wieder zu Hause.",
    questions: [
      ["Ali saat kaçta kalkıyor?", ["Saat yedide", "Saat sekizde", "Saat altıda"]],
      ["Ali ne yiyor?", ["Peynirli simit", "Yumurta", "Elma"]],
      ["Ali saat kaçta evde?", ["Saat altıda", "Saat beşte", "Saat dokuzda"]]
    ]}
},
{
  id: "cay", track: "a1", icon: "🍵", title: "Im Teegarten", tr: "Çay bahçesinde",
  tip: ["Fragen mit mı, mi, mu, mü", "Eine Ja-Nein-Frage bildet man mit dem Wörtchen mı nach dem gefragten Wort: „Baklava var mı?“ (Gibt es Baklava?), „Şekerli mi?“ (Mit Zucker?). Es folgt der großen Vokalharmonie: nach a/ı → mı, e/i → mi, o/u → mu, ö/ü → mü. Getrennt geschrieben, aber zusammen gesprochen."],
  phrases: [
    ["Ne içmek istersiniz?", "Was möchten Sie trinken?"],
    ["Bir çay alabilir miyim?", "Kann ich einen Tee bekommen?"],
    ["Bir Türk kahvesi, lütfen.", "Einen türkischen Kaffee, bitte."],
    ["Şekerli mi, şekersiz mi?", "Mit oder ohne Zucker?"],
    ["Orta şekerli, lütfen.", "Mittelsüß, bitte."],
    ["Baklava var mı?", "Gibt es Baklava?"],
    ["Hesap, lütfen.", "Die Rechnung, bitte."],
    ["Kartla ödeyebilir miyim?", "Kann ich mit Karte zahlen?"],
    ["Çok lezzetli!", "Sehr lecker!"],
    ["Şerefe!", "Prost!"]
  ],
  dialog: { title: "Bestellen", roles: ["Kellner", "Du"], lines: [
    ["A", "Hoş geldiniz! Ne içmek istersiniz?", "Willkommen! Was möchten Sie trinken?"],
    ["B", "Hoş bulduk. Bir Türk kahvesi, lütfen.", "Danke. Einen türkischen Kaffee, bitte."],
    ["A", "Şekerli mi, şekersiz mi?", "Mit oder ohne Zucker?"],
    ["B", "Orta şekerli, lütfen. Baklava var mı?", "Mittelsüß, bitte. Gibt es Baklava?"],
    ["A", "Var, fıstıklı baklava çok taze.", "Ja, die Pistazien-Baklava ist ganz frisch."],
    ["B", "Harika, bir porsiyon lütfen!", "Prima, eine Portion bitte!"],
    ["A", "Buyurun. Afiyet olsun!", "Bitte schön. Guten Appetit!"],
    ["B", "Teşekkürler. Sonra hesabı alabilir miyim?", "Danke. Kann ich nachher die Rechnung bekommen?"]
  ]},
  text: { title: "Çay kültürü",
    tr: "Türkiye'de insanlar çok çay içiyor. Çay küçük ince belli bardaklarda geliyor. Misafire hemen bir çay ikram ediliyor. Çay bahçelerinde arkadaşlar saatlerce oturup sohbet ediyor.",
    de: "In der Türkei trinken die Menschen viel Tee. Der Tee kommt in kleinen, taillierten Gläsern. Einem Gast bietet man sofort einen Tee an. In Teegärten sitzen Freunde stundenlang zusammen und unterhalten sich.",
    questions: [
      ["Türkiye'de insanlar ne içiyor?", ["Çok çay", "Az kahve", "Sadece su"]],
      ["Çay neyde geliyor?", ["Küçük bardaklarda", "Büyük fincanlarda", "Şişelerde"]],
      ["Çay bahçelerinde arkadaşlar ne yapıyor?", ["Sohbet ediyor", "Çalışıyor", "Uyuyor"]]
    ]}
},
{
  id: "pazar", track: "a1", icon: "🍅", title: "Auf dem Markt", tr: "Pazarda",
  tip: ["Mehrzahl mit -ler / -lar", "Die Mehrzahl ist eine Endung: elma → elmalar (Äpfel), ev → evler (Häuser). Nach a, ı, o, u kommt -lar, nach e, i, ö, ü kommt -ler. Nach einer Zahl oder „biraz“ bleibt das Wort in der Einzahl: iki kilo domates, üç elma."],
  phrases: [
    ["Domates ne kadar?", "Was kosten die Tomaten?"],
    ["Kilosu otuz lira.", "Das Kilo kostet dreißig Lira."],
    ["İki kilo domates istiyorum.", "Ich möchte zwei Kilo Tomaten."],
    ["Biraz peynir alabilir miyim?", "Kann ich etwas Käse bekommen?"],
    ["Bunlar taze mi?", "Sind die frisch?"],
    ["Başka bir şey?", "Sonst noch etwas?"],
    ["Hayır, bu kadar.", "Nein, das ist alles."],
    ["Çok pahalı!", "Zu teuer!"],
    ["Biraz indirim yapar mısınız?", "Können Sie mir etwas nachlassen?"],
    ["Poşet ister misiniz?", "Möchten Sie eine Tüte?"]
  ],
  dialog: { title: "Am Gemüsestand", roles: ["Händler", "Du"], lines: [
    ["A", "Buyurun, ne istersiniz?", "Bitte schön, was möchten Sie?"],
    ["B", "Domates ne kadar?", "Was kosten die Tomaten?"],
    ["A", "Kilosu otuz lira. Çok taze!", "Das Kilo dreißig Lira. Ganz frisch!"],
    ["B", "İki kilo domates istiyorum. Biraz peynir de alabilir miyim?", "Ich möchte zwei Kilo Tomaten. Kann ich auch etwas Käse bekommen?"],
    ["A", "Tabii. Başka bir şey?", "Natürlich. Sonst noch etwas?"],
    ["B", "Hayır, bu kadar. Ne kadar oldu?", "Nein, das ist alles. Was macht das?"],
    ["A", "Toplam yüz lira.", "Zusammen hundert Lira."],
    ["B", "Buyurun. İyi günler!", "Bitte schön. Einen schönen Tag!"]
  ]},
  text: { title: "Semt pazarı",
    tr: "Birçok şehirde haftada bir gün pazar kuruluyor. Orada meyve, sebze, peynir ve zeytin satılıyor. Satıcılar yüksek sesle bağırıyor. Fiyatlar marketten genellikle daha ucuz. Pazarlık yapmak da normal.",
    de: "In vielen Städten gibt es einmal pro Woche einen Markt. Dort werden Obst, Gemüse, Käse und Oliven verkauft. Die Händler rufen laut. Die Preise sind meist günstiger als im Supermarkt. Handeln ist auch normal.",
    questions: [
      ["Pazar ne sıklıkla kuruluyor?", ["Haftada bir gün", "Her gün", "Yılda bir"]],
      ["Pazarda ne satılıyor?", ["Meyve ve sebze", "Araba", "Kitap"]],
      ["Fiyatlar nasıl?", ["Daha ucuz", "Daha pahalı", "Aynı"]]
    ]}
},
{
  id: "yol", track: "a1", icon: "🧭", title: "Nach dem Weg fragen", tr: "Yol sormak",
  tip: ["Wo, woher, wohin", "Ortsangaben sind Endungen: -de/-da = in, an (İstanbul'da = in Istanbul), -den/-dan = von, aus (sokaktan = aus der Straße), -e/-a = nach, zu (sola = nach links, eve = nach Hause). Nach harten Lauten (f, s, t, k, ç, ş, h, p) wird d zu t: otobüste, kitaptan."],
  phrases: [
    ["Affedersiniz, istasyon nerede?", "Entschuldigung, wo ist der Bahnhof?"],
    ["Düz gidin.", "Gehen Sie geradeaus."],
    ["Sağa dönün.", "Biegen Sie rechts ab."],
    ["Sola dönün.", "Biegen Sie links ab."],
    ["İkinci sokaktan sola.", "Die zweite Straße links."],
    ["Uzak mı?", "Ist es weit?"],
    ["Hayır, yakın. Beş dakika.", "Nein, es ist nah. Fünf Minuten."],
    ["Burada bir eczane var mı?", "Gibt es hier eine Apotheke?"],
    ["Müze köprünün yanında.", "Das Museum ist neben der Brücke."],
    ["Kayboldum.", "Ich habe mich verlaufen."]
  ],
  dialog: { title: "In Istanbul verlaufen", roles: ["Passantin", "Du"], lines: [
    ["A", "Yardımcı olabilir miyim?", "Kann ich helfen?"],
    ["B", "Evet, lütfen. Kayboldum. Galata Kulesi nerede?", "Ja, bitte. Ich habe mich verlaufen. Wo ist der Galataturm?"],
    ["A", "Düz gidin, sonra ikinci sokaktan sola dönün.", "Gehen Sie geradeaus, dann die zweite Straße links."],
    ["B", "Uzak mı?", "Ist es weit?"],
    ["A", "Hayır, yakın. Yürüyerek on dakika.", "Nein, nah. Zu Fuß zehn Minuten."],
    ["B", "Çok teşekkür ederim!", "Vielen Dank!"],
    ["A", "Rica ederim. İyi geziler!", "Gern. Viel Spaß beim Erkunden!"]
  ]},
  text: { title: "İstanbul'da bir gün",
    tr: "İstanbul çok büyük bir şehir. Şehrin ortasında Boğaz var. Bir tarafı Avrupa, diğer tarafı Asya. İnsanlar vapurla bir taraftan diğerine geçiyor. Vapurda çay içip martılara simit atıyorlar.",
    de: "Istanbul ist eine sehr große Stadt. In der Mitte der Stadt liegt der Bosporus. Eine Seite ist Europa, die andere Asien. Die Menschen fahren mit der Fähre von einer Seite zur anderen. Auf der Fähre trinken sie Tee und werfen den Möwen Simit zu.",
    questions: [
      ["Şehrin ortasında ne var?", ["Boğaz", "Bir dağ", "Bir göl"]],
      ["İnsanlar neyle geçiyor?", ["Vapurla", "Uçakla", "Trenle"]],
      ["Vapurda ne içiyorlar?", ["Çay", "Kahve", "Ayran"]]
    ]}
},
{
  id: "aile", track: "a1", icon: "👨‍👩‍👧", title: "Familie", tr: "Aile",
  tip: ["Mein, dein: -(i)m, -(i)n", "Besitz ist eine Endung: anne → annem (meine Mutter), annen (deine Mutter); ev → evim (mein Haus). Nach Konsonant kommt ein Bindevokal nach der Vokalharmonie: kız → kızım, göz → gözüm. Auf k endende Wörter werden weich: çocuk → çocuğum. „Ich habe“ heißt wörtlich „mein … ist vorhanden“: İki çocuğum var."],
  phrases: [
    ["Evli misin?", "Bist du verheiratet?"],
    ["Evet, evliyim.", "Ja, ich bin verheiratet."],
    ["İki çocuğum var.", "Ich habe zwei Kinder."],
    ["Bir kızım ve bir oğlum var.", "Ich habe eine Tochter und einen Sohn."],
    ["Kardeşin var mı?", "Hast du Geschwister?"],
    ["Bir ağabeyim var.", "Ich habe einen älteren Bruder."],
    ["Annem öğretmen.", "Meine Mutter ist Lehrerin."],
    ["Babam emekli.", "Mein Vater ist Rentner."],
    ["Ailem Hamburg'da oturuyor.", "Meine Familie wohnt in Hamburg."],
    ["Bu benim eşim.", "Das ist meine Frau. (oder: mein Mann)"]
  ],
  dialog: { title: "Fotos zeigen", roles: ["Zeynep", "Du"], lines: [
    ["A", "Bu fotoğraftaki kim?", "Wer ist auf diesem Foto?"],
    ["B", "Bu benim eşim, bunlar da çocuklarım.", "Das ist meine Frau, und das sind meine Kinder."],
    ["A", "Ne kadar tatlılar! Kaç yaşındalar?", "Wie süß! Wie alt sind sie?"],
    ["B", "Kızım on, oğlum yedi yaşında.", "Meine Tochter ist zehn, mein Sohn sieben."],
    ["A", "Kardeşin var mı?", "Hast du Geschwister?"],
    ["B", "Evet, bir ağabeyim var. O İstanbul'da oturuyor.", "Ja, ich habe einen älteren Bruder. Er wohnt in Istanbul."]
  ]},
  text: { title: "Büyük bir aile",
    tr: "Selin'in ailesi büyük. Annesi, babası ve iki kız kardeşi var. Büyükannesi de onlarla birlikte oturuyor. Bayramda bütün akrabalar geliyor. O zaman evde çok yemek ve çok kahkaha var.",
    de: "Selins Familie ist groß. Sie hat Mutter, Vater und zwei Schwestern. Ihre Großmutter wohnt auch bei ihnen. Zum Fest kommen alle Verwandten. Dann gibt es zu Hause viel Essen und viel Gelächter.",
    questions: [
      ["Selin'in kaç kız kardeşi var?", ["İki", "Bir", "Üç"]],
      ["Kim onlarla birlikte oturuyor?", ["Büyükannesi", "Amcası", "Komşusu"]],
      ["Bayramda kim geliyor?", ["Bütün akrabalar", "Sadece arkadaşlar", "Kimse"]]
    ]}
},
{
  id: "otel", track: "a1", icon: "🏨", title: "Im Hotel", tr: "Otelde",
  tip: ["Höflich mit Siz", "Fremde spricht man mit „siz“ (Sie) an, die Verbendung ist dann -siniz/-sınız: Kalacak mısınız? (Werden Sie bleiben?). Unter Freunden sagt man „sen“ (du). Odanız = Ihr Zimmer, odan = dein Zimmer. Bay Weber = Herr Weber, Bayan Weber = Frau Weber."],
  phrases: [
    ["Rezervasyonum var.", "Ich habe eine Reservierung."],
    ["Adım Weber.", "Mein Name ist Weber."],
    ["Boş odanız var mı?", "Haben Sie ein freies Zimmer?"],
    ["Kaç gece kalacaksınız?", "Wie viele Nächte bleiben Sie?"],
    ["Üç gece.", "Drei Nächte."],
    ["Kahvaltı dahil mi?", "Ist das Frühstück inklusive?"],
    ["Kahvaltı saat kaçta?", "Um wie viel Uhr ist Frühstück?"],
    ["İnternet şifresi ne?", "Wie ist das WLAN-Passwort?"],
    ["Klima çalışmıyor.", "Die Klimaanlage funktioniert nicht."],
    ["Anahtarı alabilir miyim?", "Kann ich den Schlüssel haben?"]
  ],
  dialog: { title: "An der Rezeption", roles: ["Rezeptionist", "Du"], lines: [
    ["A", "İyi akşamlar, hoş geldiniz!", "Guten Abend, willkommen!"],
    ["B", "İyi akşamlar. Rezervasyonum var, adım Weber.", "Guten Abend. Ich habe eine Reservierung, mein Name ist Weber."],
    ["A", "Evet, Bay Weber. Üç gece, değil mi?", "Ja, Herr Weber. Drei Nächte, nicht wahr?"],
    ["B", "Evet. Kahvaltı dahil mi?", "Ja. Ist das Frühstück inklusive?"],
    ["A", "Evet, kahvaltı yedi ile on arası.", "Ja, Frühstück gibt es zwischen sieben und zehn."],
    ["B", "Harika. İnternet şifresi ne?", "Prima. Wie ist das WLAN-Passwort?"],
    ["A", "Şifre kartta yazıyor. Odanız üçüncü katta.", "Das Passwort steht auf der Karte. Ihr Zimmer ist im dritten Stock."],
    ["B", "Teşekkür ederim. İyi geceler!", "Danke. Gute Nacht!"]
  ]},
  text: { title: "Türk kahvaltısı",
    tr: "Türk kahvaltısı çok zengin. Masada peynir, zeytin, domates, salatalık, bal ve tereyağı var. Yumurta da sık sık yeniyor. Yanında taze ekmek ve tabii ki çay var. Hafta sonu aileler saatlerce kahvaltı ediyor.",
    de: "Das türkische Frühstück ist sehr reichhaltig. Auf dem Tisch gibt es Käse, Oliven, Tomaten, Gurken, Honig und Butter. Auch Eier isst man oft. Dazu gibt es frisches Brot und natürlich Tee. Am Wochenende frühstücken Familien stundenlang.",
    questions: [
      ["Masada ne var?", ["Peynir ve zeytin", "Pizza", "Makarna"]],
      ["Yanında ne var?", ["Taze ekmek ve çay", "Bira", "Süt ve kek"]],
      ["Hafta sonu aileler ne yapıyor?", ["Saatlerce kahvaltı ediyor", "Erken işe gidiyor", "Hiç yemek yemiyor"]]
    ]}
},
{
  id: "lokanta", track: "a1", icon: "🍽️", title: "Im Restaurant", tr: "Lokantada",
  tip: ["Verneinung mit -me / -ma", "Verneint wird mit einer Endung direkt am Verbstamm: yiyorum (ich esse) → yemiyorum (ich esse nicht), istiyorum → istemiyorum. In Sätzen ohne Verb sagt man değil: Acı değil (nicht scharf). „Es gibt nicht“ heißt yok: Et yok (kein Fleisch da)."],
  phrases: [
    ["İki kişilik bir masa, lütfen.", "Einen Tisch für zwei, bitte."],
    ["Menüyü alabilir miyim?", "Kann ich die Speisekarte haben?"],
    ["Ne tavsiye edersiniz?", "Was empfehlen Sie?"],
    ["Ben köfte alayım.", "Ich nehme Köfte."],
    ["Et yemiyorum.", "Ich esse kein Fleisch."],
    ["Vejetaryen yemeğiniz var mı?", "Haben Sie vegetarische Gerichte?"],
    ["Acı mı?", "Ist das scharf?"],
    ["Bir ayran, lütfen.", "Ein Ayran, bitte."],
    ["Ellerinize sağlık!", "Das war köstlich! (wörtlich: Gesundheit Ihren Händen)"],
    ["Ayrı ayrı ödeyebilir miyiz?", "Können wir getrennt zahlen?"]
  ],
  dialog: { title: "Mittagessen", roles: ["Kellner", "Du"], lines: [
    ["A", "Hoş geldiniz! Kaç kişisiniz?", "Willkommen! Wie viele Personen sind Sie?"],
    ["B", "İki kişiyiz. Menüyü alabilir miyim?", "Wir sind zu zweit. Kann ich die Speisekarte haben?"],
    ["A", "Tabii, buyurun. Bugün mercimek çorbası çok güzel.", "Natürlich, bitte. Heute ist die Linsensuppe sehr gut."],
    ["B", "Et yemiyorum. Ne tavsiye edersiniz?", "Ich esse kein Fleisch. Was empfehlen Sie?"],
    ["A", "O zaman imam bayıldı tavsiye ederim.", "Dann empfehle ich Imam Bayıldı."],
    ["B", "Acı mı?", "Ist das scharf?"],
    ["A", "Hayır, hiç acı değil.", "Nein, gar nicht scharf."],
    ["B", "Güzel, bir imam bayıldı ve bir ayran lütfen.", "Gut, einmal Imam Bayıldı und ein Ayran bitte."]
  ]},
  text: { title: "Lokanta",
    tr: "Lokanta, ev yemeği yapan küçük bir restoran. Yemekler vitrinde duruyor ve müşteri gösterip seçiyor. Öğle yemeğinde çalışanlar buraya geliyor. Mercimek çorbası, kuru fasulye ve pilav en sevilen yemeklerden. Fiyatlar uygun ve yemekler taze.",
    de: "Eine Lokanta ist ein kleines Restaurant mit Hausmannskost. Die Gerichte stehen in der Vitrine, der Gast zeigt darauf und wählt. Mittags kommen die Berufstätigen hierher. Linsensuppe, weiße Bohnen und Reis gehören zu den beliebtesten Gerichten. Die Preise sind günstig und das Essen ist frisch.",
    questions: [
      ["Yemekler nerede duruyor?", ["Vitrinde", "Mutfakta", "Masada"]],
      ["Öğlen kim geliyor?", ["Çalışanlar", "Turistler", "Çocuklar"]],
      ["Fiyatlar nasıl?", ["Uygun", "Çok pahalı", "Belli değil"]]
    ]}
},
{
  id: "gunluk", track: "a1", icon: "☀️", title: "Mein Alltag", tr: "Günlük hayat",
  tip: ["Gegenwart mit -iyor", "Die Verlaufsform -iyor ist die wichtigste Zeit: gel-iyor-um (ich komme), yap-ıyor-um (ich mache), otur-uyor-um (ich wohne), gör-üyor-um (ich sehe). Der Vokal vor -yor folgt der großen Vokalharmonie. Danach die Person: -um (ich), -sun (du), nichts (er/sie), -uz (wir), -sunuz (ihr/Sie), -lar (sie)."],
  phrases: [
    ["Her sabah yedide kalkıyorum.", "Ich stehe jeden Morgen um sieben auf."],
    ["Önce bir çay içiyorum.", "Zuerst trinke ich einen Tee."],
    ["İşe otobüsle gidiyorum.", "Ich fahre mit dem Bus zur Arbeit."],
    ["Öğlen arkadaşlarımla yemek yiyorum.", "Mittags esse ich mit meinen Freunden."],
    ["Akşam spor yapıyorum.", "Abends mache ich Sport."],
    ["Hafta sonu uzun uyuyorum.", "Am Wochenende schlafe ich lange."],
    ["Kitap okumayı seviyorum.", "Ich lese gern Bücher."],
    ["Bazen sinemaya gidiyoruz.", "Manchmal gehen wir ins Kino."],
    ["Saat on birde yatıyorum.", "Um elf Uhr gehe ich ins Bett."],
    ["Bugün çok yorgunum.", "Heute bin ich sehr müde."]
  ],
  dialog: { title: "Pläne fürs Wochenende", roles: ["Freund Can", "Du"], lines: [
    ["A", "Hafta sonu ne yapıyorsun?", "Was machst du am Wochenende?"],
    ["B", "Cumartesi uzun uyuyorum, sonra spor yapıyorum.", "Am Samstag schlafe ich lange, dann mache ich Sport."],
    ["A", "Pazar günü sinemaya gidelim mi?", "Sollen wir am Sonntag ins Kino gehen?"],
    ["B", "Olur! Saat kaçta?", "Gern! Um wie viel Uhr?"],
    ["A", "Akşam yedide nasıl?", "Wie wäre es um sieben Uhr abends?"],
    ["B", "Tamam, yedide görüşürüz!", "Okay, wir sehen uns um sieben!"]
  ]},
  text: { title: "Deniz'in haftası",
    tr: "Deniz bir bankada çalışıyor. Pazartesiden cumaya kadar sabah sekizde evden çıkıyor. İşe metroyla gidiyor. Akşamları yüzmeye gidiyor ya da kitap okuyor. Pazar günü ailesini ziyaret ediyor.",
    de: "Deniz arbeitet in einer Bank. Von Montag bis Freitag verlässt sie um acht Uhr morgens das Haus. Sie fährt mit der U-Bahn zur Arbeit. Abends geht sie schwimmen oder liest ein Buch. Am Sonntag besucht sie ihre Familie.",
    questions: [
      ["Deniz nerede çalışıyor?", ["Bir bankada", "Bir okulda", "Bir hastanede"]],
      ["Deniz işe neyle gidiyor?", ["Metroyla", "Arabayla", "Bisikletle"]],
      ["Pazar günü ne yapıyor?", ["Ailesini ziyaret ediyor", "Çalışıyor", "Alışverişe gidiyor"]]
    ]}
},
{
  id: "randevu", track: "b1", icon: "📞", title: "Termine am Telefon", tr: "Randevu almak",
  tip: ["Können: -ebil / -abil", "„Können“ ist eine Endung am Verb: gel-ebil-ir-im (ich kann kommen), ertele-yebil-ir miyiz? (können wir verschieben?). Nach Vokal kommt ein y dazwischen. Verneint fällt -bil weg: gelemem (ich kann nicht kommen), bakamıyorum (ich kann gerade nicht schauen)."],
  phrases: [
    ["Randevu almak istiyorum.", "Ich möchte einen Termin vereinbaren."],
    ["Perşembe öğleden sonra size uyar mı?", "Passt Ihnen Donnerstagnachmittag?"],
    ["Maalesef o gün müsait değilim.", "Leider habe ich an dem Tag keine Zeit."],
    ["Randevuyu erteleyebilir miyiz?", "Können wir den Termin verschieben?"],
    ["Sizi birazdan geri ararım.", "Ich rufe Sie gleich zurück."],
    ["Kiminle görüşüyorum?", "Mit wem spreche ich?"],
    ["Bir mesaj bırakabilir miyim?", "Kann ich eine Nachricht hinterlassen?"],
    ["Bugün telefona pek bakamıyorum.", "Heute komme ich kaum ans Telefon."],
    ["Gelecek hafta buluşalım mı?", "Sollen wir uns nächste Woche treffen?"],
    ["Size bir davetiye gönderirim.", "Ich schicke Ihnen eine Einladung."]
  ],
  dialog: { title: "Anruf in der Kanzlei", roles: ["Sekretärin Ebru", "Du"], lines: [
    ["A", "Yılmaz Hukuk Bürosu, ben Ebru, buyurun.", "Kanzlei Yılmaz, hier ist Ebru, bitte schön."],
    ["B", "Günaydın, ben Thomas Weber. Yılmaz Bey'den randevu almak istiyorum.", "Guten Morgen, hier ist Thomas Weber. Ich möchte einen Termin bei Herrn Yılmaz."],
    ["A", "Tabii. Salı saat onda size uyar mı?", "Gern. Passt Ihnen Dienstag um zehn Uhr?"],
    ["B", "Maalesef o saatte müsait değilim. Öğleden sonra olabilir mi?", "Leider habe ich um diese Zeit keine Zeit. Geht es auch nachmittags?"],
    ["A", "Saat iki buçukta boş zamanı var.", "Um halb drei hat er Zeit."],
    ["B", "Mükemmel, not alıyorum.", "Perfekt, ich notiere es."],
    ["A", "Peki. Salı günü görüşmek üzere, Weber Bey!", "Gut. Bis Dienstag, Herr Weber!"]
  ]},
  text: { title: "Esnek planlar",
    tr: "Türkiye'de insanlar planlarını genellikle esnek yapıyor. Arkadaşlar çoğu zaman aynı gün buluşmaya karar veriyor. Biri arayıp akşam müsait olup olmadığını soruyor. Misafir habersiz de gelebilir ve her zaman bir çay hazır. İş hayatında ise randevulara daha çok dikkat ediliyor.",
    de: "In der Türkei planen die Menschen meist flexibel. Freunde entscheiden oft am selben Tag, sich zu treffen. Jemand ruft an und fragt, ob man abends Zeit hat. Ein Gast kann auch unangemeldet kommen, und ein Tee ist immer bereit. Im Berufsleben achtet man dagegen mehr auf Termine.",
    questions: [
      ["Arkadaşlar ne zaman buluşmaya karar veriyor?", ["Çoğu zaman aynı gün", "Aylar önce", "Hiçbir zaman"]],
      ["Habersiz kim gelebilir?", ["Misafir", "Patron", "Doktor"]],
      ["Nerede randevulara daha çok dikkat ediliyor?", ["İş hayatında", "Çay bahçesinde", "Pazarda"]]
    ]},
  speak: [
    ["Gelecek hafta neler planladığını anlat.", "Erzähl, was du nächste Woche geplant hast.", "Pazartesi ofiste çalışıyorum. Salı akşamı spora gidiyorum. Çarşamba dişçide randevum var ve hafta sonu arkadaşlarımı ziyaret ediyorum."],
    ["Bir randevuyu ertelemen lazım. Ara ve nedenini açıkla.", "Du musst einen Termin verschieben. Ruf an und erkläre warum.", "Günaydın, ben Thomas Weber. Yarın saat onda randevum var ama maalesef müsait değilim, çünkü işte önemli bir toplantım var. Randevuyu perşembeye erteleyebilir miyiz?"]
  ]
},
{
  id: "is", track: "b1", icon: "💼", title: "Über die Arbeit sprechen", tr: "İş hayatı",
  tip: ["Als, weil, gefallen", "„Als“ (Beruf) heißt olarak: avukat olarak (als Anwalt). „Weil“ ist am einfachsten mit çünkü: Seviyorum, çünkü ilginç. „Mir gefällt“ sagt man mit hoşuma gidiyor (wörtlich: es geht in mein Gefallen). Verben als Nomen: ders vermek (unterrichten) → ders vermeyi seviyorum (ich unterrichte gern)."],
  phrases: [
    ["Ne iş yapıyorsun?", "Was arbeitest du?"],
    ["Bir şirkette avukat olarak çalışıyorum.", "Ich arbeite als Anwalt in einer Firma."],
    ["Ayrıca üniversitede ders veriyorum.", "Außerdem unterrichte ich an der Universität."],
    ["Haftada iki gün evden çalışıyorum.", "Ich arbeite zwei Tage pro Woche von zu Hause."],
    ["Bu hafta işim çok yoğun.", "Diese Woche habe ich sehr viel zu tun."],
    ["Yarın bir toplantımız var.", "Wir haben morgen eine Besprechung."],
    ["Bana bu konuda yardım edebilir misin?", "Kannst du mir dabei helfen?"],
    ["Son tarih cuma.", "Die Frist ist Freitag."],
    ["İş arkadaşlarım çok iyi.", "Meine Kollegen sind sehr nett."],
    ["İşimi ilginç buluyorum ama bazen stresli.", "Ich finde meine Arbeit interessant, aber manchmal stressig."]
  ],
  dialog: { title: "In der Teepause", roles: ["Kollege Emre", "Du"], lines: [
    ["A", "Sen aslında ne iş yapıyorsun?", "Was arbeitest du eigentlich?"],
    ["B", "Avukatım. Bir şirkette çalışıyorum, ayrıca ders veriyorum.", "Ich bin Anwalt. Ich arbeite in einer Firma und unterrichte außerdem."],
    ["A", "İlginç! Evden çok çalışıyor musun?", "Interessant! Arbeitest du viel von zu Hause?"],
    ["B", "Haftada iki gün. Diğer günler ofisteyim.", "Zwei Tage pro Woche. An den anderen Tagen bin ich im Büro."],
    ["A", "İşinde en çok neyi seviyorsun?", "Was magst du an deiner Arbeit am meisten?"],
    ["B", "Ders vermeyi. Öğrencilerle çalışmak hoşuma gidiyor.", "Das Unterrichten. Mit Studierenden zu arbeiten gefällt mir."]
  ]},
  text: { title: "Türkiye'de çalışma hayatı",
    tr: "Türkiye'de birçok insan haftada beş, bazen altı gün çalışıyor. Öğle yemeği genellikle sıcak bir yemek. İş yerinde çay her zaman var; bazı ofislerde çaycı bile çalışıyor. Büyük şehirlerde trafik yüzünden işe gitmek uzun sürebiliyor.",
    de: "In der Türkei arbeiten viele Menschen fünf, manchmal sechs Tage pro Woche. Das Mittagessen ist meist eine warme Mahlzeit. Am Arbeitsplatz gibt es immer Tee; in manchen Büros arbeitet sogar ein eigener Teemann. In großen Städten kann der Weg zur Arbeit wegen des Verkehrs lange dauern.",
    questions: [
      ["Bazı insanlar haftada kaç gün çalışıyor?", ["Altı gün", "İki gün", "Bir gün"]],
      ["Öğle yemeği genellikle nasıl?", ["Sıcak bir yemek", "Sadece kahve", "Bir sandviç"]],
      ["Büyük şehirlerde işe gitmek neden uzun sürüyor?", ["Trafik yüzünden", "Yağmur yüzünden", "Tatil yüzünden"]]
    ]},
  speak: [
    ["İşini anlat: ne yapıyorsun, neyi seviyorsun?", "Beschreibe deine Arbeit: Was machst du, was magst du daran?", "Bir şirkette avukat olarak çalışıyorum. Genellikle ofiste çalışıyorum ama bazen evden de çalışıyorum. En çok ders vermeyi seviyorum, çünkü öğrencilerle çalışmak çok güzel."],
    ["Normal bir iş gününü anlat.", "Beschreibe einen normalen Arbeitstag.", "Sabah yedide kalkıyorum ve kahvaltı ediyorum. Sekiz buçukta ofise gidiyorum. Öğlen iş arkadaşlarımla yemek yiyoruz. Akşam altıda eve dönüyorum."]
  ]
},
{
  id: "doktor", track: "b1", icon: "🩺", title: "Beim Arzt", tr: "Doktorda",
  tip: ["Seit: -dir", "„Seit drei Tagen“ heißt üç gündür: Zeitangabe + -dir/-dır/-dur/-dür, nach harten Lauten -tir: bir haftadır (seit einer Woche), dün akşamdan beri (seit gestern Abend). Körperteile mit Besitzendung: başım ağrıyor (mein Kopf tut weh), dişim ağrıyor (mein Zahn tut weh)."],
  phrases: [
    ["Kendimi iyi hissetmiyorum.", "Ich fühle mich nicht gut."],
    ["Başım ağrıyor.", "Ich habe Kopfschmerzen."],
    ["Üç gündür öksürüyorum.", "Ich huste seit drei Tagen."],
    ["Ateşim var.", "Ich habe Fieber."],
    ["Ne zamandan beri?", "Seit wann?"],
    ["Herhangi bir ilaca alerjiniz var mı?", "Sind Sie gegen ein Medikament allergisch?"],
    ["Size bir ilaç yazıyorum.", "Ich verschreibe Ihnen ein Medikament."],
    ["Günde üç kez yemekten sonra alın.", "Nehmen Sie es dreimal täglich nach dem Essen."],
    ["Bol su için ve dinlenin.", "Trinken Sie viel Wasser und ruhen Sie sich aus."],
    ["Geçmiş olsun!", "Gute Besserung!"]
  ],
  dialog: { title: "In der Sprechstunde", roles: ["Ärztin", "Du"], lines: [
    ["A", "Buyurun, şikâyetiniz ne?", "Bitte, was fehlt Ihnen?"],
    ["B", "Kendimi iyi hissetmiyorum. Başım ağrıyor ve öksürüyorum.", "Ich fühle mich nicht gut. Ich habe Kopfschmerzen und huste."],
    ["A", "Ne zamandan beri?", "Seit wann?"],
    ["B", "Üç gündür. Dün akşam ateşim de vardı.", "Seit drei Tagen. Gestern Abend hatte ich auch Fieber."],
    ["A", "Herhangi bir ilaca alerjiniz var mı?", "Sind Sie gegen ein Medikament allergisch?"],
    ["B", "Hayır, yok.", "Nein."],
    ["A", "Size bir şurup yazıyorum. Günde üç kez alın. Geçmiş olsun!", "Ich verschreibe Ihnen einen Saft. Nehmen Sie ihn dreimal täglich. Gute Besserung!"],
    ["B", "Teşekkür ederim, doktor hanım.", "Danke, Frau Doktor."]
  ]},
  text: { title: "Eczane",
    tr: "Türkiye'de çok sayıda eczane var ve eczacılar iyi tavsiye veriyor. Hafif hastalıklarda insanlar önce eczaneye gidiyor. Gece ve hafta sonu nöbetçi eczane açık. Hangi eczanenin nöbetçi olduğu her eczanenin kapısında yazıyor.",
    de: "In der Türkei gibt es sehr viele Apotheken, und die Apotheker beraten gut. Bei leichten Krankheiten gehen die Menschen zuerst in die Apotheke. Nachts und am Wochenende hat eine Notdienst-Apotheke geöffnet. Welche Apotheke Notdienst hat, steht an der Tür jeder Apotheke.",
    questions: [
      ["Hafif hastalıklarda insanlar önce nereye gidiyor?", ["Eczaneye", "Hastaneye", "Plaja"]],
      ["Gece hangi eczane açık?", ["Nöbetçi eczane", "Hiçbiri", "Hepsi"]],
      ["Bu bilgi nerede yazıyor?", ["Eczanenin kapısında", "Gazetede", "Otobüste"]]
    ]},
  speak: [
    ["Doktora şikâyetlerini anlat.", "Beschreibe der Ärztin deine Beschwerden.", "Merhaba doktor hanım. İki gündür kendimi iyi hissetmiyorum. Başım ağrıyor, boğazım da ağrıyor. Dün akşam biraz ateşim vardı. Bir ilaç alabilir miyim?"],
    ["Hasta olduğunu işe bildir.", "Melde dich bei der Arbeit krank.", "Merhaba, ben Thomas. Maalesef bugün işe gelemiyorum, çünkü hastayım. Ateşim var ve doktora gidiyorum. Yarın tekrar haber veririm."]
  ]
},
{
  id: "tatil", track: "b1", icon: "🎈", title: "Vom Urlaub erzählen", tr: "Tatil anıları",
  tip: ["Vergangenheit mit -di", "Die Vergangenheit hängt -di an den Verbstamm, mit großer Vokalharmonie (-dı, -di, -du, -dü) und nach harten Lauten -ti: git-ti-m (ich ging), kal-dı-k (wir blieben), uç-tu-k (wir flogen), gör-dü-n (du sahst). Auch „war“ geht so: sıcak-tı (es war heiß), güzel-di (es war schön)."],
  phrases: [
    ["Geçen yaz Türkiye'ye gittim.", "Letzten Sommer bin ich in die Türkei gefahren."],
    ["İki hafta Kapadokya'da kaldık.", "Wir sind zwei Wochen in Kappadokien geblieben."],
    ["Balonla uçtuk.", "Wir sind mit dem Ballon geflogen."],
    ["Hava çok sıcaktı.", "Das Wetter war sehr heiß."],
    ["Her gün denize girdim.", "Ich bin jeden Tag im Meer schwimmen gegangen."],
    ["Çok güzel yemekler yedik.", "Wir haben sehr gut gegessen."],
    ["Otel biraz gürültülüydü.", "Das Hotel war etwas laut."],
    ["Uçağımız rötar yaptı.", "Unser Flug hatte Verspätung."],
    ["Bir sonraki tatilde Karadeniz'e gitmek istiyorum.", "Im nächsten Urlaub möchte ich ans Schwarze Meer."],
    ["Tatilin nasıl geçti?", "Wie war dein Urlaub?"]
  ],
  dialog: { title: "Zurück aus dem Urlaub", roles: ["Nachbar Hakan", "Du"], lines: [
    ["A", "Hoş geldin! Tatilin nasıl geçti?", "Willkommen zurück! Wie war dein Urlaub?"],
    ["B", "Çok güzeldi! Önce İstanbul'a, sonra Kapadokya'ya gittik.", "Sehr schön! Erst sind wir nach Istanbul, dann nach Kappadokien gefahren."],
    ["A", "Harika! Balonla uçtunuz mu?", "Toll! Seid ihr mit dem Ballon geflogen?"],
    ["B", "Evet, sabah çok erken kalktık ama manzara muhteşemdi.", "Ja, wir sind sehr früh aufgestanden, aber die Aussicht war großartig."],
    ["A", "Hava nasıldı?", "Wie war das Wetter?"],
    ["B", "Gündüz sıcaktı, gece biraz soğuktu.", "Tagsüber war es heiß, nachts etwas kalt."],
    ["A", "Bir dahaki sefere nereye gitmek istiyorsun?", "Wohin möchtest du nächstes Mal?"],
    ["B", "Karadeniz'e. Oranın yeşil dağlarını görmek istiyorum.", "Ans Schwarze Meer. Ich möchte die grünen Berge dort sehen."]
  ]},
  text: { title: "Kapadokya",
    tr: "Kapadokya, Türkiye'nin ortasında bir bölge. Orada peri bacaları denen ilginç kayalar var. İnsanlar eskiden kayalara oyulmuş evlerde ve kiliselerde yaşadı. Bugün turistler sabah erkenden sıcak hava balonuyla uçuyor. Gün doğumunda gökyüzünde yüzlerce balon görünüyor.",
    de: "Kappadokien ist eine Region in der Mitte der Türkei. Dort gibt es interessante Felsen, die man Feenkamine nennt. Früher lebten die Menschen in Häusern und Kirchen, die in den Fels gehauen waren. Heute fliegen Touristen frühmorgens mit dem Heißluftballon. Bei Sonnenaufgang sieht man Hunderte Ballons am Himmel.",
    questions: [
      ["Kapadokya nerede?", ["Türkiye'nin ortasında", "Karadeniz'de", "İstanbul'da"]],
      ["İnsanlar eskiden nerede yaşadı?", ["Kayalara oyulmuş evlerde", "Gemilerde", "Çadırlarda"]],
      ["Turistler sabah erkenden ne yapıyor?", ["Balonla uçuyor", "Denize giriyor", "Alışveriş yapıyor"]]
    ]},
  speak: [
    ["Son tatilini anlat: nereye gittin, ne yaptın?", "Erzähl von deinem letzten Urlaub: Wohin bist du gefahren, was hast du gemacht?", "Geçen yaz ailemle İtalya'ya gittim. Bir hafta deniz kenarında kaldık. Her gün denize girdik ve çok güzel yemekler yedik. Hava çok sıcaktı ama tatil harikaydı."],
    ["Bir seyahatte kötü giden bir şeyi anlat.", "Erzähl von etwas, das auf einer Reise schiefging.", "Geçen yıl uçağımız üç saat rötar yaptı. Havalimanında çok uzun bekledik. Otele gece yarısı vardık ve çok yorgunduk. Ama ertesi gün her şey güzeldi."]
  ]
},
{
  id: "planlar", track: "b1", icon: "🗓️", title: "Pläne und Wünsche", tr: "Planlar",
  tip: ["Zukunft mit -ecek / -acak", "Die Zukunft: Verbstamm + -ecek/-acak + Person. yap-acağ-ım (ich werde machen), gel-eceğ-iz (wir werden kommen), ol-acak (er/sie wird sein). Vor einer Vokalendung wird k zu ğ: yapacak → yapacağım. Nach Vokal kommt ein y: başla-yacağ-ım. „Wenn“ ist die Endung -se/-sa: olursa (wenn es ist)."],
  phrases: [
    ["Yarın ne yapacaksın?", "Was machst du morgen?"],
    ["Yarın annemi ziyaret edeceğim.", "Morgen werde ich meine Mutter besuchen."],
    ["Gelecek ay taşınacağız.", "Nächsten Monat ziehen wir um."],
    ["Türkçe kursuna başlayacağım.", "Ich werde mit einem Türkischkurs anfangen."],
    ["Hava güzel olursa pikniğe gideriz.", "Wenn das Wetter schön ist, machen wir ein Picknick."],
    ["Belki akşam sinemaya gideriz.", "Vielleicht gehen wir abends ins Kino."],
    ["Bir gün İstanbul'da yaşamak istiyorum.", "Ich möchte eines Tages in Istanbul leben."],
    ["Bu yıl daha çok spor yapmak istiyorum.", "Dieses Jahr möchte ich mehr Sport machen."],
    ["Henüz karar vermedim.", "Ich habe mich noch nicht entschieden."],
    ["İnşallah her şey yolunda gider.", "Hoffentlich läuft alles gut."]
  ],
  dialog: { title: "Sommerpläne", roles: ["Freundin Selin", "Du"], lines: [
    ["A", "Bu yaz ne yapacaksın?", "Was machst du diesen Sommer?"],
    ["B", "Henüz karar vermedim. Belki Türkiye'ye gideceğim.", "Ich habe mich noch nicht entschieden. Vielleicht fahre ich in die Türkei."],
    ["A", "Ne güzel! Nereye gitmek istiyorsun?", "Wie schön! Wohin möchtest du?"],
    ["B", "İzmir'e gitmek istiyorum. Orada bir Türkçe kursuna başlayacağım.", "Ich möchte nach Izmir. Dort werde ich einen Türkischkurs anfangen."],
    ["A", "Harika fikir! Ben de ağustosta İzmir'de olacağım.", "Tolle Idee! Ich bin im August auch in Izmir."],
    ["B", "Süper, o zaman orada buluşuruz!", "Super, dann treffen wir uns dort!"]
  ]},
  text: { title: "Yeni yıl kararları",
    tr: "Yılbaşında birçok insan kendine yeni hedefler koyuyor. Bazıları daha sağlıklı yemek yiyecek, bazıları her gün yürüyüş yapacak. Kimisi yeni bir dil öğrenmeye karar veriyor. Ama şubat gelince kararların çoğu unutuluyor. Küçük ve gerçekçi hedefler daha çok işe yarıyor.",
    de: "An Silvester setzen sich viele Menschen neue Ziele. Manche wollen gesünder essen, manche jeden Tag spazieren gehen. Mancher beschließt, eine neue Sprache zu lernen. Aber wenn der Februar kommt, sind die meisten Vorsätze vergessen. Kleine und realistische Ziele funktionieren besser.",
    questions: [
      ["Yılbaşında insanlar ne yapıyor?", ["Yeni hedefler koyuyor", "Tatile gidiyor", "Ev taşıyor"]],
      ["Kararların çoğu ne zaman unutuluyor?", ["Şubatta", "Aralıkta", "Yazın"]],
      ["Hangi hedefler daha çok işe yarıyor?", ["Küçük ve gerçekçi hedefler", "Çok büyük hedefler", "Hiç hedef koymamak"]]
    ]},
  speak: [
    ["Gelecek yıl için planlarını anlat.", "Erzähl von deinen Plänen fürs nächste Jahr.", "Gelecek yıl daha çok Türkçe öğreneceğim. Yazın Türkiye'ye gideceğim ve orada bir kursa katılacağım. Ayrıca daha çok spor yapmak istiyorum."],
    ["Hayalindeki bir günü anlat.", "Beschreibe einen Tag, wie du ihn dir erträumst.", "Sabah deniz kenarında uyanacağım. Balkonda uzun bir kahvaltı yapacağım. Öğleden sonra kitap okuyacağım ve akşam arkadaşlarımla balık yiyeceğim."]
  ]
},
{
  id: "fikir", track: "b1", icon: "💬", title: "Meinung sagen", tr: "Fikir belirtmek",
  tip: ["bence, sence", "bence = meiner Meinung nach, sence = deiner Meinung nach, bizce = unserer Meinung nach. Zustimmen: katılıyorum (ich stimme zu), widersprechen: katılmıyorum. Abwägen: öte yandan (andererseits), bu yüzden (deshalb). „Wenn“: olursa (wenn es gibt), gelirsen (wenn du kommst)."],
  phrases: [
    ["Bence bu iyi bir fikir.", "Meiner Meinung nach ist das eine gute Idee."],
    ["Sence de öyle mi?", "Findest du das auch?"],
    ["Sana katılıyorum.", "Da stimme ich dir zu."],
    ["Pek emin değilim.", "Ich bin mir nicht ganz sicher."],
    ["Bence bunun bir avantajı var.", "Ich finde, das hat einen Vorteil."],
    ["Öte yandan çok pahalı.", "Andererseits ist es sehr teuer."],
    ["Haklısın ama bir sorun var.", "Du hast recht, aber es gibt ein Problem."],
    ["Buna katılmıyorum.", "Dem stimme ich nicht zu."],
    ["Bu konuda farklı düşünüyorum.", "Darüber denke ich anders."],
    ["Bir de şöyle düşünelim.", "Lass es uns mal so betrachten."]
  ],
  dialog: { title: "Autofreie Innenstadt?", roles: ["Freund Burak", "Du"], lines: [
    ["A", "Şehir merkezinde arabaları yasaklamak hakkında ne düşünüyorsun?", "Was hältst du davon, Autos in der Innenstadt zu verbieten?"],
    ["B", "Bence bu iyi bir fikir. Hava daha temiz olur.", "Ich finde, das ist eine gute Idee. Die Luft wäre sauberer."],
    ["A", "Ama esnaf için zor olmaz mı?", "Aber wäre das nicht schwer für die Ladenbesitzer?"],
    ["B", "Haklısın, bu bir sorun. Öte yandan insanlar yürüyerek daha çok alışveriş yapabilir.", "Du hast recht, das ist ein Problem. Andererseits können Menschen zu Fuß mehr einkaufen."],
    ["A", "Pek emin değilim. Yaşlılar ne yapacak?", "Ich bin mir nicht sicher. Was machen die Älteren?"],
    ["B", "İyi otobüsler ve tramvaylar olursa sorun olmaz.", "Wenn es gute Busse und Straßenbahnen gibt, ist das kein Problem."]
  ]},
  text: { title: "Bisiklet mi, araba mı",
    tr: "Avrupa'da birçok şehir bisiklet yolları yapıyor. Türkiye'de de bazı şehirler, örneğin Konya, bisiklet şehri olarak biliniyor. Ama İstanbul gibi tepeli ve kalabalık şehirlerde bisiklet sürmek zor. Birçok kişi metroyu ve vapuru daha pratik buluyor.",
    de: "In Europa bauen viele Städte Radwege. Auch in der Türkei sind einige Städte, zum Beispiel Konya, als Fahrradstadt bekannt. Aber in hügeligen und vollen Städten wie Istanbul ist Radfahren schwierig. Viele finden U-Bahn und Fähre praktischer.",
    questions: [
      ["Hangi Türk şehri bisiklet şehri olarak biliniyor?", ["Konya", "İzmir", "Trabzon"]],
      ["İstanbul'da bisiklet sürmek neden zor?", ["Şehir tepeli ve kalabalık", "Hiç yol yok", "Bisiklet yasak"]],
      ["Birçok kişi neyi daha pratik buluyor?", ["Metroyu ve vapuru", "Taksiyi", "Yürümeyi"]]
    ]},
  speak: [
    ["Evden çalışmak hakkında ne düşünüyorsun? Avantajları ve dezavantajları anlat.", "Was hältst du vom Arbeiten zu Hause? Nenne Vor- und Nachteile.", "Bence evden çalışmanın birçok avantajı var. Yola zaman harcamıyorum ve daha sakin çalışıyorum. Öte yandan iş arkadaşlarımı daha az görüyorum. Bu yüzden haftada iki gün ofise gitmek en iyisi."],
    ["Sence herkes ikinci bir dil öğrenmeli mi? Nedenini açıkla.", "Sollte deiner Meinung nach jeder eine zweite Sprache lernen? Begründe.", "Evet, bence herkes ikinci bir dil öğrenmeli. Yeni bir dil yeni insanlarla tanışmayı kolaylaştırıyor. Ayrıca beyin için de çok iyi. Ama öğrenmek zaman alıyor, bu yüzden her gün biraz pratik yapmak lazım."]
  ]
}
];
