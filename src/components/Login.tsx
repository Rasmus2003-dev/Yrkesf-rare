import { useState, FormEvent } from 'react';
import { Truck, ShieldCheck, Clock, GraduationCap, Check, Lock, ChevronRight, Star, Shield, Users, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
  onRegisterClick: () => void;
  onDemoClick: () => void;
}

export default function Login({ onLogin, onRegisterClick, onDemoClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Inloggningen misslyckades');
      }

      onLogin(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ett fel uppstod vid inloggning.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Ange din e-postadress för att återställa lösenordet.');
      return;
    }
    
    // Mock password reset for local auth
    setResetSent(true);
    setError('');
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
                Kör säkert.<br />
                Kör smart.<br />
                <span className="text-blue-400">Kör lagligt.</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Den kompletta plattformen för yrkesförare i Sverige. Träna på teorifrågor, håll koll på kör- och vilotider, och säkra lasten rätt.
              </p>
              
              <div className="space-y-4">
                {[
                  "Följ lagar och regler enkelt",
                  "Träna med riktiga körkortsfrågor",
                  "Håll koll på dina kör- och vilotider",
                  "Öka säkerheten och effektiviteten"
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

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <GraduationCap className="text-blue-400 mb-3" size={28} />
                <h3 className="font-bold text-lg mb-1">Körkortsquiz</h3>
                <p className="text-xs text-slate-400">Träna inför provet med direkt feedback.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <Clock className="text-indigo-400 mb-3" size={28} />
                <h3 className="font-bold text-lg mb-1">Kör & Vila</h3>
                <p className="text-xs text-slate-400">Enkla guider för EU-regler.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <ShieldCheck className="text-emerald-400 mb-3" size={28} />
                <h3 className="font-bold text-lg mb-1">Lastsäkring</h3>
                <p className="text-xs text-slate-400">Kalkylatorer och lathundar.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <Truck className="text-amber-400 mb-3" size={28} />
                <h3 className="font-bold text-lg mb-1">Daglig Tillsyn</h3>
                <p className="text-xs text-slate-400">Digitala checklistor.</p>
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

      {/* Right Column: Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-950">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Välkommen tillbaka</h2>
            <p className="text-slate-500 dark:text-slate-400">Logga in för att komma åt dina verktyg</p>
          </div>

          {/* Premium Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400">
              <Star size={16} className="fill-current" />
              Premiumtjänst för yrkesförare
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                {error}
              </div>
            )}
            {resetSent && (
              <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm font-medium border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                Ett e-postmeddelande för återställning av lösenord har skickats.
              </div>
            )}
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Lösenord</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Glömt lösenord?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="••••••••"
                required
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
                  Logga in <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Har du inget konto?</p>
            <button 
              onClick={onRegisterClick}
              className="w-full rounded-2xl border-2 border-slate-200 py-4 font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Skapa konto gratis
            </button>
            
            <div className="mt-4 relative flex items-center justify-center">
              <span className="bg-white px-2 text-xs text-slate-400 dark:bg-slate-950">eller</span>
            </div>

            <button 
              onClick={onDemoClick}
              className="mt-4 w-full rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 py-4 font-bold transition-all hover:bg-emerald-100 active:scale-[0.98] dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
            >
              Testa 10 frågor gratis
            </button>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 dark:bg-blue-900/30 dark:text-blue-400">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-1">Visste du?</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Regelbunden träning på teorifrågor ökar din säkerhet på vägen och minskar risken för böter.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Lock size={12} />
              <span>Säker anslutning</span>
            </div>
            <span>GDPR-säkrad</span>
          </div>
        </div>
      </div>
    </div>
  );
}