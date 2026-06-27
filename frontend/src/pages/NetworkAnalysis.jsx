import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, ShieldCheck, Play, Terminal, Wifi, Server, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const NetworkAnalysis = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  // Generate mock traffic data
  const [trafficData, setTrafficData] = useState([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        time: `${i * 2}:00`,
        Inbound: Math.floor(Math.random() * 200) + 50,
        Outbound: Math.floor(Math.random() * 100) + 20,
      });
    }
    setTrafficData(data);

    // Dynamic traffic updates
    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const next = [...prev.slice(1)];
        const lastHour = parseInt(prev[prev.length - 1].time.split(':')[0]);
        const nextHour = (lastHour + 2) % 24;
        next.push({
          time: `${nextHour}:00`,
          Inbound: Math.floor(Math.random() * 200) + 50,
          Outbound: Math.floor(Math.random() * 100) + 20,
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = (e) => {
    e.preventDefault();
    if (!ipAddress) return;

    setScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const progressSteps = [20, 50, 75, 90, 100];
    progressSteps.forEach((progress, idx) => {
      setTimeout(() => {
        setScanProgress(progress);
        if (progress === 100) {
          setScanning(false);
          const isThreat = /^(10\.|172\.16\.|192\.168\.)/.test(ipAddress) === false || ipAddress.endsWith('.66');
          setScanResult({
            ip: ipAddress,
            scannedAt: new Date().toLocaleTimeString(),
            ports: [
              { port: 22, service: 'SSH', status: isThreat ? 'Open' : 'Closed', vulnerability: isThreat ? 'Weak SSH Password allowed' : 'None' },
              { port: 80, service: 'HTTP', status: 'Open', vulnerability: 'None' },
              { port: 443, service: 'HTTPS', status: 'Open', vulnerability: 'None' },
              { port: 3306, service: 'MySQL', status: isThreat ? 'Open' : 'Filtered', vulnerability: isThreat ? 'Unencrypted DB access' : 'None' },
              { port: 8080, service: 'HTTP-ALT', status: 'Closed', vulnerability: 'None' },
            ],
            threatLevel: isThreat ? 'Medium Risk' : 'Low Risk',
            status: isThreat ? 'warning' : 'secure',
          });
        }
      }, (idx + 1) * 600);
    });
  };

  const mockConnections = [
    { country: 'United States', ip: '104.244.42.1', port: 443, status: 'ESTABLISHED', action: 'ALLOW' },
    { country: 'Russia', ip: '185.220.101.5', port: 22, status: 'BLOCKED', action: 'BLOCK' },
    { country: 'Germany', ip: '46.165.230.12', port: 80, status: 'ESTABLISHED', action: 'ALLOW' },
    { country: 'China', ip: '222.186.30.99', port: 3306, status: 'FLAGGED', action: 'FLAG' },
    { country: 'United Kingdom', ip: '95.142.172.4', port: 443, status: 'ESTABLISHED', action: 'ALLOW' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#132238] tracking-tight">Endpoint Socket Analysis</h1>
        <p className="text-xs text-[#6B7280] font-semibold mt-1">
          Monitor inbound/outbound connection socket speeds, live bandwidth stats, and trigger local vulnerabilities port scans.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Port Scanner (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3.5 flex items-center space-x-2">
              <Server className="h-4.5 w-4.5 text-[#0D1B2A]" />
              <span>Vulnerability Port Scanner</span>
            </h3>

            <form onSubmit={handleScan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Target IP / DNS Endpoint</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="e.g. 192.168.1.66"
                  className="w-full"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={scanning}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 border border-transparent"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-[#A7F08C]" />
                    <span>Auditing Ports... {scanProgress}%</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-[#A7F08C] fill-[#A7F08C]" />
                    <span>Scan Target Endpoint</span>
                  </>
                )}
              </button>
            </form>

            {scanning && (
              <div className="w-full bg-[#F5F8FC] h-1.5 rounded-full overflow-hidden border border-[#E3EAF5] mt-2">
                <div className="bg-[#43B97F] h-full rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
              </div>
            )}
          </div>

          {scanResult && (
            <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-[#E3EAF5] pb-3">
                <div>
                  <h4 className="text-xs font-bold text-[#132238] font-mono">{scanResult.ip}</h4>
                  <span className="text-[9.5px] text-[#6B7280] font-semibold">Audited: {scanResult.scannedAt}</span>
                </div>
                <span className={`badge ${
                  scanResult.status === 'secure' 
                    ? 'badge-success' 
                    : 'badge-warning'
                }`}>
                  {scanResult.threatLevel}
                </span>
              </div>

              <div className="space-y-3 text-[11px] font-bold text-[#6B7280]">
                {scanResult.ports.map((p) => (
                  <div key={p.port} className="flex justify-between items-center py-1 border-b border-[#E3EAF5]/50 last:border-0 pb-1.5 last:pb-0">
                    <span className="text-[#132238]">Port {p.port} ({p.service})</span>
                    <div className="flex items-center space-x-2">
                      <span className={`${p.status === 'Open' ? 'text-[#E74C3C]' : p.status === 'Filtered' ? 'text-[#F6B93B]' : 'text-[#43B97F]'}`}>
                        {p.status}
                      </span>
                      {p.status === 'Open' && <span className="text-[9.5px] font-semibold text-[#6B7280]">({p.vulnerability})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Connections and Traffic (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Traffic chart */}
          <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3.5 flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-[#0D1B2A]" />
              <span>Real-time Port Bandwidth Load (Kb/s)</span>
            </h3>

            <div className="h-48 w-full text-[9px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInboundScan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#081B2F" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#081B2F" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutboundScan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43B97F" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#43B97F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F8FC" vertical={false} />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: '1px solid #E3EAF5', boxShadow: '0 8px 30px rgba(15,23,42,.05)' }} />
                  <Area type="monotone" dataKey="Inbound" stroke="#081B2F" fillOpacity={1} fill="url(#colorInboundScan)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Outbound" stroke="#43B97F" fillOpacity={1} fill="url(#colorOutboundScan)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Connections list */}
          <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3.5 flex items-center space-x-2">
              <Wifi className="h-4.5 w-4.5 text-[#0D1B2A]" />
              <span>Connected Socket Registers</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Geographic Node</th>
                    <th>Socket Address</th>
                    <th className="text-center">Active Port</th>
                    <th>Status</th>
                    <th className="text-right">Firewall Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {mockConnections.map((item, idx) => {
                    let actionBadge = 'badge-success';
                    if (item.action === 'BLOCK') {
                      actionBadge = 'badge-danger';
                    } else if (item.action === 'FLAG') {
                      actionBadge = 'badge-warning';
                    }

                    return (
                      <tr key={idx}>
                        <td className="font-bold text-[#132238]">{item.country}</td>
                        <td className="font-mono text-xs text-[#6B7280]">{item.ip}</td>
                        <td className="text-center font-mono text-xs text-[#132238]">{item.port}</td>
                        <td>
                          <span className={`font-bold ${
                            item.status === 'ESTABLISHED' ? 'text-[#43B97F]' : item.status === 'BLOCKED' ? 'text-[#E74C3C]' : 'text-[#F6B93B]'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`badge ${actionBadge}`}>
                            {item.action}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NetworkAnalysis;
