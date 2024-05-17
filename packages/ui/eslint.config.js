import baseConfig from "@niceai/eslint-config/base";
import reactConfig from "@niceai/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
