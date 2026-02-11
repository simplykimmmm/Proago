import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Lead, LeadFormData, Priority } from '../types';

// Helper to simulate AI Scoring
const calculateScore = (lead: Partial<Lead>): { score: number; priority: Priority } => {
  let score = 50; // Base score

  // Source scoring
  if (lead.source === 'LinkedIn' || lead.source === 'Moovijob') score += 20;
  if (lead.source === 'Referral') score += 30;
  
  // Role scoring (simulating urgency)
  if (lead.postAppliedFor === 'Team Leader') score += 15;
  if (lead.postAppliedFor === 'Sales Manager') score += 10;

  // Cap score
  score = Math.min(100, Math.max(0, score));

  let priority: Priority = 'Low';
  if (score >= 80) priority = 'High';
  else if (score >= 60) priority = 'Medium';

  return { score, priority };
};

// Mock data for demo purposes when Supabase is not connected
let MOCK_LEADS: Lead[] = [
  {
    id: '1',
    fullName: 'Alexandre Dubois',
    email: 'a.dubois@example.lu',
    phone: '+352 691 123 456',
    postAppliedFor: 'Team Leader',
    bio: '4 years of experience in Door-to-Door sales. Proven track record of managing small teams and hitting daily KPIs.',
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
    bio: 'University student looking for summer work. High energy, fluent in German and French. Loves talking to people.',
    source: 'LinkedIn',
    status: 'Lead',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    priority: 'Medium',
    score: 72,
    tasks: [],
  },
  {
    id: '3',
    fullName: 'Jean-Pierre Muller',
    email: 'jp.muller@example.lu',
    phone: '+352 661 555 000',
    postAppliedFor: 'Door-to-Door Sales Representative',
    bio: 'Looking for a career change. Strong communication skills and resilient. Eager to learn the ProAgo sales method.',
    source: 'Facebook',
    status: 'Lead',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    priority: 'Low',
    score: 45,
    tasks: [{ id: 't2', text: 'Call to gauge motivation', isCompleted: true, createdAt: new Date().toISOString() }],
  },
  {
    id: '4',
    fullName: 'Elena Popov',
    email: 'elena.p@example.com',
    phone: '+352 691 999 888',
    postAppliedFor: 'Sales Manager',
    bio: '10 years experience in field marketing and event planning. Managed campaigns for major telecom brands.',
    source: 'Website',
    status: 'Recruiter',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    priority: 'High',
    score: 95,
    tasks: [],
  },
  {
    id: '5',
    fullName: 'Marc Weber',
    email: 'marc.w@example.lu',
    phone: '+352 621 111 222',
    postAppliedFor: 'Promoter',
    bio: 'Energetic and ready to learn.',
    source: 'Walk-in',
    status: 'Formation',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    priority: 'Low',
    score: 55,
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
          tasks: []
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } else {
    // Demo Mode
    console.log('Demo Mode: Submitting lead...', formData);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    MOCK_LEADS.unshift({
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        postAppliedFor: formData.postAppliedFor,
        bio: formData.bio,
        source: formData.source || (formData.fullName.includes('(Manual)') ? 'Manual Entry' : 'Web Form'),
        status: 'Lead',
        createdAt: new Date().toISOString(),
        score,
        priority,
        tasks: []
    });
    
    return { success: true };
  }
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
    // Basic mapping for demo - in prod, mapping function needed
    const { error } = await supabase
      .from('leads')
      .update(updates) // Assuming Supabase setup handles JSON for tasks
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } else {
    // Demo Mode
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_LEADS = MOCK_LEADS.map(lead => lead.id === id ? { ...lead, ...updates } : lead);
    return { success: true };
  }
}

export const deleteLead = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
  } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      MOCK_LEADS = MOCK_LEADS.filter(lead => lead.id !== id);
      return { success: true };
  }
}

export const fetchLeads = async (): Promise<{ data: Lead[]; error?: string }> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };

    // Basic map - ensure types match
    const mappedData = data?.map((item: any) => ({ ...item, tasks: item.tasks || [] })) as Lead[];
    return { data: mappedData || [] };
  } else {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: [...MOCK_LEADS] }; 
  }
};