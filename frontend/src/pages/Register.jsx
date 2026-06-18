import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, clearError, registerSuccess } from '../store/authSlice';
import axios from 'axios';
import { Shield, Mail, Lock, User, UserPlus, ArrowRight, Phone, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Google OAuth Flow
  const [needsPhonePrompt, setNeedsPhonePrompt] = useState(false);
  const [googlePayload, setGooglePayload] = useState(null);
  const [googleToken, setGoogleToken] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  // Load Google Identity Services Button
  useEffect(() => {
    const initializeGoogleSignUp = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088467475143-dummyclientid.apps.googleusercontent.com',
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignUpButton'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            shape: 'pill',
            width: '100%',
          }
        );
      }
    };

    const timer = setTimeout(initializeGoogleSignUp, 500);
    return () => clearTimeout(timer);
  }, [needsPhonePrompt]);

  const handleGoogleCallback = async (response) => {
    dispatch(authStart());
    setPhoneError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/google`, {
        token: response.credential,
      });

      if (res.data?.success) {
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
        navigate('/dashboard');
      } else if (res.data?.needsPhoneNumber) {
        // Reset Redux loading state and show phone prompt UI
        dispatch(registerSuccess());
        setGooglePayload(res.data.googlePayload);
        setGoogleToken(response.credential);
        setNeedsPhonePrompt(true);
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Google signup failed.'));
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
    if (!name || !email || !password || !phoneNumber) return;

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      dispatch(authFailure('Please enter a valid phone number (e.g. +1234567890)'));
      return;
    }

    dispatch(authStart());
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/auth/register`, { 
        name, 
        email, 
        password,
        phoneNumber
      });
      
      if (res.data?.success) {
        dispatch(registerSuccess());
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
        {needsPhonePrompt ? (
          /* Phone prompt view for Google Signups */
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-purple-500/10 items-center justify-center text-purple-400 border border-purple-500/20">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Add Mobile Number</h2>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                Hi <strong className="text-purple-300">{googlePayload?.name}</strong>, a mobile number is required to secure your account and send verification codes.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              {phoneError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400">
                  {phoneError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="phone-prompt-input-register"
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
                    key="phone-prompt-password-register"
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
                <span>{loading ? 'Saving Details...' : 'Complete Sign Up'}</span>
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
                Cancel Sign Up
              </button>
            </div>
          </div>
        ) : (
          /* Standard Signup view */
          <>
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
                    key="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
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
                    key="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    key="register-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
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
                    key="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
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

              {/* OR Separator */}
              <div className="relative my-6 flex items-center justify-center">
                <hr className="w-full border-zinc-800" />
                <span className="absolute bg-zinc-900/90 dark:bg-zinc-950 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or continue with</span>
              </div>

              {/* Google OAuth Button Container */}
              <div className="flex justify-center w-full">
                <div id="googleSignUpButton" className="w-full overflow-hidden flex justify-center"></div>
              </div>

            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
