import React, { useState } from 'react';
import { Challenge, IdeaProposal, AIScores } from '../../types';
import { AIEngineService } from '../../services/aiEngineService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  X, 
  CheckCircle2, 
  Send
} from 'lucide-react';

interface IdeaSubmissionModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (newIdea: IdeaProposal) => void;
}

export const IdeaSubmissionModal: React.FC<IdeaSubmissionModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  // Form states
  const [ideaTitle, setIdeaTitle] = useState('Smart IoT Retention & Gravitational Siphon Bypass Network');
  const [teamName, setTeamName] = useState('Team JalRakshak');
  const [leadName, setLeadName] = useState(currentUser.name);
  const [mentorProf, setMentorProf] = useState('Dr. Ramesh Verma');
  const [disciplines, setDisciplines] = useState(['Civil Engineering', 'Computer Science & Engineering', 'Electronics & Comm (IoT)']);
  const [problemUnderstanding, setProblemUnderstanding] = useState(
    'Harmu bypass waterlogging is caused by a severe culvert constriction coupled with upper-ridge runoff velocity. Traditional concrete widening costs crores; an engineered gravitational siphon + detention system relieves peak hydraulic head passively.'
  );
  const [proposedSolution, setProposedSolution] = useState(
    'A dual-tier modular retention system: (1) Silt traps with solar ultrasonic depth sensors, (2) Automated gravitational siphon bypass tubes that evacuate 1,200 L/sec during peak storm surge without electrical pumps, and (3) Edge telemetry to Ranchi Municipal Corp.'
  );
  const [techStack, setTechStack] = useState(['Ultrasonic Level Sensors', 'ESP32 LoRaWAN Gateway', 'Gravity Siphon Check Valves', 'Python Flow Telemetry', 'Geocellular Retention']);
  const [estimatedCost, setEstimatedCost] = useState(385000);
  const [expectedImpact, setExpectedImpact] = useState(
    'Reduces inundation duration from 8 hours to under 90 minutes for 4,500 residents and ensures school road accessibility.'
  );
  const [scalability, setScalability] = useState(
    'Standardized geocellular blocks and industrial siphon flanges can be replicated across Dhanbad, Bokaro and Jamshedpur within 3 weeks.'
  );
  const [implementationApproach, setImplementationApproach] = useState(
    'Weeks 1-2: Hydraulic lab simulation. Weeks 3-4: On-site culvert sleeve installation. Weeks 5-6: Live monsoon runoff evaluation.'
  );

  const [aiScores, setAiScores] = useState<AIScores | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRunAiEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const scores = AIEngineService.evaluateIdea(
        problemUnderstanding,
        proposedSolution,
        techStack,
        Number(estimatedCost)
      );
      setAiScores(scores);
      setIsEvaluating(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalScores = aiScores || AIEngineService.evaluateIdea(
      problemUnderstanding,
      proposedSolution,
      techStack,
      Number(estimatedCost)
    );

    const newIdea: IdeaProposal = {
      id: `IDEA-${Date.now().toString().slice(-6)}`,
      challengeId: challenge.id,
      title: ideaTitle,
      teamName,
      university: currentUser.organization || 'Birla Institute of Technology (BIT) Mesra',
      leadStudentName: leadName,
      leadStudentEmail: currentUser.email,
      mentorProfessorName: mentorProf,
      mentorProfessorDepartment: 'Civil & Environmental Engineering',
      disciplines,
      problemUnderstanding,
      proposedSolution,
      technologyStack: techStack,
      estimatedCost: Number(estimatedCost),
      expectedImpact,
      scalability,
      implementationApproach,
      aiScores: finalScores,
      status: 'ai_evaluated',
      submittedAt: new Date().toISOString(),
    };

    storageService.saveIdea(newIdea);

    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Student (Lead)',
      action: 'SUBMIT_RESEARCH_PROPOSAL',
      targetEntity: newIdea.id,
      details: `Research proposal submitted for challenge ${challenge.id}. Technical feasibility evaluation score: ${finalScores.compositeScore}/100.`,
      ipHash: '10.24.8.12 [BIT Mesra Campus Network]',
    });

    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Research Proposal Submitted',
      message: `${teamName} submitted a proposal for "${challenge.title.slice(0, 45)}...".`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      targetRole: 'expert',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSubmitted(newIdea);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" role="dialog" aria-labelledby="modal-title">
      <div className="bg-white rounded-md border border-slate-300 max-w-3xl w-full p-5 sm:p-6 space-y-5 my-8 shadow-md">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200 uppercase">
                Technical Proposal Form
              </span>
              <span className="text-xs text-slate-500 font-mono">{challenge.id}</span>
            </div>
            <h3 id="modal-title" className="text-base font-bold text-gov-navy mt-1">
              Submit Research / Technical Proposal
            </h3>
            <p className="text-xs text-slate-600">
              Target Challenge: <span className="font-semibold text-slate-800">{challenge.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <div className="text-base font-bold text-slate-900">
              Research Proposal Submitted Successfully
            </div>
            <div className="text-xs text-slate-600 max-w-md mx-auto">
              Your proposal has been registered and submitted for technical committee review.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Team Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Research Lead *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Mentor *</label>
                <input
                  type="text"
                  required
                  value={mentorProf}
                  onChange={e => setMentorProf(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* Proposal Title */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proposal Title *
              </label>
              <input
                type="text"
                required
                value={ideaTitle}
                onChange={e => setIdeaTitle(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-gov-navy"
              />
            </div>

            {/* Proposed Solution */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                1. Proposed Solution & Methodology *
              </label>
              <textarea
                required
                rows={3}
                value={proposedSolution}
                onChange={e => setProposedSolution(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Technical Approach */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                2. Technical Approach & Problem Diagnosis *
              </label>
              <textarea
                required
                rows={2}
                value={problemUnderstanding}
                onChange={e => setProblemUnderstanding(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Cost & Multidisciplinary Tech */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Required Resources / Budget Estimate (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">State benchmark limit: ₹4,50,000</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technical Disciplines Involved
                </label>
                <div className="flex flex-wrap gap-1 pt-1">
                  {disciplines.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Expected Outcome */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Expected Outcome & Community Impact *
              </label>
              <textarea
                required
                rows={2}
                value={expectedImpact}
                onChange={e => setExpectedImpact(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded"
              ></textarea>
            </div>

            {/* Feasibility Check */}
            <div className="pt-2">
              {!aiScores ? (
                <button
                  type="button"
                  onClick={handleRunAiEvaluation}
                  disabled={isEvaluating}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-gov-navy rounded font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <span>
                    {isEvaluating
                      ? 'Performing automated feasibility check...'
                      : 'Run Automated Technical Feasibility Check'}
                  </span>
                </button>
              ) : (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-xs">
                    <span className="font-bold text-gov-navy">Technical Feasibility Evaluation</span>
                    <span className="font-mono font-bold text-slate-900">Score: {aiScores.compositeScore} / 100</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Feasibility</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.feasibility}%</div>
                    </div>
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Impact</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.socialImpact}%</div>
                    </div>
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Cost Efficacy</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.costEfficiency}%</div>
                    </div>
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Scalability</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.scalability}%</div>
                    </div>
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Sustainability</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.sustainability}%</div>
                    </div>
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 font-semibold">Tech Suitability</div>
                      <div className="font-bold text-slate-800 mt-0.5">{aiScores.technicalSuitability}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-1.5 bg-gov-navy hover:bg-slate-800 text-white font-semibold rounded flex items-center space-x-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Technical Proposal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
