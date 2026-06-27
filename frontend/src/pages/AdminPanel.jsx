import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Users, FileText, AlertTriangle, ShieldCheck, Trash2, 
  Check, UserCheck, MessageSquare, ShieldAlert, History, Activity, Sparkles, RefreshCcw, Plus, Ban,
  Globe, Laptop, Shield, UserPlus, Server
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
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Blacklist form states
  const [newDomain, setNewDomain] = useState('');
  const [newReason, setNewReason] = useState('');

  // Notification form states
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState('all');
  const [notifType, setNotifType] = useState('info');
  const [sendingNotif, setSendingNotif] = useState(false);

  const fetchAdminData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

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

      // 6. Fetch Blocked Domains (Blacklist)
      const blacklistRes = await axios.get(`${apiBaseUrl}/api/admin/blacklist`, config);
      if (blacklistRes.data?.success) setBlacklist(blacklistRes.data.data);

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
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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

  const handleAddBlockedDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${apiBaseUrl}/api/admin/blacklist`,
        { domain: newDomain.trim(), reason: newReason.trim() },
        config
      );
      if (res.data?.success) {
        alert(res.data.message || 'Domain blacklisted successfully!');
        setNewDomain('');
        setNewReason('');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to blacklist domain.');
    }
  };

  const handleDeleteBlockedDomain = async (id, domainName) => {
    if (!window.confirm(`Are you sure you want to remove "${domainName}" from the blacklist?`)) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(
        `${apiBaseUrl}/api/admin/blacklist/${id}`,
        config
      );
      if (res.data?.success) {
        alert(res.data.message || 'Domain removed from blacklist.');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove domain.');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifMessage.trim()) return;

    setSendingNotif(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${apiBaseUrl}/api/admin/notifications`,
        { userId: notifTarget, message: notifMessage.trim(), type: notifType },
        config
      );
      if (res.data?.success) {
        alert(res.data.message || 'Notification dispatched successfully!');
        setNotifMessage('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send notification.');
    } finally {
      setSendingNotif(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="p-8 rounded-[20px] text-center space-y-4 max-w-sm w-full border border-[#E3EAF5] bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#081B2F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#132238]">System Console Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3EAF5] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#132238] tracking-tight">
            {activeTab === 'overview' ? 'Threat & System Operations' : 'User Directory Controls'}
          </h1>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">
            {activeTab === 'overview' 
              ? 'Real-time telemetry, node logs, and cybersecurity framework status.'
              : 'Audit user registration, monitor activity levels, and toggle roles.'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="bg-[#E8F8F0] border border-[#BCE8D1] px-3.5 py-1.5 rounded-full text-[9px] font-bold text-[#2E855A]">
            CONSOLE STATUS: SECURE
          </span>
          <button
            onClick={() => fetchAdminData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 rounded-xl border border-[#E3EAF5] bg-white px-4 py-2 text-xs font-bold text-[#132238] hover:bg-slate-50 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Console</span>
          </button>
        </div>
      </div>

      {/* Tab Segment Controls */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#DCE7F8]/40 border border-[#E3EAF5] rounded-xl w-max">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'User Directory' },
          { id: 'scams', label: 'Complaints' },
          { id: 'feedback', label: 'User Feedbacks' },
          { id: 'logs', label: 'Audit Logs' },
          { id: 'blacklist', label: 'Domain Blacklist' },
          { id: 'notifications', label: 'Send Messages / Alerts' }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                active 
                  ? 'bg-[#081B2F] text-white shadow-sm' 
                  : 'text-[#6B7280] hover:text-[#132238] hover:bg-[#E3EAF5]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TABS CONTAINER */}
      <div className="space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "System Throughput", value: "11.3k scans/min", tag: "Optimal", tagColor: "text-[#43B97F] bg-[#E8F8F0] border-[#BCE8D1]" },
                { title: "Blacklisted Senders", value: blacklist.length.toString(), tag: "Active Block", tagColor: "text-[#E74C3C] bg-red-50 border-red-100" },
                { title: "Console Operations", value: "Active", tag: "Safe Mode", tagColor: "text-blue-600 bg-blue-50 border-blue-100" },
                { title: "Report Pipeline", value: scamReports.length.toString(), tag: "Pending", tagColor: "text-[#F6B93B] bg-amber-50 border-amber-100" }
              ].map((kpi, idx) => (
                <div key={idx} className="p-5 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between min-h-[110px] hover:translate-y-[-3px] transition-all">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{kpi.title}</span>
                  <div className="flex items-end justify-between mt-3">
                    <span className="text-xl font-bold text-[#132238] tracking-tight leading-none">{kpi.value}</span>
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${kpi.tagColor}`}>{kpi.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Node Telemetry & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Node status (8 columns) */}
              <div className="lg:col-span-8 p-6 rounded-[20px] border border-[#E3EAF5] bg-[#0D1B2A] text-white shadow-sm flex flex-col justify-between min-h-[340px]">
                <div className="flex justify-between items-center border-b border-[#E3EAF5]/15 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Global Threat Engine Nodes</h3>
                  <div className="flex space-x-2 text-[8px] font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1"><span className="h-1.5 w-1.5 rounded-full bg-[#E74C3C]"></span><span>High Threat</span></span>
                    <span className="flex items-center space-x-1 pl-2"><span className="h-1.5 w-1.5 rounded-full bg-[#43B97F]"></span><span>Secure</span></span>
                  </div>
                </div>

                <div className="flex-grow flex items-center justify-center relative overflow-hidden py-4">
                  <svg className="w-full h-40 opacity-20" viewBox="0 0 100 50">
                    <circle cx="20" cy="15" r="1.5" fill="#E74C3C" className="animate-ping" />
                    <circle cx="20" cy="15" r="1" fill="#E74C3C" />
                    <circle cx="50" cy="20" r="1.2" fill="#F6B93B" className="animate-pulse" />
                    <circle cx="80" cy="30" r="1" fill="#43B97F" />
                    <circle cx="45" cy="28" r="1" fill="#E74C3C" />
                    <circle cx="65" cy="18" r="1" fill="#43B97F" />
                    <path d="M5 25 L95 25 M50 5 L50 45" stroke="#ffffff" strokeWidth="0.1" strokeDasharray="2 2" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A7F08C]">AI Classification Nodes</span>
                    <span className="text-[9px] text-[#94A3B8] font-semibold uppercase leading-none">Security Monitoring Enabled</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider pt-3 border-t border-[#E3EAF5]/15">
                  <span>DEPLOYMENT: VERIFIED OPERATIONS</span>
                  <span>4 Clusters Connected</span>
                </div>
              </div>

              {/* Traffic Feed Card (4 columns) */}
              <div className="lg:col-span-4 p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between">
                <div className="border-b border-[#E3EAF5] pb-3.5 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>Recent Activity Feed</span>
                  </h3>
                </div>

                <div className="space-y-3 flex-grow overflow-y-auto max-h-[260px] pr-1">
                  {[
                    { status: "VERIFIED", text: "Candidate audit passed (Security Team)", node: "US-EAST | Risk: 0.05", color: "text-[#43B97F] bg-[#E8F8F0] border-[#BCE8D1]" },
                    { status: "BLOCKED", text: "Identity harvesting attempt intercepted", node: "IP: 142.xx | Risk: 0.98", color: "text-[#E74C3C] bg-red-50 border-red-100" },
                    { status: "SCANNING", text: "Evaluating domain redirect chains", node: "Audit: #482910 | NLP Check", color: "text-[#F6B93B] bg-amber-50 border-amber-100" }
                  ].map((traffic, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[10px] font-bold">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${traffic.color}`}>{traffic.status}</span>
                        <span className="text-[8.5px] text-[#6B7280] font-mono">{traffic.node}</span>
                      </div>
                      <p className="text-[#132238] leading-snug mt-2">{traffic.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Users */}
              <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex items-center justify-between hover:translate-y-[-3px] transition-all">
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase block tracking-wider">Total Registered Accounts</span>
                  <span className="text-2xl font-bold text-[#132238] block mt-1">{usersList.length}</span>
                  <span className="text-[9px] text-[#43B97F] font-bold block mt-1">Authorized identities</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] text-[#0D1B2A]">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {/* Admins count */}
              <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex items-center justify-between hover:translate-y-[-3px] transition-all">
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase block tracking-wider">Admins / System Roots</span>
                  <span className="text-2xl font-bold text-[#132238] block mt-1">
                    {usersList.filter(u => u.role === 'admin').length}
                  </span>
                  <span className="text-[9px] text-[#6B7280] font-bold block mt-1">Elevated privilege tokens</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] text-[#0D1B2A]">
                  <Shield className="h-5 w-5" />
                </div>
              </div>

              {/* Platform scan velocity progress bar */}
              <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm flex flex-col justify-between min-h-[90px] hover:translate-y-[-3px] transition-all">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  <span>Server Scan Load Capacity</span>
                  <span>12.8k / day</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-[#F5F8FC] h-2 rounded-full overflow-hidden border border-[#E3EAF5]">
                    <div className="bg-[#081B2F] h-full rounded-full w-2/3" />
                  </div>
                  <span className="text-[8.5px] text-[#6B7280] font-semibold block mt-1.5">67% operational capacity</span>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#E3EAF5] pb-4 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238]">User Account Directory</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>User Profile</th>
                      <th>System Role</th>
                      <th>Account Status</th>
                      <th className="text-center">Scan Volume</th>
                      <th className="text-right">Intervention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-[#6B7280] font-semibold">
                          No registered accounts retrieved.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr._id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="h-8.5 w-8.5 rounded-lg border border-[#E3EAF5] bg-[#F7FAFD] flex items-center justify-center shrink-0 text-[#081B2F] font-bold">
                                {usr.name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </div>
                              <div>
                                <span className="block font-bold text-[#132238] leading-tight">{usr.name}</span>
                                <span className="text-[9.5px] text-[#6B7280] font-semibold block mt-0.5">{usr.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              usr.role === 'admin' 
                                ? 'badge-danger' 
                                : 'badge-warning'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td>
                            <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-[#2E855A]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#43B97F] animate-pulse"></span>
                              <span>Active</span>
                            </span>
                          </td>
                          <td className="text-center font-mono font-bold text-xs text-[#132238]">{usr.scanCount || 0}</td>
                          <td className="text-right">
                            <div className="flex justify-end space-x-1.5">
                              <button
                                onClick={() => handleRoleChange(usr._id, usr.role)}
                                className="p-1.5 rounded-lg border border-[#E3EAF5] bg-white text-[#6B7280] hover:text-[#0D1B2A] hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                                title="Toggle Role Access"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleUserDelete(usr._id)}
                                className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#E74C3C] hover:bg-red-100 transition-all cursor-pointer shadow-sm"
                                title="Delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'scams' && (
          <div className="space-y-6 animate-fadeIn">
            {scamReports.length === 0 ? (
              <div className="p-12 text-center text-[#6B7280] text-xs border border-[#E3EAF5] bg-white rounded-[20px]">
                No scam postings reported by the community.
              </div>
            ) : (
              scamReports.map((report) => (
                <div key={report._id} className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4 hover:translate-y-[-2px] transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-[#132238] text-sm tracking-tight leading-tight">{report.jobTitle}</h3>
                      <p className="text-xs text-blue-600 font-bold">{report.companyName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${
                        report.status === 'pending' 
                          ? 'badge-warning' 
                          : 'badge-success'
                      }`}>
                        {report.status}
                      </span>
                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleScamStatusUpdate(report._id, 'reviewed')}
                          className="p-1.5 rounded-lg border border-[#BCE8D1] bg-[#E8F8F0] text-[#2E855A] hover:bg-[#d1fae5] transition-all cursor-pointer shadow-sm"
                          title="Mark Reviewed"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-[#6B7280] space-y-3 bg-[#F7FAFD] p-5 rounded-xl border border-[#E3EAF5] font-semibold">
                    <div>
                      <span className="text-[#132238] font-bold text-[9px] uppercase tracking-wider block mb-1">Reported Posting Context:</span> 
                      <p className="leading-relaxed font-bold">{report.jobDetails}</p>
                    </div>
                    <div className="border-t border-[#E3EAF5] pt-3 mt-3">
                      <span className="text-[#132238] font-bold text-[9px] uppercase tracking-wider block mb-1">Report Description:</span> 
                      <p className="leading-relaxed font-bold text-[#ab2a1b] bg-red-50/50 p-3.5 rounded-lg border border-red-200/50">{report.scamDetails}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {feedbacks.length === 0 ? (
              <div className="col-span-full p-12 text-center text-[#6B7280] text-xs border border-[#E3EAF5] bg-white rounded-[20px]">
                No feedbacks logged in registers.
              </div>
            ) : (
              feedbacks.map((f) => (
                <div key={f._id} className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all font-bold">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-[#132238] text-xs tracking-tight leading-tight">{f.subject}</h3>
                        <p className="text-[9px] text-[#6B7280] mt-1 font-mono">{f.name} ({f.email})</p>
                      </div>
                      <span className="badge badge-success">
                        ★ {f.rating}/5
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed bg-[#F7FAFD] p-4 rounded-xl border border-[#E3EAF5] font-medium">{f.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Security Event</th>
                    <th>Actor Identity</th>
                    <th>IP Address</th>
                    <th>Log Details</th>
                    <th className="text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-[#6B7280] font-semibold">
                        No secure audits logged.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log._id}>
                        <td>
                          <div className="flex items-center space-x-2 font-bold text-[#132238]">
                            <History className="h-4 w-4 text-[#94A3B8] shrink-0" />
                            <span>{log.action}</span>
                          </div>
                        </td>
                        <td className="text-[#6B7280] font-mono text-xs">{log.actor ? `${log.actor.name} (${log.actor.email})` : 'System Root'}</td>
                        <td className="text-[#6B7280] font-mono text-xs">{log.ip}</td>
                        <td className="text-[#6B7280] max-w-xs truncate font-medium">{log.details}</td>
                        <td className="text-right text-[#6B7280] font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOMAIN BLACKLIST TAB */}
        {activeTab === 'blacklist' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Add blocked domain form */}
            <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-5">
              <div className="flex items-center space-x-2.5 border-b border-[#E3EAF5] pb-3.5">
                <Ban className="h-5 w-5 text-[#E74C3C]" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#132238]">Flag Recruiter Domain Globally</h2>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">Manually blacklist domain names or recruiter email extensions system-wide.</p>
                </div>
              </div>
              
              <form onSubmit={handleAddBlockedDomain} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">Domain Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. scamrecruit-portal.org"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full text-xs"
                    required
                  />
                </div>
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">Reason Description</label>
                  <input 
                    type="text"
                    placeholder="e.g. High-urgency Telegram/WhatsApp job scam templates"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#081B2F] hover:bg-[#102840] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer border border-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1.5 inline" />
                    <span>Block Domain</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Suspicious Domain</th>
                      <th>Reason Description</th>
                      <th>Flagged By</th>
                      <th>Flagged Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blacklist.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[#6B7280] font-semibold">
                          No recruiter domains blacklisted yet.
                        </td>
                      </tr>
                    ) : (
                      blacklist.map((item) => (
                        <tr key={item._id}>
                          <td className="font-bold text-[#E74C3C] font-mono text-xs">{item.domain}</td>
                          <td className="text-[#6B7280] max-w-xs truncate font-medium">{item.reason || 'None specified'}</td>
                          <td className="text-[#6B7280] font-mono text-[10px]">
                            {item.addedBy ? `${item.addedBy.name}` : 'System Root'}
                          </td>
                          <td className="text-[#6B7280] font-mono text-[10px]">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDeleteBlockedDomain(item._id, item.domain)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#E74C3C] hover:bg-red-100 transition-all cursor-pointer shadow-sm"
                              title="Remove Domain Block"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BROADCAST ALERTS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-[20px] border border-[#E3EAF5] bg-white shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#132238] border-b border-[#E3EAF5] pb-3.5">
                Send Messages & Security Alerts
              </h3>
              
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Target User */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Target User Profile</label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value)}
                      className="w-full"
                    >
                      <option value="all">Broadcast to All Operators</option>
                      {usersList.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alert Severity Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Alert Context Type</label>
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value)}
                      className="w-full"
                    >
                      <option value="info">Information (Info)</option>
                      <option value="warning">System Warning (Warning)</option>
                      <option value="success">Security Restored (Success)</option>
                    </select>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Alert Message Content</label>
                  <textarea
                    placeholder="Type details of the security patch, threat brief, or system update to dispatch..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full text-xs font-semibold text-[#132238] min-h-[100px]"
                    required
                  />
                </div>

                {/* Dispatch Button */}
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="px-6 py-3 bg-[#081B2F] hover:bg-[#102840] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer border border-transparent disabled:opacity-50"
                >
                  {sendingNotif ? 'Sending...' : 'Send Message / Alert'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
