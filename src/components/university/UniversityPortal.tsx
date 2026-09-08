import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ChallengeExplorer } from './ChallengeExplorer';
import { TeamBuilder } from './TeamBuilder';
import { ProfessorMentorView } from './ProfessorMentorView';
import { SharedWorkspace } from '../project/SharedWorkspace';
import { storageService } from '../../services/storageService';
import { ProblemReport } from '../../types';
import { SubmitSolutionModal } from './SubmitSolutionModal';
import {
  GraduationCap,
  Target,
  FileText,
  Users,
  Layers,
  User,
  BookOpen,
  Building2,
  Send,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

interface UniversityPortalProps {
  initialTab?: string;
}

export const UniversityPortal: React.FC<UniversityPortalProps> = ({ initialTab = 'dashboard' }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const isProfessor = currentUser.role === 'professor';

  const userOrg = currentUser.organization || 'Birla Institute of Technology (BIT) Mesra';
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState<string>(userOrg);

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/matched')) return 'matched';
    if (location.pathname.endsWith('/challenges')) return 'challenges';
    if (location.pathname.endsWith('/ideas')) return 'proposals';
    if (location.pathname.endsWith('/contributions')) return 'contributions';
    if (location.pathname.endsWith('/team')) return 'team';
    if (location.pathname.endsWith('/projects')) return 'projects';
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

  const [ideas, setIdeas] = useState(() => storageService.getIdeas());
  const [challenges] = useState(() => storageService.getChallenges());
  const [problems, setProblems] = useState<ProblemReport[]>(() => storageService.getProblems());

  const [selectedProblemForSolution, setSelectedProblemForSolution] = useState<ProblemReport | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Referred problems for current institution
  const referredProblems = problems.filter(p => {
    if (!p.referredUniversities || p.referredUniversities.length === 0) return false;
    return p.referredUniversities.some(u =>
      u.toLowerCase().includes(selectedUniversityFilter.toLowerCase()) ||
      selectedUniversityFilter.toLowerCase().includes(u.toLowerCase())
    );
  });

  const handleOpenSubmitModal = (prob: ProblemReport) => {
    setSelectedProblemForSolution(prob);
    setIsSubmitModalOpen(true);
  };

  // Metrics derived from existing local data
  const activeChallengesCount = challenges.length;
  const myProposalsCount = ideas.length;
  const underEvaluationCount = ideas.filter(i => ['submitted', 'under_review', 'ai_analyzed'].includes(i.status)).length;
  const selectedForPilotCount = ideas.filter(i => ['selected', 'pilot'].includes(i.status)).length;

  return (
    <div className="space-y-6">
      {/* Official Portal Header */}
      <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-slate-100 text-gov-navy border border-slate-300 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gov-navy uppercase tracking-wider block">
                Government of Jharkhand • Higher Education & R&D Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gov-navy mt-0.5">
                {t('University & Research Portal', 'विश्वविद्यालय एवं अनुसंधान पोर्टल')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t('Discover public challenges and contribute research, technology and expertise.', 'सार्वजनिक चुनौतियों की खोज करें और अनुसंधान व तकनीक का योगदान दें।')}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="font-semibold text-slate-900">{currentUser.name}</span>
            <div className="text-[11px] text-slate-500 font-mono">
              {currentUser.organization || 'BIT Mesra'} ({isProfessor ? 'Faculty & Mentor' : 'Research Student'})
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-white rounded-md border border-slate-200 p-1 flex flex-wrap gap-1" aria-label="University Navigation">
        <button
          onClick={() => handleTabChange('dashboard', '/university')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'dashboard'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('Dashboard', 'डैशबोर्ड')}</span>
        </button>

        <button
          onClick={() => handleTabChange('matched', '/university/matched')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'matched'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-gov-saffron-amber" />
          <span>{t('Matched Civic Problems', 'संबंधित नागरिक समस्याएं')}</span>
          {referredProblems.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold border border-amber-300">
              {referredProblems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('challenges', '/university/challenges')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'challenges'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t('Browse Challenges', 'चुनौतियां खोजें')}</span>
        </button>

        <button
          onClick={() => handleTabChange('proposals', '/university/ideas')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'proposals'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('My Proposals', 'मेरे प्रस्ताव')}</span>
          {ideas.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded-full text-[10px] font-bold">
              {ideas.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('contributions', '/university/contributions')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'contributions'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Research Contributions', 'अनुसंधान योगदान')}</span>
        </button>

        <button
          onClick={() => handleTabChange('team', '/university/team')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'team'
              ? 'bg-gov-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('Collaboration', 'सहयोग')}</span>
        </button>

        <button
          onClick={() => handleTabChange('profile', '/university/profile')}
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
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Active Challenges', 'सक्रिय चुनौतियां')}</div>
              <div className="text-2xl font-bold text-gov-navy mt-1">{activeChallengesCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">State problem statements</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('My Proposals', 'प्रस्तुत प्रस्ताव')}</div>
              <div className="text-2xl font-bold text-gov-navy mt-1">{myProposalsCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Submitted solutions</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t('Under Evaluation', 'मूल्यांकन के अधीन')}</div>
              <div className="text-2xl font-bold text-amber-800 mt-1">{underEvaluationCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Committee review stage</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('Selected for Pilot', 'पायलट हेतु चयनित')}</div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">{selectedForPilotCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Approved for field testing</div>
            </div>
          </div>

          {/* Featured / Relevant Public Challenges */}
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-gov-navy">{t('Relevant Public Challenges', 'प्रासंगिक सार्वजनिक चुनौतियां')}</h2>
                <p className="text-xs text-slate-600">Open problem statements categorized by engineering and technical domain.</p>
              </div>
              <button
                onClick={() => handleTabChange('challenges', '/university/challenges')}
                className="text-xs font-semibold text-gov-navy hover:underline"
              >
                {t('View All Challenges →', 'सभी देखें →')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.slice(0, 4).map((ch) => (
                <div key={ch.id} className="bg-slate-50 border border-slate-200 p-4 rounded text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-gov-navy bg-white px-2 py-0.5 rounded border border-slate-200">{ch.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold">{ch.domain}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ch.title}</h3>
                  <p className="text-slate-600 line-clamp-2">{ch.summary}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">District: {ch.district}</span>
                    <button
                      onClick={() => handleTabChange('challenges', '/university/challenges')}
                      className="text-gov-navy font-semibold hover:underline"
                    >
                      Browse Details →
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
      {activeTab === 'challenges' && (
        <ChallengeExplorer
          onSelectChallengeForProject={() => handleTabChange('projects', '/university/projects')}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 3: MY PROPOSALS                                 */}
      {/* ==================================================== */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {isProfessor ? (
            <ProfessorMentorView />
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gov-navy">Submitted Research Proposals ({ideas.length})</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Track technical feasibility evaluations and state review committee decisions.
                  </p>
                </div>
              </div>

              {ideas.length === 0 ? (
                <div className="bg-white p-8 rounded-md border border-slate-200 text-center text-xs text-slate-500">
                  No proposals submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ideas.map(idea => {
                    let statusLabel = 'Submitted';
                    let statusClass = 'bg-amber-50 text-amber-900 border-amber-300';

                    if (idea.status === 'selected') {
                      statusLabel = 'Approved for Pilot';
                      statusClass = 'bg-emerald-50 text-emerald-900 border-emerald-300';
                    } else if (idea.status === 'ai_evaluated' || idea.status === 'shortlisted') {
                      statusLabel = 'Under Committee Review';
                      statusClass = 'bg-blue-50 text-blue-900 border-blue-300';
                    }

                    return (
                      <div
                        key={idea.id}
                        className="bg-white rounded-md border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-500 font-bold">{idea.id}</span>
                            <span className={`px-2 py-0.5 rounded font-semibold text-[11px] border ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-gov-navy">{idea.title}</h3>
                          <div className="text-xs text-slate-500">
                            {idea.university} • {idea.teamName}
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {idea.proposedSolution}
                          </p>

                          {/* Technical Feasibility Evaluation Panel */}
                          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>Technical Feasibility Evaluation:</span>
                              <span className="font-mono">{idea.aiScores.compositeScore} / 100</span>
                            </div>
                            <div className="text-[11px] text-slate-600">
                              Feasibility: {idea.aiScores.feasibility}% | Impact: {idea.aiScores.socialImpact}% | Cost Efficacy: {idea.aiScores.costEfficiency}%
                            </div>
                          </div>

                          {/* State Evaluation Remarks if selected */}
                          {idea.expertScoreTotal && (
                            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 space-y-1 text-xs">
                              <div className="flex items-center justify-between font-bold text-emerald-900">
                                <span>Committee Assessment Decision:</span>
                                <span>{idea.expertScoreTotal} / 100</span>
                              </div>
                              <p className="text-[11px] text-emerald-800 italic">
                                "{idea.expertRemarks}"
                              </p>
                              <div className="text-[10px] text-slate-500 text-right">
                                — Reviewed by {idea.expertEvaluatorName}
                              </div>
                            </div>
                          )}
                        </div>

                        {idea.status === 'selected' && (
                          <div className="pt-2 border-t border-slate-200">
                            <button
                              onClick={() => handleTabChange('projects', '/university/projects')}
                              className="w-full py-2 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-semibold transition"
                            >
                              Open Project Workspace →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: RESEARCH CONTRIBUTIONS                        */}
      {/* ==================================================== */}
      {activeTab === 'contributions' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-gov-navy">{t('Research & Technical Contributions', 'अनुसंधान एवं तकनीकी योगदान')}</h2>
            <p className="text-xs text-slate-600">Technical documentation, prototype models, and field testing data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-gov-navy text-sm block">1. Hydraulic Siphon Blueprint</span>
              <p className="text-slate-600">Technical CAD schematics for automated culvert siphon deployment in high-water zones.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-semibold">Technical Documentation</span>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-gov-navy text-sm block">2. LoRaWAN Telemetry Sensor Kit</span>
              <p className="text-slate-600">Low-cost IoT water level reporting sensor setup tested at BIT Mesra hydraulics lab.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-semibold">Prototype Model</span>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-gov-navy text-sm block">3. Monsoon Runoff Field Study</span>
              <p className="text-slate-600">Observational dataset covering Harmu river basin runoff during heavy rainfall events.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold">Field Testing Data</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: COLLABORATION                                */}
      {/* ==================================================== */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-slate-200 text-xs text-slate-600">
            <h2 className="text-sm font-bold text-gov-navy mb-1">Research & Project Collaboration</h2>
            <p>Form inter-disciplinary project teams and coordinate with faculty mentors.</p>
          </div>
          <TeamBuilder />
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: PROJECT WORKSPACE                            */}
      {/* ==================================================== */}
      {activeTab === 'projects' && (
        <SharedWorkspace />
      )}

      {/* ==================================================== */}
      {/* TAB 7: PROFILE                                      */}
      {/* ==================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-gov-navy">{t('Institutional Profile Information', 'संस्थगत प्रोफाइल विवरण')}</h2>
            <p className="text-xs text-slate-600">Registered academic and research organization details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.name}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Role / Designation</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{isProfessor ? 'Faculty Professor & Mentor' : 'Research Student / Team Lead'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Institution</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.organization || 'Birla Institute of Technology (BIT) Mesra'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Department</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">Department of Civil & Environmental Engineering</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Contact Email</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">{currentUser.email || 'research@bitmesra.ac.in'}</span>
            </div>
          </div>
        </div>
      )}
      {/* ==================================================== */}
      {/* TAB: MATCHED CIVIC PROBLEMS                           */}
      {/* ==================================================== */}
      {activeTab === 'matched' && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-gov-navy">
                  Matched Civic Problems Referred to Your Institution ({referredProblems.length})
                </h2>
                <p className="text-xs text-slate-600">
                  Civic problems verified by Government Experts and specifically referred to your research department.
                </p>
              </div>

              {/* Institution Filter Selector for Demo Access Control */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-semibold">Active Institution View:</span>
                <select
                  value={selectedUniversityFilter}
                  onChange={e => setSelectedUniversityFilter(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded font-bold text-gov-navy bg-slate-50"
                >
                  <option value="Birla Institute of Technology (BIT) Mesra">BIT Mesra</option>
                  <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad</option>
                  <option value="National Institute of Technology (NIT) Jamshedpur">NIT Jamshedpur</option>
                </select>
              </div>
            </div>

            {referredProblems.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">No civic problems currently referred to {selectedUniversityFilter}.</p>
                <p className="text-slate-500">Government Experts refer verified problems after department matching.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referredProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-3 hover:border-gov-blue transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold bg-white text-gov-navy px-2 py-0.5 rounded border border-slate-200">
                          {prob.id}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Referred to Your Institution
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-gov-blue font-semibold">
                        {prob.aiAnalysis.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gov-navy">{prob.title}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{prob.description}</p>
                    </div>

                    <div className="p-3 bg-white rounded border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-500 font-semibold">Verified Nodal Officer:</span>{' '}
                        <strong className="text-slate-800">{prob.verifiedBy || 'Alok Prasad, IAS'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">District:</span>{' '}
                        <strong className="text-slate-800">{prob.district} ({prob.panchayatOrLocality})</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenSubmitModal(prob)}
                        className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 text-gov-saffron-amber" />
                        <span>View Problem & Submit Solution Proposal →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Solution Modal */}
      {selectedProblemForSolution && (
        <SubmitSolutionModal
          problem={selectedProblemForSolution}
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={() => {
            setIdeas(storageService.getIdeas());
            setProblems(storageService.getProblems());
            handleTabChange('proposals', '/university/ideas');
          }}
        />
      )}
    </div>
  );
};
