import { useState } from 'react';
import { Search } from 'lucide-react';

interface TrafficSign {
  code: string;
  title: string;
  description: string;
  category: 'prohibitory' | 'warning' | 'mandatory' | 'other';
  imageUrl: string;
}

export default function TrafficSigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const signs: TrafficSign[] = [
    // Förbudsmärken (Prohibitory)
    {
      code: 'C7',
      title: 'Förbud mot trafik med tung lastbil',
      description: 'Märket anger förbud mot trafik med tung lastbil.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Sweden_road_sign_C7.svg/240px-Sweden_road_sign_C7.svg.png'
    },
    {
      code: 'C9',
      title: 'Förbud mot trafik med fordon lastat med farligt gods',
      description: 'Märket anger förbud mot trafik med fordon lastat med farligt gods.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Sweden_road_sign_C9.svg/240px-Sweden_road_sign_C9.svg.png'
    },
    {
      code: 'C16',
      title: 'Begränsad fordonsbredd',
      description: 'Märket anger förbud mot trafik med fordon över en viss bredd.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sweden_road_sign_C16.svg/240px-Sweden_road_sign_C16.svg.png'
    },
    {
      code: 'C17',
      title: 'Begränsad fordonshöjd',
      description: 'Märket anger förbud mot trafik med fordon över en viss höjd.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sweden_road_sign_C17.svg/240px-Sweden_road_sign_C17.svg.png'
    },
    {
      code: 'C18',
      title: 'Begränsad fordonslängd',
      description: 'Märket anger förbud mot trafik med fordon eller fordonståg över en viss längd.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sweden_road_sign_C18.svg/240px-Sweden_road_sign_C18.svg.png'
    },
    {
      code: 'C20',
      title: 'Begränsad bruttovikt på fordon',
      description: 'Märket anger förbud mot trafik med fordon vars bruttovikt överstiger den angivna vikten.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sweden_road_sign_C20.svg/240px-Sweden_road_sign_C20.svg.png'
    },
    {
      code: 'C21',
      title: 'Begränsad bruttovikt på fordon och fordonståg',
      description: 'Märket anger förbud mot trafik med fordon eller fordonståg vars bruttovikt överstiger den angivna vikten.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sweden_road_sign_C20.svg/240px-Sweden_road_sign_C20.svg.png'
    },
    {
      code: 'C23',
      title: 'Begränsat axeltryck',
      description: 'Märket anger förbud mot trafik med fordon vars axeltryck överstiger det angivna värdet.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Sweden_road_sign_C23.svg/240px-Sweden_road_sign_C23.svg.png'
    },
    {
      code: 'C24',
      title: 'Begränsat boggitryck',
      description: 'Märket anger förbud mot trafik med fordon vars boggitryck överstiger det angivna värdet.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Sweden_road_sign_C24.svg/240px-Sweden_road_sign_C24.svg.png'
    },
    {
      code: 'C29',
      title: 'Förbud mot omkörning med tung lastbil',
      description: 'Märket anger att det är förbjudet för tung lastbil att köra om andra motordrivna fordon än tvåhjuliga mopeder och motorcyklar utan sidvagn.',
      category: 'prohibitory',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Sweden_road_sign_C29.svg/240px-Sweden_road_sign_C29.svg.png'
    },
    
    // Varningsmärken (Warning)
    {
      code: 'A3',
      title: 'Varning för nedförslutning',
      description: 'Märket anger en farlig nedförslutning.',
      category: 'warning',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sweden_road_sign_A3.svg/240px-Sweden_road_sign_A3.svg.png'
    },
    {
      code: 'A4',
      title: 'Varning för stigning',
      description: 'Märket anger en farlig stigning.',
      category: 'warning',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Sweden_road_sign_A4.svg/240px-Sweden_road_sign_A4.svg.png'
    },
    {
      code: 'A5',
      title: 'Varning för avsmalnande väg',
      description: 'Märket anger att vägen smalnar av.',
      category: 'warning',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Sweden_road_sign_A5-1.svg/240px-Sweden_road_sign_A5-1.svg.png'
    },
    {
      code: 'A24',
      title: 'Varning för sidvind',
      description: 'Märket anger en sträcka där det ofta förekommer kraftig sidvind.',
      category: 'warning',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Sweden_road_sign_A24.svg/240px-Sweden_road_sign_A24.svg.png'
    },
    {
      code: 'A40',
      title: 'Varning för annan fara',
      description: 'Märket anger en fara som det inte finns något särskilt varningsmärke för.',
      category: 'warning',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Sweden_road_sign_A40.svg/240px-Sweden_road_sign_A40.svg.png'
    }
  ];

  const filteredSigns = signs.filter(sign => {
    const matchesSearch = sign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sign.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vägmärken</h2>
        <p className="text-slate-500 dark:text-slate-400">Viktiga skyltar för tunga fordon</p>
      </header>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Sök vägmärke (t.ex. 'bredd', 'C7')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => setActiveCategory('prohibitory')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === 'prohibitory'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Förbud
          </button>
          <button
            onClick={() => setActiveCategory('warning')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === 'warning'
                ? 'bg-yellow-500 text-black'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Varning
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredSigns.map((sign) => (
          <div key={sign.code} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="shrink-0">
              <img 
                src={sign.imageUrl} 
                alt={sign.title} 
                className="h-16 w-16 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{sign.code}</span>
                <h3 className="font-bold text-slate-900 dark:text-white">{sign.title}</h3>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sign.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>Källa: Transportstyrelsen (TSFS 2007:90)</p>
      </div>
    </div>
  );
}
