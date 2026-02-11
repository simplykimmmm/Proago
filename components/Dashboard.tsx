import React, { useEffect, useState } from 'react';
import { Lead, LeadStatus, LeadFormData, Priority, Task } from '../types';
import { fetchLeads, updateLead, deleteLead, submitLead } from '../services/leadService';
import { 
    Loader2, AlertCircle, Filter, Search, Clock, ArrowUpDown, Pencil, Check, X, 
    Briefcase, UserCheck, GraduationCap, Users, XCircle, Trash2, Plus, Calendar, 
    Save, MoreHorizontal, LayoutGrid, List as ListIcon, BarChart3, GripVertical, CheckSquare, Square
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
  const [viewMode, setViewMode] = useState<DashboardView>('PIPELINE_BOARD'); // Default to Board for Kanban feel
  
  // List View Selection
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // Kanban Drag State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState<LeadFormData>({
      fullName: '', email: '', phone: '', postAppliedFor: 'Promoter / Brand Ambassador', bio: '', source: 'Manual Entry'
  });

  // Edit Lead Modal
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

  // --- Actions ---

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
      
      for (const id of idsToDelete) {
          await deleteLead(id);
      }
  };

  const handleBatchStatus = async (status: LeadStatus) => {
      const ids = Array.from(selectedLeads) as string[];
      setLeads(prev => prev.map(l => selectedLeads.has(l.id) ? { ...l, status } : l));
      setSelectedLeads(new Set());
      
      for (const id of ids) {
          await updateLead(id, { status });
      }
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm("Are you sure?")) return;
      setLeads(prev => prev.filter(l => l.id !== id));
      await deleteLead(id);
  };

  // --- Kanban Logic ---

  const onDragStart = (e: React.DragEvent, id: string) => {
      setDraggedLeadId(id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, status: LeadStatus) => {
      e.preventDefault();
      if (draggedLeadId) {
          await handleStatusChange(draggedLeadId, status);
          setDraggedLeadId(null);
      }
  };

  // --- Edit Modal Logic ---
  
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
      const newTask: Task = {
          id: Date.now().toString(),
          text: newTaskText,
          isCompleted: false,
          createdAt: new Date().toISOString()
      };
      setEditingLead({
          ...editingLead,
          tasks: [newTask, ...editingLead.tasks]
      });
      setNewTaskText('');
  };

  const toggleTask = (taskId: string) => {
      if (!editingLead) return;
      setEditingLead({
          ...editingLead,
          tasks: editingLead.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
      });
  };

  const removeTask = (taskId: string) => {
      if (!editingLead) return;
      setEditingLead({
          ...editingLead,
          tasks: editingLead.tasks.filter(t => t.id !== taskId)
      });
  };

  // --- Filtering & Sorting ---

  const filteredLeads = React.useMemo(() => {
    let result = [...leads];
    if (filter) {
        const lower = filter.toLowerCase();
        result = result.filter(l => 
            l.fullName.toLowerCase().includes(lower) || 
            l.email.toLowerCase().includes(lower) ||
            l.postAppliedFor.toLowerCase().includes(lower)
        );
    }
    if (sortConfig) {
        result.sort((a, b) => {
            if (sortConfig.key === 'createdAt') return sortConfig.direction === 'asc' 
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortConfig.key === 'score') return sortConfig.direction === 'asc' 
                ? a.score - b.score 
                : b.score - a.score;
            return 0;
        });
    } else {
        // Default sort: High priority first, then new
        result.sort((a, b) => {
            if (a.priority === 'High' && b.priority !== 'High') return -1;
            if (a.priority !== 'High' && b.priority === 'High') return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
    return result;
  }, [leads, filter, sortConfig]);

  // --- Render Helpers ---

  const PriorityBadge = ({ priority }: { priority: Priority }) => {
      const colors = {
          'High': 'bg-red-100 text-red-700 border-red-200',
          'Medium': 'bg-orange-100 text-orange-700 border-orange-200',
          'Low': 'bg-slate-100 text-slate-600 border-slate-200',
      };
      return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[priority]}`}>{priority}</span>;
  };

  const ScoreBadge = ({ score }: { score: number }) => {
      let color = 'text-slate-600';
      if (score >= 80) color = 'text-green-600 font-bold';
      else if (score >= 50) color = 'text-yellow-600 font-medium';
      return <div className={`text-xs ${color}`}>Score: {score}</div>
  };

  const KanbanColumn = ({ status, title, icon: Icon }: { status: LeadStatus, title: string, icon: any }) => {
      const columnLeads = filteredLeads.filter(l => l.status === status);
      return (
          <div 
            className="flex-1 min-w-[280px] bg-slate-50 rounded-lg flex flex-col h-full max-h-full border border-slate-200"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
          >
              <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-lg">
                  <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">{columnLeads.length}</span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                  {columnLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable 
                        onDragStart={(e) => onDragStart(e, lead.id)}
                        className="bg-white p-3 rounded shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow group relative"
                        onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-slate-900 text-sm">{lead.fullName}</h4>
                              <PriorityBadge priority={lead.priority} />
                          </div>
                          <p className="text-xs text-slate-500 mb-2 truncate">{lead.postAppliedFor}</p>
                          <div className="flex justify-between items-end">
                              <ScoreBadge score={lead.score} />
                              <div className="flex items-center text-xs text-slate-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                          </div>
                          {/* Quick delete for desktop */}
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                             className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <X className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
                  {columnLeads.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                          Drop here
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 shrink-0 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
            <p className="text-slate-500 text-sm">Control tower for recruitment pipeline & tasks.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
             <button 
                onClick={() => setViewMode('PIPELINE_BOARD')}
                className={`p-2 rounded-md transition-all ${viewMode === 'PIPELINE_BOARD' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Kanban Board"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setViewMode('PIPELINE_LIST')}
                className={`p-2 rounded-md transition-all ${viewMode === 'PIPELINE_LIST' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="List View"
            >
                <ListIcon className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button 
                onClick={() => setViewMode('METRICS')}
                className={`p-2 rounded-md transition-all ${viewMode === 'METRICS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Metrics"
            >
                <BarChart3 className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setViewMode('PLANNING')}
                className={`p-2 rounded-md transition-all ${viewMode === 'PLANNING' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Planning"
            >
                <Calendar className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Toolbar */}
      {(viewMode === 'PIPELINE_LIST' || viewMode === 'PIPELINE_BOARD') && (
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 shrink-0 gap-4">
            <div className="w-full sm:max-w-xs relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
                    placeholder="Search candidates..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {selectedLeads.size > 0 && (
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 animate-fade-in">
                    <span className="text-xs font-semibold text-indigo-700">{selectedLeads.size} selected</span>
                    <button onClick={handleBatchDelete} className="p-1 hover:bg-white rounded text-indigo-600 hover:text-red-600 transition-colors" title="Delete Selected">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-indigo-200"></div>
                    <select 
                        onChange={(e) => handleBatchStatus(e.target.value as LeadStatus)}
                        className="text-xs border-none bg-transparent text-indigo-700 font-medium focus:ring-0 cursor-pointer p-0"
                        defaultValue=""
                    >
                        <option value="" disabled>Move to...</option>
                        <option value="Lead">Lead</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Formation">Formation</option>
                        <option value="Recruiter">Recruiter</option>
                    </select>
                </div>
            )}

            <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto ml-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
            >
                <Plus className="h-4 w-4 mr-2" />
                New Lead
            </button>
         </div>
      )}

      {/* --- VIEWS --- */}
      
      {/* 1. KANBAN BOARD */}
      {viewMode === 'PIPELINE_BOARD' && (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2">
             <div className="flex h-full gap-4 min-w-[1200px]">
                 <KanbanColumn status="Lead" title="New Leads" icon={Briefcase} />
                 <KanbanColumn status="Interviewing" title="Interviewing" icon={UserCheck} />
                 <KanbanColumn status="Formation" title="Formation" icon={GraduationCap} />
                 <KanbanColumn status="Recruiter" title="Recruiters" icon={Users} />
                 <KanbanColumn status="Rejected" title="Rejected" icon={XCircle} />
             </div>
          </div>
      )}

      {/* 2. LIST VIEW */}
      {viewMode === 'PIPELINE_LIST' && (
          <div className="flex-1 overflow-auto bg-white shadow rounded-lg border border-slate-200">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                        <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={(e) => {
                                if (e.target.checked) setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
                                else setSelectedLeads(new Set());
                            }}
                            checked={filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length}
                        />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                   {filteredLeads.map(lead => (
                       <tr key={lead.id} className="hover:bg-slate-50">
                           <td className="px-4 py-4 whitespace-nowrap">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectedLeads.has(lead.id)}
                                    onChange={(e) => {
                                        const newSet = new Set(selectedLeads);
                                        if (e.target.checked) newSet.add(lead.id);
                                        else newSet.delete(lead.id);
                                        setSelectedLeads(newSet);
                                    }}
                                />
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                               <div className="flex items-center cursor-pointer" onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }}>
                                   <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs mr-3">
                                       {lead.fullName.charAt(0)}
                                   </div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-900">{lead.fullName}</div>
                                       <div className="text-xs text-slate-500">{lead.postAppliedFor}</div>
                                   </div>
                               </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                               <select 
                                    value={lead.status}
                                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                    className="text-xs rounded-full border-0 py-1 pl-2 pr-7 bg-slate-100 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value="Lead">Lead</option>
                                    <option value="Interviewing">Interview</option>
                                    <option value="Formation">Formation</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                               <div className="flex flex-col gap-1">
                                   <ScoreBadge score={lead.score} />
                                   <PriorityBadge priority={lead.priority} />
                               </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{lead.source}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                               {new Date(lead.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button onClick={() => { setEditingLead(lead); setIsEditModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                           </td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
      )}

      {/* 3. METRICS VIEW */}
      {viewMode === 'METRICS' && (
          <div className="flex-1 overflow-auto p-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="text-slate-500 text-sm font-medium">Total Leads</h3>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{leads.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="text-slate-500 text-sm font-medium">Conversion Rate</h3>
                      <p className="text-3xl font-bold text-emerald-600 mt-2">
                          {leads.length ? Math.round((leads.filter(l => l.status === 'Recruiter').length / leads.length) * 100) : 0}%
                      </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="text-slate-500 text-sm font-medium">Avg. Lead Score</h3>
                      <p className="text-3xl font-bold text-indigo-600 mt-2">
                          {leads.length ? Math.round(leads.reduce((acc: number, curr) => acc + curr.score, 0) / leads.length) : 0}
                      </p>
                  </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Leads by Source</h3>
                  <div className="space-y-4">
                      {Object.entries(leads.reduce((acc: Record<string, number>, lead) => {
                          acc[lead.source] = (acc[lead.source] || 0) + 1;
                          return acc;
                      }, {} as Record<string, number>)).map(([source, count]) => (
                          <div key={source}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-slate-700">{source}</span>
                                  <span className="text-slate-500">{count} leads</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2.5">
                                  <div 
                                    className="bg-indigo-600 h-2.5 rounded-full" 
                                    style={{ width: `${(count / leads.length) * 100}%` }}
                                  ></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* 4. PLANNING VIEW (Simplified for brevity as per existing) */}
      {viewMode === 'PLANNING' && (
          <div className="flex-1 bg-white shadow rounded-lg border border-slate-200 p-8 flex items-center justify-center text-slate-400">
              <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Team Schedule & Shift Planning module is active.</p>
              </div>
          </div>
      )}

      {/* --- MODALS --- */}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                 <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
                 <form onSubmit={async (e) => {
                     e.preventDefault();
                     await submitLead(newLeadData);
                     setIsAddModalOpen(false);
                     setNewLeadData({ fullName: '', email: '', phone: '', postAppliedFor: 'Promoter', bio: '', source: 'Manual Entry' });
                     loadLeads();
                 }} className="space-y-4">
                     <input placeholder="Full Name" required className="w-full p-2 border rounded" value={newLeadData.fullName} onChange={e => setNewLeadData({...newLeadData, fullName: e.target.value})} />
                     <input placeholder="Email" type="email" required className="w-full p-2 border rounded" value={newLeadData.email} onChange={e => setNewLeadData({...newLeadData, email: e.target.value})} />
                     <select className="w-full p-2 border rounded" value={newLeadData.source} onChange={e => setNewLeadData({...newLeadData, source: e.target.value})}>
                         <option>Manual Entry</option><option>LinkedIn</option><option>Referral</option>
                     </select>
                     <div className="flex justify-end gap-2 pt-2">
                         <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Lead</button>
                     </div>
                 </form>
             </div>
         </div>
      )}

      {/* Edit Lead Modal (Tabbed: Details | Tasks) */}
      {isEditModalOpen && editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-slate-900">{editingLead.fullName}</h2>
                      <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  
                  <div className="p-6 space-y-8">
                      {/* Section 1: Scoring & Status */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div>
                              <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
                              <select 
                                value={editingLead.priority}
                                onChange={(e) => setEditingLead({...editingLead, priority: e.target.value as Priority})}
                                className="block w-full mt-1 border-slate-300 rounded-md text-sm"
                              >
                                  <option>High</option><option>Medium</option><option>Low</option>
                              </select>
                          </div>
                          <div>
                               <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                               <select 
                                value={editingLead.status}
                                onChange={(e) => setEditingLead({...editingLead, status: e.target.value as LeadStatus})}
                                className="block w-full mt-1 border-slate-300 rounded-md text-sm"
                              >
                                  <option value="Lead">Lead</option>
                                  <option value="Interviewing">Interviewing</option>
                                  <option value="Formation">Formation</option>
                                  <option value="Recruiter">Recruiter</option>
                                  <option value="Rejected">Rejected</option>
                              </select>
                          </div>
                      </div>

                      {/* Section 2: Tasks (LEAD-03) */}
                      <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                              <CheckSquare className="w-4 h-4 mr-2" /> Tasks & Follow-up
                          </h3>
                          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                              <ul className="divide-y divide-slate-100">
                                  {editingLead.tasks?.map(task => (
                                      <li key={task.id} className="p-3 flex items-center group hover:bg-slate-50">
                                          <button onClick={() => toggleTask(task.id)} className={`mr-3 ${task.isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                                              {task.isCompleted ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                          </button>
                                          <span className={`flex-1 text-sm ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                              {task.text}
                                          </span>
                                          <button onClick={() => removeTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <X className="w-4 h-4" />
                                          </button>
                                      </li>
                                  ))}
                                  <li className="p-3 bg-slate-50">
                                      <div className="flex gap-2">
                                          <input 
                                            className="flex-1 text-sm border-slate-300 rounded px-2 py-1" 
                                            placeholder="Add a follow-up task..." 
                                            value={newTaskText}
                                            onChange={(e) => setNewTaskText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                          />
                                          <button onClick={addTask} className="text-indigo-600 font-medium text-sm px-2 hover:bg-indigo-50 rounded">Add</button>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                      </div>

                      {/* Section 3: Contact Info */}
                      <div>
                           <h3 className="text-sm font-bold text-slate-900 mb-3">Contact Details</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-xs text-slate-500">Email</label>
                                   <input className="w-full border-b border-slate-300 focus:border-indigo-500 py-1 text-sm" value={editingLead.email} onChange={e => setEditingLead({...editingLead, email: e.target.value})} />
                               </div>
                               <div>
                                   <label className="block text-xs text-slate-500">Phone</label>
                                   <input className="w-full border-b border-slate-300 focus:border-indigo-500 py-1 text-sm" value={editingLead.phone} onChange={e => setEditingLead({...editingLead, phone: e.target.value})} />
                               </div>
                               <div className="md:col-span-2">
                                   <label className="block text-xs text-slate-500">Bio / Notes</label>
                                   <textarea className="w-full border rounded-md border-slate-300 focus:border-indigo-500 p-2 text-sm mt-1" rows={3} value={editingLead.bio} onChange={e => setEditingLead({...editingLead, bio: e.target.value})} />
                               </div>
                           </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                      <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Cancel</button>
                      <button type="button" onClick={handleEditSubmit} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;