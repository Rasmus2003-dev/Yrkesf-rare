import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Trophy, Truck, Bus, BookOpen, Car, Zap, AlertTriangle, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import TrafikverketQuiz from './components/TrafikverketQuiz';
import ReferenceSection from './components/ReferenceSection';
import PlatformFeatures from './components/PlatformFeatures';
import AboutSection from './components/AboutSection';
import Auth from './components/Auth';
import Profile from './components/Profile';
import AdminEditor from './components/AdminEditor';
import { Quiz, QuizCategory, Question } from './types';
import { supabase } from './lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'reference' | 'about' | 'profile' | 'admin'>('quizzes');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Fetch quizzes from API (Supabase or Local Fallback)
  useEffect(() => {
    // ... existing fetch logic ...
    const fetchQuizzes = async () => {
      try {
        // Try fetching from Supabase first
        const { data: questions, error } = await supabase
          .from('questions')
          .select(`
            *,
            choices (*)
          `)
          .eq('is_active', true);

        if (error || !questions || questions.length === 0) {
          console.log('Fetching from local API fallback due to:', error || 'No data');
          // Fallback to local API
          const response = await fetch('/api/quizzes');
          if (response.ok) {
            const data = await response.json();
            setQuizzes(data);
          }
        } else {
          // Transform Supabase data to Quiz format
          // Group questions by category/topic to form "Quizzes"
          const groupedQuizzes: Record<string, Quiz> = {};

          questions.forEach((q: any) => {
            const quizId = q.category + '-' + (q.topic || 'General');
            if (!groupedQuizzes[quizId]) {
              groupedQuizzes[quizId] = {
                id: quizId,
                title: q.topic || `${q.category} Övningsprov`,
                category: q.category as QuizCategory,
                questions: [],
                description: `Övningsprov för ${q.category}`
              };
            }

            groupedQuizzes[quizId].questions.push({
              id: q.id,
              type: 'multiple-choice', // Defaulting for now
              text: q.question_text,
              image: q.image_url,
              explanation: q.explanation,
              category: q.category,
              difficulty: q.difficulty,
              options: q.choices.map((c: any) => ({
                id: c.id,
                text: c.choice_text,
                isCorrect: c.is_correct
              }))
            });
          });

          setQuizzes(Object.values(groupedQuizzes));
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser && ['quizzes', 'reference', 'profile', 'admin'].includes(activeTab)) {
        setActiveTab('about');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser && ['quizzes', 'reference', 'profile', 'admin'].includes(activeTab)) {
        setActiveTab('about');
      } else if (currentUser && activeTab === 'about') {
        setActiveTab('quizzes');
      }
    });

    fetchQuizzes();

    return () => subscription.unsubscribe();
  }, [activeTab]);

  const handleStartQuickQuiz = async (count: number, type: 'random' | 'failed') => {
    if (!user && type === 'failed') {
      setShowAuth(true);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select(`*, choices (*)`)
        .eq('is_active', true);

      if (selectedCategory !== 'ALL') {
        query = query.eq('category', selectedCategory);
      }

      // If 'failed', we would join with user_question_stats, but for simplicity in this demo:
      // We'll just fetch random for now, or implement a specific RPC for failed questions later.
      // For now, let's just fetch random questions.
      
      const { data, error } = await query;
      
      if (error) throw error;

      if (data) {
        // Shuffle and slice
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, count);
        
        const quickQuiz: Quiz = {
          id: `quick-${Date.now()}`,
          title: `Snabbträning (${count} frågor)`,
          category: selectedCategory === 'ALL' ? 'Gemensam' : selectedCategory,
          questions: shuffled.map((q: any) => ({
            id: q.id,
            type: 'multiple-choice',
            text: q.question_text,
            image: q.image_url,
            explanation: q.explanation,
            category: q.category,
            difficulty: q.difficulty,
            options: q.choices.map((c: any) => ({
              id: c.id,
              text: c.choice_text,
              isCorrect: c.is_correct
            }))
          }))
        };
        setSelectedQuiz(quickQuiz);
      }
    } catch (err) {
      console.error("Error starting quick quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-black animate-pulse">LADDAR TEORIPLATTFORMEN...</p>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    return <TrafikverketQuiz quiz={selectedQuiz} onExit={() => setSelectedQuiz(null)} user={user} />;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'YKB': return <BookOpen className="w-6 h-6 text-indigo-600" />;
      case 'C': return <Truck className="w-6 h-6 text-emerald-600" />;
      case 'CE': return <Truck className="w-6 h-6 text-purple-600" />; // Truck with trailer implied
      case 'D': return <Bus className="w-6 h-6 text-blue-600" />;
      default: return <Car className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialIsSignUp={authMode === 'signup'}
        onUserChange={(u) => {
          setUser(u);
          if (u) setShowAuth(false);
        }} 
      />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 relative">
          {user ? (
            <div className="absolute top-0 right-0 flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">Inloggad</span>
              <button 
                onClick={handleLogout}
                className="p-2 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Logga ut"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="absolute top-0 right-0 flex gap-3">
              <button 
                onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-900 hover:bg-slate-50"
              >
                Logga in
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                className="px-4 py-2 bg-indigo-600 rounded-lg shadow-sm border border-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 hidden sm:block"
              >
                Skapa konto
              </button>
            </div>
          )}

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-sm border border-slate-100"
          >
            <Trophy className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Teori<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500">plattformen</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Den ultimata plattformen för buss- och lastbilsutbildningen. 
            Träna på riktiga frågor och bli redo för teoriprovet.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-center gap-1">
            {user && (
              <>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={cn(
                    "px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 text-sm sm:text-base",
                    activeTab === 'quizzes' 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Övningsprov
                </button>
                <button
                  onClick={() => setActiveTab('reference')}
                  className={cn(
                    "px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 text-sm sm:text-base",
                    activeTab === 'reference' 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Funktionsbeskrivning
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={cn(
                    "px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 text-sm sm:text-base",
                    activeTab === 'profile' 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Profil
                </button>
                {user.email?.toLowerCase() === 'rasmus.03@hotmail.se' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={cn(
                      "px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 text-sm sm:text-base",
                      activeTab === 'admin' 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                        : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                    )}
                  >
                    Fråge-editor
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => setActiveTab('about')}
              className={cn(
                "px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 text-sm sm:text-base",
                activeTab === 'about' 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Om Plattformen
            </button>
          </div>
        </div>

        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center shadow-sm"
          >
            <p className="text-indigo-900 font-bold text-lg mb-2">
              Du behöver skapa ett konto för att svara på frågor!
            </p>
            <p className="text-indigo-700">
              Det är helt gratis och görs enklast via knappen "Logga in" uppe till höger. :)
            </p>
          </motion.div>
        )}

        {activeTab === 'quizzes' && user ? (
          <div className="space-y-10">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {(['ALL', 'YKB', 'C', 'CE', 'D', 'Gemensam'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold border transition-all shadow-sm",
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                  )}
                >
                  {cat === 'ALL' ? 'Alla kategorier' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes
                .filter(q => selectedCategory === 'ALL' || q.category === selectedCategory)
                .filter(q => !['Komarken Övningsprov 1', 'CE - Tung Lastbil med Släp', 'CE - Kopplingsanordningar (Fördjupning)', 'CE - Avancerad Körning & Teori'].includes(q.title))
                .map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-100 p-8 rounded-[2rem] text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                      {getCategoryIcon(quiz.category)}
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-200">
                      {quiz.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-slate-500 mb-8 font-medium leading-relaxed flex-grow">
                    {quiz.questions.length} frågor som testar dina kunskaper inom {quiz.category === 'ALL' ? 'alla områden' : quiz.category}.
                  </p>
                  
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-xl group-hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 group-hover:shadow-indigo-500/25"
                  >
                    Starta prov <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : activeTab === 'reference' && user ? (
          <ReferenceSection />
        ) : activeTab === 'profile' && user ? (
          <Profile user={user} />
        ) : activeTab === 'admin' && user?.email?.toLowerCase() === 'rasmus.03@hotmail.se' ? (
          <AdminEditor />
        ) : (
          <div className="space-y-12">
            <AboutSection />
            <PlatformFeatures />
          </div>
        )}
      </div>
    </div>
  );
}
