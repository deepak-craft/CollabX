import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collabxApi } from '../../services/collabxApi';
import { DemoOtpNotice } from './DemoOtpNotice';
import { Shield, Building2, Lock, AlertCircle, Key, Award } from 'lucide-react';

export const RestrictedAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [restrictedRole, setRestrictedRole] = useState<'government' | 'expert'>('government');
  const [govId, setGovId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [challengeId, setChallengeId] = useState('');

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!govId.trim()) {
      setError('Please enter your Official Govt Service ID / Expert Verification PIN.');
      return;
    }

    if (!otpSent && passcode) {
      setError('Leave the passcode blank until the OTP is sent.');
      return;
    }
    if (otpSent && !/^\d{6}$/.test(passcode)) {
      setError('Please enter the 6-digit verification OTP.');
      return;
    }

    setIsVerifying(true);
    const role = restrictedRole;
    try {
      if (!otpSent) {
        void collabxApi.requestOtp(govId.trim(), role).then(response => {
          setChallengeId(response.challenge_id);
          setOtpSent(true);
          setPasscode('');
          setIsVerifying(false);
        }).catch(requestError => {
          setError(requestError instanceof Error ? requestError.message : 'Unable to send OTP.');
          setIsVerifying(false);
        });
        return;
      }

      void collabxApi.verifyOtp(challengeId, passcode).then(async response => {
        await login(response.access_token);
        navigate(role === 'government' ? '/government' : '/expert');
      }).catch(verifyError => {
        setError(verifyError instanceof Error ? verifyError.message : 'Unable to verify OTP.');
        setIsVerifying(false);
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to authenticate.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center max-w-md mx-auto w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-amber-400 shadow-md">
          <Shield className="w-8 h-8 text-amber-300" />
        </div>

        <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
          RESTRICTED ACCESS • VERIFICATION REQUIRED
        </span>

        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          Government Official Login
        </h2>
        <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 max-w-xs mx-auto">
          Access restricted to authorized government personnel.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-gov rounded-lg border-2 border-slate-300 space-y-6">
          {/* Role Choice */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Select Statutory Role *</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRestrictedRole('government')}
                className={`p-3 rounded border flex flex-col items-center space-y-1 transition ${
                  restrictedRole === 'government'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-700" />
                <span>Government Officer</span>
                <span className="text-[10px] font-normal text-slate-500">NOC & Challenge Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setRestrictedRole('expert')}
                className={`p-3 rounded border flex flex-col items-center space-y-1 transition ${
                  restrictedRole === 'expert'
                    ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Award className="w-5 h-5 text-purple-700" />
                <span>Domain Expert</span>
                <span className="text-[10px] font-normal text-slate-500">Proposal Scoring & Decision</span>
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <div>
              <label htmlFor="gov-service-id" className="block text-xs font-bold text-slate-700 mb-1">
                {restrictedRole === 'government' ? 'Government Service ID / Employee Code *' : 'Empanelled Expert ID / National PIN *'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="gov-service-id"
                  type="text"
                  placeholder={restrictedRole === 'government' ? 'JH-IAS-2014-882' : 'EXP-HYD-9912'}
                  value={govId}
                  onChange={e => setGovId(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="security-passcode" className="block text-xs font-bold text-slate-700 mb-1">
                Security Token / Passcode *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="security-passcode"
                  type="password"
                  placeholder={otpSent ? '123456' : 'OTP will be requested next'}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  inputMode={otpSent ? 'numeric' : undefined}
                  maxLength={otpSent ? 6 : undefined}
                  disabled={!otpSent}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                />
              </div>
            </div>

            {otpSent && <DemoOtpNotice />}

            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white transition flex items-center justify-center space-x-2 ${
                restrictedRole === 'government' ? 'bg-amber-800 hover:bg-amber-900' : 'bg-purple-800 hover:bg-purple-900'
              }`}
            >
              <span>{isVerifying ? 'Authenticating Credentials...' : otpSent ? 'Verify OTP & Enter' : 'Send OTP'}</span>
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="pt-2 text-center text-xs text-slate-600">
            New to CollabX?{' '}
            <button
              type="button"
              onClick={() => navigate('/register?role=government')}
              className="font-bold text-gov-blue hover:underline focus:outline-none"
            >
              Register
            </button>
          </div>

          {/* Back link */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-xs">
            <Link to="/login" className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center">
              ← Back to account type
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
