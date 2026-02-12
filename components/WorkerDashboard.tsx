
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

  // Specific Pattern: Mon (Good), Tue (Bad), Wed/Thu (Good)
  // Updated colors to be lighter in light mode (400 instead of 500)
  const weeklyData: DayData[] = [
    { day: 'Mon', fullDay: 'Monday', score: 92, sales: 15, hours: 8.5, status: 'Excellent', color: 'bg-emerald-400 dark:bg-emerald-500', feedback: 'Outstanding start to the week. High conversion rate.' },
    { day: 'Tue', fullDay: 'Tuesday', score: 35, sales: 3, hours: 8.0, status: 'Low', color: 'bg-rose-400 dark:bg-rose-500', feedback: 'Low energy detected. Sales pitch adherence was below 60%.' },
    { day: 'Wed', fullDay: 'Wednesday', score: 88, sales: 12, hours: 7.5, status: 'Excellent', color: 'bg-emerald-400 dark:bg-emerald-500', feedback: 'Great recovery! Territory coverage was perfect.' },
    { day: 'Thu', fullDay: 'Thursday', score: 95, sales: 18, hours: 9.0, status: 'Excellent', color: 'bg-emerald-500 dark:bg-emerald-400', feedback: 'Top performer of the day. Consistent energy levels.' },
    { day: 'Fri', fullDay: 'Friday', score: 60, sales: 8, hours: 6.0, status: 'Average', color: 'bg-amber-300 dark:bg-amber-400', feedback: 'Solid effort, but left shift early.' },
    { day: 'Sat', fullDay: 'Saturday', score: 75, sales: 10, hours: 5.0, status: 'Good', color: 'bg-emerald-300 dark:bg-emerald-600', feedback: 'Good weekend hustle.' },
    { day: 'Sun', fullDay: 'Sunday', score: 0, sales: 0, hours: 0, status: 'Rest', color: 'bg-slate-200 dark:bg-slate-800', feedback: 'Rest Day.' },
  ];

  const stats = [
    { label: t.worker.earnings, value: '€2,450.00', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: t.worker.shifts, value: '18', icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: t.worker.avg, value: '2.4', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: t.worker.rank, value: 'Promoter', icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const shifts = [
    { id: 1, location: 'Cloche d\'Or, Luxembourg', date: '2024-11-15', time: '10:00 - 18:00', type: 'D2D Sales', status: 'Upcoming' },
    { id: 2, location: 'Kirchberg Shopping', date: '2024-11-12', time: '09:00 - 17:00', type: 'Event Promotion', status: 'Completed' },
    { id: 3, location: 'Esch-sur-Alzette Center', date: '2024-11-10', time: '11:00 - 19:00', type: 'Lead Gen', status: 'Completed' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Jean-Pierre M.', score: 98, avatar: 'JP' },
    { rank: 2, name: 'Sarah W.', score: 94, avatar: 'SW' },
    { rank: 3, name: 'You', score: 88, avatar: 'ME' },
    { rank: 4, name: 'Marco V.', score: 85, avatar: 'MV' },
  ];

  const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-white/20">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-all group-hover:rotate-90" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">{t.worker.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Worker #111 • ProAgo World</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
            <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                <LayoutDashboard className="w-4 h-4" /> {t.worker.performance}
            </button>
            <button onClick={() => setActiveTab('ranking')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                <Medal className="w-4 h-4" /> {t.worker.ranking}
            </button>
            <button onClick={() => setActiveTab('shifts')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'shifts' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                <Briefcase className="w-4 h-4" /> {t.worker.shifts}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group cursor-default">
             <div className="flex items-center gap-4">
               <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
               </div>
             </div>
          </div>
        ))}
      </div>

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Weekly Trends
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Tap bars for details</span>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6">
                 {weeklyData.map((data, i) => (
                   <div 
                      key={i} 
                      onClick={() => setSelectedDay(data)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl relative group overflow-hidden cursor-pointer hover:shadow-md hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-900 transition-all duration-300" 
                      style={{ height: '100%' }}
                   >
                     {/* Hover Tooltip/Label */}
                     <div className="absolute top-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 z-10 transition-opacity">
                        <span className="text-[10px] font-black text-white bg-slate-900/80 dark:bg-indigo-600/90 px-2 py-0.5 rounded-full backdrop-blur-sm">{data.score}%</span>
                     </div>
                     
                     <div className="absolute inset-0 flex items-end h-full w-full">
                        <div 
                          className={`w-full mx-auto rounded-t-2xl transition-all duration-700 ease-out relative ${data.color} ${data.score === 0 ? 'h-1 opacity-20' : ''}`} 
                          style={{ height: data.score === 0 ? '4px' : `${data.score}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl"></div>
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                {weeklyData.map(d => <span key={d.day} className="flex-1 text-center">{d.day}</span>)}
              </div>
           </div>
           
           <div className="bg-indigo-900 dark:bg-indigo-950 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <div>
               <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                 <Zap className="w-3 h-3 text-yellow-400" /> Current Streak
               </div>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase">5 Days Active</h3>
               <p className="text-indigo-200 text-xs mt-2 font-medium">Keep it up to earn the "Consistent" badge!</p>
             </div>
             <button onClick={() => setActiveModal('achievements')} className="w-full py-4 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors mt-8">View Achievements</button>
           </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest italic">{t.worker.leaderboard}</h3>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {leaderboard.map((user) => (
               <div key={user.rank} className={`p-6 flex items-center justify-between ${user.name === 'You' ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}>
                 <div className="flex items-center gap-6">
                   <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg shadow-sm ${
                     user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                     user.rank === 2 ? 'bg-slate-200 text-slate-700' :
                     user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                     'bg-slate-100 text-slate-500'
                   }`}>
                     {user.rank}
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs text-center leading-none">
                       {user.avatar}
                     </div>
                     <span className={`font-bold ${user.name === 'You' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{user.name}</span>
                 </div>
                 </div>
                 <div className="text-right">
                   <span className="block text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">{user.score}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts.map(shift => (
            <div key={shift.id} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   shift.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                 }`}>
                   {shift.status}
                 </span>
                 <Briefcase className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
               </div>
               <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{shift.location}</h4>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6">{shift.type}</p>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                   <Calendar className="w-4 h-4" /> {shift.date}
                 </div>
                 <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                   <Clock className="w-4 h-4" /> {shift.time}
                 </div>
               </div>
            </div>
          ))}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer group min-h-[250px]">
             <History className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-black uppercase tracking-widest">View Past Shifts</span>
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {selectedDay && (
        <Modal title={selectedDay.fullDay} onClose={() => setSelectedDay(null)}>
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${selectedDay.color}`}>
                   {selectedDay.status === 'Excellent' || selectedDay.status === 'Good' ? <TrendingUp className="w-8 h-8" /> : 
                    selectedDay.status === 'Rest' ? <Clock className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white italic">{selectedDay.score}%</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency Score</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                selectedDay.status === 'Low' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                selectedDay.status === 'Rest' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                {selectedDay.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sales</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{selectedDay.sales}</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Hours</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{selectedDay.hours}h</span>
               </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <h5 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Manager Feedback
              </h5>
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 italic leading-relaxed">
                "{selectedDay.feedback}"
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Achievements Modal Content */}
      {activeModal === 'achievements' && (
        <Modal title="Your Achievements" onClose={() => setActiveModal(null)}>
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Progress</span>
                 <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">4 / 8 Unlocked</span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-1/2 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`relative p-5 rounded-[24px] border transition-all duration-300 ${
                    achievement.isUnlocked 
                      ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl flex-shrink-0 relative ${
                      achievement.isUnlocked ? `${achievement.color} shadow-lg text-white` : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                    }`}>
                      <achievement.icon className="w-6 h-6" />
                      {!achievement.isUnlocked && (
                         <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-700 rounded-full p-0.5 shadow-sm">
                            <Lock className="w-3 h-3 text-slate-400" />
                         </div>
                      )}
                    </div>
                    <div>
                       <h5 className={`text-sm font-black uppercase tracking-tight italic ${
                         achievement.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                       }`}>
                         {achievement.title}
                       </h5>
                       <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                         {achievement.description}
                       </p>
                       {achievement.isUnlocked && achievement.unlockedDate && (
                         <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{achievement.unlockedDate}</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {activeModal && activeModal !== 'achievements' && <Modal title={activeModal === 'earnings' ? t.worker.earnings : activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default WorkerDashboard;
