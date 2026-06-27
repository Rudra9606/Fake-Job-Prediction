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
      <div className="flex h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#081B2F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Loading Audit Parameters...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-[#E74C3C] mx-auto" />
        <h2 className="text-lg font-bold text-[#132238]">Audit Error</h2>
        <p className="text-[#6B7280] text-xs">{error || 'Report not found.'}</p>
        <Link to="/analyze" className="inline-block rounded-xl bg-[#081B2F] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90">
          Scan Another Job
        </Link>
      </div>
    );
  }

  const flags = analysis.securityFlags || {};
  const flagMeta = [
    {
      key: 'uses_personal_email',
      label: 'Personal Recruiter Email Check',
      description: 'Verifies if the recruiter contact email points to public free providers (Gmail, Yahoo, Hotmail, Outlook, etc.) instead of a dedicated corporate domain.',
      failMsg: 'Flagged: Recruiter email is registered on a public free address (often used by anonymous phishing operations).',
    },
    {
      key: 'email_domain_mismatch',
      label: 'Branding Domain Mismatch Check',
      description: 'Audits whether the recruiter sender email domain matches official company websites and corporate registry records.',
      failMsg: 'Flagged: Contact email domain mismatches the official company domain name.',
    },
    {
      key: 'young_domain',
      label: 'Domain Registration Age Audit',
      description: 'Queries whois records to check if the recruitment domain was created recently (< 90 days ago).',
      failMsg: 'Flagged: Recruitment domain is newly created (highly correlated with fresh spoofing campaigns).',
    },
    {
      key: 'suspicious_url',
      label: 'URL Redirect & Masking Audit',
      description: 'Checks the application link for link shorteners (bit.ly, tinyurl) or suspicious numerical IP routing designed to bypass browser firewalls.',
      failMsg: 'Flagged: Application link contains redirection script templates or suspicious domains.',
    },
    {
      key: 'requests_sensitive_data',
      label: 'Credential / PII Harvesting Check',
      description: 'Checks descriptions for payment processing demands, upfront training fees, bank accounts, or scans of security numbers.',
      failMsg: 'Critical Flag: Text contains requests for pre-employment funds or sensitive PII.',
    },
    {
      key: 'high_urgency',
      label: 'Linguistic Pressure Audit',
      description: 'NLP scan for manipulative vocabulary, high-pressure urgency cues, and promises of high returns with minimal effort.',
      failMsg: 'Flagged: Low-trust high-pressure keywords identified in listing text.',
    },
    {
      key: 'weak_company_profile',
      label: 'Company Profile Completeness Check',
      description: 'Verifies presence of registered logos, physical addresses, and historical verification indexes.',
      failMsg: 'Flagged: Listing lacks company profile details or historic data.',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Back Button */}
      <div>
        <Link 
          to={`/results/${analysis._id}`} 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#6B7280] hover:text-[#0D1B2A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assessment Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-[#132238]">Forensic Verification Vectors</h1>
        <p className="text-[#6B7280] text-xs font-semibold">
          Detailed checklist of system flags and heuristics for <span className="text-[#0D1B2A]">{analysis.title}</span> at <span className="text-[#0D1B2A]">{analysis.company}</span>.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flagMeta.map((flag) => {
          const isFlagged = flags[flag.key];
          return (
            <div
              key={flag.key}
              className={`p-5 rounded-[20px] border transition-all duration-200 bg-white ${
                isFlagged 
                  ? 'border-red-200 shadow-sm' 
                  : 'border-[#E3EAF5] shadow-[0_8px_30px_rgba(15,23,42,.04)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[#132238]">{flag.label}</h3>
                  <p className="text-[10px] text-[#6B7280] leading-relaxed font-semibold">{flag.description}</p>
                </div>
                {isFlagged ? (
                  <div className="h-8 w-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#E74C3C] flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#E8F8F0] border border-[#BCE8D1] flex items-center justify-center text-[#43B97F] flex-shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3.5 border-t border-[#E3EAF5]">
                {isFlagged ? (
                  <span className="text-[10px] font-bold text-[#E74C3C]">{flag.failMsg}</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#43B97F]">Passed: No threat signatures verified.</span>
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
