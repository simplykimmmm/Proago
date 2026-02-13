
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Briefcase, 
  BarChart3, PieChart, Activity, Plus, Save, Calendar, ArrowRight,
  UserCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Flame, Shield
} from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../services/translations';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface ManagerDashboardProps {
  language: Language;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ language }) => {
  const t = useTranslation(language);
  const [finances, setFinances] = useState<MonthlyData[]>([
    { month: 'Aug', revenue: 45000, expenses: 32000 },
    { month: 'Sep', revenue: 52000, expenses: 35000 },
    { month: 'Oct', revenue: 48000, expenses: 34000 },
  ]);

  const [newEntry, setNewEntry] = useState({ month: 'Nov', revenue: '', expenses: '' });

  const workerPerformance = [
    { id: '1', name: 'Jean-Pierre M.', generated: 8400, cost: 3200, sales: 154, roi: '2.6x' },
    { id: '2', name: 'Sarah W.', generated: 7200, cost: 2800, sales: 132, roi: '2.5x' },
    { id: '3', name: 'Marco V.', generated: 6500, cost: 2600, sales: 121, roi: '2.5x' },
    { id: '4', name: 'Worker 111', generated: 2400, cost: 1200, sales: 42, roi: '2.0x' },
  ];

  const handleAddFinances = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.revenue || !newEntry.expenses) return;
    setFinances([...finances, { 
      month: newEntry.month, 
      revenue: parseFloat(newEntry.revenue), 
      expenses: parseFloat(newEntry.expenses) 
    }]);
    setNewEntry({ month: '', revenue: '', expenses: '' });
  };

  const totalRevenue = finances.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpenses = finances.reduce((acc, curr) => acc + curr.expenses, 0);
  const profit = totalRevenue - totalExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 dark:bg-white/10 rounded-full mb-3">
             <Shield className="w-3.5 h-3.5 text-phoenix-red" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white">Administrative Authority</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">{t.manager.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-medium uppercase tracking-[0.2em]">{t.manager.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-900 dark:bg-phoenix-charcoal rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-phoenix-red/20 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-phoenix-red mb-3">{t.manager.revenue}</p>
            <p className="text-5xl font-black tracking-tighter italic uppercase leading-none">€{totalRevenue.toLocaleString()}</p>
            <div className="mt-8 flex items-center text-xs font-bold text-emerald-400 gap-2">
                <div className="p-1 bg-emerald-400/20 rounded-md"><ArrowUpRight className="w-4 h-4" /></div> +12.5% Growth
            </div>
        </div>
        <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] p-10 border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:scale-[1.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-3">{t.manager.expenses}</p>
            <p className="text-5xl font-black tracking-tighter italic uppercase leading-none text-slate-900 dark:text-white">€{totalExpenses.toLocaleString()}</p>
            <div className="mt-8 flex items-center text-xs font-bold text-red-400 gap-2">
                <div className="p-1 bg-red-400/20 rounded-md"><ArrowDownRight className="w-4 h-4" /></div> Operating Overhead
            </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-[40px] p-10 border border-emerald-100 dark:border-emerald-800 shadow-xl transition-all hover:scale-[1.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-500 mb-3">{t.manager.profit}</p>
            <p className="text-5xl font-black tracking-tighter italic uppercase leading-none text-emerald-700 dark:text-emerald-400">€{profit.toLocaleString()}</p>
            <div className="mt-8 flex items-center text-xs font-bold text-emerald-600 gap-2">
                <TrendingUp className="w-5 h-5" /> Optimized Yield
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Charts & Entry */}
          <div className="space-y-10">
              <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-2xl transition-all">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-phoenix-red" /> Financial Trajectory
                    </h3>
                  </div>
                  
                  <div className="flex items-end justify-between h-56 gap-6 px-4 pt-4 relative">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100 dark:bg-white/5"></div>
                      {finances.map((f, i) => (
                          <div key={i} className="flex-1 flex gap-2 items-end h-full relative group">
                              <div 
                                className="bg-phoenix-red w-full rounded-t-xl transition-all duration-1000 shadow-[0_-5px_20px_rgba(255,42,42,0.3)] hover:brightness-125"
                                style={{ height: `${(f.revenue / 60000) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-slate-200 dark:bg-white/10 w-full rounded-t-xl transition-all duration-1000 hover:bg-slate-300 dark:hover:bg-white/20"
                                style={{ height: `${(f.expenses / 60000) * 100}%` }}
                              ></div>
                              <div className="absolute -bottom-10 left-0 right-0 text-center">
                                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{f.month}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-center gap-10 mt-20 text-[10px] font-black uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><span className="w-4 h-4 bg-phoenix-red rounded-md"></span> Revenue</div>
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><span className="w-4 h-4 bg-slate-200 dark:bg-white/10 rounded-md"></span> Expenses</div>
                  </div>
              </div>

              <div className="bg-slate-100 dark:bg-white/5 rounded-[40px] p-10 border border-slate-200 dark:border-white/5 shadow-inner">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Plus className="w-5 h-5 text-phoenix-red" /> {t.manager.register}
                  </h3>
                  <form onSubmit={handleAddFinances} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input 
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-black uppercase outline-none bg-white dark:bg-phoenix-black text-slate-900 dark:text-white focus:ring-2 focus:ring-phoenix-red transition-all" 
                        placeholder="MONTH" 
                        value={newEntry.month} 
                        onChange={e => setNewEntry({...newEntry, month: e.target.value})}
                      />
                      <input 
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-black uppercase outline-none bg-white dark:bg-phoenix-black text-slate-900 dark:text-white focus:ring-2 focus:ring-phoenix-red transition-all" 
                        placeholder="REVENUE (€)" 
                        type="number"
                        value={newEntry.revenue} 
                        onChange={e => setNewEntry({...newEntry, revenue: e.target.value})}
                      />
                      <input 
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-black uppercase outline-none bg-white dark:bg-phoenix-black text-slate-900 dark:text-white focus:ring-2 focus:ring-phoenix-red transition-all" 
                        placeholder="EXPENSES (€)" 
                        type="number"
                        value={newEntry.expenses} 
                        onChange={e => setNewEntry({...newEntry, expenses: e.target.value})}
                      />
                      <button className="bg-slate-900 dark:bg-phoenix-red text-white rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest hover:bg-phoenix-orange transition-all flex items-center justify-center gap-2 shadow-xl italic">
                          <Save className="w-4 h-4" /> LOG AUDIT
                      </button>
                  </form>
              </div>
          </div>

          <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl transition-all">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">{t.manager.rentability}</h3>
                  <Users className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
                      <thead>
                          <tr className="bg-slate-50/50 dark:bg-white/5">
                              <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Ambassador</th>
                              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Gen. Value</th>
                              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Overhead</th>
                              <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">ROI index</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                          {workerPerformance.map(worker => (
                              <tr key={worker.id} className="hover:bg-phoenix-red/5 transition-all group cursor-default">
                                  <td className="px-10 py-6">
                                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{worker.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{worker.sales} Transactions</p>
                                  </td>
                                  <td className="px-6 py-6 text-right whitespace-nowrap text-sm font-black text-emerald-600 dark:text-emerald-400">€{worker.generated.toLocaleString()}</td>
                                  <td className="px-6 py-6 text-right whitespace-nowrap text-sm font-bold text-slate-400">€{worker.cost.toLocaleString()}</td>
                                  <td className="px-10 py-6 text-right whitespace-nowrap">
                                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black bg-slate-900 dark:bg-phoenix-red text-white shadow-lg italic">{worker.roi}</span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="p-10 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-center">
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-phoenix-red hover:text-phoenix-orange transition-all flex items-center gap-3 mx-auto italic">
                      Generate Efficiency Report <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;