import { useState } from 'react';
import { Calculator, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { unNumbers, UNNumber } from '../data/un_numbers';

interface AddedItem extends UNNumber {
  quantity: number;
  points: number;
}

export default function PointsCalculator() {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<UNNumber | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  const filtered = query 
    ? unNumbers.filter(
        (item) =>
          item.id.includes(query) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const getFactor = (category: number) => {
    switch (category) {
      case 0: return 0; // Prohibited usually, but for calc logic
      case 1: return 50;
      case 2: return 3;
      case 3: return 1;
      case 4: return 0; // Unlimited
      default: return 1;
    }
  };

  const addItem = () => {
    if (!selectedItem || quantity <= 0) return;

    const factor = getFactor(selectedItem.transportCategory);
    const points = quantity * factor;

    setAddedItems(prev => [...prev, { ...selectedItem, quantity, points }]);
    setSelectedItem(null);
    setQuantity(0);
    setQuery('');
  };

  const removeItem = (index: number) => {
    setAddedItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalPoints = addedItems.reduce((sum, item) => sum + item.points, 0);
  const isOverLimit = totalPoints > 1000;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">1000-poängskalkylator</h3>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sök ämne
            </label>
            <input
              type="text"
              placeholder="UN-nummer eller namn..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedItem(null);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            
            {/* Dropdown */}
            {query && filtered.length > 0 && !selectedItem && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {filtered.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setQuery(`${item.id} - ${item.name}`);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">UN {item.id}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity Input */}
          {selectedItem && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                <div className="font-semibold">Valt ämne:</div>
                <div>{selectedItem.name} (Klass {selectedItem.class})</div>
                <div>Transportkategori: {selectedItem.transportCategory} (Faktor {getFactor(selectedItem.transportCategory)})</div>
                {selectedItem.tunnelCode && <div>Tunnelkod: {selectedItem.tunnelCode}</div>}
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mängd (kg/liter)
                  </label>
                  <input
                    type="number"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={addItem}
                  disabled={quantity <= 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus size={20} />
                  Lägg till
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List of added items */}
      {addedItems.length > 0 && (
        <div className="space-y-3">
          {addedItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">UN {item.id} - {item.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {item.quantity} x Faktor {getFactor(item.transportCategory)} = <span className="font-semibold">{item.points} poäng</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total Result */}
      <div className={`overflow-hidden rounded-xl shadow-lg transition-colors ${
        isOverLimit 
          ? 'bg-red-600 text-white' 
          : 'bg-slate-900 text-white dark:bg-blue-600'
      }`}>
        <div className="p-6 text-center">
          <p className="mb-2 text-sm font-medium opacity-80">Total poängsumma</p>
          <div className="text-5xl font-bold tracking-tight">
            {totalPoints}
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            {isOverLimit ? (
              <>
                <AlertTriangle className="text-white" />
                <span className="font-bold">VÄRDEBERÄKNAD MÄNGD ÖVERSKRIDEN</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-white" />
                <span className="font-bold">Inom gränsen för värdeberäknad mängd (1.1.3.6)</span>
              </>
            )}
          </div>
          
          {isOverLimit && (
            <p className="mt-2 text-xs opacity-90">
              Fullständiga ADR-regler gäller. Fordonet måste vara orange-skyltat.
            </p>
          )}
          {!isOverLimit && totalPoints > 0 && (
            <p className="mt-2 text-xs opacity-90">
              Befrielse enligt 1.1.3.6 gäller. Ingen orange skylt krävs (om inga andra krav finns).
              Krav på brandsläckare (2kg) och godsdeklaration kvarstår.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
