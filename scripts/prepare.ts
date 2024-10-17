import { spawnSync } from './internal/utils';
import { PATHS } from './internal/constants';

(async () => {
  const args = process.argv.slice(2);

  // filter
  if (!args.includes('--filter')) {
    // Tips: should use double quotes, single quotes are not valid on windows.
    args.unshift('--filter', `"./packages/*"`);
  }

  if (process.env.VERCEL) {
    args.unshift('--force');
  }

  args.unshift('--output-logs', 'errors-only');

  const command = `turbo run ${args.join(' ')} build`;

  spawnSync(command, { cwd: PATHS.ROOT });
})();
