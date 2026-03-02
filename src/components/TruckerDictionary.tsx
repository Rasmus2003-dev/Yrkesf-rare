import { useState } from 'react';
import { Search, BookA } from 'lucide-react';

interface Term {
  term: string;
  definition: string;
  category: 'general' | 'technical' | 'logistics';
}

export default function TruckerDictionary() {
  const [search, setSearch] = useState('');

  const terms: Term[] = [
    { term: 'AdBlue', definition: 'Vätska som minskar utsläpp av kväveoxider i dieselmotorer.', category: 'technical' },
    { term: 'Axeltryck', definition: 'Den vikt som en axel överför till vägbanan.', category: 'technical' },
    { term: 'Boggi', definition: 'Två eller flera axlar som sitter tätt ihop på ett fordon.', category: 'technical' },
    { term: 'Cabotage', definition: 'Inrikes transport i ett land utförd av en transportör från ett annat land.', category: 'logistics' },
    { term: 'CMR-fraktsedel', definition: 'Internationell fraktsedel som reglerar ansvaret vid gränsöverskridande transporter.', category: 'logistics' },
    { term: 'Coil-trailer', definition: 'Trailer med ett "dike" i mitten för att säkert transportera stålrullar.', category: 'technical' },
    { term: 'Diffspärr', definition: 'Låser differentialen så att båda hjulen på en axel snurrar lika fort. Används vid halt väglag.', category: 'technical' },
    { term: 'Dolly', definition: 'En liten vagn med vändskiva som kopplas bakom en bil för att dra en trailer.', category: 'technical' },
    { term: 'Dragbil', definition: 'Lastbil avsedd för att dra en semitrailer.', category: 'general' },
    { term: 'Ekerhjul', definition: 'Hjulkonstruktion vanlig på äldre lastbilar eller i USA, där fälgen monteras på ekrar.', category: 'technical' },
    { term: 'Euro 6', definition: 'Utsläppsklass för tunga fordon införd 2013. Krav för miljözoner i många städer.', category: 'technical' },
    { term: 'Färdskrivare', definition: 'Apparat som registrerar körtid, vila och hastighet.', category: 'general' },
    { term: 'Gods', definition: 'Varor som transporteras.', category: 'general' },
    { term: 'Intermodal transport', definition: 'Transport där godset byter färdmedel (t.ex. tåg till lastbil) men stannar i samma lastbärare.', category: 'logistics' },
    { term: 'Jumbo-trailer', definition: 'Trailer med lågt golv och mindre hjul för att maximera lastvolymen.', category: 'technical' },
    { term: 'Kapell', definition: 'Presenning som täcker flaket.', category: 'general' },
    { term: 'Kolli', definition: 'En enskild försändelseenhet (t.ex. en kartong eller en pall).', category: 'logistics' },
    { term: 'Link', definition: 'En trailer som har en vändskiva baktill, vilket gör att man kan koppla en trailer till på den.', category: 'technical' },
    { term: 'Lågväxel', definition: 'Utväxling som ger extra kraft men lägre hastighet.', category: 'technical' },
    { term: 'Maut', definition: 'Vägavgift i Tyskland.', category: 'general' },
    { term: 'Retarder', definition: 'Hydraulisk tillsatsbroms som sparar på färdbromsarna.', category: 'technical' },
    { term: 'Rop', definition: 'Förkortning för "Roll Over Protection", system som motverkar vältning.', category: 'technical' },
    { term: 'Semitrailer', definition: 'Släpvagn utan framaxel som vilar på dragbilens vändskiva.', category: 'general' },
    { term: 'Skåp', definition: 'Lastbil med fasta väggar och tak.', category: 'general' },
    { term: 'Släp', definition: 'Vagn som dras av lastbil.', category: 'general' },
    { term: 'Styckegods', definition: 'Gods som hanteras styckvis, ofta på pall, till skillnad från bulk.', category: 'logistics' },
    { term: 'Svanhals', definition: 'Den främre, upphöjda delen av en maskintrailer eller semitrailer.', category: 'technical' },
    { term: 'TEU', definition: 'Twenty-foot Equivalent Unit. Mått för containerkapacitet (motsvarar en 20-fots container).', category: 'logistics' },
    { term: 'Trailer', definition: 'Vardagligt ord för semitrailer.', category: 'general' },
    { term: 'Vändskiva', definition: 'Kopplingsanordningen på en dragbil där trailern fästs.', category: 'technical' },
    { term: 'Åkeri', definition: 'Företag som utför transporter.', category: 'general' },
  ];

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ordlista</h2>
        <p className="text-slate-500 dark:text-slate-400">Facktermer och slang</p>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Sök ord..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filteredTerms.map((item, idx) => (
          <div key={idx} className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">{item.term}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                item.category === 'technical' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                item.category === 'logistics' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {item.category === 'technical' ? 'Teknik' : item.category === 'logistics' ? 'Logistik' : 'Allmänt'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.definition}</p>
          </div>
        ))}
        
        {filteredTerms.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            Inga ord hittades.
          </div>
        )}
      </div>
    </div>
  );
}
