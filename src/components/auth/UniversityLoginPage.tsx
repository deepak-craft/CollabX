import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Phone, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const UniversityLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [academicRole, setAcademicRole] = useState<'student' | 'professor'>('student');
  const [universityEmail, setUniversityEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInstitutionalEmail = (emailStr: string): boolean => {
    const lower = emailStr.toLowerCase().trim();
    const institutionalTLDs = ['.edu', '.edu.in', '.ac.in', '.res.in', 'college.in', 'university.ac.in'];
    
    // Explicitly reject common generic personal webmail domains
    if (/@(gmail|yahoo|hotmail|outlook|live|icloud|rediffmail)\./i.test(lower)) {
      return false;
    }

    return institutionalTLDs.some(tld => lower.endsWith(tld)) || /@[a-z0-9-]+\.(ac|edu)\.[a-z]{2,3}$/i.test(lower);
  };

  const validateInputs = (): boolean => {
    setError('');

    if (!universityEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(universityEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!isInstitutionalEmail(universityEmail)) {
      setError('Invalid University Email: Please use your official institutional / college email address ending in .ac.in, .edu, or .edu.in (e.g., student@bitmesra.ac.in). Personal webmail (Gmail, Yahoo) is not accepted.');
      return false;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }

    if (otpSent && (!otp || otp.length < 4)) {
      setError('Please enter the 4-digit verification OTP sent to your university email.');
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
      loginAs(academicRole, academicRole === 'student' ? 'Student' : 'Professor');
      navigate('/university');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-blue-400 shadow-md">
          <GraduationCap className="w-8 h-8 text-blue-300" />
        </div>

        <span className="inline-block px-3 py-1 bg-blue-50 text-gov-blue border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
          Jharkhand Higher Education & Research Access
        </span>

        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          University & Research Login
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Submit engineering proposals, form multidisciplinary teams, and access state research challenges.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-gov rounded-lg border border-gov-border space-y-6">
          {/* Academic Role Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Academic Persona Type *</label>
            <div className="flex bg-slate-100 p-1 rounded-md text-xs font-bold">
              <button
                type="button"
                onClick={() => setAcademicRole('student')}
                className={`flex-1 py-2 text-center rounded transition ${
                  academicRole === 'student' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👨‍🎓 Student Innovator
              </button>
              <button
                type="button"
                onClick={() => setAcademicRole('professor')}
                className={`flex-1 py-2 text-center rounded transition ${
                  academicRole === 'professor' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👨‍🏫 Faculty Advisor
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional College Email * (.ac.in / .edu)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  placeholder={academicRole === 'student' ? 'amit.kumar@bitmesra.ac.in' : 'dr.verma@bitmesra.ac.in'}
                  value={universityEmail}
                  onChange={e => setUniversityEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                />
              </div>
              <span className="text-[10px] text-slate-400">Must be an official university domain (e.g., @bitmesra.ac.in, @nitjsr.ac.in)</span>
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
              <span>{isSubmitting ? 'Validating Domain...' : otpSent ? 'Login to University Portal →' : 'Verify Institutional Email →'}</span>
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
