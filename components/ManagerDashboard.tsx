
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Briefcase, 
  BarChart3, PieChart, Activity, Plus, Save, Calendar, ArrowRight,
  UserCheck, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

const ManagerDashboard: React.FC = () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Management Control</h1>
        <p className="text-slate-500 text-sm mt-1">High-level financial oversight & operational profitability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Total Monthly Revenue</p>
            <p className="text-4xl font-black tracking-tighter italic uppercase leading-none">€{totalRevenue.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-400">
                <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5% vs Last Period
            </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Operational Expenses</p>
            <p className="text-4xl font-black tracking-tighter italic uppercase leading-none text-slate-900">€{totalExpenses.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-red-400">
                <ArrowDownRight className="w-4 h-4 mr-1" /> +4.2% Growth
            </div>
        </div>
        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 shadow-sm group">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-2">Net Profitability</p>
            <p className="text-4xl font-black tracking-tighter italic uppercase leading-none text-emerald-700">€{profit.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" /> Healthy Margins
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Financial Input & Chart */}
          <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" /> Revenue vs Expenses
                  </h3>
                  
                  {/* Mock Chart Area */}
                  <div className="flex items-end justify-between h-48 gap-4 px-4 pt-4 border-b border-slate-100">
                      {finances.map((f, i) => (
                          <div key={i} className="flex-1 flex gap-1 items-end h-full">
                              <div 
                                className="bg-indigo-600 w-full rounded-t-lg transition-all duration-1000"
                                style={{ height: `${(f.revenue / 60000) * 100}%` }}
                                title={`Rev: €${f.revenue}`}
                              ></div>
                              <div 
                                className="bg-slate-200 w-full rounded-t-lg transition-all duration-1000"
                                style={{ height: `${(f.expenses / 60000) * 100}%` }}
                                title={`Exp: €${f.expenses}`}
                              ></div>
                              <div className="absolute -bottom-6 left-0 right-0 text-center">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{f.month}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-12 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-600 rounded"></span> Revenue</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded"></span> Expenses</div>
                  </div>
              </div>

              {/* Data Entry Form */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-600" /> Register Monthly Data
                  </h3>
                  <form onSubmit={handleAddFinances} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input 
                        className="p-3 rounded-xl border border-slate-200 text-xs font-bold outline-none" 
                        placeholder="Month" 
                        value={newEntry.month} 
                        onChange={e => setNewEntry({...newEntry, month: e.target.value})}
                      />
                      <input 
                        className="p-3 rounded-xl border border-slate-200 text-xs font-bold outline-none md:col-span-1" 
                        placeholder="Revenue (€)" 
                        type="number"
                        value={newEntry.revenue} 
                        onChange={e => setNewEntry({...newEntry, revenue: e.target.value})}
                      />
                      <input 
                        className="p-3 rounded-xl border border-slate-200 text-xs font-bold outline-none md:col-span-1" 
                        placeholder="Expenses (€)" 
                        type="number"
                        value={newEntry.expenses} 
                        onChange={e => setNewEntry({...newEntry, expenses: e.target.value})}
                      />
                      <button className="bg-slate-900 text-white rounded-xl p-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                          <Save className="w-4 h-4" /> Log Entry
                      </button>
                  </form>
              </div>
          </div>

          {/* Employee Rentability */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Worker Rentability</h3>
                  <Users className="w-4 h-4 text-slate-300" />
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                      <thead>
                          <tr>
                              <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Worker</th>
                              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue Gen.</th>
                              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Salary Cost</th>
                              <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">ROI</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {workerPerformance.map(worker => (
                              <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-8 py-4">
                                      <p className="text-sm font-bold text-slate-900">{worker.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{worker.sales} Sales</p>
                                  </td>
                                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-black text-emerald-600">€{worker.generated.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-bold text-slate-400">€{worker.cost.toLocaleString()}</td>
                                  <td className="px-8 py-4 text-right whitespace-nowrap">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100">{worker.roi}</span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2 mx-auto">
                      Full Efficiency Audit <ArrowRight className="w-3 h-3" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
