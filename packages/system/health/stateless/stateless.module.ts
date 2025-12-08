import { Global, Module } from '@nestjs/common'
import { StatelessHealthCheckController } from './statelessHealthCheck.controller'

@Global()
@Module({
	controllers: [StatelessHealthCheckController]
})
export class StatelessHealthCheckModule {}
