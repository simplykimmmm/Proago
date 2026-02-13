
import React, { useState } from 'react';
import { LeadFormData, Language } from '../types';
import { submitLead } from '../services/leadService';
import { analyzeCV } from '../services/geminiService';
import { Send, CheckCircle, Loader2, AlertCircle, FileUp, Paperclip, X, Sparkles, BrainCircuit, Flame } from 'lucide-react';
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

  const inputClasses = "mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-phoenix-red focus:border-transparent py-4 px-5 border bg-white dark:bg-phoenix-black text-slate-900 dark:text-white sm:text-sm transition-all font-medium placeholder-slate-400";

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-20 px-4 sm:px-6">
        <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/5 p-12 text-center animate-fade-in transition-all">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 mb-8 transform -rotate-6">
            <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">{t.form.successTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed font-medium">{t.form.successMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="inline-flex items-center justify-center px-10 py-5 bg-slate-900 dark:bg-phoenix-red text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-phoenix-orange transition-all shadow-xl"
          >
            {t.form.submitAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 mb-24 relative">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-phoenix-red/10 border border-phoenix-red/20 rounded-full mb-2">
          <Flame className="w-4 h-4 text-phoenix-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-phoenix-red">Future Leaders Only</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-[0.85]">
          {t.form.title.split(' ')[0]} <span className="phoenix-gradient-text">{t.form.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          {t.form.subtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-phoenix-charcoal rounded-[40px] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-all relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-phoenix-red/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="px-10 py-10 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="relative z-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{t.form.join}</h3>
            <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.form.joinSub}</p>
          </div>
          {status === 'analyzing' && (
            <div className="flex items-center gap-3 bg-phoenix-red/10 px-5 py-3 rounded-2xl border border-phoenix-red/20 animate-pulse relative z-10">
              <BrainCircuit className="w-5 h-5 text-phoenix-red" />
              <span className="text-[10px] font-black uppercase tracking-widest text-phoenix-red">AI Suitability Scan...</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.fullName} *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.email} *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClasses} placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.phone} *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="+352 691 000 000" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.position} *</label>
              <select name="postAppliedFor" required value={formData.postAppliedFor} onChange={handleChange} className={inputClasses}>
                <option value="">Select your path...</option>
                <option value="Promoter / Brand Ambassador">Promoter / Brand Ambassador</option>
                <option value="Door-to-Door Sales Representative">D2D Sales Representative</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Sales Manager">Sales Manager</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.uploadCv} *</label>
              <div className="mt-1 flex justify-center px-10 pt-12 pb-12 border-2 border-slate-200 dark:border-white/10 border-dashed rounded-[32px] hover:border-phoenix-red transition-all bg-slate-50/50 dark:bg-white/5 relative group">
                {cvFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 bg-phoenix-red/10 rounded-3xl flex items-center justify-center">
                        <Paperclip className="h-10 w-10 text-phoenix-red" />
                    </div>
                    <div className="text-center">
                        <span className="block text-sm font-black text-slate-900 dark:text-white uppercase italic">{cvFile.name}</span>
                        <button type="button" onClick={() => setCvFile(null)} className="mt-2 text-[10px] font-black uppercase text-red-500 hover:text-red-700 transition-colors">Remove File</button>
                    </div>
                    {formData.aiScore !== undefined && (
                      <div className="mt-2 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" /> Gemini Verified Suitability
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <FileUp className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700 group-hover:text-phoenix-red transition-colors" />
                    <div className="flex flex-col text-sm text-slate-600 dark:text-slate-400">
                      <label htmlFor="cv-upload" className="relative cursor-pointer bg-white dark:bg-phoenix-black rounded-xl font-black text-phoenix-red hover:text-phoenix-orange px-6 py-3 border border-slate-200 dark:border-white/10 shadow-sm transition-all mb-3">
                        <span>SELECT CV FILE</span>
                        <input id="cv-upload" name="cv-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                      </label>
                      <p className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Supported: JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.source} *</label>
              <select name="source" required value={formData.source} onChange={handleChange} className={inputClasses}>
                <option value="">How did you find us?</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Moovijob">Moovijob</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-2">{t.form.bio} *</label>
              <textarea name="bio" rows={5} required value={formData.bio} onChange={handleChange} className={inputClasses} placeholder="Tell us your mission..." />
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-[20px] bg-red-50 dark:bg-red-900/20 p-6 flex items-center border border-red-100 dark:border-red-800">
              <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
              <span className="text-sm font-black uppercase tracking-tight text-red-700 dark:text-red-400">{errorMessage}</span>
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={status === 'submitting' || status === 'analyzing'} 
              className="w-full flex justify-center items-center py-6 px-8 bg-slate-900 dark:bg-phoenix-red text-white text-[14px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-phoenix-orange transition-all shadow-2xl disabled:opacity-50 disabled:grayscale transform hover:scale-[1.02] active:scale-95 italic"
            >
              {status === 'submitting' ? <><Loader2 className="animate-spin mr-3 h-5 w-5" /> Processing...</> : <><Send className="mr-3 h-5 w-5" /> Start Your Rise 🔥</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;