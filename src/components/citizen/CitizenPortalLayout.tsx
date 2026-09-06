import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { CitizenSidebar } from './CitizenSidebar';
import { Menu, X } from 'lucide-react';

interface CitizenPortalLayoutProps {
  children?: React.ReactNode;
}

export const CitizenPortalLayout: React.FC<CitizenPortalLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Official Section Header */}
      <div className="bg-white rounded-md border border-slate-200 p-3.5 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-gov-navy uppercase tracking-wider block">
              {t('Government of Jharkhand • Grievance & Public Services Portal', 'झारखंड सरकार • शिकायत एवं नागरिक सेवा पोर्टल')}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gov-navy mt-1">
              {t('Citizen Services', 'नागरिक सेवाएं')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t('Report and track civic issues in your area.', 'अपने क्षेत्र की नागरिक समस्याओं को दर्ज और ट्रैक करें।')}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="font-semibold text-slate-700">{currentUser.name}</span>
            <div className="text-[11px] text-slate-500 font-mono">
              {(currentUser as any).phone || currentUser.email || 'Grievance Registrant'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Sidebar Layout */}
      <div className="flex flex-col md:grid md:grid-cols-[360px_minmax(0,1fr)] gap-[28px] items-start">
        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden w-full flex items-center justify-between bg-white p-3 border border-slate-200 rounded-md shadow-xs">
          <span className="font-bold text-gov-navy text-xs uppercase tracking-wider">Citizen Navigation</span>
          <button
            onClick={() => setIsMobileSidebarOpen(prev => !prev)}
            className="p-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Shared Reusable Sidebar */}
        <CitizenSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
