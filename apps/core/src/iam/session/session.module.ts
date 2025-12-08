import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../libraries/firebase/firebase.module';
import { SessionSeeds } from './session.seeds';
import { SessionService } from './session.service';

@Module({
  imports: [FirebaseModule],
  providers: [SessionService, SessionSeeds],
  exports: [SessionService, SessionSeeds],
})
export class SessionModule {}
