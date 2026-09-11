import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { ProblemReport } from '../../types';
import { ProblemReportForm } from './ProblemReportForm';
import { MyReportsTimeline } from './MyReportsTimeline';
import { CitizenFeedbackModal } from './CitizenFeedbackModal';
import { CitizenPortalLayout } from './CitizenPortalLayout';
import { OfflineReportsStatus } from './OfflineReportsStatus';
import { 
  PlusCircle, 
  Search, 
  AlertCircle
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const [problems, setProblems] = useState<ProblemReport[]>(() => storageService.getProblems());
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackProjectId, setFeedbackProjectId] = useState<string>('PROJ-JH-2024-001');

  // Track Report State
  const [trackSearchId, setTrackSearchId] = useState<string>('');
  const [searchedReport, setSearchedReport] = useState<ProblemReport | null | undefined>(undefined);

  const myReports = problems.filter(p => 
    p.citizenName?.toLowerCase().includes((currentUser?.name || '').toLowerCase()) || 
    p.citizenPhone === (currentUser as any)?.phone
  );
  const displayReports = myReports.length > 0 ? myReports : problems;

  // Metrics
  const totalSubmitted = displayReports.length;
  const underReviewCount = displayReports.filter(p => 
    ['submitted', 'ai_analyzed', 'under_review'].includes(p.status)
  ).length;
  const actionInitiatedCount = displayReports.filter(p => 
    ['verified', 'challenge_created', 'in_project', 'pilot_deployed'].includes(p.status)
  ).length;
  const resolvedCount = displayReports.filter(p => 
    ['impact_measured', 'resolved'].includes(p.status)
  ).length;

  const handleProblemSubmitted = (_newProblem: ProblemReport) => {
    setProblems(storageService.getProblems());
    navigate('/citizen/reports');
  };

  const handleOpenFeedback = (_problemId: string) => {
    setFeedbackProjectId('PROJ-JH-2024-001');
    setIsFeedbackOpen(true);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackSearchId.trim()) return;
    const found = problems.find(p => p.id.toLowerCase() === trackSearchId.trim().toLowerCase());
    setSearchedReport(found || null);
  };

  const notifications = storageService.getNotifications();

  return (
    <CitizenPortalLayout>
      <Routes>
        {/* 1. Dashboard Home */}
        <Route
          index
          element={
            <div className="space-y-6">
              <OfflineReportsStatus />
              <div className="bg-white p-4 rounded-md border border-slate-200 space-y-1">
                <h2 className="text-base font-bold text-gov-navy">Citizen Dashboard</h2>
                <p className="text-xs text-slate-600">
                  {t('View your submitted reports and their current status.', 'अपनी दर्ज शिकायतों और उनकी स्थिति देखें।')}
                </p>
              </div>

              {/* Summary KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Reports Submitted', 'दर्ज कुल समस्याएं')}</div>
                  <div className="text-2xl font-bold text-gov-navy mt-1">{totalSubmitted}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Recorded in portal</div>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t('Under Review', 'समीक्षा के अधीन')}</div>
                  <div className="text-2xl font-bold text-amber-800 mt-1">{underReviewCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Initial assessment</div>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t('Action Initiated', 'कार्रवाई शुरू')}</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">{actionInitiatedCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Department assigned</div>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('Resolved', 'समाधान हुआ')}</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-1">{resolvedCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Verified on ground</div>
                </div>
              </div>

              {/* Action Callout */}
              <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gov-navy">
                    {t('Need to report a new civic issue?', 'क्या नई नागरिक समस्या दर्ज करनी है?')}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {t('Submit location, photos, or details for official departmental evaluation.', 'विभाग द्वारा मूल्यांकन हेतु स्थान व विवरण दर्ज करें।')}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/citizen/report')}
                  className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('Report a Problem', 'समस्या दर्ज करें')}</span>
                </button>
              </div>

              {/* Recent Reports Table */}
              <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                    {t('Recent Grievance Submissions', 'हालिया दर्ज शिकायतें')}
                  </h3>
                  <button
                    onClick={() => navigate('/citizen/reports')}
                    className="text-xs font-semibold text-gov-navy hover:underline"
                  >
                    {t('View All Submissions →', 'सभी देखें →')}
                  </button>
                </div>

                {displayReports.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    {t('No reports submitted yet.', 'अभी तक कोई समस्या दर्ज नहीं की गई है।')}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="p-2.5">Registration ID</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {displayReports.slice(0, 5).map(report => {
                          let statusBadgeClass = 'bg-slate-100 text-slate-800 border-slate-300';
                          let statusLabel = 'Submitted';

                          if (['submitted', 'ai_analyzed'].includes(report.status)) {
                            statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
                            statusLabel = 'Submitted';
                          } else if (report.status === 'under_review') {
                            statusBadgeClass = 'bg-blue-50 text-blue-800 border-blue-300';
                            statusLabel = 'Under Review';
                          } else if (['verified', 'challenge_created', 'in_project', 'pilot_deployed'].includes(report.status)) {
                            statusBadgeClass = 'bg-indigo-50 text-indigo-900 border-indigo-300';
                            statusLabel = 'Action Initiated';
                          } else if (['impact_measured', 'resolved'].includes(report.status)) {
                            statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                            statusLabel = 'Resolved';
                          }

                          return (
                            <tr key={report.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono font-bold text-gov-navy">{report.id}</td>
                              <td className="p-2.5">{report.aiAnalysis?.category || 'Civic Infrastructure'}</td>
                              <td className="p-2.5 text-slate-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBadgeClass}`}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => navigate('/citizen/reports')}
                                  className="text-gov-navy font-semibold hover:underline"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          }
        />

        {/* 2. Report a Problem */}
        <Route
          path="report"
          element={
            <div className="space-y-4">
              <OfflineReportsStatus />
              <div className="bg-white p-4 rounded-md border border-slate-200 text-xs text-slate-600">
                <h2 className="text-sm font-bold text-gov-navy mb-1">Report a Problem</h2>
                <p>Fill out the required details below to submit a formal report to municipal authorities.</p>
              </div>
              <ProblemReportForm onSuccess={handleProblemSubmitted} />
            </div>
          }
        />

        {/* 3. My Problems */}
        <Route
          path="reports"
          element={
            <MyReportsTimeline
              problems={displayReports}
              onOpenFeedbackModal={handleOpenFeedback}
            />
          }
        />

        {/* Redirect auxiliary routes to core Citizen views */}
        <Route path="track" element={<Navigate to="/citizen/reports" replace />} />
        <Route path="nearby" element={<Navigate to="/citizen/reports" replace />} />
        <Route path="notifications" element={<Navigate to="/citizen" replace />} />
        <Route path="profile" element={<Navigate to="/citizen" replace />} />

        {/* Catch-all fallback inside Citizen routes */}
        <Route path="*" element={<Navigate to="/citizen" replace />} />
      </Routes>

      {/* Citizen Feedback Modal */}
      <CitizenFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitted={() => {
          setProblems(storageService.getProblems());
        }}
        projectId={feedbackProjectId}
      />
    </CitizenPortalLayout>
  );
};
