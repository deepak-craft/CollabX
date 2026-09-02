import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Users, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  Cpu,
  Droplets,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { loginAs } = useAuth();
  const { t } = useAccessibility();

  // Sub-role selection state
  const [activeSubModal, setActiveSubModal] = useState<'university' | 'gov_expert' | null>(null);

  const handleCitizenLogin = () => {
    loginAs('citizen');
    onEnterApp();
  };

  const handleUniversitySubRole = (subRole: 'Student' | 'Professor') => {
    if (subRole === 'Student') {
      loginAs('student', 'Student');
    } else {
      loginAs('professor', 'Professor');
    }
    setActiveSubModal(null);
    onEnterApp();
  };

  const handleGovExpertSubRole = (subRole: 'Government Officer' | 'Domain Expert') => {
    if (subRole === 'Government Officer') {
      loginAs('government', 'Government Officer');
    } else {
      loginAs('expert', 'Domain Expert');
    }
    setActiveSubModal(null);
    onEnterApp();
  };

  const handleIndustryLogin = () => {
    loginAs('industry', 'Industry Partner');
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800">
      {/* Top National Header Bar */}
      <div>
        <div className="h-1.5 w-full flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="bg-gov-navy text-white px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold">झारखंड सरकार</span>
            <span className="text-slate-400">|</span>
            <span>GOVERNMENT OF JHARKHAND</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-gov-saffron-amber">
              Smart India Hackathon (SIH26043) GovTech Pilot Demonstrator
            </span>
          </div>
          <div className="text-slate-300 text-[11px] font-mono">
            SECURE GOVTECH GATEWAY • PROTOTYPE
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Brand & Slogan Hero Banner */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
            <span>GovTech Collaborative Ecosystem for Civic Innovation</span>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-gov flex-shrink-0">
              <svg className="w-9 h-9" viewBox="0 0 100 100">
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

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connecting citizens, universities, experts and industry to turn real challenges into deployable solutions.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 pt-2 font-medium">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
              <span>Idea-First Vetting Before Code</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
              <span>AI Decision Support (Human Final Decision)</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
              <span>Jharkhand State Pilot Case Study</span>
            </span>
          </div>
        </div>

        {/* 3 LARGE PRIMARY ACCESS CARDS IN CENTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Citizen */}
          <div className="bg-white rounded-lg border-2 border-slate-200 hover:border-gov-navy shadow-gov hover:shadow-gov-lg transition duration-200 p-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-gov-blue flex items-center justify-center group-hover:bg-gov-navy group-hover:text-white transition">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gov-navy">
                  {t('1. Citizen Portal', '१. नागरिक पोर्टल')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Public civic reporting & validation', 'सार्वजनिक समस्या रिपोर्टिंग')}
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                  <span>Report civic issues via Voice / Camera / GPS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                  <span>Instant AI categorization & duplicate check</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                  <span>Track 8-step visual progress timeline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                  <span>Post-pilot civic feedback & rating</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleCitizenLogin}
                className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-sm rounded flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <span>{t('Enter as Citizen', 'नागरिक के रूप में प्रवेश करें')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-center text-slate-500 mt-2">
                Demo User: <span className="font-semibold text-slate-700">Sunita Devi (Morabadi, Ranchi)</span>
              </div>
            </div>
          </div>

          {/* Card 2: University */}
          <div className="bg-white rounded-lg border-2 border-slate-200 hover:border-gov-blue shadow-gov hover:shadow-gov-lg transition duration-200 p-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-gov-green flex items-center justify-center group-hover:bg-gov-blue group-hover:text-white transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gov-navy">
                  {t('2. University Portal', '२. विश्वविद्यालय पोर्टल')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Students & Faculty research innovation', 'छात्र एवं प्राध्यापक अनुसंधान')}
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-green"></span>
                  <span>Explore verified government challenges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-green"></span>
                  <span>Submit "Idea-First" proposals before code</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-green"></span>
                  <span>Assemble multidisciplinary teams (Civil+CSE+ECE)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-green"></span>
                  <span>Professor mentorship & proposal review</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setActiveSubModal('university')}
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-blue-light text-white font-bold text-sm rounded flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <span>{t('Enter as University', 'विश्वविद्यालय पोर्टल में प्रवेश करें')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-center text-slate-500">
                Choose: <span className="font-semibold text-slate-700">Professor</span> or{' '}
                <span className="font-semibold text-slate-700">Student</span>
              </div>
            </div>
          </div>

          {/* Card 3: Industry / Startup */}
          <div className="bg-white rounded-lg border-2 border-slate-200 hover:border-amber-600 shadow-gov hover:shadow-gov-lg transition duration-200 p-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-gov-saffron flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gov-navy">
                  {t('3. Industry / Startup', '३. उद्योग / स्टार्टअप')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('CSR funding, hardware & pilot scale', 'सीएसआर फंडिंग एवं पायलट सहयोग')}
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Discover high-match GovTech challenges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Offer hardware, testing facilities & mentors</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Collaborate with university engineering teams</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Track CSR impact metrics & scalability</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleIndustryLogin}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <span>{t('Enter as Industry Partner', 'उद्योग पार्टनर के रूप में प्रवेश')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-center text-slate-500 mt-2">
                Demo User: <span className="font-semibold text-slate-700">Tata Steel GovTech CSR Division</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM RESTRICTED ACCESS SECTION (Smaller, bottom-right / lower official area) */}
        <div className="mt-4 pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-1 text-center sm:text-left">
            <div className="font-bold text-slate-700 flex items-center justify-center sm:justify-start space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-gov-navy" />
              <span>Smart India Hackathon 2024 (SIH26043)</span>
            </div>
            <p>Built with React, TypeScript, TailwindCSS and deterministic GovTech AI services.</p>
          </div>

          {/* Restricted Access Card (Noticeably smaller, distinct official security styling) */}
          <div className="bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg p-3 sm:px-4 sm:py-3 flex items-center space-x-4 transition">
            <div className="w-9 h-9 rounded bg-gov-navy text-white flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-gov-saffron-amber" />
            </div>

            <div className="text-left">
              <div className="text-xs font-bold text-gov-navy flex items-center space-x-1">
                <span>{t('Government / Expert Access', 'सरकारी अधिकारी / विशेषज्ञ प्रवेश')}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Restricted Access • Verification Required
              </div>
            </div>

            <button
              onClick={() => setActiveSubModal('gov_expert')}
              className="text-xs font-bold px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded flex items-center space-x-1 transition shadow-sm flex-shrink-0"
            >
              <span>Verify to Login →</span>
            </button>
          </div>
        </div>
      </main>

      {/* University Sub-Role Selector Modal */}
      {activeSubModal === 'university' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog">
          <div className="bg-white rounded-lg border border-gov-border shadow-gov-lg max-w-md w-full p-6 space-y-4">
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gov-navy">Select University Persona</h3>
                <p className="text-xs text-slate-500">Choose your academic role to proceed</p>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Student Option */}
              <div
                onClick={() => handleUniversitySubRole('Student')}
                className="p-3.5 rounded border border-slate-200 hover:border-gov-blue hover:bg-blue-50/60 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-gov-blue flex items-center justify-center font-bold text-sm">
                    AK
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Amit Kumar (Student Lead)</div>
                    <div className="text-xs text-slate-500">Team JalRakshak • Final Year B.Tech, BIT Mesra</div>
                    <div className="text-[10px] text-gov-green font-semibold mt-0.5">Explore Challenges & Submit Ideas</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-blue" />
              </div>

              {/* Professor Option */}
              <div
                onClick={() => handleUniversitySubRole('Professor')}
                className="p-3.5 rounded border border-slate-200 hover:border-gov-blue hover:bg-blue-50/60 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-gov-saffron flex items-center justify-center font-bold text-sm">
                    RV
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Dr. Ramesh Verma (Professor)</div>
                    <div className="text-xs text-slate-500">Dept of Civil & Water Resources, BIT Mesra</div>
                    <div className="text-[10px] text-gov-blue font-semibold mt-0.5">Review Student Ideas & Mentor Teams</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-blue" />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-2">
              Prototype Persona Switcher • No password required
            </div>
          </div>
        </div>
      )}

      {/* Government / Expert Sub-Role Modal */}
      {activeSubModal === 'gov_expert' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog">
          <div className="bg-white rounded-lg border border-gov-border shadow-gov-lg max-w-md w-full p-6 space-y-4">
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gov-navy">Restricted Access Verification</h3>
                <p className="text-xs text-slate-500">Official GovTech Authority & Expert Evaluation</p>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Government Officer Option */}
              <div
                onClick={() => handleGovExpertSubRole('Government Officer')}
                className="p-3.5 rounded border border-slate-200 hover:border-gov-navy hover:bg-slate-50 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-sm">
                    AP
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Alok Prasad, IAS (Govt Officer)</div>
                    <div className="text-xs text-slate-500">Joint Secretary, Urban Development & Housing Dept</div>
                    <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Verify Problems & Publish Open Challenges</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-navy" />
              </div>

              {/* Domain Expert Option */}
              <div
                onClick={() => handleGovExpertSubRole('Domain Expert')}
                className="p-3.5 rounded border border-slate-200 hover:border-purple-600 hover:bg-purple-50/60 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm">
                    SM
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Dr. S. K. Mahato (Domain Expert)</div>
                    <div className="text-xs text-slate-500">Chief Advisor, State Technical Committee (Hydrology)</div>
                    <div className="text-[10px] text-purple-800 font-semibold mt-0.5">Compare Ideas & Make Final Decision</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <span className="font-bold">Human-in-the-Loop Safeguard:</span> AI provides decision support recommendations only. Final proposal selection and challenge verification must always be performed by verified personnel.
            </div>
          </div>
        </div>
      )}

      {/* Official Gov Footer */}
      <footer className="bg-white border-t border-gov-border py-4 px-4 sm:px-8 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span>COLLABX — GovTech Innovation Platform</span>
          <span className="mx-2">•</span>
          <span>Jharkhand State Innovation Mission (Pilot Prototype)</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Smart India Hackathon 2024 • SIH26043
        </div>
      </footer>
    </div>
  );
};
