import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class DeviceSeeds implements Seeds {
  constructor(private db: DbService) {}

  deviceUser1: Device;
  deviceUser2: Device;

  async seed(): Promise<void> {
    this.deviceUser1 = await this.db.device.create({
      data: {
        fcmToken: 'fcmToken1',
        platformDeviceId: 'platformDeviceId1',
        userId: TEST_USER_1.appId,
        userAgent: 'Android 13',
        isDisabled: false,
        lastSeenAt: new Date(),
        createdAt: new Date(),
      },
    });
    this.deviceUser2 = await this.db.device.create({
      data: {
        fcmToken: 'fcmToken2',
        platformDeviceId: 'platformDeviceId2',
        userId: TEST_USER_2.appId,
        userAgent: 'iPhone 15',
        isDisabled: false,
        lastSeenAt: new Date(),
        createdAt: new Date(),
      },
    });
  }
}
