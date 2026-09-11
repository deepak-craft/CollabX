import React from 'react';
import { ProblemReport } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin,
  Building2,
  Users,
  Briefcase,
  Layers,
  Calendar
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MyReportsTimelineProps {
  problems: ProblemReport[];
  onOpenFeedbackModal?: (problemId: string) => void;
}

const COLLABX_STAGES = [
  { id: 'submitted', label: '1. Submitted', desc: 'Reported by citizen' },
  { id: 'ai_analyzed', label: '2. AI Analyzed', desc: 'Categorized & prioritized' },
  { id: 'university_matched', label: '3. University Matched', desc: 'Matched to varsity department' },
  { id: 'university_adopted', label: '4. University Adopted', desc: 'Adopted by department' },
  { id: 'team_formed', label: '5. Team Formed', desc: 'Students & faculty mentor' },
  { id: 'solution_development', label: '6. Solution Dev', desc: 'Engineering solution' },
  { id: 'industry_collaboration', label: '7. Industry Partner', desc: 'Industry co-creation & CSR' },
  { id: 'prototype', label: '8. Prototype', desc: 'Model & bench test' },
  { id: 'pilot', label: '9. Pilot Trial', desc: 'On-ground field testing' },
  { id: 'implementation', label: '10. Implementation', desc: 'Full scale deployment' },
  { id: 'completed', label: '11. Completed', desc: 'Measured community impact' },
];

export const MyReportsTimeline: React.FC<MyReportsTimelineProps> = ({
  problems,
  onOpenFeedbackModal,
}) => {
  const { t } = useAccessibility();

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 0;
      case 'ai_analyzed': return 1;
      case 'university_matched': return 2;
      case 'university_adopted': return 3;
      case 'team_formed': return 4;
      case 'solution_development': return 5;
      case 'industry_collaboration': return 6;
      case 'prototype': return 7;
      case 'pilot': return 8;
      case 'implementation': return 9;
      case 'completed': return 10;
      default: return 2;
    }
  };

  const getStageProgress = (status: string) => {
    const idx = getStageIndex(status);
    return Math.round(((idx + 1) / 11) * 100);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-gov-navy flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gov-navy" />
          <span>{t('Grievance Progress Tracking', 'दर्ज समस्याओं की आधिकारिक प्रगति')}</span>
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {t('Real-time 11-stage innovation workflow: from citizen submission to university research, industry collaboration, and on-ground impact.', 'नागरिक रिपोर्टिंग से लेकर विश्वविद्यालय अनुसंधान, उद्योग सहयोग एवं पूर्ण समाधान तक।')}
        </p>
      </div>

      {problems.length === 0 ? (
        <div className="bg-white p-8 rounded-md border border-slate-200 text-center text-xs text-slate-500">
          No reports submitted yet.
        </div>
      ) : (
        problems.map(problem => {
          const currentStageIdx = getStageIndex(problem.status);
          const progressPercent = problem.progressPercentage ?? getStageProgress(problem.status);
          const currentStage = COLLABX_STAGES[currentStageIdx];
          const matchedUni = problem.matchedUniversity || problem.referredUniversities?.[0] || 'Birla Institute of Technology (BIT) Mesra';
          const matchedDept = problem.matchedDepartment || 'Department of Civil Engineering';
          const score = problem.matchingScore || 88;

          return (
            <div
              key={problem.id}
              className="bg-white rounded-md border border-slate-200 p-5 space-y-4 shadow-2xs"
            >
              {/* Header info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200">
                      {problem.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      Reported on {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{problem.title}</h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{problem.panchayatOrLocality}, {problem.district}</span>
                  </div>
                </div>

                {/* Status Badge & Feedback Trigger */}
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded text-xs font-bold bg-gov-navy text-white shadow-2xs">
                    Current Stage: {currentStage?.label || problem.status}
                  </span>

                  {(problem.status === 'pilot' || problem.status === 'completed') && onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(problem.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition"
                    >
                      <span>{t('Provide Feedback', 'फीडबैक दें')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">Workflow Progress:</span>
                  <span className="font-mono font-bold text-gov-navy">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gov-navy h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Visual 11-Stage Progress Tracker */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('Innovation Lifecycle Timeline:', 'नवाचार जीवनचक्र समयरेखा:')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {COLLABX_STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIdx;
                    const isCurrent = idx === currentStageIdx;
                    const isPending = idx > currentStageIdx;

                    return (
                      <div
                        key={stage.id}
                        className={`p-2 rounded border text-center transition ${
                          isCurrent
                            ? 'bg-gov-navy text-white border-gov-navy font-bold shadow-2xs'
                            : isCompleted
                            ? 'bg-emerald-50 text-slate-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                          {isCurrent && <Clock className="w-3.5 h-3.5 text-amber-300" />}
                          {isPending && <span className="text-[10px] font-mono text-slate-400">{idx + 1}</span>}
                        </div>

                        <div className="text-[11px] font-semibold leading-tight">{stage.label}</div>
                        <div className="text-[9px] mt-0.5 opacity-80 truncate">{stage.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Matching Event Box */}
              <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 font-bold text-gov-navy">
                    <Sparkles className="w-4 h-4 text-gov-saffron" />
                    <span>Matched by AI:</span>
                    <span className="text-blue-950 font-extrabold">{matchedUni}</span>
                    <span className="text-slate-500 font-normal">({matchedDept})</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-blue-900 border border-blue-300 rounded font-mono font-bold text-[11px]">
                    Dynamic Match Score: {score}%
                  </span>
                </div>

                <div className="text-slate-700 space-y-1 text-[11px]">
                  <p className="italic">
                    {problem.matchingReason || 'Direct institutional capability match based on domain expertise and local technical infrastructure.'}
                  </p>
                  {problem.matchingExplanationBullets && problem.matchingExplanationBullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {problem.matchingExplanationBullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Execution Details Grid: University, Team, Industry Partner & Milestones */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-gov-navy" />
                    <span>Matched Institution & Department</span>
                  </span>
                  <div className="font-bold text-slate-900">{matchedUni}</div>
                  <div className="text-slate-600 text-[11px]">{matchedDept}</div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                    <Users className="w-3 h-3 text-gov-navy" />
                    <span>Student / Faculty Research Team</span>
                  </span>
                  <div className="font-bold text-slate-900">
                    {problem.teamName || (currentStageIdx >= 3 ? 'Engineering Taskforce Alpha' : 'Forming after adoption')}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Mentor: {problem.facultyMentorName || (currentStageIdx >= 3 ? 'Prof. Rajiv Sharma, Ph.D.' : 'Department Chair')}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-gov-navy" />
                    <span>Industry Partner</span>
                  </span>
                  <div className="font-bold text-slate-900">
                    {problem.industryPartnerName || (currentStageIdx >= 6 ? 'Tata Steel CSR / L&T Tech' : 'Seeking partner')}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {currentStageIdx >= 6 ? 'Hardware & Pilot CSR Support' : 'Available in Stage 7'}
                  </div>
                </div>

                <div className="space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-gov-navy" />
                    <span>Milestones</span>
                  </span>
                  <div className="text-slate-800">
                    <span className="font-semibold">Current:</span>{' '}
                    {problem.currentMilestoneTitle || currentStage.desc}
                  </div>
                  {problem.nextMilestoneTitle && (
                    <div className="text-slate-500 text-[11px]">
                      <span className="font-semibold">Next:</span> {problem.nextMilestoneTitle}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gov-navy" />
                    <span>Last Activity</span>
                  </span>
                  <div className="text-slate-800 font-mono text-[11px]">
                    {problem.lastMilestoneUpdate ? new Date(problem.lastMilestoneUpdate).toLocaleString() : 'Recent workflow sync'}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
