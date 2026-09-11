import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { ProblemReport, ProblemStatus } from '../../types';
import { UNIVERSITIES, UniversityData, DepartmentCapability } from '../../data/universityDepartments';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  Eye,
  X,
  MapPin,
  Sparkles,
  Users,
  Layers,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// ==========================================
// 1. VIEW PROBLEM DETAIL MODAL (Read-Only)
// ==========================================
interface ViewProblemModalProps {
  problem: ProblemReport;
  isOpen: boolean;
  onClose: () => void;
  onAdopt?: (problem: ProblemReport) => void;
}

export const ViewProblemModal: React.FC<ViewProblemModalProps> = ({
  problem,
  isOpen,
  onClose,
  onAdopt,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-lg border border-slate-300 shadow-xl my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-problem-title"
      >
        <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold bg-gov-saffron text-white px-2 py-0.5 rounded">
              {problem.id}
            </span>
            <h3 id="modal-problem-title" className="font-bold text-sm sm:text-base line-clamp-1">
              {problem.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-blue-100 text-gov-navy border border-blue-200">
                Stage: {problem.status.replace('_', ' ').toUpperCase()}
              </span>
              {problem.aiAnalysis?.priority && (
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    problem.aiAnalysis.priority === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : problem.aiAnalysis.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Priority: {problem.aiAnalysis.priority}
                </span>
              )}
              {problem.aiAnalysis?.category && (
                <span className="px-2 py-0.5 rounded bg-blue-50 text-gov-blue font-semibold text-[10px]">
                  Category: {problem.aiAnalysis.category}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Reported: {new Date(problem.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
              Grievance Description:
            </span>
            <p className="text-slate-800 leading-relaxed bg-white p-3 rounded border border-slate-200 text-xs">
              {problem.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-semibold uppercase block">Location</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{problem.panchayatOrLocality}, {problem.district}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-semibold uppercase block">Affected Population</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {problem.affectedPopulation ? `${problem.affectedPopulation.toLocaleString()} Residents` : 'Community'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-semibold uppercase block">Frequency</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{problem.frequency || 'Seasonal / Chronic'}</span>
            </div>
          </div>

          {/* AI Matching Breakdown */}
          <div className="p-3 bg-blue-50/70 rounded border border-blue-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-gov-navy text-[11px]">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                <span>AI Automated Institution & Department Match</span>
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">
                Match Score: {problem.matchingScore || 88}%
              </span>
            </div>
            <div className="text-xs text-slate-800">
              <span className="font-bold">Target Routing: </span>
              <span>{problem.matchedUniversity} • {problem.matchedDepartment}</span>
            </div>
            <p className="text-slate-700 italic text-[11px]">
              {problem.matchingReason}
            </p>
            {problem.matchingExplanationBullets && problem.matchingExplanationBullets.length > 0 && (
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                {problem.matchingExplanationBullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-semibold text-xs"
          >
            Close
          </button>
          {onAdopt && problem.status === 'university_matched' && (
            <button
              onClick={() => {
                onClose();
                onAdopt(problem);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adopt Problem</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. FORM TEAM MODAL
// ==========================================
interface FormTeamModalProps {
  problem: ProblemReport | null;
  isOpen: boolean;
  onClose: () => void;
  onTeamFormed: () => void;
}

const FormTeamModal: React.FC<FormTeamModalProps> = ({ problem, isOpen, onClose, onTeamFormed }) => {
  const [teamName, setTeamName] = useState('Research Taskforce Alpha');
  const [mentorName, setMentorName] = useState('Dr. Rajiv Sharma, Associate Professor');

  if (!isOpen || !problem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.formTeam(
      problem.id,
      teamName,
      mentorName,
      problem.matchedDepartment
    );
    onTeamFormed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-lg border border-slate-300 shadow-xl overflow-hidden">
        <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gov-saffron" />
            <h3 className="font-bold text-sm">Form Student & Faculty Research Team</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-800">{problem.title}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {problem.id}</div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:border-gov-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Faculty Mentor Name *
            </label>
            <input
              type="text"
              required
              value={mentorName}
              onChange={e => setMentorName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:border-gov-blue"
            />
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-slate-700 text-[11px]">
            • Department: <strong className="text-gov-navy">{problem.matchedDepartment}</strong><br />
            • Advancing status to: <strong className="text-emerald-700">team_formed</strong>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold shadow-xs"
            >
              Confirm Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. UPDATE MILESTONE MODAL
// ==========================================
interface UpdateMilestoneModalProps {
  problem: ProblemReport | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const UpdateMilestoneModal: React.FC<UpdateMilestoneModalProps> = ({ problem, isOpen, onClose, onUpdated }) => {
  const [currentMilestone, setCurrentMilestone] = useState('');
  const [nextMilestone, setNextMilestone] = useState('');
  const [stage, setStage] = useState<ProblemStatus>('solution_development');
  const [progress, setProgress] = useState(55);

  useEffect(() => {
    if (problem) {
      setCurrentMilestone(problem.currentMilestoneTitle || 'CAD Engineering & Simulation');
      setNextMilestone(problem.nextMilestoneTitle || 'Pilot Field Deployment');
      setStage(problem.status || 'solution_development');
      setProgress(problem.progressPercentage || 50);
    }
  }, [problem]);

  if (!isOpen || !problem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateProblemMilestone(
      problem.id,
      stage,
      currentMilestone,
      nextMilestone,
      Number(progress)
    );
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-lg border border-slate-300 shadow-xl overflow-hidden">
        <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gov-saffron" />
            <h3 className="font-bold text-sm">Update Project Milestone</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Lifecycle Stage *
            </label>
            <select
              value={stage}
              onChange={e => {
                const newStage = e.target.value as ProblemStatus;
                setStage(newStage);
                if (newStage === 'solution_development') setProgress(50);
                if (newStage === 'industry_collaboration') setProgress(60);
                if (newStage === 'prototype') setProgress(70);
                if (newStage === 'pilot') setProgress(82);
                if (newStage === 'implementation') setProgress(92);
                if (newStage === 'completed') setProgress(100);
              }}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:border-gov-blue bg-white"
            >
              <option value="solution_development">Solution Development (Stage 6)</option>
              <option value="industry_collaboration">Industry Collaboration (Stage 7)</option>
              <option value="prototype">Prototype (Stage 8)</option>
              <option value="pilot">Pilot Trial (Stage 9)</option>
              <option value="implementation">Implementation (Stage 10)</option>
              <option value="completed">Completed (Stage 11)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Current Milestone Completed *
            </label>
            <input
              type="text"
              required
              value={currentMilestone}
              onChange={e => setCurrentMilestone(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:border-gov-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Next Scheduled Milestone
            </label>
            <input
              type="text"
              value={nextMilestone}
              onChange={e => setNextMilestone(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:border-gov-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Progress Percentage: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold shadow-xs"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN UNIVERSITY PORTAL COMPONENT
// ==========================================
export const UniversityPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected Demo View Institution & Department
  const defaultUni = UNIVERSITIES.find(u => 
    u.name.toLowerCase().includes((currentUser.organization || '').toLowerCase()) ||
    u.shortName.toLowerCase().includes((currentUser.organization || '').toLowerCase())
  ) || UNIVERSITIES[0];

  const [selectedUni, setSelectedUni] = useState<UniversityData>(defaultUni);
  const [selectedDept, setSelectedDept] = useState<DepartmentCapability>(defaultUni.departments[0]);

  // When selected university changes, default to its first department
  const handleUniversityChange = (uniId: string) => {
    const uni = UNIVERSITIES.find(u => u.id === uniId) || UNIVERSITIES[0];
    setSelectedUni(uni);
    setSelectedDept(uni.departments[0]);
  };

  // Determine active tab from pathname: dashboard | matched | projects
  const getTabFromPath = () => {
    if (location.pathname.endsWith('/problems') || location.pathname.endsWith('/matched')) return 'matched';
    if (location.pathname.endsWith('/projects')) return 'projects';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());
  const [problems, setProblems] = useState<ProblemReport[]>(() => storageService.getProblems());

  useEffect(() => {
    setActiveTab(getTabFromPath());
    setProblems(storageService.getProblems());
  }, [location.pathname]);

  const handleTabChange = (tab: string, path: string) => {
    setActiveTab(tab);
    setProblems(storageService.getProblems());
    navigate(path);
  };

  // Modals state
  const [selectedProblemForView, setSelectedProblemForView] = useState<ProblemReport | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedProblemForTeam, setSelectedProblemForTeam] = useState<ProblemReport | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const [selectedProblemForMilestone, setSelectedProblemForMilestone] = useState<ProblemReport | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  // Filter problems matched to this university and department
  const matchedProblems = storageService.getMatchedProblemsForDepartment(
    selectedUni.name,
    selectedDept.departmentName
  );

  const incomingProblems = matchedProblems.filter(p => p.status === 'university_matched');
  const activeProjects = matchedProblems.filter(p => 
    ['university_adopted', 'team_formed', 'solution_development', 'industry_collaboration', 'prototype', 'pilot', 'implementation', 'completed'].includes(p.status)
  );

  const handleAdopt = (prob: ProblemReport) => {
    storageService.adoptProblem(prob.id, selectedUni.name, selectedDept.departmentName);
    setProblems(storageService.getProblems());
    setSelectedProblemForTeam(prob);
    setIsTeamModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Official University Header */}
      <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-slate-100 text-gov-navy border border-slate-300 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gov-navy uppercase tracking-wider block">
                Higher Education & Academic R&D Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gov-navy mt-0.5">
                {t('University & Research Portal', 'विश्वविद्यालय एवं अनुसंधान पोर्टल')}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Direct AI routing to institution research departments: adopt problems, form student-faculty teams, and update milestones.
              </p>
            </div>
          </div>

          {/* Demo Account / Institution Switcher (Read-Only View Filter) */}
          <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-300 space-y-2 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px]">
                Demo Institution View Selector
              </span>
              <span className="text-[10px] text-slate-400">SIH 2024</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <select
                value={selectedUni.id}
                onChange={e => handleUniversityChange(e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded font-bold text-gov-navy focus:border-gov-blue"
              >
                {UNIVERSITIES.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDept.id}
                onChange={e => {
                  const dept = selectedUni.departments.find(d => d.id === e.target.value) || selectedUni.departments[0];
                  setSelectedDept(dept);
                }}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 font-semibold focus:border-gov-blue"
              >
                {selectedUni.departments.map(d => (
                  <option key={d.id} value={d.id}>
                    Dept: {d.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[10px] text-slate-500 italic">
              * Filtering problems matched to: <strong>{selectedDept.departmentName}</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Strictly 3 Items) */}
      <nav className="bg-white rounded-md border border-slate-200 p-1 flex flex-wrap gap-1" aria-label="University Navigation">
        <button
          onClick={() => handleTabChange('dashboard', '/university')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'dashboard'
              ? 'bg-gov-navy text-white font-bold'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('Dashboard', 'डैशबोर्ड')}</span>
        </button>

        <button
          onClick={() => handleTabChange('matched', '/university/problems')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'matched'
              ? 'bg-gov-navy text-white font-bold'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-gov-saffron-amber" />
          <span>{t('Matched Problems', 'संबंधित नागरिक समस्याएं')}</span>
          {matchedProblems.length > 0 && (
            <span className="ml-1.5 px-2 py-0.2 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold border border-amber-300">
              {matchedProblems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('projects', '/university/projects')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'projects'
              ? 'bg-gov-navy text-white font-bold'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{t('Active Projects', 'सक्रिय अनुसंधान परियोजनाएं')}</span>
          {activeProjects.length > 0 && (
            <span className="ml-1.5 px-2 py-0.2 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold border border-emerald-300">
              {activeProjects.length}
            </span>
          )}
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
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matched to Department</div>
              <div className="text-2xl font-bold text-gov-navy mt-1">{matchedProblems.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">{selectedDept.departmentName}</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Incoming for Adoption</div>
              <div className="text-2xl font-bold text-amber-800 mt-1">{incomingProblems.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Ready for research team</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Active Projects</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{activeProjects.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Adopted & under development</div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed / Impact</div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">
                {matchedProblems.filter(p => p.status === 'completed' || p.status === 'pilot').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Pilots & implementations</div>
            </div>
          </div>

          {/* Quick Action Queue: Incoming Problems for Adoption */}
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-gov-navy">
                  Incoming Problems Matched to {selectedDept.departmentName} ({incomingProblems.length})
                </h2>
                <p className="text-xs text-slate-600">
                  AI automatically matched these grievances based on technical capability match.
                </p>
              </div>
              <button
                onClick={() => handleTabChange('matched', '/university/problems')}
                className="text-xs font-semibold text-gov-navy hover:underline"
              >
                View All in Queue →
              </button>
            </div>

            {incomingProblems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No new incoming problems awaiting adoption for this department.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingProblems.slice(0, 3).map(prob => (
                  <div key={prob.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gov-navy bg-white px-2 py-0.5 rounded border border-slate-200">
                          {prob.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{prob.title}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-gov-navy font-bold rounded text-[11px]">
                        {prob.matchingScore || 90}% Match
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2">{prob.description}</p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Location: {prob.panchayatOrLocality}, {prob.district}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProblemForView(prob);
                            setIsViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-100"
                        >
                          View Problem
                        </button>
                        <button
                          onClick={() => handleAdopt(prob)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                        >
                          Adopt Problem
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MATCHED PROBLEMS                             */}
      {/* ==================================================== */}
      {activeTab === 'matched' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-slate-200">
            <h2 className="text-base font-bold text-gov-navy">
              Problems Matched to {selectedUni.shortName} • {selectedDept.departmentName} ({matchedProblems.length})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Review automatically matched civic problems and adopt them into your department's research & engineering pipeline.
            </p>
          </div>

          {matchedProblems.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-slate-500 rounded border border-slate-200">
              No problems currently matched to {selectedDept.departmentName}. Switch the demo view selector above to inspect other departments.
            </div>
          ) : (
            <div className="space-y-4">
              {matchedProblems.map(prob => {
                const isAdopted = ['university_adopted', 'team_formed', 'solution_development', 'industry_collaboration', 'prototype', 'pilot', 'implementation', 'completed'].includes(prob.status);

                return (
                  <div
                    key={prob.id}
                    className="bg-white rounded-md border border-slate-200 p-5 space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200">
                          {prob.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          isAdopted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-gov-navy'
                        }`}>
                          {prob.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-gov-navy font-bold font-mono">
                        AI Match: {prob.matchingScore || 88}%
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gov-navy">{prob.title}</h3>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{prob.description}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                      <div className="text-slate-800">
                        <strong>AI Matching Reason:</strong> {prob.matchingReason}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Location: {prob.panchayatOrLocality}, {prob.district} | Affected: {prob.affectedPopulation ? `${prob.affectedPopulation.toLocaleString()} residents` : 'Community'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">
                        Routing: {prob.matchedUniversity} ({prob.matchedDepartment})
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProblemForView(prob);
                            setIsViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Problem</span>
                        </button>

                        {!isAdopted ? (
                          <button
                            onClick={() => handleAdopt(prob)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center space-x-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Adopt Problem</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProblemForMilestone(prob);
                              setIsMilestoneModalOpen(true);
                            }}
                            className="px-4 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold text-xs flex items-center space-x-1 shadow-xs"
                          >
                            <Layers className="w-3.5 h-3.5 text-gov-saffron-amber" />
                            <span>Update Milestone</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ACTIVE PROJECTS                              */}
      {/* ==================================================== */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-slate-200">
            <h2 className="text-base font-bold text-gov-navy">
              Active R&D Projects ({activeProjects.length})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Track adopted research projects, student/faculty teams, industry partnerships, and milestone advancement.
            </p>
          </div>

          {activeProjects.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-slate-500 rounded border border-slate-200">
              No projects currently adopted for {selectedDept.departmentName}. Go to <strong>Matched Problems</strong> to adopt an incoming problem.
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map(proj => (
                <div key={proj.id} className="bg-white rounded-md border border-slate-200 p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200">
                        {proj.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Stage: {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-slate-600 font-bold">
                      Progress: {proj.progressPercentage || 50}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gov-navy">{proj.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gov-navy h-2 rounded-full transition-all duration-300"
                      style={{ width: `${proj.progressPercentage || 50}%` }}
                    />
                  </div>

                  {/* Team & Milestone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Research Team</span>
                      <strong className="text-slate-900 block mt-0.5">{proj.teamName || 'Engineering Taskforce Alpha'}</strong>
                      <span className="text-slate-500 text-[11px]">Mentor: {proj.facultyMentorName || 'Prof. Rajiv Sharma'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Industry Partner</span>
                      <strong className="text-slate-900 block mt-0.5">{proj.industryPartnerName || 'Tata Steel CSR / Seeking Partner'}</strong>
                      <span className="text-slate-500 text-[11px]">Co-creation & testing support</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Milestone</span>
                      <strong className="text-slate-900 block mt-0.5">{proj.currentMilestoneTitle || 'Solution Development'}</strong>
                      <span className="text-slate-500 text-[11px]">Next: {proj.nextMilestoneTitle || 'Field Validation'}</span>
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2 text-xs">
                    {(!proj.teamName || proj.status === 'university_adopted') && (
                      <button
                        onClick={() => {
                          setSelectedProblemForTeam(proj);
                          setIsTeamModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs flex items-center space-x-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Form Team</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedProblemForMilestone(proj);
                        setIsMilestoneModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold shadow-xs flex items-center space-x-1"
                    >
                      <Layers className="w-3.5 h-3.5 text-gov-saffron-amber" />
                      <span>Update Milestone</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Problem Detail Modal */}
      {selectedProblemForView && (
        <ViewProblemModal
          problem={selectedProblemForView}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onAdopt={handleAdopt}
        />
      )}

      {/* Form Team Modal */}
      <FormTeamModal
        problem={selectedProblemForTeam}
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamFormed={() => setProblems(storageService.getProblems())}
      />

      {/* Update Milestone Modal */}
      <UpdateMilestoneModal
        problem={selectedProblemForMilestone}
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        onUpdated={() => setProblems(storageService.getProblems())}
      />
    </div>
  );
};
