import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { GovHeader } from './components/common/GovHeader';
import { DemoController } from './components/common/DemoController';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { UniversityPortal } from './components/university/UniversityPortal';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { GovDashboard } from './components/government/GovDashboard';
import { ExpertDashboard } from './components/expert/ExpertDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser, showLandingPage, setShowLandingPage } = useAuth();
  const { t } = useAccessibility();
  const [demoStep, setDemoStep] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // If user navigated back to landing page, show LandingPage component
  if (showLandingPage) {
    return <LandingPage onEnterApp={() => setShowLandingPage(false)} />;
  }

  const handleSelectDemoStep = (step: number) => {
    setDemoStep(step);
    setRefreshKey(prev => prev + 1);
  };

  const handleResetDemo = () => {
    setDemoStep(1);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 pb-16">
      {/* GovTech Header */}
      <GovHeader />

      {/* Main Content Area - Keyed to force clean remount on portal/persona switch */}
      <main 
        id="main-content" 
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6" 
        key={`${currentUser.id}-${currentUser.role}-${currentUser.subRole}-${demoStep}-${refreshKey}`}
      >
        {/* Role-Based Router */}
        {currentUser.role === 'citizen' && (
          <CitizenDashboard
            initialTab={demoStep === 10 ? 'my_reports' : demoStep === 1 ? 'report' : 'home'}
          />
        )}

        {(currentUser.role === 'student' || currentUser.role === 'professor') && (
          <UniversityPortal
            initialTab={demoStep === 9 ? 'project' : demoStep === 5 ? 'challenges' : 'challenges'}
          />
        )}

        {currentUser.role === 'industry' && (
          <IndustryDashboard />
        )}

        {currentUser.role === 'government' && (
          <GovDashboard
            initialTab={demoStep === 3 ? 'verification' : demoStep === 11 ? 'impact' : 'executive'}
          />
        )}

        {currentUser.role === 'expert' && (
          <ExpertDashboard />
        )}
      </main>

      {/* Official GovTech Footer */}
      <footer className="bg-white border-t border-gov-border mt-12 py-6 px-4 sm:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gov-navy text-sm">COLLABX</span>
              <span className="text-slate-400">|</span>
              <span className="font-medium text-slate-700">Connecting Problems, Ideas & Impact</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Smart India Hackathon 2024 • SIH26043 GovTech Platform
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Demonstration GovTech prototype for the Government of Jharkhand. AI models provide automated decision support; all final selection decisions are rendered by verified human experts.
            </p>
            <div className="flex items-center space-x-4">
              <span>WGS84 GIS Standards</span>
              <span>•</span>
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SIH Presentation Demo Controller (docked at the bottom) */}
      <DemoController
        currentStep={demoStep}
        onSelectStep={handleSelectDemoStep}
        onReset={handleResetDemo}
      />
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
