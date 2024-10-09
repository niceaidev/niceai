import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  type OnModuleInit,
} from '@nestjs/common';

import { NiceAIModule } from './modules/niceai.module';
import { LoggerModule } from './core/logger';

@Module({
  imports: [LoggerModule.forRoot({ global: true }), NiceAIModule],
})
export class RootModule implements OnModuleInit, NestModule {
  onModuleInit() {}

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
