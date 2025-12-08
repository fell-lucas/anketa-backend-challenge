import { Global, Module } from '@nestjs/common';
import { AwsModule } from 'src/libraries/aws/aws.module';
import { FirebaseModule } from '../../../libraries/firebase/firebase.module';
import { AdminModule } from '../../admin/admin.module';
import { DeviceModule } from '../../device/device.module';
import { SessionModule } from '../../session/session.module';
import { AdminAuthController } from './admin.auth.controller';
import { AdminAuthService } from './admin.auth.service';
import { AdminAuthGuard } from './admin.auth.guard';
import { AdminService } from '../../admin/admin.service';

@Global()
@Module({
  imports: [
    FirebaseModule,
    AdminModule,
    DeviceModule,
    SessionModule,
    AwsModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminAuthGuard, AdminService],
  exports: [AdminAuthService, AdminAuthGuard, AdminService],
})
export class AdminAuthModule {}
