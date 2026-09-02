import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Building2, Lock, CheckCircle2, AlertCircle, Key, Award } from 'lucide-react';

export const RestrictedAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [restrictedRole, setRestrictedRole] = useState<'government' | 'expert'>('government');
  const [govId, setGovId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!govId.trim()) {
      setError('Please enter your Official Govt Service ID / Expert Verification PIN.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      if (restrictedRole === 'government') {
        loginAs('government', 'Government Officer');
        navigate('/government');
      } else {
        loginAs('expert', 'Domain Expert');
        navigate('/expert');
      }
    }, 600);
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
          Government & Expert Statutory Access
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Authorized portal for State Nodal Officers and Empanelled Technical Evaluation Experts.
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
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {restrictedRole === 'government' ? 'Government Service ID / Employee Code *' : 'Empanelled Expert ID / National PIN *'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={restrictedRole === 'government' ? 'JH-IAS-2014-882' : 'EXP-HYD-9912'}
                  value={govId}
                  onChange={e => setGovId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Token / Passcode *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white transition flex items-center justify-center space-x-2 ${
                restrictedRole === 'government' ? 'bg-amber-800 hover:bg-amber-900' : 'bg-purple-800 hover:bg-purple-900'
              }`}
            >
              <span>{isVerifying ? 'Authenticating Credentials...' : 'Authenticate Credentials & Enter →'}</span>
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
