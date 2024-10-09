import postgres from 'postgres';
import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';
import { PgDatabase } from 'drizzle-orm/pg-core/db';
import * as schemas from './schemas';
import {
  PostgresJsQueryResultHKT,
  PostgresJsSession,
} from 'drizzle-orm/postgres-js';
import { PgDialect } from 'drizzle-orm/pg-core/dialect';
import { DefaultLogger, Logger } from 'drizzle-orm/logger';
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  ExtractTablesWithRelations,
  RelationalSchemaConfig,
} from 'drizzle-orm/relations';
import { DrizzleConfig } from 'drizzle-orm/utils';
import { DatabaseModuleOptions } from './constant';

type TSchema = typeof schemas;

const createDrizzle = (url: string, opts: DatabaseModuleOptions) => {
  const config: DrizzleConfig<TSchema> = {
    schema: schemas,
    logger: opts.logger,
  };
  const transparentParser = (val: any) => val;
  const client = postgres(url, {
    idle_timeout: 3000,
  });

  // Override postgres.js default date parsers: https://github.com/porsager/postgres/discussions/761
  for (const type of ['1184', '1082', '1083', '1114']) {
    client.options.parsers[type as any] = transparentParser;
    client.options.serializers[type as any] = transparentParser;
  }
  client.options.serializers['114'] = transparentParser;
  client.options.serializers['3802'] = transparentParser;

  const dialect = new PgDialect();
  let logger: Logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }

  let schema:
    | RelationalSchemaConfig<ExtractTablesWithRelations<TSchema>>
    | undefined;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers,
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables as ExtractTablesWithRelations<TSchema>,
      tableNamesMap: tablesConfig.tableNamesMap,
    };
  }

  const session = new PostgresJsSession(client, dialect, schema, { logger });
  return {
    dialect,
    session,
    schema,
    client,
  };
};

@Injectable()
export class DatabaseService extends PgDatabase<
  PostgresJsQueryResultHKT,
  TSchema
> {
  public readonly schema: TSchema = schemas;
  public readonly pg: postgres.Sql;

  constructor(configService: ConfigService, opts: DatabaseModuleOptions) {
    const { dialect, session, schema, client } = createDrizzle(
      configService.databaseUrl,
      opts,
    );
    super(dialect, session, schema);
    this.pg = client;
  }

  static create(configService: ConfigService, opts: DatabaseModuleOptions) {
    return new DatabaseService(configService, opts);
  }

  notify(channel: string, payload: string) {
    this.pg.notify(channel, payload);
  }

  listen(channel: string, callback: (payload: string) => void) {
    this.pg.listen(channel, callback);
  }
}
