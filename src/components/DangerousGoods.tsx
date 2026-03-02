import { useState } from 'react';
import { Search, AlertTriangle, Info, X, Calculator, ArrowRight } from 'lucide-react';
import { unNumbers } from '../data/un_numbers';
import PointsCalculator from './PointsCalculator';

export default function DangerousGoods() {
  const [mode, setMode] = useState<'search' | 'symbols' | 'calculator' | 'tunnels'>('search');

  return (
    <div className="p-4 pb-24">
      <header className="mb-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Farligt Gods</h2>
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setMode('search')}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'search'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Sök
          </button>
          <button
            onClick={() => setMode('calculator')}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'calculator'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            1000p
          </button>
          <button
            onClick={() => setMode('tunnels')}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'tunnels'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Tunnlar
          </button>
          <button
            onClick={() => setMode('symbols')}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'symbols'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Symboler
          </button>
        </div>
      </header>

      {mode === 'search' && <UNSearch />}
      {mode === 'calculator' && <PointsCalculator />}
      {mode === 'symbols' && <HazardSymbols />}
      {mode === 'tunnels' && <TunnelCodes />}
    </div>
  );
}

function TunnelCodes() {
  const codes = [
    {
      code: 'A',
      desc: 'Inga restriktioner för transport av farligt gods.',
      allowed: 'Allt farligt gods.',
      forbidden: 'Inget.'
    },
    {
      code: 'B',
      desc: 'Restriktioner för farligt gods som kan ge en mycket stor explosion.',
      allowed: 'Allt utom det som är förbjudet.',
      forbidden: 'Explosiva ämnen (Klass 1) med stor risk.'
    },
    {
      code: 'C',
      desc: 'Restriktioner för mycket stor explosion, stort utsläpp av giftig gas eller brandfarlig vätska.',
      allowed: 'Mindre farligt gods.',
      forbidden: 'Explosiva ämnen, giftiga gaser, mycket brandfarliga vätskor.'
    },
    {
      code: 'D',
      desc: 'Restriktioner för stor explosion, utsläpp av giftig gas eller stor brand.',
      allowed: 'Begränsad mängd farligt gods.',
      forbidden: 'De flesta farliga ämnen i bulk eller tank.'
    },
    {
      code: 'E',
      desc: 'Mest restriktiv. Förbjudet för allt farligt gods (utom vissa undantag).',
      allowed: 'Vissa undantag (t.ex. begränsad mängd).',
      forbidden: 'Allt farligt gods som kräver orange skylt.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Info size={18} />
          Hur läser man tunnelkoder?
        </div>
        <p>
          Tunnelkoden (t.ex. C/D) anger restriktioner. 
          <br />
          <strong>Första bokstaven (C):</strong> Gäller för tanktransport.
          <br />
          <strong>Andra bokstaven (D):</strong> Gäller för kollitransport.
          <br />
          Om bara en bokstav visas (t.ex. E) gäller den för alla transporter.
        </p>
      </div>

      <div className="space-y-3">
        {codes.map((c) => (
          <div key={c.code} className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900">
                {c.code}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Kategori {c.code}</h3>
            </div>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{c.desc}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-green-600 dark:text-green-400">Tillåtet:</span>
                <span className="text-slate-600 dark:text-slate-400">{c.allowed}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-red-600 dark:text-red-400">Förbjudet:</span>
                <span className="text-slate-600 dark:text-slate-400">{c.forbidden}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UNSearch() {
  const [query, setQuery] = useState('');

  const filtered = unNumbers.filter(
    (item) =>
      item.id.includes(query) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.class.includes(query) ||
      item.transportCategory.toString().includes(query) ||
      (item.tunnelCode && item.tunnelCode.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Sök UN, namn, klass, tunnelkod..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all dark:bg-slate-800"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 font-mono text-lg font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                {item.id}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium dark:bg-slate-700">
                    Klass {item.class}
                  </span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Kat {item.transportCategory}
                  </span>
                  {item.tunnelCode && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium dark:bg-slate-700">
                      Tunnel {item.tunnelCode}
                    </span>
                  )}
                  <span>{item.description}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">
            Inga träffar hittades.
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
        <p>
          Saknar du något nummer? Besök den fullständiga databasen på{' '}
          <a
            href="https://adrdangerousgoods.com/swe/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            adrdangerousgoods.com
          </a>
        </p>
      </div>
    </div>
  );
}

function HazardSymbols() {
  const [filter, setFilter] = useState('');

  const symbols = [
    {
      class: '1',
      label: 'Explosiva ämnen',
      bgClass: 'bg-orange-500',
      textClass: 'text-black',
      icon: '💣',
      description: 'Ämnen och föremål som kan explodera. Ex: Fyrverkerier, ammunition.',
    },
    {
      class: '2.1',
      label: 'Brandfarlig gas',
      bgClass: 'bg-red-600',
      textClass: 'text-white',
      icon: '🔥',
      description: 'Gaser som antänds vid kontakt med en tändkälla. Ex: Gasol, acetylen.',
    },
    {
      class: '2.2',
      label: 'Icke brandfarlig gas',
      bgClass: 'bg-emerald-600',
      textClass: 'text-white',
      icon: '💨',
      description: 'Gaser som inte är brandfarliga eller giftiga. Ex: Kväve, syre (under tryck).',
    },
    {
      class: '2.3',
      label: 'Giftig gas',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '☠️',
      description: 'Gaser som är giftiga eller frätande. Ex: Klor, ammoniak.',
    },
    {
      class: '3',
      label: 'Brandfarliga vätskor',
      bgClass: 'bg-red-600',
      textClass: 'text-white',
      icon: '🔥',
      description: 'Vätskor som har en flampunkt på högst 60°C. Ex: Bensin, diesel, etanol.',
    },
    {
      class: '4.1',
      label: 'Brandfarliga fasta ämnen',
      bgClass: '',
      textClass: 'text-black',
      icon: '🔥',
      description: 'Fasta ämnen som är lättantändliga. Ex: Tändstickor, svavel.',
      customStyle: { background: 'repeating-linear-gradient(-45deg, red, red 10px, white 10px, white 20px)' }
    },
    {
      class: '4.2',
      label: 'Självantändande',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '🔥',
      description: 'Ämnen som kan självantända vid kontakt med luft. Ex: Vitt fosfor.',
      customStyle: { background: 'linear-gradient(to bottom right, white 50%, red 50%)' } // Top half white, bottom half red
    },
    {
      class: '4.3',
      label: 'Utv. gas vid vattenkontakt',
      bgClass: 'bg-blue-600',
      textClass: 'text-white',
      icon: '💧',
      description: 'Utvecklar brandfarlig gas vid kontakt med vatten. Ex: Natrium, karbid.',
    },
    {
      class: '5.1',
      label: 'Oxiderande ämnen',
      bgClass: 'bg-yellow-400',
      textClass: 'text-black',
      icon: '⭕',
      description: 'Ämnen som kan orsaka eller bidra till brand. Ex: Väteperoxid.',
    },
    {
      class: '5.2',
      label: 'Organiska peroxider',
      bgClass: 'bg-yellow-400',
      textClass: 'text-black',
      icon: '⭕',
      description: 'Termiskt instabila ämnen. Ex: Härdare.',
      customStyle: { background: 'linear-gradient(to bottom right, red 50%, yellow 50%)' }
    },
    {
      class: '6.1',
      label: 'Giftiga ämnen',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '☠️',
      description: 'Ämnen som kan orsaka död eller allvarlig skada. Ex: Cyanid.',
    },
    {
      class: '6.2',
      label: 'Smittförande ämnen',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '☣️',
      description: 'Innehåller patogener som kan orsaka sjukdom. Ex: Blodprover, virus.',
    },
    {
      class: '7',
      label: 'Radioaktiva ämnen',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '☢️',
      description: 'Ämnen som utsänder joniserande strålning. Ex: Uran.',
      customStyle: { background: 'linear-gradient(to bottom right, yellow 50%, white 50%)' }
    },
    {
      class: '8',
      label: 'Frätande ämnen',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '🧪',
      description: 'Ämnen som orsakar skador på levande vävnad. Ex: Syror, lut.',
      customStyle: { background: 'linear-gradient(to bottom right, white 50%, black 50%)' }
    },
    {
      class: '9',
      label: 'Övriga farliga ämnen',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '⚠️',
      description: 'Ämnen som utgör en fara men inte passar i andra klasser. Ex: Litiumbatterier, asbest.',
      customStyle: { 
        background: 'linear-gradient(135deg, transparent 50%, white 50%), repeating-linear-gradient(-45deg, black, black 5px, white 5px, white 10px)'
      }
    },
    {
      class: 'MP',
      label: 'Miljöfarligt',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '🐟',
      description: 'Ämnen som är skadliga för vattenmiljön.',
    },
    {
      class: 'LQ',
      label: 'Begränsad Mängd (LQ)',
      bgClass: 'bg-white',
      textClass: 'text-black',
      icon: '',
      description: 'Förpackningar med mindre mängder farligt gods.',
      customStyle: {
        background: 'linear-gradient(135deg, black 25%, transparent 25%), linear-gradient(315deg, black 25%, transparent 25%)',
        backgroundColor: 'white'
      }
    }
  ];

  const filteredSymbols = symbols.filter(s => 
    s.class.toLowerCase().includes(filter.toLowerCase()) || 
    s.label.toLowerCase().includes(filter.toLowerCase()) ||
    s.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Sök symbol eller klass..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSymbols.map((sym) => (
          <div
            key={sym.class}
            className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
          >
            {/* Diamond Shape Wrapper */}
            <div className="mb-4 p-2">
              <div
                className={`relative flex h-24 w-24 rotate-45 flex-col items-center justify-center border-2 border-slate-900 shadow-sm overflow-hidden ${sym.bgClass}`}
                style={sym.customStyle}
              >
                {/* Counter-rotate content so it appears straight */}
                <div className={`-rotate-45 transform text-3xl font-bold ${sym.class === '8' ? 'text-white mix-blend-difference' : ''}`}>
                  {sym.icon}
                </div>
                
                {sym.class !== 'LQ' && (
                  <div className="absolute bottom-1 right-1 -rotate-45 text-xs font-bold">
                    {sym.class.split('.')[0]}
                  </div>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {sym.class !== 'LQ' && sym.class !== 'MP' ? `Klass ${sym.class}` : sym.label}
            </h3>
            {sym.class !== 'LQ' && sym.class !== 'MP' && (
              <p className="font-medium text-slate-700 dark:text-slate-300">{sym.label}</p>
            )}
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{sym.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
