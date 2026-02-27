import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { uz } from './locales/uz';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            ru,
            uz
        },
        lng: "ru", // Default to Russian as requested
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
