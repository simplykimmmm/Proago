
export type UserRole = 'ADMIN' | 'MANAGER' | 'RECRUITER' | 'WORKER';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'fr' | 'de';

export enum ViewState {
  LANDING = 'LANDING',
  FORM = 'FORM',
  DASHBOARD = 'DASHBOARD',
  WORKER_DASHBOARD = 'WORKER_DASHBOARD',
  MANAGER_DASHBOARD = 'MANAGER_DASHBOARD',
  LOGIN = 'LOGIN'
}

export type LeadStatus = 'Lead' | 'Interviewing' | 'Formation' | 'Recruiter' | 'Rejected';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recruiter extends BaseEntity {
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  stats: {
    totalSales: number;
    conversionRate: number;
    personalBest: number;
  };
}

export interface FormationSession extends BaseEntity {
  title: string;
  date: string;
  participants: string[]; // Recruiter IDs
  location: string;
}

export interface Lead extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  postAppliedFor: string;
  bio: string;
  source: string;
  status: LeadStatus;
  priority: Priority;
  score: number;
  tasks: Task[];
  cvBase64?: string;
  cvFileName?: string;
  nextFollowUp?: string;
  aiSummary?: string;
  aiScore?: number;
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
  aiSummary?: string;
  aiScore?: number;
}