'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supportedLanguages, defaultLanguage } from '../utils/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(defaultLanguage);

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('civislaw-language');
      if (savedLanguage && supportedLanguages.some(l => l.code === savedLanguage)) {
        setLanguage(savedLanguage);
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (supportedLanguages.some(l => l.code === browserLang)) {
          setLanguage(browserLang);
        }
      }
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && language) {
      localStorage.setItem('civislaw-language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = supportedLanguages.find(l => l.code === language)?.direction || 'ltr';
    }
  }, [language]);

  const changeLanguage = (newLang) => {
    if (supportedLanguages.some(l => l.code === newLang)) {
      setLanguage(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook to get translations
export function useTranslation() {
  const { language } = useLanguage();
  
  const translate = (keyPath, fallback = '') => {
    // Dynamic import to avoid circular dependency
    if (typeof window !== 'undefined') {
      const { t } = require('../utils/i18n');
      return t(keyPath, language) || fallback;
    }
    return fallback;
  };

  return { language, t: translate };
}
