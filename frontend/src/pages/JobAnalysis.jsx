import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Send, FileText, Briefcase, Mail, Globe, Sparkles, 
  ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, 
  Lock, KeyRound, AlertCircle, HelpCircle, FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const JobAnalysis = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    benefits: '',
    recruiterEmail: '',
    companyWebsite: '',
    applicationUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      setError('Please fill in all required fields (Job Title, Company Name, and Job Description).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/analyze`, formData, config);

      if (res.data?.success) {
        navigate(`/results/${res.data.data._id}`, { state: { analysis: res.data.data } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Verification scan failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-purple-950/20 border border-purple-500/20 px-3.5 py-1 text-[9px] font-bold text-purple-400 uppercase tracking-widest">
          <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
          <span>Security Audit Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-none">
          Job Advertisement Scanner
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Audit job advertisements against our multi-layered detection corpus. Paste the advertisement text and metadata below to calculate its risk parameters.
        </p>
      </div>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Auditing Form (8 Columns) */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-[24px] border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500/5 to-transparent w-48 h-48 rounded-full blur-2xl pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-semibold text-red-400 flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Job Title <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Data Analyst"
                  className="w-full"
                  required
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Company Name <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Stripe Inc."
                  className="w-full"
                  required
                />
              </div>

              {/* Recruiter Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Recruiter Email</span>
                </label>
                <input
                  type="email"
                  name="recruiterEmail"
                  value={formData.recruiterEmail}
                  onChange={handleChange}
                  placeholder="e.g. careers@stripe.com"
                  className="w-full"
                />
              </div>

              {/* Company Website */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <Globe className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Company Website</span>
                </label>
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="e.g. https://stripe.com"
                  className="w-full"
                />
              </div>

              {/* Application URL */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <Globe className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Application Link (URL)</span>
                </label>
                <input
                  type="text"
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  placeholder="e.g. https://linkedin.com/jobs/view/12345"
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Job Description <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Paste the full job advertisement description body..."
                  rows={6}
                  className="w-full resize-none"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Job Requirements</span>
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Paste skills, qualifications, background demands..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              {/* Benefits */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 flex items-center space-x-1.5 select-none uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Benefits & Perks</span>
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="e.g. Health insurance, stock options, remote workspace stipends..."
                  rows={2}
                  className="w-full resize-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.01, filter: 'brightness(1.05)' }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/25 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Running AI Scan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-purple-200" />
                    <span>Verify Advertisement</span>
                  </>
                )}
              </motion.button>
            </div>

          </form>
        </div>

        {/* Right Column: Security Guide Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Auditing Checklist */}
          <div className="glass-panel p-6 rounded-[24px] border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center space-x-2">
              <FileCheck className="h-4.5 w-4.5 text-purple-400" />
              <span>Scanning Criteria</span>
            </h3>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Every submission is audited against four distinct security models to compute a comprehensive Trust Score.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                { name: "Text Pattern Classification", desc: "BERT NLP models verify syntax structural safety." },
                { name: "Domain Authenticity Audit", desc: "Checks registration timelines and SSL issuers." },
                { name: "Financial Demand Scrutiny", desc: "Screens for registration fee or deposit language." },
                { name: "Sensitive Data Extraction", desc: "Flags collection of national identifiers (PAN/Aadhaar)." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-[10px]">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 shadow-[0_0_8px_#8b5cf6]" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-300 block">{item.name}</span>
                    <span className="text-zinc-500 font-medium block leading-normal">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Security Tip */}
          <div className="glass-panel p-6 rounded-[24px] border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500/5 w-24 h-24 rounded-full blur-xl pointer-events-none" />
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center space-x-2">
              <AlertTriangle className="h-4.5 w-4.5" />
              <span>Security Warnings</span>
            </h3>
            <div className="space-y-3 pt-1 text-[10px] font-medium leading-relaxed text-zinc-400">
              <p>
                ⚠️ <strong className="text-slate-300">Upfront Payments:</strong> Genuine recruiters will never request payments for training materials, interview schedules, or onboarding setups.
              </p>
              <p>
                ⚠️ <strong className="text-slate-300">Gmail/Yahoo Domains:</strong> Official corporate opportunities are rarely emailed from generic Google/Yahoo domains.
              </p>
              <p>
                ⚠️ <strong className="text-slate-300">PII Collection:</strong> Do not provide identification numbers (Aadhaar/PAN) or OTP codes prior to signing an employment contract.
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default JobAnalysis;
