import { Global, Module } from '@nestjs/common';
import { EmailModule } from 'src/libraries/email/email.module';
import { FirebaseModule } from '../../libraries/firebase/firebase.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';
import { AdminUserModule } from './admin/admin.user.module';
import { UserPreviewController } from './user-preview.controller';
import { UserController } from './user.controller';
import { UserSeeds } from './user.seeds';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [FirebaseModule, UserSettingsModule, AdminUserModule, EmailModule],
  controllers: [UserController, UserPreviewController],
  providers: [UserService, UserSeeds],
  exports: [UserService, UserSeeds],
})
export class UserModule {}
