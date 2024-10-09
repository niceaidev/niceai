import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@remix-run/react';

export function useLocale() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [locale, setLocale] = useState(lang);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // fetch('/action/set-locale', {
    //   method: 'POST',
    //   body: JSON.stringify({ locale: lang }),
    // })
    if (lang !== locale) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', lang);
      navigate(`${url.pathname}${url.search}`);
      setLocale(lang);
    }
  }, [i18n.language]);

  return [
    locale,
    (locale: string) => {
      i18n.changeLanguage(locale);
    },
  ] as const;
}
