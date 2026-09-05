import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'sm' | 'md' | 'lg';
export type Language = 'en' | 'hi';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  grayscale: boolean;
  setGrayscale: (val: boolean) => void;
  toggleGrayscale: () => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  toggleReduceMotion: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  resetAccessibility: () => void;
  t: (en: string, hi: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const LS_KEY_FONT = 'collabx_access_font_size';
const LS_KEY_CONTRAST = 'collabx_access_high_contrast';
const LS_KEY_GRAYSCALE = 'collabx_access_grayscale';
const LS_KEY_MOTION = 'collabx_access_reduce_motion';
const LS_KEY_LANG = 'collabx_access_language';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem(LS_KEY_FONT);
    return (saved === 'sm' || saved === 'md' || saved === 'lg') ? saved : 'md';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem(LS_KEY_CONTRAST) === 'true';
  });

  const [grayscale, setGrayscaleState] = useState<boolean>(() => {
    return localStorage.getItem(LS_KEY_GRAYSCALE) === 'true';
  });

  const [reduceMotion, setReduceMotionState] = useState<boolean>(() => {
    return localStorage.getItem(LS_KEY_MOTION) === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LS_KEY_LANG);
    return saved === 'hi' ? 'hi' : 'en';
  });

  // Sync with document.documentElement (html element) and body
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Font size classes on html
    html.classList.remove('font-sm', 'font-md', 'font-lg');
    html.classList.add(`font-${fontSize}`);
    body.classList.remove('font-sm', 'font-md', 'font-lg');
    body.classList.add(`font-${fontSize}`);
    localStorage.setItem(LS_KEY_FONT, fontSize);

    // High Contrast
    if (highContrast) {
      html.classList.add('high-contrast');
      body.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
      body.classList.remove('high-contrast');
    }
    localStorage.setItem(LS_KEY_CONTRAST, String(highContrast));

    // Grayscale
    if (grayscale) {
      html.classList.add('grayscale-mode');
      body.classList.add('grayscale-mode');
    } else {
      html.classList.remove('grayscale-mode');
      body.classList.remove('grayscale-mode');
    }
    localStorage.setItem(LS_KEY_GRAYSCALE, String(grayscale));

    // Reduce Motion
    if (reduceMotion) {
      html.classList.add('reduce-motion');
      body.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
      body.classList.remove('reduce-motion');
    }
    localStorage.setItem(LS_KEY_MOTION, String(reduceMotion));

    // Language
    localStorage.setItem(LS_KEY_LANG, language);
  }, [fontSize, highContrast, grayscale, reduceMotion, language]);

  const increaseFontSize = () => {
    if (fontSize === 'sm') setFontSizeState('md');
    else if (fontSize === 'md') setFontSizeState('lg');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'lg') setFontSizeState('md');
    else if (fontSize === 'md') setFontSizeState('sm');
  };

  const toggleHighContrast = () => setHighContrastState(prev => !prev);
  const toggleGrayscale = () => setGrayscaleState(prev => !prev);
  const toggleReduceMotion = () => setReduceMotionState(prev => !prev);
  const toggleLanguage = () => setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));

  const resetAccessibility = () => {
    setFontSizeState('md');
    setHighContrastState(false);
    setGrayscaleState(false);
    setReduceMotionState(false);
    setLanguageState('en');
  };

  // Translation helper
  const t = (en: string, hi: string): string => {
    return language === 'hi' ? hi : en;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize: setFontSizeState,
        increaseFontSize,
        decreaseFontSize,
        highContrast,
        setHighContrast: setHighContrastState,
        toggleHighContrast,
        grayscale,
        setGrayscale: setGrayscaleState,
        toggleGrayscale,
        reduceMotion,
        setReduceMotion: setReduceMotionState,
        toggleReduceMotion,
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        resetAccessibility,
        t,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

