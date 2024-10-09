import { Injectable } from '@nestjs/common';

import { CacheService } from '../../cache';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../../database/database.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    try {
      const start = Date.now();
      const res = await this.db.query.User.findMany();
      const duration = Date.now() - start;
      console.log(`Request processed in ${duration}ms`);
      return {
        data: res,
      };
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: string) {
    return this.db.query.User.findFirst({
      where: eq(this.db.schema.User.id, id),
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
