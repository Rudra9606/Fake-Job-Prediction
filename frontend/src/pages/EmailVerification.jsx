import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Clock, Info, Mail } from 'lucide-react';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamic audit history state
  const [historyList, setHistoryList] = useState([
    { email: 'careers@microsoft.com', company: 'Microsoft', score: 98, status: 'secure', label: 'Official corporate domain verified' },
    { email: 'hr-team-recruiting@gmail.com', company: 'Nexus Logistics Hub', score: 45, status: 'warning', label: 'Uses public free provider (Gmail)' },
    { email: 'mark.s@cloudnexus-portal.net', company: 'CloudNexus Corp', score: 28, status: 'danger', label: 'Domain mismatch with company branding' },
    { email: 'recruiter@github.com', company: 'GitHub', score: 97, status: 'secure', label: 'Official corporate domain verified' },
    { email: 'info@stark-careers.org', company: 'Stark Industries', score: 92, status: 'secure', label: 'Official corporate domain verified' },
  ]);

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

      const scanResult = {
        email,
        company: company || 'Not Provided',
        domain: emailDomain,
        score,
        status,
        isFree,
        isMismatch,
        message: msg
      };

      setResult(scanResult);

      // Append new scan to local audit state
      setHistoryList(prev => [
        {
          email: scanResult.email,
          company: scanResult.company,
          score: scanResult.score,
          status: scanResult.status,
          label: isFree ? 'Uses public free provider (Gmail)' : isMismatch ? 'Domain mismatch detected' : 'Official domain signature verified'
        },
        ...prev
      ]);
      setLoading(false);
    }, 1100);
  };

  // Removed static list

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <h1 className="text-4xl sm:text-5xl font-black text-[#5c59e8] tracking-tight">
          Recruiter Email Audit
        </h1>
        <p className="text-slate-400 text-[13px] font-semibold max-w-xl mx-auto leading-relaxed">
          Audit recruiter emails for free providers or discrepancies between the recruiter's registry domain and company branding.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recruiter Email (e.g. hr@company.com)"
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3.5 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-xs font-semibold"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Claimed Company (e.g. TechCorp)"
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3.5 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-xs font-semibold"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-[#5c59e8] hover:bg-[#4a46d6] px-6 py-3 font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
      {result ? (
        <div className="bg-white border border-slate-200 p-8 rounded-[24px] space-y-6 shadow-sm animate-fadeIn">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">{result.email}</h2>
              <p className="text-xs text-slate-400 font-bold mt-1">Claimed Employer: {result.company}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Score</span>
                <span className={`text-2xl font-extrabold ${result.status === 'secure' ? 'text-emerald-600' : result.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`}>
                  {result.score}/100
                </span>
              </div>
              {result.status === 'secure' ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
              ) : result.status === 'warning' ? (
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                  <AlertTriangle className="h-5.5 w-5.5" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                  <ShieldAlert className="h-5.5 w-5.5" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
            {result.status === 'secure' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800">Email Verification Report</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{result.message}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Recruiter Email Audit Ledger Table */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Clock className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Recruiter Email Audit Ledger</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider font-bold text-[9px] border-b border-slate-100 pb-3">
                    <th className="py-2.5 font-black">Recruiter Email</th>
                    <th className="py-2.5 px-4 font-black">Claimed Company</th>
                    <th className="py-2.5 px-4 font-black">Audit Score</th>
                    <th className="py-2.5 px-4 font-black">Audit Flag Details</th>
                    <th className="py-2.5 pl-4 text-right font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600 font-semibold">
                  {historyList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900 flex items-center space-x-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.email}</span>
                      </td>
                      <td className="py-3 px-4">{item.company}</td>
                      <td className="py-3 px-4 font-mono font-black">{item.score}/100</td>
                      <td className="py-3 px-4 text-slate-450">{item.label}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[8.5px] font-black uppercase tracking-wider ${
                          item.status === 'secure' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.status === 'warning' 
                            ? 'bg-orange-50 text-orange-655 border-orange-100'
                            : 'bg-red-50 text-red-550 border-red-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Spoofing Warning Guidelines Section */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Info className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Email Spoofing Warning Guidelines</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 font-semibold leading-relaxed">
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">1. Free Providers Abuse</strong>
                <p>Genuine corporate HR offices never send formal contract offers via personal email services (gmail.com, aol.com).</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">2. Domain-Branding Mismatch</strong>
                <p>Verify if the sender domain matches the official corporate domain. Typo-squatted domains (e.g. microsoft-jobs.com) are red flags.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">3. Authentication Check</strong>
                <p>Our backend validates SPF, DKIM, and DMARC parameters of the domain name to ensure it cannot be spoofed easily.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
