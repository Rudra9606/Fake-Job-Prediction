import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, clearError, registerSuccess } from '../store/authSlice';
import axios from 'axios';
import { Shield, Mail, Lock, LogIn, ArrowRight, CheckCircle2, Phone, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [regSuccess, setRegSuccess] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  // Google Sign-In with mandatory Phone Number & Password Flow
  const [needsPhonePrompt, setNeedsPhonePrompt] = useState(false);
  const [googlePayload, setGooglePayload] = useState(null);
  const [googleToken, setGoogleToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    
    // Check if redirect has success message
    if (location.state?.successMessage) {
      setRegSuccess(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }

    // Check if redirected because of token expiration
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') {
      setSessionExpired(true);
    }

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch, location]);

  // Render Google Identity Services button
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088467475143-dummyclientid.apps.googleusercontent.com',
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: '100%',
          }
        );
      }
    };

    const timer = setTimeout(initializeGoogleSignIn, 500);
    return () => clearTimeout(timer);
  }, [needsPhonePrompt]); 

  const handleGoogleCallback = async (response) => {
    dispatch(authStart());
    setPhoneError('');
    setRegSuccess('');
    setSessionExpired(false);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/google`, {
        token: response.credential,
      });

      if (res.data?.success) {
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
        navigate('/dashboard');
      } else if (res.data?.needsPhoneNumber) {
        dispatch(registerSuccess());
        setGooglePayload(res.data.googlePayload);
        setGoogleToken(response.credential);
        setNeedsPhonePrompt(true);
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Google Authentication failed.'));
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !googlePassword) return;

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setPhoneError('Please enter a valid phone number (e.g. +1234567890).');
      return;
    }

    if (googlePassword.length < 6) {
      setPhoneError('Password must be at least 6 characters.');
      return;
    }

    dispatch(authStart());
    setPhoneError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/google`, {
        token: googleToken,
        phoneNumber,
        password: googlePassword,
      });

      if (res.data?.success) {
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Verification failed.'));
      setPhoneError(err.response?.data?.message || 'Verification failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    dispatch(authStart());
    setRegSuccess('');
    setSessionExpired(false);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/login`, { email, password });
      
      if (res.data?.success) {
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Login failed. Please verify connection.'));
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
        {/* Google Authentication Phone Prompt View */}
        {needsPhonePrompt ? (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-purple-500/10 items-center justify-center text-purple-400 border border-purple-500/20">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Complete Sign Up</h2>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                Hi <strong className="text-purple-300">{googlePayload?.name}</strong>, please provide your mobile number and set a password to complete your account registration.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              {phoneError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400">
                  {phoneError}
                </div>
              )}

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="phone-prompt-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Set Account Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="phone-prompt-password"
                    type="password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 font-bold text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/25 transition-all disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                <span>{loading ? 'Saving Details...' : 'Complete Registration'}</span>
              </motion.button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => {
                  setNeedsPhonePrompt(false);
                  setGooglePayload(null);
                  setGoogleToken('');
                  setPhoneNumber('');
                  setGooglePassword('');
                  setPhoneError('');
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Cancel Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Standard Login View */
          <>
            {/* Title */}
            <div className="text-center space-y-3">
              <Link to="/" className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 items-center justify-center text-purple-400 border border-purple-500/30 hover:scale-105 active:scale-95 transition-all">
                <Shield className="h-6 w-6 text-purple-400" />
              </Link>
              <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-slate-400">Sign in to manage and audit your job scam verification reports</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-8" autoComplete="off">
              
              {regSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center space-x-2"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <span>{regSuccess}</span>
                </motion.div>
              )}

              {sessionExpired && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-400"
                >
                  Session expired. Please log in again to continue.
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    readOnly={emailReadOnly}
                    onFocus={() => setEmailReadOnly(false)}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Password</label>
                  <Link to="/forgot-password" className="text-[10px] text-purple-400 hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                    readOnly={passwordReadOnly}
                    onFocus={() => setPasswordReadOnly(false)}
                    autoComplete="new-password"
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
                <LogIn className="h-4 w-4" />
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </motion.button>

              {/* OR Separator */}
              <div className="relative my-6 flex items-center justify-center">
                <hr className="w-full border-zinc-800" />
                <span className="absolute bg-zinc-900/90 dark:bg-zinc-950 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or continue with</span>
              </div>

              {/* Google OAuth Button Container */}
              <div className="flex justify-center w-full">
                <div id="googleSignInButton" className="w-full overflow-hidden flex justify-center"></div>
              </div>

            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                Sign Up <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
