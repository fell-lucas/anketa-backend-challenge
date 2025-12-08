import { Injectable } from '@nestjs/common';
import { PlatformVariables } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class PlatformVariableSeeds implements Seeds {
  constructor(private db: DbService) {}

  appVersion: PlatformVariables;
  minAppVersion: PlatformVariables;
  maintenanceMode: PlatformVariables;
  bValue: PlatformVariables;
  postDisclaimer: PlatformVariables;
  voteDisclaimer: PlatformVariables;
  signupDisclaimer: PlatformVariables;

  async seed(): Promise<void> {
    await this.createPlatformVariables();
  }

  async createPlatformVariables() {
    this.appVersion = await this.db.platformVariables.upsert({
      where: {
        name: 'app_version',
      },
      update: {},
      create: {
        name: 'app_version',
        category: 'app',
        value: '1.0.0',
      },
    });

    this.minAppVersion = await this.db.platformVariables.upsert({
      where: {
        name: 'min_app_version',
      },
      update: {},
      create: {
        name: 'min_app_version',
        category: 'app',
        value: '0.9.0',
      },
    });

    this.maintenanceMode = await this.db.platformVariables.upsert({
      where: {
        name: 'maintenance_mode',
      },
      update: {},
      create: {
        name: 'maintenance_mode',
        category: 'system',
        value: 'false',
      },
    });

    this.bValue = await this.db.platformVariables.upsert({
      where: {
        name: 'b_value',
      },
      update: {},
      create: {
        name: 'b_value',
        category: 'contracts',
        value: '0.1',
      },
    });

    // An example of disclaimers:
    this.postDisclaimer = await this.db.platformVariables.upsert({
      where: {
        name: 'post_disclaimer',
      },
      update: {},
      create: {
        name: 'post_disclaimer',
        category: 'disclaimers',
        value:
          'By posting content, you agree to our terms of service and community guidelines.',
      },
    });

    this.voteDisclaimer = await this.db.platformVariables.upsert({
      where: {
        name: 'vote_disclaimer',
      },
      update: {},
      create: {
        name: 'vote_disclaimer',
        category: 'disclaimers',
        value: 'Your vote is anonymous and cannot be changed once submitted.',
      },
    });

    this.signupDisclaimer = await this.db.platformVariables.upsert({
      where: {
        name: 'signup_disclaimer',
      },
      update: {},
      create: {
        name: 'signup_disclaimer',
        category: 'disclaimers',
        value:
          'By creating an account, you agree to our terms of service and privacy policy.',
      },
    });
  }
}
