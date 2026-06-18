import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Send, FileText, Briefcase, Mail, Globe, Sparkles } from 'lucide-react';
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
      className="max-w-5xl mx-auto px-4 py-4 space-y-6"
    >
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Security Audit Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">Job Advertisement Scanner</h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Audit job advertisements against our multi-layered detection corpus. Paste the advertisement text and metadata below to calculate its risk parameters.
        </p>
      </div>

      {/* Main Form Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md relative overflow-hidden">
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <Briefcase className="h-4 w-4 text-zinc-500" />
                <span>Job Title <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Data Analyst"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <Briefcase className="h-4 w-4 text-zinc-500" />
                <span>Company Name <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Stripe Inc."
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Recruiter Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <Mail className="h-4 w-4 text-zinc-500" />
                <span>Recruiter Email</span>
              </label>
              <input
                type="email"
                name="recruiterEmail"
                value={formData.recruiterEmail}
                onChange={handleChange}
                placeholder="e.g. careers@stripe.com"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Company Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <Globe className="h-4 w-4 text-zinc-500" />
                <span>Company Website</span>
              </label>
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="e.g. https://stripe.com"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Application URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <Globe className="h-4 w-4 text-zinc-500" />
                <span>Application Link (URL)</span>
              </label>
              <input
                type="text"
                name="applicationUrl"
                value={formData.applicationUrl}
                onChange={handleChange}
                placeholder="e.g. https://linkedin.com/jobs/view/12345"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <FileText className="h-4 w-4 text-zinc-500" />
                <span>Job Description <span className="text-red-500">*</span></span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Paste the full job advertisement description body..."
                rows={5}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                required
              />
            </div>

            {/* Requirements */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <FileText className="h-4 w-4 text-zinc-500" />
                <span>Job Requirements</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Paste skills, qualifications, background demands..."
                rows={3}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            {/* Benefits */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1.5 select-none">
                <FileText className="h-4 w-4 text-zinc-500" />
                <span>Benefits & Perks</span>
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="e.g. Health insurance, stock options, remote workspace stipends..."
                rows={2}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.01, filter: 'brightness(1.05)' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Running AI Scan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span>Verify Advertisement</span>
                </>
              )}
            </motion.button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default JobAnalysis;
