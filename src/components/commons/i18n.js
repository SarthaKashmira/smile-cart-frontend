import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "translations/en.json";
// here I am binding initReactI18next to i18n and then initializing
// This ensures that various components of the react-i18next will have access
// to the i18n instance which is required for translation.
i18n.use(initReactI18next).init({
  //resiource takes an object where each key represents a language code,
  // and the corresponding value is an object that contains translations for that language.
  // The fallbackLng option ensures fallback to a language in case the translation is missing for a specific language.
  // We will be setting it to en.
  resources: { en: { translation: en } },
  fallbackLng: "en",
});

export default i18n;
