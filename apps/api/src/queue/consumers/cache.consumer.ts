import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CACHE_QUEUE_NAME } from '../constant';
import { CacheService } from '../../cache';
import { Logger } from '@nestjs/common';

@Processor(CACHE_QUEUE_NAME)
export class CacheQueueConsumer extends WorkerHost {
  private logger: Logger = new Logger(CacheQueueConsumer.name);

  constructor(private readonly cache: CacheService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`job: ${job.name}, data: ${JSON.stringify(job.data)}`);
    if (job.name === 'refresh_config') {
      await this.cache.del(job.data.cacheKey);
    }
  }
}
