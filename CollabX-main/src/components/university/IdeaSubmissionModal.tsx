import React, { useState } from 'react';
import { Challenge, IdeaProposal, AIScores } from '../../types';
import { AIEngineService } from '../../services/aiEngineService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Send, 
  Layers, 
  IndianRupee, 
  Users, 
  Info 
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

  // Simulated AI Recommendation state
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
    }, 600);
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

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Student (Lead)',
      action: 'SUBMIT_IDEA_FIRST_PROPOSAL',
      targetEntity: newIdea.id,
      details: `Idea submitted for challenge ${challenge.id}. AI composite score: ${finalScores.compositeScore}/100.`,
      ipHash: '10.24.8.12 [BIT Mesra Campus Network]',
    });

    // Notification for Expert & Professor
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Idea Proposal Submitted for Review',
      message: `${teamName} submitted an idea-first proposal for "${challenge.title.slice(0, 45)}...".`,
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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" role="dialog">
      <div className="bg-white rounded-lg border border-gov-border shadow-gov-lg max-w-3xl w-full p-5 sm:p-6 space-y-5 my-8">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-blue-100 text-gov-blue px-2 py-0.5 rounded uppercase">
                Idea-First Submission
              </span>
              <span className="text-xs text-slate-500 font-mono">{challenge.id}</span>
            </div>
            <h3 className="text-lg font-bold text-gov-navy mt-1">
              Submit Innovation Proposal (Before Development)
            </h3>
            <p className="text-xs text-slate-500">
              Target Challenge: <span className="font-semibold text-slate-700">{challenge.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-gov-green mx-auto animate-bounce" />
            <div className="text-base font-bold text-slate-900">
              Proposal Submitted to State Expert Evaluation Pool!
            </div>
            <div className="text-xs text-slate-500 max-w-md mx-auto">
              Your idea has undergone AI Recommendation scoring and is queued for formal review by Dr. S. K. Mahato and the State Technical Committee.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Team & Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Lead</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Mentor</label>
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
                Proposed Solution Title *
              </label>
              <input
                type="text"
                required
                value={ideaTitle}
                onChange={e => setIdeaTitle(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded font-semibold focus:border-gov-blue"
              />
            </div>

            {/* Problem Understanding */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                1. Problem Understanding & Hydraulic / Root Cause Diagnosis *
              </label>
              <textarea
                required
                rows={2}
                value={problemUnderstanding}
                onChange={e => setProblemUnderstanding(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Proposed Solution */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                2. Proposed Engineering Solution & Interventions *
              </label>
              <textarea
                required
                rows={3}
                value={proposedSolution}
                onChange={e => setProposedSolution(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Cost & Multidisciplinary Tech */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Prototype Budget (INR) *
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
                <span className="text-[10px] text-slate-500 mt-0.5 block">State benchmark ceiling: ₹4,50,000</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Multidisciplinary Disciplines
                </label>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Civil Engineering', 'CSE (AI / Telemetry)', 'ECE (IoT Sensors)'].map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200 text-[10px] font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Expected Impact & Scalability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Impact (Water Clearance Hours, Population) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={expectedImpact}
                  onChange={e => setExpectedImpact(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scalability Across Jharkhand Urban Bodies *
                </label>
                <textarea
                  required
                  rows={2}
                  value={scalability}
                  onChange={e => setScalability(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                ></textarea>
              </div>
            </div>

            {/* AI Recommendation Simulator Trigger */}
            <div className="pt-2">
              {!aiScores ? (
                <button
                  type="button"
                  onClick={handleRunAiEvaluation}
                  disabled={isEvaluating}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-gov-blue text-gov-blue rounded font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <Sparkles className="w-4 h-4 text-gov-saffron" />
                  <span>
                    {isEvaluating
                      ? 'AI is Evaluating Feasibility, Impact & Cost...'
                      : 'Run AI Preliminary Recommendation Scoring'}
                  </span>
                </button>
              ) : (
                /* ==================================================== */
                /* AI RECOMMENDATION CARD                               */
                /* ==================================================== */
                <div className="bg-slate-50 p-3.5 rounded-lg border-2 border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-gov-saffron" />
                      <span className="font-bold text-gov-navy text-[11px] uppercase tracking-wider">
                        AI Recommendation — Not Final Decision
                      </span>
                    </div>
                    <span className="text-[11px] font-bold bg-gov-navy text-white px-2 py-0.5 rounded">
                      Composite: {aiScores.compositeScore} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Feasibility</div>
                      <div className="text-xs font-bold text-gov-navy mt-0.5">{aiScores.feasibility}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Social Impact</div>
                      <div className="text-xs font-bold text-gov-green mt-0.5">{aiScores.socialImpact}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Cost Efficacy</div>
                      <div className="text-xs font-bold text-blue-700 mt-0.5">{aiScores.costEfficiency}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Scalability</div>
                      <div className="text-xs font-bold text-purple-700 mt-0.5">{aiScores.scalability}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Sustainability</div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">{aiScores.sustainability}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold">Tech Fit</div>
                      <div className="text-xs font-bold text-gov-saffron mt-0.5">{aiScores.technicalSuitability}%</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-slate-800">AI Model Observations:</span> {aiScores.aiRemarks}
                  </p>

                  <div className="text-[10px] text-slate-500 italic">
                    * Human Safeguard: AI recommendations serve strictly as advisory telemetry. Final award selection will be rendered by the assigned Domain Expert.
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
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
                <Send className="w-3.5 h-3.5" />
                <span>Submit Idea to State Expert Committee</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
