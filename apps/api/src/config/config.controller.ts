import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { assign, camelCase } from 'lodash';

import { DatabaseService } from '../database';
import { CacheService } from '../cache';
import { ConfigService } from './config.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CACHE_QUEUE_NAME } from '../queue/constant';

@Controller('config')
@ApiTags('Config')
export class ConfigController {
  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
    private readonly config: ConfigService,
    @InjectQueue(CACHE_QUEUE_NAME) private cacheQueue: Queue,
  ) {
    //
  }

  @Get('version')
  version() {
    return {
      version: this.config.version,
    };
  }

  @Get('all')
  async all() {
    return this.cache.remember(
      'config_all',
      async () => {
        const res = await this.db.query.config.findMany({
          columns: {
            name: true,
            value: true,
          },
        });
        const tryJsonParse = (str: string) => {
          try {
            return JSON.parse(str);
          } catch (e) {
            return str;
          }
        };
        return res.reduce((acc, { name, value }) => {
          assign(acc, { [camelCase(name)]: tryJsonParse(value) });
          return acc;
        }, {});
      },
      60,
    );
  }

  @Get('refresh')
  async refresh() {
    await this.cacheQueue.add('refresh_config', {
      time: Date.now(),
      cacheKey: 'config_all',
    });
    return {
      status: 'ok',
    };
  }
}
