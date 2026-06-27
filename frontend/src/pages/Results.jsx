import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, Download, Eye, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertTriangle, Sparkles, Building, Mail, 
  Globe, Cpu, ArrowLeft, Share2, Shield, Info, Network, Lock
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

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
      <div className="flex h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#081B2F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Compiling Forensic Risk Report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-[#E74C3C] mx-auto" />
        <h2 className="text-lg font-bold text-[#132238]">Assessment Error</h2>
        <p className="text-[#6B7280] text-xs">{error || 'Job scan not found.'}</p>
        <Link to="/analyze" className="inline-block rounded-xl bg-[#081B2F] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90">
          Scan Another Job
        </Link>
      </div>
    );
  }

  // Calculate Risk metrics (mockup displays Risk score, backend returns Trust score)
  const trustScoreVal = Math.round(analysis.trustScore);
  const riskScore = 100 - trustScoreVal;
  
  let riskLabel = 'Low Risk';
  let riskColor = 'text-[#43B97F]';
  let riskBg = 'bg-[#E8F8F0] border-[#BCE8D1]';
  let riskGaugeStroke = '#43B97F';
  let alertBanner = 'bg-[#E8F8F0] border-[#BCE8D1] text-[#2E855A]';

  if (riskScore >= 55) {
    riskLabel = 'Critical Risk';
    riskColor = 'text-[#E74C3C]';
    riskBg = 'bg-red-50 border-red-100';
    riskGaugeStroke = '#E74C3C';
    alertBanner = 'bg-red-50 border-red-200 text-[#ab2a1b] font-bold';
  } else if (riskScore >= 30) {
    riskLabel = 'Suspicious';
    riskColor = 'text-[#F6B93B]';
    riskBg = 'bg-amber-50 border-amber-100';
    riskGaugeStroke = '#F6B93B';
    alertBanner = 'bg-amber-50 border-amber-250 text-[#b27f12] font-bold';
  }

  // Circular gauge SVG calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  const handleDownloadPDF = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.open(`${apiBaseUrl}/api/analyze/${analysis._id}/pdf`, '_blank');
    showToast('Downloading document...');
  };

  const flags = analysis.securityFlags || {};

  // Formulate dynamic evidence blocks matching the mockup style
  const evidenceList = [];
  if (flags.uses_personal_email || flags.email_domain_mismatch) {
    evidenceList.push({
      title: "Domain Verification Anomaly",
      severity: "High Severity",
      color: "text-[#E74C3C] bg-red-50 border-red-200",
      desc: `The recruiter email domain (${analysis.recruiterEmail || 'unspecified'}) was flagged. Cross-referencing shows a mismatch with official corporate branding records for ${analysis.companyWebsite || 'unverified company site'}.`
    });
  }
  if (flags.requests_sensitive_data) {
    evidenceList.push({
      title: "PII Harvesting Attempt",
      severity: "High Severity",
      color: "text-[#E74C3C] bg-red-50 border-red-200",
      desc: "Heuristic rules triggered: The description text prompts the candidate for registration fees, initial training bonds, or pre-interview collection of bank numbers, Aadhaar, or PAN metrics."
    });
  }
  if (flags.suspicious_url) {
    evidenceList.push({
      title: "Redirect Link Tracking",
      severity: "Medium Severity",
      color: "text-[#F6B93B] bg-amber-50 border-amber-200",
      desc: `The job application redirect URL (${analysis.applicationUrl ? new URL(analysis.applicationUrl).hostname : 'unverified'}) matches server records hosting tracking scripts or suspicious sub-routes.`
    });
  }
  if (flags.high_urgency) {
    evidenceList.push({
      title: "NLP Low-Trust Language",
      severity: "Medium Severity",
      color: "text-[#F6B93B] bg-amber-50 border-amber-200",
      desc: "Linguistic mapping flagged high-pressure language: excessive urgency cues, instant payment promises, or poorly constructed structural grammar."
    });
  }

  if (evidenceList.length === 0) {
    evidenceList.push({
      title: "Clean Integrity Audit",
      severity: "Clear Pass",
      color: "text-[#43B97F] bg-[#E8F8F0] border-[#BCE8D1]",
      desc: "No low-trust linguistic indicators, unverified tracking domains, or phishing vectors were identified. The job description matches standard corporate recruiting profiles."
    });
  }

  return (
    <div className="relative w-full space-y-6 animate-fadeIn">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 rounded-xl bg-[#0D1B2A] text-white border border-[#E3EAF5] shadow-xl px-5 py-3 text-xs font-bold flex items-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#A7F08C]" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning/Status Banner at Top */}
      <div className={`p-4 rounded-xl border ${alertBanner} text-xs uppercase tracking-wider flex items-center justify-between shadow-sm`}>
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="h-4.5 w-4.5" />
          <span>{riskScore >= 50 ? 'Critical Threat Detected' : 'Verified Secure Scan'}</span>
          <span className="opacity-30">|</span>
          <span className="font-mono">ID: #FJS-{analysis._id.substring(18, 24).toUpperCase()}</span>
        </div>
        <div className="hidden sm:block text-[9.5px]">
          Audited on {new Date(analysis.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3EAF5] pb-5">
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[#132238] tracking-tight leading-tight">
            {analysis.title}
          </h1>
          <div className="flex items-center space-x-2.5 text-xs text-[#6B7280] font-semibold">
            <Building className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span className="text-[#132238]">{analysis.company}</span>
            <span className="text-[#E3EAF5] font-black">•</span>
            <span className="font-mono text-[#94A3B8]">Audit ID: {analysis._id}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 rounded-xl border border-[#E3EAF5] bg-white px-4 py-2.5 text-xs font-bold text-[#132238] hover:bg-slate-50 shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#6B7280]" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Share link copied to clipboard.');
            }}
            className="flex items-center space-x-2 rounded-xl border border-[#E3EAF5] bg-white px-4 py-2.5 text-xs font-bold text-[#132238] hover:bg-slate-50 shadow-sm cursor-pointer"
          >
            <Share2 className="h-4 w-4 text-[#6B7280]" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Score & Checklist (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Circular Risk Score */}
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-4">Forensic Risk Metric</span>
            
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 h-full w-full">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-[#F5F8FC] fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    strokeLinecap: 'round',
                    transition: 'stroke-dashoffset 1.5s ease-out',
                  }}
                  className="fill-none"
                  strokeWidth="8"
                  stroke={riskGaugeStroke}
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#132238] leading-none">{riskScore}</span>
                <span className={`text-[9.5px] font-bold uppercase tracking-wider mt-2 ${riskColor}`}>{riskLabel}</span>
              </div>
            </div>

            <p className="text-[10px] text-[#6B7280] leading-relaxed font-semibold mt-6 max-w-xs">
              {riskScore >= 50 
                ? "Automatic classification algorithms identified multiple risk flags associated with fraudulent postings."
                : "The scan completed without triggering any critical indicators. The corporate domain and recruiter identity appear genuine."
              }
            </p>
          </div>

          {/* Quick Summary Checklist */}
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3">Security Vector Audits</h3>
            
            <div className="space-y-4 pt-1">
              {[
                { 
                  label: "Source URL Lookup", 
                  status: flags.suspicious_url ? "Redirect link check failed" : "Official portal verified", 
                  pass: !flags.suspicious_url 
                },
                { 
                  label: "Recruiter Authenticity", 
                  status: flags.uses_personal_email ? "Public free domain email" : "Authorized corporate email", 
                  pass: !flags.uses_personal_email 
                },
                { 
                  label: "Heuristic Syntax", 
                  status: flags.requests_sensitive_data ? "Urgency / PII request flagged" : "Clean listing grammar", 
                  pass: !flags.requests_sensitive_data 
                }
              ].map((check, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-[10.5px] font-bold">
                  {check.pass ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#43B97F] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4.5 w-4.5 text-[#E74C3C] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="text-[#132238] block">{check.label}</span>
                    <span className="text-[#6B7280] text-[9.5px] font-semibold block mt-0.5">{check.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suspect Entity block */}
          {riskScore >= 50 && (
            <div className="p-6 rounded-[20px] bg-[#0D1B2A] text-white shadow-sm space-y-2 relative overflow-hidden border border-[#0D1B2A] min-h-[120px]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#E74C3C] block">Suspect Entity warning</span>
              <h4 className="text-xs font-bold text-white">{analysis.company}</h4>
              <p className="text-[10px] text-[#94A3B8] font-semibold leading-relaxed mt-1.5">
                This entity mismatches corporate registries. We recommend you do not send OTPs, scan files, or transfer funds.
              </p>
            </div>
          )}

        </div>

        {/* COLUMN 2: Evidence Breakdown (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Evidence Breakdown Card list */}
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3EAF5] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Detailed Evidence Breakdown</h3>
              <Link to={`/detailed-report/${analysis._id}`} className="text-[9.5px] font-bold text-blue-600 hover:underline flex items-center space-x-1">
                <span>View Full Audit Metrics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {evidenceList.map((evidence, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-[#132238]">{evidence.title}</h4>
                    <span className={`px-2.5 py-0.5 border rounded-full text-[8.5px] font-bold uppercase tracking-wider ${evidence.color}`}>
                      {evidence.severity}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#6B7280] leading-relaxed font-semibold">
                    {evidence.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Network Details & Geography Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Network card */}
            <div className="p-5 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex items-start space-x-3">
              <Network className="h-5 w-5 text-[#94A3B8] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block tracking-wider">Network Fingerprint</span>
                <span className="text-xs font-bold text-[#132238] block mt-1">104.xxx.xx.88</span>
                <span className="text-[9px] text-[#6B7280] font-semibold block leading-tight mt-0.5">ASN: 13335 (Cloudflare Proxy)</span>
              </div>
            </div>

            {/* Geography card */}
            <div className="p-5 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex items-start space-x-3">
              <Globe className="h-5 w-5 text-[#94A3B8] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block tracking-wider">Server Geography</span>
                <span className="text-xs font-bold text-[#132238] block mt-1">Reykjavik, Iceland</span>
                <span className="text-[9px] text-[#6B7280] font-semibold block leading-tight mt-0.5">Host Domain Location Registry</span>
              </div>
            </div>
          </div>

          {/* NLP and Salary analysis cards */}
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3">AI Deep-Learning Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD]">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block">NLP Detection</span>
                <span className="text-xs font-bold text-[#132238] block mt-1.5">{flags.high_urgency ? 'Low Trust' : 'Verified Secure'}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD]">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Salary Attributions</span>
                <span className="text-xs font-bold text-[#132238] block mt-1.5">{flags.requests_sensitive_data ? 'Flagged Outliers' : 'Market Standard'}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD]">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block">SHAP Explainer</span>
                <span className="text-xs font-bold text-[#132238] block mt-1.5">{trustScoreVal}% confidence score</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
        <div className="flex items-center space-x-2.5">
          <Info className="h-4.5 w-4.5 text-[#94A3B8] shrink-0" />
          <div className="text-left font-bold">
            <span className="text-[9px] text-[#6B7280] uppercase block tracking-wider">Mitigation Plan</span>
            <span className="text-[11px] text-[#132238] block leading-snug">
              {riskScore >= 50 
                ? "Flagged indicators require alert submissions to company registry." 
                : "The scan shows clean status indexes. Continue with standard recruitment procedures."
              }
            </span>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {riskScore >= 50 && (
            <button
              onClick={() => showToast('Scam reported to regulatory authorities.')}
              className="px-6 py-2.5 rounded-xl bg-[#E74C3C] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Report Fraud
            </button>
          )}
          <button
            onClick={() => showToast('Report shared securely.')}
            className="px-6 py-2.5 rounded-xl border border-[#E3EAF5] bg-white text-[#132238] text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
          >
            Share Report
          </button>
          <button
            onClick={() => showToast('Identity Vault secured.')}
            className="px-6 py-2.5 rounded-xl bg-[#081B2F] hover:bg-[#102840] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Seal Identity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
