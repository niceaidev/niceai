import en from './locales/en/common.json';
import zh from './locales/zh/common.json';

const languages = ['en', 'zh'] as const;
export const supportedLanguages = [...languages];
export type Language = (typeof languages)[number];

export type Resource = {
  common: typeof en;
};

export const resources: Record<Language, Resource> = {
  en: {
    common: en,
  },
  zh: {
    common: zh,
  },
};

export const returnLanguageIfSupported = (
  lang?: string,
): Language | undefined => {
  if (supportedLanguages.includes(lang as Language)) {
    return lang as Language;
  }
  return undefined;
};
