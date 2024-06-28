import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CONFIG_OPTIONS } from './constant';
import { DrizzleAsyncProvider, DrizzleProvider } from './drizzle.provider';
import { DrizzleService } from './drizzle.service';

interface DrizzleModuleOptions {}

@Module({
  imports: [],
  exports: [],
})
export class DrizzleModule implements OnApplicationShutdown {
  static forRoot(options: DrizzleModuleOptions = {}): DynamicModule {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        DrizzleProvider,
        DrizzleService,
        ConfigService,
      ],
      global: true,
      exports: [DrizzleService, DrizzleAsyncProvider],
    };
  }

  async onApplicationShutdown(): Promise<void> {}
}
