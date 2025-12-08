import { Global, Module } from '@nestjs/common';
import 'dotenv/config';
import { InngestService } from './inngest.service';
import { InngestTestService } from './inngest.test.service';

@Global()
@Module({
  providers: [
    {
      provide: InngestService,
      useClass:
        ['development', 'test'].includes(process.env.NODE_ENV) &&
        process.env.SIMULATE_INNGEST === 'true'
          ? InngestTestService
          : InngestService,
    },
  ],
  exports: [InngestService],
})
export class InngestModule {}
