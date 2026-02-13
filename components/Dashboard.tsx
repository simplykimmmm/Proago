
import React, { useEffect, useState, useRef } from 'react';
import { Lead, LeadStatus, LeadFormData, Priority, Task, Language } from '../types';
import { fetchLeads, updateLead, deleteLead, submitLead } from '../services/leadService';
import { analyzeCV } from '../services/geminiService';
import { 
    Loader2, AlertCircle, Filter, Search, Clock, ArrowUpDown, Pencil, Check, X, 
    Briefcase, UserCheck, GraduationCap, Users, XCircle, Trash2, Plus, Calendar, 
    LayoutGrid, List as ListIcon, BarChart3, CheckSquare, Square, FileText, Send, Mail, MessageSquare,
    Phone, GripVertical, Copy, ExternalLink, TrendingUp, ChevronRight, Sparkles, BrainCircuit, FileUp, Flame
} from 'lucide-react';
import { useTranslation } from '../services/translations';

type DashboardView = 'PIPELINE_LIST' | 'PIPELINE_BOARD' | 'PLANNING' | 'METRICS';

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = useTranslation(language);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState<DashboardView>('PIPELINE_BOARD');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<LeadStatus | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    const { data } = await fetchLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      const result = await updateLead(id, { status: newStatus });
      if (!result.success) loadLeads();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingLead) return;
      setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
      setIsEditModalOpen(false);
      await updateLead(editingLead.id, editingLead);
      setEditingLead(null);
  };

  const handleCvUploadForLead = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingLead) {
      const file = e.target.files[0];
      setIsAnalyzing(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result as string;
          const analysis = await analyzeCV(base64, editingLead.postAppliedFor);
          setEditingLead({
            ...editingLead,
            cvBase64: base64,
            cvFileName: file.name,
            aiScore: analysis.score,
            aiSummary: analysis.summary
          });
          setIsAnalyzing(false);
        };
      } catch (err) {
        console.error("AI Analysis failed:", err);
        setIsAnalyzing(false);
      }
    }
  };

  const filteredLeads = React.useMemo(() => {
    let result = [...leads];
    if (filter) {
        const lower = filter.toLowerCase();
        result = result.filter(l => l.fullName.toLowerCase().includes(lower) || l.email.toLowerCase().includes(lower) || l.postAppliedFor.toLowerCase().includes(lower));
    }
    result.sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (a.priority !== 'High' && b.priority === 'High') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [leads, filter]);

  const PriorityBadge = ({ priority }: { priority: Priority }) => {
      const colors = { 
        'High': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', 
        'Medium': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800', 
        'Low': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700' 
      };
      return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${colors[priority]}`}>{priority}</span>;
  };

  const ScoreBadge = ({ score, aiScore }: { score: number, aiScore?: number }) => {
      const color = score >= 80 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : score >= 50 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-600 dark:text-slate-400';
      return (
        <div className="flex flex-col items-center sm:items-start">
          <div className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>Score: {Math.round(score)}</div>
          {aiScore !== undefined && (
            <div className="flex items-center gap-1 text-[8px] text-phoenix-red dark:text-phoenix-red font-black uppercase tracking-widest mt-0.5">
              <Sparkles className="w-2.5 h-2.5" /> AI: {aiScore}%
            </div>
          )}
        </div>
      );
  };

  const KanbanColumn = ({ status, title, icon: Icon }: { status: LeadStatus, title: string, icon: any }) => {
      const columnLeads = filteredLeads.filter(l => l.status === status);
      const isOver = dropTargetStatus === status;

      return (
          <div 
            className={`flex-1 min-w-[320px] rounded-[32px] flex flex-col h-full max-h-full border-2 transition-all duration-300 ease-out ${
              isOver 
                ? 'bg-phoenix-red/5 dark:bg-phoenix-red/5 border-phoenix-red shadow-2xl scale-[1.01] ring-8 ring-phoenix-red/5' 
                : 'bg-slate-50 dark:bg-phoenix-charcoal border-slate-200 dark:border-white/5'
            }`} 
            onDragEnter={(e) => { e.preventDefault(); setDropTargetStatus(status); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => { e.preventDefault(); if (dropTargetStatus === status) setDropTargetStatus(null); }}
            onDrop={async (e) => {
              e.preventDefault();
              setDropTargetStatus(null);
              if (draggedLeadId) await handleStatusChange(draggedLeadId, status);
            }}
          >
              <div className={`p-5 border-b-2 flex justify-between items-center rounded-t-[32px] ${
                isOver ? 'bg-white dark:bg-slate-800 border-phoenix-red' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5'
              }`}>
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isOver ? 'bg-phoenix-red text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-900 dark:text-white italic">{title}</h3>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full">
                    {columnLeads.length}
                  </span>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                  {columnLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable 
                        onDragStart={() => setDraggedLeadId(lead.id)}
                        onDragEnd={() => setDraggedLeadId(null)}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 border-slate-50 dark:border-white/5 cursor-grab active:cursor-grabbing hover:border-phoenix-red dark:hover:border-phoenix-red transition-all group" 
                        onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }}
                      >
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-col">
                                <h4 className="font-black text-slate-900 dark:text-white text-sm group-hover:text-phoenix-red transition-colors uppercase tracking-tight italic">{lead.fullName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{lead.postAppliedFor}</p>
                              </div>
                              <PriorityBadge priority={lead.priority} />
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-white/5">
                              <ScoreBadge score={lead.score} aiScore={lead.aiScore} />
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 shrink-0 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-phoenix-red/10 border border-phoenix-red/20 rounded-full mb-3">
             <Flame className="w-3.5 h-3.5 text-phoenix-red animate-fire" />
             <span className="text-[9px] font-black uppercase tracking-widest text-phoenix-red">Global Pipeline Oversight</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">APPLICANTS HUB</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl shadow-sm self-start md:self-auto">
             <button onClick={() => setViewMode('PIPELINE_BOARD')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'PIPELINE_BOARD' ? 'bg-slate-900 dark:bg-phoenix-red text-white shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}><LayoutGrid className="w-4 h-4" /> {t.dashboard.board}</button>
             <button onClick={() => setViewMode('PIPELINE_LIST')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'PIPELINE_LIST' ? 'bg-slate-900 dark:bg-phoenix-red text-white shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}><ListIcon className="w-4 h-4" /> {t.dashboard.list}</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 shrink-0 gap-4">
        <div className="w-full sm:max-w-xs relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4"><Search className="h-4 w-4 text-slate-400 group-focus-within:text-phoenix-red transition-colors" /></div>
            <input type="text" className="block w-full rounded-2xl border-slate-200 dark:border-white/10 pl-11 focus:ring-2 focus:ring-phoenix-red focus:border-transparent py-3.5 border bg-white dark:bg-phoenix-charcoal text-slate-900 dark:text-white transition-all font-medium text-sm" placeholder={t.dashboard.search} value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <button onClick={() => (window as any).handleAction?.()} className="w-full sm:w-auto ml-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-phoenix-red text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl text-white hover:bg-phoenix-orange transition-all hover:scale-[1.02] italic"><Plus className="h-4 w-4 mr-2" /> Register Talent</button>
      </div>

      {viewMode === 'PIPELINE_BOARD' && (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-6 custom-scrollbar">
            <div className="flex h-full gap-8 min-w-[1600px] px-1 py-1">
              <KanbanColumn status="Lead" title={t.dashboard.stages.lead} icon={Briefcase} />
              <KanbanColumn status="Interviewing" title={t.dashboard.stages.interviewing} icon={UserCheck} />
              <KanbanColumn status="Formation" title={t.dashboard.stages.formation} icon={GraduationCap} />
              <KanbanColumn status="Recruiter" title={t.dashboard.stages.recruiter} icon={Users} />
              <KanbanColumn status="Rejected" title={t.dashboard.stages.rejected} icon={XCircle} />
            </div>
          </div>
      )}

      {viewMode === 'PIPELINE_LIST' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pb-10">
            {(['Lead', 'Interviewing', 'Formation', 'Recruiter', 'Rejected'] as LeadStatus[]).map((status) => {
              const leadsInStatus = filteredLeads.filter(l => l.status === status);
              if (leadsInStatus.length === 0) return null;
              
              const statusColors: Record<string, string> = {
                'Lead': 'bg-blue-500', 'Interviewing': 'bg-phoenix-red', 'Formation': 'bg-emerald-500', 'Recruiter': 'bg-amber-500', 'Rejected': 'bg-rose-500'
              };

              return (
                <div key={status} className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/80 dark:bg-phoenix-black/80 backdrop-blur-md py-3 z-10 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-6 rounded-full ${statusColors[status]}`}></div>
                      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white italic">
                        {status.toUpperCase()}
                      </h2>
                      <span className="text-[10px] font-black px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-full">{leadsInStatus.length}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-phoenix-charcoal rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
                        <thead className="bg-slate-50/50 dark:bg-white/5">
                          <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant</th>
                            <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                            <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Scores</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {leadsInStatus.map(lead => (
                            <tr key={lead.id} onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }} className="hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-all group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="h-11 w-11 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white text-sm font-black italic shadow-lg group-hover:rotate-6 transition-transform">
                                    {lead.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-phoenix-red transition-colors">{lead.fullName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{lead.postAppliedFor}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-6 text-center"><PriorityBadge priority={lead.priority} /></td>
                              <td className="px-6 py-6"><div className="flex justify-center"><ScoreBadge score={lead.score} aiScore={lead.aiScore} /></div></td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-phoenix-red transition-all" />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      )}

      {isEditModalOpen && editingLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/5 scale-in">
                  <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-3xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white text-3xl font-black italic shadow-2xl transform -rotate-3">{editingLead.fullName.charAt(0)}</div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{editingLead.fullName}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">ID: #{editingLead.id.slice(-6).toUpperCase()} • PROAGO ELITE</p>
                      </div>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-white/5 group"><X className="w-6 h-6 text-slate-400 group-hover:text-phoenix-red transition-all" /></button>
                  </div>
                  
                  <div className="p-10 overflow-y-auto space-y-12 custom-scrollbar">
                      {editingLead.aiSummary && (
                        <div className="bg-phoenix-red/5 dark:bg-phoenix-red/5 border-2 border-phoenix-red/20 rounded-[32px] p-8 shadow-inner relative overflow-hidden">
                           <div className="absolute top-2 right-4 flex items-center gap-1.5 opacity-50">
                              <BrainCircuit className="w-4 h-4 text-phoenix-red" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-phoenix-red">Gemini AI Engine</span>
                           </div>
                           <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-w-[120px] border border-phoenix-red/10">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Role Match</span>
                                 <span className="text-4xl font-black text-phoenix-red italic leading-none">{editingLead.aiScore}%</span>
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                                   <Sparkles className="w-4 h-4 text-phoenix-orange" /> {t.dashboard.profile.insights}
                                 </h4>
                                 <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"{editingLead.aiSummary}"</p>
                              </div>
                           </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-8 p-10 bg-slate-900 dark:bg-phoenix-black rounded-[32px] items-center justify-between text-white shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-phoenix-red/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                          <div className="flex gap-12 items-center relative z-10">
                            <div className="text-center">
                              <span className="block text-[10px] font-black text-phoenix-red uppercase tracking-widest mb-3">Overall Potential</span>
                              <span className="text-6xl font-black text-white tracking-tighter italic leading-none">{Math.round(editingLead.score)}</span>
                            </div>
                            <div className="h-16 w-px bg-white/10"></div>
                            <div className="text-center">
                              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Priority Level</span>
                              <div className="mt-1"><PriorityBadge priority={editingLead.priority} /></div>
                            </div>
                          </div>
                          {editingLead.cvBase64 && (
                            <button onClick={() => {
                              const win = window.open();
                              win?.document.write(`<iframe src="${editingLead.cvBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                            }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md relative z-10 italic">
                              <FileText className="w-4 h-4 text-phoenix-red" /> Inspect Original Document
                            </button>
                          )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center mb-8 border-l-4 border-phoenix-red pl-4 italic">Verified Channels</h3>
                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-phoenix-red/30 transition-all">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Identity</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{editingLead.email}</span>
                                        <button onClick={() => navigator.clipboard.writeText(editingLead.email)} className="p-2 hover:bg-phoenix-red/10 rounded-lg text-slate-400 hover:text-phoenix-red transition-colors"><Copy className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-phoenix-red/30 transition-all">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cellular Contact</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{editingLead.phone}</span>
                                        <button onClick={() => navigator.clipboard.writeText(editingLead.phone)} className="p-2 hover:bg-phoenix-red/10 rounded-lg text-slate-400 hover:text-phoenix-red transition-colors"><Copy className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center mb-8 border-l-4 border-phoenix-red pl-4 italic">Engagement Engine</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <button className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-900 dark:bg-slate-800 rounded-3xl hover:bg-phoenix-red transition-all group shadow-xl italic">
                                 <Mail className="w-6 h-6 text-phoenix-red group-hover:text-white transition-colors" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Send Email</span>
                               </button>
                               <button className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-900 dark:bg-slate-800 rounded-3xl hover:bg-phoenix-red transition-all group shadow-xl italic">
                                 <MessageSquare className="w-6 h-6 text-phoenix-red group-hover:text-white transition-colors" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Send SMS</span>
                               </button>
                            </div>
                        </div>
                      </div>
                  </div>
                  <div className="p-10 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-end gap-6 shrink-0">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t.dashboard.profile.discard}</button>
                    <button type="button" onClick={handleEditSubmit} className="px-12 py-4 text-[11px] font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-phoenix-red rounded-2xl hover:bg-phoenix-orange shadow-2xl transition-all italic">Execute Update</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
