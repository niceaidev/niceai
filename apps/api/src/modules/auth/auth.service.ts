import { Inject, Injectable } from '@nestjs/common';

import { DrizzleService } from '../drizzle/drizzle.service';

@Injectable()
export class AuthService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getInfo() {
    const res = await this.drizzle.db.query.User.findMany();
    return res;
  }
}
