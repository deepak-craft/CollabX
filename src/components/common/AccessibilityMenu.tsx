import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Type, Sliders, Globe, X, RotateCcw } from 'lucide-react';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    grayscale,
    toggleGrayscale,
    reduceMotion,
    toggleReduceMotion,
    language,
    toggleLanguage,
    t
  } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Accessibility Settings">
      <div className="bg-white rounded-lg shadow-gov-lg border border-gov-border max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gov-border pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-gov-blue" />
            <h2 className="text-lg font-bold text-gov-navy">
              {t('Accessibility & Display Options', 'अभिगम्यता और प्रदर्शन विकल्प')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
            aria-label={t('Close', 'बंद करें')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Size */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
            <Type className="w-4 h-4 text-gov-blue" />
            <span>{t('Text Size', 'पाठ का आकार')}</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`py-2 px-3 text-sm font-medium border rounded transition ${
                  fontSize === size
                    ? 'bg-gov-navy text-white border-gov-navy font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {size === 'sm' && 'A- (14px)'}
                {size === 'md' && 'A (16px)'}
                {size === 'lg' && 'A+ (18px)'}
                {size === 'xl' && 'A++ (20px)'}
              </button>
            ))}
          </div>
        </div>

        {/* Contrast and Color Modes */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gov-blue" />
            <span>{t('Contrast & Visual Modes', 'कंट्रास्ट और दृश्य मोड')}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={toggleHighContrast}
              className={`p-3 text-sm rounded border text-left flex flex-col justify-between ${
                highContrast
                  ? 'bg-amber-100 border-amber-600 text-amber-900 font-semibold'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{t('High Contrast Mode', 'उच्च कंट्रास्ट मोड')}</span>
              <span className="text-xs text-slate-500 mt-1">
                {highContrast ? t('Enabled (Dark / High Contrast)', 'सक्षम') : t('Standard Contrast', 'मानक')}
              </span>
            </button>

            <button
              onClick={toggleGrayscale}
              className={`p-3 text-sm rounded border text-left flex flex-col justify-between ${
                grayscale
                  ? 'bg-slate-300 border-slate-700 text-slate-950 font-semibold'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{t('Grayscale Mode', 'ग्रेस्केल मोड')}</span>
              <span className="text-xs text-slate-500 mt-1">
                {grayscale ? t('Monochrome Filter Active', 'सक्रिय') : t('Color Filter Normal', 'सामान्य')}
              </span>
            </button>
          </div>
        </div>

        {/* Motion Reduction */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-300 rounded">
          <div>
            <div className="text-sm font-medium text-slate-800">{t('Reduce Motion', 'एनीमेशन कम करें')}</div>
            <div className="text-xs text-slate-500">{t('Disables UI transitions & animations', 'सभी एनीमेशन बंद करता है')}</div>
          </div>
          <button
            onClick={toggleReduceMotion}
            className={`px-3 py-1.5 text-xs font-semibold rounded border ${
              reduceMotion
                ? 'bg-gov-navy text-white border-gov-navy'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {reduceMotion ? t('Active', 'चालू') : t('Inactive', 'बंद')}
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-300 rounded">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gov-blue" />
            <div>
              <div className="text-sm font-medium text-slate-800">{t('Portal Language', 'पोर्टल की भाषा')}</div>
              <div className="text-xs text-slate-500">{language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</div>
            </div>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-semibold bg-gov-blue text-white rounded hover:bg-gov-blue-light"
          >
            {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
          </button>
        </div>

        {/* Reset / Done */}
        <div className="pt-2 border-t border-gov-border flex justify-between items-center">
          <button
            onClick={() => {
              setFontSize('md');
              if (highContrast) toggleHighContrast();
              if (grayscale) toggleGrayscale();
              if (reduceMotion) toggleReduceMotion();
            }}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Reset Defaults', 'डिफ़ॉल्ट पर रीसेट करें')}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold bg-gov-navy text-white rounded hover:bg-gov-navy-dark"
          >
            {t('Save & Close', 'सहेजें और बंद करें')}
          </button>
        </div>
      </div>
    </div>
  );
};
