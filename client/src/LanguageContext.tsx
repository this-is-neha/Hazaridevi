import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';
import type { Language } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof translations.ne;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hamesha Nepali ('ne') se shuru hoga jab tak user khud click na kare
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('hz_lang') as Language;
    return saved === 'en' ? 'en' : 'ne';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('hz_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'ne' ? 'en' : 'ne');
  };

  const t = translations[lang] || translations.ne;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within LanguageProvider');
  }
  return context;
};