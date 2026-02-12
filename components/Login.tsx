
import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, Briefcase, KeyRound } from 'lucide-react';
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
      setError('Invalid credentials.');
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const inputClasses = "block w-full pl-10 sm:text-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-3 border outline-none transition-all";

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 flex-grow h-full animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 bg-slate-900 dark:bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
          PROAGO PORTAL
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          Sign in to your professional control center.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClasses}
                  placeholder="ID Number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                Security Key
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
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
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="ml-3 text-xs font-bold text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-xs font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all active:scale-95"
            >
              {t.nav.login}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 dark:bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => fillCredentials('xxx', 'xxx')}
                  className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <Briefcase className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Recruiter</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('aaa', 'aaa')}
                  className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <KeyRound className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Manager</span>
                </button>
                 <button
                  type="button"
                  onClick={() => fillCredentials('111', '111')}
                  className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <User className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Worker</span>
                </button>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
