import React from 'react';
import { ViewState, UserRole } from '../types';
import { LayoutDashboard, UserPlus, LogIn, Briefcase, Award } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isAuthenticated: boolean;
  userRole: UserRole;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, isAuthenticated, userRole, onLogout }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => onViewChange(ViewState.FORM)}>
              <div className="flex items-center gap-2">
                 <span className="font-serif text-2xl font-bold text-white tracking-wide">PROAGO WORLD</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* Common Button: Apply Form (Always visible unless logged in as worker, maybe?) */}
            {userRole !== 'WORKER' && (
                <button
                onClick={() => onViewChange(ViewState.FORM)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                    currentView === ViewState.FORM
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                >
                <UserPlus className="h-4 w-4 mr-2" />
                Apply Now
                </button>
            )}
            
            {isAuthenticated ? (
                <>
                {userRole === 'RECRUITER' && (
                    <button
                        onClick={() => onViewChange(ViewState.DASHBOARD)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                        currentView === ViewState.DASHBOARD
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Recruiter Portal
                    </button>
                )}
                
                {userRole === 'WORKER' && (
                    <button
                        onClick={() => onViewChange(ViewState.WORKER_DASHBOARD)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                        currentView === ViewState.WORKER_DASHBOARD
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <Award className="h-4 w-4 mr-2" />
                        My Performance
                    </button>
                )}

                <div className="h-6 w-px bg-slate-700 mx-2"></div>

                <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-white text-xs font-medium"
                >
                    Sign Out
                </button>
                </>
            ) : (
               <button
                onClick={() => onViewChange(ViewState.LOGIN)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                  currentView === ViewState.LOGIN
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </button>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;