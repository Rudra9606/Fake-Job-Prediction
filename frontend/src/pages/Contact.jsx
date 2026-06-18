import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, CheckCircle2, HelpCircle, Star } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (val) => {
    setFormData({ ...formData, rating: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/feedback`, formData);
      if (res.data?.success) {
        setSuccess(res.data.message);
        setFormData({ name: '', email: '', subject: '', message: '', rating: 5 });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">Contact & Feedback</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Found a bug? Have feature suggestions? Submit your feedback or report technical issues to our research team.
        </p>
      </div>

      {/* Main card */}
      <div className="glass-panel p-8 rounded-2xl glow-indigo">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {success && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}
          
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Scanner Bug Report / Suggestions"
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Explain your inquiry in detail..."
              rows={4}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleRating(val)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-5 w-5 ${
                      val <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-indigo px-6 py-3 text-xs font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Contact;
