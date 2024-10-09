import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      cli: 'src/node/cli.ts',
      index: 'src/node/index.ts',
    },
    minifyIdentifiers: false,
    bundle: true,
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: true,
    minify: process.env.NODE_ENV === 'production',
    skipNodeModulesBundle: true,
    outDir: 'dist/node',
    shims: true,
    clean: true,
  },
]);
