import React, { useState } from 'react';
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
  Sliders, 
  Globe, 
  Shield, 
  Eye, 
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
  const { currentUser, allPersonas, selectPersona, loginAs, logout } = useAuth();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    language,
    toggleLanguage,
    t
  } = useAccessibility();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [searchTerm, setSearchTerm] = useState('');

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

      {/* Top Utility Gov Bar */}
      <div className="bg-gov-navy text-white text-xs px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-slate-200">
          <span className="font-semibold text-white">झारखंड सरकार</span>
          <span className="text-slate-400">|</span>
          <span>GOVERNMENT OF JHARKHAND</span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-gov-saffron-amber font-medium">
            Smart India Hackathon (SIH26043) GovTech Pilot
          </span>
        </div>

        {/* Accessibility & Language Quick Bar */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Skip to Content Label */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:text-amber-300 mr-2">
            {t('Skip to Main Content', 'मुख्य सामग्री पर जाएं')}
          </a>

          {/* Text Size Adjuster */}
          <div className="flex items-center bg-gov-navy-dark px-1.5 py-0.5 rounded border border-slate-700 space-x-1" title="Font Size">
            <button
              onClick={decreaseFontSize}
              className={`px-1 hover:text-amber-300 font-bold ${fontSize === 'sm' ? 'text-amber-400' : 'text-slate-300'}`}
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setFontSize('md')}
              className={`px-1 hover:text-amber-300 font-bold ${fontSize === 'md' ? 'text-amber-400' : 'text-slate-300'}`}
              aria-label="Normal Font Size"
            >
              A
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={increaseFontSize}
              className={`px-1 hover:text-amber-300 font-bold ${fontSize === 'lg' || fontSize === 'xl' ? 'text-amber-400' : 'text-slate-300'}`}
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            title={t('Toggle High Contrast Mode', 'उच्च कंट्रास्ट मोड बदलें')}
            className={`p-1 rounded border flex items-center space-x-1 ${
              highContrast ? 'bg-amber-400 text-slate-950 font-bold border-amber-300' : 'border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Contrast', 'कंट्रास्ट')}</span>
          </button>

          {/* Full Accessibility Options */}
          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="text-slate-300 hover:text-white flex items-center space-x-1"
            title="Accessibility Menu"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Accessibility', 'अभिगम्यता')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-slate-200 hover:text-white px-1.5 py-0.5 rounded bg-gov-blue hover:bg-gov-blue-light"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Gov Header */}
      <div className="px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Identity - Clicking goes back to Landing Page */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => logout()} title="Return to Landing Page">
          <div className="w-11 h-11 rounded-full bg-gov-navy flex items-center justify-center text-white border-2 border-gov-saffron shadow-sm flex-shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#FF9933" strokeWidth="4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="50" cy="50" r="8" fill="#138808" />
              <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-navy font-sans">
                COLLAB<span className="text-gov-saffron">X</span>
              </h1>
              <span className="hidden sm:inline text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-gov-blue-50 text-gov-blue border border-gov-border rounded">
                GovTech Jharkhand
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 hidden sm:block">
              “Connecting Problems, Ideas & Impact”
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
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

        {/* Right Action Tools: Notifications + Persona Switcher */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="p-2 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-full relative transition"
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

          {/* Current Persona Badge & Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(prev => !prev)}
              className="flex items-center space-x-2 p-1.5 border border-gov-border rounded-lg hover:bg-slate-50 transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-gov-navy flex items-center space-x-1">
                  <span>{currentUser.name}</span>
                  {currentUser.verified && (
                    <span title="Verified GovTech Profile">
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

            {/* Persona Quick Switch Menu */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-gov-lg border border-gov-border z-50 overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('Switch Demo Persona (SIH Testing)', 'डेमो प्रोफाइल बदलें')}
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

                <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 p-1 rounded hover:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('Main Login Portal', 'लॉगिन पोर्टल पर जाएं')}</span>
                  </button>
                  <span className="text-[10px] text-slate-400">SIH26043</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Portal Navigation Bar */}
      <div className="bg-slate-100 border-t border-gov-border px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-bold">
          <button
            onClick={() => logout()}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center space-x-1 shadow-xs transition"
          >
            <Home className="w-3.5 h-3.5 text-gov-saffron" />
            <span>Home (Portal Access)</span>
          </button>

          <button
            onClick={() => loginAs('citizen', 'Citizen')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              currentUser.role === 'citizen'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Citizen Portal</span>
          </button>

          <button
            onClick={() => loginAs('student', 'Student')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              currentUser.role === 'student' || currentUser.role === 'professor'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>University Portal</span>
          </button>

          <button
            onClick={() => loginAs('industry', 'Industry Partner')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              currentUser.role === 'industry'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Industry Portal</span>
          </button>

          <button
            onClick={() => loginAs('government', 'Government Officer')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              currentUser.role === 'government'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Govt Portal</span>
          </button>

          <button
            onClick={() => loginAs('expert', 'Domain Expert')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              currentUser.role === 'expert'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Domain Expert</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-semibold hidden md:block">
          Active View: <span className="text-gov-navy uppercase font-bold">{currentUser.subRole || currentUser.role}</span>
        </div>
      </div>

      {/* Accessibility Modal */}
      <AccessibilityMenu isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
    </header>
  );
};
