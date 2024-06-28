import { Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from './schemas';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';
export type DrizzleClient = NodePgDatabase<typeof schema>;

export const DrizzleProvider: Provider = {
  provide: DrizzleAsyncProvider,
  inject: [],
  useFactory: async () => {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    return db;
  },
};
