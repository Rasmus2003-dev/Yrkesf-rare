import { useState, useEffect } from 'react';
import { Calculator, BookOpen, AlertTriangle, ArrowRight, Table, Info, CheckCircle2, XCircle, Share2, Save, Trash2, History, ChevronDown, ChevronUp } from 'lucide-react';

interface SavedCalculation {
  id: string;
  date: string;
  weight: number;
  friction: number;
  method: string;
  direction: string;
  numStraps: number;
}

export default function CargoSecuring() {
  const [mode, setMode] = useState<'calculator' | 'guide' | 'cheatsheet'>('cheatsheet');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() => {
    const saved = localStorage.getItem('cargo_calculations');
    return saved ? JSON.parse(saved) : [];
  });

  const saveCalculation = (calc: Omit<SavedCalculation, 'id' | 'date'>) => {
    const newCalc: SavedCalculation = {
      ...calc,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('sv-SE'),
    };
    const updated = [newCalc, ...savedCalculations].slice(0, 10); // Keep last 10
    setSavedCalculations(updated);
    localStorage.setItem('cargo_calculations', JSON.stringify(updated));
  };

  const deleteCalculation = (id: string) => {
    const updated = savedCalculations.filter(c => c.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('cargo_calculations', JSON.stringify(updated));
  };

  return (
    <div className="p-4 pb-24 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Calculator size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Lastsäkring</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Beräkna och dokumentera din lastsäkring</p>
          </div>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
          <button
            onClick={() => setMode('cheatsheet')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              mode === 'cheatsheet'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Lathund
          </button>
          <button
            onClick={() => setMode('calculator')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              mode === 'calculator'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Kalkylator
          </button>
          <button
            onClick={() => setMode('guide')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              mode === 'guide'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Metoder
          </button>
        </div>
      </header>

      {mode === 'cheatsheet' && <CheatSheetView />}
      {mode === 'calculator' && (
        <CalculatorView 
          onSave={saveCalculation} 
          savedCalculations={savedCalculations}
          onDeleteSaved={deleteCalculation}
        />
      )}
      {mode === 'guide' && <GuideView />}
    </div>
  );
}

function CheatSheetView() {
  return (
    <div className="space-y-6">
      {/* Quick Reference Card */}
      <div className="rounded-xl bg-blue-600 p-6 text-white shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Snabbreferens (Överfall)</h3>
        <p className="mb-4 text-sm text-blue-100">
          Antal spännband (STF 350 daN) för att säkra 1 ton (1000 kg) mot glidning framåt (0.8g).
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <div className="text-xs text-blue-200">Trä/Trä</div>
            <div className="text-lg font-bold">µ 0.3</div>
            <div className="mt-1 text-2xl font-extrabold">4 st</div>
          </div>
          <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <div className="text-xs text-blue-200">Plywood</div>
            <div className="text-lg font-bold">µ 0.4</div>
            <div className="mt-1 text-2xl font-extrabold">3 st</div>
          </div>
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm ring-1 ring-white/30">
            <div className="text-xs text-blue-100">Gummimatta</div>
            <div className="text-lg font-bold">µ 0.6</div>
            <div className="mt-1 text-2xl font-extrabold">1 st</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-blue-200 italic">* Vid 90° vinkel. Vid lägre vinkel krävs fler band.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Friction Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
          <div className="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Table size={18} className="text-slate-500" />
              Friktionsvärden (µ)
            </h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Materialkombination</th>
                  <th className="px-4 py-2 font-medium text-right">Värde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Sågat trä mot trä/plywood</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Hyvlat trä mot hyvlat trä</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Stål/Plåt mot trä</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Stål/Plåt mot stål (omålat)</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Stål/Plåt mot stål (målat)</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Betong mot trä</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">0.4</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/10">
                  <td className="px-4 py-3 font-medium text-green-800 dark:text-green-300">Friktionsmatta (gummi)</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-green-700 dark:text-green-400">0.6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* Angles Guide */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Vinkelns betydelse</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold">
                  90°
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Optimal effekt (100%)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bandet pressar rakt ner.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-bold">
                  60°
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">God effekt (~87%)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Acceptabel förlust.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold">
                  30°
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Dålig effekt (50%)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Du behöver dubbelt så många band.</p>
                </div>
              </div>
            </div>
          </div>

          {/* LC vs STF */}
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <h4 className="mb-3 font-bold text-slate-900 dark:text-white">Begrepp</h4>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Överfallssurrning</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Använd STF (Standard Tension Force)</p>
                <p className="text-xs text-slate-500">Kraften bandet pressar ner med.</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Direktsurrning</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Använd LC (Lashing Capacity)</p>
                <p className="text-xs text-slate-500">Maxbelastningen innan bandet går av.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <CheckCircle2 className="text-green-500" size={20} />
          Checklista före avfärd
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Är lasten förstängd mot framstammen? (Minskar behovet av surrningar drastiskt)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Är spännbanden hela och godkända? (Kolla etiketten, blå = polyester)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Är vinkeln på överfallen så nära 90° som möjligt?</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Har du använt kantskydd för att skydda både last och band?</span>
          </li>
        </ul>
      </div>

      {/* Common Mistakes */}
      <div className="rounded-xl bg-red-50 p-6 dark:bg-red-900/10">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-800 dark:text-red-300">
          <XCircle className="text-red-500" size={20} />
          Vanliga misstag
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-red-700 dark:text-red-300/80">
          <li>Att tro att tyngden håller lasten på plats (friktionen räcker sällan vid inbromsning).</li>
          <li>Att använda för få band vid låg friktion (t.ex. metall mot metall).</li>
          <li>Att inte efterspänna banden efter en stunds körning.</li>
          <li>Att blanda kätting och spännband på samma lastbärare (de har olika elasticitet).</li>
        </ul>
      </div>
    </div>
  );
}

function LashingVisualizer({ method }: { method: string }) {
  return (
    <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <svg viewBox="0 0 300 150" className="h-full w-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Floor */}
        <line x1="20" y1="130" x2="280" y2="130" stroke="currentColor" strokeWidth="4" className="text-slate-300 dark:text-slate-600" />
        
        {/* Cargo */}
        <rect x="110" y="50" width="80" height="80" rx="4" fill="currentColor" className="text-blue-100 dark:text-blue-900/50" stroke="currentColor" strokeWidth="2" />
        <text x="150" y="95" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400 font-bold">GODS</text>

        {method === 'top-over' && (
          <>
            {/* Strap */}
            <path d="M 70 130 L 110 50 L 190 50 L 230 130" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
            {/* Force Arrows (Down) */}
            <line x1="110" y1="40" x2="110" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="190" y1="40" x2="190" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="150" y="30" textAnchor="middle" className="text-xs fill-red-500 font-bold">Nedpressning</text>
          </>
        )}

        {method === 'loop' && (
          <>
            {/* Strap Loop (Grimma) - Side View */}
            <path d="M 60 130 L 110 60 L 110 100" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
            <path d="M 110 60 L 190 60 L 240 130" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
            {/* Force Arrow (Back) */}
            <line x1="200" y1="90" x2="180" y2="90" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="220" y="85" textAnchor="middle" className="text-xs fill-red-500 font-bold">Stoppar</text>
          </>
        )}

        {method === 'spring' && (
          <>
            {/* Spring Lashing */}
            <path d="M 50 130 L 110 50" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
            <path d="M 110 50 L 190 50" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="4 4" />
             {/* Force Arrow */}
             <line x1="150" y1="90" x2="120" y2="90" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
             <text x="150" y="110" textAnchor="middle" className="text-xs fill-red-500 font-bold">Förhindrar glidning</text>
          </>
        )}

        {method === 'blocking' && (
          <>
            {/* Front Wall */}
            <rect x="80" y="30" width="30" height="100" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
            <text x="95" y="25" textAnchor="middle" className="text-xs fill-slate-500 font-bold">Framstam</text>
            {/* Force Arrow */}
            <line x1="130" y1="90" x2="115" y2="90" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </>
        )}
      </svg>
    </div>
  );
}

function GuideView() {
  const guides = [
    {
      id: 'top-over',
      title: 'Överfallssurrning',
      description: 'Den vanligaste metoden där spännbandet pressar godset mot flaket för att öka friktionen.',
      icon: <ArrowRight className="rotate-90" />,
      steps: [
        'Placera bandet över godset.',
        'Fäst krokarna i lastöglorna på båda sidor.',
        'Spänn bandet med spännaren (ratchet) tills du når rätt STF (vanligtvis 350-500 daN).',
        'Se till att vinkeln mot flaket är så stor som möjligt (helst 90°).'
      ],
      tips: ['Använd friktionsmatta under godset för att minska antalet band drastiskt.', 'Skydda bandet mot skarpa kanter med kantskydd.']
    },
    {
      id: 'loop',
      title: 'Grimma (Loop)',
      description: 'En metod som "fångar" godset och förhindrar det från att glida framåt eller bakåt.',
      icon: <ArrowRight />,
      steps: [
        'Fäst bandet i en lastögla.',
        'Dra bandet runt godsets fram- eller baksida.',
        'Fäst den andra änden i en lastögla på motsatt sida (symmetriskt).',
        'Spänn bandet så det sitter åt, men inte så hårt att godset skadas.'
      ],
      tips: ['Effektivt för gods som inte kan förstängas mot framstammen.', 'Kan göras med ett eller två band.']
    },
    {
      id: 'spring',
      title: 'Springsurrning',
      description: 'Används för att förhindra att godset tippar eller glider. Bandet går från en ögla framför godset, över godset, till en ögla bakom (eller tvärtom).',
      icon: <ArrowRight className="-rotate-45" />,
      steps: [
        'Fäst bandet i en ögla framför godset.',
        'Dra bandet diagonalt över godsets övre hörn.',
        'Fäst i en ögla bakom godset.',
        'Upprepa på andra sidan för symmetri.'
      ],
      tips: ['Bra för högt gods som riskerar att tippa.', 'Används ofta i kombination med överfall.']
    },
    {
      id: 'blocking',
      title: 'Förstängning',
      description: 'Den säkraste metoden. Godset placeras direkt mot framstam, sidolämmar eller annat gods.',
      icon: <BookOpen />,
      steps: [
        'Placera godset tätt mot framstammen.',
        'Om det finns utrymme på sidorna, fyll ut med tompallar eller annat fyllnadsmaterial.',
        'Om godset inte når framstammen, bygg en "brygga" med pallar.'
      ],
      tips: ['Inga mellanrum får finnas (> 15 cm räknas som mellanrum).', 'Kombinera med överfall om förstängningen är lägre än godsets tyngdpunkt.']
    }
  ];

  return (
    <div className="space-y-8">
      {guides.map((guide, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all dark:bg-slate-800 dark:ring-slate-700">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                {guide.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{guide.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Metod {idx + 1}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <LashingVisualizer method={guide.id} />
            
            <p className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.description}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold dark:bg-slate-700 dark:text-slate-300">1</div>
                  Instruktioner
                </h4>
                <ul className="space-y-3">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-yellow-50 p-5 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-yellow-800 dark:text-yellow-500">
                  <AlertTriangle size={16} />
                  Viktigt att tänka på
                </h4>
                <ul className="space-y-2">
                  {guide.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-yellow-900/80 dark:text-yellow-200/80">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalculatorView({ 
  onSave, 
  savedCalculations, 
  onDeleteSaved 
}: { 
  onSave: (calc: any) => void, 
  savedCalculations: SavedCalculation[],
  onDeleteSaved: (id: string) => void
}) {
  const [weight, setWeight] = useState<number>(1000); // kg
  const [friction, setFriction] = useState<number>(0.3);
  const [angle, setAngle] = useState<number>(90);
  const [stf, setStf] = useState<number>(350); // daN
  const [lc, setLc] = useState<number>(2000); // daN (Lashing Capacity)
  const [method, setMethod] = useState<'top-over' | 'loop' | 'spring'>('top-over');
  const [direction, setDirection] = useState<'forward' | 'sideways' | 'backward'>('forward');
  const [blocked, setBlocked] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState(false);

  // Constants (g-forces)
  const G_FORWARD = 0.8;
  const G_SIDEWAYS = 0.5;
  const G_BACKWARD = 0.5;

  const calculateLashings = () => {
    if (weight <= 0) return 0;
    let gForce = G_FORWARD;
    if (direction === 'sideways') gForce = G_SIDEWAYS;
    if (direction === 'backward') gForce = G_BACKWARD;
    if (blocked) return 0;
    const rad = (angle * Math.PI) / 180;
    const sinAlpha = Math.sin(rad);

    if (method === 'top-over') {
      if (stf <= 0) return 0;
      if (friction >= gForce) return 0;
      const numerator = weight * (gForce - friction);
      const denominator = 2 * (stf / 1) * friction * sinAlpha;
      if (denominator <= 0) return 999;
      return Math.ceil(numerator / denominator);
    } 
    else {
      const requiredForceKg = weight * (gForce - friction);
      if (requiredForceKg <= 0) return 0;
      if (lc <= 0) return 0;
      const capacityPerStrap = 2 * lc;
      return Math.ceil(requiredForceKg / capacityPerStrap);
    }
  };

  const numStraps = calculateLashings();

  const handleShare = async () => {
    const text = `Lastsäkringsberäkning:\nMetod: ${method}\nVikt: ${weight}kg\nFriktion: ${friction}\nRiktning: ${direction}\nResultat: ${numStraps} st band.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lastsäkring', text });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Beräkning kopierad till urklipp!');
    }
  };

  const handleSave = () => {
    onSave({ weight, friction, method, direction, numStraps });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Settings Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/20 dark:text-blue-400">
                  <Calculator size={20} />
                </div>
                Parametrar
              </h3>
              <button 
                onClick={() => {
                  setWeight(1000);
                  setFriction(0.3);
                  setAngle(90);
                  setStf(350);
                  setLc(2000);
                  setMethod('top-over');
                  setDirection('forward');
                  setBlocked(false);
                }}
                className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Återställ
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Section 1: Last & Underlag */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-px w-4 bg-slate-200 dark:bg-slate-700"></span>
                  Last & Underlag
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Godsvikt (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-900 font-bold focus:border-blue-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Friktion (µ)
                    </label>
                    <select
                      value={friction}
                      onChange={(e) => setFriction(Number(e.target.value))}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-900 font-bold focus:border-blue-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white appearance-none"
                    >
                      <option value={0.2}>0.2 - Metall/Trä (glatt)</option>
                      <option value={0.3}>0.3 - Trä/Trä (standard)</option>
                      <option value={0.4}>0.4 - Trä/Aluminium</option>
                      <option value={0.6}>0.6 - Friktionsmatta</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer" onClick={() => setBlocked(!blocked)}>
                  <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${blocked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                    {blocked && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Godset är förstängt</p>
                    <p className="text-xs text-slate-500">Minskar behovet av surrning i glidriktningen.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Säkringsmetod */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-px w-4 bg-slate-200 dark:bg-slate-700"></span>
                  Säkringsmetod
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
                </label>

                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900">
                  {['top-over', 'loop', 'spring'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m as any)}
                      className={`rounded-xl py-3 text-xs font-bold transition-all ${
                        method === m ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {m === 'top-over' ? 'Överfall' : m === 'loop' ? 'Grimma' : 'Spring'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Glidriktning
                    </label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-900 font-bold focus:border-blue-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="forward">Framåt (0.8g)</option>
                      <option value="sideways">Sidled (0.5g)</option>
                      <option value="backward">Bakåt (0.5g)</option>
                    </select>
                  </div>

                  {method === 'top-over' ? (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Vinkel (°)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={angle}
                          onChange={(e) => setAngle(Number(e.target.value))}
                          min={30}
                          max={90}
                          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-900 font-bold focus:border-blue-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">°</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        LC (daN)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={lc}
                          onChange={(e) => setLc(Number(e.target.value))}
                          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-900 font-bold focus:border-blue-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">daN</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden dark:bg-blue-600">
            {/* Background Accent */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">Rekommenderat antal band</p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-8xl font-black tracking-tighter leading-none">{numStraps > 0 ? numStraps : 0}</span>
                <div className="text-left">
                  <p className="text-2xl font-bold leading-none">st</p>
                  <p className="text-blue-300 text-xs font-medium uppercase mt-1">Spännband</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Metod</p>
                  <p className="text-sm font-bold">{method === 'top-over' ? 'Överfall' : method === 'loop' ? 'Grimma' : 'Spring'}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Riktning</p>
                  <p className="text-sm font-bold">{direction === 'forward' ? 'Framåt' : direction === 'sideways' ? 'Sidled' : 'Bakåt'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95"
                >
                  <Save size={20} /> Spara
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white py-4 rounded-2xl font-black hover:bg-white/30 transition-all active:scale-95 border border-white/10"
                >
                  <Share2 size={20} /> Dela
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info size={16} />
              Visualisering
            </h4>
            <LashingVisualizer method={method} />
          </div>

          {/* History Panel */}
          <div className="rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History size={18} className="text-blue-500" />
                Historik ({savedCalculations.length})
              </h4>
              {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showHistory && (
              <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                {savedCalculations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Inga sparade beräkningar än.
                  </div>
                ) : (
                  savedCalculations.map((calc) => (
                    <div key={calc.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{calc.weight}kg • {calc.method} • {calc.direction}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{calc.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black dark:bg-blue-900/30 dark:text-blue-400">
                          {calc.numStraps}
                        </span>
                        <button 
                          onClick={() => onDeleteSaved(calc.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
