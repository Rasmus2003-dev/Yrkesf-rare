import { useState } from 'react';
import { Flag, Gauge, Snowflake, Wallet, Info } from 'lucide-react';

type Country = 'NO' | 'DK' | 'DE';

export default function InternationalGuide() {
  const [country, setCountry] = useState<Country>('NO');

  const countryData = {
    NO: {
      name: 'Norge',
      flag: '🇳🇴',
      speedLimits: {
        truck: '80 km/h',
        truckTrailer: '80 km/h',
        city: '50 km/h',
      },
      tolls: 'AutoPASS-box är obligatorisk för fordon >3.5t. Måste ha avtal.',
      winter: 'Vinterdäckskrav 15 nov - 31 mars. Minst 5mm mönsterdjup. Snökedjor måste medföras (minst 3 st för bil, 7 st för bil+släp).',
      other: 'Stränga kontroller på lastsäkring och däck. Böter är höga.',
    },
    DK: {
      name: 'Danmark',
      flag: '🇩🇰',
      speedLimits: {
        truck: '80 km/h (70 på landsväg)',
        truckTrailer: '80 km/h (70 på landsväg)',
        city: '50 km/h',
      },
      tolls: 'Eurovignette krävs för fordon >12t. Broavgifter (Storebælt, Øresund) tillkommer.',
      winter: 'Inga specifika krav på vinterdäck, men rekommenderas. Dubbdäck tillåtet 1 nov - 15 april.',
      other: 'Miljözoner i större städer (Köpenhamn, Århus, Odense, Ålborg). Kräver Euro 6 eller partikelfilter.',
    },
    DE: {
      name: 'Tyskland',
      flag: '🇩🇪',
      speedLimits: {
        truck: '80 km/h',
        truckTrailer: '80 km/h (60 km/h på landsväg!)',
        city: '50 km/h',
      },
      tolls: 'LKW-Maut (Toll Collect) för fordon >7.5t på motorvägar och förbundsvägar.',
      winter: 'Krav på vinterdäck vid vinterväglag (3PMSF-märkning på drivaxel och styraxel).',
      other: 'Körförbud sön- och helgdagar 00:00-22:00 för lastbilar >7.5t samt lastbilar med släp. Juli-Aug även lördagar 07:00-20:00 på vissa sträckor.',
    },
  };

  const activeData = countryData[country];

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Utlandsguide</h2>
        <p className="text-slate-500 dark:text-slate-400">Regler för våra grannländer</p>
      </header>

      {/* Country Selector */}
      <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {(Object.keys(countryData) as Country[]).map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
              country === c
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-lg">{countryData[c].flag}</span>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Speed Limits */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Gauge className="text-blue-500" size={20} />
            Hastighetsbegränsningar
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
              <div className="text-xs text-slate-500 dark:text-slate-400">Lastbil</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">{activeData.speedLimits.truck}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
              <div className="text-xs text-slate-500 dark:text-slate-400">Med släp</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">{activeData.speedLimits.truckTrailer}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
              <div className="text-xs text-slate-500 dark:text-slate-400">Tätort</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">{activeData.speedLimits.city}</div>
            </div>
          </div>
        </div>

        {/* Tolls */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Wallet className="text-green-500" size={20} />
            Vägavgifter
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{activeData.tolls}</p>
        </div>

        {/* Winter Rules */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Snowflake className="text-cyan-500" size={20} />
            Vinterutrustning
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{activeData.winter}</p>
        </div>

        {/* Other Info */}
        <div className="rounded-xl bg-amber-50 p-5 dark:bg-amber-900/20">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
            <Info size={20} />
            Övrigt att tänka på
          </h3>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80">{activeData.other}</p>
        </div>
      </div>
    </div>
  );
}
