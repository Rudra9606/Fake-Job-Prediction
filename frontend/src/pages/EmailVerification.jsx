import React, { useState } from 'react';
import { Mail, Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const emailDomain = email.split('@')[1]?.toLowerCase().trim() || '';
      
      const FREE_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com'];
      const isFree = FREE_DOMAINS.includes(emailDomain);
      
      let isMismatch = false;
      if (company && !isFree) {
        const companyToken = company.toLowerCase().replace(/[^a-z0-9]/g, '');
        isMismatch = !emailDomain.includes(companyToken);
      }

      let score = 96;
      let status = 'secure';
      let msg = 'recruiter email address matches official corporate domain profiles.';

      if (isFree) {
        score = 45;
        status = 'warning';
        msg = 'Uses public free email provider (Gmail/Yahoo/etc.). Legitimate corporate recruiters generally contact candidates via company-registered domains.';
      } else if (isMismatch) {
        score = 28;
        status = 'danger';
        msg = `Domain mismatch. The recruiter claims to represent "${company}", but their email registrar "${emailDomain}" does not match the company branding.`;
      }

      setResult({
        email,
        company: company || 'Not Provided',
        domain: emailDomain,
        score,
        status,
        isFree,
        isMismatch,
        message: msg
      });
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">Recruiter Email Audit</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Audit recruiter emails for free providers or discrepancies between the recruiter's registry domain and company branding.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-2xl glow-indigo">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recruiter Email (e.g. hr@company.com)"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <div className="relative">
              <UserCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Claimed Company (e.g. TechCorp)"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-indigo px-6 py-3.5 font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Panel */}
      {result && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 animate-fadeIn">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200">{result.email}</h2>
              <p className="text-xs text-slate-500 mt-1">Claimed Employer: {result.company}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Score</span>
                <span className={`text-2xl font-extrabold ${result.status === 'secure' ? 'text-emerald-400' : result.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                  {result.score}/100
                </span>
              </div>
              {result.status === 'secure' ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              ) : result.status === 'warning' ? (
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-start space-x-4">
            {result.status === 'secure' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 ${result.status === 'warning' ? 'text-amber-400' : 'text-red-400'} flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-300">Email Verification Report</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
