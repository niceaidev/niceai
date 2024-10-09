import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import { vercelPreset } from '@vercel/remix/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { flatRoutes } from 'remix-flat-routes';
import { remixDevTools } from 'remix-development-tools';
import { i18nAlly } from 'vite-plugin-i18n-ally';
import { remixFlatRoutes } from 'vite-plugin-remix-flat-routes';

installGlobals();

const ignoredRouteFiles = [
  '**/components/**',
  '**/hooks/**',
  '**/images/**',
  '**/utils/**',
  '**/*.css',
  '**/meta.*',
];

export default defineConfig({
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
  },
  plugins: [
    i18nAlly({
      namespace: true,
      localesPaths: ['./app/i18n/locales'],
    }),
    remixDevTools(),
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles,
      routes: async r => flatRoutes('routes', r),
    }),
    remixFlatRoutes({
      flatRoutesOptions: {
        ignoredRouteFiles,
      },
    }),
    tsconfigPaths(),
  ],
});
