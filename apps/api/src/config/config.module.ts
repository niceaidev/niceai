import { Global, Module } from '@nestjs/common';

import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { BullModule } from '@nestjs/bullmq';
import { CACHE_QUEUE_NAME } from '../queue/constant';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: CACHE_QUEUE_NAME,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
  controllers: [ConfigController],
})
export class ConfigModule {}
