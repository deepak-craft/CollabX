import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { 
  Play, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface DemoControllerProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onReset: () => void;
}

export const DEMO_STEPS = [
  { id: 1, label: '1. Citizen Report', role: 'citizen', subRole: 'Citizen', desc: 'Citizen reports waterlogging via voice/photo/GPS' },
  { id: 2, label: '2. AI Analysis', role: 'citizen', subRole: 'Citizen', desc: 'AI categorizes severity & duplicate detection' },
  { id: 3, label: '3. Govt Verification', role: 'government', subRole: 'Government Officer', desc: 'IAS Nodal Officer verifies citizen problem' },
  { id: 4, label: '4. Open Challenge', role: 'student', subRole: 'Student', desc: 'Challenge published with support status' },
  { id: 5, label: '5. Idea-First Proposal', role: 'student', subRole: 'Student', desc: 'University team submits multidisciplinary idea' },
  { id: 6, label: '6. AI Idea Evaluation', role: 'student', subRole: 'Student', desc: 'AI evaluates feasibility, impact, and cost' },
  { id: 7, label: '7. Expert Final Selection', role: 'expert', subRole: 'Domain Expert', desc: 'Domain expert compares 3 ideas and selects winner' },
  { id: 8, label: '8. Industry Support', role: 'industry', subRole: 'Industry Partner', desc: 'Tata Steel confirms sensors & CSR mentorship' },
  { id: 9, label: '9. Shared Pilot Workspace', role: 'student', subRole: 'Student', desc: 'Tri-partite execution & active telemetry' },
  { id: 10, label: '10. Citizen Feedback', role: 'citizen', subRole: 'Citizen', desc: 'Post-pilot validation: Yes/Partially/No' },
  { id: 11, label: '11. Impact & Replication', role: 'government', subRole: 'Government Officer', desc: '81% reduction metrics + 12 replication hotspots' },
];

export const DemoController: React.FC<DemoControllerProps> = ({
  currentStep,
  onSelectStep,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { loginAs } = useAuth();
  const { t } = useAccessibility();

  const handleStepClick = (stepId: number) => {
    onSelectStep(stepId);
    const target = DEMO_STEPS.find(s => s.id === stepId);
    if (target) {
      // Switch persona to suit step
      loginAs(target.role as any, target.subRole);
    }
  };

  const handleNextStep = () => {
    const next = currentStep < DEMO_STEPS.length ? currentStep + 1 : 1;
    handleStepClick(next);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo state to original SIH26043 seed data?')) {
      storageService.resetAllData();
      onReset();
      handleStepClick(1);
    }
  };

  const activeStepObj = DEMO_STEPS.find(s => s.id === currentStep) || DEMO_STEPS[0];

  return (
    <aside aria-label="Demo Controller" className="fixed bottom-0 left-0 right-0 z-50 bg-gov-navy text-white border-t-2 border-gov-saffron shadow-2xl transition-all duration-200">
      {/* Collapsed Top Bar */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-gov-blue px-2 py-0.5 rounded border border-slate-700 text-xs font-bold text-gov-saffron-amber">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH26043 Demo Controller</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Stage {currentStep}/11:</span>
            <span className="font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {activeStepObj.label}
            </span>
            <span className="text-slate-400 hidden lg:inline">• {activeStepObj.desc}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Next Step Button */}
          <button
            onClick={handleNextStep}
            className="px-3 py-1 bg-gov-saffron hover:bg-amber-600 text-white text-xs font-bold rounded flex items-center space-x-1 transition shadow-sm"
          >
            <span>{t('Next Stage', 'अगला चरण')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetData}
            title={t('Reset to Initial State', 'प्रारंभिक स्थिति पर रीसेट करें')}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded border border-slate-700 text-xs flex items-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded border border-slate-700 text-xs flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isExpanded ? t('Hide Steps', 'छुपाएं') : t('All 11 Steps', 'सभी चरण')}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Grid of 11 Steps */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-gov-navy-dark px-4 py-3 max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>{t('Complete 11-Step Collaborative GovTech Lifecycle (1-Click Teleport):', 'संपूर्ण 11-चरणीय गोवटेक जीवनचक्र:')}</span>
            <span className="text-gov-saffron-amber">“Ideas Selected First, Before Development”</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-1.5">
            {DEMO_STEPS.map(step => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`p-2 rounded text-left border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-gov-saffron text-white border-white font-bold shadow-md'
                      : isPast
                      ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                      Step {step.id}
                    </span>
                    {isPast && <Check className="w-3 h-3 text-emerald-400" />}
                    {isActive && <Play className="w-3 h-3 text-white fill-white" />}
                  </div>
                  <div className="text-xs line-clamp-1 font-medium">{step.label.replace(/^\d+\.\s*/, '')}</div>
                  <div className="text-[9px] mt-1 opacity-70 truncate">{step.subRole}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
