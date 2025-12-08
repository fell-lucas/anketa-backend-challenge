import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { DbHealthCheckIndicator } from './db.health.indicator'

@Controller()
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private db: DbHealthCheckIndicator
  ) {}

  @Get('health')
  @HealthCheck()
  async check() {
    return this.health.check([() => this.db.pingCheck('database')])
  }
}
