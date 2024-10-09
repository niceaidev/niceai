import { Injectable } from '@nestjs/common';
import { version } from '../../package.json';

@Injectable()
export class ConfigService {
  public readonly databaseUrl: string;
  public readonly port: number = 3001;
  public readonly version = version;
  public readonly redisUrl: string;
  public readonly queueUrl: string;

  constructor() {
    this.databaseUrl = process.env.DATABASE_URL;
    this.redisUrl = process.env.REDIS_URL;
    this.queueUrl = process.env.QUEUE_REDIS_URL;
  }
}
