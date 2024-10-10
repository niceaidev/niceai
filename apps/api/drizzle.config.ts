import type { Config } from 'drizzle-kit';
import assert from 'node:assert';

const connectionString = process.env.DATABASE_URL;

assert(
  connectionString,
  '`DATABASE_URL` or `DATABASE_URL` not found in environment',
);

const config: Config = {
  schema: './src/database/schemas/*',
  dialect: 'postgresql',
  out: './src/database/migrations',
  strict: true,
  dbCredentials: { url: connectionString },
};

export default config;
