
import React, { useState } from 'react';
import { LeadFormData, Language } from '../types';
import { submitLead } from '../services/leadService';
import { analyzeCV } from '../services/geminiService';
import { Send, CheckCircle, Loader2, AlertCircle, FileUp, Paperclip, X, Sparkles, BrainCircuit } from 'lucide-react';
import { useTranslation } from '../services/translations';

interface LeadFormProps {
  language: Language;
}

const LeadForm: React.FC<LeadFormProps> = ({ language }) => {
  const t = useTranslation(language);
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    postAppliedFor: '',
    bio: '',
    source: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'analyzing'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setCvFile(file);

      // Trigger AI Analysis if a position is selected
      if (formData.postAppliedFor) {
        performAIAnalysis(file);
      }
    }
  };

  const performAIAnalysis = async (file: File) => {
    setStatus('analyzing');
    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeCV(base64, formData.postAppliedFor);
      setFormData(prev => ({
        ...prev,
        aiScore: analysis.score,
        aiSummary: analysis.summary
      }));
      setStatus('idle');
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setStatus('idle');
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
        setErrorMessage(result.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred during upload.');
      setStatus('error');
    }
  };

  const inputClasses = "mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border bg-white dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-all";

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center animate-fade-in-up transition-colors">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.form.successTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">{t.form.successMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t.form.submitAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 mb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl italic uppercase">
          {t.form.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.form.subtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.form.join}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.form.joinSub}</p>
          </div>
          {status === 'analyzing' && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800 animate-pulse">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI Profile Scanning...</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.fullName} *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.email} *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.phone} *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.position} *</label>
              <select name="postAppliedFor" required value={formData.postAppliedFor} onChange={handleChange} className={inputClasses}>
                <option value="">...</option>
                <option value="Promoter / Brand Ambassador">Promoter / Brand Ambassador</option>
                <option value="Door-to-Door Sales Representative">D2D Sales Representative</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Sales Manager">Sales Manager</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.uploadCv} *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-md hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800/30 relative">
                {cvFile ? (
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                    <Paperclip className="h-5 w-5" />
                    <span className="text-sm font-medium">{cvFile.name}</span>
                    <button type="button" onClick={() => setCvFile(null)} className="p-1 hover:bg-indigo-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                    {formData.aiScore !== undefined && (
                      <div className="ml-4 flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" /> CV Scanned
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                      <label htmlFor="cv-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none px-2 underline">
                        <span>Upload a photo of your CV</span>
                        <input id="cv-upload" name="cv-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 italic">Gemini AI will analyze your suitability instantly</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.source} *</label>
              <select name="source" required value={formData.source} onChange={handleChange} className={inputClasses}>
                <option value="">...</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Moovijob">Moovijob</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.form.bio} *</label>
              <textarea name="bio" rows={4} required value={formData.bio} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-sm font-medium text-red-800 dark:text-red-400">{errorMessage}</span>
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={status === 'submitting' || status === 'analyzing'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 focus:outline-none transition-all disabled:opacity-70">
              {status === 'submitting' ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t.form.submitting}</> : <><Send className="mr-2 h-4 w-4" /> {t.form.submit}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
