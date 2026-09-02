import React, { useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Type, Sliders, Globe, X, RotateCcw, Activity, Keyboard } from 'lucide-react';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    grayscale,
    setGrayscale,
    reduceMotion,
    setReduceMotion,
    language,
    setLanguage,
    resetAccessibility,
    t
  } = useAccessibility();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('Accessibility & Display Options', 'अभिगम्यता और प्रदर्शन विकल्प')}
    >
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl" role="img" aria-label="Accessibility">♿</span>
            <h2 className="text-base font-black tracking-tight text-gov-navy">
              {t('Accessibility', 'अभिगम्यता')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-gov-blue"
            aria-label={t('Close panel', 'पैनल बंद करें')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Text Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Type className="w-3.5 h-3.5 text-gov-blue" />
            <span>{t('Text Size', 'पाठ का आकार')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFontSize('sm')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                fontSize === 'sm'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-label="A- Small Text Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                fontSize === 'md'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-label="A Default Text Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                fontSize === 'lg'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-label="A+ Large Text Size"
            >
              A+
            </button>
          </div>
        </div>

        {/* 2. Contrast */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-gov-blue" />
            <span>{t('Contrast', 'कंट्रास्ट')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setHighContrast(false)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                !highContrast
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setHighContrast(true)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                highContrast
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              High Contrast
            </button>
          </div>
        </div>

        {/* 3. Motion */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-gov-blue" />
            <span>{t('Motion', 'एनीमेशन / गति')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReduceMotion(false)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                !reduceMotion
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setReduceMotion(true)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                reduceMotion
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Reduce Motion
            </button>
          </div>
        </div>

        {/* 4. Grayscale */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-gov-blue" />
            <span>{t('Grayscale', 'ग्रेस्केल')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGrayscale(false)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                !grayscale
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Off
            </button>
            <button
              onClick={() => setGrayscale(true)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                grayscale
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              On
            </button>
          </div>
        </div>

        {/* 5. Keyboard Navigation Status Indicator */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-gov-blue" />
            <span className="font-bold text-slate-700">{t('Keyboard Navigation', 'कीबोर्ड नेविगेशन')}</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded border border-emerald-300">
            On
          </span>
        </div>

        {/* 6. Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-gov-blue" />
            <span>{t('Language', 'भाषा')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                language === 'en'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                language === 'hi'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={resetAccessibility}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 py-1.5 px-2 rounded hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Accessibility</span>
          </button>
          <button
            onClick={onClose}
            className="py-1.5 px-4 text-xs font-bold bg-gov-navy text-white rounded-lg hover:bg-gov-navy-dark transition shadow-xs"
          >
            {t('Done', 'संपन्न')}
          </button>
        </div>
      </div>
    </div>
  );
};

