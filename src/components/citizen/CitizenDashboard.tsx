import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { ProblemReport } from '../../types';
import { ProblemReportForm } from './ProblemReportForm';
import { NearbyProblems } from './NearbyProblems';
import { MyReportsTimeline } from './MyReportsTimeline';
import { CitizenFeedbackModal } from './CitizenFeedbackModal';
import { LinkCollab } from '../community/LinkCollab';
import { 
  Home, 
  PlusCircle, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Droplets, 
  ThumbsUp, 
  Sparkles,
  Shield
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

interface CitizenDashboardProps {
  initialTab?: string;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ initialTab = 'home' }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on URL path or initialTab
  const getTabFromPath = () => {
    if (location.pathname.endsWith('/report')) return 'report';
    if (location.pathname.endsWith('/nearby')) return 'nearby';
    if (location.pathname.endsWith('/reports')) return 'my_reports';
    if (location.pathname.endsWith('/link-collab')) return 'link_collab';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, initialTab]);

  const handleTabChange = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };
  const [problems, setProblems] = useState<ProblemReport[]>(() => storageService.getProblems());
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackProjectId, setFeedbackProjectId] = useState<string>('PROJ-JH-2024-001');

  // Filter problems for this citizen
  const myReports = problems.filter(p => p.citizenName.toLowerCase().includes(currentUser.name.toLowerCase()));

  const handleProblemSubmitted = (newProblem: ProblemReport) => {
    setProblems(storageService.getProblems());
    setActiveTab('my_reports');
  };

  const handleOpenFeedback = (problemId: string) => {
    setFeedbackProjectId('PROJ-JH-2024-001');
    setIsFeedbackOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Citizen Portal Sub-Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => handleTabChange('home', '/citizen')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'home'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{t('Home', 'होम')}</span>
        </button>

        <button
          onClick={() => handleTabChange('report', '/citizen/report')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'report'
              ? 'bg-gov-saffron text-white shadow-sm'
              : 'text-slate-600 hover:text-gov-saffron hover:bg-amber-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('Report Problem', 'समस्या दर्ज करें')}</span>
        </button>

        <button
          onClick={() => handleTabChange('nearby', '/citizen/nearby')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'nearby'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('Nearby Problems', 'आस-पास की समस्याएं')}</span>
        </button>

        <button
          onClick={() => handleTabChange('my_reports', '/citizen/reports')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'my_reports'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('My Reports', 'मेरी समस्याएं')}</span>
          {myReports.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-gov-saffron text-white rounded-full text-[10px]">
              {myReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('link_collab', '/citizen/link-collab')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'link_collab'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-gov-saffron" />
          <span>{t('Link Collab Advisory', 'लिंक सहभागिता')}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: HOME (Simple, Mobile-Friendly Citizen Home)   */}
      {/* ==================================================== */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Welcome & Quick Action Card */}
          <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-lg p-5 sm:p-6 shadow-gov">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold text-gov-saffron-amber uppercase tracking-wider">
                {t('Nagrik Seva Portal • Government of Jharkhand', 'नागरिक सेवा पोर्टल • झारखंड सरकार')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                {t(`Welcome, ${currentUser.name}`, `नमस्ते, ${currentUser.name}`)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t(
                  'Have you encountered waterlogging, choked culverts, or broken roads? Report it directly using your voice or camera. Your submission is evaluated by GovTech AI and reviewed by Jharkhand State municipal engineers.',
                  'क्या आपको जलभराव या अवरुद्ध नालियों का सामना करना पड़ रहा है? अपनी आवाज या कैमरे से तुरंत समस्या दर्ज करें।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('report')}
                  className="px-4 py-2 bg-gov-saffron hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center space-x-2 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('Report a Problem Now', 'नई समस्या दर्ज करें')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('nearby')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded text-xs font-bold flex items-center space-x-2 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('Problems Near Me', 'मेरे आस-पास की समस्याएं')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Citizen KPI Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('report')}
              className="bg-white p-4 rounded-lg border border-gov-border shadow-gov hover:border-gov-saffron cursor-pointer transition"
            >
              <div className="w-8 h-8 rounded bg-amber-100 text-gov-saffron flex items-center justify-center mb-2">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('Report Grievance', 'समस्या दर्ज')}</div>
              <div className="text-base font-bold text-gov-navy mt-1">1-Click Voice Note</div>
              <div className="text-[11px] text-slate-400 mt-0.5">AI categorization support</div>
            </div>

            <div
              onClick={() => setActiveTab('nearby')}
              className="bg-white p-4 rounded-lg border border-gov-border shadow-gov hover:border-gov-blue cursor-pointer transition"
            >
              <div className="w-8 h-8 rounded bg-blue-100 text-gov-blue flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('Problems Near Me', 'आस-पास')}</div>
              <div className="text-base font-bold text-gov-navy mt-1">4 Active in Ward 14</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Confirm & add proof</div>
            </div>

            <div
              onClick={() => setActiveTab('my_reports')}
              className="bg-white p-4 rounded-lg border border-gov-border shadow-gov hover:border-gov-green cursor-pointer transition"
            >
              <div className="w-8 h-8 rounded bg-emerald-100 text-gov-green flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('My Active Reports', 'मेरी रिपोर्ट')}</div>
              <div className="text-base font-bold text-gov-navy mt-1">1 Active In-Pilot</div>
              <div className="text-[11px] text-gov-green font-semibold mt-0.5">Harmu Bypass Pilot</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('My Impact', 'मेरा प्रभाव')}</div>
              <div className="text-base font-bold text-gov-navy mt-1">4,500+ Beneficiaries</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Harmu flood clearance</div>
            </div>
          </div>

          {/* Active Pilot Highlight with "Did this solve the problem?" callout */}
          <div className="bg-white rounded-lg border-2 border-emerald-300 shadow-gov p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gov-green animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t('Active Live Pilot In Your Neighborhood', 'आपके क्षेत्र में सक्रिय लाइव पायलट')}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">
                Project: PROJ-JH-2024-001
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-gov-navy">
                Harmu Bypass Smart Retention & Automated Siphon Pilot
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                BIT Mesra engineering team with Tata Steel CSR support has deployed automated siphon drains at the Harmu culvert bottleneck.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-emerald-950 space-y-0.5">
                <span className="font-bold">Post-Pilot Resident Verification:</span>
                <p className="text-emerald-800 text-[11px]">
                  Did yesterday rain runoff clear out faster? Help evaluate this prototype.
                </p>
              </div>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="px-4 py-2 bg-gov-green hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
              >
                <span>{t('Did this solve the problem? Give Feedback →', 'क्या समाधान हुआ? फीडबैक दें →')}</span>
              </button>
            </div>
          </div>

          {/* Citizen Recent Reports Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gov-navy">
                {t('My Recent Civic Submissions', 'मेरी हालिया दर्ज समस्याएं')}
              </h3>
              <button
                onClick={() => setActiveTab('my_reports')}
                className="text-xs font-bold text-gov-blue hover:underline flex items-center space-x-1"
              >
                <span>{t('View Full 8-Step Timeline', 'पूरी समयरेखा देखें')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myReports.map(report => (
                <div
                  key={report.id}
                  onClick={() => setActiveTab('my_reports')}
                  className="bg-white p-4 rounded-lg border border-gov-border shadow-gov hover:border-gov-blue cursor-pointer transition space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-bold">{report.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-gov-blue font-bold text-[10px]">
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{report.title}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{report.panchayatOrLocality}</span>
                    <span className="font-semibold text-gov-navy">Step 7 of 8 (Pilot)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: REPORT A PROBLEM                             */}
      {/* ==================================================== */}
      {activeTab === 'report' && (
        <ProblemReportForm onSuccess={handleProblemSubmitted} />
      )}

      {/* ==================================================== */}
      {/* TAB 3: NEARBY PROBLEMS                              */}
      {/* ==================================================== */}
      {activeTab === 'nearby' && (
        <NearbyProblems onViewDetails={() => setActiveTab('my_reports')} />
      )}

      {/* ==================================================== */}
      {/* TAB 4: MY REPORTS TIMELINE                           */}
      {/* ==================================================== */}
      {activeTab === 'my_reports' && (
        <MyReportsTimeline
          problems={myReports.length > 0 ? myReports : problems.slice(0, 2)}
          onOpenFeedbackModal={handleOpenFeedback}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 5: LINK COLLAB                                   */}
      {/* ==================================================== */}
      {activeTab === 'link_collab' && (
        <LinkCollab />
      )}

      {/* Citizen Feedback Modal */}
      <CitizenFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitted={() => {
          setProblems(storageService.getProblems());
        }}
        projectId={feedbackProjectId}
      />
    </div>
  );
};
