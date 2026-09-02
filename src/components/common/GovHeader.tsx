import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { NotificationDropdown } from './NotificationDropdown';
import { AccessibilityMenu } from './AccessibilityMenu';
import { storageService } from '../../services/storageService';
import { 
  Bell, 
  Search, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Globe, 
  Shield, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2,
  Home
} from 'lucide-react';

interface GovHeaderProps {
  onSearch?: (term: string) => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, allPersonas, selectPersona, loginAs, logout } = useAuth();
  const {
    language,
    toggleLanguage,
    t
  } = useAccessibility();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [searchTerm, setSearchTerm] = useState('');

  const isPublicAuthRoute = 
    location.pathname === '/' || 
    location.pathname.startsWith('/login');

  const unreadCount = notifications.filter(n => !n.read).length;

  const refreshNotifications = () => {
    setNotifications(storageService.getNotifications());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleNavigatePortal = (role: 'citizen' | 'student' | 'industry' | 'government' | 'expert') => {
    if (role === 'citizen') {
      loginAs('citizen', 'Citizen');
      navigate('/citizen');
    } else if (role === 'student') {
      loginAs('student', 'Student');
      navigate('/university');
    } else if (role === 'industry') {
      loginAs('industry', 'Industry Partner');
      navigate('/industry');
    } else if (role === 'government') {
      loginAs('government', 'Government Officer');
      navigate('/government');
    } else if (role === 'expert') {
      loginAs('expert', 'Domain Expert');
      navigate('/expert');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'government':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'expert':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'student':
      case 'professor':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'industry':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'citizen':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'government':
        return <Building2 className="w-3.5 h-3.5 text-amber-700" />;
      case 'expert':
        return <Shield className="w-3.5 h-3.5 text-purple-700" />;
      case 'student':
      case 'professor':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-700" />;
      case 'industry':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-700" />;
      case 'citizen':
      default:
        return <UserCheck className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gov-border shadow-gov">
      {/* Tricolor Accent Ribbon */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Gov Header */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo & Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')} title="COLLABX Home">
          <div className="w-10 h-10 rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-xs flex-shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#FF9933" strokeWidth="4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="50" cy="50" r="8" fill="#138808" />
              <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                {t('Government of Jharkhand', 'झारखंड सरकार')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-navy font-sans leading-none">
              COLLAB<span className="text-gov-saffron">X</span>
            </h1>
          </div>
        </div>

        {/* Center: Global Search (AUTHENTICATED ONLY) */}
        {!isPublicAuthRoute && (
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('Search civic problems, challenges, proposals...', 'समस्याएं, चुनौतियां और प्रस्ताव खोजें...')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-gov-blue focus:ring-1 focus:ring-gov-blue transition"
              />
            </div>
          </div>
        )}

        {/* Right Header Actions */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Skip link for Accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:bg-gov-navy focus:text-white px-2 py-1 rounded">
            {t('Skip to Content', 'सामग्री पर जाएं')}
          </a>

          {/* Accessibility Control (PROMINENT ON ALL PAGES) */}
          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-gov-navy font-bold transition shadow-2xs focus:ring-2 focus:ring-gov-blue"
            title={t('Accessibility Controls', 'अभिगम्यता नियंत्रण')}
            aria-label="Accessibility Settings"
          >
            <span className="text-base" role="img" aria-label="Accessibility">♿</span>
            <span className="hidden sm:inline">{t('Accessibility', 'अभिगम्यता')}</span>
          </button>

          {/* Language Switcher (SEPARATE & PROMINENT ON ALL PAGES) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold transition shadow-2xs focus:ring-2 focus:ring-gov-blue"
            title="Switch Language / भाषा बदलें"
            aria-label="Language Switcher"
          >
            <Globe className="w-4 h-4 text-gov-blue" />
            <span>{language === 'en' ? '🌐 हिंदी' : '🌐 English'}</span>
          </button>

          {/* Authenticated Only Tools: Notifications & Profile Switcher */}
          {!isPublicAuthRoute && (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(prev => !prev)}
                  className="p-2 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-full relative transition focus:ring-2 focus:ring-gov-blue"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-gov-saffron text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  notifications={notifications}
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  onUpdate={refreshNotifications}
                />
              </div>

              {/* Persona Profile Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsPersonaMenuOpen(prev => !prev)}
                  className="flex items-center space-x-2 p-1.5 border border-gov-border rounded-lg hover:bg-slate-50 transition text-left focus:ring-2 focus:ring-gov-blue"
                >
                  <div className="w-8 h-8 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-gov-navy flex items-center space-x-1">
                      <span>{currentUser.name}</span>
                      {currentUser.verified && (
                        <span title="Verified Profile">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium flex items-center space-x-1 ${getRoleBadgeColor(currentUser.role)}`}>
                        {getRoleIcon(currentUser.role)}
                        <span>{currentUser.subRole || currentUser.role}</span>
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>

                {/* Dropdown menu */}
                {isPersonaMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-gov-lg border border-gov-border z-50 overflow-hidden">
                    <div className="bg-slate-50 p-3 border-b border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {t('Switch User Profile', 'प्रोफाइल बदलें')}
                      </div>
                      <div className="text-xs text-slate-700 font-medium mt-1">
                        {currentUser.organization} • {currentUser.district}
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {allPersonas.map(persona => (
                        <button
                          key={persona.id}
                          onClick={() => {
                            selectPersona(persona);
                            setIsPersonaMenuOpen(false);
                            const dest = 
                              persona.role === 'citizen' ? '/citizen' :
                              persona.role === 'student' || persona.role === 'professor' ? '/university' :
                              persona.role === 'industry' ? '/industry' :
                              persona.role === 'government' ? '/government' : '/expert';
                            navigate(dest);
                          }}
                          className={`w-full p-2.5 text-left text-xs flex items-center space-x-3 transition hover:bg-blue-50 ${
                            persona.id === currentUser.id ? 'bg-blue-50/80 font-bold border-l-4 border-gov-blue' : ''
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {persona.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-900 truncate font-semibold">{persona.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{persona.title}</div>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(persona.role)}`}>
                            {persona.subRole || persona.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-start items-center">
                      <button
                        onClick={() => {
                          setIsPersonaMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 p-1 rounded hover:bg-red-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('Main Login Portal', 'लॉगिन पोर्टल पर जाएं')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Primary Portal Navigation Bar (AUTHENTICATED ONLY - HIDDEN ON PUBLIC LOGIN PAGE) */}
      {!isPublicAuthRoute && (
        <div className="bg-slate-100 border-t border-gov-border px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-1.5 rounded border flex items-center space-x-1 shadow-xs transition ${
                location.pathname === '/' || location.pathname.startsWith('/login')
                  ? 'bg-gov-navy text-white font-bold border-gov-navy'
                  : 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-gov-saffron" />
              <span>Portal Main</span>
            </button>

            <button
              onClick={() => handleNavigatePortal('citizen')}
              className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                location.pathname.startsWith('/citizen')
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => handleNavigatePortal('student')}
              className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                location.pathname.startsWith('/university')
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>University Portal</span>
            </button>

            <button
              onClick={() => handleNavigatePortal('industry')}
              className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                location.pathname.startsWith('/industry')
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Industry Portal</span>
            </button>

            <button
              onClick={() => handleNavigatePortal('government')}
              className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                location.pathname.startsWith('/government')
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Govt Portal</span>
            </button>

            <button
              onClick={() => handleNavigatePortal('expert')}
              className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
                location.pathname.startsWith('/expert')
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Domain Expert</span>
            </button>
          </div>
        </div>
      )}

      {/* Accessibility Modal Drawer */}
      <AccessibilityMenu isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
    </header>
  );
};

