import { Global, Module } from '@nestjs/common';
import { AppleModule } from 'src/libraries/apple/apple.module';
import { AwsModule } from 'src/libraries/aws/aws.module';
import { GoogleModule } from 'src/libraries/google/google.modules';
import { FirebaseModule } from '../../libraries/firebase/firebase.module';
import { AdminService } from '../admin/admin.service';
import { DeviceModule } from '../device/device.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthEmailRecoveryController } from './auth.email-recovery.controller';
import { AuthPhoneService } from './auth.phone.service';
import { AuthService } from './auth.service';
import { ApiKeyAuthGuard } from './guards/api-key.auth.guard';
import { UserAuthGuard } from './guards/user.auth.guard';

@Global()
@Module({
  imports: [
    FirebaseModule,
    UserModule,
    DeviceModule,
    SessionModule,
    AppleModule,
    GoogleModule,
    AwsModule,
  ],
  controllers: [AuthController, AuthEmailRecoveryController],
  providers: [
    AuthService,
    UserAuthGuard,
    AdminService,
    AuthPhoneService,
    ApiKeyAuthGuard,
  ],
  exports: [AuthService, UserAuthGuard, AdminService, ApiKeyAuthGuard],
})
export class AuthModule {}
