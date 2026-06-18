import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ShieldAlert, Plus, MessageSquare, Send, CheckCircle } from 'lucide-react';

const CommunityReporting = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Report Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDetails: '',
    scamDetails: '',
    evidenceUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReports = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiBaseUrl}/api/scams`);
      if (res.data?.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch community reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.companyName || !formData.jobDetails || !formData.scamDetails) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/scams`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.data?.success) {
        setSuccessMsg(res.data.message);
        setFormData({
          jobTitle: '',
          companyName: '',
          jobDetails: '',
          scamDetails: '',
          evidenceUrl: '',
        });
        setShowForm(false);
        // Refresh reports list
        fetchReports();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit scam report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Community Scam Reports</h1>
          <p className="text-slate-400 text-xs mt-1">Check verified recruitment scams reported by the community.</p>
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 rounded-xl bg-gradient-indigo px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Report a Scam</span>
          </button>
        ) : (
          <span className="text-xs text-slate-500 bg-slate-900 border border-white/5 px-4 py-2 rounded-xl">
            Please log in to report a scam.
          </span>
        )}
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="glass-panel p-6 rounded-2xl glow-red border-red-500/25 animate-fadeIn">
          <h2 className="text-md font-bold text-slate-200 mb-4 flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <span>Submit Scam Report</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Job Title *"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name *"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <textarea
              name="jobDetails"
              value={formData.jobDetails}
              onChange={handleInputChange}
              placeholder="Copy suspicious job details (e.g. description, email, website) *"
              rows={3}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            <textarea
              name="scamDetails"
              value={formData.scamDetails}
              onChange={handleInputChange}
              placeholder="Explain how the scam operates (e.g. asked for OTP, demanded $25 processing fee) *"
              rows={3}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            <input
              type="text"
              name="evidenceUrl"
              value={formData.evidenceUrl}
              onChange={handleInputChange}
              placeholder="Link to evidence (e.g. drive screenshot link)"
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-1.5 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/10 active:scale-95 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Scam Reports Feed */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center text-slate-400 space-y-2">
          <MessageSquare className="h-10 w-10 mx-auto text-slate-600" />
          <h3 className="font-bold">No scam reports yet</h3>
          <p className="text-xs">Be the first to warn the community about fraudulent recruiters!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="glass-panel p-6 rounded-2xl space-y-4 border border-red-500/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-200 text-base">{report.jobTitle}</h3>
                  <p className="text-xs text-red-400 font-semibold">{report.companyName}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  report.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {report.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-2">
                <p><span className="text-slate-300 font-semibold">Job Copy:</span> {report.jobDetails}</p>
                <p><span className="text-slate-300 font-semibold">Scam Details:</span> {report.scamDetails}</p>
                {report.evidenceUrl && (
                  <p>
                    <span className="text-slate-300 font-semibold">Proof Link:</span>{' '}
                    <a href={report.evidenceUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{report.evidenceUrl}</a>
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-white/5">
                <span>Reported by: {report.reporter?.name || 'Anonymous User'}</span>
                <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityReporting;
