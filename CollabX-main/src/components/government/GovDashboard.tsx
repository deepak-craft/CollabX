import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { ProblemReport, Challenge } from '../../types';
import { ProblemVerification } from './ProblemVerification';
import { ChallengeExplorer } from '../university/ChallengeExplorer';
import { ImpactDashboard } from '../impact/ImpactDashboard';
import { ReplicationEngine } from '../impact/ReplicationEngine';
import { JharkhandMap } from '../common/JharkhandMap';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Target, 
  Layers, 
  Users, 
  CheckCircle2, 
  Clock, 
  Compass, 
  FileText, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

interface GovDashboardProps {
  initialTab?: string;
}

export const GovDashboard: React.FC<GovDashboardProps> = ({ initialTab = 'executive' }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/problems')) return 'verification';
    if (location.pathname.endsWith('/challenges')) return 'challenges';
    if (location.pathname.endsWith('/projects')) return 'impact';
    if (location.pathname.endsWith('/impact')) return 'impact';
    if (location.pathname.endsWith('/replication')) return 'replication';
    if (location.pathname.endsWith('/audit')) return 'audit';
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
  const [problems] = useState<ProblemReport[]>(() => storageService.getProblems());
  const [challenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [auditLogs] = useState(() => storageService.getAuditLogs());

  // Domain distribution data
  const domainData = [
    { name: 'Disaster & Water Mgmt', value: 48, color: '#0A2540' },
    { name: 'Roads & Transit', value: 28, color: '#E65100' },
    { name: 'Agriculture & Irrigation', value: 24, color: '#138808' },
    { name: 'Energy & Rural Power', value: 16, color: '#FF9933' },
    { name: 'Waste & Sanitation', value: 14, color: '#64748B' },
  ];

  // District distribution data
  const districtData = [
    { district: 'Ranchi', count: 46 },
    { district: 'Dhanbad', count: 32 },
    { district: 'E. Singhbhum', count: 28 },
    { district: 'Bokaro', count: 18 },
    { district: 'Hazaribagh', count: 12 },
    { district: 'Deoghar', count: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border-2 border-slate-300 shadow-gov p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gov-navy text-white flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6 text-gov-saffron-amber" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                Urban Development & Housing Department
              </span>
              <span className="text-xs text-slate-400 font-mono">STATE NODAL DESK</span>
            </div>
            <h2 className="text-xl font-bold text-gov-navy mt-0.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.title} • Government of Jharkhand
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-gov-blue-50 text-gov-blue border border-gov-border rounded font-bold text-xs">
            Jharkhand Municipal Local Bodies (ULB) Sync: Active
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => handleTabChange('executive', '/government')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'executive'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t('Executive Dashboard & Map', 'कार्यकारी डैशबोर्ड एवं नक्शा')}</span>
        </button>

        <button
          onClick={() => handleTabChange('verification', '/government/problems')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'verification'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('Problem Verification Queue', 'समस्या सत्यापन')}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-gov-saffron text-white rounded-full text-[10px]">
            {problems.filter(p => p.status === 'ai_analyzed' || p.status === 'under_review').length || 2}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('challenges', '/government/challenges')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'challenges'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t('Open Challenges', 'ओपन चुनौतियाँ')}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-gov-blue rounded-full text-[10px]">
            {challenges.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('impact', '/government/impact')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'impact'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('Statewide Impact & Pilots', 'प्रभाव एवं पायलट')}</span>
        </button>

        <button
          onClick={() => handleTabChange('replication', '/government/replication')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'replication'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gov-saffron" />
          <span>{t('Solution Replication (12 Hotspots)', 'समाधान प्रतिकृति')}</span>
        </button>

        <button
          onClick={() => handleTabChange('audit', '/government/audit')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'audit'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('Audit Trail Logs', 'ऑडिट ट्रेल लॉग')}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: EXECUTIVE DASHBOARD                           */}
      {/* ==================================================== */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* 6 Clean KPI Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Problems</span>
              <div className="text-2xl font-black text-gov-navy mt-1 font-mono">142</div>
              <span className="text-[10px] text-slate-400">Citizen submissions</span>
            </div>

            <div
              onClick={() => setActiveTab('verification')}
              className="bg-white p-4 rounded-lg border border-amber-300 shadow-gov cursor-pointer hover:bg-amber-50/50 transition"
            >
              <span className="text-[10px] uppercase font-bold text-amber-700">Pending Review</span>
              <div className="text-2xl font-black text-gov-saffron mt-1 font-mono">18</div>
              <span className="text-[10px] text-amber-600 font-semibold">Requires Officer NOC</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Verified Problems</span>
              <div className="text-2xl font-black text-gov-navy mt-1 font-mono">96</div>
              <span className="text-[10px] text-slate-400">Field survey approved</span>
            </div>

            <div
              onClick={() => setActiveTab('challenges')}
              className="bg-white p-4 rounded-lg border border-blue-200 shadow-gov cursor-pointer hover:bg-blue-50/50 transition"
            >
              <span className="text-[10px] uppercase font-bold text-gov-blue">Open Challenges</span>
              <div className="text-2xl font-black text-gov-blue mt-1 font-mono">14</div>
              <span className="text-[10px] text-gov-blue font-semibold">In Varsity Challenges</span>
            </div>

            <div
              onClick={() => setActiveTab('impact')}
              className="bg-white p-4 rounded-lg border border-emerald-300 shadow-gov cursor-pointer hover:bg-emerald-50/50 transition"
            >
              <span className="text-[10px] uppercase font-bold text-emerald-800">Active Pilots</span>
              <div className="text-2xl font-black text-gov-green mt-1 font-mono">8</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Live On-Ground Trials</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-gov">
              <span className="text-[10px] uppercase font-bold text-purple-700">Citizens Impacted</span>
              <div className="text-2xl font-black text-purple-900 mt-1 font-mono">128,400+</div>
              <span className="text-[10px] text-purple-600 font-semibold">Measurable relief</span>
            </div>
          </div>

          {/* Interactive Lightweight Jharkhand GIS Map */}
          <JharkhandMap
            problems={problems}
            onSelectProblem={p => {
              setActiveTab('verification');
            }}
          />

          {/* Analytics Visualizations: Domain & District Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Distribution Pie */}
            <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-gov-navy">Grievance Distribution by GovTech Domain</h3>
                <p className="text-[11px] text-slate-500">Breakdown across urban and rural infrastructure categories</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={domainData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={42}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {domainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {domainData.map(item => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 truncate">{item.name}</span>
                    <span className="font-bold text-slate-900 font-mono ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* District Distribution Bar */}
            <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-gov-navy">Reported Problem Volumes by District</h3>
                <p className="text-[11px] text-slate-500">Key municipal jurisdictions currently monitored</p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1B365D" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: PROBLEM VERIFICATION QUEUE                    */}
      {/* ==================================================== */}
      {activeTab === 'verification' && (
        <ProblemVerification
          onChallengeCreated={() => {
            setActiveTab('challenges');
          }}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 3: OPEN CHALLENGES                               */}
      {/* ==================================================== */}
      {activeTab === 'challenges' && (
        <ChallengeExplorer />
      )}

      {/* ==================================================== */}
      {/* TAB 4: STATEWIDE IMPACT & PILOTS                     */}
      {/* ==================================================== */}
      {activeTab === 'impact' && (
        <ImpactDashboard />
      )}

      {/* ==================================================== */}
      {/* TAB 5: SOLUTION REPLICATION ENGINE                   */}
      {/* ==================================================== */}
      {activeTab === 'replication' && (
        <ReplicationEngine />
      )}

      {/* ==================================================== */}
      {/* TAB 6: AUDIT TRAIL LOGS                              */}
      {/* ==================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gov-navy">
                Cryptographic Administrative Audit Trail ({auditLogs.length} Records)
              </h3>
              <p className="text-xs text-slate-500">
                Official Government of Jharkhand compliance log under the State GovTech Transparency Standard.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded">
              Immutable Ledger
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold bg-gov-blue-50 text-gov-blue px-1.5 py-0.2 rounded border border-gov-border">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="text-slate-500 text-[11px]">({log.actorRole})</span>
                  </div>
                  <p className="text-slate-700">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono flex-shrink-0">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">{log.ipHash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
