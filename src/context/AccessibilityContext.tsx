import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
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
  t: (en: string, hi: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>('md');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [grayscale, setGrayscaleState] = useState<boolean>(false);
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('en');

  // Sync with document body classes
  useEffect(() => {
    const body = document.body;
    // Clear font classes
    body.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl');
    body.classList.add(`font-${fontSize}`);

    // High Contrast
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Grayscale
    if (grayscale) {
      body.classList.add('grayscale-mode');
    } else {
      body.classList.remove('grayscale-mode');
    }

    // Reduce Motion
    if (reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
  }, [fontSize, highContrast, grayscale, reduceMotion]);

  const increaseFontSize = () => {
    if (fontSize === 'sm') setFontSizeState('md');
    else if (fontSize === 'md') setFontSizeState('lg');
    else if (fontSize === 'lg') setFontSizeState('xl');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'xl') setFontSizeState('lg');
    else if (fontSize === 'lg') setFontSizeState('md');
    else if (fontSize === 'md') setFontSizeState('sm');
  };

  const toggleHighContrast = () => setHighContrastState(prev => !prev);
  const toggleGrayscale = () => setGrayscaleState(prev => !prev);
  const toggleReduceMotion = () => setReduceMotionState(prev => !prev);
  const toggleLanguage = () => setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));

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
