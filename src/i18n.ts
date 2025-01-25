import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const languages = ["en", "ar"];
i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: languages[1],
  debug: false,
  supportedLngs: languages,
});

export default i18n;
