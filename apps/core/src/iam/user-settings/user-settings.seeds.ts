import { Injectable } from '@nestjs/common';
import { TEST_USER_1, TEST_USER_2 } from '@repo/system/test/users.fixtures';
import { DbService } from 'src/libraries/db/db.service';

@Injectable()
export class UserSettingsSeeds {
  constructor(private readonly db: DbService) {}

  async seed() {
    // Create settings for test user 1
    await this.db.userSettings.upsert({
      where: { userId: TEST_USER_1.appId },
      update: {},
      create: {
        userId: TEST_USER_1.appId,
        // All defaults are set in the Prisma schema
      },
    });

    // Create settings for test user 2
    await this.db.userSettings.upsert({
      where: { userId: TEST_USER_2.appId },
      update: {},
      create: {
        userId: TEST_USER_2.appId,
        // All defaults are set in the Prisma schema
      },
    });
  }
}
