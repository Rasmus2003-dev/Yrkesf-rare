import { X, User, Mail, Calendar, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileModalProps {
  user: {
    name: string;
    email: string;
    created_at: string;
  };
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileModal({ user, onClose, onLogout }: ProfileModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-12 left-8">
            <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-900 p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Användare'}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Yrkesförare</p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">E-post</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Medlem sedan</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Nyligen'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut size={20} />
              Logga ut
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
