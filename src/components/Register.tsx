import { useState, FormEvent } from 'react';
import { Truck, ShieldCheck, Clock, GraduationCap, Check, Lock, ChevronRight, Star, Fingerprint, Shield, Users, ArrowLeft, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: any) => void;
  onLoginClick: () => void;
}

export default function Register({ onRegister, onLoginClick }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registreringen misslyckades');
      }

      onRegister(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ett fel uppstod vid registrering.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col lg:flex-row">
      
      {/* Left Column: Value Proposition & Features */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight">Yrkesförare</h1>
              <p className="text-sm text-slate-400 font-medium">Din digitala co-driver</p>
            </div>
          </div>

          <div className="space-y-12 max-w-lg">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                Gå med i<br />
                <span className="text-blue-400">gemenskapen.</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Skapa ett konto för att spara dina framsteg, synka mellan enheter och få tillgång till premiumfunktioner.
              </p>
              
              <div className="space-y-4">
                {[
                  "Spara dina quiz-resultat",
                  "Synka anteckningar mellan enheter",
                  "Få personliga jobbrekommendationer",
                  "Helt gratis att komma igång"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield size={16} className="text-emerald-400" />
            <span>Används av tusentals yrkesförare över hela Sverige</span>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-950">
        <div className="max-w-md mx-auto w-full">
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Tillbaka till inloggning
          </button>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Skapa konto</h2>
            <p className="text-slate-500 dark:text-slate-400">Kom igång på mindre än en minut</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="Ditt namn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="namn@foretag.se"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="Välj ett säkert lösenord"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Skapa konto <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            Genom att skapa ett konto godkänner du våra <a href="#" className="underline hover:text-slate-600">användarvillkor</a> och <a href="#" className="underline hover:text-slate-600">integritetspolicy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}