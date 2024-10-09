import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserTasksService {
  private readonly logger = new Logger(UserTasksService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    //
  }
}
