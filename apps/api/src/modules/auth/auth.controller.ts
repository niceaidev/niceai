import { Controller, Get, Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('info')
  getInfo() {
    return this.auth.getInfo();
  }
}
