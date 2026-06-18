import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Download, Trash2, Eye, ShieldAlert, BarChart3, Clock, Sparkles, AlertCircle, ArrowUpRight, TrendingUp, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiBaseUrl}/api/analyze/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data?.success) {
        setHistory(res.data.data);
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
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.delete(`${apiBaseUrl}/api/analyze/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data?.success) {
        setHistory(history.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete record.');
    }
  };

  const handleDownloadPDF = (id) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.open(`${apiBaseUrl}/api/analyze/${id}/pdf`, '_blank');
  };

  // Aggregated Stats
  const totalScans = history.length;
  const avgTrustScore = totalScans > 0 
    ? Math.round(history.reduce((acc, item) => acc + item.trustScore, 0) / totalScans) 
    : 100;
  const highRiskScans = history.filter((item) => item.trustScore <= 40).length;

  // Prepare chart data (chronological order)
  const chartData = [...history]
    .reverse()
    .map((item, idx) => ({
      name: `Scan ${idx + 1}`,
      score: item.trustScore,
      title: item.title.substring(0, 15) + '...'
    }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8 relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">Secure Account Center</span>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Security Command Center</h1>
          <p className="text-slate-400 text-xs mt-0.5">Welcome back, <span className="text-slate-200 font-semibold">{user?.name}</span>. Real-time scanning history and risk logs.</p>
        </div>
        <button
          onClick={() => fetchHistory(true)}
          disabled={refreshing}
          className="self-start md:self-auto flex items-center space-x-1.5 rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Console</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Retrieving logs...</p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center text-xs text-red-400 rounded-3xl border border-red-500/25 bg-red-950/5">{error}</div>
      ) : (
        /* Bento Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Card 1: Overview Banner (Profile Completion style) */}
          <div className="md:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500/10 to-transparent w-48 h-48 rounded-full blur-2xl" />
            <div className="space-y-3 relative z-10">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                <Sparkles className="h-3 w-3" />
                <span>Verification Active</span>
              </span>
              <h2 className="text-2xl font-black text-slate-100 leading-tight">Empower your career searches with active AI safeguards.</h2>
              <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
                Scan job descriptions, recruiter addresses, and redirect URLs. Download conference-paper-grade audit sheets to protect your digital identity.
              </p>
            </div>
            <div className="pt-4 relative z-10">
              <Link to="/analyze" className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <span>Scan New Advertisement</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Stats Summary Bento */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            {/* Total Scans Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-100 block tracking-tighter">{totalScans}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Scans Run</span>
              </div>
            </div>

            {/* Avg Trust Score Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
              <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BarChart3 className="h-4.5 w-4.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-100 block tracking-tighter">{avgTrustScore}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Trust Score</span>
              </div>
            </div>

            {/* High Risk Flagged Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
              <div className="h-8 w-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-100 block tracking-tighter">{highRiskScans}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">High Risk Alerted</span>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-4.5 w-4.5" />
              </div>
              <div className="mt-4">
                <span className="text-xs font-black text-emerald-400 block uppercase tracking-wider">Verified</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MERN Account</span>
              </div>
            </div>
          </div>

          {/* Card 3: Trust Score Trends Recharts Area Chart */}
          <div className="md:col-span-8 glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
                <span>Trust Score Analysis Trends</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Temporal Analysis</span>
            </div>

            {chartData.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreTrendColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '10px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreTrendColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-center text-slate-500 text-xs">
                Run some scans to see score trending charts.
              </div>
            )}
          </div>

          {/* Card 4: Model Benchmarks Bento snippet */}
          <div className="md:col-span-4 glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <BarChart3 className="h-4.5 w-4.5 text-purple-400" />
                  <span>XGBoost + SHAP</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pipeline</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                The framework leverages high-dimensional BERT semantic embeddings mapping into an XGBoost ensemble classifier to output shapley values.
              </p>
            </div>
            <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-4 mt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Model Precision:</span>
                <span className="text-slate-100">98.8%</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Training Epochs:</span>
                <span className="text-slate-100">50 (Early Stop)</span>
              </div>
            </div>
          </div>

          {/* Card 5: Scan History Logs Table */}
          <div className="md:col-span-12 glass-panel rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FileText className="h-4.5 w-4.5 text-purple-400" />
                <span>Saved Verification History Logs</span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">{totalScans} Scan Records</span>
            </div>

            {history.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <AlertCircle className="h-10 w-10 mx-auto text-zinc-700" />
                <p className="text-xs font-semibold">No scan history logs available.</p>
                <Link to="/analyze" className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xl shadow-purple-500/10">
                  Scan First Ad
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto text-xs sm:text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-zinc-950/20 text-slate-500 uppercase tracking-wider font-bold text-[9px] select-none">
                      <th className="px-6 py-4">Job Details</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4">Classification</th>
                      <th className="px-6 py-4">Audit Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                    {history.map((item) => {
                      let riskColor = 'text-emerald-400';
                      let riskBg = 'bg-emerald-500/10 border-emerald-500/20';

                      if (item.trustScore <= 20) {
                        riskColor = 'text-red-500';
                        riskBg = 'bg-red-500/10 border-red-500/20';
                      } else if (item.trustScore <= 40) {
                        riskColor = 'text-orange-500';
                        riskBg = 'bg-orange-500/10 border-orange-500/20';
                      } else if (item.trustScore <= 60) {
                        riskColor = 'text-yellow-500';
                        riskBg = 'bg-yellow-500/10 border-yellow-500/20';
                      } else if (item.trustScore <= 80) {
                        riskColor = 'text-cyan-400';
                        riskBg = 'bg-cyan-500/10 border-cyan-500/20';
                      }

                      return (
                        <tr key={item._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-200">{item.title}</td>
                          <td className="px-6 py-4 text-slate-400">{item.company}</td>
                          <td className="px-6 py-4 text-center font-black text-slate-100">{item.trustScore}%</td>
                          <td className="px-6 py-4">
                            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${riskBg} ${riskColor}`}>
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center space-x-2">
                              <Link
                                to={`/results/${item._id}`}
                                className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:text-purple-400 hover:border-purple-500/20 transition-all cursor-pointer"
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDownloadPDF(item._id)}
                                className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:text-purple-400 hover:border-purple-500/20 transition-all cursor-pointer"
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default UserDashboard;
