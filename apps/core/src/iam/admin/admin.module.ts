import { Global, Module } from '@nestjs/common';
import { FirebaseModule } from '../../libraries/firebase/firebase.module';
import { AdminSeeds } from './admin.seeds';
import { AdminService } from './admin.service';

@Global()
@Module({
  imports: [FirebaseModule],
  providers: [AdminService, AdminSeeds],
  exports: [AdminService, AdminSeeds],
})
export class AdminModule {}
