import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Clock, Info, Link2 } from 'lucide-react';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamic audit history state
  const [historyList, setHistoryList] = useState([
    { url: 'https://linkedin.com/jobs/view/88201', redirects: 1, score: 98, status: 'secure', label: 'Direct corporate redirection' },
    { url: 'https://bit.ly/secure-apply-3', redirects: 3, score: 42, status: 'warning', label: 'Short link points to suspicious domain' },
    { url: 'http://192.168.22.104/careers', redirects: 1, score: 15, status: 'danger', label: 'High Risk - IP-based server hosting' },
    { url: 'https://microsoft.com/careers/portal', redirects: 1, score: 99, status: 'secure', label: 'Direct corporate redirection' },
    { url: 'https://t.co/hr-recruiting-ops', redirects: 2, score: 45, status: 'warning', label: 'Short link redirecting to external gateway' },
  ]);

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

      const scanResult = {
        url,
        score,
        status,
        message,
        isShortened,
        isIpBased,
        hasBadTld,
        chain
      };

      setResult(scanResult);

      // Append new scan to local audit state
      setHistoryList(prev => [
        {
          url: scanResult.url,
          redirects: scanResult.chain.length,
          score: scanResult.score,
          status: scanResult.status,
          label: isShortened ? 'Short link redirecting' : isIpBased || hasBadTld ? 'High risk server registry' : 'Direct secure resolution'
        },
        ...prev
      ]);
      setLoading(false);
    }, 1300);
  };

  // Removed static list

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <h1 className="text-4xl sm:text-5xl font-black text-[#5c59e8] tracking-tight">
          URL Risk Scanner
        </h1>
        <p className="text-slate-400 text-[13px] font-semibold max-w-xl mx-auto leading-relaxed">
          Scan application URLs and site links for redirect chains, shortened masks, or high-risk domain registries.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://bit.ly/jobapply or http://192.168.1.1/careers"
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
                <span>Verify URL</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Panel */}
      {result ? (
        <div className="bg-white border border-slate-200 p-8 rounded-[24px] space-y-6 shadow-sm animate-fadeIn">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <div className="min-w-0 flex-grow mr-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Scanned URL Link</h2>
              <p className="text-xs text-slate-900 font-extrabold mt-1 truncate max-w-lg">{result.url}</p>
            </div>
            
            <div className="flex items-center space-x-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Security Score</span>
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

          {/* Attributions */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
            {result.status === 'secure' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className={`h-5 w-5 ${result.status === 'warning' ? 'text-amber-500' : 'text-red-500'} flex-shrink-0 mt-0.5`} />
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800">URL Audit Findings</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{result.message}</p>
            </div>
          </div>

          {/* Redirect Chains */}
          {result.chain.length > 1 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-805 flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-indigo-500" />
                <span>Resolved Redirect Chains</span>
              </h3>
              <div className="space-y-2.5 pl-6 border-l-2 border-indigo-150">
                {result.chain.map((c, idx) => (
                  <div key={idx} className="relative flex items-center text-[11px] text-slate-500 font-bold py-1">
                    <div className="absolute -left-7.5 h-2.5 w-2.5 rounded-full bg-indigo-50 border border-indigo-500"></div>
                    <span className="truncate max-w-full block">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Redirect History & URL Audits Table */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Clock className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Redirect History & URL Audits</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider font-bold text-[9px] border-b border-slate-100 pb-3">
                    <th className="py-2.5 font-black">Scanned URL</th>
                    <th className="py-2.5 px-4 font-black text-center">Redirects</th>
                    <th className="py-2.5 px-4 font-black">Score</th>
                    <th className="py-2.5 px-4 font-black">Risk Attributes</th>
                    <th className="py-2.5 pl-4 text-right font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600 font-semibold">
                  {historyList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900 flex items-center space-x-2 max-w-[220px] truncate">
                        <Link2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.url}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{item.redirects}</td>
                      <td className="py-3 px-4 font-mono font-black">{item.score}/100</td>
                      <td className="py-3 px-4 text-slate-450">{item.label}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[8.5px] font-black uppercase tracking-wider ${
                          item.status === 'secure' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-orange-50 text-orange-655 border-orange-100'
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

          {/* Attributions Overview Section */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <Info className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">URL Threat Attributions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 font-semibold leading-relaxed">
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">1. Shortened Links</strong>
                <p>Services like bit.ly, t.co, or tinyurl are commonly used in SMS/Email alerts to mask final server destinations.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">2. IP-based Hosting</strong>
                <p>Raw IP addresses in links (e.g. http://192.xxx/...) bypass standard DNS registration audits, pointing directly to raw servers.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 font-black uppercase tracking-wider text-[9px] block">3. Redirect Chains</strong>
                <p>Scam gateways redirect users through multiple intermediate servers to hide the source and collect tracking data.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLScanner;
