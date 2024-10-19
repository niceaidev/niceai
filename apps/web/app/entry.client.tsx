import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { i18nOptions } from './i18n';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { getInitialNamespaces } from 'remix-i18next/client'

async function hydrate() {
  await i18next
  .use(initReactI18next) // Initialize `react-i18next`.
  .use(I18nextBrowserLanguageDetector) // Setup client-side language detector.
  .init({
    ...i18nOptions,
    ns: getInitialNamespaces(),
    detection: {
      // Enable HTML tag detection only by detecting the language server-side.
      // Using `<html lang>` attribute to communicate the detected language to the client.
      order: ['htmlTag'],
      // Since we solely utilize htmlTag, browser language caching is unnecessary.
      caches: [],
    },
  })

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <RemixBrowser />
        </StyleProvider>
      </I18nextProvider>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
