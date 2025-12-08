import { Module } from '@nestjs/common';
import { StatefulHealthCheckModule } from '@repo/system/health/stateful/stateful.module';
import { StatelessHealthCheckModule } from '@repo/system/health/stateless/stateless.module';
import { IamModule } from './iam/iam.module';
import { PlatformVariableModule } from './iam/platform-variable/platform-variable.module';
import { GlobalModule } from './libraries/global.module';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    // Library:
    GlobalModule,
    IamModule,
    StatelessHealthCheckModule,
    StatefulHealthCheckModule,
    PlatformVariableModule,
    SeedsModule,
  ],
})
export class AppModule {}
