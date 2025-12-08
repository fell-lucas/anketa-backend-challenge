import { Global, Module } from '@nestjs/common';
import 'dotenv/config';
import { StreamService } from './stream.service';
import { StreamTestService } from './stream.test.service';

@Global()
@Module({
  providers: [
    {
      provide: StreamService,
      useClass:
        ['development', 'test'].includes(process.env.NODE_ENV) &&
        process.env.SIMULATE_STREAM === 'true'
          ? StreamTestService
          : StreamService,
    },
  ],
  exports: [StreamService],
})
export class StreamModule {}
