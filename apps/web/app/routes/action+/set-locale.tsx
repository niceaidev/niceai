import { type ActionFunction, json } from '@remix-run/node';
import i18nOptions from '../../i18n';
import {
  createLocaleCookieResolver,
  localeCookie,
} from '../../i18n/i18next.server';

export const action: ActionFunction = async ({ request }) => {
  const localeResolver = createLocaleCookieResolver(localeCookie);
  const cookie = await localeResolver(request);
  const { locale } = (await request.json()) as { locale: string };
  return json(
    {},
    {
      headers: await cookie.setLocale(locale || i18nOptions.fallbackLng),
    },
  );
};
