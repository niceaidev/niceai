import { NestFastifyApplication } from '@nestjs/platform-fastify';

export async function bootstrap(
  app: NestFastifyApplication,
): Promise<NestFastifyApplication> {
  app.enableCors();
  return app;
}
