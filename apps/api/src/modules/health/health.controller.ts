import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('')
@ApiTags('Health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get('')
  root() {
    return {
      message: 'Hello Nice AI.',
    };
  }

  @Get('health')
  @HealthCheck()
  check() {
    console.log('Health check');
    return this.health.check([]);
  }
}
