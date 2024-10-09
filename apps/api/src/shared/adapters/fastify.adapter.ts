import compression from '@fastify/compress';
import helmet, { type FastifyHelmetOptions } from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { disableHSTS, RPC_MAX_PACKAGE_SIZE } from '../common/constants';

export async function createFastifyAdapter() {
  const fastifyAdapter = new FastifyAdapter({
    logger: false,
    bodyLimit: RPC_MAX_PACKAGE_SIZE,
  });
  await fastifyAdapter.register(fastifyMultipart);
  // register helmet in fastify to avoid conflict with swagger
  const helmetOptions: FastifyHelmetOptions = {
    // update script-src to be compatible with swagger
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': [],
      },
    },
  };

  if (disableHSTS) {
    helmetOptions.hsts = false;
  }
  await fastifyAdapter.register(helmet, helmetOptions);
  await fastifyAdapter.register(compression, {
    encodings: ['gzip', 'deflate'],
  });
  return fastifyAdapter;
}
