import { sync as rimrafSync } from 'rimraf';
import path from 'node:path';
import { PATHS } from './internal/constants';

(async () => {
  console.log('Cleaning...');
  const dirs = ['.turbo', 'dist', '.vercel', 'build'];
  const paths = path.join(PATHS.ROOT, '**', `{${dirs.join(',')}}`);
  rimrafSync(paths, {
    glob: {
      ignore: ['**/node_modules/**'],
    },
  });
  console.log('Cleaned');
})();
