import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from '../auth';
import { CacheModule } from '../cache';
import { ConfigModule } from '../config';
import { DatabaseModule } from '../database';
import { AccountModule } from './account';
import { AppModule } from './app';
import { FileModule } from './file';
import { HealthModule } from './health';
import { ModelModule } from './model';
import { ProviderModule } from './provider';
import { TaskModule } from './task';
import { ToolModule } from './tool';
import { UserModule } from './user';
import { QueueModule } from '../queue';
import { PluginModule } from './plugins';

@Module({
  imports: [
    ConfigModule,
    QueueModule,
    CacheModule,
    UserModule,
    ScheduleModule.forRoot(),
    DatabaseModule.forRoot({ logger: true }),
    AuthModule,
    ModelModule,
    TaskModule,
    ProviderModule,
    AccountModule,
    ToolModule,
    FileModule,
    AppModule,
    HealthModule,
    PluginModule,
  ],
})
export class NiceAIModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //
  }
}
