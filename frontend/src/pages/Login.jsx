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

  // Google Sign-In Flow
  const [needsPhonePrompt, setNeedsPhonePrompt] = useState(false);
  const [googlePayload, setGooglePayload] = useState(null);
  const [googleToken, setGoogleToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    
    if (location.state?.successMessage) {
      setRegSuccess(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') {
      setSessionExpired(true);
    }

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch, location]);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088467475143-dummyclientid.apps.googleusercontent.com',
          callback: handleGoogleCallback,
          auto_select: false,
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
    // If it's a silent auto-sign-in check, try it in the background without triggering loading screen or error banners
    const isAutoSelect = response?.select_by === 'auto';

    if (isAutoSelect) {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
        const res = await axios.post(`${apiBaseUrl}/api/auth/google`, {
          token: response.credential,
        });
        if (res.data?.success) {
          dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
          navigate('/dashboard');
        }
      } catch (err) {
        console.warn("Silent background auto-sign-in failed (standard behavior for mock Client IDs):", err);
      }
      return;
    }

    dispatch(authStart());
    setPhoneError('');
    setRegSuccess('');
    setSessionExpired(false);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
      setPhoneError(err.response?.data?.message || 'Failed to complete registration.');
      dispatch(authFailure(err.response?.data?.message || 'Registration failed.'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    dispatch(authStart());
    setRegSuccess('');
    setSessionExpired(false);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12 select-none">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-[#E3EAF5] p-8 rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,.08)]"
      >
        {needsPhonePrompt ? (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 rounded-xl bg-[#F7FAFD] items-center justify-center border border-[#E3EAF5]">
                <Phone className="h-5.5 w-5.5 text-[#0D1B2A]" />
              </div>
              <h2 className="text-2xl font-bold text-[#132238] tracking-tight">Complete Account Setup</h2>
              <p className="text-xs text-[#6B7280] font-semibold leading-relaxed px-2">
                Welcome <strong className="text-[#0D1B2A]">{googlePayload?.name}</strong>. Please set your password and mobile number to activate your security profile.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {phoneError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-[#E74C3C] font-bold">
                  {phoneError}
                </div>
              )}

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full pl-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Set Account Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3.5 font-bold text-white shadow-md transition-all cursor-pointer border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Check className="h-4 w-4 text-[#A7F08C]" />
                <span>{loading ? 'Activating Profile...' : 'Complete Profile'}</span>
              </button>
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
                className="text-xs text-[#6B7280] hover:text-[#0D1B2A] underline cursor-pointer font-bold"
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
              <Link to="/" className="inline-flex h-12 w-12 rounded-xl bg-[#081B2F] items-center justify-center border border-[#E3EAF5] shadow-sm transform hover:scale-105 transition-all">
                <Shield className="h-6 w-6 text-[#A7F08C]" />
              </Link>
              <h2 className="text-2xl font-bold text-[#132238] tracking-tight">Identity Authentication</h2>
              <p className="text-xs text-[#6B7280] font-semibold">Sign in to manage and audit your job scam verification reports</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6" autoComplete="off">
              
              {regSuccess && (
                <div className="rounded-xl bg-[#E8F8F0] border border-[#BCE8D1] p-3.5 text-xs text-[#2E855A] flex items-center space-x-2 font-bold animate-pulse">
                  <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {sessionExpired && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-[#b27f12] font-bold">
                  Your session expired. Please authenticate again.
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-[#E74C3C] font-bold">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12"
                    required
                    readOnly={emailReadOnly}
                    onFocus={() => setEmailReadOnly(false)}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Password</label>
                  <Link to="/forgot-password" className="text-[10px] text-blue-600 font-extrabold hover:underline">Reset Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12"
                    required
                    readOnly={passwordReadOnly}
                    onFocus={() => setPasswordReadOnly(false)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3.5 font-bold text-white shadow-md transition-all cursor-pointer border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogIn className="h-4 w-4 text-[#A7F08C]" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>

              {/* OR Separator */}
              <div className="relative my-5 flex items-center justify-center">
                <hr className="w-full border-[#E3EAF5]" />
                <span className="absolute bg-white px-3 text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">or continue with</span>
              </div>

              {/* Google OAuth Button Container */}
              <div className="flex justify-center w-full">
                <div id="googleSignInButton" className="w-full overflow-hidden flex justify-center"></div>
              </div>

            </form>

            {/* Footer */}
            <p className="text-center text-xs text-[#6B7280] mt-6 font-semibold">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5">
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
