import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActiveLanguage } from '../types/telemetry';
import { translations, TranslationsSchema } from './translations';
import { antigravityController } from '../store/antigravity-controller';

interface LanguageContextValue {
  language: ActiveLanguage;
  setLanguage: (lang: ActiveLanguage) => void;
  t: TranslationsSchema;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<ActiveLanguage>(() => antigravityController.activeLanguage);

  useEffect(() => {
    // Sync with AntigravityController singleton
    const unsubscribe = antigravityController.subscribe((state) => {
      setLanguageState(state.activeLanguage);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const isArabic = language === 'ar';
    const direction = isArabic ? 'rtl' : 'ltr';

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', direction);
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const setLanguage = (newLang: ActiveLanguage) => {
    antigravityController.setActiveLanguage(newLang);
    setLanguageState(newLang);
  };

  const isRTL = language === 'ar';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';
  const t = translations[language] || translations.de;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
