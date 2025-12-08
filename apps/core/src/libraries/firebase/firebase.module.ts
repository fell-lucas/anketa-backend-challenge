import { Global, Module } from '@nestjs/common';
import 'dotenv/config';
import { FirebaseService } from './firebase.service';
import { FirebaseTestService } from './firebase.test.service';

@Global()
@Module({
  providers: [
    {
      provide: FirebaseService,
      useClass:
        ['development', 'test'].includes(process.env.NODE_ENV) &&
        process.env.SIMULATE_FIREBASE === 'true'
          ? FirebaseTestService
          : FirebaseService,
    },
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
