import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ChevronRight, RefreshCcw, Award, AlertCircle, HelpCircle, Trophy, Play, Bookmark, Shuffle, Settings, BarChart3, Image as ImageIcon, ArrowLeft, ClipboardCheck, Package } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
  imageUrl?: string;
  category?: string;
  readMoreUrl?: string;
}

const questions: Question[] = [
  {
    id: 3,
    question: "Vilket är det största tillåtna slitage som tillåts på bultens midja på en 57 mm bygelkoppling?",
    options: [
      "Ej smalare än 55,5 mm",
      "Ej smalare än 55 mm",
      "Ej smalare än 56 mm"
    ],
    correctAnswer: 1,
    explanation: "En 57 mm bult får slitas ner till 55 mm innan den måste bytas.",
    category: "Kopplingar",
    imageUrl: "https://picsum.photos/seed/coupling/800/400"
  },
  {
    id: 7,
    question: "I samband med säkerhetskontrollen ska du knacka med en hammare på Pivåtappen/KingPin. Varför?",
    options: [
      "För att knacka den i vertikalt läge",
      "För att slå fast den i trailern",
      "För att höra om den är fastdragen"
    ],
    correctAnswer: 2,
    explanation: "Ett stumt ljud indikerar att den sitter fast ordentligt. Ett skramlande ljud kan tyda på att den är lös.",
    category: "Säkerhetskontroll",
    readMoreUrl: "https://transportstyrelsen.se"
  },
  {
    id: 8,
    question: "Vilken uppgift har det lilla röda stiftet i bygelkopplingen?",
    options: [
      "Stiften har ingen uppgift det är bara en designdetalj",
      "Stiftet markerar att kopplingen är färdig att användas",
      "När stiftet kryper in i bygelkopplingen, innebär det att kopplingsbulten har låst i bottenläget och det är säkert att köra iväg"
    ],
    correctAnswer: 2,
    explanation: "Det röda signalstiftet indikerar att mekanismen är låst och säkrad.",
    category: "Kopplingar",
    imageUrl: "https://picsum.photos/seed/red-pin/800/400"
  },
  {
    id: 10,
    question: "Dragstången på din släpvagn har en liten spricka. Får du reparera den genom att svetsa ihop sprickan?",
    options: [
      "Ja, om du har licens på att svetsa",
      "Ja, om du vet hur man svetsar",
      "Nej, man får aldrig svetsa en dragstång"
    ],
    correctAnswer: 2,
    explanation: "Säkerhetsdetaljer som dragstänger får inte svetsas. De måste bytas ut.",
    category: "Fordonsteknik"
  },
  {
    id: 11,
    question: "Dessa dragöglor är så kallade 57 mm öglor. Vilket är det största slitage som tillåts?",
    options: [
      "Största tillåtna diameter är 59 mm",
      "Största tillåtna diameter är 59,5 mm",
      "Största tillåtna diameter är 58 mm",
      "Största tillåtna diameter är 58,5 mm"
    ],
    correctAnswer: 0,
    explanation: "Maximalt slitage på en 57 mm ögla är normalt upp till 59 mm (2 mm slitage).",
    category: "Kopplingar",
    imageUrl: "https://picsum.photos/seed/drawbar/800/400"
  },
  {
    id: 21,
    question: "Vilken broms ansätts på släpet när du trycker på lastbilens färdbroms?",
    options: [
      "Släpets katastrofbroms",
      "Släpets parkeringsbroms",
      "Släpets färdbroms"
    ],
    correctAnswer: 2,
    explanation: "Färdbromsen påverkar alla hjul på både bil och släp.",
    category: "Bromsar"
  },
  {
    id: 23,
    question: "I vissa lastbilar finns en speciell släpvagnsbroms. Vilken broms ansätts på släpet om du drar i släpvagnsbromsen?",
    options: [
      "Släpets katastrofbroms",
      "Släpets färdbroms",
      "Släpets parkeringsbroms"
    ],
    correctAnswer: 1,
    explanation: "Släpvagnsbromsen (stretch brake) ansätter släpets färdbroms för att sträcka ekipaget.",
    category: "Bromsar"
  },
  {
    id: 34,
    question: "Vad är det för regler som gäller om du parkerar ett släpfordon på en P-ficka eller liknande vid sidan av körbanan under den mörka tiden på dygnet?",
    options: [
      "Halvljuset och bakljuset ska vara tänt",
      "Släpvagnen ska parkeras i färdriktningen. Rött ljus och röda reflexer baktill, vitt ljus och vita reflexer framtill",
      "Det räcker att ställa ut varningstriangel bakom släpet på ett avstånd av ca 150 - 250 meter"
    ],
    correctAnswer: 1,
    explanation: "Vid parkering i mörker måste fordonet vara utmärkt med belysning och reflexer.",
    category: "Trafikregler",
    imageUrl: "https://picsum.photos/seed/night-parking/800/400"
  },
  {
    id: 40,
    question: "Får du använda regummerade däck på ett släpfordon?",
    options: [
      "Nej",
      "Ja",
      "Ja, men inte på de styrande hjulen",
      "Ja, men inte på vintern"
    ],
    correctAnswer: 1,
    explanation: "Det är tillåtet att använda regummerade däck på släpfordon.",
    category: "Däck"
  },
  {
    id: 41,
    question: "Vilket är minsta mönsterdjup på det mest slitna stället på släpfordonets däck under sommartid?",
    options: [
      "1,6 mm. Vid tvillingmontage är kravet 0 mm på det inre däcket. Däremot får inte korden synas",
      "1,6 mm på alla däck (även tvillingmonterade däck)",
      "1,6 mm. Vid tvillingmontage är kravet 0 mm på det yttre däcket. Däremot får inte korden synas"
    ],
    correctAnswer: 1,
    explanation: "Kravet är 1,6 mm på alla däck för tunga fordon under sommartid.",
    category: "Däck",
    imageUrl: "https://picsum.photos/seed/tires/800/400"
  },
  {
    id: 42,
    question: "Vilket är minsta mönsterdjup på släpfordonets däck under perioden 1/12 - 31/3 vid vinterväglag?",
    options: [
      "5 mm samt vinterdäck (POR) på drivande axel",
      "1,6 mm. Vid tvillingmontage är kravet 0 mm på det yttre däcket",
      "5 mm på alla däck samt snöflinga eller alptopp på alla däck",
      "Vinterdäck (M+S) på alla axlar och minsta mönsterdjupet får vara 1,6 mm"
    ],
    correctAnswer: 2,
    explanation: "För tunga fordon gäller 5 mm mönsterdjup på alla däck vid vinterväglag under denna period.",
    category: "Däck"
  },
  {
    id: 46,
    question: "Hur ofta ska en tung släpvagn kontrollbesiktigas?",
    options: [
      "En gång varje år",
      "Vartannat år",
      "En gång var tredje år"
    ],
    correctAnswer: 0,
    explanation: "Tunga fordon och släp ska besiktigas årligen.",
    category: "Lagar & Regler"
  },
  {
    id: 49,
    question: "Får släpfordonet ha en högre bruttovikt än lastbilens bruttovikt?",
    options: [
      "Nej, släpets bruttovikt får aldrig vara högre än lastbilens bruttovikt",
      "Ja, släpets bruttovikt har ingen betydelse. Det viktiga är att lastbilens högsta dragvikt inte överskrids",
      "Ja, om släpfordonet är försett med bromsar. Ett obromsat släpfordon får däremot aldrig ha högre bruttovikt än lastbilens bruttovikt"
    ],
    correctAnswer: 2,
    explanation: "Ett bromsat släp får ha högre bruttovikt än bilen, så länge tågvikten och kopplingsanordningen tillåter det.",
    category: "Vikter"
  },
  {
    id: 52,
    question: "Vilka handlingar krävs att du medför om du kör tung lastbil med tillkopplad släpvagn?",
    options: [
      "Registreringsbevis på lastbilen och släpvagnen",
      "Körkort och förarkort om lastbilen är utrustad med digital färdskrivare",
      "Körkort och registreringsbevis på lastbilen och släpfordonet"
    ],
    correctAnswer: 1,
    explanation: "Körkort och förarkort (om digital färdskrivare används) är krav. Registreringsbevis del 1 behöver normalt inte medföras vid inrikes trafik om uppgifterna kan kontrolleras via vägtrafikregistret, men det är bra praxis.",
    category: "Lagar & Regler"
  },
  {
    id: 54,
    question: "Du kör med tillkopplat släp och släpet skadar ett annat fordon. Vilken försäkring ersätter skadan?",
    options: [
      "Släpets trafikförsäkring",
      "Lastbilens trafikförsäkring",
      "På grund av att släpet inte går att försäkra, får det skadade fordonets ägare ersätta skadan"
    ],
    correctAnswer: 1,
    explanation: "När släpet är kopplat till bilen täcks skador på motparten av dragbilens trafikförsäkring.",
    category: "Lagar & Regler"
  },
  {
    id: 51,
    question: "Hur gör du för att kontrollera att släpfordonets katastrofbroms fungerar?",
    options: [
      "Efter att du kopplat samman bil och vagn testar du att ta ur duomaticen. Gå sedan in i lastbilen och prova om det går att köra. Om det går att köra fungerar INTE släpets katastrofbroms",
      "Efter att du kopplat samman bil och vagn testar du katastrofbromsen genom att köra fram en bit och provbromsa. Om bromsarna inte tar fungerar INTE katastrofbromsen",
      "Koppla samman bil och vagn, men sätt inte i duomatickopplingen. Gå sedan in i lastbilen och prova att köra bilen framåt, om det inte går att köra fungerar katastrofbromsen"
    ],
    correctAnswer: 2,
    explanation: "Genom att försöka dra släpet utan luft (duomatic urkopplad) testar du om katastrofbromsen (fjäderbromsen) håller emot.",
    category: "Säkerhetskontroll",
    imageUrl: "https://picsum.photos/seed/truck-brake/800/400"
  },
  {
    id: 99,
    question: "Hur mycket får du lasta på denna lastbil på en BK1-väg?",
    options: [
      "24,2 ton",
      "32 ton",
      "17,6 ton",
      "15,33 ton"
    ],
    correctAnswer: 2,
    explanation: "Beräkning baserad på lastbilens tjänstevikt och totalvikt för BK1.",
    category: "Vikter",
    imageUrl: "https://picsum.photos/seed/truck-weight/800/400"
  },
  {
    id: 101,
    question: "Vilken typ av surrning pressar ner godset mot flaket för att öka friktionen?",
    options: [
      "Överfallssurrning",
      "Grimma",
      "Loopsurrning",
      "Raksurrning"
    ],
    correctAnswer: 0,
    explanation: "Överfallssurrning är den vanligaste metoden och fungerar genom att öka trycket mot underlaget.",
    category: "Lastsäkring",
    imageUrl: "https://picsum.photos/seed/lashing/800/400"
  },
  {
    id: 102,
    question: "Vad betyder vägmärket C25 (Lastbil i röd cirkel)?",
    options: [
      "Förbud mot trafik med lastbil",
      "Förbud mot trafik med tung lastbil",
      "Förbud mot omkörning med lastbil",
      "Varning för lastbil"
    ],
    correctAnswer: 0,
    explanation: "Märket anger förbud mot trafik med lastbil (gäller både lätt och tung om inget annat anges på tilläggstavla).",
    category: "Trafikregler",
    imageUrl: "https://picsum.photos/seed/truck-sign/800/400"
  },
  {
    id: 103,
    question: "När måste ett fordon ha breddmarkeringslyktor framtill?",
    options: [
      "När fordonets bredd överstiger 180 cm",
      "När fordonets bredd överstiger 210 cm",
      "När fordonets bredd överstiger 260 cm",
      "Alltid på lastbilar"
    ],
    correctAnswer: 1,
    explanation: "Fordon som är bredare än 210 cm måste ha två breddmarkeringslyktor framtill som visar vitt ljus.",
    category: "Fordonsteknik",
    imageUrl: "https://picsum.photos/seed/truck-lights/800/400"
  },
  {
    id: 104,
    question: "Vad står förkortningen ADR för i transportsammanhang?",
    options: [
      "Allmänna Direktiv för Räddningstjänst",
      "Europeisk överenskommelse om transport av farligt gods på väg",
      "Automatisk Digital Registrering",
      "Arbetsmiljöverkets Direktiv för Resor"
    ],
    correctAnswer: 1,
    explanation: "ADR (Accord Européen relatif au transport international des marchandises Dangereuses par Route) reglerar transport av farligt gods.",
    category: "ADR",
    imageUrl: "https://picsum.photos/seed/hazmat/800/400"
  },
  {
    id: 105,
    question: "Vilken är den normala fria höjden under broar och i tunnlar på svenska vägar om inget annat anges?",
    options: [
      "4,0 meter",
      "4,2 meter",
      "4,5 meter",
      "Fri höjd (ingen begränsning)"
    ],
    correctAnswer: 2,
    explanation: "Om ingen höjd anges är den fria höjden normalt minst 4,5 meter. Är den lägre ska det skyltas.",
    category: "Lagar & Regler",
    imageUrl: "https://picsum.photos/seed/bridge/800/400"
  },
  // YKB Questions
  {
    id: 201,
    question: "Du arbetar mycket med lastning och lossning och kommer därför inte upp i 4,5 timmar körtid. Hur många timmar i följd får du arbeta utan att ta rast enligt vägarbetstidslagen?",
    options: [
      "4,5 timmar",
      "5 timmar",
      "6 timmar",
      "9 timmar"
    ],
    correctAnswer: 2,
    explanation: "Enligt vägarbetstidslagen får du arbeta i högst 6 timmar i följd utan rast. Rasten ska vara minst 30 minuter (om arbetstiden är 6-9 timmar).",
    category: "YKB"
  },
  {
    id: 202,
    question: "Du kommer till en olycksplats där en person har drabbats av chock (cirkulationssvikt). Vilken bör din första åtgärd vara för att motverka detta?",
    options: [
      "Ge personen rikligt med vatten",
      "Hålla personen varm, lugn och i planläge (gärna med benen högt)",
      "Sätta personen upp för att underlätta andningen",
      "Lämna personen ifred"
    ],
    correctAnswer: 1,
    explanation: "Vid cirkulationssvikt (chock) är det viktigt att säkra cirkulationen till vitala organ. Värme, vila och varsamhet är nyckelord.",
    category: "YKB"
  },
  {
    id: 203,
    question: "Ditt fordon är utrustat med EBS-bromssystem. Vad kan följden bli om EBS-systemet upphör att fungera under körning?",
    options: [
      "Bromsarna slutar fungera helt",
      "Färdbromsen fungerar men utan ABS och med längre bromssträcka",
      "Fordonet tvärnitar omedelbart",
      "Det blir ingen skillnad alls"
    ],
    correctAnswer: 1,
    explanation: "Om EBS (Elektroniskt Bromssystem) fallerar finns det pneumatiska systemet kvar som reserv, men funktioner som ABS och lastkännande ventilering kan påverkas.",
    category: "YKB"
  },
  {
    id: 204,
    question: "Hur kan du effektivast minska bränsleförbrukningen vid körning?",
    options: [
      "Köra på så låg växel som möjligt",
      "Planera körningen, hålla jämn fart och motorbromsa",
      "Frikoppla i nedförsbackar",
      "Pumpgasa för att hålla farten"
    ],
    correctAnswer: 1,
    explanation: "Eco-driving handlar om framförhållning och att utnyttja rörelseenergin.",
    category: "YKB"
  },
  {
    id: 205,
    question: "En passagerare har blivit svårt skadad i en trafikolycka vintertid. När ska du flytta den skadade ur fordonet?",
    options: [
      "Alltid, för att kunna ge första hjälpen bättre",
      "Endast om det föreligger livsfara (t.ex. brand eller risk för påkörning)",
      "Aldrig, man ska alltid vänta på räddningstjänst",
      "När den skadade klagar på kyla"
    ],
    correctAnswer: 1,
    explanation: "Flytta endast skadade om det är absolut nödvändigt (Livsfarligt läge) för att inte förvärra eventuella rygg/nackskador.",
    category: "YKB"
  },
  {
    id: 206,
    question: "Vilket kolli innehåller 'Begränsad mängd' (Limited Quantity) farligt gods?",
    options: [
      "Ett kolli märkt med en orange skylt",
      "Ett kolli märkt med en svart diamant med vita spetsar (svart/vit kvadrat på högkant)",
      "Ett kolli märkt med en dödskalle",
      "Ett kolli märkt med 'ADR'"
    ],
    correctAnswer: 1,
    explanation: "Symbolen för begränsad mängd (LQ) är en kvadrat ställd på högkant med svarta hörn (topp och botten).",
    category: "YKB",
    imageUrl: "https://picsum.photos/seed/lq-label/800/400"
  },
  {
    id: 207,
    question: "Hur kan du minska slitaget på färdbromsen i långa nedförsbackar?",
    options: [
      "Använda hjälpbromsar (retarder/avgasbroms) och motorbroms",
      "Bromsa hårt och kort upprepade gånger",
      "Lägga i friläge",
      "Stänga av motorn"
    ],
    correctAnswer: 0,
    explanation: "Hjälpbromsar sparar på färdbromsen och minskar risken för överhettning (fading).",
    category: "YKB"
  },
  {
    id: 208,
    question: "Vad är den största fördelen med skivbromsar jämfört med trumbromsar?",
    options: [
      "De är billigare att tillverka",
      "De har bättre värmeavledning och jämnare bromsverkan",
      "De är helt underhållsfria",
      "De väger mer vilket ger stabilitet"
    ],
    correctAnswer: 1,
    explanation: "Skivbromsar kyls bättre och drabbas inte lika lätt av fading eller ojämn bromsverkan.",
    category: "YKB"
  },
  // Säkerhetskontroll Questions
  {
    id: 301,
    question: "Hur kontrollerar du enklast att styrservon fungerar?",
    options: [
      "Vrid på ratten med motorn avstängd, starta sedan motorn – ratten ska då bli lätt att vrida",
      "Kör sakta och sväng kraftigt fram och tillbaka",
      "Kontrollera oljenivån i servobehållaren",
      "Lyssna efter missljud när du svänger fullt"
    ],
    correctAnswer: 0,
    explanation: "Genom att belasta styrningen (vrida ratten) och sedan starta motorn känner du tydligt när servoverkan träder in och ratten blir lätt.",
    category: "Säkerhetskontroll"
  },
  {
    id: 302,
    question: "Vad ingår i kontrollen av hjul och däck vid en säkerhetskontroll?",
    options: [
      "Endast lufttryck",
      "Mönsterdjup, lufttryck, skador och att hjulbultarna sitter fast",
      "Endast mönsterdjup",
      "Att fälgarna är rena"
    ],
    correctAnswer: 1,
    explanation: "En fullständig kontroll innefattar mönsterdjup, rätt lufttryck, kontroll av skador (sprickor/bulor) samt att hjulbultarna är åtdragna/inte saknas.",
    category: "Säkerhetskontroll"
  },
  {
    id: 303,
    question: "Hur upptäcker du enklast ett mindre läckage i tryckluftssystemet?",
    options: [
      "Genom att titta på manometern under körning",
      "Genom att stänga av motorn när trycket är uppbyggt, gå ut och lyssna efter pysljud",
      "Genom att trampa hårt på bromsen",
      "Genom att se om kompressorn arbetar hela tiden"
    ],
    correctAnswer: 1,
    explanation: "Mindre läckage hörs bäst när motorn är avstängd och det är tyst runt fordonet. Ett tydligt pysande ljud indikerar läckage.",
    category: "Säkerhetskontroll"
  },
  {
    id: 304,
    question: "Vad indikerar en lysande ABS-lampa på instrumentpanelen?",
    options: [
      "Att bromsarna slutat fungera helt",
      "Att ABS-systemet är ur funktion (risk för hjullåsning), men färdbromsen fungerar",
      "Att du har punktering",
      "Att parkeringsbromsen är åtdragen"
    ],
    correctAnswer: 1,
    explanation: "ABS-lampan varnar för fel i antisladd/låsningsfria systemet. De vanliga bromsarna fungerar, men hjulen kan låsa sig vid hård inbromsning.",
    category: "Säkerhetskontroll"
  },
  {
    id: 305,
    question: "Varför är det viktigt att dränera lufttankarna (om fordonet inte har automatisk dränering)?",
    options: [
      "För att minska fordonets vikt",
      "För att avlägsna kondensvatten som kan frysa och slå ut bromssystemet",
      "För att öka trycket i systemet",
      "För att kyla ner kompressorn"
    ],
    correctAnswer: 1,
    explanation: "Vatten i tryckluftssystemet kan frysa på vintern och blockera ventiler, vilket kan leda till bromsbortfall. Det orsakar även rost.",
    category: "Säkerhetskontroll"
  },
  {
    id: 306,
    question: "Hur utför du en funktionskontroll av parkeringsbromsen?",
    options: [
      "Lägg i en växel och försök köra iväg försiktigt med parkeringsbromsen åtdragen",
      "Rulla i en nedförsbacke och dra åt bromsen",
      "Titta om lampan lyser på instrumentpanelen",
      "Känn på spaken/knappen"
    ],
    correctAnswer: 0,
    explanation: "Genom att försöka köra iväg (dragläge) med bromsen åtdragen känner du om den orkar hålla emot fordonet.",
    category: "Säkerhetskontroll"
  },
  {
    id: 307,
    question: "Vad kontrollerar du under motorhuven/i motorrummet?",
    options: [
      "Att motorn är tvättad",
      "Nivåer för olja, kylarvätska, spolarvätska, hydraulvätska samt remmar och eventuella läckage",
      "Endast oljestickan",
      "Att batteriet är fulladdat"
    ],
    correctAnswer: 1,
    explanation: "En inre kontroll omfattar alla vätskenivåer, remmarnas spänning/skick och en titt efter synliga läckage.",
    category: "Säkerhetskontroll"
  },
  {
    id: 308,
    question: "Vad ska du kontrollera gällande lasten innan avfärd?",
    options: [
      "Att godset är märkt med mottagarens namn",
      "Att lasten är säkrad (förstängd/surrad), att inget hänger löst och att lasten inte skymmer belysning/skyltar",
      "Att du har exakt rätt vikt på varje axel",
      "Att flaket är nysopat"
    ],
    correctAnswer: 1,
    explanation: "Lastsäkring är förarens ansvar. Lasten får inte kunna förskjutas eller falla av, och får inte skymma viktiga funktioner på fordonet.",
    category: "Säkerhetskontroll"
  },
  {
    id: 309,
    question: "Hur kontrollerar du enklast bromsljusen om du är ensam?",
    options: [
      "Backa mot en vägg eller fönster och titta i backspegeln",
      "Lägg en tegelsten på bromspedalen",
      "Det går inte, man måste vara två",
      "Titta på instrumentpanelen"
    ],
    correctAnswer: 0,
    explanation: "Genom att backa mot en reflekterande yta (vägg, port, fönster) kan du se om bromsljusen tänds när du trycker på pedalen.",
    category: "Säkerhetskontroll"
  },
  {
    id: 310,
    question: "Vad innebär det om lufttorkaren 'nyser' (släpper ut luft) ofta?",
    options: [
      "Att systemet är fullt och fungerar som det ska",
      "Att det är ett stort läckage i systemet som gör att kompressorn får arbeta onormalt mycket",
      "Att motorn är överhettad",
      "Att du bromsar för mycket"
    ],
    correctAnswer: 1,
    explanation: "Om lufttorkaren nyser ofta betyder det att kompressorn laddar luft ofta, vilket tyder på att luft förbrukas snabbt (läckage) eller att regulatorn är felinställd.",
    category: "Säkerhetskontroll"
  },
  {
    id: 311,
    question: "Hur kontrollerar du att diffspärren fungerar och går i?",
    options: [
      "Hissa upp ena drivhjulet och försök köra",
      "Aktivera spärren och lyssna efter pysljud samt kontrollera att varningslampan/symbolen tänds på instrumentpanelen",
      "Kör i cirklar på asfalt",
      "Det räcker att känna på knappen"
    ],
    correctAnswer: 1,
    explanation: "När du aktiverar diffspärren ska en lampa tändas på instrumentpanelen. Du kan ofta höra ett tydligt klick eller pysljud när den går i.",
    category: "Säkerhetskontroll"
  },
  {
    id: 312,
    question: "Vad ska du göra om varningslampan för laddning tänds under färd?",
    options: [
      "Fortsätta köra tills batteriet tar slut",
      "Stanna omedelbart och kontrollera drivremmarna (fläktremmen)",
      "Öka varvtalet så generatorn laddar mer",
      "Stänga av alla ljus och köra vidare"
    ],
    correctAnswer: 1,
    explanation: "Om laddningslampan tänds kan drivremmen ha gått av. Om samma rem driver vattenpumpen kommer motorn snabbt att överhettas (koka).",
    category: "Säkerhetskontroll"
  },
  {
    id: 313,
    question: "Hur kontrollerar du nivåregleringen på luftfjädringen?",
    options: [
      "Mät avståndet mellan däck och skärmkant med tumstock",
      "Använd fjärrkontrollen/reglaget för att höja och sänka fordonet till ändlägena och återgå sedan till körläge",
      "Hoppa på flaket",
      "Kör över ett gupp"
    ],
    correctAnswer: 1,
    explanation: "En funktionskontroll innebär att du kör systemet upp och ner för att se att det rör sig fritt och att det stannar i inställt körläge.",
    category: "Säkerhetskontroll"
  },
  {
    id: 314,
    question: "Vad är viktigt att kontrollera gällande vindrutetorkarna?",
    options: [
      "Att de är svarta",
      "Att gummit är hel, att de torkar rent och att spolarvätskan fungerar och träffar rätt",
      "Att de går snabbt",
      "Att de är av samma märke som bilen"
    ],
    correctAnswer: 1,
    explanation: "Sikten är avgörande. Torkarbladen ska vara hela och spolarvätskan ska fungera och vara rätt riktad.",
    category: "Säkerhetskontroll"
  },
  {
    id: 315,
    question: "Hur kontrollerar du att färdskrivaren fungerar som den ska?",
    options: [
      "Slå på den",
      "Kontrollera att den visar rätt tid, att ditt kort är inmatat korrekt och att ingen felkod visas i displayen",
      "Kör en sträcka och se om den rör sig",
      "Tryck på alla knappar samtidigt"
    ],
    correctAnswer: 1,
    explanation: "Färdskrivaren ska vara besiktigad (2 år), visa rätt tid (UTC) och inte visa några felmeddelanden. Förarkortet ska vara giltigt.",
    category: "Säkerhetskontroll"
  },
  {
    id: 316,
    question: "Vilken symbol på färdskrivaren motsvarar 'Annat arbete'?",
    options: [
      "Ratt (cirkel med ekrar)",
      "Hammare (två korsade verktyg)",
      "Fyrkant (box med diagonalt streck)",
      "Säng (liggande rektangel)"
    ],
    correctAnswer: 1,
    explanation: "Symbolen med två korsade hammare betyder 'Annat arbete'. Den används när du arbetar men inte kör (t.ex. lastning/lossning).",
    category: "Säkerhetskontroll",
    imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Symbol:+Annat+Arbete+(Hammare)"
  },
  {
    id: 317,
    question: "Vilken symbol på färdskrivaren motsvarar 'Tillgänglighet'?",
    options: [
      "Ratt",
      "Hammare",
      "Fyrkant (box med diagonalt streck)",
      "Säng"
    ],
    correctAnswer: 2,
    explanation: "Fyrkanten (en box med ett diagonalt streck) symboliserar 'Tillgänglighet'. Det används t.ex. när du väntar på lastning men är redo att arbeta.",
    category: "Säkerhetskontroll",
    imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Symbol:+Tillgänglighet+(Fyrkant)"
  },
  {
    id: 318,
    question: "Vad innebär symbolen 'Säng' på färdskrivaren?",
    options: [
      "Körtid",
      "Annat arbete",
      "Rast och vila",
      "Tillgänglighet"
    ],
    correctAnswer: 2,
    explanation: "Sängsymbolen används när du tar rast eller dygnsvila. Färdskrivaren registrerar då att du vilar.",
    category: "Säkerhetskontroll",
    imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Symbol:+Vila+(Säng)"
  },
  {
    id: 319,
    question: "Vad ska du göra om lågtrycksindikatorn börjar varna under färd?",
    options: [
      "Köra vidare till närmaste verkstad",
      "Stanna omedelbart på ett säkert ställe och gör en utökad säkerhetskontroll",
      "Öka varvtalet för att bygga upp tryck",
      "Ignorera det om bromsarna fortfarande tar"
    ],
    correctAnswer: 1,
    explanation: "Om trycket sjunker under en kritisk nivå (ofta ca 4,5-5,5 bar) kan bromsarna sluta fungera eller parkeringsbromsen slå till. Stanna omedelbart och kontrollera systemet.",
    category: "Säkerhetskontroll"
  },
  {
    id: 320,
    question: "Vad är skillnaden mellan färdbroms och parkeringsbroms (P-broms) gällande lufttryck?",
    options: [
      "Båda behöver luft för att bromsa",
      "Färdbromsen behöver luft för att bromsa, P-bromsen behöver luft för att släppa",
      "Färdbromsen behöver luft för att släppa, P-bromsen behöver luft för att bromsa",
      "Ingen skillnad"
    ],
    correctAnswer: 1,
    explanation: "Färdbromsen är direktverkande (luft trycker ut bromsarna). P-bromsen är en fjäderbroms som hålls borta av lufttryck; försvinner luften slår fjädern till bromsen (säkerhetsfunktion).",
    category: "Säkerhetskontroll"
  },
  {
    id: 321,
    question: "Vad är en spärrventil och vilken uppgift har den?",
    options: [
      "Den förhindrar att motorn startar om växeln är i",
      "Den förhindrar ofrivillig rullning om trycket är lågt när P-bromsen lossas",
      "Den spärrar bakdörrarna",
      "Den stänger av bränsletillförseln vid olycka"
    ],
    correctAnswer: 1,
    explanation: "Spärrventilen (ofta en svart knapp) hoppar ut vid lågt tryck (under ca 4,5 bar) och förhindrar att man kan lossa parkeringsbromsen innan trycket är tillräckligt högt för att köra säkert.",
    category: "Säkerhetskontroll"
  },
  {
    id: 322,
    question: "Vad är AdBlue och vilken funktion fyller det?",
    options: [
      "Ett bränsletillsats för att öka effekten",
      "En vätska som sprutas in i avgaserna för att minska utsläppen av kväveoxider (NOx)",
      "En typ av kylarvätska för motorn",
      "Ett smörjmedel för växellådan"
    ],
    correctAnswer: 1,
    explanation: "AdBlue är en urealösning som används i SCR-systemet för att omvandla farliga kväveoxider till ofarligt kväve och vattenånga.",
    category: "Fordonsteknik"
  },
  {
    id: 323,
    question: "När bör du använda retardern (hjälpbromsen)?",
    options: [
      "Vid panikbromsning för maximal effekt",
      "I långa nedförsbackar för att spara på färdbromsen och förhindra överhettning",
      "Vid körning på halt väglag",
      "Endast vid parkering"
    ],
    correctAnswer: 1,
    explanation: "Retardern är mest effektiv i högre hastigheter och under längre tid, t.ex. i nedförsbackar. Den sparar på de ordinarie bromsarna.",
    category: "Fordonsteknik"
  },
  {
    id: 324,
    question: "Vad är den viktigaste åtgärden vid en daglig säkerhetskontroll av belysningen?",
    options: [
      "Att putsa glasen",
      "Att kontrollera att alla lampor (halvljus, bakljus, blinkers, bromsljus) fungerar och är rena",
      "Att byta alla glödlampor i förebyggande syfte",
      "Att justera ljusbilden"
    ],
    correctAnswer: 1,
    explanation: "Att se och synas är vitalt. En enkel kontroll runt fordonet säkerställer att du inte kör med trasiga lampor.",
    category: "Säkerhetskontroll"
  },
  {
    id: 401,
    question: "Vad betyder denna symbol på färdskrivaren?",
    options: ["Vila / Rast", "Annat arbete", "Tillgänglighet", "Körning"],
    correctAnswer: 0,
    explanation: "Sängsymbolen betyder att föraren har rast eller vila.",
    category: "YKB",
    imageUrl: "https://picsum.photos/seed/bed/800/400"
  },
  {
    id: 402,
    question: "Vad betyder denna symbol på färdskrivaren?",
    options: ["Vila / Rast", "Annat arbete", "Tillgänglighet", "Körning"],
    correctAnswer: 1,
    explanation: "Hammarsymbolen (korsade hammare) betyder 'Annat arbete', t.ex. lastning/lossning eller säkerhetskontroll.",
    category: "YKB",
    imageUrl: "https://picsum.photos/seed/hammer/800/400"
  },
  {
    id: 403,
    question: "Vad betyder denna symbol på färdskrivaren?",
    options: ["Vila / Rast", "Annat arbete", "Tillgänglighet", "Körning"],
    correctAnswer: 2,
    explanation: "Fyrkanten med ett streck över (eller bara fyrkant) betyder 'Tillgänglighet', t.ex. väntetid vid färja eller gräns.",
    category: "YKB",
    imageUrl: "https://picsum.photos/seed/square/800/400"
  },
   {
    id: 404,
    question: "Vad betyder denna symbol på färdskrivaren?",
    options: ["Vila / Rast", "Annat arbete", "Tillgänglighet", "Körning"],
    correctAnswer: 3,
    explanation: "Ratten betyder 'Körning' och registreras automatiskt när fordonet rullar.",
    category: "YKB",
    imageUrl: "https://picsum.photos/seed/steeringwheel/800/400"
  },
  // Taxi Questions
  {
    id: 501,
    question: "Vad är den viktigaste åtgärden om en passagerare får ett epileptiskt anfall i bilen?",
    options: [
      "Hålla fast personen så den inte skadar sig",
      "Stoppa något i munnen på personen",
      "Skydda huvudet och undanröja farliga föremål, men inte hålla fast",
      "Köra fortare till sjukhus"
    ],
    correctAnswer: 2,
    explanation: "Vid epilepsi ska man inte hålla fast kramperna utan skydda personen från att slå sig. Stoppa aldrig något i munnen.",
    category: "Taxi"
  },
  {
    id: 502,
    question: "Vilken är den lagstadgade åldersgränsen för att få köra taxi (Taxiförarlegitimation)?",
    options: [
      "18 år",
      "20 år",
      "21 år",
      "24 år"
    ],
    correctAnswer: 2,
    explanation: "Du måste ha fyllt 21 år och haft B-körkort i minst 2 år (eller D-körkort).",
    category: "Taxi"
  },
  {
    id: 503,
    question: "Hur ska en ledarhund placeras i taxibilen?",
    options: [
      "I bagageutrymmet i bur",
      "På sätet bredvid föraren",
      "På golvet vid passagerarens fötter (fram eller bak)",
      "Ledarhundar får inte tas med i taxi"
    ],
    correctAnswer: 2,
    explanation: "Ledarhundar ska få följa med och placeras säkrast på golvet vid passagerarens fötter. De ska inte vara i bagaget eller lösa på sätet.",
    category: "Taxi"
  },
  {
    id: 504,
    question: "Vad gäller för bältesanvändning i taxi?",
    options: [
      "Föraren behöver inte använda bälte om passagerare finns i bilen",
      "Både förare och passagerare ska alltid använda bälte",
      "Endast passagerare måste använda bälte",
      "Föraren är undantagen bältesplikt vid yrkesutövning"
    ],
    correctAnswer: 1,
    explanation: "Grundregeln är att alla ska använda bälte. Taxiförare har inte generellt undantag längre (togs bort för flera år sedan).",
    category: "Taxi"
  },
  {
    id: 505,
    question: "Du kör en kund som verkar ha fått en stroke. Vilket test kan du göra för att misstänka stroke?",
    options: [
      "HLR-testet",
      "AKUT-testet (Ansikte, Kroppsdel, Uttal, Tid)",
      "Syn-testet",
      "Balans-testet"
    ],
    correctAnswer: 1,
    explanation: "AKUT-testet används för att upptäcka stroke: Hänger Ansiktet? Kan Kroppsdel (arm) lyftas? Är Uttalet sluddrigt? Tid är avgörande - ring 112.",
    category: "Taxi"
  },
  {
    id: 506,
    question: "Måste du som taxiförare alltid ge kvitto på resan?",
    options: [
      "Nej, bara om kunden ber om det",
      "Ja, alltid (om det inte är en avtalsresa där kvitto skickas elektroniskt till företaget)",
      "Nej, inte vid resor under 100 kr",
      "Ja, men bara vid kortbetalning"
    ],
    correctAnswer: 1,
    explanation: "Taxiförare är skyldiga att erbjuda kvitto efter avslutad körning.",
    category: "Taxi"
  },
  {
    id: 507,
    question: "Vad innebär prisinformationen på den gula dekalen på taxibilens ruta?",
    options: [
      "Det exakta priset för en resa på 10 km",
      "Jämförpriset för en typresa (10 km, 15 minuter)",
      "Startavgiften",
      "Maxpriset per timme"
    ],
    correctAnswer: 1,
    explanation: "Jämförpriset visar kostnaden för en resa på 10 km som tar 15 minuter inklusive grundavgift.",
    category: "Taxi"
  },
  {
    id: 508,
    question: "Får du neka en körning på grund av att kunden har en funktionsnedsättning?",
    options: [
      "Ja, om det är besvärligt",
      "Nej, det är diskriminering",
      "Ja, om bilen inte är specialutrustad",
      "Ja, om resan är kort"
    ],
    correctAnswer: 1,
    explanation: "Att neka körning pga funktionsnedsättning är diskriminering, så länge inte säkerheten äventyras (t.ex. om rullstol inte kan säkras).",
    category: "Taxi"
  },
  {
    id: 509,
    question: "Vad ska du göra om en kund glömmer sin mobiltelefon i bilen?",
    options: [
      "Behålla den själv",
      "Lämna den till polisen (hittegods) eller till beställningscentralen",
      "Kasta den",
      "Sälja den"
    ],
    correctAnswer: 1,
    explanation: "Glömda föremål ska hanteras som hittegods och lämnas till polisen eller taxibolagets hittegodsavdelning.",
    category: "Taxi"
  },
  {
    id: 510,
    question: "Hur länge är en taxiförarlegitimation giltig innan den måste förnyas?",
    options: [
      "5 år",
      "10 år",
      "Tills vidare",
      "3 år"
    ],
    correctAnswer: 0,
    explanation: "Taxiförarlegitimationen gäller i 5 år och måste sedan förnyas.",
    category: "Taxi"
  },
  {
    id: 511,
    question: "Vilket dokument måste alltid finnas synligt i taxibilen för passageraren?",
    options: [
      "Registreringsbeviset",
      "Förarens taxiförarlegitimation",
      "Försäkringsbrevet",
      "Bilens instruktionsbok"
    ],
    correctAnswer: 1,
    explanation: "Taxiförarlegitimationen ska vara placerad väl synlig för passagerarna.",
    category: "Taxi"
  },
  {
    id: 512,
    question: "Vad är viktigast vid körning av barn i taxi?",
    options: [
      "Att barnet sitter tyst",
      "Att barnet använder godkänd skyddsanordning (bilbarnstol/kudde) anpassad för ålder och längd",
      "Att barnet sitter i framsätet",
      "Att barnet håller i sig"
    ],
    correctAnswer: 1,
    explanation: "Barn ska alltid sitta i godkänd skyddsanordning. Taxi ska kunna erbjuda detta vid förbeställning, annars gäller särskilda regler för korta resor (bälte i baksäte för barn över 3 år).",
    category: "Taxi"
  },
  {
    id: 513,
    question: "Vad gäller för tomgångskörning i de flesta kommuner?",
    options: [
      "Max 5 minuter",
      "Max 1 minut",
      "Ingen begränsning för taxi",
      "Max 10 minuter vid kyla"
    ],
    correctAnswer: 1,
    explanation: "De flesta kommuner har en gräns på max 1 minut tomgångskörning (förutom vid köbildning etc.).",
    category: "Taxi"
  },
  {
    id: 514,
    question: "En kund har diabetes och verkar bli förvirrad och svettig (lågt blodsocker). Vad bör du erbjuda?",
    options: [
      "Vatten",
      "Något sött (druvsocker, läsk, godis)",
      "Insulin",
      "En sovmöjlighet"
    ],
    correctAnswer: 1,
    explanation: "Vid insulinkänning (lågt blodsocker) behöver personen snabbt få i sig socker.",
    category: "Taxi"
  },
  {
    id: 515,
    question: "Får du använda bussfilen när du kör taxi?",
    options: [
      "Aldrig",
      "Ja, om det anges på tilläggstavla (TEXT 'Taxi' eller symbol)",
      "Alltid",
      "Bara med passagerare i bilen"
    ],
    correctAnswer: 1,
    explanation: "Taxi får använda bussfil endast om det är skyltat att det är tillåtet för taxi.",
    category: "Taxi"
  },
  {
    id: 516,
    question: "Vad är Eco-driving?",
    options: [
      "Att köra långsamt",
      "Ett sparsamt körsätt som minskar bränsleförbrukning och utsläpp",
      "Att köra på el",
      "Att tvätta bilen miljövänligt"
    ],
    correctAnswer: 1,
    explanation: "Eco-driving innebär att köra mjukt, planera körningen och motorbromsa för att spara miljö och pengar.",
    category: "Taxi"
  },
  {
    id: 517,
    question: "Vad ska du göra om du känner dig mycket trött under ett arbetspass?",
    options: [
      "Dricka kaffe och köra vidare",
      "Öppna fönstret",
      "Stanna och vila/sova en stund eller avbryta passet",
      "Spela hög musik"
    ],
    correctAnswer: 2,
    explanation: "Trötthet kan vara lika farligt som alkohol. Enda botemedlet är sömn/vila.",
    category: "Taxi"
  },
  {
    id: 518,
    question: "Hur hanterar du bäst en aggressiv kund?",
    options: [
      "Skriker tillbaka",
      "Behåller lugnet, lyssnar och försöker avstyra konflikten utan våld",
      "Kastar ut kunden direkt",
      "Låser dörrarna och kör till polisen direkt utan att säga något"
    ],
    correctAnswer: 1,
    explanation: "Ett lugnt och professionellt bemötande dämpar ofta konflikter. Säkerheten går dock alltid först.",
    category: "Taxi"
  },
  {
    id: 519,
    question: "Vad gäller angående tystnadsplikt för taxiförare?",
    options: [
      "Det finns ingen lag om tystnadsplikt, men det är god yrkesetik att inte prata om kunders angelägenheter",
      "Det är straffbart enligt lag att nämna vem man kört",
      "Man får berätta allt för sina kollegor",
      "Man måste rapportera allt till polisen"
    ],
    correctAnswer: 0,
    explanation: "Diskretion är en hederssak och viktig del av yrkesetiken, även om det inte lyder under samma sekretesslagar som t.ex. sjukvård (om det inte är färdtjänst/sjukresor där avtal kan reglera detta).",
    category: "Taxi"
  },
  {
    id: 520,
    question: "Vilken utrustning är obligatorisk i en taxibil?",
    options: [
      "Taxameter (eller godkänd utrustning för särskild skattekontroll)",
      "GPS",
      "Kortterminal",
      "Radio"
    ],
    correctAnswer: 0,
    explanation: "En godkänd taxameter är krav för de flesta taxifordon.",
    category: "Taxi"
  },
  {
    id: 521,
    question: "Får du ta upp passagerare 'på gatan' (vinka in)?",
    options: [
      "Ja, om bilen är ledig",
      "Nej, endast förbokade resor är tillåtna",
      "Ja, men bara vid taxistolpar",
      "Nej, det är olagligt"
    ],
    correctAnswer: 0,
    explanation: "Taxi får ta upp kunder på gatan (vinkning) om inget lokalt förbud finns.",
    category: "Taxi"
  },
  {
    id: 522,
    question: "Vad ska du göra vid en viltolycka med ett rådjur?",
    options: [
      "Köra vidare om bilen inte är skadad",
      "Markera platsen och ringa 112 (Polisen)",
      "Ringa försäkringsbolaget",
      "Ta med djuret hem"
    ],
    correctAnswer: 1,
    explanation: "Du är skyldig att märka ut platsen och anmäla till polisen vid sammanstötning med större vilt (älg, rådjur, vildsvin etc.).",
    category: "Taxi"
  },
  {
    id: 523,
    question: "Vilket mönsterdjup gäller för sommardäck på personbil (taxi)?",
    options: [
      "Minst 3 mm",
      "Minst 1,6 mm",
      "Minst 5 mm",
      "Minst 1,0 mm"
    ],
    correctAnswer: 1,
    explanation: "1,6 mm är lagkravet för sommardäck på personbil.",
    category: "Taxi"
  },
  {
    id: 524,
    question: "Vad är viktigt att tänka på vid lastning av bagage i en kombibil?",
    options: [
      "Att lasta tungt högst upp",
      "Att lasta tungt långt in mot ryggstödet och säkra lasten så den inte kommer flygande vid inbromsning",
      "Att lägga allt löst",
      "Att inte lasta mer än 10 kg"
    ],
    correctAnswer: 1,
    explanation: "Tung last ska placeras lågt och långt fram (mot ryggstödet) och säkras.",
    category: "Taxi"
  },
  {
    id: 525,
    question: "Hur påverkar felaktigt däcktryck körningen?",
    options: [
      "Det påverkar inte",
      "Det kan öka bränsleförbrukningen och försämra vägegenskaperna",
      "Det gör bilen snabbare",
      "Det minskar slitaget"
    ],
    correctAnswer: 1,
    explanation: "Rätt däcktryck är viktigt för säkerhet och ekonomi.",
    category: "Taxi"
  },
  {
    id: 526,
    question: "Du ska hämta en äldre person med rullator. Vad gör du?",
    options: [
      "Sitter kvar i bilen och väntar",
      "Tutar",
      "Går ur bilen, hjälper kunden in och lastar rullatorn",
      "Säger att rullatorn inte får plats"
    ],
    correctAnswer: 2,
    explanation: "God service innebär att hjälpa kunden vid behov, särskilt äldre eller rörelsehindrade.",
    category: "Taxi"
  },
  {
    id: 527,
    question: "Vad är HLR?",
    options: [
      "Hjärt-Lung-Räddning",
      "Hög-Last-Risk",
      "Håll-Lugn-Ratta",
      "Hjälp-Larm-Räddning"
    ],
    correctAnswer: 0,
    explanation: "Hjärt-Lung-Räddning (30 kompressioner, 2 inblåsningar).",
    category: "Taxi"
  },
  {
    id: 528,
    question: "Får du köra taxi om du har glömt din taxiförarlegitimation hemma?",
    options: [
      "Ja, om du har vanligt körkort med dig",
      "Nej, den ska medföras i original",
      "Ja, om du kan ditt personnummer",
      "Ja, för korta resor"
    ],
    correctAnswer: 1,
    explanation: "Taxiförarlegitimationen ska medföras i fordonet under yrkesutövning.",
    category: "Taxi"
  },
  {
    id: 529,
    question: "Vad innebär 'Beställningscentral'?",
    options: [
      "Där man beställer mat",
      "Den funktion som tar emot bokningar och fördelar körningar till bilarna",
      "En verkstad",
      "En parkeringsplats"
    ],
    correctAnswer: 1,
    explanation: "Beställningscentralen (växeln) koordinerar trafiken.",
    category: "Taxi"
  },
  {
    id: 530,
    question: "Hur ska du agera vid en trafikolycka där du är först på plats?",
    options: [
      "Köra förbi försiktigt",
      "Överblicka, Varna (sätt ut varningstriangel), Larma 112, Rädda (första hjälpen)",
      "Filma med mobilen",
      "Ringa chefen"
    ],
    correctAnswer: 1,
    explanation: "L-ABC eller Varna-Larma-Rädda är grundprincipen.",
    category: "Taxi"
  }
];

export default function Quiz({ onBack, demo = false }: { onBack: () => void, demo?: boolean }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'menu' | 'quiz' | 'result' | 'guide'>('menu');
  const [guideTab, setGuideTab] = useState<'basics' | 'methods' | 'tables'>('basics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{questionId: number, correct: boolean}[]>([]);
  const [activeTab, setActiveTab] = useState<'practice' | 'tags' | 'final'>('practice');
  const [selectedCategory, setSelectedCategory] = useState<string>('Blandade frågor');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  // Initialize Demo Mode
  useEffect(() => {
    if (demo) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
      setActiveQuestions(shuffled);
      setQuestionCount(10);
      setMode('quiz');
    }
  }, [demo]);

  // Stats state
  const [stats, setStats] = useState({
    unanswered: 0,
    incorrect: 0,
    saved: 0
  });

  // Load stats from local storage on mount
  useState(() => {
    const savedStats = localStorage.getItem('quizStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Calculate initial stats
      const initialStats = {
        unanswered: questions.length,
        incorrect: 0,
        saved: 0
      };
      setStats(initialStats);
      localStorage.setItem('quizStats', JSON.stringify(initialStats));
    }
  });

  const [savedQuestions, setSavedQuestions] = useState<number[]>(() => {
    const saved = localStorage.getItem('savedQuestions');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveQuestion = (id: number) => {
    const newSaved = savedQuestions.includes(id)
      ? savedQuestions.filter(qId => qId !== id)
      : [...savedQuestions, id];
    
    setSavedQuestions(newSaved);
    localStorage.setItem('savedQuestions', JSON.stringify(newSaved));
    
    // Update stats
    const newStats = { ...stats, saved: newSaved.length };
    setStats(newStats);
    localStorage.setItem('quizStats', JSON.stringify(newStats));
  };

  const startRandomQuiz = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    setActiveQuestions(shuffled);
    startQuizSession();
  };

  const startQuiz = () => {
    if (demo) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
      setActiveQuestions(shuffled);
      startQuizSession();
      return;
    }

    let quizQuestions = [...questions];
    
    if (activeTab === 'final') {
      // Final exam mode: Mixed categories, 55 questions (or max available)
      quizQuestions = quizQuestions.sort(() => Math.random() - 0.5).slice(0, 55);
    } else {
      // Practice mode
      if (selectedCategory !== 'Blandade frågor') {
        quizQuestions = quizQuestions.filter(q => q.category === selectedCategory);
      }
      // Shuffle and slice
      quizQuestions = quizQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount);
    }
    
    setActiveQuestions(quizQuestions);
    startQuizSession();
  };

  const startQuizSession = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setIsAnswered(false);
    setSelectedOption(null);
    setMode('quiz');
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    const currentQuestion = activeQuestions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      // Update stats if needed (e.g. reduce unanswered count if tracked per question)
    } else {
      // Update incorrect stats
      const newStats = { ...stats, incorrect: stats.incorrect + 1 };
      setStats(newStats);
      localStorage.setItem('quizStats', JSON.stringify(newStats));
    }
    
    setAnswers([...answers, { questionId: currentQuestion.id, correct: isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setMode('result');
    }
  };

  const restartQuiz = () => {
    setMode('menu');
    setScore(0);
    setAnswers([]);
  };

  // Image fallback helper
  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'Taxi': return 'https://images.unsplash.com/photo-1556122071-e404ea947d56?auto=format&fit=crop&q=80&w=1000';
      case 'Lastsäkring': return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1000';
      case 'Fordonsteknik': return 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1000';
      case 'Trafikregler': return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000';
      case 'Säkerhetskontroll': return 'https://images.unsplash.com/photo-1632823471565-1ec2a1ad4015?auto=format&fit=crop&q=80&w=1000';
      case 'ADR': return 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=1000';
      case 'YKB': return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000';
      default: return 'https://images.unsplash.com/photo-1501700493788-fa1c4bf9fe69?auto=format&fit=crop&q=80&w=1000'; // Generic road/truck
    }
  };

  if (mode === 'menu') {
    // Guard against demo mode accessing menu
    if (demo) {
      return null; // Or a loading spinner, effect will switch to 'quiz'
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 ring-4 ring-white dark:ring-slate-900">
                <Award size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Körkortsquiz</h1>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide dark:bg-blue-900/30 dark:text-blue-300">C-Behörighet</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide dark:bg-indigo-900/30 dark:text-indigo-300">YKB</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-600 font-bold shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:ring-slate-300 transition-all dark:bg-slate-800 dark:ring-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Avsluta</span>
            </button>
          </header>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Stats & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Stats Card */}
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Din Statistik
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <Check size={24} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Besvarade</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                          {questions.length - stats.unanswered} <span className="text-sm text-slate-400 font-bold">/ {questions.length}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-700/50" />

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 dark:bg-rose-900/20 dark:text-rose-400 group-hover:scale-110 transition-transform">
                        <AlertCircle size={24} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Felaktiga</p>
                        <p className="text-2xl font-black text-rose-500 dark:text-rose-400">{stats.incorrect}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-700/50" />

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 dark:bg-amber-900/20 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <Bookmark size={24} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sparade</p>
                        <p className="text-2xl font-black text-amber-500 dark:text-amber-400">{savedQuestions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <button 
                  onClick={startRandomQuiz}
                  className="w-full group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-1 text-white shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/30 hover:-translate-y-1 active:translate-y-0"
                >
                  <div className="relative h-full bg-white/10 backdrop-blur-sm rounded-[1.8rem] p-6 flex items-center gap-5 hover:bg-white/15 transition-colors">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner ring-1 ring-white/20">
                      <Shuffle size={28} />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-black text-xl mb-1">Slumpmässigt</h3>
                      <p className="text-blue-100 text-sm font-medium">10 blandade frågor</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-blue-600 transition-all">
                      <Play size={20} className="ml-1 fill-current" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setMode('guide')}
                  className="w-full group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-indigo-100 dark:bg-slate-800 dark:ring-slate-700"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-900/20 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Package size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Lastsäkringsguide</h3>
                      <p className="text-slate-500 text-sm font-medium dark:text-slate-400">Lär dig grunderna & metoder</p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </button>
              </div>

              {/* External Practice */}
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-emerald-500" />
                  Öva externt
                </h3>
                <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-700">
                  <iframe 
                    src="https://quizlet.com/1054700982/match/embed?i=61udir&x=1jj1" 
                    height="240" 
                    width="100%" 
                    style={{ border: 0 }}
                    title="Quizlet Säkerhetskontroll"
                  ></iframe>
                </div>
              </div>

            </div>

            {/* Right Column: Custom Quiz (8 cols) */}
            <div className="lg:col-span-8">
              <div className="h-full flex flex-col rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden dark:bg-slate-800 dark:ring-slate-700 dark:shadow-none">
                
                {/* Header */}
                <div className="p-8 pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <Settings size={20} />
                      </div>
                      Anpassat prov
                    </h2>
                  </div>

                  {/* Tabs */}
                  <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/50">
                    <button 
                      onClick={() => setActiveTab('practice')}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${activeTab === 'practice' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-white dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      Övningsprov
                    </button>
                    <button 
                      onClick={() => setActiveTab('tags')}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${activeTab === 'tags' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-white dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      Taggar
                    </button>
                    <button 
                      onClick={() => setActiveTab('final')}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${activeTab === 'final' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-white dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      Slutprov
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category Selection */}
                  <div className="space-y-4 flex flex-col min-h-0">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-px w-4 bg-slate-300 dark:bg-slate-600"></span>
                      Välj Kategori
                      <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></span>
                    </label>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2 space-y-2 max-h-[400px]">
                      {activeTab === 'final' ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 text-center dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
                          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-800">
                            <Trophy size={32} className="text-slate-400" />
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white mb-1">Slutprovsläge</p>
                          <p className="text-sm">Blandar automatiskt frågor från alla kategorier för att simulera ett riktigt prov.</p>
                        </div>
                      ) : (
                        ['Blandade frågor', 'Kopplingar', 'Säkerhetskontroll', 'Bromsar', 'Vikter', 'Däck', 'Lastsäkring', 'Trafikregler', 'Fordonsteknik', 'ADR', 'Lagar & Regler', 'YKB', 'Buss', 'Taxi'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full group flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                              selectedCategory === cat 
                                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500' 
                                : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-[1.02] dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{cat}</span>
                            {selectedCategory === cat ? (
                              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-slate-200 group-hover:border-slate-300 dark:border-slate-700"></div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Settings & Start */}
                  <div className="flex flex-col h-full space-y-8">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <span className="h-px w-4 bg-slate-300 dark:bg-slate-600"></span>
                        Antal Frågor
                        <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></span>
                      </label>
                      
                      {activeTab === 'final' ? (
                         <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 text-center dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
                           <p className="font-black text-3xl text-slate-900 dark:text-white mb-1">55</p>
                           <p className="text-xs font-bold uppercase tracking-wider">Frågor</p>
                         </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {[5, 10, 20, 55].map((count) => (
                            <button
                              key={count}
                              onClick={() => setQuestionCount(count)}
                              className={`py-4 rounded-2xl border-2 text-sm font-black transition-all ${
                                questionCount === count
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                                  : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/50 dark:text-slate-300'
                              }`}
                            >
                              {count}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/50 mb-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 dark:text-white">Sammanfattning</h4>
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 dark:bg-slate-800">
                            <ClipboardCheck size={16} />
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400">Kategori</span>
                            <span className="font-bold text-slate-900 dark:text-white text-right max-w-[150px] truncate">{selectedCategory}</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400">Antal frågor</span>
                            <span className="font-bold text-slate-900 dark:text-white">{questionCount} st</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={startQuiz}
                        className="w-full group flex items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Play size={16} className="fill-current ml-0.5" />
                        </div>
                        <span className="text-lg">Starta provet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const passed = percentage >= 80;
    const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={demo ? onBack : restartQuiz}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> {demo ? 'Avsluta demo' : 'Tillbaka till översikt'}
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none"
          >
            <div className={`p-12 text-center relative overflow-hidden ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20' : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20'}`}>
              <div className="relative z-10">
                <div className={`mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full shadow-xl ${passed ? 'bg-white text-green-600 dark:bg-slate-800 dark:text-green-400' : 'bg-white text-red-600 dark:bg-slate-800 dark:text-red-400'}`}>
                  {passed ? <Trophy size={56} /> : <AlertCircle size={56} />}
                </div>
                <h2 className="mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {passed ? 'Godkänt!' : 'Underkänt'}
                </h2>
                <p className="text-xl font-medium text-slate-600 dark:text-slate-300">
                  Du fick {score} av {activeQuestions.length} rätt ({percentage}%)
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5 text-sm font-bold backdrop-blur-sm dark:bg-black/20">
                  <span className={passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    {passed ? 'Bra jobbat!' : 'Försök igen!'}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 dark:text-slate-300">Krav: 80%</span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardCheck size={24} className="text-blue-500" />
                    Genomgång av svar
                  </h3>
                  <button 
                    onClick={() => setShowOnlyIncorrect(!showOnlyIncorrect)}
                    className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${showOnlyIncorrect ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
                  >
                    {showOnlyIncorrect ? 'Visar endast fel' : 'Visa endast fel'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {activeQuestions
                    .filter(q => !showOnlyIncorrect || !answers.find(a => a.questionId === q.id)?.correct)
                    .map((q, i) => {
                    const answer = answers.find(a => a.questionId === q.id);
                    const isCorrect = answer?.correct;
                    // Find original index for display
                    const originalIndex = activeQuestions.findIndex(aq => aq.id === q.id);
                    
                    return (
                      <div key={q.id} className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {originalIndex + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white mb-1">{q.question}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Rätt svar: <span className="font-semibold text-slate-700 dark:text-slate-300">{q.options[q.correctAnswer]}</span>
                          </p>
                        </div>
                        {isCorrect ? (
                          <Check className="text-green-500 shrink-0" size={24} />
                        ) : (
                          <X className="text-red-500 shrink-0" size={24} />
                        )}
                      </div>
                    );
                  })}
                  {showOnlyIncorrect && activeQuestions.every(q => answers.find(a => a.questionId === q.id)?.correct) && (
                    <div className="text-center py-8 text-slate-500">
                      <p>Inga fel att visa! Bra jobbat! 🎉</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={startQuiz}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95"
                >
                  <RefreshCcw size={20} /> Försök igen
                </button>
                <button
                  onClick={demo ? onBack : restartQuiz}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-4 font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  {demo ? 'Avsluta demo' : 'Tillbaka till menyn'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === 'guide') {
    // Guard against demo mode accessing guide
    if (demo) {
      return null;
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setMode('menu')}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Tillbaka till menyn
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Lastsäkringsguide</h1>
            <p className="text-slate-500 font-medium dark:text-slate-400">Grundläggande principer och metoder för säker lastning</p>
          </div>

          <div className="flex mb-8 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 overflow-x-auto">
            <button 
              onClick={() => setGuideTab('basics')}
              className={`flex-1 min-w-[120px] rounded-xl py-3 text-sm font-bold transition-all ${guideTab === 'basics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              Grundprinciper
            </button>
            <button 
              onClick={() => setGuideTab('methods')}
              className={`flex-1 min-w-[120px] rounded-xl py-3 text-sm font-bold transition-all ${guideTab === 'methods' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              Metoder
            </button>
            <button 
              onClick={() => setGuideTab('tables')}
              className={`flex-1 min-w-[120px] rounded-xl py-3 text-sm font-bold transition-all ${guideTab === 'tables' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              Tumregler
            </button>
          </div>

          <div className="space-y-6">
            {guideTab === 'basics' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="text-blue-500" />
                    Krafter att säkra mot
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    När du kör utsätts lasten för krafter som vill få den att röra på sig. Lastsäkringen måste klara av att hålla emot dessa krafter.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">80%</div>
                      <div className="font-bold text-slate-900 dark:text-white mb-1">Framåt</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Vid kraftig inbromsning</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">50%</div>
                      <div className="font-bold text-slate-900 dark:text-white mb-1">Bakåt</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Vid acceleration</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">50%</div>
                      <div className="font-bold text-slate-900 dark:text-white mb-1">Sidled</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Vid kurvtagning</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Friktion</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    Friktionen mellan lasten och underlaget hjälper till att hålla lasten på plats. Ju högre friktion, desto mindre lastsäkring behövs.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Använd friktionsmattor för att öka friktionen drastiskt.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Håll flaket rent från is, snö, olja och grus som minskar friktionen.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X size={18} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Lita aldrig enbart på friktionen!</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {guideTab === 'methods' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <Package size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Förstängning</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      Att blockera lasten mot framstam, bakstam eller sidolemmar. Detta är ofta den mest effektiva metoden.
                    </p>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Rekommenderas</div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 dark:bg-blue-900/30 dark:text-blue-400">
                      <RefreshCcw size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Överfallssurrning</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      Spännband över lasten som pressar den mot flaket. Ökar friktionen men säkrar inte direkt mot glidning om friktionen är låg.
                    </p>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Vanligast</div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Check size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Grimma / Loop</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      Bandet läggs runt lasten och fästs i båda sidor. Mycket effektivt för att förhindra att lasten glider framåt eller bakåt.
                    </p>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Bra för rör/långgods</div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 dark:bg-amber-900/30 dark:text-amber-400">
                      <Award size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rak surrning</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      Bandet går direkt från lasten till fästpunkten. Den starkaste metoden men kräver fästpunkter på godset.
                    </p>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Starkast</div>
                  </div>
                </div>
              </motion.div>
            )}

            {guideTab === 'tables' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tumregler för överfallssurrning</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Tabellen nedan är en förenkling. Kontrollera alltid med TYA:s lathund eller Transportstyrelsens föreskrifter för exakta värden.
                  </p>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold">
                        <tr>
                          <th className="p-4">Friktion</th>
                          <th className="p-4">Mot glidning framåt</th>
                          <th className="p-4">Mot glidning i sidled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr className="bg-white dark:bg-slate-800">
                          <td className="p-4 font-medium">Låg (Is/Snö)</td>
                          <td className="p-4 text-red-600 dark:text-red-400">Kräver förstängning!</td>
                          <td className="p-4 text-red-600 dark:text-red-400">Kräver förstängning!</td>
                        </tr>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <td className="p-4 font-medium">Normal (Trä mot flak)</td>
                          <td className="p-4">1 ton last = ca 4 ton surrning</td>
                          <td className="p-4">1 ton last = ca 2 ton surrning</td>
                        </tr>
                        <tr className="bg-white dark:bg-slate-800">
                          <td className="p-4 font-medium">Hög (Friktionsmatta)</td>
                          <td className="p-4 text-green-600 dark:text-green-400">Mycket effektivt</td>
                          <td className="p-4 text-green-600 dark:text-green-400">Ofta ingen extra surrning</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 text-amber-800 text-sm border border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800/50">
                    <strong>OBS:</strong> En överfallssurrning pressar bara ner lasten. Den hindrar inte glidning lika bra som förstängning. Kombinera alltid metoder för bästa säkerhet.
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Full size question image"
              className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 dark:bg-slate-900/80 dark:border-slate-800 transition-all">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={restartQuiz}
              className="group h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white"
              title="Avsluta provet"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex flex-col flex-1 max-w-xs">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Fråga {currentQuestionIndex + 1}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">av {activeQuestions.length}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                <motion.div 
                  className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => toggleSaveQuestion(currentQuestion.id)}
              className={`h-10 w-10 md:w-auto md:px-4 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                savedQuestions.includes(currentQuestion.id)
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
              }`}
              title={savedQuestions.includes(currentQuestion.id) ? 'Ta bort bokmärke' : 'Spara fråga'}
            >
              <Bookmark size={18} className={savedQuestions.includes(currentQuestion.id) ? 'fill-current' : ''} />
              <span className="hidden md:inline">{savedQuestions.includes(currentQuestion.id) ? 'Sparad' : 'Spara'}</span>
            </button>
            <button 
              className="h-10 w-10 md:w-auto md:px-4 flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              title="Rapportera fel"
            >
              <AlertCircle size={18} />
              <span className="hidden md:inline">Rapportera</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full p-4 md:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                {/* Question Area */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-6">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 ring-1 ring-blue-500/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-500/20">
                      {currentQuestion.category || 'Allmänt'}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  <div 
                    className="group relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg ring-1 ring-slate-900/5 cursor-zoom-in dark:bg-slate-800 dark:ring-white/10 aspect-video md:aspect-[16/10]"
                    onClick={() => setSelectedImage(currentQuestion.imageUrl || getCategoryImage(currentQuestion.category))}
                  >
                    <img 
                      src={currentQuestion.imageUrl || getCategoryImage(currentQuestion.category)} 
                      alt="Question illustration" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                      <div className="rounded-full bg-white/90 p-4 opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90 backdrop-blur-sm">
                        <ImageIcon size={24} className="text-slate-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Klicka för att förstora
                    </div>
                  </div>
                </div>

                {/* Options Area */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      const isCorrect = index === currentQuestion.correctAnswer;
                      const showResult = isAnswered;

                      let containerStyle = "bg-white border-2 border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600";
                      let icon = <div className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-500 transition-colors group-hover:border-blue-400" />;
                      let textStyle = "text-slate-700 dark:text-slate-200";
                      
                      if (showResult) {
                        if (isCorrect) {
                          containerStyle = "bg-emerald-50 border-2 border-emerald-500 shadow-md ring-1 ring-emerald-500/20 dark:bg-emerald-900/10 dark:border-emerald-500/50";
                          icon = <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200 dark:ring-emerald-900"><Check size={14} strokeWidth={3} /></div>;
                          textStyle = "text-emerald-900 font-bold dark:text-emerald-100";
                        } else if (isSelected) {
                          containerStyle = "bg-rose-50 border-2 border-rose-500 shadow-md ring-1 ring-rose-500/20 dark:bg-rose-900/10 dark:border-rose-500/50";
                          icon = <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm ring-2 ring-rose-200 dark:ring-rose-900"><X size={14} strokeWidth={3} /></div>;
                          textStyle = "text-rose-900 font-bold dark:text-rose-100";
                        } else {
                          containerStyle = "bg-slate-50 border-slate-100 opacity-50 grayscale dark:bg-slate-800/50 dark:border-slate-800";
                        }
                      } else if (isSelected) {
                        containerStyle = "bg-blue-50 border-2 border-blue-500 shadow-md ring-1 ring-blue-500/20 dark:bg-blue-900/20 dark:border-blue-500";
                        icon = <div className="h-6 w-6 rounded-full border-[6px] border-blue-500 shadow-sm" />;
                        textStyle = "text-blue-900 font-bold dark:text-blue-100";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={isAnswered}
                          className={`group w-full relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.99] ${containerStyle}`}
                        >
                          <div className="flex items-start gap-4 relative z-10">
                            <div className="mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110">
                              {icon}
                            </div>
                            <span className={`text-lg leading-snug ${textStyle}`}>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/10 dark:bg-blue-600 dark:shadow-blue-900/20"
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-inner">
                            <HelpCircle size={24} className="text-blue-200" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-1 font-bold text-lg text-white">Förklaring</h4>
                            <p className="text-slate-300 text-sm leading-relaxed dark:text-blue-50">
                              {currentQuestion.explanation}
                            </p>
                            {currentQuestion.readMoreUrl && (
                              <a 
                                href={currentQuestion.readMoreUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white transition-colors uppercase tracking-wide"
                              >
                                Läs mer hos Transportstyrelsen <ChevronRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={nextQuestion}
                          className="w-full group flex items-center justify-center gap-2 rounded-xl bg-white py-4 font-bold text-slate-900 shadow-lg transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="text-lg">{currentQuestionIndex < activeQuestions.length - 1 ? 'Nästa fråga' : 'Visa resultat'}</span>
                          <div className="h-6 w-6 rounded-full bg-slate-900/10 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
