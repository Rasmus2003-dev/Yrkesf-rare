import { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  RotateCcw,
  FileText,
  Trash2
} from 'lucide-react';

interface InspectionItem {
  id: string;
  label: string;
  category: string;
  status: 'pending' | 'ok' | 'issue';
  note?: string;
  photo?: string; // Data URL or Object URL
}

const initialItems: InspectionItem[] = [
  // Däck & Hjul
  { id: 'tires_pressure', label: 'Däcktryck', category: 'Däck & Hjul', status: 'pending' },
  { id: 'tires_tread', label: 'Mönsterdjup', category: 'Däck & Hjul', status: 'pending' },
  { id: 'tires_damage', label: 'Skador på däck/fälg', category: 'Däck & Hjul', status: 'pending' },
  { id: 'wheel_nuts', label: 'Hjulmuttrar (efterdragning)', category: 'Däck & Hjul', status: 'pending' },

  // Belysning & Signal
  { id: 'lights_front', label: 'Halv/Helljus & Pos.ljus fram', category: 'Belysning', status: 'pending' },
  { id: 'lights_rear', label: 'Bakljus & Bromsljus', category: 'Belysning', status: 'pending' },
  { id: 'indicators', label: 'Blinkers', category: 'Belysning', status: 'pending' },
  { id: 'horn', label: 'Signalhorn', category: 'Belysning', status: 'pending' },

  // Vätskor
  { id: 'oil', label: 'Motorolja', category: 'Vätskor', status: 'pending' },
  { id: 'coolant', label: 'Kylarvätska', category: 'Vätskor', status: 'pending' },
  { id: 'washer', label: 'Spolarvätska', category: 'Vätskor', status: 'pending' },
  { id: 'adblue', label: 'AdBlue', category: 'Vätskor', status: 'pending' },

  // Bromsar
  { id: 'brakes_service', label: 'Färdbroms funktion', category: 'Bromsar', status: 'pending' },
  { id: 'brakes_parking', label: 'Parkeringsbroms', category: 'Bromsar', status: 'pending' },
  { id: 'air_pressure', label: 'Lufttryck & Dränering', category: 'Bromsar', status: 'pending' },

  // Övrigt
  { id: 'bodywork', label: 'Kaross & Skåp (skador)', category: 'Övrigt', status: 'pending' },
  { id: 'mirrors', label: 'Backspeglar', category: 'Övrigt', status: 'pending' },
  { id: 'wipers', label: 'Vindrutetorkare', category: 'Övrigt', status: 'pending' },
  { id: 'safety_gear', label: 'Säkerhetsutr. (Väst, Triangel)', category: 'Övrigt', status: 'pending' },
];

export default function VehicleInspection() {
  const [items, setItems] = useState<InspectionItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const categories = Array.from(new Set(items.map(i => i.category)));

  const handleStatusChange = (id: string, status: 'ok' | 'issue') => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handleNoteChange = (id: string, note: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, note } : item
    ));
  };

  const handlePhotoUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, photo: e.target?.result as string } : item
      ));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, photo: undefined } : item
    ));
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = '';
    }
  };

  const resetInspection = () => {
    if (window.confirm('Är du säker på att du vill rensa formuläret?')) {
      setItems(initialItems);
      setShowSuccess(false);
    }
  };

  const submitInspection = () => {
    const pending = items.filter(i => i.status === 'pending');
    if (pending.length > 0) {
      alert(`Du har ${pending.length} punkter kvar att kontrollera.`);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Here you would typically save to a backend
      console.log('Inspection submitted:', items);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Inspektion klar!</h2>
        <p className="mb-8 text-slate-500 dark:text-slate-400">
          Din rapport har sparats och skickats.
        </p>
        <button
          onClick={() => {
            setItems(initialItems);
            setShowSuccess(false);
          }}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
        >
          Starta ny inspektion
        </button>
      </div>
    );
  }

  const progress = Math.round((items.filter(i => i.status !== 'pending').length / items.length) * 100);

  return (
    <div className="p-4 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Daglig Tillsyn</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={resetInspection}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          title="Återställ"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Framsteg</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
            <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">{category}</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.filter(i => i.category === category).map(item => (
                <div key={item.id} className="p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, 'ok')}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                          item.status === 'ok'
                            ? 'border-green-500 bg-green-50 text-green-600 dark:border-green-500 dark:bg-green-900/20 dark:text-green-400'
                            : 'border-slate-200 text-slate-300 hover:border-green-200 hover:text-green-400 dark:border-slate-700 dark:text-slate-600'
                        }`}
                      >
                        <CheckCircle2 size={24} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'issue')}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                          item.status === 'issue'
                            ? 'border-red-500 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400'
                            : 'border-slate-200 text-slate-300 hover:border-red-200 hover:text-red-400 dark:border-slate-700 dark:text-slate-600'
                        }`}
                      >
                        <AlertCircle size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Issue Details Section */}
                  {item.status === 'issue' && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-red-800 dark:text-red-200">
                            Beskrivning av felet
                          </label>
                          <textarea
                            value={item.note || ''}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            placeholder="Beskriv vad som är fel..."
                            className="w-full rounded-md border-red-200 bg-white p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-red-800 dark:bg-slate-900 dark:text-white"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => fileInputRefs.current[item.id]?.click()}
                              className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-900/30"
                            >
                              <Camera size={14} />
                              {item.photo ? 'Byt bild' : 'Ta bild'}
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              ref={el => fileInputRefs.current[item.id] = el}
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handlePhotoUpload(item.id, e.target.files[0]);
                                }
                              }}
                            />
                            {item.photo && (
                              <button
                                onClick={() => removePhoto(item.id)}
                                className="rounded-md p-1.5 text-red-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          
                          {item.photo && (
                            <div className="mt-2">
                              <img 
                                src={item.photo} 
                                alt="Fel" 
                                className="h-24 w-auto rounded-lg border border-red-200 object-cover dark:border-red-800" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={submitInspection}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Save size={20} />
              Skicka Rapport
            </>
          )}
        </button>
      </div>
    </div>
  );
}
