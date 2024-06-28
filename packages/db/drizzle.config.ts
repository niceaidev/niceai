import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL');
}

export default {
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;
