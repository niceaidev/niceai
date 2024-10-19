import { PassThrough } from 'node:stream';
import type { EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { renderToPipeableStream } from 'react-dom/server';
import { antdStyle } from './components/antd/const';
import { createInstance } from 'i18next';
import i18nServer, { i18nServerOptions } from './i18n/i18next.server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { i18nOptions } from './i18n';

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const isBot = isbot(request.headers.get('user-agent'));

  const callbackName = isBot ? 'onAllReady' : 'onShellReady';

  const i18nInstance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext)


  await i18nInstance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .init({
      ...i18nServerOptions, // spread the configuration
      lng, // The locale we detected above
      ns,
      resources: i18nOptions.resources,
    });

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const cache = createCache();
    let isStyleExtracted = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider
        i18n={i18nInstance}
        defaultNS={i18nServerOptions.defaultNS}
      >
        <StyleProvider cache={cache}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </StyleProvider>
      </I18nextProvider>,
      {
        [callbackName]: () => {
          shellRendered = true;
          const body = new PassThrough({
            transform(c, _, callback) {
              let chunk = String(c);
              if (!isStyleExtracted) {
                if (chunk.includes(antdStyle)) {
                  chunk = chunk.replace(
                    antdStyle,
                    isBot ? '' : extractStyle(cache),
                  );
                  isStyleExtracted = true;
                }
              }
              callback(null, chunk);
            },
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set('Content-Type', 'text/html');
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
