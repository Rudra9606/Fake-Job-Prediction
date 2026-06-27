import React, { useState } from 'react';
import { History, Search, ShieldAlert, Terminal, FileDown, PlusCircle, Filter } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2026-06-25 23:02:14', severity: 'CRITICAL', category: 'System', message: 'System isolation engaged - Emergency Lockdown protocol initialized by Operator.', operator: 'Rudra Joshi' },
    { id: 2, timestamp: '2026-06-25 22:58:45', severity: 'WARNING', category: 'Scan', message: 'High-Risk domain flagged: cloudnexus-careers.net score resolved at 28/100.', operator: 'Surveillance Engine' },
    { id: 3, timestamp: '2026-06-25 22:40:02', severity: 'INFO', category: 'Policy', message: 'Heuristic parameter updated: "Block High-Risk TLD Registries" enabled.', operator: 'Rudra Joshi' },
    { id: 4, timestamp: '2026-06-25 21:15:30', severity: 'INFO', category: 'Auth', message: 'Administrator authorization handshake completed successfully from IP 192.168.1.104.', operator: 'Rudra Joshi' },
    { id: 5, timestamp: '2026-06-25 20:30:12', severity: 'WARNING', category: 'Scan', message: 'Email mismatch audit flagged: recruiter claims "GitHub" but sent via mail-portal.net.', operator: 'Surveillance Engine' },
    { id: 6, timestamp: '2026-06-25 18:45:00', severity: 'INFO', category: 'System', message: 'Hotpatch payload v4.2.8 deployment initialized and hash registry synchronized.', operator: 'System Engine' },
  ]);

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Handler to inject a new mock alert
  const handleSimulateIncident = () => {
    const categories = ['Scan', 'Auth', 'System', 'Policy'];
    const severities = ['INFO', 'WARNING', 'CRITICAL'];
    const messages = [
      'Failed root authorization handshake from IP 45.22.10.8.',
      'Phishing redirect chain detected on scanned URL: http://jobs-payout-fee.xyz.',
      'DKIM signature check failed on recruiter email from hr@microsoft-recruiting-verify.com.',
      'Unauthorized database synchronization query intercepted and quarantined.',
    ];

    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity: randomSeverity,
      category: categories[Math.floor(Math.random() * categories.length)],
      message: randomMsg,
      operator: randomSeverity === 'CRITICAL' ? 'System Quarantine' : 'Rudra Joshi',
    };

    setLogs(prev => [newLog, ...prev]);
  };

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#132238] tracking-tight">Security Audit Logs</h1>
        <p className="text-xs text-[#6B7280] font-semibold mt-1">
          Review automated threat analysis queues, operator lockdown parameters, policy updates, and endpoint diagnostics.
        </p>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto">
          <Filter className="h-4 w-4 text-[#94A3B8] shrink-0 mr-1.5" />
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              severityFilter === 'ALL' 
                ? 'bg-[#081B2F] text-white border-transparent' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setSeverityFilter('INFO')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              severityFilter === 'INFO' 
                ? 'bg-[#E8F8F0] text-[#2E855A] border-[#BCE8D1]' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setSeverityFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              severityFilter === 'WARNING' 
                ? 'bg-amber-50 text-[#b27f12] border-amber-200' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              severityFilter === 'CRITICAL' 
                ? 'bg-red-50 text-[#ab2a1b] border-red-200' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            Critical
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleSimulateIncident}
            className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-[#081B2F] hover:bg-[#102840] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0 border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="h-4 w-4 text-[#A7F08C]" />
            <span>Simulate Incident</span>
          </button>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-4">
        {/* Search Bar inside Card */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search message details, operators, or categories..."
            className="w-full pl-10 text-xs text-[#132238]"
          />
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="enterprise-table animate-fadeIn">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Category</th>
                <th>Incident Details Description</th>
                <th className="text-right">Authorized Operator</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  let badgeStyle = 'badge-success';
                  if (log.severity === 'WARNING') {
                    badgeStyle = 'badge-warning';
                  } else if (log.severity === 'CRITICAL') {
                    badgeStyle = 'badge-danger';
                  }

                  return (
                    <tr key={log.id}>
                      <td className="font-mono text-[11px] text-[#6B7280] shrink-0">{log.timestamp}</td>
                      <td>
                        <span className={`badge ${badgeStyle}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="font-bold text-[#132238]">{log.category}</td>
                      <td className="text-[#6B7280] leading-relaxed font-semibold max-w-md">{log.message}</td>
                      <td className="text-right font-bold text-[#132238]">{log.operator}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-[#6B7280] font-bold">
                    No matching security audit trails verified.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
