import { Injectable } from '@nestjs/common';

import type { CreateToolDto } from './dto/create-tool.dto';
import type { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolService {
  create(createToolDto: CreateToolDto) {
    return 'This action adds a new tool';
  }

  findAll() {
    return 'This action returns all tool';
  }

  findOne(id: number) {
    return `This action returns a #${id} tool`;
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
  }

  remove(id: number) {
    return `This action removes a #${id} tool`;
  }
}
