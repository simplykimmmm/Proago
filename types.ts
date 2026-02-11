
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
  priority: Priority;
  score: number;
  tasks: Task[];
  nextFollowUp?: string;
  cvBase64?: string;
  cvFileName?: string;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  postAppliedFor: string;
  bio: string;
  source: string;
  cvBase64?: string;
  cvFileName?: string;
}

export enum ViewState {
  FORM = 'FORM',
  DASHBOARD = 'DASHBOARD',
  WORKER_DASHBOARD = 'WORKER_DASHBOARD',
  MANAGER_DASHBOARD = 'MANAGER_DASHBOARD',
  LOGIN = 'LOGIN'
}

export type UserRole = 'RECRUITER' | 'WORKER' | 'MANAGER' | null;
