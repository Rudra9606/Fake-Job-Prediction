import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import { 
  Users, FileText, AlertTriangle, ShieldCheck, Trash2, 
  Check, UserCheck, MessageSquare, ShieldAlert, History, Activity, Sparkles, RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard states
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [scamReports, setScamReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // 1. Fetch Stats & Chart Data
      const statsRes = await axios.get(`${apiBaseUrl}/api/admin/stats`, config);
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
        setChartData(statsRes.data.chartData);
      }

      // 2. Fetch Users
      const usersRes = await axios.get(`${apiBaseUrl}/api/admin/users`, config);
      if (usersRes.data?.success) setUsersList(usersRes.data.data);

      // 3. Fetch Scam Reports
      const scamsRes = await axios.get(`${apiBaseUrl}/api/scams`, config);
      if (scamsRes.data?.success) setScamReports(scamsRes.data.data);

      // 4. Fetch Feedbacks
      const feedbackRes = await axios.get(`${apiBaseUrl}/api/feedback`, config);
      if (feedbackRes.data?.success) setFeedbacks(feedbackRes.data.data);

      // 5. Fetch Audit Logs
      const logsRes = await axios.get(`${apiBaseUrl}/api/admin/logs`, config);
      if (logsRes.data?.success) setAuditLogs(logsRes.data.data);

    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(
        `${apiBaseUrl}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.delete(
        `${apiBaseUrl}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleScamStatusUpdate = async (reportId, newStatus) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(
        `${apiBaseUrl}/api/scams/${reportId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const formattedChartData = chartData.map(d => ({
    ...d,
    dateStr: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-[#080808]">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading Administrative Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-1">Root Administration Console</span>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">System Control Panel</h1>
          <p className="text-slate-400 text-xs mt-0.5">Global overview of database registers, complaint tickets, and audit trails.</p>
        </div>
        <button
          onClick={() => fetchAdminData(true)}
          disabled={refreshing}
          className="self-start md:self-auto flex items-center space-x-1.5 rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Control Panel</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider select-none">
        {['overview', 'users', 'scams', 'feedback', 'logs'].map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-colors relative cursor-pointer ${
                active ? 'text-purple-400 font-black' : 'hover:text-slate-300'
              }`}
            >
              {tab}
              {active && (
                <motion.div 
                  layoutId="adminTabActiveLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, count: stats?.totalUsers, label: "Total Users Registered", color: "text-purple-400", border: "hover:border-purple-500/15" },
              { icon: FileText, count: stats?.totalScans, label: "Total Scans Handled", color: "text-cyan-400", border: "hover:border-cyan-500/15" },
              { icon: AlertTriangle, count: stats?.totalScamReports, label: "Submitted Scam Forms", color: "text-red-500", border: "hover:border-red-500/15" },
              { icon: MessageSquare, count: stats?.totalFeedbacks, label: "Feedback Notes Saved", color: "text-amber-500", border: "hover:border-amber-500/15" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`bento-card ${stat.border} bg-zinc-950/20 border border-white/5 p-6 rounded-2xl`}>
                  <Icon className={`h-5 w-5 ${stat.color} mb-3`} />
                  <span className="text-3xl font-black text-slate-100 block tracking-tighter">{stat.count}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              );
            })}
          </div>

          {/* Area Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Activity className="h-4.5 w-4.5 text-purple-400" />
                <span>Daily Job Scanning Traffic</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">API Requests</span>
            </div>
            
            <div className="h-64 w-full text-xs pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminColorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dateStr" stroke="#52525b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}
                    labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="scansCount" name="Scans Run" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#adminColorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/20 text-slate-500 uppercase tracking-wider font-bold text-[9px] select-none">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role Privileges</th>
                  <th className="px-6 py-4 text-center">Total Scans</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {usersList.map((usr) => (
                  <tr key={usr._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-200">{usr.name}</td>
                    <td className="px-6 py-4 text-slate-400">{usr.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                        usr.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-zinc-800 text-slate-400 border-zinc-700'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-100">{usr.scanCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleRoleChange(usr._id, usr.role)}
                          className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:text-purple-400 hover:border-purple-500/20 transition-all cursor-pointer"
                          title="Toggle Role Privileges"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserDelete(usr._id)}
                          className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCAMS TAB */}
      {activeTab === 'scams' && (
        <div className="space-y-6">
          {scamReports.length === 0 ? (
            <div className="glass-panel p-10 text-center text-slate-500 text-xs rounded-3xl border border-white/5 bg-zinc-950/40">
              No scam complaints submitted by community users.
            </div>
          ) : (
            scamReports.map((report) => (
              <div key={report._id} className="glass-panel p-6 rounded-3xl space-y-4 border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-lg leading-tight">{report.jobTitle}</h3>
                    <p className="text-xs text-purple-400 font-bold mt-1">{report.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      report.status === 'pending' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleScamStatusUpdate(report._id, 'reviewed')}
                        className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                        title="Mark Reviewed"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-2 bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
                  <p className="leading-relaxed"><span className="text-slate-300 font-bold block mb-1">Reported Posting Text:</span> {report.jobDetails}</p>
                  <p className="leading-relaxed border-t border-white/5 pt-2 mt-2"><span className="text-slate-300 font-bold block mb-1">User Evidence Reason:</span> {report.scamDetails}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <div className="glass-panel p-10 text-center text-slate-500 text-xs rounded-3xl border border-white/5 bg-zinc-950/40">
              No feedback sheets submitted by users.
            </div>
          ) : (
            feedbacks.map((f) => (
              <div key={f._id} className="glass-panel p-6 rounded-3xl space-y-4 border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base leading-tight">{f.subject}</h3>
                    <p className="text-xs text-slate-400 mt-1">{f.name} ({f.email})</p>
                  </div>
                  <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-[11px] font-black text-purple-400">
                    ★ {f.rating}/5
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-zinc-950/60 p-4 rounded-2xl border border-white/5 font-medium">{f.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
          <div className="overflow-x-auto text-[11px] sm:text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/20 text-slate-500 uppercase tracking-wider font-bold text-[9px] select-none">
                  <th className="px-6 py-4">Security Action</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">IP Registry</th>
                  <th className="px-6 py-4">Operation Details</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-purple-400 flex items-center space-x-1.5">
                      <History className="h-4 w-4" />
                      <span>{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{log.actor ? `${log.actor.name} (${log.actor.email})` : 'System/Guest'}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{log.ip}</td>
                    <td className="px-6 py-4 text-slate-400">{log.details}</td>
                    <td className="px-6 py-4 text-right text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default AdminPanel;
