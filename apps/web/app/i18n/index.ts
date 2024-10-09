import { type AgnosticRouteObject, matchRoutes } from '@remix-run/router';
import { routes } from 'virtual:remix-flat-routes';

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
const defaultNS = ['common'];

export const i18nOptions = {
  fallbackLng,
  defaultNS,
  nsSeparator: '.',
  keySeparator: '.',
};

export default config;

export function resolveNamespace(
  pathname = window.location.pathname,
): string[] {
  let r: any[] | null = matchRoutes(routes as AgnosticRouteObject[], pathname);
  if (!r) return defaultNS;
  console.log(r);
  r = r.map(route => route.route.handle);
  console.log(r);
  r = r.filter(t => t?.i18n);
  console.log(r);
  r = r.map(t => t.i18n);
  console.log(r);
  r = r.flat();
  console.log(r);
  r = r.concat(defaultNS);
  console.log(r);
  return r;
}
