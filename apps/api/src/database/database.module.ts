import { type DynamicModule, Module, OnModuleInit } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { DatabaseService } from './database.service';
import { DatabaseModuleOptions } from './constant';

@Module({})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    const { logger = false, timeout = 3000 } = options;
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DatabaseService,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            DatabaseService.create(configService, {
              logger,
              timeout,
            }),
        },
      ],
      global: true,
      exports: [DatabaseService],
    };
  }

  async onModuleInit() {
    // console.log("DatabaseModule initialized", this.db.pg.options.connection);
  }
}
