import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PluginService } from './plugin.service';

@Controller('plugin')
@ApiTags('Plugin')
export class PluginController {
  constructor(private readonly plugin: PluginService) {}
}
