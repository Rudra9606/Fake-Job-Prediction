import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, DollarSign, UserCheck, Key } from 'lucide-react';

const ScamAwareness = () => {
  const warningSigns = [
    {
      title: 'Advance Fee Demands',
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      description: 'Scammers ask candidates to pay for registration, onboarding training, or equipment setup (promising reimbursement later). Official employers NEVER charge job application fees.'
    },
    {
      title: 'Identity Harvesting',
      icon: UserCheck,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      description: 'Requests for PAN cards, Aadhaar numbers, passport scans, or bank accounts at the early interview stage. Identity theft is a core goal of fake job campaigns.'
    },
    {
      title: 'Suspicious Email/URL Domains',
      icon: Key,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      description: 'Recruiters using Gmail addresses, or redirect links pointing to non-corporate web pages. Always crosscheck company web URLs before applying.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">Scam Awareness Center</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Learn how to spot recruitment scams, verify recruiters, and secure your personal credentials.
        </p>
      </div>

      {/* Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warningSigns.map((w, idx) => {
          const Icon = w.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4 hover:border-indigo-500/15 transition-all">
              <div className={`h-10 w-10 rounded-xl ${w.bg} border border-white/5 flex items-center justify-center ${w.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-200">{w.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{w.description}</p>
            </div>
          );
        })}
      </div>

      {/* Detailed Advice */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <span>Rules for Safe Job Hunting</span>
        </h2>
        <ul className="space-y-4 text-sm text-slate-300">
          <li className="flex items-start space-x-3">
            <span className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
            <span>Always check the sender email address. Authentic corporate recruiter mailboxes use the official domain (e.g., recruiter@companyname.com).</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
            <span>If an offer seems too good to be true (like unrealistic high salaries for standard data entry work), it is highly likely a phishing trap.</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
            <span>Do not share banking, OTP, or identity documents before completing formal contract signings, and never pay upfront fees under any pretext.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScamAwareness;
