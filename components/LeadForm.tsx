import React, { useState } from 'react';
import { LeadFormData } from '../types';
import { submitLead } from '../services/leadService';
import { Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    postAppliedFor: '',
    bio: '',
    source: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const result = await submitLead(formData);
      if (result.success) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', postAppliedFor: '', bio: '', source: '' });
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-fade-in-up">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Received</h2>
          <p className="text-slate-600 text-lg mb-8">
            Thank you for applying to ProAgo Marketing. We are reviewing your profile and will contact you shortly to discuss your future in field marketing.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 mb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Real Connections. Real Results.
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          ProAgo Marketing specializes in Face-to-Face and Door-to-Door marketing in Luxembourg. Join us to redefine brand interaction through authentic human connection.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Candidate Information</h3>
          <p className="mt-1 text-sm text-slate-500">Apply now to become a Brand Ambassador, Sales Representative, or Manager.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">
                Full Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address *
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border"
                  placeholder="jean@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                Phone Number *
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border"
                  placeholder="+352 123 456 789"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postAppliedFor" className="block text-sm font-semibold text-slate-700">
                Post Applied For *
              </label>
              <div className="mt-1">
                <select
                  id="postAppliedFor"
                  name="postAppliedFor"
                  required
                  value={formData.postAppliedFor}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border bg-white"
                >
                  <option value="">Select a position...</option>
                  <option value="Promoter / Brand Ambassador">Promoter / Brand Ambassador (Entry Level)</option>
                  <option value="Door-to-Door Sales Representative">Door-to-Door Sales Representative</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Administrative / Back Office">Administrative / Back Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
             <div className="sm:col-span-2">
              <label htmlFor="source" className="block text-sm font-semibold text-slate-700">
                How did you hear about us? *
              </label>
              <div className="mt-1">
                <select
                  id="source"
                  name="source"
                  required
                  value={formData.source}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border bg-white"
                >
                  <option value="">Select source...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Moovijob">Moovijob</option>
                  <option value="Word of Mouth">Word of Mouth</option>
                  <option value="Search Engine">Google / Search Engine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-semibold text-slate-700">
                Tell us about yourself *
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm py-2 px-3 border"
                  placeholder="Highlight your sales experience, communication skills, and why you want to join our field marketing team..."
                />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-center text-slate-400 mt-4">
            By submitting this form, you agree to our data processing policy. Your data is stored securely via Supabase.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;