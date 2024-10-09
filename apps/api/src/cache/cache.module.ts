import { Global, Module } from '@nestjs/common';
import Ioredis, { type RedisOptions } from 'ioredis';
import { BullModule } from '@nestjs/bullmq';

import { ConfigService } from '../config/config.service';
import { CacheService } from './cache.service';
import { CACHE_QUEUE_NAME } from '../queue/constant';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: CACHE_QUEUE_NAME,
    }),
  ],
  providers: [
    {
      provide: CacheService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const opts: RedisOptions = {
          lazyConnect: true,
        };
        const redis = new Ioredis(configService.redisUrl, opts);
        return new CacheService(redis, { prefix: 'cache_' });
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
