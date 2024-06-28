import baseConfig, { restrictEnvAccess } from '@niceai/eslint-config/base';
import nextjsConfig from '@niceai/eslint-config/nextjs';
import reactConfig from '@niceai/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
