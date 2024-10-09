import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL');
}

const nonPoolingUrl = process.env.DATABASE_URL;

const config: Config = {
  schema: './src/database/schemas/*',
  dialect: 'postgresql',
  dbCredentials: { url: nonPoolingUrl },
};

export default config;
