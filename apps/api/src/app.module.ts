import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app';
import { AccountModule } from './modules/account';
import { ApplicationModule } from './modules/app';
import { AuthModule } from './modules/auth';
import { DatasetModule } from './modules/dataset';
import { DrizzleModule } from './modules/drizzle';
import { FileModule } from './modules/file';
import { ModelModule } from './modules/model';
import { ProviderModule } from './modules/provider';
import { TaskModule } from './modules/task';
import { ToolModule } from './modules/tool';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig],
    }),
    LoggerModule.forRoot({
      forRoutes: ['*'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mongo'),
        lazyConnection: true,
      }),
    }),
    DrizzleModule.forRoot(),
    AuthModule,
    DatasetModule,
    ModelModule,
    TaskModule,
    ProviderModule,
    AccountModule,
    ToolModule,
    FileModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {}
}
