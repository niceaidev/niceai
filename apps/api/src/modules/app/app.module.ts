import { Module } from '@nestjs/common';

import { ApplicationController } from './app.controller';
import { ApplicationService } from './app.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
