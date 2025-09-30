import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  health() {
    return {
      uptime: process.uptime(),
      message: 'API está rodando',
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
