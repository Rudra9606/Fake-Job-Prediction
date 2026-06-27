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
        ? { email, otp, password, confirmPassword }
        : { phoneNumber, otp, password, confirmPassword };
        
      const res = await axios.post(`${apiBaseUrl}/api/auth/resetpassword`, payload);
      
      if (res.data?.success) {
        setSuccess(res.data.message || 'Password updated successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
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
        {/* Title / Back */}
        <div className="flex items-center space-x-1.5 mb-6">
          <Link 
            to="/login" 
            className="text-xs font-bold text-[#6B7280] hover:text-[#0D1B2A] flex items-center space-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Sign In</span>
          </Link>
        </div>

        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex h-12 w-12 rounded-xl bg-[#081B2F] items-center justify-center border border-[#E3EAF5] shadow-sm">
            <KeyRound className="h-6 w-6 text-[#A7F08C]" />
          </div>
          <h2 className="text-2xl font-bold text-[#132238] tracking-tight">Recovery Console</h2>
          <p className="text-xs text-[#6B7280] font-semibold">
            {step === 1 && "Request a secure code via email or mobile"}
            {step === 2 && "Enter the verification code dispatched to you"}
            {step === 3 && "Establish your new system password"}
          </p>
        </div>

        {/* Global Notifications */}
        <div className="space-y-4 mb-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-[#E74C3C] font-bold">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-[#E8F8F0] border border-[#BCE8D1] p-3.5 text-xs text-[#2E855A] font-bold">
              {success}
            </div>
          )}
        </div>

        {/* STEP 1: Enter details */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            {/* Delivery Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-[#F7FAFD] p-1 rounded-xl border border-[#E3EAF5]">
              <button
                type="button"
                onClick={() => { setDeliveryMethod('email'); setError(''); }}
                className={`py-2 text-[9.5px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                  deliveryMethod === 'email' ? 'bg-[#081B2F] text-white shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                Email Delivery
              </button>
              <button
                type="button"
                onClick={() => { setDeliveryMethod('sms'); setError(''); }}
                className={`py-2 text-[9.5px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                  deliveryMethod === 'sms' ? 'bg-[#081B2F] text-white shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                SMS Delivery
              </button>
            </div>

            {deliveryMethod === 'email' ? (
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
            ) : (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full pl-12"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3.5 font-bold text-white shadow-md transition-all cursor-pointer border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{loading ? 'Dispatching...' : 'Dispatch Verification Code'}</span>
              <ArrowRight className="h-4 w-4 text-[#A7F08C]" />
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Verification OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full text-center tracking-widest font-mono text-base font-bold"
                required
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3.5 font-bold text-white shadow-md transition-all cursor-pointer border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{loading ? 'Verifying...' : 'Verify OTP Code'}</span>
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#6B7280] hover:text-[#0D1B2A] underline cursor-pointer font-bold"
              >
                Resend Code / Change Details
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] py-3.5 font-bold text-white shadow-md transition-all cursor-pointer border border-transparent transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{loading ? 'Updating Password...' : 'Establish New Password'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
