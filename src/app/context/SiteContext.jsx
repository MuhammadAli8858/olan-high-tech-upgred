import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { UI_TEXT } from '../data/siteData.js';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('olan-language') || 'ru');
  const [theme, setTheme] = useState(() => localStorage.getItem('olan-theme') || 'dark');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('olan-user') || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('olan-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('olan-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('olan-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('olan-user');
    }
  }, [user]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    user,
    setUser,
    text: UI_TEXT[language] || UI_TEXT.ru,
    logout: () => setUser(null),
  }), [language, theme, user]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return context;
}
