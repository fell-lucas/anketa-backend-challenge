import { Global, Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { DbHealthCheckIndicator } from './db.health.indicator'
import { HealthcheckController } from './statefulHealthCheck.controller'

@Global()
@Module({
  imports: [TerminusModule],
  providers: [DbHealthCheckIndicator],
  controllers: [HealthcheckController],
})
export class StatefulHealthCheckModule {}
