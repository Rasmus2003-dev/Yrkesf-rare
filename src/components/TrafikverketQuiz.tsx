import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Flag, CheckCircle2, XCircle, 
  AlertCircle, Grid, Sparkles, Clock, LayoutGrid, 
  List, ChevronDown, ChevronUp, Image as ImageIcon, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import AntiCheatLayer from './AntiCheatLayer';
import { Quiz } from '../types';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface TrafikverketQuizProps {
  quiz: Quiz;
  onExit: () => void;
  user?: User | null;
}

export default function TrafikverketQuiz({ quiz, onExit, user }: TrafikverketQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [immediateFeedback, setImmediateFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [examId, setExamId] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  
  // AI Image Generation State
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    if (!isStarted || showResults) return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isStarted, showResults]);

  // Initialize Exam in Supabase
  useEffect(() => {
    const initExam = async () => {
      if (user && isStarted && !examId && !immediateFeedback) {
        const { data, error } = await supabase
          .from('exams')
          .insert({
            user_id: user.id,
            category: quiz.category,
            total_questions: quiz.questions.length,
            status: 'started'
          })
          .select()
          .single();
        
        if (data) setExamId(data.id);
        if (error) console.error('Error creating exam:', error);
      }
    };
    initExam();
  }, [isStarted, user, quiz, examId, immediateFeedback]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id] || !!textAnswers[currentQuestion.id];
  const isMarked = markedQuestions.has(currentQuestion.id);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = (feedbackMode: boolean) => {
    setImmediateFeedback(feedbackMode);
    setIsStarted(true);
  };

  const handleAnswer = async (optionId: string) => {
    if (showResults) return;
    if (immediateFeedback && isAnswered) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));

    // Save answer to Supabase (only if in real exam mode)
    if (user && examId && !immediateFeedback) {
      const isCorrect = currentQuestion.options?.find(o => o.id === optionId)?.isCorrect ?? false;
      
      await supabase.from('exam_answers').insert({
        exam_id: examId,
        question_id: currentQuestion.id,
        choice_id: optionId,
        is_correct: isCorrect
      });
    }
  };

  const handleTextAnswer = (text: string) => {
    if (showResults) return;
    setTextAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: text
    }));
  };

  const toggleMark = () => {
    setMarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (q.type === 'fill-blank') {
        const answer = textAnswers[q.id]?.trim().toLowerCase();
        const expected = q.correctAnswer?.trim().toLowerCase();
        if (answer && expected && answer === expected) {
          correct++;
        }
      } else {
        const selectedId = selectedAnswers[q.id];
        const correctOption = q.options?.find(o => o.isCorrect);
        if (selectedId && correctOption && selectedId === correctOption.id) {
          correct++;
        }
      }
    });
    return correct;
  };

  const handleFinishExam = async () => {
    setShowResults(true);
    
    if (user && examId && !immediateFeedback) {
      const score = calculateScore();
      await supabase.from('exams').update({
        status: 'completed',
        score: score,
        completed_at: new Date().toISOString()
      }).eq('id', examId);
    }
  };

  const generateAIImage = async () => {
    if (generatedImages[currentQuestion.id]) return;
    
    setIsGeneratingImage(true);
    setImageGenerationError(null);

    try {
      if (!window.aistudio?.hasSelectedApiKey) {
          throw new Error("API-nyckel saknas. Vänligen välj en API-nyckel först.");
      }
      
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        const hasKeyAfter = await window.aistudio.hasSelectedApiKey();
        if (!hasKeyAfter) {
             setIsGeneratingImage(false);
             return;
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let vehicleContext = "ett tungt fordon (lastbil eller buss)";
      let specificInstruction = "";

      if (quiz.category === 'C') {
        vehicleContext = "en tung lastbil (utan släp)";
        specificInstruction = "Visa en lastbil utan släp. Fokusera på lastbilens egenskaper.";
      } else if (quiz.category === 'CE') {
        vehicleContext = "en tung lastbil med tungt släp (ekipage)";
        specificInstruction = "Det är MYCKET VIKTIGT att bilden visar en lastbil MED SLÄP. Om frågan handlar om koppling, visa kopplingsanordningen tydligt.";
      } else if (quiz.category === 'D') {
        vehicleContext = "en buss";
        specificInstruction = "Visa en buss. Fokusera på passagerarsäkerhet eller bussens egenskaper.";
      }
      
      const prompt = `
        Du är en expert på att skapa pedagogiska illustrationer för körkortsfrågor (teoriprov).
        Uppgift: Skapa en tydlig och pedagogisk bild som hjälper eleven att förstå följande fråga för behörighet ${quiz.category}.
        Fordonskontext: ${vehicleContext}
        Specifik instruktion: ${specificInstruction}
        Fråga: "${currentQuestion.text}"
        ${currentQuestion.options ? `Svarsalternativ (kontext): ${currentQuestion.options.map(o => o.text).join(', ')}` : ''}
        Bildkrav:
        1. Stil: Fotorealistisk eller högkvalitativ 3D-renderad "trafikskole-stil". Ren, tydlig och professionell.
        2. Innehåll: Visualisera situationen, fordonet eller komponenten som frågan handlar om.
        3. Miljö: Svensk trafikmiljö (högertrafik, svenska vägmärken om relevant).
        4. VIKTIGT: INGEN TEXT, INGA BOKSTÄVER, INGA SIFFROR i bilden. Bilden ska vara helt textfri.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImages(prev => ({ ...prev, [currentQuestion.id]: imageUrl }));
      } else {
        throw new Error("Kunde inte generera bild.");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      setImageGenerationError(error.message || "Ett fel uppstod vid generering av bild.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: START SCREEN
  // ---------------------------------------------------------------------------
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white max-w-2xl w-full rounded-3xl shadow-xl overflow-hidden border border-slate-200"
        >
          <div className="p-6 sm:p-10">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-6">
              {quiz.category}
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{quiz.title}</h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Detta prov innehåller <strong className="text-slate-900">{quiz.questions.length} frågor</strong>. 
              Välj hur du vill genomföra provet nedan.
            </p>

            <div className="grid gap-4">
              <button
                onClick={() => handleStart(false)}
                className="flex items-start p-6 border-2 border-slate-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group text-left"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                  <Flag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Examensläge</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Simulerar det riktiga teoriprovet. Du ser resultatet och rätta svar först när du har lämnat in hela provet.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleStart(true)}
                className="flex items-start p-6 border-2 border-slate-200 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group text-left"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Övningsläge</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Få omedelbar feedback och förklaringar efter varje besvarad fråga. Perfekt för inlärning.
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={onExit} 
              className="px-6 py-2.5 text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors"
            >
              Avbryt och återgå
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: RESULTS SCREEN
  // ---------------------------------------------------------------------------
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Result Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8"
          >
            <div className={cn(
              "p-12 text-center text-white",
              passed ? "bg-emerald-600" : "bg-rose-600"
            )}>
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                {passed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                {passed ? "Prov Godkänt!" : "Prov Underkänt"}
              </h2>
              <p className="text-lg opacity-90 font-medium max-w-lg mx-auto">
                {passed 
                  ? "Snyggt jobbat! Du har visat att du har de kunskaper som krävs." 
                  : "Du nådde inte riktigt gränsen för godkänt (80%). Gå igenom dina fel och försök igen."}
              </p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 text-center border border-slate-100 flex md:block items-center justify-between md:justify-center">
                  <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider md:mb-2">Ditt Resultat</div>
                  <div className="text-2xl sm:text-4xl font-black text-slate-900">{score} <span className="text-lg sm:text-xl text-slate-400">/ {quiz.questions.length}</span></div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 text-center border border-slate-100 flex md:block items-center justify-between md:justify-center">
                  <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider md:mb-2">Procent</div>
                  <div className={cn("text-2xl sm:text-4xl font-black", passed ? "text-emerald-600" : "text-rose-600")}>{percentage}%</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 text-center border border-slate-100 flex md:block items-center justify-between md:justify-center">
                  <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider md:mb-2">Tid</div>
                  <div className="text-2xl sm:text-4xl font-black text-slate-900">{formatTime(timeElapsed)}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setIsStarted(false);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setTextAnswers({});
                    setMarkedQuestions(new Set());
                    setTimeElapsed(0);
                    setGeneratedImages({});
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Gör om provet
                </button>
                <button
                  onClick={onExit}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Återgå till översikt
                </button>
              </div>
            </div>
          </motion.div>

          {/* Detailed Review */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 md:p-12">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center gap-3">
              <List className="w-6 h-6 text-indigo-600" />
              Detaljerad Genomgång
            </h3>
            
            <div className="space-y-4">
              {quiz.questions.map((q, i) => {
                let isCorrect = false;
                let userAnswerText = "";
                let correctAnswerText = "";

                if (q.type === 'fill-blank') {
                  const answer = textAnswers[q.id]?.trim().toLowerCase();
                  const expected = q.correctAnswer?.trim().toLowerCase();
                  isCorrect = !!(answer && expected && answer === expected);
                  userAnswerText = textAnswers[q.id] || "Inget svar angivet";
                  correctAnswerText = q.correctAnswer || "";
                } else {
                  const userAnswerId = selectedAnswers[q.id];
                  const correctOption = q.options?.find(o => o.isCorrect);
                  isCorrect = userAnswerId === correctOption?.id;
                  userAnswerText = q.options?.find(o => o.id === userAnswerId)?.text || "Inget svar angivet";
                  correctAnswerText = correctOption?.text || "";
                }

                const isExpanded = expandedReview === q.id;

                return (
                  <div key={q.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                    <button 
                      onClick={() => setExpandedReview(isExpanded ? null : q.id)}
                      className="w-full flex items-start gap-4 p-5 bg-white hover:bg-slate-50 text-left transition-colors"
                    >
                      <div className={cn(
                        "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                      )}>
                        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-slate-900 leading-snug">
                          <span className="text-slate-400 mr-2">{i + 1}.</span>
                          {q.text}
                        </p>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 bg-slate-50"
                        >
                          <div className="p-6 pl-17 space-y-4">
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ditt svar</div>
                              <div className={cn("font-medium", isCorrect ? "text-emerald-700" : "text-rose-700")}>
                                {userAnswerText}
                              </div>
                            </div>
                            
                            {!isCorrect && (
                              <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rätt svar</div>
                                <div className="font-medium text-slate-900">
                                  {correctAnswerText}
                                </div>
                              </div>
                            )}

                            {q.explanation && (
                              <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Förklaring
                                </div>
                                <p className="text-indigo-900 text-sm leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: EXAM SCREEN (Simulator UI)
  // ---------------------------------------------------------------------------
  const answeredCount = Object.keys(selectedAnswers).length + Object.keys(textAnswers).length;
  const progressPercentage = (answeredCount / quiz.questions.length) * 100;

  return (
    <AntiCheatLayer isActive={isStarted && !immediateFeedback}>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-indigo-200">
        
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">TP</span>
            </div>
            <h1 className="font-bold text-slate-900 hidden sm:block">{quiz.title}</h1>
            {immediateFeedback && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Övningsläge
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-mono font-bold text-slate-700 tracking-wider">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <button 
              onClick={onExit}
              className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-2 text-sm font-bold text-slate-500 hover:text-slate-900 bg-slate-100 sm:bg-transparent rounded-full sm:rounded-none transition-colors"
              title="Avbryt"
            >
              <span className="hidden sm:block">AVBRYT</span>
              <XCircle className="w-5 h-5 sm:hidden" />
            </button>
          </div>
        </header>

        {/* PROGRESS BAR */}
        <div className="h-1.5 bg-slate-200 w-full">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row relative">
          
          {/* LEFT/CENTER: QUESTION AREA */}
          <main className="flex-1 p-4 sm:p-8 lg:p-12 flex flex-col pb-32 lg:pb-12">
            
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-4">
                <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest">
                  Fråga {currentQuestionIndex + 1} <span className="opacity-50">av {quiz.questions.length}</span>
                </span>
              </div>
              
              <button
                onClick={toggleMark}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all border",
                  isMarked 
                    ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                <Flag className={cn("w-4 h-4", isMarked && "fill-current")} />
                <span className="hidden sm:inline">{isMarked ? "Markerad" : "Markera fråga"}</span>
              </button>
            </div>

            {/* Question Content */}
            <div className="max-w-3xl w-full mx-auto lg:mx-0">
              <h2 className="text-xl sm:text-3xl font-medium text-slate-900 mb-6 sm:mb-8 leading-snug">
                {currentQuestion.text}
              </h2>

              {/* Image Area */}
              {(currentQuestion.image || generatedImages[currentQuestion.id]) && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm relative group">
                  <img 
                    src={generatedImages[currentQuestion.id] || currentQuestion.image || ''} 
                    alt="Frågebild" 
                    className="w-full h-auto max-h-[450px] object-contain bg-slate-50"
                  />
                  {generatedImages[currentQuestion.id] && (
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" /> AI-genererad
                    </div>
                  )}
                </div>
              )}

              {/* Generate Image Button (if no image exists) */}
              {!currentQuestion.image && !generatedImages[currentQuestion.id] && (
                <div className="mb-8">
                  <button
                    onClick={generateAIImage}
                    disabled={isGeneratingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold shadow-sm"
                  >
                    {isGeneratingImage ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Skapar illustration...</>
                    ) : (
                      <><ImageIcon className="w-4 h-4" /> Generera bildstöd med AI</>
                    )}
                  </button>
                  {imageGenerationError && (
                    <div className="mt-2 text-sm text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {imageGenerationError}
                    </div>
                  )}
                </div>
              )}

              {/* Options Area */}
              <div className="space-y-3">
                {currentQuestion.type === 'fill-blank' ? (
                  <div>
                    <input
                      type="text"
                      value={textAnswers[currentQuestion.id] || ''}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      placeholder="Skriv ditt svar här..."
                      className="w-full p-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all bg-white shadow-sm"
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  currentQuestion.options?.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                    const isCorrect = option.isCorrect;
                    const showFeedback = immediateFeedback && isAnswered;
                    
                    let containerClass = "flex items-center p-4 sm:p-5 border-2 rounded-2xl cursor-pointer transition-all bg-white shadow-sm ";
                    let radioClass = "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors ";
                    
                    if (showFeedback) {
                      if (isCorrect) {
                        containerClass += "border-emerald-500 bg-emerald-50";
                        radioClass += "border-emerald-600 bg-emerald-600 text-white";
                      } else if (isSelected) {
                        containerClass += "border-rose-500 bg-rose-50";
                        radioClass += "border-rose-600 bg-rose-600 text-white";
                      } else {
                        containerClass += "border-slate-200 opacity-50 cursor-default";
                        radioClass += "border-slate-300";
                      }
                    } else {
                      if (isSelected) {
                        containerClass += "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600";
                        radioClass += "border-indigo-600";
                      } else {
                        containerClass += "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                        radioClass += "border-slate-300";
                      }
                    }

                    return (
                      <label key={option.id} className={containerClass}>
                        <input 
                          type="radio" 
                          className="sr-only" 
                          name={`question-${currentQuestion.id}`}
                          checked={isSelected} 
                          onChange={() => handleAnswer(option.id)}
                          disabled={showFeedback}
                        />
                        <div className={radioClass}>
                          {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                          {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                          {!showFeedback && isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                        </div>
                        <span className="text-base sm:text-lg font-medium text-slate-800 leading-snug">{option.text}</span>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Immediate Feedback Explanation */}
              {immediateFeedback && isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl"
                >
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Förklaring
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {currentQuestion.explanation || "Ingen ytterligare förklaring tillgänglig för denna fråga."}
                  </p>
                </motion.div>
              )}
            </div>
          </main>

          {/* RIGHT: NAVIGATION PANEL (Desktop) */}
          <aside className="hidden lg:flex w-80 xl:w-96 bg-white border-l border-slate-200 flex-col fixed right-0 top-16 bottom-0 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" /> Provöversikt
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                {answeredCount} av {quiz.questions.length} besvarade
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-5 xl:grid-cols-6 gap-2.5">
                {quiz.questions.map((q, i) => {
                  const answered = !!selectedAnswers[q.id] || !!textAnswers[q.id];
                  const marked = markedQuestions.has(q.id);
                  const current = i === currentQuestionIndex;
                  
                  return (
                    <button 
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(i)} 
                      className={cn(
                        "h-11 rounded-xl font-bold text-sm relative border-2 transition-all", 
                        current ? "border-slate-900 shadow-md scale-110 z-10" : "border-transparent hover:border-slate-300", 
                        answered && !current ? "bg-indigo-100 text-indigo-700" : 
                        !answered && !current ? "bg-slate-100 text-slate-500" : 
                        current && answered ? "bg-indigo-600 text-white border-indigo-600" :
                        "bg-white text-slate-900"
                      )}
                    >
                      {i + 1}
                      {marked && (
                        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200" /> Obesvarad
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-200" /> Besvarad
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm" /> Markerad för granskning
              </div>
            </div>
          </aside>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-80 xl:right-96 bg-white border-t border-slate-200 p-3 pb-5 sm:p-6 z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Mobile Nav Toggle */}
            <button 
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="lg:hidden flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0"
            >
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button 
              onClick={handlePrev} 
              disabled={currentQuestionIndex === 0} 
              className="flex items-center justify-center w-12 h-12 sm:w-auto sm:px-6 sm:py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:block ml-2">Föregående</span>
            </button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button 
                onClick={handleFinishExam} 
                className="flex-1 px-4 sm:px-8 h-12 sm:h-auto sm:py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Lämna in <span className="hidden sm:inline">prov</span> <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                className="flex-1 px-4 sm:px-8 h-12 sm:h-auto sm:py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Nästa <span className="hidden sm:inline">fråga</span> <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {showMobileNav && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowMobileNav(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] flex flex-col shadow-2xl"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-black text-slate-900">Provöversikt</h3>
                  <button onClick={() => setShowMobileNav(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="grid grid-cols-5 gap-3">
                    {quiz.questions.map((q, i) => {
                      const answered = !!selectedAnswers[q.id] || !!textAnswers[q.id];
                      const marked = markedQuestions.has(q.id);
                      const current = i === currentQuestionIndex;
                      return (
                        <button 
                          key={q.id}
                          onClick={() => { setCurrentQuestionIndex(i); setShowMobileNav(false); }} 
                          className={cn(
                            "h-12 rounded-xl font-bold text-sm relative border-2", 
                            current ? "border-slate-900" : "border-transparent", 
                            answered && !current ? "bg-indigo-100 text-indigo-700" : 
                            !answered && !current ? "bg-slate-100 text-slate-500" : 
                            current && answered ? "bg-indigo-600 text-white border-indigo-600" :
                            "bg-white text-slate-900 shadow-sm"
                          )}
                        >
                          {i + 1}
                          {marked && <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </AntiCheatLayer>
  );
}
