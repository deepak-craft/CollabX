import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Phone, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const CitizenLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [authMode, setAuthMode] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = (): boolean => {
    setError('');

    if (authMode === 'mobile') {
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        setError('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
        return false;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    }

    if (otpSent && (!otp || otp.length < 4)) {
      setError('Please enter the 4-digit OTP sent to your device.');
      return false;
    }

    return true;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      loginAs('citizen', 'Citizen');
      navigate('/citizen');
    }, 600);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center max-w-md mx-auto w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        {/* Emblem */}
        <div className="w-14 h-14 mx-auto rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-md">
          <UserCheck className="w-8 h-8 text-gov-saffron-amber" />
        </div>

        <span className="inline-block px-3 py-1 bg-gov-blue-50 text-gov-blue border border-gov-border rounded-full text-xs font-bold uppercase tracking-wider">
          Jharkhand Citizen Service Access
        </span>

        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          Citizen Login / नागरिक लॉगिन
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Report civic issues, track progress, and evaluate completed infrastructure pilots.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-gov rounded-lg border border-gov-border space-y-6">
          {/* Tab Selector: Mobile vs Email */}
          <div className="flex bg-slate-100 p-1 rounded-md text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('mobile');
                setError('');
              }}
              className={`flex-1 py-2 text-center rounded transition ${
                authMode === 'mobile' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 inline mr-1" />
              Mobile Number & OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setError('');
              }}
              className={`flex-1 py-2 text-center rounded transition ${
                authMode === 'email' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email & OTP
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
            {authMode === 'mobile' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Indian Mobile Number / मोबाइल नंबर *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono font-bold">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    disabled={otpSent}
                    className="w-full pl-12 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Example: 9876543210 (10 digits starting 6-9)</span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address / ईमेल पता *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="sunita.devi@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={otpSent}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                  />
                </div>
              </div>
            )}

            {otpSent && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">
                    Verification OTP *
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" /> OTP Sent (Code: 1234)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="1234"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue font-mono tracking-widest"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-gov-navy hover:bg-gov-navy-dark focus:outline-none transition flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Verifying...' : otpSent ? 'Login to Citizen Portal →' : 'Send Verification OTP →'}</span>
            </button>
          </form>

          {/* Back link */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
            <Link to="/" className="text-slate-500 hover:text-slate-800 text-[11px]">
              ← Back to Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
