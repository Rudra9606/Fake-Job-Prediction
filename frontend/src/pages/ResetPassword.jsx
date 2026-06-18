import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(`${apiBaseUrl}/api/auth/resetpassword/${token}`, { password });
      
      if (res.data?.success) {
        setSuccess(res.data.message || 'Password reset successfully!');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reset password. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl glow-indigo border border-white/5 relative z-10 bg-zinc-950/40 backdrop-blur-xl"
      >
        {/* Logo Icon */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 items-center justify-center text-purple-400 border border-purple-500/30 hover:scale-105 active:scale-95 transition-all">
            <Shield className="h-6 w-6 text-purple-400" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">New Password</h2>
          <p className="text-sm text-slate-400">Enter a secure new password for your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center space-x-2"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center space-x-2"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* New Password */}
          {!success && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 font-bold text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/25 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
              </motion.button>
            </>
          )}

        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-purple-400 hover:text-purple-300 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default ResetPassword;
