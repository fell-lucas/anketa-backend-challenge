import { Controller, Get } from '@nestjs/common'

@Controller()
export class StatelessHealthCheckController {
  @Get('health')
  check() {
    return {
      status: 'ok',
    }
  }
}
