import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsTestService } from './aws.test.service';

@Module({
  providers: [
    {
      provide: AwsService,
      useClass:
        ['development', 'test'].includes(process.env.NODE_ENV) &&
        process.env.SIMULATE_AWS === 'true'
          ? AwsTestService
          : AwsService,
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
