import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, RefreshCw, FileText, Info, HelpCircle } from 'lucide-react';

const PolicyManager = () => {
  // Policies state
  const [policies, setPolicies] = useState([
    { id: 'ssl', name: 'Enforce SSL/TLS Certificates', description: 'Reject any scanned domains/URLs that do not carry valid SSL certificates from trusted root authorities.', active: true, weight: 15 },
    { id: 'tld', name: 'Block High-Risk TLD Registries', description: 'Automatically flag domains operating on untrusted top-level domains such as .xyz, .cf, .tk, .ga.', active: true, weight: 10 },
    { id: 'spf', name: 'Validate Recruiter SPF/DKIM Records', description: 'Verify domain ownership signatures on outbound mail configurations to prevent corporate spoofing.', active: false, weight: 20 },
    { id: 'lockdown', name: 'Engage Automated Lockdown Threshold', description: 'Activate containment mode when threat logs identify 3 or more warning/critical events in 60s.', active: false, weight: 25 },
    { id: 'mfa', name: 'Enforce Admin Passkey Authorization', description: 'Require secure local password verification before modifying threat indices or system variables.', active: true, weight: 30 },
  ]);

  const [history, setHistory] = useState([
    { id: 1, action: 'Policy Override', policy: 'Enforce Admin Passkey Authorization', user: 'Rudra Joshi', time: '2 hours ago' },
    { id: 2, action: 'Policy Enabled', policy: 'Block High-Risk TLD Registries', user: 'Rudra Joshi', time: '1 day ago' },
    { id: 3, action: 'Platform Init', policy: 'Enforce SSL/TLS Certificates', user: 'System Engine', time: '3 days ago' },
  ]);

  const togglePolicy = (id) => {
    setPolicies(policies.map(p => {
      if (p.id === id) {
        const nextState = !p.active;
        // Log action
        const newLog = {
          id: Date.now(),
          action: nextState ? 'Policy Enabled' : 'Policy Disabled',
          policy: p.name,
          user: 'Rudra Joshi',
          time: 'Just now',
        };
        setHistory(prev => [newLog, ...prev]);
        return { ...p, active: nextState };
      }
      return p;
    }));
  };

  // Compute compliance score based on active policy weights
  const totalWeight = policies.reduce((acc, p) => acc + p.weight, 0);
  const activeWeight = policies.reduce((acc, p) => acc + (p.active ? p.weight : 0), 0);
  const complianceScore = Math.round((activeWeight / totalWeight) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <h1 className="text-4xl sm:text-5xl font-black text-[#5c59e8] tracking-tight">
          Security Policy Manager
        </h1>
        <p className="text-slate-400 text-[13px] font-semibold max-w-xl mx-auto leading-relaxed">
          Define heuristic verification parameters, signature strictness rules, and automated emergency containment threshold parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Policies Toggles (2/3 width) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-[#151d48] uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center space-x-2">
              <Shield className="h-4.5 w-4.5 text-[#5c59e8]" />
              <span>Active Heuristic Policies</span>
            </h3>

            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="flex items-start justify-between p-4 rounded-xl bg-[#fafafb]/50 border border-slate-100 hover:border-slate-200 transition-all gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#151d48]">{policy.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{policy.description}</p>
                  </div>
                  
                  {/* Toggle Switch Button */}
                  <button
                    onClick={() => togglePolicy(policy.id)}
                    className={`w-10 h-6.5 rounded-full p-1 transition-colors flex items-center cursor-pointer shrink-0 ${
                      policy.active ? 'bg-[#3cd856]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`bg-white h-4.5 w-4.5 rounded-full shadow-sm transition-transform duration-250 ${
                      policy.active ? 'transform translate-x-3.5' : ''
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compliance Gauge & Policy Logs (1/3 width) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Compliance Score Gauge */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm text-center space-y-5">
            <h3 className="text-xs font-black text-[#807d9b] uppercase tracking-wider block">Compliance Score</h3>
            
            <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
              {/* Circular Gauge Render */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="52" stroke="#f0f0ff" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="52" stroke="#5c59e8" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - complianceScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute space-y-0.5">
                <span className="text-2xl font-black text-[#151d48]">{complianceScore}%</span>
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Secured</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-2">
              Compliance index measures defense strictness. Activating more security policies protects endpoints.
            </p>
          </div>

          {/* Policy Logs */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#151d48] uppercase tracking-wider border-b border-slate-50 pb-2.5">
              Recent Modifications
            </h3>

            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {history.map((log) => (
                <div key={log.id} className="text-[10px] space-y-0.5 font-semibold text-slate-500">
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-extrabold">{log.action}</span>
                    <span className="text-slate-400 font-bold text-[8.5px]">{log.time}</span>
                  </div>
                  <p className="text-[9.5px] leading-tight truncate text-[#807d9b]">{log.policy}</p>
                  <span className="text-[8px] text-[#5c59e8] font-bold block">Operator: {log.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PolicyManager;
