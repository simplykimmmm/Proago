
import React from 'react';
import { ViewState, UserRole, Theme, Language } from '../types';
import { LayoutDashboard, UserPlus, LogIn, Award, TrendingUp, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { useTranslation } from '../services/translations';

interface NavbarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isAuthenticated: boolean;
  userRole: UserRole;
  onLogout: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, onViewChange, isAuthenticated, userRole, onLogout, 
  theme, onThemeToggle, language, onLanguageChange 
}) => {
  const t = useTranslation(language);

  return (
    <nav className="bg-white/80 dark:bg-phoenix-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange(ViewState.LANDING)}>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase relative overflow-hidden italic">
                PROAGO WORLD
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-phoenix-red to-phoenix-orange transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-1">
              {(['en', 'fr', 'de'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                    language === lang ? 'bg-white dark:bg-phoenix-red text-phoenix-red dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-phoenix-red transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

            {userRole !== 'WORKER' && userRole !== 'MANAGER' && (
                <button
                onClick={() => onViewChange(ViewState.FORM)}
                className={`inline-flex items-center px-5 py-2.5 border-2 border-transparent text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    currentView === ViewState.FORM
                    ? 'bg-phoenix-red text-white shadow-[0_0_20px_rgba(255,42,42,0.3)]'
                    : 'text-slate-500 dark:text-slate-300 hover:text-phoenix-red dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
                >
                <UserPlus className="h-4 w-4 mr-2" />
                {t.nav.apply}
                </button>
            )}
            
            {isAuthenticated ? (
                <>
                {userRole === 'RECRUITER' && (
                    <button
                        onClick={() => onViewChange(ViewState.DASHBOARD)}
                        className={`inline-flex items-center px-5 py-2.5 border-2 border-transparent text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        currentView === ViewState.DASHBOARD
                            ? 'bg-phoenix-red text-white'
                            : 'text-slate-500 dark:text-slate-300 hover:text-phoenix-red dark:hover:text-white'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {t.nav.recruitment}
                    </button>
                )}

                {userRole === 'MANAGER' && (
                    <button
                        onClick={() => onViewChange(ViewState.MANAGER_DASHBOARD)}
                        className={`inline-flex items-center px-5 py-2.5 border-2 border-transparent text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        currentView === ViewState.MANAGER_DASHBOARD
                            ? 'bg-phoenix-red text-white'
                            : 'text-slate-500 dark:text-slate-300 hover:text-phoenix-red dark:hover:text-white'
                        }`}
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {t.nav.manager}
                    </button>
                )}
                
                {userRole === 'WORKER' && (
                    <button
                        onClick={() => onViewChange(ViewState.WORKER_DASHBOARD)}
                        className={`inline-flex items-center px-5 py-2.5 border-2 border-transparent text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        currentView === ViewState.WORKER_DASHBOARD
                            ? 'bg-phoenix-red text-white'
                            : 'text-slate-500 dark:text-slate-300 hover:text-phoenix-red dark:hover:text-white'
                        }`}
                    >
                        <Award className="h-4 w-4 mr-2" />
                        {t.nav.performance}
                    </button>
                )}

                <button
                    onClick={onLogout}
                    className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                    title={t.nav.signOut}
                >
                    <LogOut className="w-5 h-5" />
                </button>
                </>
            ) : (
               <button
                onClick={() => onViewChange(ViewState.LOGIN)}
                className={`inline-flex items-center px-5 py-2.5 border-2 border-slate-900 dark:border-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  currentView === ViewState.LOGIN
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-phoenix-black'
                    : 'text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-phoenix-black'
                }`}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;