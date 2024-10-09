import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserTasksService } from '../jobs/user-tasks.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserTasksService],
  exports: [AuthService],
})
export class AuthModule {}
