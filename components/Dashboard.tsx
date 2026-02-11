
import React, { useEffect, useState } from 'react';
import { Lead, LeadStatus, LeadFormData, Priority, Task } from '../types';
import { fetchLeads, updateLead, deleteLead, submitLead } from '../services/leadService';
/* Added TrendingUp and ChevronRight to the lucide-react imports */
import { 
    Loader2, AlertCircle, Filter, Search, Clock, ArrowUpDown, Pencil, Check, X, 
    Briefcase, UserCheck, GraduationCap, Users, XCircle, Trash2, Plus, Calendar, 
    LayoutGrid, List as ListIcon, BarChart3, CheckSquare, Square, FileText, Send, Mail, MessageSquare,
    Phone, GripVertical, Copy, ExternalLink, TrendingUp, ChevronRight
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';

type SortConfig = {
    key: 'createdAt' | 'status' | 'score';
    direction: 'asc' | 'desc';
} | null;

type DashboardView = 'PIPELINE_LIST' | 'PIPELINE_BOARD' | 'PLANNING' | 'METRICS';

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [viewMode, setViewMode] = useState<DashboardView>('PIPELINE_BOARD');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<LeadStatus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

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

  const handleBatchDelete = async () => {
      if (!window.confirm(`Delete ${selectedLeads.size} leads?`)) return;
      const idsToDelete = Array.from(selectedLeads) as string[];
      setLeads(prev => prev.filter(l => !selectedLeads.has(l.id)));
      setSelectedLeads(new Set());
      for (const id of idsToDelete) await deleteLead(id);
  };

  const handleBatchStatus = async (status: LeadStatus) => {
      const ids = Array.from(selectedLeads) as string[];
      setLeads(prev => prev.map(l => selectedLeads.has(l.id) ? { ...l, status } : l));
      setSelectedLeads(new Set());
      for (const id of ids) await updateLead(id, { status });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingLead) return;
      setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
      setIsEditModalOpen(false);
      await updateLead(editingLead.id, editingLead);
      setEditingLead(null);
  };

  const addTask = () => {
      if (!editingLead || !newTaskText.trim()) return;
      const newTask: Task = { id: Date.now().toString(), text: newTaskText, isCompleted: false, createdAt: new Date().toISOString() };
      setEditingLead({ ...editingLead, tasks: [newTask, ...editingLead.tasks] });
      setNewTaskText('');
  };

  const toggleTask = (taskId: string) => {
      if (!editingLead) return;
      setEditingLead({ ...editingLead, tasks: editingLead.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) });
  };

  const removeTask = (taskId: string) => {
      if (!editingLead) return;
      setEditingLead({ ...editingLead, tasks: editingLead.tasks.filter(t => t.id !== taskId) });
  };

  const viewCV = (lead: Lead) => {
      if (!lead.cvBase64) return;
      const win = window.open();
      if (win) {
          win.document.write(`<iframe src="${lead.cvBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
  };

  const sendPersonalizedEmail = (lead: Lead) => {
      const subject = encodeURIComponent(`Regarding your application for ${lead.postAppliedFor} at ProAgo`);
      const body = encodeURIComponent(`Hi ${lead.fullName},\n\nThis is the recruitment team from ProAgo World. We were impressed by your profile submitted via ${lead.source}.\n\nWe would like to invite you for a first interview. Please let us know when you are available this week.\n\nBest regards,\nProAgo Recruitment`);
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  const sendPersonalizedSMS = (lead: Lead) => {
      const body = encodeURIComponent(`Hi ${lead.fullName}, this is ProAgo World. We loved your application for ${lead.postAppliedFor}! Would you be free for a quick call today?`);
      window.location.href = `sms:${lead.phone}?body=${body}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
      const colors = { 'High': 'bg-red-100 text-red-700 border-red-200', 'Medium': 'bg-orange-100 text-orange-700 border-orange-200', 'Low': 'bg-slate-100 text-slate-600 border-slate-200' };
      return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[priority]}`}>{priority}</span>;
  };

  const ScoreBadge = ({ score }: { score: number }) => {
      const color = score >= 80 ? 'text-green-600 font-bold' : score >= 50 ? 'text-yellow-600 font-medium' : 'text-slate-600';
      return <div className={`text-xs ${color}`}>Score: {score}</div>
  };

  const KanbanColumn = ({ status, title, icon: Icon }: { status: LeadStatus, title: string, icon: any }) => {
      const columnLeads = filteredLeads.filter(l => l.status === status);
      const isOver = dropTargetStatus === status;

      return (
          <div 
            className={`flex-1 min-w-[300px] rounded-xl flex flex-col h-full max-h-full border transition-all duration-200 ${
              isOver ? 'bg-indigo-50 border-indigo-300 scale-[1.01]' : 'bg-slate-50 border-slate-200'
            }`} 
            onDragOver={(e) => {
              e.preventDefault();
              setDropTargetStatus(status);
            }}
            onDragLeave={() => setDropTargetStatus(null)}
            onDrop={async (e) => {
              e.preventDefault();
              setDropTargetStatus(null);
              if (draggedLeadId) {
                await handleStatusChange(draggedLeadId, status);
                setDraggedLeadId(null);
              }
            }}
          >
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
                  <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isOver ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <h3 className={`font-bold text-sm ${isOver ? 'text-indigo-900' : 'text-slate-700'}`}>{title}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{columnLeads.length}</span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable 
                        onDragStart={(e) => {
                          setDraggedLeadId(lead.id);
                          e.dataTransfer.effectAllowed = 'move';
                          // Add a slight delay for better click/drag separation
                          setTimeout(() => {
                            if (e.target instanceof HTMLElement) e.target.style.opacity = '0.5';
                          }, 0);
                        }}
                        onDragEnd={(e) => {
                          if (e.target instanceof HTMLElement) e.target.style.opacity = '1';
                          setDraggedLeadId(null);
                        }}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative ${
                          draggedLeadId === lead.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                        }`} 
                        onClick={() => { 
                          setEditingLead(lead); 
                          setIsEditModalOpen(true); 
                        }}
                      >
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{lead.fullName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{lead.postAppliedFor}</p>
                              </div>
                              <PriorityBadge priority={lead.priority} />
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                            <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> <span className="truncate max-w-[100px]">{lead.email.split('@')[0]}</span></div>
                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> <span>...{lead.phone.slice(-4)}</span></div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                              <div className="flex gap-2 items-center">
                                <ScoreBadge score={lead.score} />
                                {lead.cvBase64 && <span title="CV Attached"><FileText className="w-3 h-3 text-indigo-400" /></span>}
                              </div>
                              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase"><Clock className="w-3 h-3 mr-1" />{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                          </div>
                          
                          {/* Visual Handle Icon */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-slate-300" />
                          </div>
                      </div>
                  ))}
                  {columnLeads.length === 0 && !isOver && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl h-24 flex items-center justify-center text-slate-400 text-xs italic">
                      Empty column
                    </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 shrink-0 gap-4">
        <div><h1 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Applicants Hub</h1><p className="text-slate-500 text-sm">Managing Luxembourg's top sales talent.</p></div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm self-start md:self-auto">
             <button onClick={() => setViewMode('PIPELINE_BOARD')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase ${viewMode === 'PIPELINE_BOARD' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid className="w-3 h-3" /> Board</button>
             <button onClick={() => setViewMode('PIPELINE_LIST')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase ${viewMode === 'PIPELINE_LIST' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}><ListIcon className="w-3 h-3" /> List</button>
             <div className="w-px h-4 bg-slate-200 mx-1"></div>
             <button onClick={() => setViewMode('METRICS')} className={`p-2 rounded-lg transition-all ${viewMode === 'METRICS' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}><BarChart3 className="w-4 h-4" /></button>
        </div>
      </div>

      {(viewMode === 'PIPELINE_LIST' || viewMode === 'PIPELINE_BOARD') && (
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 shrink-0 gap-4">
            <div className="w-full sm:max-w-xs relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-4 w-4 text-slate-400" /></div>
                <input type="text" className="block w-full rounded-xl border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border bg-white" placeholder="Search talent..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            {selectedLeads.size > 0 && (
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 animate-fade-in shadow-sm">
                    <span className="text-xs font-bold text-indigo-700">{selectedLeads.size} Selected</span>
                    <button onClick={handleBatchDelete} className="p-1.5 hover:bg-white rounded-lg text-indigo-600 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="h-4 w-px bg-indigo-200"></div>
                    <select onChange={(e) => handleBatchStatus(e.target.value as LeadStatus)} className="text-xs border-none bg-transparent text-indigo-700 font-black uppercase focus:ring-0 cursor-pointer p-0 pr-4" defaultValue=""><option value="" disabled>Move...</option><option value="Lead">Lead</option><option value="Interviewing">Interviewing</option><option value="Formation">Formation</option><option value="Recruiter">Recruiter</option></select>
                </div>
            )}
            <button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto ml-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold uppercase rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"><Plus className="h-4 w-4 mr-2" /> New Applicant</button>
         </div>
      )}

      {viewMode === 'PIPELINE_BOARD' && (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
            <div className="flex h-full gap-5 min-w-[1500px]">
              <KanbanColumn status="Lead" title="Incoming" icon={Briefcase} />
              <KanbanColumn status="Interviewing" title="Interviewing" icon={UserCheck} />
              <KanbanColumn status="Formation" title="Formation" icon={GraduationCap} />
              <KanbanColumn status="Recruiter" title="Recruiters" icon={Users} />
              <KanbanColumn status="Rejected" title="Rejected" icon={XCircle} />
            </div>
          </div>
      )}

      {viewMode === 'PIPELINE_LIST' && (
          <div className="flex-1 overflow-auto bg-white shadow-xl rounded-2xl border border-slate-200 custom-scrollbar">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-4 text-left"><input type="checkbox" className="rounded-lg border-slate-300 text-indigo-600" onChange={(e) => setSelectedLeads(e.target.checked ? new Set(filteredLeads.map(l => l.id)) : new Set())} checked={filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length} /></th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicant</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">CV</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied On</th>
                    <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                   {filteredLeads.map(lead => (
                       <tr key={lead.id} className="hover:bg-indigo-50/30 transition-colors group">
                           <td className="px-4 py-4 whitespace-nowrap"><input type="checkbox" className="rounded-lg border-slate-300 text-indigo-600" checked={selectedLeads.has(lead.id)} onChange={(e) => { const newSet = new Set(selectedLeads); if (e.target.checked) newSet.add(lead.id); else newSet.delete(lead.id); setSelectedLeads(newSet); }} /></td>
                           <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }}><div className="flex items-center"><div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs mr-4 shadow-sm">{lead.fullName.charAt(0)}</div><div><div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.fullName}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lead.postAppliedFor}</div></div></div></td>
                           <td className="px-6 py-4 whitespace-nowrap"><select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)} className="text-[10px] font-bold uppercase tracking-widest rounded-lg border-0 py-1.5 bg-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="Lead">Lead</option><option value="Interviewing">Interview</option><option value="Formation">Formation</option><option value="Recruiter">Recruiter</option><option value="Rejected">Rejected</option></select></td>
                           <td className="px-6 py-4 whitespace-nowrap"><PriorityBadge priority={lead.priority} /></td>
                           <td className="px-6 py-4 whitespace-nowrap">{lead.cvBase64 ? <button onClick={(e) => { e.stopPropagation(); viewCV(lead); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><FileText className="w-4 h-4" /></button> : <span className="text-slate-300 text-xs">-</span>}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">{new Date(lead.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 font-bold uppercase text-[10px] tracking-widest">Details</button></td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
      )}

      {viewMode === 'METRICS' && (
          <div className="flex-1 overflow-auto p-1 animate-fade-in"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"><div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group"><div className="absolute top-0 right-0 h-1 w-full bg-slate-900"></div><h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Applicants</h3><p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{leads.length}</p><div className="mt-4 flex items-center text-xs font-bold text-emerald-600"><TrendingUp className="w-3 h-3 mr-1" /> +4 this week</div></div><div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group"><div className="absolute top-0 right-0 h-1 w-full bg-emerald-500"></div><h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Conversion Rate</h3><p className="text-4xl font-black text-emerald-600 mt-2 tracking-tighter">{leads.length ? Math.round((leads.filter(l => l.status === 'Recruiter').length / leads.length) * 100) : 0}%</p><div className="mt-4 flex items-center text-xs font-bold text-slate-400">Target: 15%</div></div><div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group"><div className="absolute top-0 right-0 h-1 w-full bg-indigo-500"></div><h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Avg. Talent Score</h3><p className="text-4xl font-black text-indigo-600 mt-2 tracking-tighter">{leads.length ? Math.round(leads.reduce((acc: number, curr) => acc + curr.score, 0) / leads.length) : 0}</p><div className="mt-4 flex items-center text-xs font-bold text-indigo-400">High Quality Pool</div></div></div></div>
      )}

      {isEditModalOpen && editingLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
              <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col scale-in">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black italic">{editingLead.fullName.charAt(0)}</div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-none">{editingLead.fullName}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Candidate Profile #{editingLead.id.slice(-4)}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X className="w-6 h-6 text-slate-400" /></button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                      {/* Header Overview */}
                      <div className="flex gap-6 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 items-center justify-between">
                          <div className="flex gap-8 items-center">
                            <div className="text-center group">
                              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Talent Score</span>
                              <span className="text-3xl font-black text-indigo-600 tracking-tighter group-hover:scale-110 transition-transform block">{editingLead.score}</span>
                            </div>
                            <div className="h-12 w-px bg-indigo-200"></div>
                            <div className="text-center">
                              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal Stage</span>
                              <div className="mt-1"><PriorityBadge priority={editingLead.priority} /></div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                             {editingLead.cvBase64 && (
                                <button onClick={() => viewCV(editingLead)} className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-200 text-xs font-black uppercase shadow-sm group">
                                  <FileText className="w-4 h-4 group-hover:scale-110" /> View CV Document
                                </button>
                             )}
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center mb-6"><Phone className="w-4 h-4 mr-2 text-indigo-600" /> Contact Details</h3>
                            <div className="space-y-4">
                                <div className="group relative bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Email Address</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-800 break-all">{editingLead.email}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => copyToClipboard(editingLead.email)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600"><Copy className="w-3.5 h-3.5" /></button>
                                            <a href={`mailto:${editingLead.email}`} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600"><ExternalLink className="w-3.5 h-3.5" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="group relative bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Phone Number</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-800">{editingLead.phone}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => copyToClipboard(editingLead.phone)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600"><Copy className="w-3.5 h-3.5" /></button>
                                            <a href={`tel:${editingLead.phone}`} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600"><Phone className="w-3.5 h-3.5" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outreach Hub Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center mb-6"><Send className="w-4 h-4 mr-2 text-indigo-600" /> Quick Actions</h3>
                            <div className="space-y-4">
                                <button onClick={() => sendPersonalizedEmail(editingLead)} className="w-full flex items-center justify-between gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all shadow-sm group">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-slate-900">Email Invitation</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold">Standard ProAgo Template</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                                </button>
                                <button onClick={() => sendPersonalizedSMS(editingLead)} className="w-full flex items-center justify-between gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm group">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-slate-900">SMS Outreach</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold">Direct Mobile Message</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                                </button>
                            </div>
                        </div>
                      </div>

                      {/* Tasks Section */}
                      <div>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center mb-6"><CheckSquare className="w-4 h-4 mr-2 text-indigo-600" /> Recruitment Checklist</h3>
                          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                              <ul className="divide-y divide-slate-100">
                                  {editingLead.tasks?.map(task => (
                                    <li key={task.id} className="p-4 flex items-center group hover:bg-slate-50 transition-colors">
                                      <button onClick={() => toggleTask(task.id)} className={`mr-4 transition-colors ${task.isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-slate-400'}`}>
                                        {task.isCompleted ? <CheckCircle2 className="w-6 h-6"/> : <Square className="w-6 h-6"/>}
                                      </button>
                                      <span className={`flex-1 text-sm font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
                                      <button onClick={() => removeTask(task.id)} className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-xl">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </li>
                                  ))}
                                  <li className="p-4 bg-slate-50">
                                    <div className="flex gap-3">
                                      <input className="flex-1 text-sm border-slate-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Add a follow-up action..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
                                      <button onClick={addTask} className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">Add</button>
                                    </div>
                                  </li>
                              </ul>
                          </div>
                      </div>

                      {/* Core Management Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                           <div className="space-y-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                             <select value={editingLead.status} onChange={(e) => setEditingLead({...editingLead, status: e.target.value as LeadStatus})} className="w-full border-slate-200 rounded-2xl text-sm p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                               <option value="Lead">Lead</option>
                               <option value="Interviewing">Interviewing</option>
                               <option value="Formation">Formation</option>
                               <option value="Recruiter">Recruiter</option>
                               <option value="Rejected">Rejected</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Rank</label>
                             <select value={editingLead.priority} onChange={(e) => setEditingLead({...editingLead, priority: e.target.value as Priority})} className="w-full border-slate-200 rounded-2xl text-sm p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                               <option>High</option>
                               <option>Medium</option>
                               <option>Low</option>
                             </select>
                           </div>
                           <div className="md:col-span-2 space-y-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Applicant Bio & Internal Notes</label>
                             <textarea className="w-full border rounded-2xl border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-h-[120px]" rows={4} value={editingLead.bio} onChange={e => setEditingLead({...editingLead, bio: e.target.value})} />
                           </div>
                      </div>
                  </div>
                  <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Close Profile</button>
                    <button type="button" onClick={handleEditSubmit} className="px-10 py-3 text-xs font-black uppercase tracking-widest text-white bg-slate-900 rounded-2xl hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all active:scale-95">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Simple Add Modal Fallback */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 scale-in">
              <h2 className="text-xl font-black italic uppercase tracking-tight mb-6">Register Manual Applicant</h2>
              <div className="space-y-4">
                  <p className="text-sm text-slate-500 italic">For manual entries, please use the public application form link for full profile tracking.</p>
                  <button onClick={() => setIsAddModalOpen(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors">Understood</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for check circles in Lucide
const CheckCircle2 = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Dashboard;
