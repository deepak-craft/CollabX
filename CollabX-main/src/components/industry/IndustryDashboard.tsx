import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { Challenge, CollaborationOffer, IndustryPartner } from '../../types';
import { OfferSupportModal } from './OfferSupportModal';
import { SharedWorkspace } from '../project/SharedWorkspace';
import { LinkCollab } from '../community/LinkCollab';
import { 
  Building, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  MapPin, 
  Clock, 
  ArrowRight,
  MessageSquare,
  Award,
  ShieldCheck,
  Check,
  X as XIcon
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

export const IndustryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (): 'opportunities' | 'collabs' | 'workspace' | 'profile' | 'link_collab' => {
    if (location.pathname.endsWith('/collaborations')) return 'collabs';
    if (location.pathname.endsWith('/projects')) return 'workspace';
    if (location.pathname.endsWith('/profile')) return 'profile';
    if (location.pathname.endsWith('/link-collab')) return 'link_collab';
    return 'opportunities';
  };

  const [activeTab, setActiveTab] = useState<'opportunities' | 'collabs' | 'workspace' | 'profile' | 'link_collab'>(getTabFromPath());

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: 'opportunities' | 'collabs' | 'workspace' | 'profile' | 'link_collab', path: string) => {
    setActiveTab(tab);
    navigate(path);
  };
  const [challenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [collaborations, setCollaborations] = useState<CollaborationOffer[]>(() => storageService.getCollaborations());
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const partnerProfile: IndustryPartner = storageService.getIndustryPartners()[0];

  const handleOpenOfferModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsOfferModalOpen(true);
  };

  const handleOfferSubmitted = (offer: CollaborationOffer) => {
    setCollaborations(storageService.getCollaborations());
  };

  const handleAcceptRequest = (collabId: string) => {
    const target = collaborations.find(c => c.id === collabId);
    if (target) {
      target.status = 'accepted';
      storageService.saveCollaboration(target);
      setCollaborations([...storageService.getCollaborations()]);
      alert('Collaboration accepted! Access granted to Shared Project Workspace.');
      setActiveTab('workspace');
    }
  };

  const handleDeclineRequest = (collabId: string) => {
    const target = collaborations.find(c => c.id === collabId);
    if (target) {
      target.status = 'declined';
      storageService.saveCollaboration(target);
      setCollaborations([...storageService.getCollaborations()]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-gov-saffron flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                GovTech Corporate Partner
              </span>
              <span className="text-xs text-slate-400 font-mono">CSR ID: CSR-JH-2024</span>
            </div>
            <h2 className="text-xl font-bold text-gov-navy mt-0.5">
              {currentUser.organization}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.name} • {currentUser.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right text-xs">
            <span className="text-slate-500 block">Active CSR Civic Budget:</span>
            <span className="font-bold text-gov-navy font-mono text-sm">{partnerProfile.csrAllocation}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => handleTabChange('opportunities', '/industry/opportunities')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'opportunities'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gov-saffron-amber" />
          <span>{t('Smart Opportunities (92% Match)', 'स्मार्ट अवसर')}</span>
        </button>

        <button
          onClick={() => handleTabChange('collabs', '/industry/collaborations')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'collabs'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{t('Collaboration Requests', 'सहयोग अनुरोध')}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-gov-saffron text-white rounded-full text-[10px]">
            {collaborations.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('workspace', '/industry/projects')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'workspace'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Shared Pilot Workspace', 'साझा पायलट कार्यक्षेत्र')}</span>
        </button>

        <button
          onClick={() => handleTabChange('profile', '/industry/profile')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'profile'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t('Industry Profile & Tech Stack', 'उद्योग प्रोफाइल')}</span>
        </button>

        <button
          onClick={() => handleTabChange('link_collab', '/industry/link-collab')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'link_collab'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('Link Collab Advisory', 'लिंक कोलैब संवाद')}</span>
        </button>
      </div>

      {/* Tab 1: Smart Opportunities with Match Percentage */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
            <h3 className="text-base font-bold text-gov-navy">
              AI-Curated GovTech Opportunities for {currentUser.organization}
            </h3>
            <p className="text-xs text-slate-500">
              Matched against your industrial capabilities: IoT Telemetry, Sensor Kits, Structural Alloys, and CSR Grants.
            </p>
          </div>

          <div className="space-y-4">
            {challenges.map((challenge, idx) => {
              const matchScore = idx === 0 ? 92 : 78;

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg border-2 border-slate-200 hover:border-gov-navy shadow-gov p-5 space-y-4 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-gov-blue-50 text-gov-blue px-2 py-0.5 rounded">
                        {challenge.id}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{challenge.domain}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Smart Match Pill */}
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 border border-emerald-300">
                        <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                        <span>Compatibility: {matchScore}%</span>
                      </span>

                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-gov-blue font-bold">
                        {challenge.supportStatus}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-gov-navy">{challenge.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{challenge.summary}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
                    <div className="font-bold text-slate-800">Support Needed by University Teams:</div>
                    <div className="text-slate-600">
                      • Hardware Sensors (IP68 Ultrasonic) & LoRaWAN Gateway<br />
                      • Fluid testing flume facility for hydraulic sleeve inspection<br />
                      • Mentorship from senior drainage engineers
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Location: <span className="font-bold text-slate-700">{challenge.district}, Jharkhand</span>
                    </span>

                    <button
                      onClick={() => handleOpenOfferModal(challenge)}
                      className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                    >
                      <Building className="w-3.5 h-3.5 text-gov-saffron-amber" />
                      <span>Offer Corporate / Technical Support →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Collaboration Requests */}
      {activeTab === 'collabs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
            <h3 className="text-base font-bold text-gov-navy">
              University Collaboration Requests ({collaborations.length})
            </h3>
            <p className="text-xs text-slate-500">
              Incoming partnerships from student engineering teams selected for government pilots.
            </p>
          </div>

          <div className="space-y-4">
            {collaborations.map(collab => (
              <div
                key={collab.id}
                className="bg-white rounded-lg border-2 border-slate-200 shadow-gov p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">
                      {collab.id}
                    </span>
                    <span className="text-xs font-bold text-gov-navy">Project: {collab.projectId}</span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                      collab.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {collab.status.toUpperCase()} ({collab.supportStatus})
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gov-navy">
                    Harmu Bypass Smart Retention & Automated Siphon Pilot
                  </h4>
                  <div className="text-xs text-slate-500 font-medium">
                    Requested by: <span className="font-bold text-slate-800">Team JalRakshak (BIT Mesra)</span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                    {collab.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {collab.supportTypes.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-100 text-[10px] font-semibold">
                      ✓ {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  {collab.status === 'accepted' ? (
                    <button
                      onClick={() => setActiveTab('workspace')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1"
                    >
                      <span>Open Shared Project Workspace →</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeclineRequest(collab.id)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-100 flex items-center space-x-1"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(collab.id)}
                        className="px-4 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Allocate Resources</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Shared Workspace */}
      {activeTab === 'workspace' && (
        <SharedWorkspace />
      )}

      {/* Tab 4: Industry Profile & Smart Matching Inputs */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-gov-navy">
              Industry GovTech Capability Profile & CSR Registry
            </h3>
            <p className="text-xs text-slate-500">
              This institutional metadata feeds directly into our Smart Matching Algorithm to pair challenges with industrial facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Company Name</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{partnerProfile.companyName}</div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Sector & Domain</span>
                <div className="text-xs font-medium text-slate-800 mt-0.5">{partnerProfile.industryType}</div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Operational Hub</span>
                <div className="text-xs font-medium text-slate-800 mt-0.5">{partnerProfile.location}</div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Dedicated CSR Pool</span>
                <div className="text-xs font-bold font-mono text-gov-green mt-0.5">{partnerProfile.csrAllocation}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Core Engineering Capabilities:
                </span>
                <div className="flex flex-wrap gap-1">
                  {partnerProfile.capabilities.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200 text-[11px] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Technologies Offered to University Teams:
                </span>
                <div className="flex flex-wrap gap-1">
                  {partnerProfile.technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 grid grid-cols-2 gap-3 text-center border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Projects Sponsored</span>
                  <div className="text-xl font-bold text-gov-navy mt-1">{partnerProfile.projectsSupported}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Pilots Completed</span>
                  <div className="text-xl font-bold text-gov-green mt-1">{partnerProfile.pilotsCompleted}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Link Collab */}
      {activeTab === 'link_collab' && (
        <LinkCollab />
      )}

      {/* Offer Support Modal */}
      {selectedChallenge && (
        <OfferSupportModal
          challenge={selectedChallenge}
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          onSubmitted={handleOfferSubmitted}
        />
      )}
    </div>
  );
};
