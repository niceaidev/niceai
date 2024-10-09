import { PATHS } from './internal/constants';
import * as rimraf from 'rimraf';
import path from 'node:path';

(async () => {
  console.log('Cleaning...');
  const paths = path.join(PATHS.ROOT, '**', '{.turbo,dist,.vercel,build}');
  rimraf.sync(paths, {
    glob: true,
  });
  console.log('Cleaned');
})();
