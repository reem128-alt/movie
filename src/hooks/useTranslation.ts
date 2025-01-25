import { useCookies } from "react-cookie";
import { useTranslation as useTrans } from "react-i18next";
export const useTranslation = () => {
  const [t, i18n] = useTrans();
  const [, setCookies] = useCookies(["i18next"]);

  const toggle = () => {
    if (i18n.language == "ar") {
      i18n.changeLanguage("en");
      setCookies("i18next", "en");
    } else {
      i18n.changeLanguage("ar");
      setCookies("i18next", "ar");
    }
  };
  return {
    t,
    i18n,
    currentLanguage: i18n.resolvedLanguage,
    toggle,
  };
};
