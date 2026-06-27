import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, DollarSign, UserCheck, Key } from 'lucide-react';

const ScamAwareness = () => {
  const warningSigns = [
    {
      title: 'Advance Fee Demands',
      icon: DollarSign,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      description: 'Scammers ask candidates to pay for registration, onboarding training, or equipment setup (promising reimbursement later). Official employers NEVER charge job application fees.'
    },
    {
      title: 'Identity Harvesting',
      icon: UserCheck,
      color: 'text-[#E74C3C]',
      bg: 'bg-red-50 border-red-100',
      description: 'Requests for PAN cards, Aadhaar numbers, passport scans, or bank accounts at the early interview stage. Identity theft is a core goal of fake job campaigns.'
    },
    {
      title: 'Suspicious Domains',
      icon: Key,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      description: 'Recruiters using Gmail addresses, or redirect links pointing to non-corporate web pages. Always crosscheck company web URLs before applying.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 text-[#132238] select-none animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0D1B2A]">Scam Awareness Center</h1>
        <p className="text-[#6B7280] text-sm max-w-xl mx-auto font-semibold">
          Learn how to spot recruitment scams, verify recruiters, and secure your personal credentials.
        </p>
      </div>

      {/* Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warningSigns.map((w, idx) => {
          const Icon = w.icon;
          return (
            <div key={idx} className="bg-white border border-[#E3EAF5] p-6 rounded-2xl space-y-4 hover:translate-y-[-3px] transition-all shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${w.bg} border flex items-center justify-center ${w.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#132238] text-sm uppercase tracking-wide">{w.title}</h3>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">{w.description}</p>
            </div>
          );
        })}
      </div>

      {/* Detailed Advice */}
      <div className="bg-white border border-[#E3EAF5] p-8 rounded-[20px] space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#132238] uppercase tracking-wider flex items-center space-x-2 border-b border-[#E3EAF5] pb-3.5">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>Rules for Safe Job Hunting</span>
        </h2>
        <ul className="space-y-4 text-xs sm:text-sm text-[#6B7280]">
          <li className="flex items-start space-x-3.5 font-semibold">
            <span className="h-5 w-5 rounded bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
            <span className="leading-relaxed">Always check the sender email address. Authentic corporate recruiter mailboxes use the official domain (e.g., recruiter@companyname.com).</span>
          </li>
          <li className="flex items-start space-x-3.5 font-semibold">
            <span className="h-5 w-5 rounded bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
            <span className="leading-relaxed">If an offer seems too good to be true (like unrealistic high salaries for standard data entry work), it is highly likely a phishing trap.</span>
          </li>
          <li className="flex items-start space-x-3.5 font-semibold">
            <span className="h-5 w-5 rounded bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
            <span className="leading-relaxed">Do not share banking, OTP, or identity documents before completing formal contract signings, and never pay upfront fees under any pretext.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScamAwareness;
