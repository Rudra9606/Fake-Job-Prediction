import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authFailure, clearError } from '../store/authSlice';
import axios from 'axios';
import { Shield, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    dispatch(authStart());
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/register`, { name, email, password });
      
      if (res.data?.success) {
        // Clear auth loading state
        dispatch(clearError());
        // Redirect to Login Page with success message state
        navigate('/login', { 
          state: { 
            successMessage: 'Account created successfully. Please login to continue.' 
          } 
        });
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Registration failed. Please verify connection.'));
    }
  };

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl glow-indigo border border-white/5 relative z-10 bg-zinc-950/40 backdrop-blur-xl"
      >
        {/* Title */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 items-center justify-center text-purple-400 border border-purple-500/30 hover:scale-105 active:scale-95 transition-all">
            <Shield className="h-6 w-6 text-purple-400" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400">Join FakeJobShield to access advanced fraud detectors</p>
        </div>
 
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                required
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
            <UserPlus className="h-4 w-4" />
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </motion.button>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-semibold hover:underline inline-flex items-center gap-0.5">
            Sign In <ArrowRight className="h-3 w-3" />
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Register;
