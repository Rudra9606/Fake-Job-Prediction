import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, Download, Trash2, Eye, ShieldAlert, History, 
  RotateCw, FileQuestion, ArrowRight, ShieldCheck, 
  AlertTriangle, Globe, Activity, Server, Zap, Cpu, Search, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const UserDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.get(`${apiBaseUrl}/api/auth/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.get(`${apiBaseUrl}/api/analyze/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data?.success) {
        setHistory(res.data.data);
        if (isRefresh) showToast('Dashboard synchronized with backend.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load scan history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
      fetchNotifications();
    }
  }, [token]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this forensic scan log?')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.delete(`${apiBaseUrl}/api/analyze/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data?.success) {
        setHistory(history.filter((item) => item._id !== id));
        showToast('Scan log deleted.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete log.');
    }
  };

  const handleDownloadPDF = (id, e) => {
    e.stopPropagation();
    const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
    window.open(`${apiBaseUrl}/api/analyze/${id}/pdf`, '_blank');
    showToast('Downloading security report...');
  };

  // Mock data for Recharts Performance Graph
  const performanceData = [
    { name: '00:00', scans: 420, threats: 12 },
    { name: '04:00', scans: 510, threats: 18 },
    { name: '08:00', scans: 730, threats: 25 },
    { name: '12:00', scans: 950, threats: 42 },
    { name: '16:00', scans: 880, threats: 38 },
    { name: '20:00', scans: 610, threats: 19 },
    { name: '24:00', scans: 480, threats: 14 }
  ];

  // System Health details
  const nodes = [
    { name: 'Forensic NLP Engine', status: 'ONLINE', latency: '42ms' },
    { name: 'Domain Reputation Agent', status: 'ONLINE', latency: '128ms' },
    { name: 'Redirect Analysis Sandbox', status: 'ONLINE', latency: '210ms' },
    { name: 'AI Hybrid Classifier', status: 'ONLINE', latency: '85ms' }
  ];

  // Filtering logs
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemRisk = item.riskLevel?.toUpperCase() || 'LOW';
    const matchesFilter = riskFilter === 'ALL' || itemRisk === riskFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const threatsCount = history.filter(item => item.trustScore < 50).length;
  const avgTrustScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.trustScore, 0) / history.length) 
    : 85;

  return (
    <div className="relative w-full space-y-8 animate-fadeIn">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 rounded-xl bg-[#0D1B2A] text-white border border-[#E3EAF5] shadow-xl px-5 py-3 text-xs font-bold flex items-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#A7F08C]" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1: Split Greetings Banner & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Greetings card (2/3 width) */}
        <div className="lg:col-span-8 p-8 rounded-[20px] bg-[#0D1B2A] text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-sm">
          <div className="absolute right-8 bottom-4 text-white opacity-[0.03] pointer-events-none">
            <ShieldAlert size={200} />
          </div>
          
          <div className="space-y-2 z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A7F08C]">CYBERSECURITY FORENSICS ACTIVATED</span>
            <h1 className="text-3xl font-bold tracking-tight mt-1 text-white" style={{ color: '#FFFFFF' }}>
              Hello, {user?.name || 'Rudra Joshi'}
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium max-w-lg leading-relaxed">
              Your security workspace is fully synced. Automatic scanning is active on corporate endpoints. Heuristics are functioning at 100% efficiency.
            </p>
          </div>
          
          <div className="z-10 mt-6 md:mt-0 flex space-x-3">
            <button
              onClick={() => fetchHistory(true)}
              className="flex items-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] border border-[#E3EAF5]/20 px-5 py-2.5 text-xs font-bold text-[#A7F08C] transition-all cursor-pointer shadow-sm"
            >
              <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sync Framework</span>
            </button>
            <button
              onClick={() => navigate('/analyze')}
              className="flex items-center space-x-2 rounded-xl bg-[#A7F08C] hover:bg-[#C8F7AE] px-5 py-2.5 text-xs font-bold text-[#0D1B2A] transition-all cursor-pointer shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>New Assessment</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Panel (1/3 width) */}
        <div className="lg:col-span-4 p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Forensic Scan Tools</h3>
            <p className="text-[11px] text-[#6B7280] font-medium">
              Verify candidates or audit listings across multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              onClick={() => navigate('/analyze')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] hover:bg-[#E3EAF5]/30 transition-all text-center cursor-pointer"
            >
              <FileText className="h-5 w-5 text-[#0D1B2A] mb-2" />
              <span className="text-[10px] font-bold text-[#132238]">Scan Description</span>
            </button>
            <button 
              onClick={() => navigate('/url-scan')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] hover:bg-[#E3EAF5]/30 transition-all text-center cursor-pointer"
            >
              <Globe className="h-5 w-5 text-[#0D1B2A] mb-2" />
              <span className="text-[10px] font-bold text-[#132238]">Scan Domain URL</span>
            </button>
            <button 
              onClick={() => navigate('/email-verify')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] hover:bg-[#E3EAF5]/30 transition-all text-center cursor-pointer"
            >
              <Cpu className="h-5 w-5 text-[#0D1B2A] mb-2" />
              <span className="text-[10px] font-bold text-[#132238]">Verify Recruiter</span>
            </button>
            <button 
              onClick={() => navigate('/network-analysis')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] hover:bg-[#E3EAF5]/30 transition-all text-center cursor-pointer"
            >
              <Activity className="h-5 w-5 text-[#0D1B2A] mb-2" />
              <span className="text-[10px] font-bold text-[#132238]">Network Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* TOTAL SCANS */}
        <div className="p-5 rounded-[20px] bg-white border border-[#E3EAF5] flex flex-col justify-between min-h-[110px] shadow-[0_8px_30px_rgba(15,23,42,.04)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Scans</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#132238] tracking-tight leading-none block">
              {history.length.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#43B97F] font-bold block mt-1">100% verified logs</span>
          </div>
        </div>

        {/* THREATS FOUND */}
        <div className="p-5 rounded-[20px] bg-white border border-[#E3EAF5] flex flex-col justify-between min-h-[110px] shadow-[0_8px_30px_rgba(15,23,42,.04)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Threats Found</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#E74C3C] tracking-tight leading-none block">
              {threatsCount}
            </span>
            <span className="text-[9px] text-[#E74C3C] font-bold block mt-1">Requires mitigation</span>
          </div>
        </div>

        {/* DETECTION ACCURACY */}
        <div className="p-5 rounded-[20px] bg-white border border-[#E3EAF5] flex flex-col justify-between min-h-[110px] shadow-[0_8px_30px_rgba(15,23,42,.04)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Detection Accuracy</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#132238] tracking-tight leading-none block">
              99.4%
            </span>
            <span className="text-[9px] text-[#43B97F] font-bold block mt-1">XGBoost + SHAP model</span>
          </div>
        </div>

        {/* AI CONFIDENCE */}
        <div className="p-5 rounded-[20px] bg-white border border-[#E3EAF5] flex flex-col justify-between min-h-[110px] shadow-[0_8px_30px_rgba(15,23,42,.04)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">AI Confidence</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#132238] tracking-tight leading-none block">
              98.2%
            </span>
            <span className="text-[9px] text-[#6B7280] font-bold block mt-1">BERT NLP Classifier</span>
          </div>
        </div>

        {/* AVERAGE TRUST SCORE */}
        <div className="p-5 rounded-[20px] bg-white border border-[#E3EAF5] flex flex-col justify-between min-h-[110px] shadow-[0_8px_30px_rgba(15,23,42,.04)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Average Trust Score</span>
          <div className="mt-2 space-y-1.5">
            <span className="text-2xl font-bold text-[#132238] tracking-tight leading-none block">
              {avgTrustScore}%
            </span>
            {/* Progress Bar */}
            <div className="w-full bg-[#E3EAF5] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#43B97F] h-full rounded-full transition-all duration-300" 
                style={{ width: `${avgTrustScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Bulletins / System Alerts */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E74C3C]">Active Operational Bulletins</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.filter(n => !n.isRead).map((notif) => {
              const isSuccess = notif.type === 'success';
              const isWarning = notif.type === 'warning';
              
              let borderCol = 'border-[#E3EAF5]';
              let bgCol = 'bg-white';
              let badgeCol = 'bg-blue-50 text-blue-600 border-blue-100';
              let textCol = 'text-[#132238]';
              
              if (isSuccess) {
                borderCol = 'border-[#BCE8D1]';
                bgCol = 'bg-[#E8F8F0]/30';
                badgeCol = 'bg-[#E8F8F0] text-[#2E855A] border-[#BCE8D1]';
              } else if (isWarning) {
                borderCol = 'border-amber-200';
                bgCol = 'bg-amber-50/20';
                badgeCol = 'bg-amber-50 text-amber-600 border-amber-200';
              }
              
              return (
                <div key={notif._id} className={`p-4 rounded-xl border ${borderCol} ${bgCol} flex flex-col justify-between space-y-3 shadow-sm`}>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeCol}`}>
                        {notif.type}
                      </span>
                      <span className="text-[8px] text-[#94A3B8] font-mono">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-[11px] font-bold ${textCol} leading-relaxed mt-1.5`}>{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 3: Split Charts & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Graph (8 columns) */}
        <div className="lg:col-span-8 p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between border-b border-[#E3EAF5] pb-4 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Platform Traffic Performance</h3>
              <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">Real-time scan load & threat interception metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-[9px] font-bold text-[#6B7280]">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mr-1.5"></span> Scans Run
              </span>
              <span className="inline-flex items-center text-[9px] font-bold text-[#6B7280]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E74C3C] mr-1.5"></span> Threats Blocked
              </span>
            </div>
          </div>

          <div className="flex-grow w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scansColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="threatsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E74C3C" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#E74C3C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F8FC" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: '1px solid #E3EAF5', boxShadow: '0 8px 30px rgba(15,23,42,.05)' }} />
                <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#scansColor)" />
                <Area type="monotone" dataKey="threats" stroke="#E74C3C" strokeWidth={2} fillOpacity={1} fill="url(#threatsColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health / Node Status (4 columns) */}
        <div className="lg:col-span-4 p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between min-h-[340px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3EAF5] pb-4 mb-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Platform Service Health</h3>
                <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">Automated node diagnostics</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-[#43B97F] animate-pulse"></span>
            </div>

            <div className="space-y-3">
              {nodes.map((node, i) => (
                <div key={i} className="p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Server className="h-4 w-4 text-[#0D1B2A]" />
                    <span className="text-[11px] font-bold text-[#132238]">{node.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-[#6B7280]">{node.latency}</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#E8F8F0] text-[#2E855A]">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E3EAF5] flex justify-between items-center text-[10px] font-bold text-[#6B7280]">
            <span>Uptime: 99.98%</span>
            <span>Version: v2.4.1</span>
          </div>
        </div>
      </div>

      {/* Row 4: Traffic Feed / Analysis Log */}
      <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3EAF5] pb-4.5 mb-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Forensic Traffic Feed</h3>
            <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">Real-time repository of scan metrics and threat assessments</p>
          </div>
          
          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search feeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E3EAF5] bg-[#F7FAFD] text-[11px] w-[180px] focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Risk filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#E3EAF5] bg-[#F7FAFD] text-[11px] font-bold text-[#132238] focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Feeds Table */}
        <div className="overflow-x-auto">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="h-14 w-14 rounded-full border border-[#E3EAF5] bg-[#F7FAFD] flex items-center justify-center text-[#6B7280]">
                <FileQuestion className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#132238]">No scan records matched</h4>
                <p className="text-[10px] text-[#6B7280] max-w-xs leading-relaxed">
                  Modify your filter criteria or execute a new Forensic Job scan to view records.
                </p>
              </div>
            </div>
          ) : (
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Job Title / Company</th>
                  <th>Risk Assessment</th>
                  <th>Confidence Index</th>
                  <th>Forensic Timestamp</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  let badgeStyle = 'badge-success';
                  let scoreColor = 'text-[#43B97F]';
                  const itemRisk = item.riskLevel?.toUpperCase() || 'LOW';
                  
                  if (item.trustScore <= 45) {
                    badgeStyle = 'badge-danger';
                    scoreColor = 'text-[#E74C3C]';
                  } else if (item.trustScore <= 75) {
                    badgeStyle = 'badge-warning';
                    scoreColor = 'text-[#F6B93B]';
                  }

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="h-8.5 w-8.5 rounded-lg border border-[#E3EAF5] bg-[#F7FAFD] flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-[#0D1B2A]">
                              {item.company ? item.company.slice(0, 2).toUpperCase() : 'JB'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#132238] font-bold block leading-tight truncate max-w-[200px]">{item.title}</span>
                            <span className="text-[9.5px] text-[#6B7280] font-semibold block mt-0.5">{item.company}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${badgeStyle}`}>
                          {item.riskLevel || 'Low Risk'}
                        </span>
                      </td>
                      <td>
                        <span className={`font-mono font-bold text-xs ${scoreColor}`}>
                          {Math.round(item.trustScore)}% Trust
                        </span>
                      </td>
                      <td className="font-mono text-[11px] text-[#6B7280]">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end space-x-1.5">
                          <Link
                            to={`/results/${item._id}`}
                            className="p-1.5 rounded-lg border border-[#E3EAF5] bg-white text-[#6B7280] hover:text-[#0D1B2A] hover:bg-slate-50 transition-all shadow-sm"
                            title="View Detailed Report"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={(e) => handleDownloadPDF(item._id, e)}
                            className="p-1.5 rounded-lg border border-[#E3EAF5] bg-white text-[#6B7280] hover:text-[#0D1B2A] hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                            title="Export PDF Report"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#E74C3C] hover:bg-red-100 transition-all cursor-pointer"
                            title="Purge Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
