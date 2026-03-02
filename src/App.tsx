import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy, AlertCircle } from 'lucide-react';
import { cn } from './lib/utils';
import quizzesData from './data/ykb_quizzes.json';

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  image: string | null;
  options: Option[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

export default function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleBackToMenu = () => {
    setSelectedQuiz(null);
  };

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              YKB Provfrågor
            </h1>
            <p className="mt-4 text-xl text-slate-600">
              Öva inför ditt Yrkeskompetensbevis (YKB) med riktiga provfrågor.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {quizzesData.map((quiz, index) => (
              <motion.button
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuizSelect(quiz as Quiz)}
                className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {quiz.questions.length} frågor
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{quiz.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Testa dina kunskaper i detta delprov.
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];
  const selectedOptionId = selectedAnswers[currentQuestion.id];

  const calculateScore = () => {
    let correct = 0;
    selectedQuiz.questions.forEach(q => {
      const selectedId = selectedAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selectedId && correctOption && selectedId === correctOption.id) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    const passed = percentage >= 80; // Assuming 80% is passing

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className={cn(
              "p-8 text-center text-white",
              passed ? "bg-emerald-500" : "bg-rose-500"
            )}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
                {passed ? <Trophy className="w-10 h-10 text-white" /> : <AlertCircle className="w-10 h-10 text-white" />}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {passed ? "Grattis, du klarade det!" : "Tyvärr, du nådde inte godkänt."}
              </h2>
              <p className="text-white/80 text-lg">
                Du fick {score} av {selectedQuiz.questions.length} rätt ({percentage}%)
              </p>
            </div>

            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Gör om provet
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Välj annat prov
                </button>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Genomgång av dina svar</h3>
                {selectedQuiz.questions.map((q, i) => {
                  const userAnswerId = selectedAnswers[q.id];
                  const correctOption = q.options.find(o => o.isCorrect);
                  const isCorrect = userAnswerId === correctOption?.id;

                  return (
                    <div key={q.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Fråga {i + 1}</p>
                          <p className="text-slate-900 font-medium mb-4">{q.text}</p>
                          
                          <div className="space-y-2">
                            {q.options.map(opt => {
                              const isSelected = opt.id === userAnswerId;
                              const isActuallyCorrect = opt.isCorrect;
                              
                              let optionClass = "text-slate-600";
                              if (isActuallyCorrect) {
                                optionClass = "text-emerald-700 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200";
                              } else if (isSelected && !isActuallyCorrect) {
                                optionClass = "text-rose-700 font-medium bg-rose-50 px-3 py-2 rounded-lg border border-rose-200";
                              } else {
                                optionClass = "px-3 py-2";
                              }

                              return (
                                <div key={opt.id} className={optionClass}>
                                  {opt.text}
                                  {isActuallyCorrect && <span className="ml-2 text-emerald-600 text-sm">(Rätt svar)</span>}
                                  {isSelected && !isActuallyCorrect && <span className="ml-2 text-rose-600 text-sm">(Ditt svar)</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToMenu}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Avbryt
          </button>
          <div className="text-sm font-medium text-slate-500">
            Fråga {currentQuestionIndex + 1} av {selectedQuiz.questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-12 overflow-hidden">
          <motion.div
            className="bg-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                {currentQuestion.text}
              </h2>

              {currentQuestion.image && (
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img 
                    src={currentQuestion.image} 
                    alt="Frågebild" 
                    className="w-full h-auto max-h-64 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900" 
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <span className="font-medium pr-4">{option.text}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300 group-hover:border-indigo-400"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors",
              currentQuestionIndex === 0
                ? "text-slate-400 cursor-not-allowed"
                : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
            Föregående
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all",
              !isAnswered
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            )}
          >
            {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Rätta provet' : 'Nästa'}
            {currentQuestionIndex !== selectedQuiz.questions.length - 1 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
