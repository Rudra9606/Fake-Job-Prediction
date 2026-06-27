import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Calendar, Info, Clock } from 'lucide-react';

const DomainVerification = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Dynamic list of audited domains
  const [historyList, setHistoryList] = useState([
    { name: 'microsoft.com', registrar: 'MarkMonitor Inc.', score: 98, status: 'secure', label: 'Safe corporate registrar' },
    { name: 'cloudnexus-careers.net', registrar: 'Namecheap, Inc.', score: 28, status: 'suspicious', label: 'High Risk - Created 12 days ago' },
    { name: 'google.com', registrar: 'MarkMonitor Inc.', score: 99, status: 'secure', label: 'Safe - Verified domain registry' },
    { name: 'verified-hr-portal.xyz', registrar: 'Hostinger', score: 15, status: 'danger', label: 'Critical Risk - Phishing indicators' },
    { name: 'github.com', registrar: 'MarkMonitor Inc.', score: 97, status: 'secure', label: 'Safe corporate registrar' },
  ]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setResult(null);

    // Simulate domain security check details
    setTimeout(() => {
      const cleanDomain = domain.toLowerCase().replace(/https?:\/\//, '').replace('www.', '').split('/')[0];
      const isScamRelated = /jobs|careers-update|easy-money|pay-fee/i.test(cleanDomain);
      
      let score = 92;
      let age = '4 years, 5 months';
      let creationDate = 'January 12, 2022';
      let sslIssuer = 'DigiCert TLS RSA SHA256 2020 CA1';
      let sslStatus = 'Valid (Expires in 280 days)';
      let status = 'secure';

      if (isScamRelated) {
        score = 24;
        age = '12 days';
        creationDate = 'June 3, 2026';
        sslIssuer = 'Let\'s Encrypt Authority X3';
        sslStatus = 'Valid (Short-term 90-day cert)';
        status = 'suspicious';
      }

      const scanResult = {
        domain: cleanDomain,
        score,
        age,
        creationDate,
        sslIssuer,
        sslStatus,
        status: isScamRelated ? 'suspicious' : 'secure',
        registrar: isScamRelated ? 'Namecheap, Inc.' : 'GoDaddy.com, LLC',
        reputation: isScamRelated ? 'High Risk - Flagged for recent registrar activity' : 'Safe - Domain carries clean web presence'
      };

      setResult(scanResult);
      
      // Dynamically add to history state
      setHistoryList(prev => [
        {
          name: scanResult.domain,
          registrar: scanResult.registrar,
          score: scanResult.score,
          status: scanResult.status,
          label: isScamRelated ? 'High Risk - Created recently' : 'Safe - Verified registry presence'
        },
        ...prev
      ]);
      setLoading(false);
    }, 1200);
  };

  // Removed static list

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <h1 className="text-4xl sm:text-5xl font-black text-[#5c59e8] tracking-tight">
          Domain Reputation Checker
        </h1>
        <p className="text-slate-400 text-[13px] font-semibold max-w-xl mx-auto leading-relaxed">
          Verify domain registration histories, registrar details, SSL certificates, and security reputations.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com or company-careers.org"
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3.5 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-xs font-semibold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-xl bg-[#5c59e8] hover:bg-[#4a46d6] px-6 py-3.5 font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer text-xs shrink-0"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Check Domain</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Panel */}
      {result ? (
        <div className="bg-white border border-slate-200 p-8 rounded-[24px] space-y-8 shadow-sm animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">{result.domain}</h2>
              <p className="text-xs text-slate-400 font-bold mt-1">Registrar: {result.registrar}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">Security Score</span>
                <span className={`text-2xl font-extrabold ${result.status === 'secure' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {result.score}/100
                </span>
              </div>
              {result.status === 'secure' ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                  <ShieldAlert className="h-5.5 w-5.5" />
                </div>
              )}
            </div>
          </div>

          {/* Details Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="font-black text-slate-800 flex items-center space-x-2 text-xs">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Domain Creation & Age</span>
              </h3>
              <div className="text-[11px] text-slate-500 font-bold space-y-1.5">
                <p>Created on: <span className="text-slate-800 font-extrabold">{result.creationDate}</span></p>
                <p>Domain Age: <span className="text-slate-800 font-extrabold">{result.age}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="font-black text-slate-800 flex items-center space-x-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span>SSL Certificate Details</span>
              </h3>
              <div className="text-[11px] text-slate-500 font-bold space-y-1.5">
                <p>Issuer: <span className="text-slate-800 font-extrabold">{result.sslIssuer}</span></p>
                <p>Expiry: <span className="text-slate-800 font-extrabold">{result.sslStatus}</span></p>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
              {result.status === 'secure' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Security Reputation Findings</h4>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{result.reputation}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Domain Audit History Table */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Clock className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Domain Security Audits History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider font-bold text-[9px] border-b border-slate-100 pb-3">
                    <th className="py-2.5 font-black">Domain Name</th>
                    <th className="py-2.5 px-4 font-black">Registrar</th>
                    <th className="py-2.5 px-4 font-black">Score</th>
                    <th className="py-2.5 px-4 font-black">Risk Details</th>
                    <th className="py-2.5 pl-4 text-right font-black">Reputation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600 font-semibold">
                  {historyList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900 flex items-center space-x-2">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-4">{item.registrar}</td>
                      <td className="py-3 px-4 font-mono font-black">{item.score}/100</td>
                      <td className="py-3 px-4 text-slate-450">{item.label}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[8.5px] font-black uppercase tracking-wider ${
                          item.status === 'secure' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.status === 'suspicious' 
                            ? 'bg-orange-50 text-orange-655 border-orange-100'
                            : 'bg-red-50 text-red-500 border-red-100'
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

          {/* Guidelines Section */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Info className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">DNS Reputation Guidelines</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 font-semibold leading-relaxed">
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">1. Registrar Age Check</strong>
                <p>New domains (created less than 30 days ago) are highly suspicious. Genuine corporate portals carry established histories.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">2. SSL Authority Check</strong>
                <p>High-risk sites often leverage short-term, free SSL certificates without extensive business entity verification.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">3. TLD Reputation</strong>
                <p>Top-level domains such as .xyz, .cf, .tk, and .ml represent cheap or free registrations frequently abused by scammers.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainVerification;
