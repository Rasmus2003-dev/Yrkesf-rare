import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Lösenorden matchar inte.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Lösenordet måste vara minst 6 tecken långt.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Ditt lösenord har uppdaterats!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ett fel uppstod.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-slate-100 bg-slate-50 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Min Profil</h2>
            <p className="text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" /> Byt lösenord
          </h3>

          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              <div className="mt-0.5">
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <div>{message.text}</div>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nytt lösenord</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bekräfta nytt lösenord</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Uppdatera lösenord
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
