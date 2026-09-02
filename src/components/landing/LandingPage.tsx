import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Users, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  Lock, 
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useAccessibility();

  const handleCitizenLogin = () => {
    navigate('/login/citizen');
  };

  const handleUniversityLogin = () => {
    navigate('/login/university');
  };

  const handleIndustryLogin = () => {
    navigate('/login/industry');
  };

  const handleRestrictedLogin = () => {
    navigate('/login/restricted');
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto w-full flex flex-col justify-center">
      {/* Brand & Slogan Hero Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-sm flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#FF9933" strokeWidth="4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="50" cy="50" r="8" fill="#138808" />
              <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gov-navy font-sans">
            COLLAB<span className="text-gov-saffron">X</span>
          </h1>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-slate-800 font-sans">
          “Connecting Problems, Ideas & Impact”
        </p>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t(
            'Connecting citizens, universities, domain experts, and industry to turn real challenges into practical solutions.',
            'नागरिकों, विश्वविद्यालयों, विशेषज्ञों और उद्योगों को जोड़कर चुनौतियों का समाधान।'
          )}
        </p>

        <div className="pt-4 border-t border-slate-200/60 max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Choose Your Access', 'अपना एक्सेस चुनें')}
          </span>
        </div>
      </div>

      {/* 3 PRIMARY ACCESS CARDS IN CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Citizen */}
        <div className="bg-white rounded-lg border border-slate-200 hover:border-gov-navy shadow-xs hover:shadow-md transition duration-200 p-5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center group-hover:bg-gov-navy group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gov-navy">
                👤 {t('Citizen', 'नागरिक')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Public civic reporting & feedback', 'सार्वजनिक समस्या रिपोर्टिंग और प्रतिक्रिया')}
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Report civic issues with Voice / Photo / GPS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Track status & progress timeline</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Submit civic feedback & ratings</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleCitizenLogin}
              className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition shadow-xs focus:ring-2 focus:ring-gov-blue"
            >
              <span>{t('Citizen Login →', 'नागरिक लॉगिन →')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: University */}
        <div className="bg-white rounded-lg border border-slate-200 hover:border-gov-blue shadow-xs hover:shadow-md transition duration-200 p-5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gov-navy">
                🎓 {t('University', 'विश्वविद्यालय')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Students & Faculty research innovation', 'छात्र एवं प्राध्यापक अनुसंधान')}
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-blue"></span>
                <span>Explore verified government challenges</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-blue"></span>
                <span>Submit Idea-First proposals</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-blue"></span>
                <span>Faculty advisement & team collaboration</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleUniversityLogin}
              className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-blue-light text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition shadow-xs focus:ring-2 focus:ring-gov-blue"
            >
              <span>{t('University Login →', 'विश्वविद्यालय लॉगिन →')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Industry / Startup */}
        <div className="bg-white rounded-lg border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition duration-200 p-5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gov-navy">
                🏭 {t('Industry / Startup', 'उद्योग / स्टार्टअप')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('CSR support, hardware & pilot scale', 'सीएसआर सपोर्ट एवं पायलट सहयोग')}
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Discover high-match GovTech challenges</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Provide hardware, facilities & CSR support</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Track project milestones & impact</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleIndustryLogin}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition shadow-xs focus:ring-2 focus:ring-gov-blue"
            >
              <span>{t('Industry Login →', 'उद्योग लॉगिन →')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SUBTLE DIVIDER */}
      <div className="border-t border-slate-200 pt-6">
        {/* RESTRICTED ACCESS SECTION BELOW (NOT VISUALLY EQUAL TO PRIMARY OPTIONS) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:px-5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-md bg-gov-navy text-white flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-gov-saffron-amber" />
            </div>

            <div>
              <div className="text-xs font-bold text-gov-navy flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gov-navy" />
                <span>🏛️ {t('Government / Expert Access', 'सरकारी अधिकारी / विशेषज्ञ प्रवेश')}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Restricted Access • Verification Required
              </div>
            </div>
          </div>

          <button
            onClick={handleRestrictedLogin}
            className="text-xs font-bold px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded-md flex items-center space-x-1 transition shadow-2xs focus:ring-2 focus:ring-gov-blue"
          >
            <span>Verify to Login →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

