import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Mail, Phone, Lock, Building2, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const IndustryLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [workEmail, setWorkEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isProfessionalEmail = (emailStr: string): boolean => {
    const lower = emailStr.toLowerCase().trim();
    if (/@(gmail|yahoo|hotmail|outlook|live|icloud|rediffmail)\./i.test(lower)) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower);
  };

  const validateInputs = (): boolean => {
    setError('');

    if (!workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!isProfessionalEmail(workEmail)) {
      setError('Corporate Email Required: Please enter your professional corporate / company email address (e.g. rajesh.singhal@tatasteel.com). Generic personal email providers (Gmail, Yahoo) are not accepted for Industry Partners.');
      return false;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }

    if (!companyName.trim()) {
      setError('Please enter your Company / Organization Name.');
      return false;
    }

    if (!designation.trim()) {
      setError('Please enter your Designation / Job Title.');
      return false;
    }

    if (otpSent && (!otp || otp.length < 4)) {
      setError('Please enter the 4-digit verification OTP sent to your work email.');
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
      loginAs('industry', 'Industry Partner');
      navigate('/industry');
    }, 600);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center max-w-md mx-auto w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-emerald-400 shadow-md">
          <Briefcase className="w-8 h-8 text-emerald-300" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
          Jharkhand Industry & CSR Collaboration Access
        </span>

        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          Industry / Startup Partner Login
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Offer CSR funding, equipment, testing facilities, and mentorship to verified university prototypes.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-gov rounded-lg border border-gov-border space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Corporate Work Email * (Company Domain)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="rajesh.singhal@tatasteel.com"
                  value={workEmail}
                  onChange={e => setWorkEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                />
              </div>
              <span className="text-[10px] text-slate-400">Must be an official corporate email (e.g., @tatasteel.com)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Org Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tata Steel CSR"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    disabled={otpSent}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="CSR Head"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    disabled={otpSent}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue font-mono"
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">Verification OTP *</label>
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
              <span>{isSubmitting ? 'Verifying Corporate Domain...' : otpSent ? 'Login to Industry Portal →' : 'Verify Corporate Identity →'}</span>
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
