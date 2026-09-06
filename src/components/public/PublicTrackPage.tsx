import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ProblemReport } from '../../types';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Search, MapPin, AlertCircle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

const TRACKING_STAGES = [
  { id: 'submitted', label: 'Submitted', desc: 'Received & logged' },
  { id: 'verified', label: 'Verified', desc: 'Field inspect approved' },
  { id: 'under_review', label: 'Under Review', desc: 'Departmental review' },
  { id: 'action_initiated', label: 'Action Initiated', desc: 'Challenge / Project assigned' },
  { id: 'resolved', label: 'Resolved', desc: 'Pilot deployed & verified' },
];

export const PublicTrackPage: React.FC = () => {
  const location = useLocation();
  const { t } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const [searchedReport, setSearchedReport] = useState<ProblemReport | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [allProblems, setAllProblems] = useState<ProblemReport[]>([]);

  useEffect(() => {
    const problems = storageService.getProblems();
    setAllProblems(problems);

    // Auto-search if query string ?id=... is present
    const params = new URLSearchParams(location.search);
    const initialId = params.get('id');
    if (initialId) {
      setSearchQuery(initialId);
      const match = problems.find(p => p.id.toLowerCase() === initialId.toLowerCase());
      if (match) {
        setSearchedReport(match);
      } else if (problems.length > 0) {
        setSearchedReport(problems[0]);
      }
      setHasSearched(true);
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = searchQuery.trim().toLowerCase();
    const mob = mobileQuery.trim();

    const match = allProblems.find(p => {
      if (q && p.id.toLowerCase() === q) return true;
      if (mob && p.citizenPhone && p.citizenPhone.includes(mob)) return true;
      return false;
    });

    if (match) {
      setSearchedReport(match);
    } else {
      setSearchedReport(null);
    }
  };

  const handleSelectSample = (problem: ProblemReport) => {
    setSearchQuery(problem.id);
    setSearchedReport(problem);
    setHasSearched(true);
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 0;
      case 'verified': return 1;
      case 'under_review': return 2;
      case 'challenge_created':
      case 'in_project': return 3;
      case 'pilot_deployed':
      case 'impact_measured': return 4;
      default: return 1;
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gov-blue mb-1">
          <Search className="w-4 h-4 text-gov-saffron" />
          <span>{t('Government of Jharkhand • Grievance Tracking', 'झारखंड सरकार • शिकायत ट्रैकिंग')}</span>
        </div>
        <h1 className="text-3xl font-black text-gov-navy font-sans tracking-tight">
          {t('Track Your Report Status', 'अपनी रिपोर्ट की स्थिति देखें')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {t(
            'Enter your Registration Reference ID or registered Mobile Number to inspect progress.',
            'अपनी प्रगति का निरीक्षण करने के लिए अपनी पंजीकरण संदर्भ आईडी या पंजीकृत मोबाइल नंबर दर्ज करें।'
          )}
        </p>
      </div>

      {/* Track Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="track-id" className="block text-xs font-bold text-slate-700 mb-1">
              {t('Registration Reference ID', 'पंजीकरण संदर्भ आईडी')}
            </label>
            <input
              id="track-id"
              type="text"
              placeholder="e.g. PR-2026-0881"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="track-mobile" className="block text-xs font-bold text-slate-700 mb-1">
              {t('Registered Mobile Number', 'पंजीकृत मोबाइल नंबर')}
            </label>
            <input
              id="track-mobile"
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={mobileQuery}
              onChange={e => setMobileQuery(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue font-mono"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center justify-center space-x-1.5 transition focus:ring-2 focus:ring-gov-blue shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{t('View Status', 'स्थिति देखें')}</span>
            </button>
          </div>
        </form>

        {/* Prototype Sample Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Try Prototype Sample IDs:</span>
          {allProblems.slice(0, 3).map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectSample(p)}
              className="font-mono text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-gov-navy font-bold rounded border border-slate-300"
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          {searchedReport ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200">
                      {searchedReport.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      Submitted on {new Date(searchedReport.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gov-navy mt-1">{searchedReport.title}</h2>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                    <span>{searchedReport.panchayatOrLocality}, {searchedReport.district}</span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded">
                  {searchedReport.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Report Summary:</span>
                <p className="text-slate-600 leading-relaxed">{searchedReport.description}</p>
              </div>

              {/* Status Progression Stages */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Resolution Progress Stages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {TRACKING_STAGES.map((stage, idx) => {
                    const currentIdx = getStageIndex(searchedReport.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stage.id}
                        className={`p-3 rounded-md border text-left text-xs transition ${
                          isCurrent
                            ? 'bg-gov-navy text-white border-gov-navy font-bold shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1">
                          {isCompleted ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-gov-saffron' : 'text-emerald-600'}`} />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className="font-bold text-[11px]">{stage.label}</span>
                        </div>
                        <p className={`text-[10px] ${isCurrent ? 'text-slate-200' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {stage.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                {t('No Matching Report Found', 'कोई मेल खाती रिपोर्ट नहीं मिली')}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t(
                  'Please verify the Registration Reference ID or Mobile Number. You can also try the prototype sample IDs above.',
                  'कृपया पंजीकरण संदर्भ आईडी या मोबाइल नंबर सत्यापित करें। आप ऊपर दिए गए प्रोटोटाइप आईडी भी आजमा सकते हैं।'
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-500 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-gov-blue flex-shrink-0" />
        <span>
          Note: This is a proposed platform prototype. Demonstrated data reflects sample citizen reports stored locally in browser state.
        </span>
      </div>
    </div>
  );
};
