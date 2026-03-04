import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, ShieldCheck, UserCheck } from 'lucide-react';

export default function AboutSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Om Plattformen</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Teoriplattformen är skapad för att hjälpa blivande buss- och lastbilsförare att klara sina teoriprov. 
          Plattformen samlar realistiska frågor, smart träning och tydlig statistik för att göra inlärningen 
          enklare och mer effektiv.
        </p>
        
        <div className="h-px bg-slate-100 my-8" />
        
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Varför använda Teoriplattformen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Realistiska prov</h4>
              <p className="text-sm text-slate-500">Frågor som speglar det riktiga provet.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Tydlig progression</h4>
              <p className="text-sm text-slate-500">Se din utveckling över tid.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Fokus på verkliga kunskaper</h4>
              <p className="text-sm text-slate-500">Lär dig det du behöver kunna i yrket.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Designad för yrkesförare</h4>
              <p className="text-sm text-slate-500">Anpassad för branschens krav.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
