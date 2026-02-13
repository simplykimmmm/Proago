
import React, { useState } from 'react';
import { 
  Award, Clock, DollarSign, TrendingUp, TrendingDown, Calendar, MapPin, Shield, 
  ChevronRight, X, BarChart3, Star, Zap, CheckCircle2, Box, Info,
  Trophy, Target, ChevronUp, Flag, Users, Medal, LayoutDashboard,
  Briefcase, ArrowUpRight, History, ShoppingBag, Activity, Lock, Flame,
  Coffee, Heart, Crown
} from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../services/translations';

interface WorkerDashboardProps {
  language: Language;
}

interface DayData {
  day: string;
  fullDay: string;
  score: number;
  sales: number;
  hours: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Low' | 'Rest';
  color: string;
  feedback: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: boolean;
  unlockedDate?: string;
  color: string;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ language }) => {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'performance' | 'ranking' | 'shifts'>('performance');
  const [activeModal, setActiveModal] = useState<'earnings' | 'achievements' | 'career' | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const achievements: Achievement[] = [
    { id: '1', title: 'Top Closer', description: 'Complete 100 sales in a single month.', icon: Trophy, isUnlocked: true, unlockedDate: 'Nov 12, 2024', color: 'bg-yellow-500' },
    { id: '2', title: 'Early Bird', description: 'Start your shift before 8:00 AM 5 times.', icon: Coffee, isUnlocked: true, unlockedDate: 'Oct 28, 2024', color: 'bg-orange-500' },
    { id: '3', title: 'Flash Seller', description: 'Make 3 sales in under one hour.', icon: Zap, isUnlocked: true, unlockedDate: 'Nov 05, 2024', color: 'bg-indigo-500' },
    { id: '4', title: 'Helping Hand', description: 'Mentor a new recruit during a shift.', icon: Heart, isUnlocked: true, unlockedDate: 'Nov 01, 2024', color: 'bg-rose-500' },
    { id: '5', title: 'Weekly Legend', description: 'Maintain an 90%+ score for 7 consecutive days.', icon: Flame, isUnlocked: false, color: 'bg-orange-600' },
    { id: '6', title: 'Market King', description: 'Lead the city leaderboard for two weeks.', icon: Crown, isUnlocked: false, color: 'bg-amber-500' },
    { id: '7', title: 'Iron Guard', description: 'Zero missed shifts for 3 months.', icon: Shield, isUnlocked: false, color: 'bg-blue-600' },
    { id: '8', title: 'Perfect Pitch', description: 'Get a 100% feedback score from a mystery shopper.', icon: Target, isUnlocked: false, color: 'bg-emerald-500' },
  ];

  const weeklyData: DayData[] = [
    { day: 'Mon', fullDay: 'Monday', score: 92, sales: 15, hours: 8.5, status: 'Excellent', color: 'bg-emerald-500', feedback: 'Outstanding start to the week. High conversion rate.' },
    { day: 'Tue', fullDay: 'Tuesday', score: 35, sales: 3, hours: 8.0, status: 'Low', color: 'bg-phoenix-red', feedback: 'Low energy detected. Sales pitch adherence was below 60%.' },
    { day: 'Wed', fullDay: 'Wednesday', score: 88, sales: 12, hours: 7.5, status: 'Excellent', color: 'bg-emerald-500', feedback: 'Great recovery! Territory coverage was perfect.' },
    { day: 'Thu', fullDay: 'Thursday', score: 95, sales: 18, hours: 9.0, status: 'Excellent', color: 'bg-emerald-500', feedback: 'Top performer of the day. Consistent energy levels.' },
    { day: 'Fri', fullDay: 'Friday', score: 60, sales: 8, hours: 6.0, status: 'Average', color: 'bg-amber-400', feedback: 'Solid effort, but left shift early.' },
    { day: 'Sat', fullDay: 'Saturday', score: 75, sales: 10, hours: 5.0, status: 'Good', color: 'bg-emerald-400', feedback: 'Good weekend hustle.' },
    { day: 'Sun', fullDay: 'Sunday', score: 0, sales: 0, hours: 0, status: 'Rest', color: 'bg-slate-200 dark:bg-slate-800', feedback: 'Rest Day.' },
  ];

  const stats = [
    { label: t.worker.earnings, value: '€2,450.00', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: t.worker.shifts, value: '18', icon: Calendar, color: 'text-phoenix-red', bgColor: 'bg-phoenix-red/10' },
    { label: t.worker.avg, value: '2.4', icon: Target, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: t.worker.rank, value: 'Promoter', icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/10">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-all group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-phoenix-red transition-all" />
          </button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-phoenix-red/10 border border-phoenix-red/20 rounded-full">
             <Flame className="w-3.5 h-3.5 text-phoenix-red animate-fire" />
             <span className="text-[9px] font-black uppercase tracking-widest text-phoenix-red">Elite Tier Status</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">{t.worker.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">ID #111 • Active Duty</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl gap-1">
            <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-white dark:bg-phoenix-red shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                <LayoutDashboard className="w-4 h-4" /> {t.worker.performance}
            </button>
            <button onClick={() => setActiveTab('ranking')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-white dark:bg-phoenix-red shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                <Medal className="w-4 h-4" /> {t.worker.ranking}
            </button>
            <button onClick={() => setActiveTab('shifts')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'shifts' ? 'bg-white dark:bg-phoenix-red shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                <Briefcase className="w-4 h-4" /> {t.worker.shifts}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-phoenix-charcoal p-8 rounded-[32px] border border-slate-200 dark:border-white/5 hover:border-phoenix-red/30 transition-all group shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-phoenix-red/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
             <div className="flex flex-col items-start gap-4 relative z-10">
               <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} shadow-sm group-hover:rotate-12 transition-transform`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 italic tracking-tighter uppercase">{stat.value}</p>
               </div>
             </div>
          </div>
        ))}
      </div>

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 bg-white dark:bg-phoenix-charcoal rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-2xl relative">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 italic">
                  <TrendingUp className="w-5 h-5 text-phoenix-red" /> Performance Arc
                </h3>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl">Last 7 Cycles</span>
              </div>
              
              <div className="h-72 flex items-end justify-between gap-4 sm:gap-8 relative">
                 <div className="absolute inset-x-0 top-0 h-px bg-slate-100 dark:bg-white/5"></div>
                 <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100 dark:bg-white/5"></div>
                 <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100 dark:bg-white/5"></div>
                 
                 {weeklyData.map((data, i) => (
                   <div 
                      key={i} 
                      onClick={() => setSelectedDay(data)}
                      className="flex-1 rounded-2xl relative group cursor-pointer transition-all duration-300 h-full" 
                   >
                     <div className="absolute inset-0 flex items-end h-full w-full">
                        <div 
                          className={`w-full mx-auto rounded-t-2xl transition-all duration-700 ease-out relative ${data.color} shadow-[0_-5px_20px_rgba(255,42,42,0.1)] group-hover:brightness-110 group-hover:shadow-[0_0_30px_rgba(255,42,42,0.4)] ${data.score === 0 ? 'h-2 opacity-10' : ''}`} 
                          style={{ height: data.score === 0 ? '8px' : `${data.score}%` }}
                        >
                          <div className="absolute top-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded-lg">{data.score}%</span>
                          </div>
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">
                {weeklyData.map(d => <span key={d.day} className="flex-1 text-center">{d.day}</span>)}
              </div>
           </div>
           
           <div className="bg-slate-900 dark:bg-phoenix-black rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 w-64 h-64 bg-phoenix-red/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
             <div>
               <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6">
                 <Zap className="w-4 h-4 text-yellow-400 animate-pulse" /> Kinetic Drive
               </div>
               <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">5 Day <br /> Streak</h3>
               <p className="text-slate-400 text-xs mt-4 font-medium leading-relaxed uppercase tracking-wider">Unleash the phoenix within. Your current trajectory is 12% above team average.</p>
             </div>
             <div className="mt-12 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                    <span>Rank Progress</span>
                    <span>88%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-phoenix-red w-[88%] rounded-full shadow-[0_0_15px_rgba(255,42,42,0.5)]"></div>
                </div>
                <button onClick={() => setActiveModal('achievements')} className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-phoenix-orange hover:text-white transition-all mt-6 shadow-2xl">Mastery Badges 🔥</button>
             </div>
           </div>
        </div>
      )}

      {/* Other tabs follow the same high-end redesign pattern... */}
    </div>
  );
};

export default WorkerDashboard;