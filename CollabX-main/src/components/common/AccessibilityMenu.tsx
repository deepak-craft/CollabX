import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  AlignVerticalSpaceAround,
  Contrast,
  Link2,
  MousePointer2,
  RefreshCcw,
  SunMoon,
  TextCursorInput,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const {
    increaseFontSize,
    decreaseFontSize,
    resetAccessibility,
    t,
  } = useAccessibility();
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('normal');
  const [textSpacing, setTextSpacing] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [invertColors, setInvertColors] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const highlightedElement = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('access-highlight-links', highlightLinks);
    html.classList.toggle('access-large-cursor', largeCursor);
    html.classList.toggle('access-dark-mode', darkMode);
    html.classList.toggle('access-invert-colors', invertColors);
    html.classList.toggle('access-text-spacing', textSpacing);
    html.style.setProperty('--access-line-height', lineHeight === 'relaxed' ? '1.75' : lineHeight === 'loose' ? '2' : 'normal');
    return () => {
      html.classList.remove('access-highlight-links', 'access-large-cursor', 'access-dark-mode', 'access-invert-colors', 'access-text-spacing');
      html.style.removeProperty('--access-line-height');
    };
  }, [darkMode, highlightLinks, invertColors, largeCursor, lineHeight, textSpacing]);

  useEffect(() => {
    document.documentElement.classList.toggle('tts-reading-mode', ttsEnabled);
    const stopSpeech = () => {
      window.speechSynthesis?.cancel();
      highlightedElement.current?.classList.remove('tts-highlight');
      highlightedElement.current = null;
    };

    if (!ttsEnabled || !('speechSynthesis' in window)) {
      stopSpeech();
      return;
    }

    const supportedSelector = 'h1, h2, h3, h4, h5, h6, p, label, td, th, li, button, a, [role="alert"], [role="status"], [data-tts-card]';
    const isVisible = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target || target.closest('[role="dialog"], svg, img, script, style')) return;

      const element = target.closest(supportedSelector) as HTMLElement | null;
      if (!element || !isVisible(element)) return;

      const text = element.innerText.trim();
      if (!text) return;

      stopSpeech();
      element.classList.add('tts-highlight');
      highlightedElement.current = element;

      const utterance = new SpeechSynthesisUtterance(text);
      const finish = () => {
        element.classList.remove('tts-highlight');
        if (highlightedElement.current === element) highlightedElement.current = null;
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stopSpeech();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      stopSpeech();
      document.documentElement.classList.remove('tts-reading-mode');
    };
  }, [location.pathname, ttsEnabled]);

  const resetAll = () => {
    window.speechSynthesis?.cancel();
    resetAccessibility();
    setLineHeight('normal');
    setTextSpacing(false);
    setHighlightLinks(false);
    setLargeCursor(false);
    setDarkMode(false);
    setInvertColors(false);
    setTtsEnabled(false);
  };

  const cards = [
    { label: t('Text to Speech', 'टेक्स्ट टू स्पीच'), icon: Volume2, active: ttsEnabled, onClick: () => setTtsEnabled(value => !value) },
    { label: t('Increase Text Size', 'टेक्स्ट आकार बढ़ाएं'), icon: ZoomIn, onClick: increaseFontSize },
    { label: t('Decrease Text Size', 'टेक्स्ट आकार घटाएं'), icon: ZoomOut, onClick: decreaseFontSize },
    { label: t('Line Height', 'लाइन ऊंचाई'), icon: AlignVerticalSpaceAround, active: lineHeight !== 'normal', onClick: () => setLineHeight(value => value === 'normal' ? 'relaxed' : value === 'relaxed' ? 'loose' : 'normal') },
    { label: t('Highlight Links', 'लिंक हाइलाइट करें'), icon: Link2, active: highlightLinks, onClick: () => setHighlightLinks(value => !value) },
    { label: t('Text Spacing', 'टेक्स्ट स्पेसिंग'), icon: TextCursorInput, active: textSpacing, onClick: () => setTextSpacing(value => !value) },
    { label: t('Cursor Settings', 'कर्सर सेटिंग्स'), icon: MousePointer2, active: largeCursor, onClick: () => setLargeCursor(value => !value) },
    { label: t('Light/Dark Mode', 'लाइट/डार्क मोड'), icon: SunMoon, active: darkMode, onClick: () => setDarkMode(value => !value) },
    { label: t('Invert Colors', 'रंग उलटें'), icon: Contrast, active: invertColors, onClick: () => setInvertColors(value => !value) },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={t('Accessibility Menu', 'अभिगम्यता मेनू')}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">{t('Accessibility Menu', 'अभिगम्यता मेनू')}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white" aria-label={t('Close menu', 'मेनू बंद करें')}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ label, icon: Icon, active, onClick }) => (
            <button key={label} onClick={onClick} aria-pressed={active} aria-label={`${label}${active ? ' - On' : ' - Off'}`} className={`flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border p-4 text-center transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${active ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white'}`}>
              <Icon className="h-8 w-8 text-black" strokeWidth={1.8} aria-hidden="true" />
              <span className="text-sm font-bold text-slate-900">{label}</span>
            </button>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button onClick={resetAll} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            {t('Reset All Settings', 'सभी सेटिंग्स रीसेट करें')}
          </button>
        </div>
      </div>
    </div>
  );
};

