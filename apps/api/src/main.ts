import {
  INestApplication,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { bootstrap } from './app';
import { AppModule } from './app.module';

const pinoLogger = new PinoLogger({});

const prefix = '/api';

const run = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL],
  });

  try {
    app.setGlobalPrefix(prefix);
    await bootstrap(app);
    const port = app.get(ConfigService).get('api.port', { infer: true });
    const url = `http://localhost:${port}`;
    generateSwagger(app, url);
    await app.listen(port, '0.0.0.0');
    console.log(`Application started on: ${url} `);
  } catch (error) {
    pinoLogger.error(error);
  }
};

run().catch((e) => {
  pinoLogger.error(e);
  process.exit(1);
});

async function generateSwagger(app: INestApplication, server: string) {
  const config = new DocumentBuilder()
    .setTitle('Nice AI')
    .addServer(server)
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
