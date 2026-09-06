import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Users, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  FileText,
  Search,
  Target,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useAccessibility();

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto w-full flex flex-col justify-center space-y-10">
      {/* Brand & Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-sm flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#FF9933" strokeWidth="4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="50" cy="50" r="8" fill="#138808" />
              <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gov-navy font-sans leading-none">
            COLLAB<span className="text-gov-saffron">X</span>
          </h1>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-slate-800 font-sans">
          “Connecting Problems, Ideas & Impact”
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t(
            'CollabX is a proposed digital governance platform connecting citizens, state departments, universities, technical experts, and industry partners to address real public challenges.',
            'CollabX एक प्रस्तावित डिजिटल गवर्नेंस प्लेटफॉर्म है जो नागरिकों, विभागों, विश्वविद्यालयों और उद्योगों को जोड़ता है।'
          )}
        </p>

        {/* Primary Public Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => navigate('/report')}
            className="px-5 py-2.5 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center space-x-2 shadow-xs transition focus:ring-2 focus:ring-gov-blue"
          >
            <FileText className="w-4 h-4 text-gov-saffron" />
            <span>{t('Report a Problem', 'समस्या रिपोर्ट करें')}</span>
          </button>

          <button
            onClick={() => navigate('/track')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-gov-navy border border-slate-300 font-bold text-xs rounded-md flex items-center space-x-2 shadow-xs transition focus:ring-2 focus:ring-gov-blue"
          >
            <Search className="w-4 h-4 text-gov-blue" />
            <span>{t('Track Report Status', 'रिपोर्ट स्थिति देखें')}</span>
          </button>

          <button
            onClick={() => navigate('/challenges')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-md flex items-center space-x-2 transition"
          >
            <Target className="w-4 h-4 text-emerald-700" />
            <span>{t('View Public Challenges', 'सार्वजनिक चुनौतियाँ देखें')}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Answers / Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Answer 1: What is CollabX & What can citizens do */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded bg-blue-50 text-gov-blue flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-base font-bold text-gov-navy">
            {t('What is CollabX & What Can Citizens Do?', 'CollabX क्या है और नागरिक क्या कर सकते हैं?')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizens can submit civic issues using text, voice notes, photos, and location markers, and track status transparently from submission to pilot resolution.
          </p>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate('/report')}
              className="text-xs font-bold text-gov-blue hover:underline flex items-center space-x-1"
            >
              <span>{t('Report an issue now →', 'अभी समस्या रिपोर्ट करें →')}</span>
            </button>
          </div>
        </div>

        {/* Answer 2: How the process works */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-base font-bold text-gov-navy">
            {t('How Does the Process Work?', 'प्रक्रिया कैसे काम करती है?')}
          </h2>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
              <span>1. Citizen reports civic problem</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
              <span>2. Department verifies & publishes challenge</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
              <span>3. Varsity / Industry builds & deploys pilot</span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate('/about')}
              className="text-xs font-bold text-gov-blue hover:underline flex items-center space-x-1"
            >
              <span>{t('Learn about governance model →', 'गवर्नेंस मॉडल जानें →')}</span>
            </button>
          </div>
        </div>

        {/* Answer 3: How organisations contribute */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-base font-bold text-gov-navy">
            {t('How Universities & Industry Contribute', 'विश्वविद्यालय और उद्योग कैसे योगदान देते हैं')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Faculty and student innovators submit research-backed solution proposals, while industry partners provide CSR resources, testing equipment, and pilot support.
          </p>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-gov-blue hover:underline flex items-center space-x-1"
            >
              <span>{t('Choose account & sign in →', 'खाता चुनें और साइन इन करें →')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Type Selection CTA Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-gov-navy">
          {t('Access Portal Accounts', 'पोर्टल खातों तक पहुंचें')}
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Sign in based on your stakeholder role to access citizen services, challenge submission, evaluation desks, or industry collaboration workspaces.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md inline-flex items-center space-x-2 shadow-xs transition focus:ring-2 focus:ring-gov-blue"
        >
          <span>{t('Sign in to CollabX Account →', 'CollabX खाते में साइन इन करें →')}</span>
        </button>
      </div>
    </div>
  );
};

