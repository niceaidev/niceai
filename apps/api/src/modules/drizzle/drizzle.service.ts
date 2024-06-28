import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { DrizzleAsyncProvider, DrizzleClient } from './drizzle.provider';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  constructor(
    @Inject(DrizzleAsyncProvider)
    readonly db: DrizzleClient,
  ) {}

  onModuleDestroy() {
    console.log('DrizzleService destroyed');
  }
}
