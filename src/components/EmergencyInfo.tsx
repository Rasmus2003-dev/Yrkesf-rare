import { useState, useEffect, ChangeEvent } from 'react';
import { Phone, AlertTriangle, ShieldAlert, HeartPulse, Truck } from 'lucide-react';

export default function EmergencyInfo() {
  const [assistanceNumber, setAssistanceNumber] = useState('');

  useEffect(() => {
    const savedNumber = localStorage.getItem('assistance_number');
    if (savedNumber) {
      setAssistanceNumber(savedNumber);
    }
  }, []);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setAssistanceNumber(num);
    localStorage.setItem('assistance_number', num);
  };

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nödläge & Hjälp</h2>
        <p className="text-slate-500 dark:text-slate-400">Viktiga nummer och åtgärder</p>
      </header>

      <div className="space-y-6">
        {/* SOS Alarm */}
        <div className="overflow-hidden rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
          <div className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nödsamtal</h3>
                <p className="text-red-100">Vid fara för liv, egendom eller miljö</p>
              </div>
            </div>
            <a 
              href="tel:112"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-2xl font-bold text-red-600 transition-transform active:scale-95"
            >
              RING 112
            </a>
          </div>
        </div>

        {/* Action Plan */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="text-orange-500" />
            Vid trafikolycka
          </h3>
          <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white dark:bg-blue-900 dark:ring-slate-800">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
              </span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Överblicka</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stanna fordonet säkert. Sätt på varningsblinkers. Ta på varselväst.</p>
            </li>
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white dark:bg-blue-900 dark:ring-slate-800">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
              </span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Varna</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sätt ut varningstriangel (minst 100m bakom). Varna andra trafikanter.</p>
            </li>
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white dark:bg-blue-900 dark:ring-slate-800">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
              </span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Larma</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ring 112. Uppge: Var, Vad, Vem och Skador. Lägg inte på förrän operatören säger till.</p>
            </li>
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white dark:bg-blue-900 dark:ring-slate-800">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
              </span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Rädda</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hjälp skadade. Flytta dem endast vid livsfara (brand/explosion). Gör HLR vid behov.</p>
            </li>
          </ol>
        </div>

        {/* Important Numbers */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-900/20">
            <div className="mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Truck size={20} />
              <h4 className="font-bold">Vägassistans</h4>
            </div>
            <p className="mb-4 text-xs text-blue-600/80 dark:text-blue-300/80">
              Vid motorstopp eller tekniska problem.
            </p>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Skriv in ditt bolags nr..." 
                value={assistanceNumber}
                onChange={handleNumberChange}
                className="w-full rounded-lg border-0 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
              />
              {assistanceNumber && (
                <a 
                  href={`tel:${assistanceNumber}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Phone size={14} /> Ring upp
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-900/20">
            <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <HeartPulse size={20} />
              <h4 className="font-bold">Sjukvårdsrådgivning</h4>
            </div>
            <p className="mb-4 text-xs text-emerald-600/80 dark:text-emerald-300/80">
              Vid icke-akuta sjukdomsfall.
            </p>
            <a 
              href="tel:1177"
              className="flex w-full items-center justify-center rounded-lg bg-white py-2 text-sm font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700"
            >
              Ring 1177
            </a>
          </div>
        </div>

        {/* Location Info */}
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg dark:bg-slate-800">
          <h3 className="mb-2 flex items-center gap-2 font-bold">
            <AlertTriangle className="text-yellow-400" size={20} />
            Din Position
          </h3>
          <p className="text-sm text-slate-300">
            Vid samtal till 112, försök uppge vägnummer och närmaste avfart/stolpnummer.
          </p>
          <div className="mt-4 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-center text-xs text-slate-400">Koordinater (exempel)</p>
            <p className="text-center font-mono text-lg font-bold tracking-wider">
              --° --' --" N
              <br />
              --° --' --" E
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
