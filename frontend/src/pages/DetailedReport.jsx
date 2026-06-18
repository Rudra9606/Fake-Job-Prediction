import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const DetailedReport = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiBaseUrl}/api/analyze/${id}`);
        if (res.data?.success) {
          setAnalysis(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load detailed report.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#030712]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto mt-12 glass-panel p-6 rounded-2xl text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-200">Error</h2>
        <p className="text-slate-400">{error || 'Report not found.'}</p>
        <Link to="/analyze" className="inline-block rounded-xl bg-gradient-indigo px-4 py-2 font-medium text-white">
          Scan Another Job
        </Link>
      </div>
    );
  }

  const flags = analysis.securityFlags || {};
  const flagMeta = [
    {
      key: 'uses_personal_email',
      label: 'Personal Recruiter Email',
      description: 'recruiter uses a free public email domain (Gmail, Yahoo, Hotmail, etc.) rather than a corporate domain.',
      failMsg: 'Flagged: Recruiter contact points to a public free address (potential anonymous scammer).',
    },
    {
      key: 'email_domain_mismatch',
      label: 'Email Domain Mismatch',
      description: 'recruiter email domain does not contain any reference to the company name.',
      failMsg: 'Flagged: Email registry domain mismatches company branding.',
    },
    {
      key: 'young_domain',
      label: 'Domain Age Validation',
      description: 'domain associated with recruiter registry appears newly registered (< 90 days ago).',
      failMsg: 'Flagged: Company domain was created recently (highly correlated with fresh scam runs).',
    },
    {
      key: 'suspicious_url',
      label: 'Suspicious / Shortened Link',
      description: 'contains link shorteners (bit.ly, tinyurl) or numerical IP links to hide final destinations.',
      failMsg: 'Flagged: Contains masked or untrustworthy link redirects.',
    },
    {
      key: 'requests_sensitive_data',
      label: 'Sensitive Data Requests',
      description: 'job details ask for OTPs, Aadhaar, PAN card, bank accounts, or upfront processing payments.',
      failMsg: 'Critical Flag: Harvests sensitive identification details or requests fees.',
    },
    {
      key: 'high_urgency',
      label: 'Urgent/Pressure Language',
      description: 'uses urgent framing keywords ("hire immediately", "instant money") to force fast action.',
      failMsg: 'Flagged: High-pressure urgency sales tactics detected in text.',
    },
    {
      key: 'weak_company_profile',
      label: 'Weak Company Profile',
      description: 'description has missing logo or lacks structured profile descriptions.',
      failMsg: 'Flagged: Very short or blank company profile details.',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <div>
        <Link to={`/results/${analysis._id}`} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assessment</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-200">Cybersecurity Verification Report</h1>
        <p className="text-slate-400 text-sm">
          Detailed breakdown of rules, domain checks, and threat indicator audits for: <span className="text-indigo-400 font-semibold">{analysis.title}</span> at <span className="text-indigo-400 font-semibold">{analysis.company}</span>.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flagMeta.map((flag) => {
          const isFlagged = flags[flag.key];
          return (
            <div
              key={flag.key}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                isFlagged 
                  ? 'border-red-500/25 bg-red-950/5 glow-red' 
                  : 'border-emerald-500/10 hover:border-emerald-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-200">{flag.label}</h3>
                  <p className="text-xs text-slate-500">{flag.description}</p>
                </div>
                {isFlagged ? (
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                {isFlagged ? (
                  <span className="text-xs font-semibold text-red-400">{flag.failMsg}</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400">Passed: Verified Secure.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedReport;
