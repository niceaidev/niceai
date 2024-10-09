import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('info')
  async getInfo() {
    return await this.auth.getInfo();
  }

  @Get('view')
  async views() {
    return await this.auth.views();
  }

  @Post('view')
  async updateViews() {
    return await this.auth.updateViews();
  }
}
