import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Lead, LeadFormData, Priority } from '../types';

const calculateScore = (lead: Partial<Lead>): { score: number; priority: Priority } => {
  let score = 50; 
  if (lead.source === 'LinkedIn' || lead.source === 'Moovijob') score += 20;
  if (lead.source === 'Referral') score += 30;
  if (lead.postAppliedFor === 'Team Leader') score += 15;
  if (lead.postAppliedFor === 'Sales Manager') score += 10;
  score = Math.min(100, Math.max(0, score));
  let priority: Priority = 'Low';
  if (score >= 80) priority = 'High';
  else if (score >= 60) priority = 'Medium';
  return { score, priority };
};

let MOCK_LEADS: Lead[] = [
  {
    id: '1',
    fullName: 'Alexandre Dubois',
    email: 'a.dubois@example.lu',
    phone: '+352 691 123 456',
    postAppliedFor: 'Team Leader',
    bio: '4 years of experience in Door-to-Door sales.',
    source: 'Moovijob',
    status: 'Interviewing',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    priority: 'High',
    score: 85,
    tasks: [{ id: 't1', text: 'Check reference letters', isCompleted: false, createdAt: new Date().toISOString() }],
    nextFollowUp: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: '2',
    fullName: 'Sarah Wagner',
    email: 's.wagner@example.de',
    phone: '+49 151 987 6543',
    postAppliedFor: 'Promoter / Brand Ambassador',
    bio: 'University student looking for summer work.',
    source: 'LinkedIn',
    status: 'Lead',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    priority: 'Medium',
    score: 72,
    tasks: [],
  }
];

export const submitLead = async (formData: LeadFormData): Promise<{ success: boolean; error?: string }> => {
  const { score, priority } = calculateScore(formData);

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          post_applied_for: formData.postAppliedFor,
          bio: formData.bio,
          source: formData.source || 'Web Form',
          status: 'Lead',
          score,
          priority,
          tasks: [],
          cv_base64: formData.cvBase64,
          cv_file_name: formData.cvFileName
        },
      ]);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } else {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_LEADS.unshift({
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        postAppliedFor: formData.postAppliedFor,
        bio: formData.bio,
        source: formData.source || 'Web Form',
        status: 'Lead',
        createdAt: new Date().toISOString(),
        score,
        priority,
        tasks: [],
        cvBase64: formData.cvBase64,
        cvFileName: formData.cvFileName
    });
    return { success: true };
  }
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('leads').update(updates).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } else {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_LEADS = MOCK_LEADS.map(lead => lead.id === id ? { ...lead, ...updates } : lead);
    return { success: true };
  }
};

export const deleteLead = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
  } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      MOCK_LEADS = MOCK_LEADS.filter(lead => lead.id !== id);
      return { success: true };
  }
};

export const fetchLeads = async (): Promise<{ data: Lead[]; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) return { data: [], error: error.message };
    const mappedData = data?.map((item: any) => ({
      id: item.id,
      fullName: item.full_name,
      email: item.email,
      phone: item.phone,
      postAppliedFor: item.post_applied_for,
      bio: item.bio,
      source: item.source,
      status: item.status,
      createdAt: item.created_at,
      priority: item.priority,
      score: item.score,
      tasks: item.tasks || [],
      cvBase64: item.cv_base64,
      cvFileName: item.cv_file_name
    })) as Lead[];
    return { data: mappedData || [] };
  } else {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: [...MOCK_LEADS] }; 
  }
};