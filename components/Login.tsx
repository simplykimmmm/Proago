
import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
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
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 flex-grow h-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tighter text-slate-900 italic uppercase">
          PROAGO PORTAL
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your professional control center.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-xs font-black uppercase tracking-widest text-slate-500">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 py-3 border outline-none"
                  placeholder="ID Number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-500">
                Security Key
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 py-3 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 animate-fade-in">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-xs font-bold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-xs font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-all active:scale-95"
              >
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                <span className="bg-white px-3">System Access</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-indigo-600">MANAGER</p>
                    <p>aaa / aaa</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-slate-900">RECRUITER</p>
                    <p>xxx / xxx</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-emerald-600">WORKER</p>
                    <p>111 / 111</p>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
