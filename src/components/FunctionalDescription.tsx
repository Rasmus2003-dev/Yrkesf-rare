import { useState, type ElementType } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, BookOpen, Truck, Activity, Disc, Users, AlertCircle, Search, X, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectionData {
  id: string;
  title: string;
  icon: ElementType;
  color: string;
  content: {
    subtitle?: string;
    items: string[];
  }[];
}

const sections: SectionData[] = [
  {
    id: 'dack',
    title: 'Däck & Hjul',
    icon: Truck,
    color: 'bg-blue-500',
    content: [
      {
        subtitle: 'Vad har du kontrollerat på däcken?',
        items: [
          'Att det inte fastnat något mellan däcken på tvillingmontage.',
          'Däckens lufttryck.',
          'Mönsterdjupet.',
          'Inga skador eller sprickor.',
          'Vilken typ av däck det är.',
          'Att fälgen ser bra ut samt att muttrarna sitter fast och ingen rost syns runt muttrarna.',
          'Att stänkskydden sitter fast.'
        ]
      },
      {
        subtitle: 'Minsta tillåtna mönsterdjup på vinter- samt sommardäck?',
        items: [
          'Vinterdäck: Minst 5 mm.',
          'Sommardäck: Minst 1,6 mm (yttre däck på tvillingmontage kan vara mindre så länge corden inte syns).'
        ]
      },
      {
        subtitle: 'Varför slog du med hammaren på däcken?',
        items: [
          'För att kontrollera så att det inte är punktering (lyssnar efter att det är samma klang på däcken).'
        ]
      },
      {
        subtitle: 'Hur ser du att det är vinterdäck på bilen?',
        items: [
          'Däcket måste vara märkt med alptopp (berg) / snöflinga.'
        ]
      },
      {
        subtitle: 'När ska man ha vinterdäck på bilen?',
        items: [
          'Kravet är från 10 november till 10 april.',
          'Dubbdäck får du ha från 1 oktober till 15 april.'
        ]
      },
      {
        subtitle: 'När ska man ha sommardäck på bilen?',
        items: [
          'Från 11 april till 9 november.'
        ]
      },
      {
        subtitle: 'Kan man använda ett sommardäck under vintertiden?',
        items: [
          'Nej.'
        ]
      },
      {
        subtitle: 'Kan man använda ett vinterdäck sommartid?',
        items: [
          'Ja.'
        ]
      },
      {
        subtitle: 'Vad behöver man tänka på när man har bytt däck?',
        items: [
          'Åka tillbaka till däckverkstad efter 5–10 mil och efterdra muttrarna.'
        ]
      },
      {
        subtitle: 'Vad händer om det finns sten mellan däcken på tvillingmontage?',
        items: [
          'Stor risk att skada däcken och stenen/föremålet kan flyga på bilarna bakom mig.'
        ]
      },
      {
        subtitle: 'Vad händer om det är för lite luft i däcket?',
        items: [
          'Däcket blir varmt och risk för explosion, slitage på sidorna, bränsleförbrukningen ökar och köregenskaper ändras.'
        ]
      },
      {
        subtitle: 'Vad händer om det är för mycket luft i däcket?',
        items: [
          'Risk för explosion, slitage på däckens mitt, bränsleförbrukningen minskar och köregenskaper ändras.'
        ]
      },
      {
        subtitle: 'Hur ska du montera dubbdäck?',
        items: [
          'Axelvis. Tunga lastbilar och bussar får inte använda både dubbade och odubbade däck på samma axel.'
        ]
      },
      {
        subtitle: 'Varför finns det stänkskydd?',
        items: [
          'Minska stenskott och att mindre smutsvatten kommer på bilarna bakom lastbilen.'
        ]
      },
      {
        subtitle: 'Vad händer om det rinner rostvatten från muttrarna?',
        items: [
          'Då är muttrarna lösa och måste dras åt.'
        ]
      }
    ]
  },
  {
    id: 'styrservo',
    title: 'Styrservo',
    icon: Activity,
    color: 'bg-green-500',
    content: [
      {
        subtitle: 'Vilka kontroller har du gjort på styrservon?',
        items: [
          'Den svänger mjukt och ratten hugger inte.'
        ]
      },
      {
        subtitle: 'Om ratten hugger, vad är felet?',
        items: [
          'Finns luft eller smuts i systemet.'
        ]
      },
      {
        subtitle: 'Vad ska du tänka på när du byter styrservoolja?',
        items: [
          'Ska vara rätt mängd (om oljan är liten blir det luft i systemet, om oljan är mycket blir det spill från behållaren).',
          'Ingen smuts ska komma in.'
        ]
      }
    ]
  },
  {
    id: 'fardskrivare',
    title: 'Färdskrivare',
    icon: BookOpen,
    color: 'bg-purple-500',
    content: [
      {
        subtitle: 'Vad har du kontrollerat på färdskrivaren?',
        items: [
          'Besiktningsdatum.',
          'Att mätarställning stämmer överens med bilens mätarställning.',
          'Att plomberingen är korrekt/kvar.',
          'Att tiden stämmer.',
          'Att det finns minst 6 pappersrullar.'
        ]
      },
      {
        subtitle: 'Hur ofta ska man besiktiga färdskrivaren och var?',
        items: [
          'Vartannat år på en auktoriserad verkstad (godkänd verkstad).'
        ]
      },
      {
        subtitle: 'Var hittar du informationen om när färdskrivare ska besiktigas?',
        items: [
          'På kontrollappen på B-stolpe samt remsan.'
        ]
      },
      {
        subtitle: 'Vad är den röda knappen och vad är den för?',
        items: [
          'Det är färdskrivarens plombering för att stoppa fusk.'
        ]
      },
      {
        subtitle: 'Kan man köra lastbilen om färdskrivare är trasig?',
        items: [
          'Ja, max en vecka men ska fixas så fort som möjligt och du måste anteckna körtid, raster, annat arbete och vila manuellt.'
        ]
      },
      {
        subtitle: 'Kan man köra lastbilen om man har glömt förarkortet hemma?',
        items: [
          'Nej, samt att man åker och hämtar den med sin privata bil och inte lastbilen.'
        ]
      },
      {
        subtitle: 'Kan man köra lastbilen om man har tappat bort förarkortet?',
        items: [
          'Ja, max 15 dagar och anmäla förlusten till Transportstyrelsen.'
        ]
      },
      {
        subtitle: 'Vad händer om plomberingen är borta?',
        items: [
          'Körförbud.'
        ]
      },
      {
        subtitle: 'Hur länge sparas infon på förarkortet?',
        items: [
          '56 dagar bakåt plus idag.'
        ]
      },
      {
        subtitle: 'Hur länge sparas infon från färdskrivare hos arbetsgivaren?',
        items: [
          '1 år.'
        ]
      },
      {
        subtitle: 'Symbolknappar:',
        items: [
          'Ratt: Körtid.',
          'Hammare: Annat arbete.',
          'Fyrkant: Tillgänglighet.',
          'Sängen: Rast och vila.'
        ]
      },
      {
        subtitle: 'Får man köra en lastbil som har en manuell färdskrivare och du har ett förarkort men glömt den hemma?',
        items: [
          'Nej.'
        ]
      },
      {
        subtitle: 'Vad behöver du göra när bilen ska på verkstad och skrivaren sätts på OUT läge?',
        items: [
          'Måste skriva ut ”remsa 24” innan jag ändrar till OUT läge och sedan när jag hämtar bilen från verkstad måste jag skriva ut en ny ”remsa 24” innan jag sätter in förarkortet.'
        ]
      }
    ]
  },
  {
    id: 'bromsar',
    title: 'Bromssystemet',
    icon: Disc,
    color: 'bg-red-500',
    content: [
      {
        subtitle: 'Vilka kontroller har du gjort på bromsarna?',
        items: [
          'På utsidan: Dränera lufttanken. Lyssnar efter ”nysningen”. Lyssnar efter pysande ljud för att kontrollera så att matardelen inte läcker.',
          'På insidan: Täthetskontroll / 30 sekunders kontroll. Lågtrycksindikator. Färdbroms. Parkeringsbroms. Dörrbromsen (Bara för buss-eleverna).'
        ]
      },
      {
        subtitle: 'Berätta luftens väg i bromssystemet?',
        items: [
          'Luften tas in genom ett luftfilter, sen vidare till kompressor, luften torkas i lufttorken och sen går vidare till lufttankarna.'
        ]
      },
      {
        subtitle: 'Varför dränerar man tankar?',
        items: [
          'För att se om det kommer vatten, olja eller torr luft.'
        ]
      },
      {
        subtitle: 'Vad innebär det om det kommer vatten eller olja när du dränerar?',
        items: [
          'Vatten: Filtret i lufttorken är mättat.',
          'Olja: Kompressorn är sliten och släpper olja mellan kolv och cylinder.'
        ]
      },
      {
        subtitle: 'Vad blir risken om det kommer vatten när du dränerar?',
        items: [
          'Vintertid när det är minusgrader finns risk för isproppar i systemet, det resulterar i att det inte kommer fram luft till färdbromscylindern och jag tappar bromsverkan.'
        ]
      },
      {
        subtitle: 'Vad blir risken om det kommer olja när du dränerar tanken?',
        items: [
          'Gummipackningar förstörs, det blir dyra reparationskostnader om det inte åtgärdas med en gång.'
        ]
      },
      {
        subtitle: 'Varför lyssnar man efter pysande ljud på utsidan?',
        items: [
          'Kontrollerar läckage i matardelen.'
        ]
      },
      {
        subtitle: 'Varför gör man täthetskontroll?',
        items: [
          'För att kontrollera systemet är tätt (med andra ord, inget läckage i bromssystemet).'
        ]
      },
      {
        subtitle: 'Vad behöver du göra om det är läckage när du gör täthetskontroll?',
        items: [
          'Då gör jag utökad täthetskontroll. På exakt samma sätt som täthetskontroll men med motor i gång och i tre minuter i stället för 30 sekunder.'
        ]
      },
      {
        subtitle: 'Varför gör man en utökad täthetskontroll?',
        items: [
          'För att bedöma om man kan köra till verkstad eller ringa efter bärgaren.',
          'Om trycket går upp eller står konstant kan man köra till verkstad.',
          'Om trycket sjunker då är det bärgaren.'
        ]
      },
      {
        subtitle: 'Om du har 8 bar i lufttryck när du börjar den utökade täthetskontroll, när blir det körförbud?',
        items: [
          'Strax under 8 bar (om det sjunker).'
        ]
      },
      {
        subtitle: 'Hur mycket lufttryck ska det vara i systemet när du gör täthetskontroll?',
        items: [
          'Så mycket som möjligt (8, 9 eller 10 bar).'
        ]
      },
      {
        subtitle: 'Vilken broms håller lastbilen/bussen när lågtrycksindikatorn varnar?',
        items: [
          'Parkeringsbromsen.'
        ]
      },
      {
        subtitle: 'Vilken broms håller lastbilen/bussen när spärrventilen är aktiv?',
        items: [
          'Parkeringsbromsen.'
        ]
      },
      {
        subtitle: 'Vad ska du göra om lågtrycksindikatorn börjar varna under tiden du kör bilen?',
        items: [
          'Stannar omedelbart på ett säkert ställe och gör en utökad täthetskontroll för att avgöra om jag kan köra till verkstad eller om det blir körförbud samt ringa bärgaren.'
        ]
      },
      {
        subtitle: 'Varför kontrollerar man färdbromsen samt parkeringsbromsen?',
        items: [
          'Man vill vara säker så att de båda fungerar innan man ger sig ut.'
        ]
      },
      {
        subtitle: 'Vilka bromsar har din lastbil/buss?',
        items: [
          'Färdbroms, parkeringsbroms samt hjälpbroms.'
        ]
      },
      {
        subtitle: 'När du trycker på färdbromsen vilka hjul är det som bromsar?',
        items: [
          'Alla.'
        ]
      },
      {
        subtitle: 'När du ansätter parkeringsbromsen vilken axel bromsar då?',
        items: [
          'Den axel som har stora bromscylindrar (två klockor). Det är oftast drivande axeln men kan vara på flera axlar.'
        ]
      },
      {
        subtitle: 'Vilka hjälpbromsar har din lastbil/buss?',
        items: [
          'Avgasbroms och retarder.'
        ]
      },
      {
        subtitle: 'Hur fungerar avgasbromsen?',
        items: [
          'Den för tillbaka avgaserna in i motorn så att kolvarna jobbar långsammare. Det ger en motorbromsning.'
        ]
      },
      {
        subtitle: 'Hur fungerar retardern?',
        items: [
          'Hydrauliskt.'
        ]
      },
      {
        subtitle: 'För- och nackdelar med retardern?',
        items: [
          'Fördelen: Man sparar på bromsskivorna och minskar risken till att få fading (när bromsskivorna blir varma och man tappar bromseffekten).',
          'Nackdelen: Vintertid när det är halt, då finns risk för sladd då retardern bromsar på bara drivande axeln.'
        ]
      },
      {
        subtitle: 'Vad är det för skillnad på färdbroms och parkeringsbroms?',
        items: [
          'Färdbromsen tillsätts luft för att bromsa och parkeringsbromsen släpper man ut luft för att ansätta den.'
        ]
      },
      {
        subtitle: 'Berätta hur färdbromsen samt parkeringsbromsen fungerar?',
        items: [
          'Så fort du trycker på bromspedalen skickas det luft genom reläventilen in i bromscylindrarna. Då trycker membranet mot tryckstången och en bromshävarm trycker i sin tur på bromsbeläggen som kommer mot bromsskivan och bromsar hjulen.',
          'När du ansätter parkeringsbromsen går luften ut ur cylindern och fjädern expanderar (blir längre). När du släpper parkeringsbromsen kommer luften in och fjädern pressas ihop (blir kortare) och bromsen lossas.'
        ]
      },
      {
        subtitle: 'När är det möjligt att lossa parkeringsbromsen?',
        items: [
          'När trycket i systemet är över 5,5 bar.'
        ]
      },
      {
        subtitle: 'När stängs spärrventilen (blockeringsventil)?',
        items: [
          'När trycket sjunker under 4,5 bar.'
        ]
      },
      {
        subtitle: 'Varför finns det en spärrventil?',
        items: [
          'För att öka säkerheten.'
        ]
      },
      {
        subtitle: 'Vilken uppgift har spärrventilen?',
        items: [
          'Den förhindrar att lastbilen/bussen ofrivilligt kommer i rullning om föraren lossar parkeringsbromsen av misstag och går ut ur fordonet. När lufttrycket går upp och lågtrycksindikatorn stängs av så förhindrar spärrventilen att fordonet börjar rulla.'
        ]
      }
    ]
  },
  {
    id: 'lastsakring',
    title: 'Lastsäkring',
    icon: Box,
    color: 'bg-orange-500',
    content: [
      {
        subtitle: 'Vad har du kontrollerat på lasten?',
        items: [
          'Jag har kontrollerat att lasten är korrekt säkrad.',
          'Fram är lasten förstängd, sidorna är förstängda.',
          'I mitten används överfallssurrning och bak används surrning.',
          'Surrningsbanden är hela och inte trasiga. Blå etikett (märkning) finns och banden är låsta.'
        ]
      },
      {
        subtitle: 'Hur vet du att det är förstängt?',
        items: [
          'De totala öppningarna i längdriktningen är högst 15 cm och de totala öppningarna i sidled är högst 15 cm.'
        ]
      },
      {
        subtitle: 'Varför har vi överfallssurrning i mitten?',
        items: [
          'För att lasten inte är förstängd i sidorna i mitten.',
          'Öppningarna är större än 15 cm.'
        ]
      },
      {
        subtitle: 'Kan vi köra om vi inte har surrning bak?',
        items: [
          'Ja, eftersom vi har halkskydd (gummi) under alla IBC-behållare.',
          'Det finns ingen glidrisk bakåt.'
        ]
      },
      {
        subtitle: 'Hur mycket klarar fästskenan?',
        items: [
          'Det framgår inte av bilden. Det står inget om hur mycket den klarar.',
          'Bilden visar att banden ska vara vinklade.',
          'Vinklade band ger mindre belastning på fästet, men det finns risk att skada väggarna.'
        ]
      },
      {
        subtitle: 'Hur kan du använda fästskenan om du inte vet hur mycket den klarar?',
        items: [
          'Eftersom vi har halkskydd under lasten finns ingen glidrisk bakåt.',
          'Därför belastas inte fästskenan.'
        ]
      },
      {
        subtitle: 'Grundkrav för lastsäkring',
        items: [
          'Den lastsäkring som används ska klara minst:',
          '80 % framåt',
          '50 % bakåt',
          '50 % åt sidorna',
          '60 % åt sidorna om det finns tipprisk',
          'Exempel: 1. Framåt – bromsning, 2. Sidled – sväng, 3. Bakåt – acceleration'
        ]
      },
      {
        subtitle: 'Hur mycket klarar flaköglan?',
        items: [
          '2000 kg.'
        ]
      },
      {
        subtitle: 'Vilka lastsäkringsmetoder finns?',
        items: [
          'Låsning',
          'Förstängning',
          'Surrning',
          'Exempel: Låsning: container, Surrning: överfallssurrning, grimma, loop-/loppsurrning och rak surrning'
        ]
      },
      {
        subtitle: 'Vinklar',
        items: [
          'Grimma: max 45°',
          'Överfallssurrning: 90°–75°',
          '75°–30°: dubbla antalet band',
          'Mindre än 30°: välj annan metod, t.ex. förstängning eller grimma'
        ]
      },
      {
        subtitle: 'Vad betyder:',
        items: [
          '1. LC (Lashing Capacity) – bandkapacitet, t.ex. 1000 kg',
          '2. SHF (Standard Hand Force) – handkraft vid åtdragning, ca 50 kg',
          '3. STF (Standard Tension Force) – förspänning, t.ex. överfallssurrning i mitten som trycker IBC-tanken mot golvet med ca 200 kg',
          '4. Elongation – töjning. Bandet töjs, stanna och efterspänn vid behov.'
        ]
      },
      {
        subtitle: 'Kan du använda bandet om den blå etiketten saknas?',
        items: [
          'Nej. Bandet kasseras och ersätts med ett nytt.'
        ]
      }
    ]
  },
  {
    id: 'passagerare',
    title: 'Passagerare (Buss)',
    icon: Users,
    color: 'bg-yellow-500',
    content: [
      {
        subtitle: 'Säkerhetsinformation',
        items: [
          'Bälteslag: Alla ska använda bälte.',
          'Nödutgångar: Visa var de finns och hur de öppnas.',
          'Säkerhetsutrustning: Brandsläckare, Första hjälpen, Glashammare.',
          'Bagage: Ska vara säkrat/under stolen. Mittgången fri.'
        ]
      },
      {
        subtitle: 'Vid Nödsituation',
        items: [
          'Utrymning: Via dörrar om möjligt, annars nödutgångar/takluckor.',
          'Återsamling: Minst 50 meter bort, på säker plats.',
          'Varning: Gå ej ut på vägsidan om möjligt.'
        ]
      }
    ]
  }
];

export default function FunctionalDescription({ onBack }: { onBack: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const filteredSections = sections.filter(section => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    // Check title
    if (section.title.toLowerCase().includes(query)) return true;

    // Check content
    return section.content.some(block => {
      if (block.subtitle && block.subtitle.toLowerCase().includes(query)) return true;
      return block.items.some(item => item.toLowerCase().includes(query));
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700 dark:text-slate-200" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Funktionsbeskrivning</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-6 rounded-xl bg-blue-50 p-4 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">
              Här hittar du viktig information för utökad säkerhetskontroll (C/CE/D) och funktionsbeskrivningar av fordonets system.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Sök i funktionsbeskrivningen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => {
              const Icon = section.icon;
              // Auto-open if searching and matches content
              const isSearching = searchQuery.length > 0;
              const isOpen = openSection === section.id || isSearching;

              return (
                <motion.div
                  key={section.id}
                  initial={false}
                  animate={{ 
                    backgroundColor: isOpen ? 'var(--bg-card-open)' : 'var(--bg-card)',
                    scale: isOpen ? 1.02 : 1
                  }}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen 
                      ? 'border-blue-100 bg-white shadow-lg ring-1 ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700' 
                      : 'border-transparent bg-white shadow-sm hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${section.color} text-white shadow-md ring-4 ring-white dark:ring-slate-950`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-lg font-bold ${isOpen ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'}`}>
                        {section.title}
                      </span>
                    </div>
                    {isOpen ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                        <ChevronUp size={20} />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/50 px-6 pb-8 pt-4 dark:border-slate-700 dark:bg-slate-900/30">
                          {section.content.map((block, idx) => (
                            <div key={idx} className="mt-8 first:mt-2">
                              {block.subtitle && (
                                <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                  {block.subtitle}
                                </h4>
                              )}
                              <ul className="space-y-3 pl-4">
                                {block.items.map((item, i) => (
                                  <li key={i} className="relative pl-4 text-slate-600 dark:text-slate-300">
                                    <span className="absolute left-0 top-2.5 h-px w-2 bg-slate-300 dark:bg-slate-600"></span>
                                    <span className="text-sm leading-relaxed font-medium">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p>Inga resultat hittades för "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
