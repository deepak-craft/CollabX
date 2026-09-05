import React, { useState } from 'react';
import { IdeaProposal, Project } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  FileText, 
  Send, 
  MessageSquare,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ProfessorMentorView: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [ideas, setIdeas] = useState<IdeaProposal[]>(() => storageService.getIdeas());
  const [activeProject] = useState<Project>(() => storageService.getProjects()[0]);
  const [adviceText, setAdviceText] = useState('');
  const [endorsedIdeaId, setEndorsedIdeaId] = useState<string | null>('IDEA-BIT-001');

  const handleEndorse = (ideaId: string) => {
    setEndorsedIdeaId(ideaId);
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Professor Endorsement Added',
      message: `${currentUser.name} has endorsed your proposal for state expert review.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      targetRole: 'student',
    });
    alert('Proposal endorsed by Faculty Advisor. Sent with departmental commendation to State Expert Committee.');
  };

  const handleRequestIndustryLabAccess = () => {
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Industry Lab Access Requested by Faculty',
      message: `${currentUser.name} (BIT Mesra) requested testing flume access from Tata Steel GovTech Division.`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      targetRole: 'industry',
    });
    alert('Request dispatched to Tata Steel CSR & Testing Division.');
  };

  return (
    <div className="space-y-6">
      {/* Mentor Header */}
      <div className="bg-white p-5 rounded-lg border border-gov-border shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-gov-blue" />
            <h2 className="text-lg font-bold text-gov-navy">
              Faculty Mentorship & Academic Supervision Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervising: <span className="font-semibold text-slate-700">{currentUser.name}</span> • {currentUser.department}, {currentUser.organization}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRequestIndustryLabAccess}
            className="px-3 py-1.5 bg-gov-blue hover:bg-gov-blue-light text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Request Industry Facility Access</span>
          </button>
        </div>
      </div>

      {/* Student Proposals Pending Faculty Review */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gov-navy">
            Student Departmental Proposals Under Review ({ideas.length})
          </h3>
          <span className="text-[11px] text-slate-500 italic">
            * Note: Faculty mentors provide academic guidance. Final selection is made by the State Domain Expert.
          </span>
        </div>

        <div className="space-y-4">
          {ideas.map(idea => {
            const isEndorsed = endorsedIdeaId === idea.id;

            return (
              <div
                key={idea.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {idea.id}
                      </span>
                      <span className="text-xs font-bold text-gov-navy">{idea.teamName}</span>
                      <span className="text-[11px] text-slate-500">({idea.leadStudentName}, Lead)</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{idea.title}</h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-gov-blue">
                      AI Score: {idea.aiScores.compositeScore}/100
                    </span>

                    <button
                      onClick={() => handleEndorse(idea.id)}
                      disabled={isEndorsed}
                      className={`px-3 py-1 text-xs font-bold rounded flex items-center space-x-1 transition ${
                        isEndorsed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-gov-navy hover:bg-gov-navy-dark text-white'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isEndorsed ? 'Department Endorsed ✓' : 'Endorse Proposal'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-800">Proposed Hydraulic Architecture:</span>{' '}
                    {idea.proposedSolution}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Budget Estimate:</span>{' '}
                    <span className="font-mono font-bold">₹{idea.estimatedCost.toLocaleString()}</span> (Ceiling ₹4.5 Lakh)
                  </div>
                </div>

                {/* Technical Advising Input */}
                <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Provide technical mentoring remarks for team..."
                    value={adviceText}
                    onChange={e => setAdviceText(e.target.value)}
                    className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => {
                      if (!adviceText.trim()) return;
                      alert(`Mentorship feedback dispatched to ${idea.leadStudentName}: "${adviceText}"`);
                      setAdviceText('');
                    }}
                    className="px-3 py-2 bg-gov-blue text-white rounded text-xs font-semibold hover:bg-gov-blue-light"
                  >
                    Send Guidance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Project Milestone Monitoring */}
      {activeProject && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy flex items-center space-x-2">
              <Award className="w-4 h-4 text-gov-saffron" />
              <span>Mentored Live Pilot: {activeProject.title}</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Phase: {activeProject.milestones[activeProject.currentMilestoneIndex]?.phase || 'Pilot'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Faculty supervision of student lab calibrations and safety clearances before on-ground Ranchi Municipal deployment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Completed Milestones</span>
              <div className="text-sm font-bold text-gov-navy mt-0.5">3 of 5 Delivered</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Industry Collaborator</span>
              <div className="text-sm font-bold text-slate-800 mt-0.5">Tata Steel GovTech</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Nodal Officer Sync</span>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">Alok Prasad, IAS</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
