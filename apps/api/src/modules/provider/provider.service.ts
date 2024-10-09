import { Injectable } from '@nestjs/common';

import type { CreateProviderDto } from './dto/create-provider.dto';
import type { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProviderService {
  create(createProviderDto: CreateProviderDto) {
    return 'This action adds a new provider';
  }

  findAll() {
    return 'This action returns all provider';
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
