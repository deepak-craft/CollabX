import React, { useState } from 'react';
import { ProblemReport, Challenge } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { CreateChallengeModal } from './CreateChallengeModal';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  X as XIcon, 
  Copy, 
  HelpCircle, 
  Camera, 
  Volume2, 
  ChevronRight, 
  Users,
  Target
} from 'lucide-react';

interface ProblemVerificationProps {
  onChallengeCreated?: (challenge: Challenge) => void;
}

export const ProblemVerification: React.FC<ProblemVerificationProps> = ({ onChallengeCreated }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [problems, setProblems] = useState<ProblemReport[]>(() => storageService.getProblems());
  const [selectedProblem, setSelectedProblem] = useState<ProblemReport | null>(problems[0] || null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [verificationRemarks, setVerificationRemarks] = useState(
    'Ground inspection conducted with Municipal Ward 14 engineers. Hydraulic bottleneck and culvert slope deficit confirmed. Suitable for open research challenge.'
  );

  const handleVerify = (problem: ProblemReport) => {
    problem.status = 'verified';
    problem.verifiedBy = `${currentUser.name} (${currentUser.title})`;
    problem.verifiedAt = new Date().toISOString();
    problem.verificationNotes = verificationRemarks;
    storageService.saveProblem(problem);
    setProblems([...storageService.getProblems()]);

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Government Officer',
      action: 'VERIFY_PROBLEM',
      targetEntity: problem.id,
      details: `Problem officially verified. Category confirmed: ${problem.aiAnalysis.category}.`,
      ipHash: '10.24.18.99 [GovNet Jharkhand]',
    });

    // Notify citizen
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Your Civic Grievance Has Been Officially Verified',
      message: `State Nodal Officer ${currentUser.name} has validated grievance ${problem.id}.`,
      type: 'gov',
      timestamp: 'Just now',
      read: false,
      targetRole: 'citizen',
    });

    alert(`Grievance ${problem.id} successfully verified! You can now convert it into an Open Hackathon Challenge.`);
  };

  const handleReject = (problem: ProblemReport) => {
    problem.status = 'rejected';
    storageService.saveProblem(problem);
    setProblems([...storageService.getProblems()]);
    alert(`Grievance ${problem.id} marked as rejected.`);
  };

  const handleMergeDuplicate = (problem: ProblemReport) => {
    if (!problem.aiAnalysis.duplicateCandidateId) return;
    problem.status = 'verified';
    problem.verificationNotes = `Merged as co-evidence into primary cluster ${problem.aiAnalysis.duplicateCandidateId}.`;
    storageService.saveProblem(problem);
    setProblems([...storageService.getProblems()]);
    alert(`Merged ${problem.id} into duplicate candidate #${problem.aiAnalysis.duplicateCandidateId}. Evidence clustered.`);
  };

  const handleRequestInfo = (problem: ProblemReport) => {
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Municipal Officer Requested More Information',
      message: `Please upload additional flood depth photo for ${problem.id}.`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      targetRole: 'citizen',
    });
    alert(`Information request notice sent to citizen ${problem.citizenName}.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
        <h2 className="text-lg font-bold text-gov-navy flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-gov-green" />
          <span>{t('Government Grievance Verification Queue', 'सरकारी समस्या सत्यापन कतार')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review citizen reports, evidence photos, AI categorization, and duplicate similarity before publishing Open Challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Reports */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Grievances Queue ({problems.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {problems.map(prob => {
              const isSelected = selectedProblem?.id === prob.id;

              return (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/90 border-gov-blue shadow-sm ring-1 ring-gov-blue'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-500">{prob.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase text-[10px] ${
                        prob.aiAnalysis.priority === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : prob.aiAnalysis.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {prob.aiAnalysis.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{prob.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                    <span>{prob.panchayatOrLocality}</span>
                    <span className="font-semibold text-gov-navy uppercase text-[10px]">
                      {prob.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Problem Deep Dive & Verification Actions */}
        {selectedProblem && (
          <div className="lg:col-span-2 bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-gov-blue-50 text-gov-blue px-2 py-0.5 rounded">
                    {selectedProblem.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    Citizen: <span className="font-bold text-slate-800">{selectedProblem.citizenName}</span> ({selectedProblem.citizenPhone})
                  </span>
                </div>
                <h3 className="text-base font-bold text-gov-navy mt-1">
                  {selectedProblem.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>{selectedProblem.panchayatOrLocality}, {selectedProblem.district} (Lat: {selectedProblem.coordinates.lat}, Lng: {selectedProblem.coordinates.lng})</span>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                  selectedProblem.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-gov-blue border border-blue-200'
                }`}
              >
                Status: {selectedProblem.status.replace('_', ' ')}
              </span>
            </div>

            {/* Description & Citizen Audio Note */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Citizen Grievance Description:
              </span>
              <p className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                {selectedProblem.description}
              </p>

              {selectedProblem.audioTranscript && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-950 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gov-saffron flex-shrink-0" />
                  <div>
                    <span className="font-bold">Voice Note Audio Transcript:</span> "{selectedProblem.audioTranscript}"
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Photo & Community Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                  On-Ground Photo Evidence:
                </span>
                <img
                  src={selectedProblem.evidenceUrls[0]}
                  alt="Evidence"
                  className="w-full h-32 object-cover rounded border border-slate-300 shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                  Community Validation Index:
                </span>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-gov-navy">
                    <span>Community Confirmations:</span>
                    <span className="text-base">{selectedProblem.communityConfirmations} Residents</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Local citizens in Ward 14 confirmed facing this waterlogging bottleneck during rainstorms.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================== */}
            {/* AI DECISION SUPPORT PANEL                            */}
            {/* ==================================================== */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-blue-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-gov-blue" />
                  <span className="font-bold text-gov-navy uppercase tracking-wider text-[11px]">
                    AI Analysis — Automated Decision Support
                  </span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                  Algorithm Confidence: {Math.round(selectedProblem.aiAnalysis.confidence * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Category</div>
                  <div className="font-bold text-gov-navy mt-0.5">{selectedProblem.aiAnalysis.category}</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Severity</div>
                  <div className="font-bold text-gov-saffron mt-0.5">{selectedProblem.aiAnalysis.severity} / 100</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Duplicate Check</div>
                  <div className="font-bold text-purple-700 mt-0.5">{selectedProblem.aiAnalysis.duplicateSimilarity}% Match</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Priority</div>
                  <div className="font-bold text-red-600 mt-0.5">{selectedProblem.aiAnalysis.priority}</div>
                </div>
              </div>

              {selectedProblem.aiAnalysis.duplicateSimilarity >= 70 && (
                <div className="p-2 bg-amber-50 rounded border border-amber-300 text-amber-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Copy className="w-4 h-4 text-amber-700" />
                    <span>Potential Duplicate with #{selectedProblem.aiAnalysis.duplicateCandidateId} ({selectedProblem.aiAnalysis.duplicateSimilarity}%)</span>
                  </div>
                  <button
                    onClick={() => handleMergeDuplicate(selectedProblem)}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px]"
                  >
                    Merge Duplicate
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-600 italic">
                AI Rationale: {selectedProblem.aiAnalysis.rationale}
              </p>
            </div>

            {/* Officer Inspection Remarks Input */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Government Officer Verification Remarks *
              </label>
              <textarea
                rows={2}
                value={verificationRemarks}
                onChange={e => setVerificationRemarks(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded focus:border-gov-blue"
              ></textarea>
            </div>

            {/* Verification Actions Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReject(selectedProblem)}
                  className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleRequestInfo(selectedProblem)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Info</span>
                </button>

                <button
                  onClick={() => handleVerify(selectedProblem)}
                  className="px-4 py-1.5 bg-gov-green hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1 shadow-sm transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Problem</span>
                </button>
              </div>

              {/* Convert to Open Challenge Button */}
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="px-4 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
              >
                <Target className="w-3.5 h-3.5 text-gov-saffron-amber" />
                <span>Create Open Challenge →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Convert to Challenge Modal */}
      {selectedProblem && (
        <CreateChallengeModal
          problem={selectedProblem}
          isOpen={isChallengeModalOpen}
          onClose={() => setIsChallengeModalOpen(false)}
          onCreated={c => {
            if (onChallengeCreated) onChallengeCreated(c);
          }}
        />
      )}
    </div>
  );
};
