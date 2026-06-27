import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FileText, Briefcase, Mail, Globe, Sparkles, 
  AlertCircle, Shield, Terminal, UploadCloud, Cpu, Server, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const JobAnalysis = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'url', 'email'
  
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
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        try {
          // If it looks like JSON
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(text);
            setFormData({
              title: parsed.title || parsed.job_title || '',
              company: parsed.company || parsed.company_name || '',
              description: parsed.description || parsed.job_description || '',
              requirements: parsed.requirements || '',
              benefits: parsed.benefits || '',
              recruiterEmail: parsed.recruiterEmail || parsed.email || '',
              companyWebsite: parsed.companyWebsite || parsed.website || '',
              applicationUrl: parsed.applicationUrl || parsed.url || '',
            });
          } else {
            // Text file
            setFormData(prev => ({
              ...prev,
              description: text.slice(0, 10000)
            }));
          }
        } catch (err) {
          setError('Failed to parse file. Ensure it is a valid text or JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      setError('Please fill in Job Title and Company Name.');
      return;
    }

    let finalDescription = formData.description;
    if (activeTab === 'url' && !formData.applicationUrl) {
      setError('Please enter the Application Link.');
      return;
    } else if (activeTab === 'email' && !formData.recruiterEmail) {
      setError('Please enter the Recruiter Email.');
      return;
    }

    if (!finalDescription && activeTab === 'text') {
      setError('Please paste the Job Description.');
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

      const submissionData = { ...formData };
      if (activeTab === 'url') {
        submissionData.description = submissionData.description || `URL SCAN ONLY: Check ${submissionData.applicationUrl}`;
      } else if (activeTab === 'email') {
        submissionData.description = submissionData.description || `EMAIL SCAN ONLY: Check sender ${submissionData.recruiterEmail}`;
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/analyze`, submissionData, config);

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#132238]">Forensic Job Audit</h1>
        <p className="text-[#6B7280] text-xs font-semibold mt-1">
          Evaluate jobs, company websites, and recruiters for security validation and fraudulent patterns.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Tabs Selector (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Analyze Source Tab Selector */}
          <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3EAF5] pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Assessment Source</h3>
                <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">Select verification vector</p>
              </div>
              
              {/* Tabs Buttons */}
              <div className="flex items-center space-x-1.5 bg-[#F7FAFD] p-1.5 rounded-xl border border-[#E3EAF5]">
                {[
                  { id: 'text', label: 'Job Text', icon: FileText },
                  { id: 'url', label: 'URL Check', icon: Globe },
                  { id: 'email', label: 'Email Sender', icon: Mail }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setError('');
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        active 
                          ? 'bg-[#081B2F] text-white shadow-sm' 
                          : 'text-[#6B7280] hover:text-[#132238] hover:bg-[#E3EAF5]/30'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" onDragEnter={handleDrag}>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-[#E74C3C] flex items-center space-x-2 animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#E74C3C]" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title & Company inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    Job Title *
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. CloudNexus Solutions"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Conditional Inputs depending on selected tab */}
              {activeTab === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    Application / Job URL Check *
                  </label>
                  <input
                    type="text"
                    name="applicationUrl"
                    value={formData.applicationUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://cloudnexus-jobs.com/postings/1048"
                    className="w-full"
                    required
                  />
                </div>
              )}

              {activeTab === 'email' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      Recruiter Email Address *
                    </label>
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      placeholder="e.g. hr@cloudnexus-jobs.com"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      Official Company Website
                    </label>
                    <input
                      type="text"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="e.g. https://cloudnexus.com"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Job description / Main Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                  {activeTab === 'text' ? 'Job Description *' : 'Additional Verification Notes (Optional)'}
                </label>
                
                {/* Large Dropzone Area for Text Files */}
                {activeTab === 'text' && (
                  <div 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDrag} 
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-[#E3EAF5] bg-[#F7FAFD] hover:bg-[#E3EAF5]/20'
                    }`}
                  >
                    <UploadCloud className="h-8 w-8 text-[#6B7280] mb-2" />
                    <span className="text-xs text-[#132238] font-bold">
                      Drag & drop a job spec text/JSON file here, or paste content below
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-semibold mt-1">
                      File type supports TXT, JSON
                    </span>
                  </div>
                )}

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    activeTab === 'text'
                      ? "Paste the job posting description, recruiter email body, or any other textual context..."
                      : "Provide additional details, sender messages, or contract outlines..."
                  }
                  rows={activeTab === 'text' ? 8 : 4}
                  className="w-full font-mono text-xs leading-relaxed resize-none mt-2.5"
                  required={activeTab === 'text'}
                  maxLength={10000}
                />
                <div className="flex justify-between items-center text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider pt-1.5">
                  <span>Maximum payload: 10,000 characters.</span>
                  <span>{formData.description.length} / 10000</span>
                </div>
              </div>

              {/* Extra context fields shown in Text Mode */}
              {activeTab === 'text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      Recruiter Email Domain Check
                    </label>
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      placeholder="e.g. hr@cloudnexus.com"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      Job Application / Website Link
                    </label>
                    <input
                      type="text"
                      name="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://cloudnexus.com/careers/data-analyst"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Analyzing Job Integrity...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="h-4 w-4 text-[#A7F08C]" />
                      <span>Execute Threat Scan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Status & Tip Cards (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* System Status Card */}
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3.5">Audit Framework Status</h3>
            
            <div className="divide-y divide-[#E3EAF5] space-y-3 pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-[#6B7280] uppercase tracking-wider">Threat Database</span>
                <span className="text-[#43B97F] bg-[#E8F8F0] border border-[#BCE8D1] px-2 py-0.5 rounded uppercase text-[9px]">ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold pt-3">
                <span className="text-[#6B7280] uppercase tracking-wider">Classifier Engines</span>
                <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase text-[9px]">READY</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold pt-3">
                <span className="text-[#6B7280] uppercase tracking-wider">System Latency</span>
                <span className="text-[#132238] font-mono">42ms</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold pt-3">
                <span className="text-[#6B7280] uppercase tracking-wider">Threat Definitions</span>
                <span className="text-[#132238] font-mono">1.2M active</span>
              </div>
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="p-6 rounded-[20px] bg-[#0D1B2A] text-white shadow-sm space-y-3.5 relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A7F08C] flex items-center space-x-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#A7F08C]" />
              <span>Assessment Tip</span>
            </h3>
            <p className="text-[10px] text-[#94A3B8] leading-relaxed font-semibold">
              Scammers often host landing pages on newly registered domains or require immediate messaging via unverified chat channels. Cross-referencing domains reduces breach risks.
            </p>
          </div>

        </div>

      </div>

      {/* Row 3: Security Insights at bottom */}
      <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] flex items-center space-x-1.5">
          <Shield className="h-4.5 w-4.5 text-[#0D1B2A]" />
          <span>Security Insight Parameters</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {[
            { title: "NLP Semantic Attributions", desc: "Analyzes textual grammar inconsistencies, suspicious high-urgency keywords, and payment demands." },
            { title: "Recruiter Domain Lookup", desc: "Cross-references MX registers, registry age, DNS configuration, and whitelist metrics." },
            { title: "Entity Domain Resolution", desc: "Verifies the alignment of company assets, registered redirects, and SSL parameters." }
          ].map((insight, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5]">
              <span className="text-[10px] font-bold text-[#132238] uppercase tracking-wider block">{insight.title}</span>
              <p className="text-[10.5px] text-[#6B7280] mt-1.5 leading-relaxed font-semibold block">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobAnalysis;
