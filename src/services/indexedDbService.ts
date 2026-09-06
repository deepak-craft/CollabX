export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type PendingReportPayload = {
  id?: string;
  title: string;
  description: string;
  district: string;
  locality: string;
  citizen_name?: string | null;
  citizen_phone?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  affected_population?: number | null;
  frequency?: string | null;
  evidence_urls?: string[];
  audio_transcript?: string | null;
  has_voice_note?: boolean;
  createdAt: string;
};

export type OfflineReport = PendingReportPayload & {
  id: string;
  syncStatus: SyncStatus;
  serverId?: string;
  retryCount: number;
  lastError?: string;
  lastAttemptAt?: string;
  syncedAt?: string;
};

type ReportSync = (payload: PendingReportPayload) => Promise<{ id?: string } | unknown>;
export type OfflineReportSummary = {
  pending: OfflineReport[];
  synced: OfflineReport[];
  failed: OfflineReport[];
};

const DB_NAME = 'collabx-offline';
const STORE_NAME = 'reports';
const DB_VERSION = 2;
const UPDATED_EVENT = 'collabx-offline-reports-updated';
let syncPromise: Promise<{ synced: number; failed: number }> | null = null;

const canUseIndexedDb = () => typeof window !== 'undefined' && 'indexedDB' in window;

const notifyUpdated = () => window.dispatchEvent(new CustomEvent(UPDATED_EVENT));

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;
      const store = db.objectStoreNames.contains(STORE_NAME)
        ? transaction?.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      if (store && !store.indexNames.contains('syncStatus')) {
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
      if (store && !store.indexNames.contains('createdAt')) {
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (transaction && db.objectStoreNames.contains('pending_reports')) {
        const legacyStore = transaction.objectStore('pending_reports');
        const legacyRequest = legacyStore.getAll();
        legacyRequest.onsuccess = () => {
          for (const legacyReport of legacyRequest.result as PendingReportPayload[]) {
            const migratedReport: OfflineReport = {
              ...legacyReport,
              id: legacyReport.id || `legacy-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              syncStatus: 'pending',
              retryCount: 0,
            };
            store?.put(migratedReport);
          }
        };
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const readAll = async (): Promise<OfflineReport[]> => {
  if (!canUseIndexedDb()) return [];
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as OfflineReport[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    request.onerror = () => reject(request.error);
  });
};

const putReport = async (report: OfflineReport): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(report);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const indexedDbService = {
  async enqueueReport(payload: PendingReportPayload): Promise<OfflineReport> {
    const report: OfflineReport = {
      ...payload,
      id: payload.id || `local-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
      syncStatus: 'pending',
      retryCount: 0,
    };
    if (canUseIndexedDb()) {
      await putReport(report);
      notifyUpdated();
    }
    return report;
  },

  async getAllReports(): Promise<OfflineReport[]> {
    return readAll();
  },

  async getPendingReports(): Promise<OfflineReport[]> {
    return (await readAll()).filter(report => report.syncStatus === 'pending' || report.syncStatus === 'failed');
  },

  async getSummary(): Promise<OfflineReportSummary> {
    const reports = await readAll();
    return {
      pending: reports.filter(report => report.syncStatus === 'pending' || report.syncStatus === 'syncing'),
      synced: reports.filter(report => report.syncStatus === 'synced'),
      failed: reports.filter(report => report.syncStatus === 'failed'),
    };
  },

  async syncPendingReports(syncReport: ReportSync): Promise<{ synced: number; failed: number }> {
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      if (!canUseIndexedDb() || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        return { synced: 0, failed: 0 };
      }

      let synced = 0;
      let failed = 0;
      const pendingReports = await this.getPendingReports();
      for (const report of pendingReports) {
        const syncingReport: OfflineReport = { ...report, syncStatus: 'syncing', lastAttemptAt: new Date().toISOString() };
        await putReport(syncingReport);
        try {
          const response = await syncReport(report);
          const serverId = typeof response === 'object' && response !== null && 'id' in response ? String(response.id) : undefined;
          await putReport({ ...syncingReport, syncStatus: 'synced', serverId, syncedAt: new Date().toISOString(), lastError: undefined });
          synced += 1;
        } catch (error) {
          await putReport({
            ...syncingReport,
            syncStatus: 'failed',
            retryCount: report.retryCount + 1,
            lastError: error instanceof Error ? error.message : 'Upload failed',
          });
          failed += 1;
        }
      }
      if (pendingReports.length > 0) notifyUpdated();
      return { synced, failed };
    })().finally(() => {
      syncPromise = null;
    });
    return syncPromise;
  },

  updatedEventName: UPDATED_EVENT,
};
