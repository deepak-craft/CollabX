import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, AlertCircle, ArrowLeft } from 'lucide-react';
import { OtpInput } from './OtpInput';
import { collabxApi } from '../../services/collabxApi';

export const UniversityLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [academicRole, setAcademicRole] = useState<'student' | 'professor'>('student');
  const [universityEmail, setUniversityEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInstitutionalEmail = (emailStr: string): boolean => {
    const lower = emailStr.toLowerCase().trim();
    const institutionalTLDs = ['.edu', '.edu.in', '.ac.in', '.res.in', 'college.in', 'university.ac.in'];
    
    if (/@(gmail|yahoo|hotmail|outlook|live|icloud|rediffmail)\./i.test(lower)) {
      return false;
    }

    return institutionalTLDs.some(tld => lower.endsWith(tld)) || /@[a-z0-9-]+\.(ac|edu)\.[a-z]{2,3}$/i.test(lower);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digitsOnly);
    if (error) setError('');
  };

  const validateInputs = (): boolean => {
    setError('');

    if (!universityEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(universityEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!isInstitutionalEmail(universityEmail)) {
      setError('Invalid University Email: Please use your official institutional / college email address ending in .ac.in, .edu, or .edu.in.');
      return false;
    }

    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }

    if (otpSent && otp.length !== 6) {
      setError('Please enter the complete 6-digit verification OTP.');
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const response = await collabxApi.requestOtp(universityEmail, academicRole);
      setChallengeId(response.challenge_id);
      setIsSubmitting(false);
      setOtpSent(true);
      setOtp('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send OTP.');
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const response = await collabxApi.verifyOtp(challengeId, otp);
      await login(response.access_token);
      navigate('/university');
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Unable to verify OTP.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center max-w-md mx-auto w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <GraduationCap className="w-6 h-6 text-gov-blue" />
          University / Research Login
        </h1>
      </div>

      <div className="bg-white p-6 sm:p-8 shadow-sm rounded-xl border border-slate-200 space-y-6">
        {/* Academic Role Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAcademicRole('student')}
            className={`flex-1 py-2 text-center rounded-md transition ${
              academicRole === 'student' ? 'bg-white text-gov-navy shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Innovator
          </button>
          <button
            type="button"
            onClick={() => setAcademicRole('professor')}
            className={`flex-1 py-2 text-center rounded-md transition ${
              academicRole === 'professor' ? 'bg-white text-gov-navy shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Advisor
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="university-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional Email (.ac.in / .edu)
            </label>
            <input
              id="university-email"
              type="email"
              placeholder={academicRole === 'student' ? 'student@bitmesra.ac.in' : 'faculty@bitmesra.ac.in'}
              value={universityEmail}
              onChange={e => {
                setUniversityEmail(e.target.value);
                if (error) setError('');
              }}
              disabled={otpSent}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue focus:border-gov-blue"
            />
          </div>

          <div>
            <label htmlFor="university-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number
            </label>
            <div className="relative flex rounded-md shadow-xs">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-mono font-medium">
                +91
              </span>
              <input
                id="university-mobile"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="9876543210"
                value={mobileNumber}
                onChange={handleMobileChange}
                disabled={otpSent}
                className="flex-1 min-w-0 block w-full px-3 py-2 text-sm border border-slate-300 rounded-r-md focus:ring-2 focus:ring-gov-blue focus:border-gov-blue font-mono"
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-center font-medium text-slate-700">
                OTP sent to your registered university email.
              </p>
              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError('');
                }}
                length={6}
                disabled={isSubmitting}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-md shadow-xs text-xs font-bold text-white bg-gov-navy hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue transition disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link to="/login" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to account type
          </Link>
        </div>
      </div>
    </div>
  );
};

