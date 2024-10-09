import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME } from '../constant';
import { CacheService } from '../../cache';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAME)
export class DefaultQueueConsumer extends WorkerHost {
  private logger: Logger = new Logger(DefaultQueueConsumer.name);

  constructor(private readonly cache: CacheService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(job.name, job.data);
  }
}
