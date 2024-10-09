#!/usr/bin/env node

import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import assert from 'node:assert';
import chalk from 'chalk';
import { sync } from 'cross-spawn';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argv = process.argv.slice(2);
const [name = '', ...throughArgs] = argv;
const scriptsPath = join(__dirname, `../${name}.ts`);

assert(
  existsSync(scriptsPath) && !name.startsWith('.'),
  `Executed script '${chalk.red(name)}' does not exist`,
);

console.log(chalk.cyan(`niceai-scripts: ${name}\n`));

const scriptPathAsStr = JSON.stringify(scriptsPath);
const spawn = sync('tsx', [scriptPathAsStr, ...throughArgs], {
  env: {
    ...process.env,
    NODE_NO_WARNINGS: '1',
  },
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});
if (spawn.status !== 0) {
  console.log(chalk.red(`niceai-scripts: ${name} execute fail`));
  process.exit(1);
}
