import { Inject, Injectable } from '@nestjs/common';

import { CacheService } from '../cache';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CacheService) private readonly cache: CacheService,
    private readonly db: DatabaseService,
  ) {}

  async getInfo() {
    return this.cache.remember(
      'info',
      () => {
        return this.db.query.User.findFirst();
      },
      5,
    );
  }

  async views() {
    const views: number = (await this.cache.get('views')) ?? 0;
    console.log(views);
    return {
      views,
    };
  }

  async updateViews() {
    return this.cache.increment('views', 1);
  }
}
