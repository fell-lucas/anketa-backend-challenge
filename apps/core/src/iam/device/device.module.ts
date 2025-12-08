import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../libraries/firebase/firebase.module';
import { DeviceSeeds } from './device.seeds';
import { DeviceService } from './device.service';

@Module({
  imports: [FirebaseModule],
  providers: [DeviceService, DeviceSeeds],
  exports: [DeviceService, DeviceSeeds],
})
export class DeviceModule {}
