import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '../config';
import Ioredis from 'ioredis';
import { DefaultQueueConsumer } from './consumers/queue.consumer';
import { CacheQueueConsumer } from './consumers/cache.consumer';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: new Ioredis(configService.queueUrl, {
          maxRetriesPerRequest: null,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DefaultQueueConsumer, CacheQueueConsumer],
})
export class QueueModule {}
