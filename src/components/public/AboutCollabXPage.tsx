import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ShieldCheck, Users, GraduationCap, Briefcase, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutCollabXPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useAccessibility();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gov-blue mb-1">
          <ShieldCheck className="w-4 h-4 text-gov-saffron" />
          <span>{t('Government of Jharkhand • Proposed Platform Architecture', 'झारखंड सरकार • प्रस्तावित प्लेटफॉर्म आर्किटेक्चर')}</span>
        </div>
        <h1 className="text-3xl font-black text-gov-navy font-sans tracking-tight">
          {t('About CollabX', 'CollabX के बारे में')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {t(
            'CollabX is a proposed digital governance framework connecting citizen reports, department verification, academic research, and industry support.',
            'CollabX एक प्रस्तावित डिजिटल गवर्नेंस ढांचा है जो नागरिकों, विभाग सत्यापन, शैक्षणिक अनुसंधान और उद्योग सहायता को जोड़ता है।'
          )}
        </p>
      </div>

      {/* Core Objectives */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gov-navy">
          {t('Core Platform Principles', 'मुख्य प्लेटफॉर्म सिद्धांत')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-gov-navy block">1. Citizen Civic Voice:</span>
            <p className="text-slate-600 leading-relaxed">
              Enable citizens across all districts to report localized civic challenges using text, voice notes, photos, and location markers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-gov-navy block">2. Institutional Verification:</span>
            <p className="text-slate-600 leading-relaxed">
              Structure verified problem descriptions into actionable public challenges for university researchers and empanelled experts.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-gov-navy block">3. Multi-Stakeholder Collaboration:</span>
            <p className="text-slate-600 leading-relaxed">
              Bridge the gap between academic innovators, domain experts, and industry CSR partners to build practical solutions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-gov-navy block">4. Transparent Evaluation & Tracking:</span>
            <p className="text-slate-600 leading-relaxed">
              Track progress from initial report verification to on-ground pilot deployment and impact measurement.
            </p>
          </div>
        </div>
      </div>

      {/* Stakeholders */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gov-navy">
          {t('Participating Stakeholder Groups', 'भाग लेने वाले हितधारक समूह')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center space-y-1">
            <Users className="w-5 h-5 text-slate-700 mx-auto" />
            <span className="font-bold text-slate-800 block">Citizens</span>
            <span className="text-[10px] text-slate-500">Report & Track</span>
          </div>

          <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center space-y-1">
            <GraduationCap className="w-5 h-5 text-gov-blue mx-auto" />
            <span className="font-bold text-slate-800 block">Universities</span>
            <span className="text-[10px] text-slate-500">Research & Ideas</span>
          </div>

          <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center space-y-1">
            <Briefcase className="w-5 h-5 text-emerald-700 mx-auto" />
            <span className="font-bold text-slate-800 block">Industry</span>
            <span className="text-[10px] text-slate-500">Resources & Pilots</span>
          </div>

          <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center space-y-1">
            <Building2 className="w-5 h-5 text-amber-700 mx-auto" />
            <span className="font-bold text-slate-800 block">Government</span>
            <span className="text-[10px] text-slate-500">Verification & Policy</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gov-navy">
            {t('Explore Public Services', 'सार्वजनिक सेवाओं का अन्वेषण करें')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('Access public services, report issues, or track existing reports.', 'सेवाओं तक पहुंचें, समस्याएं दर्ज करें, या रिपोर्ट स्थिति देखें।')}
          </p>
        </div>
        <button
          onClick={() => navigate('/services')}
          className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center space-x-1.5 transition"
        >
          <span>View Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
