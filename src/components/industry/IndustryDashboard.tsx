import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { Challenge, CollaborationOffer, IndustryPartner } from '../../types';
import { OfferSupportModal } from './OfferSupportModal';
import { SharedWorkspace } from '../project/SharedWorkspace';
import { 
  Building, 
  Briefcase, 
  Layers, 
  User,
  Search,
  FileText
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

export const IndustryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/opportunities')) return 'opportunities';
    if (location.pathname.endsWith('/collaborations') || location.pathname.endsWith('/contributions')) return 'contributions';
    if (location.pathname.endsWith('/projects')) return 'projects';
    if (location.pathname.endsWith('/resources')) return 'resources';
    if (location.pathname.endsWith('/profile')) return 'profile';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  const [challenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [collaborations, setCollaborations] = useState<CollaborationOffer[]>(() => storageService.getCollaborations());
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const partnerProfile: IndustryPartner = storageService.getIndustryPartners()[0];

  const availableChallengesCount = challenges.length;
  const myContributionsCount = collaborations.length;
  const underReviewCount = collaborations.filter(c => c.status === 'offered').length;
  const acceptedAllocatedCount = collaborations.filter(c => c.status === 'accepted').length;

  const handleOpenOfferModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsOfferModalOpen(true);
  };

  const handleOfferSubmitted = (_offer: CollaborationOffer) => {
    setCollaborations(storageService.getCollaborations());
  };

  const handleAcceptRequest = (collabId: string) => {
    const target = collaborations.find(c => c.id === collabId);
    if (target) {
      target.status = 'accepted';
      storageService.saveCollaboration(target);
      setCollaborations([...storageService.getCollaborations()]);
      handleTabChange('projects', '/industry/projects');
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
      {/* Official Portal Header */}
      <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-300 text-gov-navy flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gov-navy uppercase tracking-wider block">
                Government of Jharkhand • Corporate & Industry Partnership Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gov-navy mt-0.5">
                {t('Industry & Organisation Portal', 'उद्योग एवं संगठन पोर्टल')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t('Support public challenges through technology, expertise, resources and implementation support.', 'तकनीक, विशेषज्ञता व संसाधनों द्वारा सार्वजनिक समस्याओं का समाधान करें।')}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="font-semibold text-slate-900">{currentUser.organization || partnerProfile.companyName}</span>
            <div className="text-[11px] text-slate-500 font-mono">CSR ID: CSR-JH-2024 • Active Allocation: {partnerProfile.csrAllocation}</div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white rounded-md border border-slate-200 p-1 flex flex-wrap gap-1" aria-label="Industry Navigation">
        <button
          onClick={() => handleTabChange('dashboard', '/industry')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'dashboard'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t('Dashboard', 'डैशबोर्ड')}</span>
        </button>

        <button
          onClick={() => handleTabChange('opportunities', '/industry/opportunities')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'opportunities'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t('Browse Challenges', 'चुनौतियां खोजें')}</span>
        </button>

        <button
          onClick={() => handleTabChange('contributions', '/industry/collaborations')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'contributions'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('My Contributions', 'मेरे योगदान')}</span>
          {collaborations.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded-full text-[10px] font-bold">
              {collaborations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('resources', '/industry/resources')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'resources'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{t('Resources & Expertise', 'संसाधन एवं क्षमता')}</span>
        </button>

        <button
          onClick={() => handleTabChange('projects', '/industry/projects')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'projects'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Collaboration', 'सहयोग कार्यक्षेत्र')}</span>
        </button>

        <button
          onClick={() => handleTabChange('profile', '/industry/profile')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'profile'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('Profile', 'प्रोफाइल')}</span>
        </button>
      </nav>

      {/* ==================================================== */}
      {/* TAB 1: DASHBOARD                                    */}
      {/* ==================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Available Challenges', 'उपलब्ध चुनौतियां')}</div>
              <div className="text-2xl font-bold text-gov-navy mt-1">{availableChallengesCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Requiring technology/CSR</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('My Contributions', 'प्रस्तुत योगदान')}</div>
              <div className="text-2xl font-bold text-gov-navy mt-1">{myContributionsCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Submitted offers</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t('Under Review', 'समीक्षा के अधीन')}</div>
              <div className="text-2xl font-bold text-amber-800 mt-1">{underReviewCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Nodal officer evaluation</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('Accepted / Allocated', 'स्वीकृत एवं आवंटित')}</div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">{acceptedAllocatedCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Allocated to live pilot</div>
            </div>
          </div>

          {/* Relevant Challenges Overview */}
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-gov-navy">{t('Relevant Public Challenges', 'प्रासंगिक सार्वजनिक चुनौतियां')}</h2>
                <p className="text-xs text-slate-600">State challenges seeking hardware, CSR grants, testing facilities, or technical mentorship.</p>
              </div>
              <button
                onClick={() => handleTabChange('opportunities', '/industry/opportunities')}
                className="text-xs font-semibold text-gov-navy hover:underline"
              >
                {t('View All Opportunities →', 'सभी देखें →')}
              </button>
            </div>

            <div className="space-y-3">
              {challenges.slice(0, 3).map((ch) => (
                <div key={ch.id} className="bg-slate-50 border border-slate-200 p-4 rounded text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gov-navy bg-white px-2 py-0.5 rounded border border-slate-200">{ch.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold">{ch.supportStatus}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ch.title}</h3>
                  <p className="text-slate-600">{ch.summary}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">District: <span className="font-semibold text-slate-700">{ch.district}</span></span>
                    <button
                      onClick={() => handleOpenOfferModal(ch)}
                      className="px-3 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-semibold transition"
                    >
                      Offer Support →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: BROWSE CHALLENGES                            */}
      {/* ==================================================== */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-slate-200">
            <h2 className="text-base font-bold text-gov-navy">Available State Challenges Requiring Support</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Review public problem statements and offer corporate hardware, equipment, lab testing, or CSR support.
            </p>
          </div>

          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-md border border-slate-200 p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200">
                      {challenge.id}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">{challenge.domain}</span>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
                    {challenge.supportStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gov-navy">{challenge.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{challenge.summary}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800">Support Required by Research Teams:</div>
                  <div className="text-slate-600">
                    • Hardware Sensors (IP68 Ultrasonic) & LoRaWAN Gateway<br />
                    • Fluid testing flume facility for hydraulic sleeve inspection<br />
                    • Mentorship from senior drainage engineers
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    District: <span className="font-bold text-slate-700">{challenge.district}, Jharkhand</span>
                  </span>

                  <button
                    onClick={() => handleOpenOfferModal(challenge)}
                    className="px-4 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-semibold transition"
                  >
                    Offer Support →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: MY CONTRIBUTIONS                             */}
      {/* ==================================================== */}
      {activeTab === 'contributions' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-gov-navy">Submitted Support Contributions ({collaborations.length})</h2>
            <p className="text-xs text-slate-600">Track technical, equipment, and CSR resource allocations.</p>
          </div>

          {collaborations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No contributions submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-2.5">Contribution ID</th>
                    <th className="p-2.5">Target Challenge / Project</th>
                    <th className="p-2.5">Resource Types Offered</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {collaborations.map(collab => {
                    let statusBadge = 'bg-amber-50 text-amber-900 border-amber-300';
                    let statusText = 'Submitted';

                    if (collab.status === 'accepted') {
                      statusBadge = 'bg-emerald-50 text-emerald-900 border-emerald-300';
                      statusText = 'Accepted & Allocated';
                    } else if (collab.status === 'declined') {
                      statusBadge = 'bg-red-50 text-red-900 border-red-300';
                      statusText = 'Declined';
                    }

                    return (
                      <tr key={collab.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-gov-navy">{collab.id}</td>
                        <td className="p-2.5">
                          <span className="font-bold text-slate-900 block">Project: {collab.projectId}</span>
                          <span className="text-slate-500 text-[11px]">Harmu Bypass Automated Siphon Pilot</span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex flex-wrap gap-1">
                            {collab.supportTypes.map(st => (
                              <span key={st} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] border border-slate-200">
                                {st}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBadge}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {collab.status === 'accepted' ? (
                            <button
                              onClick={() => handleTabChange('projects', '/industry/projects')}
                              className="text-gov-navy font-semibold hover:underline"
                            >
                              Open Workspace
                            </button>
                          ) : (
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => handleDeclineRequest(collab.id)}
                                className="px-2 py-1 border border-slate-300 rounded text-[11px] text-slate-600 hover:bg-slate-100"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptRequest(collab.id)}
                                className="px-2.5 py-1 bg-gov-navy text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                              >
                                Accept & Allocate
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: RESOURCES & EXPERTISE                         */}
      {/* ==================================================== */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-gov-navy">Organisation Capability & Resource Registry</h2>
            <p className="text-xs text-slate-600">Technical facilities, laboratory equipment, and dedicated CSR capacity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Company Name</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{partnerProfile.companyName}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Industry Sector</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{partnerProfile.industryType}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Operational Center</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{partnerProfile.location}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Annual Dedicated CSR Fund</span>
                <div className="text-xs font-bold font-mono text-gov-navy mt-0.5">{partnerProfile.csrAllocation}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Core Engineering Capabilities:
                </span>
                <div className="flex flex-wrap gap-1">
                  {partnerProfile.capabilities.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300 text-[11px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Technical Equipment Offered:
                </span>
                <div className="flex flex-wrap gap-1">
                  {partnerProfile.technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300 text-[11px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-2">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Projects Sponsored</span>
                  <div className="text-xl font-bold text-gov-navy mt-1">{partnerProfile.projectsSupported}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Pilots Completed</span>
                  <div className="text-xl font-bold text-emerald-800 mt-1">{partnerProfile.pilotsCompleted}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: COLLABORATION WORKSPACE                       */}
      {/* ==================================================== */}
      {activeTab === 'projects' && (
        <SharedWorkspace />
      )}

      {/* ==================================================== */}
      {/* TAB 6: PROFILE                                      */}
      {/* ==================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-gov-navy">Organisation Profile Information</h2>
            <p className="text-xs text-slate-600">Registered corporate account & nodal officer details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Nodal Officer Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.name}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Designation</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.title || 'Head of CSR & Public Infrastructure'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Organisation</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.organization || partnerProfile.companyName}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Official Email</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">{currentUser.email || 'csr@tatasteel.com'}</span>
            </div>
          </div>
        </div>
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
