import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

/**
 *
 * @param app
 * @param server
 */
export function generateSwagger(app: INestApplication, server: string) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const config = new DocumentBuilder()
    .setTitle('Nice AI')
    .setVersion('0.1.0')
    .addServer(server)
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory(_controllerKey, methodKey) {
      return `${methodKey}`;
    },
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs.json',
  });
}
