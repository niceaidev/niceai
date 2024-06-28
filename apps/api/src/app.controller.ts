import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
@ApiTags('Home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello() {
    return 'Hello Nice AI!';
  }

  @Get('test')
  async testMongo() {}
}
