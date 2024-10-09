import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Options, pinoHttp } from 'pino-http';

import { createProvidersForDecorated } from './inject-pino-logger';
import { Logger } from './logger';
import {
  LoggerModuleAsyncParams,
  Params,
  PARAMS_PROVIDER_TOKEN,
} from './params';
import { PinoLogger } from './pino-logger';
import { storage, Store } from './storage';

const DEFAULT_ROUTES = [{ path: '*', method: RequestMethod.ALL }];

@Module({ providers: [Logger], exports: [Logger] })
export class LoggerModule implements NestModule {
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) private readonly params: Params) {}

  static forRoot(params?: Params | undefined): DynamicModule {
    const paramsProvider: Provider<Params> = {
      provide: PARAMS_PROVIDER_TOKEN,
      useValue: params || {},
    };

    const decorated = createProvidersForDecorated();

    return {
      module: LoggerModule,
      global: params?.global,
      providers: [Logger, ...decorated, PinoLogger, paramsProvider],
      exports: [Logger, ...decorated, PinoLogger, paramsProvider],
    };
  }

  static forRootAsync(params: LoggerModuleAsyncParams): DynamicModule {
    const paramsProvider: Provider<Params | Promise<Params>> = {
      provide: PARAMS_PROVIDER_TOKEN,
      useFactory: params.useFactory,
      inject: params.inject,
    };

    const decorated = createProvidersForDecorated();

    const providers: any[] = [
      Logger,
      ...decorated,
      PinoLogger,
      paramsProvider,
      ...(params.providers || []),
    ];

    return {
      module: LoggerModule,
      imports: params.imports,
      providers,
      global: params.global,
      exports: [Logger, ...decorated, PinoLogger, paramsProvider],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    const {
      exclude,
      forRoutes = DEFAULT_ROUTES,
      pinoHttp,
      useExisting,
    } = this.params;

    const middlewares = createLoggerMiddlewares(pinoHttp || {}, useExisting);

    if (exclude) {
      consumer
        .apply(...middlewares)
        .exclude(...exclude)
        .forRoutes(...forRoutes);
    } else {
      consumer.apply(...middlewares).forRoutes(...forRoutes);
    }
  }
}

function createLoggerMiddlewares(
  params: NonNullable<Params['pinoHttp']>,
  useExisting = false,
) {
  if (useExisting) {
    return [bindLoggerMiddlewareFactory(useExisting)];
  }

  console.log('params', params);
  const middleware = pinoHttp({
    ...(params as Options),
  });

  // @ts-expect-error: root is readonly field, but this is the place where
  // it's set actually
  PinoLogger.root = middleware.logger;

  // FIXME: params type here is pinoHttp.Options | pino.DestinationStream
  // pinoHttp has two overloads, each of them takes those types
  return [middleware, bindLoggerMiddlewareFactory(useExisting)];
}

function bindLoggerMiddlewareFactory(useExisting: boolean) {
  return function bindLoggerMiddleware(
    req: FastifyRequest['raw'],
    _res: FastifyReply['raw'],
    next: () => void | Promise<void>,
  ) {
    let log = req.log;

    if (!useExisting && req.allLogs) {
      log = req.allLogs[req.allLogs.length - 1]!;
    }

    // be called without arguments
    storage.run(new Store(log), next);
  };
}
