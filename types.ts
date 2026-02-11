export type LeadStatus = 'Lead' | 'Interviewing' | 'Formation' | 'Recruiter' | 'Rejected';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  postAppliedFor: string;
  bio: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  // New fields for LEAD-03
  priority: Priority;
  score: number; // 0-100
  tasks: Task[];
  nextFollowUp?: string;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  postAppliedFor: string;
  bio: string;
  source: string;
}

export enum ViewState {
  FORM = 'FORM',
  DASHBOARD = 'DASHBOARD',
  WORKER_DASHBOARD = 'WORKER_DASHBOARD',
  LOGIN = 'LOGIN'
}

export type UserRole = 'RECRUITER' | 'WORKER' | null;