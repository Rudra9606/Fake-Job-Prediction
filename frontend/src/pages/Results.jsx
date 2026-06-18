import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Download, Eye, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Building, Mail, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!analysis && id) {
      const fetchAnalysis = async () => {
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await axios.get(`${apiBaseUrl}/api/analyze/${id}`);
          if (res.data?.success) {
            setAnalysis(res.data.data);
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch job scan results.');
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [id, analysis]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-[#080808]">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Compiling Risk Report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto mt-12 glass-panel p-8 rounded-3xl text-center space-y-4 border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-200">Assessment Error</h2>
        <p className="text-slate-400 text-xs">{error || 'Job scan not found.'}</p>
        <Link to="/analyze" className="inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-xl shadow-purple-500/10">
          Scan Another Job
        </Link>
      </div>
    );
  }

  // Determine color coding based on Risk Level & Trust Score
  let riskColor = 'text-emerald-400';
  let riskBg = 'bg-emerald-500/10 border-emerald-500/25';
  let borderGlow = 'glow-emerald border-emerald-500/20';
  let scoreGradient = ['#10B981', '#059669']; // Green gradients

  if (analysis.trustScore <= 20) { // Highly Fraudulent
    riskColor = 'text-red-500';
    riskBg = 'bg-red-500/10 border-red-500/25';
    borderGlow = 'glow-red border-red-500/20';
    scoreGradient = ['#ef4444', '#b91c1c'];
  } else if (analysis.trustScore <= 40) { // High Risk
    riskColor = 'text-orange-500';
    riskBg = 'bg-orange-500/10 border-orange-500/25';
    borderGlow = 'glow-orange border-orange-500/20';
    scoreGradient = ['#f97316', '#ea580c'];
  } else if (analysis.trustScore <= 60) { // Medium Risk
    riskColor = 'text-yellow-500';
    riskBg = 'bg-yellow-500/10 border-yellow-500/25';
    borderGlow = 'glow-amber border-yellow-500/20';
    scoreGradient = ['#eab308', '#ca8a04'];
  } else if (analysis.trustScore <= 80) { // Low Risk
    riskColor = 'text-cyan-400';
    riskBg = 'bg-cyan-500/10 border-cyan-500/25';
    borderGlow = 'glow-cyan border-cyan-500/20';
    scoreGradient = ['#06b6d4', '#0891b2'];
  }

  // SVG Gauge calculations
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.trustScore / 100) * circumference;

  const handleDownloadPDF = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.open(`${apiBaseUrl}/api/analyze/${analysis._id}/pdf`, '_blank');
  };

  const flags = analysis.securityFlags || {};
  const activeFlagsCount = Object.values(flags).filter(Boolean).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800/80 px-4 py-1.5 text-xs text-purple-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Audit Sheet Completed</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">Scan Assessment</h1>
      </div>

      {/* Main Results Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Card: Score Gauge Meter */}
        <div className={`md:col-span-5 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center bg-zinc-950/40 backdrop-blur-xl border relative overflow-hidden ${borderGlow}`}>
          <div className="absolute top-0 left-0 bg-gradient-to-tr from-white/5 to-transparent w-full h-full pointer-events-none" />
          
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Trust Score</h2>
          
          <div className="relative h-44 w-44 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg className="absolute transform -rotate-90 h-full w-full">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-zinc-900 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="fill-none"
                strokeWidth="10"
                stroke="url(#gaugeColor)"
              />
              <defs>
                <linearGradient id="gaugeColor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={scoreGradient[0]} />
                  <stop offset="100%" stopColor={scoreGradient[1]} />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Score Label */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-100 tracking-tighter">{analysis.trustScore}%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Trust Score</span>
            </div>
          </div>

          <div className="mt-8 space-y-1.5 w-full">
            <div className={`rounded-xl px-4 py-2 font-black text-sm uppercase tracking-wider ${riskBg} ${riskColor}`}>
              {analysis.riskLevel}
            </div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Fraud Prob: {(analysis.fraudProbability * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Right Card: Details Summary */}
        <div className="md:col-span-7 glass-panel p-8 rounded-3xl bg-zinc-950/40 backdrop-blur-xl border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Details</h2>
              <span className="text-xs text-purple-400 font-bold flex items-center space-x-1">
                <Cpu className="h-3.5 w-3.5" />
                <span>Hybrid XGBoost</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-slate-100 leading-snug tracking-tight">{analysis.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium">
                <Building className="h-4 w-4 text-purple-400" />
                <span>{analysis.company}</span>
              </div>
            </div>

            {/* Analysis Findings */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Lexical & Meta Analysis Findings</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {analysis.fraudProbability >= 0.5 ? (
                  "Warning: This job posting contains lexical profiles strongly associated with mock listings. It features high urgency text, requests upfront processing fees, or contains suspicious contact email configurations."
                ) : (
                  "This job advertisement aligns closely with standard recruitment criteria. Word frequency maps, TLD extensions, and metadata validations did not trigger warning thresholds."
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-white/5">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-zinc-900 border border-white/10 px-4 py-3.5 text-xs font-bold text-slate-300 hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-purple-400" />
              <span>Download PDF</span>
            </button>
            <Link
              to={`/detailed-report/${analysis._id}`}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-xs font-bold text-white hover:brightness-105 shadow-xl shadow-purple-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Security Report</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Cyber Flags Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <span>Cybersecurity Integrity Checklist</span>
          </h3>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${activeFlagsCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {activeFlagsCount} Warning Flags
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'uses_personal_email', label: 'Email Domain Audit', fail: 'Personal address (Gmail/Yahoo)', pass: 'Verified Corporate Email' },
            { key: 'requests_sensitive_data', label: 'Sensitive PII Scan', fail: 'Harvests Bank Info / Fees', pass: 'No Fee Requests Found' },
            { key: 'suspicious_url', label: 'Redirect Link Checker', fail: 'Shortened or numerical TLD', pass: 'Trusted Redirect Chains' },
            { key: 'high_urgency', label: 'Urgency Threshold', fail: 'High-pressure urgency language', pass: 'Neutral Professional Tone' },
            { key: 'email_domain_mismatch', label: 'Branding Mismatch', fail: 'Branding doesn\'t match email', pass: 'Verified Brand Domain' },
            { key: 'weak_company_profile', label: 'Recruiter Profile', fail: 'Minimal profile footprint', pass: 'Active Corporate Profile' }
          ].map((check) => {
            const isFlagged = flags[check.key];
            return (
              <div key={check.key} className={`rounded-2xl border p-4 flex items-start space-x-3 bg-zinc-950/60 ${isFlagged ? 'border-red-500/15' : 'border-white/5'}`}>
                {isFlagged ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-300">{check.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{isFlagged ? check.fail : check.pass}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Redirect triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to={`/detailed-report/${analysis._id}`} className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-purple-500/30 transition-all bg-zinc-950/20 group">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors">Detailed Security Report</h4>
              <p className="text-[10px] text-slate-500">Inspect full cybersecurity parameter audits.</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to={`/xai-dashboard/${analysis._id}`} className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-purple-500/30 transition-all bg-zinc-950/20 group">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Eye className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors">Explainable AI (SHAP)</h4>
              <p className="text-[10px] text-slate-500 font-medium">Deconstruct tree ensembles feature weights.</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default Results;
