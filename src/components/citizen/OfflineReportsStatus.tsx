import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { collabxApi } from '../../services/collabxApi';
import { indexedDbService, OfflineReportSummary } from '../../services/indexedDbService';

const emptySummary: OfflineReportSummary = { pending: [], synced: [], failed: [] };

const ReportGroup: React.FC<{ title: string; reports: OfflineReport[]; tone: string }> = ({ title, reports, tone }) => (
  <div className="space-y-1.5">
    <div className={`text-[11px] font-bold uppercase tracking-wide ${tone}`}>
      {title} ({reports.length})
    </div>
    {reports.length > 0 ? reports.slice(0, 5).map(report => (
      <div key={report.id} className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white px-2.5 py-2 text-xs">
        <span className="truncate text-slate-700">{report.title || report.description}</span>
        <span className="shrink-0 font-mono text-[10px] text-slate-500">{report.serverId || report.id}</span>
      </div>
    )) : <div className="text-xs text-slate-500">None</div>}
    {reports.length > 5 && <div className="text-[10px] text-slate-500">Showing 5 of {reports.length}</div>}
  </div>
);

type OfflineReport = Awaited<ReturnType<typeof indexedDbService.getAllReports>>[number];

export const OfflineReportsStatus: React.FC = () => {
  const [summary, setSummary] = useState<OfflineReportSummary>(emptySummary);
  const [isSyncing, setIsSyncing] = useState(false);

  const refresh = () => {
    void indexedDbService.getSummary().then(setSummary);
  };

  const sync = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      refresh();
      return;
    }
    setIsSyncing(true);
    await indexedDbService.syncPendingReports(payload => collabxApi.createProblem(payload));
    setIsSyncing(false);
    refresh();
  };

  useEffect(() => {
    refresh();
    const handleUpdated = () => refresh();
    const handleOnline = () => void sync();
    window.addEventListener(indexedDbService.updatedEventName, handleUpdated);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener(indexedDbService.updatedEventName, handleUpdated);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const total = summary.pending.length + summary.synced.length + summary.failed.length;
  if (total === 0) return null;

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3" aria-label="Offline report synchronization">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gov-navy">Offline Report Storage</h3>
          <p className="text-[11px] text-slate-500">Reports stay in this browser until they are safely uploaded.</p>
        </div>
        <button type="button" onClick={() => void sync()} disabled={isSyncing} className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:opacity-50">
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync
        </button>
      </div>
      <ReportGroup title="Pending reports" reports={summary.pending} tone="text-amber-700" />
      <ReportGroup title="Synced reports" reports={summary.synced} tone="text-emerald-700" />
      <ReportGroup title="Failed reports" reports={summary.failed} tone="text-red-700" />
    </section>
  );
};
