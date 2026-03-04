import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, AlertCircle } from 'lucide-react';

export default function InfoSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto bg-white border border-slate-200 p-10 rounded-3xl shadow-sm"
    >
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Om Plattformen</h2>
      <div className="space-y-8 text-slate-600">
        <section>
          <h3 className="text-xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Autentiska Frågor
          </h3>
          <p className="leading-relaxed">
            Plattformen innehåller hundratals frågor som är direkt relevanta för YKB-utbildningen (Yrkeskompetensbevis). 
            Frågorna täcker allt från lastsäkring och kör- och vilotider till första hjälpen och miljövänlig körning.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Interaktiv Inlärning
          </h3>
          <p className="leading-relaxed">
            Varje prov ger dig omedelbar feedback. Efter avslutat prov får du en detaljerad genomgång där du ser exakt 
            vilka frågor du svarade rätt på och vilka du behöver plugga mer på, komplett med pedagogiska bilder.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Unika Illustrationer
          </h3>
          <p className="leading-relaxed">
            Vi använder AI-genererade, unika illustrationer för att förtydliga tekniska koncept. Detta gör att 
            plattformen känns modern och anpassad för dagens buss- och lastbilsförare.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-400">
            Skapad för bussutbildningen 2026 • Version 2.0
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-200">
              Mobilanpassad
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-200">
              Offline-stöd
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
