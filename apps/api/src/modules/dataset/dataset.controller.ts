import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DatasetService } from './dataset.service';

@Controller('dataset')
@ApiTags('Dataset')
export class DatasetController {
  constructor(private dataset: DatasetService) {}

  @Get()
  getInfo() {
    return this.dataset.getInfo();
  }
}
