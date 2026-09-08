import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export const LoginSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useAccessibility();

  const primaryAccounts = [
    {
      id: 'citizen',
      title: t('Citizen', 'नागरिक'),
      description: t('Report and track public issues', 'सार्वजनिक मुद्दों की रिपोर्ट और ट्रैकिंग करें'),
      icon: Users,
      path: '/login/citizen',
      btnText: t('Citizen Login', 'नागरिक लॉगिन'),
      badgeColor: 'bg-blue-50 text-gov-blue border-blue-200',
    },
    {
      id: 'university',
      title: t('University / Research', 'विश्वविद्यालय / अनुसंधान'),
      description: t('Contribute ideas, research and expertise', 'विचार, अनुसंधान और विशेषज्ञता का योगदान करें'),
      icon: GraduationCap,
      path: '/login/university',
      btnText: t('University / Research Login', 'विश्वविद्यालय लॉगिन'),
      badgeColor: 'bg-blue-50 text-gov-blue border-blue-200',
    },
    {
      id: 'industry',
      title: t('Industry / Organisation', 'उद्योग / संगठन'),
      description: t('Provide expertise, resources and support', 'विशेषज्ञता, संसाधन और सहायता प्रदान करें'),
      icon: Briefcase,
      path: '/login/industry',
      btnText: t('Industry / Organisation Login', 'उद्योग लॉगिन'),
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col justify-center space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gov-navy font-sans">
          {t('SIGN IN TO COLLABX', 'COLLABX में साइन इन करें')}
        </h1>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {t('Choose your access', 'अपना एक्सेस चुनें')}
        </p>
      </div>

      {/* 3 Primary Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {primaryAccounts.map((type) => {
          const IconComponent = type.icon;
          return (
            <div
              key={type.id}
              className="bg-white rounded-lg border border-slate-200 hover:border-gov-navy shadow-xs hover:shadow-md transition duration-200 p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${type.badgeColor} border flex items-center justify-center transition group-hover:bg-gov-navy group-hover:text-white group-hover:border-gov-navy`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gov-navy font-sans">
                    {type.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(type.path)}
                  className="w-full py-2.5 px-4 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center justify-center space-x-2 transition focus:ring-2 focus:ring-gov-blue shadow-xs"
                >
                  <span>{type.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Separate Section: Government / Expert Access */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-md bg-gov-navy text-white flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-gov-saffron-amber" />
            </div>

            <div>
              <div className="text-sm font-bold text-gov-navy flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-gov-navy" />
                <span>{t('Government / Expert Access', 'सरकारी अधिकारी / विशेषज्ञ प्रवेश')}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Restricted to authorised personnel
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login/government')}
            className="text-xs font-bold px-4 py-2.5 bg-gov-navy hover:bg-slate-800 text-white rounded-md flex items-center space-x-1.5 transition shadow-xs focus:ring-2 focus:ring-gov-blue"
          >
            <span>Verify to Login →</span>
          </button>
        </div>
      </div>

      {/* Global Registration Banner */}
      <div className="text-center text-xs text-slate-600 font-medium pt-2">
        New to CollabX?{' '}
        <button
          onClick={() => navigate('/register')}
          className="font-bold text-gov-blue hover:underline focus:outline-none"
        >
          Create your CollabX Account →
        </button>
      </div>
    </div>
  );
};
