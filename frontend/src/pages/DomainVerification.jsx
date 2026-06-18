import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

const DomainVerification = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

      setResult({
        domain: cleanDomain,
        score,
        age,
        creationDate,
        sslIssuer,
        sslStatus,
        status,
        registrar: isScamRelated ? 'Namecheap, Inc.' : 'GoDaddy.com, LLC',
        reputation: isScamRelated ? 'High Risk - Flagged for recent registrar activity' : 'Safe - Domain carries clean web presence'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">Domain Reputation Checker</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Verify domain registration histories, registrar details, SSL certificates, and security reputations.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-2xl glow-indigo">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Globe className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com or company-careers.org"
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-indigo px-6 py-3 font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
      {result && (
        <div className="glass-panel p-8 rounded-3xl space-y-8 animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-200">{result.domain}</h2>
              <p className="text-xs text-slate-500 mt-1">Registrar: {result.registrar}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Security Score</span>
                <span className={`text-2xl font-extrabold ${result.status === 'secure' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.score}/100
                </span>
              </div>
              {result.status === 'secure' ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              )}
            </div>
          </div>

          {/* Details Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-3">
              <h3 className="font-bold text-slate-300 flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Domain Creation & Age</span>
              </h3>
              <div className="text-xs text-slate-400 space-y-1.5">
                <p>Created on: <span className="text-slate-200 font-semibold">{result.creationDate}</span></p>
                <p>Domain Age: <span className="text-slate-200 font-semibold">{result.age}</span></p>
              </div>
            </div>

            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-3">
              <h3 className="font-bold text-slate-300 flex items-center space-x-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>SSL Certificate Details</span>
              </h3>
              <div className="text-xs text-slate-400 space-y-1.5">
                <p>Issuer: <span className="text-slate-200 font-semibold">{result.sslIssuer}</span></p>
                <p>Expiry: <span className="text-slate-200 font-semibold">{result.sslStatus}</span></p>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-start space-x-4">
              {result.status === 'secure' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-300">Security Reputation Findings</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{result.reputation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainVerification;
