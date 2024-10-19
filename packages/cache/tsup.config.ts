import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  splitting: true,
  minify: false,
  noExternal: ['superjson'],
});
