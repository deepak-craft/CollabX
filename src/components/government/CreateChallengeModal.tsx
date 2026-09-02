import React, { useState } from 'react';
import { ProblemReport, Challenge, SupportStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Target, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Clock, 
  Layers, 
  Building2 
} from 'lucide-react';

interface CreateChallengeModalProps {
  problem: ProblemReport;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (challenge: Challenge) => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  problem,
  isOpen,
  onClose,
  onCreated,
}) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [title, setTitle] = useState(
    `Automated Monsoon Urban Drainage & Sensor-Assisted Siphon Network — ${problem.district}`
  );
  const [summary, setSummary] = useState(
    `Design a low-cost decentralized stormwater diversion system incorporating IoT silt monitoring and automatic floodgate siphoning to reduce waterlogging standing time from 8 hours to under 2 hours in ${problem.panchayatOrLocality}.`
  );
  const [skills, setSkills] = useState(['Civil / Hydrology Engineering', 'Embedded IoT & Sensors', 'Applied AI / Telemetry']);
  const [deadline, setDeadline] = useState('2026-09-15');
  const [pilotOpportunity, setPilotOpportunity] = useState(
    `Live field deployment at ${problem.panchayatOrLocality} with Ranchi Municipal Corporation technical clearance and crew support.`
  );
  const [supportStatus, setSupportStatus] = useState<SupportStatus>('Support Available');
  const [supportDetails, setSupportDetails] = useState(
    'Ranchi Smart City Corporation technical facilitation + Industry hardware sponsorship available for shortlisted university teams.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newChallenge: Challenge = {
      id: `CH-JH-2024-${Math.floor(100 + Math.random() * 900)}`,
      problemId: problem.id,
      title,
      domain: problem.aiAnalysis.category,
      district: problem.district,
      locality: problem.panchayatOrLocality,
      summary,
      expectedOutcomes: [
        'Reduce peak flood standing duration by >= 75%',
        'Real-time IoT telemetry transmission to Ranchi Municipal Corporation',
        'Fabricated using standard local industrial components within ₹4.5 Lakh budget'
      ],
      skillsRequired: skills,
      evaluationCriteria: [
        'Hydraulic Soundness & Feasibility (25%)',
        'Civic Impact & Flood Reduction (25%)',
        'Cost Efficacy (15%)',
        'Statewide Scalability (15%)',
        'Sustainability (10%)',
        'Multidisciplinary Integration (10%)'
      ],
      deadline,
      pilotOpportunity,
      supportStatus,
      supportDetails,
      createdBy: `${currentUser.name} (${currentUser.title})`,
      createdAt: new Date().toISOString(),
      proposalsCount: 0,
      status: 'open',
    };

    storageService.saveChallenge(newChallenge);

    // Update problem status to challenge_created
    problem.status = 'challenge_created';
    problem.challengeId = newChallenge.id;
    storageService.saveProblem(problem);

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Government Officer',
      action: 'PUBLISH_OPEN_CHALLENGE',
      targetEntity: newChallenge.id,
      details: `Published open challenge for problem ${problem.id} with support status "${supportStatus}".`,
      ipHash: '10.24.18.99 [GovNet Jharkhand]',
    });

    // Notify universities
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Open GovTech Challenge Published',
      message: `State Nodal Officer published challenge: "${title}". University proposals open until ${deadline}.`,
      type: 'gov',
      timestamp: 'Just now',
      read: false,
      targetRole: 'student',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onCreated(newChallenge);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" role="dialog">
      <div className="bg-white rounded-lg border border-gov-border shadow-gov-lg max-w-2xl w-full p-5 sm:p-6 space-y-4 my-6">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gov-saffron uppercase tracking-wider">
              Urban Development & Housing Department
            </span>
            <h3 className="text-lg font-bold text-gov-navy mt-0.5">
              Publish Open Challenge to University Network
            </h3>
            <p className="text-xs text-slate-500">
              Transforming verified problem <span className="font-mono font-bold text-gov-navy">{problem.id}</span> into an R&D challenge
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-gov-green mx-auto animate-bounce" />
            <div className="text-base font-bold text-slate-900">
              Challenge Published Statewide!
            </div>
            <div className="text-xs text-slate-500 max-w-md mx-auto">
              University engineering teams at BIT Mesra, NIT Jamshedpur, and IIT ISM Dhanbad can now submit idea-first solutions.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Challenge Title */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded font-semibold focus:border-gov-blue"
              />
            </div>

            {/* Problem Summary & Outcomes */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Technical Challenge Scope & Objectives *
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Support Status Selection (Strictly 3 options) */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Funding & Resource Support Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Confirmed Funding', 'Support Available', 'Not Allocated'] as SupportStatus[]).map(status => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setSupportStatus(status)}
                    className={`py-2 px-2 rounded border text-center font-bold text-xs transition ${
                      supportStatus === status
                        ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Official Guideline: Do NOT use "Guaranteed Funding". State policies allocate resources upon expert validation.
              </span>
            </div>

            {/* Pilot Opportunity & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Municipal Location
                </label>
                <input
                  type="text"
                  disabled
                  value={`${problem.panchayatOrLocality}, ${problem.district}`}
                  className="w-full p-2 text-xs bg-slate-100 border border-slate-300 rounded text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Pilot Opportunity Specifics */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilot Test Opportunity Specification
              </label>
              <input
                type="text"
                required
                value={pilotOpportunity}
                onChange={e => setPilotOpportunity(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-dark text-white font-bold rounded flex items-center space-x-1.5 shadow-sm"
              >
                <Target className="w-3.5 h-3.5 text-gov-saffron-amber" />
                <span>Publish Open Challenge</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
