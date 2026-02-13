
import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, Briefcase, KeyRound, Flame } from 'lucide-react';
import { UserRole, Language } from '../types';
import { useTranslation } from '../services/translations';

interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, language }) => {
  const t = useTranslation(language);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'xxx' && password === 'xxx') {
      onLoginSuccess('RECRUITER');
    } else if (username === '111' && password === '111') {
      onLoginSuccess('WORKER');
    } else if (username === 'aaa' && password === 'aaa') {
      onLoginSuccess('MANAGER');
    } else {
      setError('Identity verification failed.');
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const inputClasses = "block w-full pl-14 sm:text-sm border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-phoenix-red focus:border-transparent bg-white dark:bg-phoenix-black text-slate-900 dark:text-white py-4 border outline-none transition-all font-medium placeholder-slate-400";

  return (
    <div className="flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 flex-grow h-full animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 dark:opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-phoenix-red/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-phoenix-orange/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto h-20 w-20 bg-slate-900 dark:bg-phoenix-red rounded-[24px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <Flame className="h-10 w-10 text-white animate-fire" />
        </div>
        <h2 className="mt-8 text-center text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
          PROAGO PORTAL
        </h2>
        <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Global Control Interface
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-white/80 dark:bg-phoenix-charcoal/80 backdrop-blur-xl py-12 px-6 shadow-2xl sm:rounded-[40px] sm:px-12 border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-phoenix-red/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <form className="space-y-8 relative z-10" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">
                Access ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-phoenix-red transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClasses}
                  placeholder="Employee ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">
                Security Cipher
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-phoenix-red transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-5 border border-red-100 dark:border-red-800 animate-shake">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="ml-3 text-[11px] font-black uppercase tracking-tight text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-2xl shadow-xl text-[12px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 dark:bg-phoenix-red hover:bg-phoenix-orange transition-all active:scale-95 italic"
            >
              Initialize Access
              <ArrowRight className="ml-3 h-5 w-5" />
            </button>
          </form>

          <div className="mt-12 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-phoenix-charcoal text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    Simulator Keys
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { id: 'xxx', icon: Briefcase, label: 'Recruiter' },
                  { id: 'aaa', icon: KeyRound, label: 'Manager' },
                  { id: '111', icon: User, label: 'Worker' }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => fillCredentials(role.id, role.id)}
                    className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-phoenix-red/10 hover:border-phoenix-red transition-all group shadow-sm"
                  >
                    <role.icon className="h-6 w-6 text-slate-400 group-hover:text-phoenix-red dark:group-hover:text-phoenix-red mb-2 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{role.label}</span>
                  </button>
                ))}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;