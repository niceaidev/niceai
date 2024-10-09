import { RemixI18Next } from 'remix-i18next/server';
import i18n, { i18nOptions } from '../i18n';
import createCookie from '~/lib/cookie';
import { Cookie } from '@remix-run/server-runtime';
import { cookieName, cookieOptions } from './i18next.cookie';
import { resources } from 'virtual:i18n-ally-resource';

export const localeCookie = createCookie(cookieName, cookieOptions);

export function createLocaleCookieResolver(localeCookie: Cookie) {
  const resolver = async (request: Request) => {
    const cookie = await localeCookie.parse(request.headers.get('Cookie'));

    return {
      getLocale: () => {
        return cookie || i18n.fallbackLng;
      },
      setLocale: async (locale: string) => {
        return {
          'Set-Cookie': await localeCookie.serialize(locale),
        };
      },
    };
  };
  return resolver;
}

const supportedLngs = Object.keys(resources);

export const i18nServerOptions = {
  ...i18nOptions,
  supportedLngs,
  resources,
};

export const i18nServer = new RemixI18Next({
  detection: {
    supportedLanguages: i18nServerOptions.supportedLngs,
    fallbackLanguage: i18nServerOptions.fallbackLng,
    cookie: localeCookie,
  },
  i18next: {
    ...i18nServerOptions,
    interpolation: {
      escapeValue: false,
    },
  },
});

export default i18nServer;
