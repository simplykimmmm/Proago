
import React, { useState } from 'react';
import { 
  Award, Clock, DollarSign, TrendingUp, Calendar, MapPin, Shield, 
  ChevronRight, X, BarChart3, Star, Zap, CheckCircle2, Box, Info,
  Trophy, Target, ChevronUp, Flag, Users, Medal, LayoutDashboard
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: any;
}

interface RankLevel {
  id: string;
  name: string;
  targetAvg: number;
  requirement?: string;
  color: string;
  bgColor: string;
}

type WorkerTab = 'performance' | 'ranking' | 'shifts';

const WorkerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkerTab>('performance');
  const [activeModal, setActiveModal] = useState<'earnings' | 'achievements' | 'history' | 'career' | null>(null);

  // ProAgo Specific Rank Definitions
  const rankLevels: RankLevel[] = [
    { id: 'rookie', name: 'Rookie', targetAvg: 0, requirement: '8 sales in 5 workdays (Trial)', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    { id: 'promoter', name: 'Promoter', targetAvg: 1.6, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { id: 'pool_captain', name: 'Pool Captain', targetAvg: 2.6, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'team_captain', name: 'Team Captain', targetAvg: 3.6, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'sales_manager', name: 'Sales Manager', targetAvg: 4.6, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  ];

  // Mock User Data
  const currentRankIndex = 1; // User is "Promoter"
  const currentAvgSales = 2.1;

  // Mock Ranking Data
  const leaderboard = [
    { id: '1', name: 'Jean-Pierre M.', sales: 154, avg: 5.2, rank: 'Sales Manager', avatar: 'JP' },
    { id: '2', name: 'Sarah W.', sales: 132, avg: 4.1, rank: 'Team Captain', avatar: 'SW' },
    { id: '3', name: 'Marco V.', sales: 121, avg: 3.8, rank: 'Team Captain', avatar: 'MV' },
    { id: '4', name: 'Worker 111 (You)', sales: 42, avg: 2.1, rank: 'Promoter', avatar: 'W' },
    { id: '5', name: 'Lucinda K.', sales: 38, avg: 1.9, rank: 'Promoter', avatar: 'LK' },
  ];

  // Mock Shifts/Events Data
  const upcomingEvents = [
    { id: 'e1', title: 'Grand Opening - Zone A', date: '2025-10-30', time: '10:00 - 18:00', location: 'Cloche d\'Or', type: 'Sales Event', bonus: '€50 Milestone' },
    { id: 'e2', title: 'Monthly Sales Training', date: '2025-11-02', time: '09:00 - 12:00', location: 'Office HQ', type: 'Workshop', bonus: 'Skill XP' },
    { id: 'e3', title: 'Kirchberg Weekend Push', date: '2025-11-05', time: '11:00 - 20:00', location: 'Auchan Kirchberg', type: 'Shift', bonus: '1.5x Multiplier' },
  ];

  const currentRank = rankLevels[currentRankIndex];
  const nextRank = rankLevels[currentRankIndex + 1];

  const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Header with Prominent Tab Switcher */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Promoter Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Worker #111 • ProAgo World Recruitment</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button 
                onClick={() => setActiveTab('performance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <LayoutDashboard className="w-4 h-4" /> Performance
            </button>
            <button 
                onClick={() => setActiveTab('ranking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Medal className="w-4 h-4" /> Ranking
            </button>
            <button 
                onClick={() => setActiveTab('shifts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'shifts' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Calendar className="w-4 h-4" /> Shifts
            </button>
        </div>
      </div>

      {activeTab === 'performance' && (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div 
                    onClick={() => setActiveModal('career')}
                    className="cursor-pointer group relative flex items-center gap-4 bg-white border border-slate-200 p-2 pr-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-indigo-300 w-full md:w-auto"
                >
                    <div className={`h-14 w-14 rounded-xl ${currentRank.bgColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                        <Trophy className={`h-8 w-8 ${currentRank.color}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Rank</span>
                        <span className={`text-xl font-black ${currentRank.color} uppercase italic tracking-tight`}>
                        {currentRank.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${currentRank.id === 'promoter' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Next: {nextRank.name}</span>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2">
                        <ChevronUp className="w-4 h-4 text-slate-300 group-hover:text-slate-500 rotate-90" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div onClick={() => setActiveModal('earnings')} className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><DollarSign className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Earnings</p>
                            <p className="text-2xl font-black">€2,450.00</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => setActiveModal('career')} className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Target className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Daily Avg</p>
                            <p className="text-2xl font-black">{currentAvgSales} <span className="text-xs font-bold text-slate-300">/ {nextRank.targetAvg}</span></p>
                        </div>
                    </div>
                </div>
                <div onClick={() => setActiveModal('achievements')} className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Award className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Badges</p>
                            <p className="text-2xl font-black">Level 4</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent activity and stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Recent History</h3>
                        <BarChart3 className="w-4 h-4 text-slate-300" />
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {[1, 2, 3].map(i => (
                            <li key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><MapPin className="w-5 h-5" /></div>
                                    <div><p className="text-sm font-bold text-slate-900">Kirchberg Area {i}</p><p className="text-[10px] text-slate-400">Oct {20-i}, 2025</p></div>
                                </div>
                                <p className="text-sm font-black text-emerald-600">+€160.00</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Reach Distribution</h3>
                    <div className="space-y-4">
                        {['Box 1', 'Box 2', 'Box 3', 'Box 4'].map((box, i) => (
                            <div key={box} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>{box}</span><span>{100 - (i*15)}%</span></div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${100 - (i*15)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-24 w-24 rounded-3xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-2xl">
                        <Medal className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Luxembourg Top 50</h2>
                        <p className="text-indigo-300 font-bold text-sm">Monthly Leaderboard - October 2025</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Your Pos</p>
                                <p className="text-lg font-black text-white">#14 <span className="text-xs text-emerald-400">↑2</span></p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-slate-400">To Top 10</p>
                                <p className="text-lg font-black text-white">+12 Sales</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-16">Pos</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Worker</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Total Sales</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Avg / Day</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leaderboard.map((item, i) => (
                            <tr key={item.id} className={`hover:bg-indigo-50/30 transition-colors ${item.id === '4' ? 'bg-indigo-50/50' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-black">
                                        {i === 0 ? <span className="text-amber-500 text-lg">🥇</span> : i === 1 ? <span className="text-slate-400 text-lg">🥈</span> : i === 2 ? <span className="text-amber-700 text-lg">🥉</span> : `#${i+1}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">{item.avatar}</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{item.rank}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-black text-slate-900">{item.sales}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-black text-indigo-600">{item.avg}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tighter">Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:border-indigo-300 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{event.bonus}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-2">{event.title}</h3>
                        <div className="space-y-3 mt-auto">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                <Clock className="w-4 h-4" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • {event.time}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                <MapPin className="w-4 h-4" /> {event.location}
                            </div>
                        </div>
                        <button className="mt-8 w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">Confirm Presence</button>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-900 uppercase">Looking for more shifts?</h4>
                <p className="text-xs text-slate-500 mt-2">Contact your Pool Captain or Team Captain to request additional zones for the next week.</p>
            </div>
        </div>
      )}

      {/* Career Modal (shared) */}
      {activeModal === 'career' && (
        <Modal title="ProAgo Career Progression" onClose={() => setActiveModal(null)}>
           <div className="space-y-8">
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Current Status</p>
                       <h4 className="text-3xl font-black italic uppercase tracking-tight">{currentRank.name}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                       <Trophy className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-end text-xs mb-1">
                       <span className="font-bold text-indigo-200">Progress to {nextRank.name}</span>
                       <span className="font-mono text-indigo-100">{currentAvgSales} / {nextRank.targetAvg} avg</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/5">
                       <div 
                         className="bg-indigo-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(129,140,248,0.5)]" 
                         style={{ width: `${Math.min(100, (currentAvgSales / nextRank.targetAvg) * 100)}%` }}
                       ></div>
                    </div>
                 </div>
              </div>

              <div className="relative pt-4 pb-4">
                <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-slate-100"></div>
                <div className="space-y-10">
                  {rankLevels.map((rank, index) => {
                    const isUnlocked = index <= currentRankIndex;
                    const isCurrent = index === currentRankIndex;
                    const Icon = index === 0 ? Flag : index === rankLevels.length - 1 ? Trophy : Award;
                    
                    return (
                      <div key={rank.id} className={`relative flex items-center gap-6 ${!isUnlocked ? 'opacity-40' : ''}`}>
                         <div className={`z-10 h-14 w-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-all ${
                            isUnlocked ? `${rank.bgColor} scale-100` : 'bg-slate-200 grayscale scale-90'
                         } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                            <Icon className={`w-6 h-6 ${isUnlocked ? rank.color : 'text-slate-400'}`} />
                         </div>
                         <div className="flex-1">
                            <h5 className={`font-black uppercase italic tracking-tight ${isCurrent ? 'text-indigo-600' : 'text-slate-900'}`}>{rank.name}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Target: {rank.targetAvg} Avg/Day</p>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>
           </div>
        </Modal>
      )}

      {/* Additional Modals from existing build preserved */}
      {activeModal === 'earnings' && (
        <Modal title="Earnings Statistics" onClose={() => setActiveModal(null)}>
           <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl p-6 text-white">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Accumulated This Month</p>
                <p className="text-4xl font-bold">€2,450.00</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payout Schedule</p>
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span>Oct 28, 2025</span>
                    <span className="text-emerald-600">Pending</span>
                 </div>
              </div>
           </div>
        </Modal>
      )}
    </div>
  );
};

export default WorkerDashboard;
