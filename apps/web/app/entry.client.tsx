import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { i18nOptions, resolveNamespace } from './i18n';
import { i18nAlly } from 'vite-plugin-i18n-ally/client';

const i18nChangeLanguage = i18next.changeLanguage;

async function hydrate() {
  const { asyncLoadResource } = i18nAlly({
    namespaces: [...resolveNamespace()],
    fallbackLng: i18nOptions.fallbackLng,
    async onInit({ language }) {
      await i18next.use(initReactI18next).init({
        lng: language,
        resources: {},
        fallbackLng: i18nOptions.fallbackLng,
        keySeparator: i18nOptions.keySeparator,
        nsSeparator: i18nOptions.nsSeparator,
        ns: [...resolveNamespace()],
        debug: import.meta.env.DEV,
      });
    },
    onResourceLoaded(resource, { language, namespace }) {
      i18next.addResourceBundle(language, namespace, resource);
    },
    onInited: () => {
      startTransition(() => {
        hydrateRoot(
          document,
          <I18nextProvider i18n={i18next} defaultNS={i18nOptions.defaultNS}>
            <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
              <RemixBrowser />
            </StyleProvider>
          </I18nextProvider>,
        );
      });
    },
    detection: [
      {
        detect: 'htmlTag',
      },
    ],
  });

  i18next.changeLanguage = async (lng?: string, ...args) => {
    await asyncLoadResource(lng || i18next.language, {
      namespaces: [...resolveNamespace()],
    });
    console.log(lng, ...args);
    return i18nChangeLanguage(lng, ...args);
  };

  window.asyncLoadResource = asyncLoadResource;
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
