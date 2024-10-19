import en from './locales/en';
import zh from './locales/zh';

const config = {
  // This is the list of languages your application supports
  supportedLngs: ['en', 'zh'],
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: 'en',
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: 'common',
  // Disabling suspense is recommended
  react: { useSuspense: false },
  interpolation: {
    escapeValue: false,
  },
};

const fallbackLng = 'en';
const defaultNS = ['translation'];
const languages = ['es', 'en'] as const

export const i18nOptions = {
  fallbackLng,
  defaultNS,
  languages,
  nsSeparator: '.',
  keySeparator: '.',
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
};

export default config;
