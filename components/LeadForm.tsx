import React, { useState } from 'react';
import { LeadFormData } from '../types';
import { submitLead } from '../services/leadService';
import { Send, CheckCircle, Loader2, AlertCircle, FileUp, Paperclip, X } from 'lucide-react';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    postAppliedFor: '',
    bio: '',
    source: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setCvFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      let finalData = { ...formData };
      if (cvFile) {
        finalData.cvBase64 = await fileToBase64(cvFile);
        finalData.cvFileName = cvFile.name;
      }

      const result = await submitLead(finalData);
      if (result.success) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', postAppliedFor: '', bio: '', source: '' });
        setCvFile(null);
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred during upload.');
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
            Thank you for applying to ProAgo Marketing. Your CV and profile are being reviewed by our recruitment team.
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
          Luxembourg's premier field marketing agency. Join ProAgo World.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Join the Team</h3>
          <p className="mt-1 text-sm text-slate-500">Apply as a Brand Ambassador, Sales Rep, or Leader.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">Full Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Phone Number *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postAppliedFor" className="block text-sm font-semibold text-slate-700">Position *</label>
              <select name="postAppliedFor" required value={formData.postAppliedFor} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm bg-white">
                <option value="">Select a position...</option>
                <option value="Promoter / Brand Ambassador">Promoter / Brand Ambassador</option>
                <option value="Door-to-Door Sales Representative">D2D Sales Representative</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Sales Manager">Sales Manager</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">Upload CV (PDF/Doc) *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-indigo-400 transition-colors bg-slate-50 relative">
                {cvFile ? (
                  <div className="flex items-center space-x-2 text-indigo-600">
                    <Paperclip className="h-5 w-5" />
                    <span className="text-sm font-medium">{cvFile.name}</span>
                    <button type="button" onClick={() => setCvFile(null)} className="p-1 hover:bg-indigo-100 rounded-full text-slate-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="cv-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2 underline">
                        <span>Upload a file</span>
                        <input id="cv-upload" name="cv-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="source" className="block text-sm font-semibold text-slate-700">Source *</label>
              <select name="source" required value={formData.source} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm bg-white">
                <option value="">Select source...</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Moovijob">Moovijob</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-semibold text-slate-700">Cover Letter / Bio *</label>
              <textarea name="bio" rows={4} required value={formData.bio} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 py-2 px-3 border sm:text-sm" />
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-sm font-medium text-red-800">{errorMessage}</span>
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={status === 'submitting'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-all disabled:opacity-70">
              {status === 'submitting' ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Application</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;