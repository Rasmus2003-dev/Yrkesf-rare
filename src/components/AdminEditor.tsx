import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Edit2, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminEditor() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .select('*, choices(*)')
      .order('created_at', { ascending: false });
    
    if (data) setQuestions(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const handleSelect = (q: any) => {
    setSelectedQuestion(JSON.parse(JSON.stringify(q))); // Deep copy for editing
    setMessage(null);
  };

  const handleCreateNew = () => {
    setSelectedQuestion({
      id: 'new',
      question_text: '',
      image_url: '',
      explanation: '',
      category: 'YKB',
      topic: 'Nytt Prov',
      difficulty: 'medium',
      is_active: true,
      choices: [
        { id: 'new-1', choice_text: '', is_correct: true },
        { id: 'new-2', choice_text: '', is_correct: false },
        { id: 'new-3', choice_text: '', is_correct: false },
        { id: 'new-4', choice_text: '', is_correct: false },
      ]
    });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedQuestion) return;
    setSaving(true);
    setMessage(null);

    try {
      const isNew = selectedQuestion.id === 'new';
      
      const questionData = {
        question_text: selectedQuestion.question_text,
        image_url: selectedQuestion.image_url,
        explanation: selectedQuestion.explanation,
        category: selectedQuestion.category,
        topic: selectedQuestion.topic,
        difficulty: selectedQuestion.difficulty,
        is_active: selectedQuestion.is_active
      };

      let qId = selectedQuestion.id;

      if (isNew) {
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();
        
        if (qError) throw qError;
        qId = qData.id;
      } else {
        const { error: qError } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', qId);
        
        if (qError) throw qError;
      }

      // Handle choices
      // For simplicity, delete old choices and insert new ones
      if (!isNew) {
        await supabase.from('choices').delete().eq('question_id', qId);
      }

      const choicesToInsert = selectedQuestion.choices.map((c: any) => ({
        question_id: qId,
        choice_text: c.choice_text,
        is_correct: c.is_correct
      }));

      const { error: cError } = await supabase.from('choices').insert(choicesToInsert);
      if (cError) throw cError;

      setMessage({ type: 'success', text: 'Frågan sparades framgångsrikt!' });
      fetchQuestions();
      if (isNew) {
        setSelectedQuestion(null);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Kunde inte spara frågan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion || selectedQuestion.id === 'new') return;
    if (!confirm('Är du säker på att du vill radera denna fråga?')) return;
    
    setSaving(true);
    try {
      await supabase.from('questions').delete().eq('id', selectedQuestion.id);
      setMessage({ type: 'success', text: 'Frågan raderades.' });
      setSelectedQuestion(null);
      fetchQuestions();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Kunde inte radera frågan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImportLocal = async () => {
    if (!confirm('Detta kommer att importera alla lokala frågor till databasen. Detta kan ta en liten stund. Fortsätt?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/quizzes');
      if (!response.ok) throw new Error('Kunde inte hämta lokala frågor.');
      const quizzes = await response.json();
      
      const allQuestions: any[] = [];
      for (const quiz of quizzes) {
        for (const q of quiz.questions) {
          allQuestions.push({ quiz, q });
        }
      }

      const batchSize = 50;
      let importedCount = 0;
      
      for (let i = 0; i < allQuestions.length; i += batchSize) {
        const batch = allQuestions.slice(i, i + batchSize);
        
        const questionsData = batch.map(item => ({
          question_text: item.q.text,
          image_url: item.q.image || '',
          explanation: item.q.explanation || '',
          category: item.quiz.category,
          topic: item.quiz.title,
          difficulty: item.q.difficulty || 'medium',
          is_active: true
        }));
        
        const { data: insertedQuestions, error: qError } = await supabase
          .from('questions')
          .insert(questionsData)
          .select();
          
        if (qError) throw qError;
        
        const choicesData: any[] = [];
        for (let j = 0; j < batch.length; j++) {
          const insertedQ = insertedQuestions[j];
          const originalQ = batch[j].q;
          
          for (const opt of originalQ.options || []) {
            choicesData.push({
              question_id: insertedQ.id,
              choice_text: opt.text,
              is_correct: opt.isCorrect || false
            });
          }
        }
        
        const { error: cError } = await supabase.from('choices').insert(choicesData);
        if (cError) throw cError;
        
        importedCount += batch.length;
      }
      
      setMessage({ type: 'success', text: `${importedCount} frågor importerades framgångsrikt!` });
      fetchQuestions();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Fel vid import: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading && questions.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[800px]">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-black text-slate-900">Frågebank ({questions.length})</h2>
          <div className="flex gap-2">
            {questions.length === 0 && (
              <button 
                onClick={handleImportLocal}
                disabled={saving}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                title="Importera lokala frågor"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </button>
            )}
            <button 
              onClick={handleCreateNew}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              title="Skapa ny fråga"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {questions.map(q => (
            <button
              key={q.id}
              onClick={() => handleSelect(q)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all",
                selectedQuestion?.id === q.id 
                  ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-100 rounded-md">{q.category}</span>
                {!q.is_active && <span className="text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-100 rounded-md">Inaktiv</span>}
              </div>
              <p className="text-sm font-medium text-slate-900 line-clamp-2">{q.question_text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-[800px] flex flex-col">
        {selectedQuestion ? (
          <>
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-black text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                {selectedQuestion.id === 'new' ? 'Skapa ny fråga' : 'Redigera fråga'}
              </h2>
              <div className="flex items-center gap-3">
                {selectedQuestion.id !== 'new' && (
                  <button 
                    onClick={handleDelete}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Radera"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Spara
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  <div className="mt-0.5">
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div>{message.text}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                  <select 
                    value={selectedQuestion.category}
                    onChange={e => setSelectedQuestion({...selectedQuestion, category: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="YKB">YKB</option>
                    <option value="C">C</option>
                    <option value="CE">CE</option>
                    <option value="D">D</option>
                    <option value="Gemensam">Gemensam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ämne / Provnamn</label>
                  <input 
                    type="text"
                    value={selectedQuestion.topic || ''}
                    onChange={e => setSelectedQuestion({...selectedQuestion, topic: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="T.ex. Delprov 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Frågetext</label>
                <textarea 
                  value={selectedQuestion.question_text}
                  onChange={e => setSelectedQuestion({...selectedQuestion, question_text: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                  placeholder="Skriv frågan här..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Bild URL (Frivilligt)
                </label>
                <input 
                  type="text"
                  value={selectedQuestion.image_url || ''}
                  onChange={e => setSelectedQuestion({...selectedQuestion, image_url: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://exempel.se/bild.jpg"
                />
                {selectedQuestion.image_url && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 max-w-xs">
                    <img src={selectedQuestion.image_url} alt="Preview" className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">Svarsalternativ</label>
                <div className="space-y-3">
                  {selectedQuestion.choices.map((choice: any, index: number) => (
                    <div key={choice.id || index} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correct_choice"
                        checked={choice.is_correct}
                        onChange={() => {
                          const newChoices = selectedQuestion.choices.map((c: any, i: number) => ({
                            ...c,
                            is_correct: i === index
                          }));
                          setSelectedQuestion({...selectedQuestion, choices: newChoices});
                        }}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <input 
                        type="text"
                        value={choice.choice_text}
                        onChange={e => {
                          const newChoices = [...selectedQuestion.choices];
                          newChoices[index].choice_text = e.target.value;
                          setSelectedQuestion({...selectedQuestion, choices: newChoices});
                        }}
                        className={cn(
                          "flex-1 p-3 rounded-xl border outline-none transition-colors",
                          choice.is_correct ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500"
                        )}
                        placeholder={`Alternativ ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Förklaring (Frivilligt)</label>
                <textarea 
                  value={selectedQuestion.explanation || ''}
                  onChange={e => setSelectedQuestion({...selectedQuestion, explanation: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="Förklara varför rätt svar är rätt..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <input 
                  type="checkbox"
                  id="is_active"
                  checked={selectedQuestion.is_active}
                  onChange={e => setSelectedQuestion({...selectedQuestion, is_active: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Aktiv (Synlig för användare)
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
            <Edit2 className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Välj en fråga</h3>
            <p>Välj en fråga i listan till vänster för att redigera den, eller klicka på plus-ikonen för att skapa en ny.</p>
          </div>
        )}
      </div>
    </div>
  );
}
