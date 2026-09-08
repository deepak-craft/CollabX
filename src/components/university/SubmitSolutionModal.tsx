import React, { useState } from 'react';
import { ProblemReport, IdeaProposal } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Send,
  BookOpen,
  Building2,
  Users,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface SubmitSolutionModalProps {
  problem: ProblemReport;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (proposal: IdeaProposal) => void;
}

export const SubmitSolutionModal: React.FC<SubmitSolutionModalProps> = ({
  problem,
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { currentUser } = useAuth();

  const userOrg = currentUser.organization?.trim() || 'Unspecified University';
  const userName = currentUser.name;

  const [title, setTitle] = useState(
    `Engineering Solution for ${problem.title.slice(0, 45)}...`
  );
  const [teamName, setTeamName] = useState('Team JalRakshak');
  const [mentorProfessorName, setMentorProfessorName] = useState('Dr. Ramesh Verma');
  const [mentorProfessorDepartment, setMentorProfessorDepartment] = useState('Civil & Environmental Engineering');
  const [problemUnderstanding, setProblemUnderstanding] = useState(
    `Analysis of ${problem.panchayatOrLocality} indicates severe hydraulic head deficit during monsoonal cloudbursts. Conventional drainage widening is impractical; a sensor-monitored siphon bypass system is required.`
  );
  const [proposedSolution, setProposedSolution] = useState(
    `Deployment of automated gravitational siphons primed with ultrasonic level sensors and edge LoRaWAN telemetry. The system evacuates peak runoff into subterranean recharge cells.`
  );
  const [technologyStack, setTechnologyStack] = useState('IP68 Ultrasonic Depth Sensors, ESP32 LoRaWAN Gateway, Hydraulic Siphon Check Valves');
  const [estimatedCost, setEstimatedCost] = useState<number>(385000);
  const [expectedImpact, setExpectedImpact] = useState(
    `Reduces standing water inundation time from 8 hours to under 90 minutes, ensuring uninterrupted arterial road access for 4,500 residents.`
  );
  const [implementationApproach, setImplementationApproach] = useState(
    `Phase 1: Flume hydraulic simulation at university lab (2 weeks). Phase 2: On-site culvert sleeve installation and LoRa gateway setup (3 weeks). Phase 3: Field verification.`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !proposedSolution) {
      alert('Please fill in required fields.');
      return;
    }

    const proposal: IdeaProposal = {
      id: `SOL-${Date.now().toString().slice(-6)}`,
      challengeId: problem.challengeId || `CH-${problem.id}`,
      problemId: problem.id,
      title,
      teamName,
      university: userOrg,
      leadStudentName: userName,
      leadStudentEmail: currentUser.email || 'researcher@university.ac.in',
      mentorProfessorName,
      mentorProfessorDepartment,
      disciplines: ['Civil Engineering', 'Computer Science & IoT', 'Environmental Hydrology'],
      problemUnderstanding,
      proposedSolution,
      technologyStack: technologyStack.split(',').map(s => s.trim()),
      estimatedCost,
      expectedImpact,
      scalability: 'Adaptable to urban choke points across Jharkhand municipal bodies.',
      implementationApproach,
      aiScores: {
        feasibility: 88,
        socialImpact: 92,
        costEfficiency: 85,
        scalability: 90,
        sustainability: 87,
        technicalSuitability: 89,
        compositeScore: 89,
        aiRemarks: 'High hydraulic feasibility using passive siphon physics and real-time telemetry.',
      },
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    storageService.submitSolutionForProblem(proposal, problem.id);

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'University Researcher',
      action: 'SUBMIT_SOLUTION_PROPOSAL',
      targetEntity: problem.id,
      details: `Solution "${proposal.title}" submitted by ${userOrg} (${teamName}).`,
      ipHash: '192.168.1.45 [Campus Net]',
    });

    // Notify Gov Nodal Officer
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'University Solution Proposal Received',
      message: `${userOrg} (${teamName}) submitted a solution proposal for verified problem ${problem.id}.`,
      type: 'gov',
      timestamp: 'Just now',
      read: false,
      targetRole: 'government',
    });

    if (onSubmitted) onSubmitted(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg border border-gov-border shadow-xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-gov-saffron-amber" />
            <div>
              <h3 className="font-bold text-sm">Submit University Solution Proposal</h3>
              <p className="text-[11px] text-slate-300">
                Referred Problem: <span className="font-mono text-amber-300 font-bold">{problem.id}</span> — {problem.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="p-3 bg-blue-50 rounded border border-blue-200 flex items-center justify-between text-blue-900">
            <div>
              <span className="font-bold block">Submitting Institution: {userOrg}</span>
              <span className="text-[11px] text-slate-600">Lead Researcher: {userName}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
              Referred University
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Solution Proposal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Research Team Name *
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Faculty Mentor Professor *
              </label>
              <input
                type="text"
                required
                value={mentorProfessorName}
                onChange={e => setMentorProfessorName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Faculty Department *
              </label>
              <input
                type="text"
                required
                value={mentorProfessorDepartment}
                onChange={e => setMentorProfessorDepartment(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Problem Understanding & Hydraulic Assessment *
            </label>
            <textarea
              rows={2}
              required
              value={problemUnderstanding}
              onChange={e => setProblemUnderstanding(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Proposed Solution & Technical Approach *
            </label>
            <textarea
              rows={3}
              required
              value={proposedSolution}
              onChange={e => setProposedSolution(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Technology / Hardware Stack
              </label>
              <input
                type="text"
                value={technologyStack}
                onChange={e => setTechnologyStack(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estimated Cost (₹ INR)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={e => setEstimatedCost(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Expected Civic Impact & Performance Metrics *
            </label>
            <textarea
              rows={2}
              required
              value={expectedImpact}
              onChange={e => setExpectedImpact(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-4 h-4 text-gov-saffron-amber" />
              <span>Submit Solution to State Expert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
