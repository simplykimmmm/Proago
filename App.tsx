import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LeadForm from './components/LeadForm';
import Dashboard from './components/Dashboard';
import WorkerDashboard from './components/WorkerDashboard';
import Login from './components/Login';
import { ViewState, UserRole } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.FORM);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLoginSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === 'RECRUITER') {
      setCurrentView(ViewState.DASHBOARD);
    } else if (role === 'WORKER') {
      setCurrentView(ViewState.WORKER_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentView(ViewState.FORM);
  };

  const handleViewChange = (view: ViewState) => {
    // Protect routes based on authentication and role
    if ((view === ViewState.DASHBOARD || view === ViewState.WORKER_DASHBOARD) && !isAuthenticated) {
      setCurrentView(ViewState.LOGIN);
      return;
    }
    
    // Role-based protection
    if (view === ViewState.DASHBOARD && userRole !== 'RECRUITER') {
        // If a worker tries to go to recruiter dashboard, keep them on worker dashboard or form
        return; 
    }
    if (view === ViewState.WORKER_DASHBOARD && userRole !== 'WORKER') {
        return;
    }

    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow flex flex-col">
        {currentView === ViewState.FORM && <LeadForm />}
        {currentView === ViewState.DASHBOARD && isAuthenticated && userRole === 'RECRUITER' && <Dashboard />}
        {currentView === ViewState.WORKER_DASHBOARD && isAuthenticated && userRole === 'WORKER' && <WorkerDashboard />}
        {currentView === ViewState.LOGIN && <Login onLoginSuccess={handleLoginSuccess} />}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Proago World. All rights reserved. | Smart Lead Capture (LEAD-01)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;