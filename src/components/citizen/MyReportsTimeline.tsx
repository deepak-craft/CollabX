import React from 'react';
import { ProblemReport } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MyReportsTimelineProps {
  problems: ProblemReport[];
  onOpenFeedbackModal?: (problemId: string) => void;
}

const GOV_STAGES = [
  { id: 'submitted', label: '1. Problem Reported', desc: 'Received in portal' },
  { id: 'verified', label: '2. Problem Verified', desc: 'Ground check approved' },
  { id: 'university_review', label: '3. Under University Review', desc: 'Referred to research labs' },
  { id: 'solution_evaluation', label: '4. Solution Under Evaluation', desc: 'Govt evaluating solution' },
  { id: 'industry_support', label: '5. Industry Support', desc: 'CSR & tech partners engaged' },
  { id: 'action_initiated', label: '6. Action Initiated', desc: 'On-ground pilot active' },
  { id: 'resolved', label: '7. Resolved', desc: 'Verified civic relief' },
];

export const MyReportsTimeline: React.FC<MyReportsTimelineProps> = ({
  problems,
  onOpenFeedbackModal,
}) => {
  const { t } = useAccessibility();

  const getGovStageIndex = (status: string) => {
    switch (status) {
      case 'submitted': 
      case 'ai_analyzed': 
      case 'under_review':
        return 0;
      case 'verified': 
        return 1;
      case 'matching_universities':
      case 'university_review':
        return 2;
      case 'solution_submitted':
      case 'solution_under_evaluation':
      case 'solution_selected':
        return 3;
      case 'industry_support':
        return 4;
      case 'challenge_created': 
      case 'in_project': 
      case 'pilot_deployed': 
        return 5;
      case 'impact_measured': 
      case 'resolved': 
        return 6;
      default: 
        return 1;
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-gov-navy flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gov-navy" />
          <span>{t('Grievance Progress Tracking', 'दर्ज शिकायतों की प्रगति')}</span>
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {t('Official status workflow for registered civic issues.', 'पंजीकृत नागरिक शिकायतों की आधिकारिक स्थिति समयरेखा।')}
        </p>
      </div>

      {problems.length === 0 ? (
        <div className="bg-white p-8 rounded-md border border-slate-200 text-center text-xs text-slate-500">
          No reports submitted yet.
        </div>
      ) : (
        problems.map(problem => {
          const currentStageIdx = getGovStageIndex(problem.status);

          return (
            <div
              key={problem.id}
              className="bg-white rounded-md border border-slate-200 p-5 space-y-4"
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
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-gov-navy border border-slate-300">
                    Status: {problem.status === 'pilot_deployed' ? 'Action Initiated (On-Ground Work)' : problem.status.replace('_', ' ').toUpperCase()}
                  </span>

                  {problem.status === 'pilot_deployed' && onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(problem.id)}
                      className="px-3 py-1 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-semibold transition"
                    >
                      <span>{t('Provide Feedback', 'फीडबैक दें')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Visual 4-Stage Progress Tracker */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  {t('Official Status Progression:', 'आधिकारिक स्थिति प्रगति:')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {GOV_STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIdx;
                    const isCurrent = idx === currentStageIdx;
                    const isPending = idx > currentStageIdx;

                    return (
                      <div
                        key={stage.id}
                        className={`p-2.5 rounded border text-center transition ${
                          isCurrent
                            ? 'bg-gov-navy text-white border-gov-navy font-bold'
                            : isCompleted
                            ? 'bg-emerald-50 text-slate-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                          {isCurrent && <Clock className="w-4 h-4 text-white" />}
                          {isPending && <span className="text-[11px] font-mono text-slate-400">{idx + 1}</span>}
                        </div>

                        <div className="text-xs font-semibold">{stage.label}</div>
                        <div className="text-[10px] mt-0.5 opacity-80">{stage.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Log Remarks */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-gov-navy flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Departmental Action Details:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="font-semibold text-slate-900">Nodal Officer:</span>{' '}
                    {problem.verifiedBy || 'Alok Prasad, IAS (State Nodal Officer)'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Assigned Team:</span> BIT Mesra Engineering Unit
                  </div>
                </div>

                {problem.verificationNotes && (
                  <div className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1">
                    <span className="font-semibold text-slate-900">Officer Remarks:</span> {problem.verificationNotes}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
