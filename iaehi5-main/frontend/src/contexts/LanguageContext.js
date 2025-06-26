import React, { createContext, useState, useContext, useEffect } from "react";
import translations from "../translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    localStorage.setItem("language", language);
    setT(translations[language]);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
