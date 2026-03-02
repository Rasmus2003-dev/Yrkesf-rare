import { useState } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2, Coffee, Moon } from 'lucide-react';

export default function DrivingRestTimes() {
  const [activeSection, setActiveSection] = useState<'daily' | 'weekly' | 'breaks'>('daily');

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kör- & Vilotider</h2>
        <p className="text-slate-500 dark:text-slate-400">Snabbguide för EU-regler (561/2006)</p>
      </header>

      {/* Navigation Pills */}
      <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          onClick={() => setActiveSection('daily')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeSection === 'daily'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Dygn
        </button>
        <button
          onClick={() => setActiveSection('breaks')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeSection === 'breaks'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Rast
        </button>
        <button
          onClick={() => setActiveSection('weekly')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeSection === 'weekly'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Vecka
        </button>
      </div>

      <div className="space-y-4">
        {activeSection === 'daily' && <DailyView />}
        {activeSection === 'breaks' && <BreaksView />}
        {activeSection === 'weekly' && <WeeklyView />}
      </div>

      <div className="mt-8 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Dessa regler är generella. Undantag kan finnas (t.ex. vid färjetransport eller dubbelbemanning). 
            Kontrollera alltid din färdskrivare.
          </p>
        </div>
      </div>
    </div>
  );
}

function DailyView() {
  return (
    <div className="space-y-4">
      {/* Driving Time */}
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Daglig Körtid</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <span className="text-sm font-medium">Normal körtid</span>
            <span className="font-bold text-slate-900 dark:text-white">9 timmar</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <span className="text-sm font-medium">Utökad körtid</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">10 timmar</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            * Utökad körtid (10h) får användas max 2 gånger per vecka.
          </p>
        </div>
      </div>

      {/* Daily Rest */}
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Moon size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Dygnsvila</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <span className="text-sm font-medium">Normal vila</span>
            <span className="font-bold text-slate-900 dark:text-white">11 timmar</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
            <span className="text-sm font-medium">Reducerad vila</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">9 timmar</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <span className="text-sm font-medium">Delad vila</span>
            <span className="font-bold text-slate-900 dark:text-white">3h + 9h</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            * Reducerad vila (9h) får användas max 3 gånger mellan två veckovilor.
            * Måste tas ut inom 24h från arbetspassets start.
          </p>
        </div>
      </div>
    </div>
  );
}

function BreaksView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Coffee size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Rast (45 min)</h3>
        </div>
        
        <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300">
          <p>
            Efter <strong>4,5 timmars</strong> körtid måste du ta en rast på minst <strong>45 minuter</strong>.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Alternativ 1: Hel rast</h4>
            <div className="flex items-center gap-2">
              <div className="h-8 flex-1 rounded bg-blue-500 text-center text-xs font-medium leading-8 text-white">4.5h Kör</div>
              <div className="h-8 w-20 rounded bg-orange-500 text-center text-xs font-medium leading-8 text-white">45m</div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Alternativ 2: Delad rast</h4>
            <p className="mb-2 text-xs text-slate-500">Först minst 15 min, sedan minst 30 min.</p>
            <div className="flex items-center gap-1">
              <div className="h-8 flex-1 rounded bg-blue-500 text-center text-[10px] font-medium leading-8 text-white">Kör</div>
              <div className="h-8 w-12 rounded bg-orange-500 text-center text-[10px] font-medium leading-8 text-white">15m</div>
              <div className="h-8 flex-1 rounded bg-blue-500 text-center text-[10px] font-medium leading-8 text-white">Kör</div>
              <div className="h-8 w-16 rounded bg-orange-500 text-center text-[10px] font-medium leading-8 text-white">30m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Calendar size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Veckovila & Körtid</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Veckovila</h4>
            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                <span className="text-sm font-medium">Normal veckovila</span>
                <span className="font-bold text-slate-900 dark:text-white">45 timmar</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <span className="text-sm font-medium">Reducerad veckovila</span>
                <span className="font-bold text-green-700 dark:text-green-300">24 timmar</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              * Reducerad vila måste kompenseras genom motsvarande vila tagen i ett sammanhang innan slutet av den tredje veckan efter den aktuella veckan.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
            <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Körtid per vecka</h4>
            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                <span className="text-sm font-medium">Max en vecka</span>
                <span className="font-bold text-slate-900 dark:text-white">56 timmar</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                <span className="text-sm font-medium">Max två veckor</span>
                <span className="font-bold text-slate-900 dark:text-white">90 timmar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
