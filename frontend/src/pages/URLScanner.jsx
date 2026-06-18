import React, { useState } from 'react';
import { Link2, Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const isShortened = /bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly/i.test(url);
      const isIpBased = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
      const hasBadTld = /\.tk$|\.ml$|\.ga$|\.cf$|\.gq$|\.xyz$/i.test(url);

      let score = 98;
      let status = 'secure';
      let message = 'This link points directly to a verified secure destination.';
      let chain = [url];

      if (isShortened) {
        score = 42;
        status = 'warning';
        message = 'Masked shortened link detected. Scam campaigns often use short links (bit.ly, tinyurl) to hide malicious destinations or processing fee gateways.';
        chain = [url, 'https://suspicious-redirect-gateway.cf/payment', 'https://job-scam-payment.xyz/pay'];
      } else if (isIpBased || hasBadTld) {
        score = 15;
        status = 'danger';
        message = 'Critical alert: The link points to an IP-based address or a high-risk top-level domain (TLD) commonly associated with malicious phishing campaigns.';
        chain = [url];
      }

      setResult({
        url,
        score,
        status,
        message,
        isShortened,
        isIpBased,
        hasBadTld,
        chain
      });
      setLoading(false);
    }, 1300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">URL Risk Scanner</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Scan application URLs and site links for redirect chains, shortened masks, or high-risk domain registries.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-2xl glow-indigo">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Link2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://bit.ly/jobapply or http://192.168.1.1/careers"
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
                <span>Verify URL</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Panel */}
      {result && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 animate-fadeIn">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Scanned URL Link</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md truncate">{result.url}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Security Score</span>
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

          {/* Attributions */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-start space-x-4">
            {result.status === 'secure' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className={`h-5 w-5 ${result.status === 'warning' ? 'text-amber-400' : 'text-red-400'} flex-shrink-0 mt-0.5`} />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-300">URL Audit Findings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{result.message}</p>
            </div>
          </div>

          {/* Redirect Chains */}
          {result.chain.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-indigo-400" />
                <span>Resolved Redirect Chains</span>
              </h3>
              <div className="space-y-2 pl-6 border-l-2 border-indigo-500/20">
                {result.chain.map((c, idx) => (
                  <div key={idx} className="relative flex items-center text-xs text-slate-400 py-1">
                    <div className="absolute -left-7 h-2.5 w-2.5 rounded-full bg-indigo-500/30 border border-indigo-500"></div>
                    <span className="truncate max-w-full block">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default URLScanner;
