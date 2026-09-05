import React from 'react';
import { ProblemReport } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Layers, 
  Rocket, 
  Award,
  ChevronRight,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MyReportsTimelineProps {
  problems: ProblemReport[];
  onOpenFeedbackModal?: (problemId: string) => void;
}

const TIMELINE_STAGES = [
  { id: 'submitted', label: 'Submitted', desc: 'Received via portal' },
  { id: 'ai_analyzed', label: 'AI Analysis', desc: 'Categorized & vetted' },
  { id: 'under_review', label: 'Govt Review', desc: 'Field inspection' },
  { id: 'verified', label: 'Verified', desc: 'Officially approved' },
  { id: 'challenge_created', label: 'Challenge', desc: 'Published to varsities' },
  { id: 'in_project', label: 'Project', desc: 'Team & industry build' },
  { id: 'pilot_deployed', label: 'Pilot', desc: 'Live on-ground trial' },
  { id: 'impact_measured', label: 'Impact', desc: 'Evaluated & replicated' },
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
      case 'under_review': return 2;
      case 'verified': return 3;
      case 'challenge_created': return 4;
      case 'in_project': return 5;
      case 'pilot_deployed': return 6;
      case 'impact_measured': return 7;
      default: return 6; // default to pilot for active demo
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
        <h2 className="text-lg font-bold text-gov-navy flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gov-saffron" />
          <span>{t('My Grievance Tracking Timeline', 'मेरी दर्ज समस्याओं की प्रगति समयरेखा')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t('End-to-end transparent progress tracking from citizen voice note to on-ground pilot impact.', 'नागरिक रिपोर्ट से लेकर जमीनी पायलट तक की पारदर्शी प्रगति।')}
        </p>
      </div>

      {problems.map(problem => {
        const currentStageIdx = getStageIndex(problem.status);

        return (
          <div
            key={problem.id}
            className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-5"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-gov-blue-50 text-gov-blue px-2 py-0.5 rounded border border-gov-border">
                    {problem.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Reported on {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gov-navy mt-1">{problem.title}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>{problem.panchayatOrLocality}, {problem.district}</span>
                </div>
              </div>

              {/* Status Badge & Feedback Trigger if in pilot */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded text-xs font-bold bg-blue-100 text-gov-blue border border-blue-200">
                  {problem.status === 'pilot_deployed' ? 'Active On-Ground Pilot' : problem.status.replace('_', ' ').toUpperCase()}
                </span>

                {problem.status === 'pilot_deployed' && onOpenFeedbackModal && (
                  <button
                    onClick={() => onOpenFeedbackModal(problem.id)}
                    className="px-3 py-1 bg-gov-green hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1 shadow-sm transition"
                  >
                    <span>{t('Give Feedback', 'फीडबैक दें')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual 8-Stage Progress Timeline */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {t('Lifecycle Progress Stage (8-Step Traceability):', 'जीवनचक्र प्रगति चरण:')}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const isCompleted = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const isPending = idx > currentStageIdx;

                  return (
                    <div
                      key={stage.id}
                      className={`p-2 rounded border text-center relative transition ${
                        isCurrent
                          ? 'bg-gov-navy text-white border-gov-navy font-bold shadow-md ring-2 ring-gov-saffron'
                          : isCompleted
                          ? 'bg-emerald-50 text-slate-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-gov-green" />}
                        {isCurrent && <Clock className="w-4 h-4 text-gov-saffron-amber animate-pulse" />}
                        {isPending && <span className="text-[10px] text-slate-400 font-mono">{idx + 1}</span>}
                      </div>

                      <div className="text-xs font-semibold">{stage.label}</div>
                      <div className="text-[9px] mt-0.5 opacity-80">{stage.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Stage Insights */}
            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-gov-navy flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-gov-green" />
                <span>Verification & Deployment Log:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Verified By:</span>{' '}
                  {problem.verifiedBy || 'Alok Prasad, IAS (State Nodal Officer)'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">AI Confidence:</span> 94% Category Match
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Open Challenge:</span>{' '}
                  CH-JH-2024-012 (Automated Urban Siphon Drainage)
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Winning Varsity:</span> BIT Mesra (Team JalRakshak)
                </div>
              </div>

              {problem.verificationNotes && (
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 mt-2">
                  <span className="font-semibold text-slate-800">Officer Ground Remarks:</span> {problem.verificationNotes}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
