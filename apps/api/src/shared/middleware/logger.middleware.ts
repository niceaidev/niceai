import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  async use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void | Promise<void>,
  ) {
    const start = Date.now();
    res.setHeader('Powered-By', 'Nice AI');
    await next();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`Request processed in ${duration}ms`);
    });
  }
}
