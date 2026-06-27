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
  const [phoneReadOnly, setPhoneReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);
  
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

  useEffect(() => {
    const initializeGoogleSignUp = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088467475143-dummyclientid.apps.googleusercontent.com',
          callback: handleGoogleCallback,
          auto_select: false,
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
    if (!name || !email || !password || !phoneNumber) return;

    dispatch(authStart());

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.post(`${apiBaseUrl}/api/auth/register`, {
        name,
        email,
        password,
        phoneNumber,
      });

      if (res.data?.success) {
        dispatch(registerSuccess());
        navigate('/login', { state: { successMessage: 'Registration successful! You can now authenticate.' } });
      }
    } catch (err) {
      console.error(err);
      dispatch(authFailure(err.response?.data?.message || 'Registration failed.'));
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
                Cancel Sign Up
              </button>
            </div>
          </div>
        ) : (
          /* Standard Signup view */
          <>
            {/* Title */}
            <div className="text-center space-y-3">
              <Link to="/" className="inline-flex h-12 w-12 rounded-xl bg-[#081B2F] items-center justify-center border border-[#E3EAF5] shadow-sm transform hover:scale-105 transition-all">
                <Shield className="h-6 w-6 text-[#A7F08C]" />
              </Link>
              <h2 className="text-2xl font-bold text-[#132238] tracking-tight">Create Workspace</h2>
              <p className="text-xs text-[#6B7280] font-semibold">Join Fake Job Shield to access advanced fraud detectors</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6" autoComplete="off">
              
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-[#E74C3C] font-bold">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12"
                    required
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

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
                    readOnly={phoneReadOnly}
                    onFocus={() => setPhoneReadOnly(false)}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
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
                <UserPlus className="h-4 w-4 text-[#A7F08C]" />
                <span>{loading ? 'Creating Workspace...' : 'Sign Up'}</span>
              </button>

              {/* OR Separator */}
              <div className="relative my-5 flex items-center justify-center">
                <hr className="w-full border-[#E3EAF5]" />
                <span className="absolute bg-white px-3 text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">or continue with</span>
              </div>

              {/* Google OAuth Button Container */}
              <div className="flex justify-center w-full">
                <div id="googleSignUpButton" className="w-full overflow-hidden flex justify-center"></div>
              </div>

            </form>

            {/* Footer */}
            <p className="text-center text-xs text-[#6B7280] mt-6 font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5">
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
