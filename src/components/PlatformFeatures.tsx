import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BarChart3, Smartphone, Zap, BookOpen } from 'lucide-react';

export default function PlatformFeatures() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Träna på riktiga frågor",
      description: "Öva på frågor som speglar riktiga teoriprov för YKB och körkortsbehörigheter."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      title: "Direkt feedback",
      description: "Se direkt om du svarar rätt eller fel och lär dig av varje fråga."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Statistik och progression",
      description: "Följ din utveckling och se hur nära du är att klara teoriprovet."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "Mobilvänligt",
      description: "Träna när som helst – mobilen, surfplattan eller datorn."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Snabba övningsprov",
      description: "Gör korta träningspass eller fullständiga prov."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
