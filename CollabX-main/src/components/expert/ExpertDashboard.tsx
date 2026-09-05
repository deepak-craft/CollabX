import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { Challenge } from '../../types';
import { IdeaComparisonMatrix } from './IdeaComparisonMatrix';
import { LinkCollab } from '../community/LinkCollab';
import { 
  Shield, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare,
  Award,
  AlertCircle
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

export const ExpertDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const [challenges] = useState<Challenge[]>(() => storageService.getChallenges());

  const getTabFromPath = (): 'challenges' | 'compare' | 'audit' | 'link_collab' => {
    if (location.pathname.endsWith('/reviews')) return 'challenges';
    if (location.pathname.endsWith('/compare')) return 'compare';
    if (location.pathname.endsWith('/decisions')) return 'audit';
    if (location.pathname.endsWith('/link-collab')) return 'link_collab';
    return 'compare';
  };

  const [activeTab, setActiveTab] = useState<'challenges' | 'compare' | 'audit' | 'link_collab'>(getTabFromPath());

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: 'challenges' | 'compare' | 'audit' | 'link_collab', path: string) => {
    setActiveTab(tab);
    navigate(path);
  };
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);
  const [auditLogs] = useState(() => storageService.getAuditLogs());

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border-2 border-purple-200 shadow-gov p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 uppercase">
                Restricted Portal • Domain Expert
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: EXP-JH-8812</span>
            </div>
            <h2 className="text-xl font-bold text-gov-navy mt-0.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.title} • {currentUser.organization}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Authorized Decision Maker</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => handleTabChange('compare', '/expert/compare')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'compare'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('Idea Comparison Matrix', 'विचार तुलना मैट्रिक्स')}</span>
        </button>

        <button
          onClick={() => handleTabChange('challenges', '/expert/reviews')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'challenges'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Assigned Challenges', 'आवंटित चुनौतियाँ')}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded-full text-[10px]">
            {challenges.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('audit', '/expert/decisions')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'audit'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('Decision Audit Log', 'निर्णय ऑडिट लॉग')}</span>
        </button>

        <button
          onClick={() => handleTabChange('link_collab', '/expert/link-collab')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'link_collab'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('Link Collab Advisory', 'लिंक कोलैब संवाद')}</span>
        </button>
      </div>

      {/* Tab 1: Comparison Matrix */}
      {activeTab === 'compare' && (
        <IdeaComparisonMatrix challenge={selectedChallenge} />
      )}

      {/* Tab 2: Assigned Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
            <h3 className="text-base font-bold text-gov-navy">
              Challenges Assigned for Technical Evaluation
            </h3>
            <p className="text-xs text-slate-500">
              Assigned by the State Urban Development Secretariat for academic solution scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-lg border-2 border-slate-200 hover:border-purple-600 shadow-gov p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-gov-blue">
                      {c.supportStatus}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gov-navy">{c.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.summary}</p>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span>District: {c.district}</span>
                    <span className="font-bold text-purple-900">{c.proposalsCount} Proposals Submitted</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedChallenge(c);
                      setActiveTab('compare');
                    }}
                    className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Evaluate & Compare Ideas →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Decision Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy">
              Tamper-Evident Expert & Government Action Trail
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographically timestamped record of official evaluations, endorsements, and project selections.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-gov-navy">{log.actorName}</span>
                    <span className="text-slate-500 text-[11px]">({log.actorRole})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700">{log.details}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Network IP / Hash: {log.ipHash} • Entity: {log.targetEntity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Link Collab */}
      {activeTab === 'link_collab' && (
        <LinkCollab />
      )}
    </div>
  );
};
