import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createFastifyAdapter } from './shared/adapters';
import { RootModule } from './root.module';
import { generateSwagger } from './swagger';

const prefix = '/api';

export class NiceAI {
  protected static _this: NiceAI;
  public readonly port: string;
  protected config: any;
  protected readonly app: NestFastifyApplication;

  constructor(app: NestFastifyApplication) {
    this.app = app;
    process.env.PORT = process.env.PORT || '3001';
    this.port = process.env.PORT;
  }

  static async init() {
    const now = Date.now();
    const fastifyAdapter = await createFastifyAdapter();
    const nestApp = await NestFactory.create<NestFastifyApplication>(
      RootModule,
      fastifyAdapter,
    );
    const app = new NiceAI(nestApp);
    await app.init();
    app.initSwagger();
    console.log(
      `Application started on: ${app.url()} in ${Date.now() - now}ms`,
    );
    return app;
  }

  public url() {
    return `http://localhost:${this.port}`;
  }

  async init() {
    this.app.setGlobalPrefix(prefix);
    this.app.enableVersioning({
      type: VersioningType.HEADER,
      defaultVersion: [VERSION_NEUTRAL],
      header: 'v',
    });
    this.app.enableCors();
    this.app.flushLogs();
    await this.app.init();
    return this;
  }

  async run() {
    await this.app.listen(this.port, '0.0.0.0');
  }

  initSwagger() {
    generateSwagger(this.app, this.url());
  }
}

export default NiceAI;
