import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { GovHeader } from './components/common/GovHeader';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenLoginPage } from './components/auth/CitizenLoginPage';
import { UniversityLoginPage } from './components/auth/UniversityLoginPage';
import { IndustryLoginPage } from './components/auth/IndustryLoginPage';
import { RestrictedAccessPage } from './components/auth/RestrictedAccessPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { UniversityPortal } from './components/university/UniversityPortal';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { GovDashboard } from './components/government/GovDashboard';
import { ExpertDashboard } from './components/expert/ExpertDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const isPublicAuthRoute = 
    location.pathname === '/' || 
    location.pathname.startsWith('/login');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800">
      {/* GovTech Header */}
      <GovHeader />

      {/* Main Router Content Area */}
      <main 
        id="main-content" 
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6"
        key={`${currentUser.id}-${currentUser.role}-${currentUser.subRole}-${refreshKey}`}
      >
        <Routes>
          {/* Public Landing & Login Forms */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/login/citizen" element={<CitizenLoginPage />} />
          <Route path="/login/university" element={<UniversityLoginPage />} />
          <Route path="/login/industry" element={<IndustryLoginPage />} />
          <Route path="/login/restricted" element={<RestrictedAccessPage />} />

          {/* Protected Citizen Routes */}
          <Route
            path="/citizen/*"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected University Routes (Student & Professor) */}
          <Route
            path="/university/*"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <UniversityPortal />
              </ProtectedRoute>
            }
          />

          {/* Protected Industry Routes */}
          <Route
            path="/industry/*"
            element={
              <ProtectedRoute allowedRoles={['industry']}>
                <IndustryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Government Routes */}
          <Route
            path="/government/*"
            element={
              <ProtectedRoute allowedRoles={['government']}>
                <GovDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Domain Expert Routes */}
          <Route
            path="/expert/*"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <ExpertDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
              Government of Jharkhand
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Official digital platform for the Government of Jharkhand. AI models provide automated decision support; all final selection decisions are rendered by verified human experts.
            </p>
            <div className="flex items-center space-x-4">
              <span>WGS84 GIS Standards</span>
              <span>•</span>
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}
