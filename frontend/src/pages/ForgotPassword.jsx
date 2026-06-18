import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Phone, ArrowRight, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step State (1: Enter Details, 2: Enter OTP, 3: Reset Password)
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('email'); // 'email' or 'sms'
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Step 1: Request OTP Email or SMS
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (deliveryMethod === 'email' && !email) return;
    if (deliveryMethod === 'sms' && !phoneNumber) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const payload = deliveryMethod === 'email' ? { email } : { phoneNumber };
      const res = await axios.post(`${apiBaseUrl}/api/auth/forgotpassword`, payload);
      
      if (res.data?.success) {
        setSuccess(res.data.message);
        // Advance to OTP entry step
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send reset code. Verify connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (deliveryMethod === 'email' && !email) return;
    if (deliveryMethod === 'sms' && !phoneNumber) return;
    if (!otp) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const payload = deliveryMethod === 'email' ? { email, otp } : { phoneNumber, otp };
      const res = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, payload);
      
      if (res.data?.success) {
        setSuccess(res.data.message || 'OTP Verified! Proceed to update password.');
        // Advance to reset password form step
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (deliveryMethod === 'email' && !email) return;
    if (deliveryMethod === 'sms' && !phoneNumber) return;
    if (!otp || !password || !confirmPassword) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
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
      const payload = deliveryMethod === 'email' 
        ? { email, otp, password } 
        : { phoneNumber, otp, password };
      const res = await axios.put(`${apiBaseUrl}/api/auth/resetpassword`, payload);
      
      if (res.data?.success) {
        setSuccess(res.data.message || 'Password reset successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { state: { successMessage: 'Password reset successfully! Please log in.' } });
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reset password. Session expired.');
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
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 items-center justify-center text-purple-400 border border-purple-500/30">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Enter Reset OTP'}
            {step === 3 && 'New Password'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed px-2">
            {step === 1 && 'Enter your email address to receive a secure 6-digit verification code.'}
            {step === 2 && `We sent a 6-digit OTP code to your inbox (${email}). Please enter it below.`}
            {step === 3 && 'Choose a strong, secure new password for your account.'}
          </p>
        </div>

        {/* Global Notifications */}
        <div className="mt-6 space-y-4">
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


        </div>

        {/* Switch forms dynamically depending on current step */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleRequestOTP}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      key="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
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
                  <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all text-center tracking-widest font-bold"
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
                  <span>{loading ? 'Verifying...' : 'Verify Reset Code'}</span>
                  <CheckCircle2 className="h-4 w-4" />
                </motion.button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl bg-zinc-950/70 border border-white/5 pl-12 pr-4 py-3.5 text-xs text-slate-100 placeholder-zinc-650 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
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
                  <span>{loading ? 'Resetting Password...' : 'Save New Password'}</span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

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

export default ForgotPassword;
