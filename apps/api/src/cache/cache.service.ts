import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CacheService as CacheStoreService } from '@niceai/cache/node';
import { type Redis } from 'ioredis';

@Injectable()
export class CacheService
  extends CacheStoreService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(redis: Redis, opts: { prefix?: string } = {}) {
    super(redis, opts);
  }

  async onModuleInit() {
    await this.cache.connect();
  }

  onModuleDestroy() {
    this.cache.disconnect();
  }
}
