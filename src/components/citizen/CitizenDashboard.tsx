import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { ProblemReport } from '../../types';
import { ProblemReportForm } from './ProblemReportForm';
import { NearbyProblems } from './NearbyProblems';
import { MyReportsTimeline } from './MyReportsTimeline';
import { CitizenFeedbackModal } from './CitizenFeedbackModal';
import { CitizenPortalLayout } from './CitizenPortalLayout';
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
              <div className="bg-white p-4 rounded-md border border-slate-200 text-xs text-slate-600">
                <h2 className="text-sm font-bold text-gov-navy mb-1">Report a Problem</h2>
                <p>Fill out the required details below to submit a formal report to municipal authorities.</p>
              </div>
              <ProblemReportForm onSuccess={handleProblemSubmitted} />
            </div>
          }
        />

        {/* 3. My Reports */}
        <Route
          path="reports"
          element={
            <MyReportsTimeline
              problems={displayReports}
              onOpenFeedbackModal={handleOpenFeedback}
            />
          }
        />

        {/* 4. Track Report */}
        <Route
          path="track"
          element={
            <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-gov-navy">{t('Track Your Report', 'अपनी रिपोर्ट ट्रैक करें')}</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t('Enter your official Registration ID to view detailed progress.', 'विस्तृत प्रगति देखने के लिए अपनी आधिकारिक पंजीकरण आईडी दर्ज करें।')}
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="max-w-md space-y-3">
                <div>
                  <label htmlFor="registrationIdInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registration ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="registrationIdInput"
                      type="text"
                      value={trackSearchId}
                      onChange={(e) => setTrackSearchId(e.target.value)}
                      placeholder="e.g. REP-JH-2024-001"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gov-navy focus:outline-none font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded hover:bg-slate-800 transition"
                    >
                      Track Report
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Format: REP-JH-2024-XXX</span>
                </div>
              </form>

              {searchedReport !== undefined && (
                <div className="pt-4 border-t border-slate-200">
                  {searchedReport === null ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>No report found for Registration ID "{trackSearchId}". Please verify the ID and try again.</span>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 text-xs">
                        <span className="font-mono font-bold text-gov-navy text-sm">{searchedReport.id}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold uppercase text-[10px]">
                          Status: {searchedReport.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <h3 className="font-bold text-slate-900">{searchedReport.title}</h3>
                        <p className="text-slate-600">{searchedReport.description}</p>
                        <div className="text-slate-500 pt-1">
                          Location: <span className="font-semibold text-slate-700">{searchedReport.panchayatOrLocality}, {searchedReport.district}</span> | Submitted on: {new Date(searchedReport.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />

        {/* 5. Nearby Issues */}
        <Route
          path="nearby"
          element={
            <NearbyProblems onViewDetails={() => navigate('/citizen/reports')} />
          }
        />

        {/* 6. Notifications */}
        <Route
          path="notifications"
          element={
            <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-bold text-gov-navy">{t('Official Notifications', 'आधिकारिक सूचनाएं')}</h2>
                <p className="text-xs text-slate-600">Updates regarding your submitted grievances and local public works.</p>
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No new notifications.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-bold text-gov-navy">{notif.title}</span>
                        <span>{new Date(notif.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        />

        {/* 7. Profile */}
        <Route
          path="profile"
          element={
            <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-bold text-gov-navy">{t('Citizen Profile Information', 'नागरिक प्रोफाइल विवरण')}</h2>
                <p className="text-xs text-slate-600">Registered account details for grievance management.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.name}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Registered Mobile / Email</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">{(currentUser as any).phone || currentUser.email || 'N/A'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">District / Division</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.district || 'Ranchi'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Ward / Locality</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{(currentUser as any).panchayatOrLocality || 'Ward 14, Harmu'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Preferred Portal Language</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">English / Hindi (हिंदी)</span>
                </div>
              </div>
            </div>
          }
        />

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
