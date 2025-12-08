import { Injectable } from '@nestjs/common';
import { Seeds } from '@repo/system/test/seeds.interface';
import { DbService } from '../libraries/db/db.service';
import { ActivityTypeEnum } from './activity-type.enum';

@Injectable()
export class ActivityPointsSeeds implements Seeds {
  constructor(private db: DbService) {}

  async seed(): Promise<void> {
    await this.createActivityTypes();
  }

  async createActivityTypes() {
    // Define all activity types with their point ranges
    const activityTypes = [
      {
        name: ActivityTypeEnum.LIKE,
        minPoints: 1,
        maxPoints: 3,
      },
      {
        name: ActivityTypeEnum.COMMENT_LIKE,
        minPoints: 1,
        maxPoints: 3,
      },
      {
        name: ActivityTypeEnum.RECEIVE_LIKE,
        minPoints: 1,
        maxPoints: 10,
      },
      {
        name: ActivityTypeEnum.COMMENT,
        minPoints: 2,
        maxPoints: 5,
      },
      {
        name: ActivityTypeEnum.SHARE,
        minPoints: 3,
        maxPoints: 8,
      },
      {
        name: ActivityTypeEnum.CREATE_POLL,
        minPoints: 5,
        maxPoints: 10,
      },
      {
        name: ActivityTypeEnum.REPORTING,
        minPoints: 2,
        maxPoints: 5,
      },
      {
        name: ActivityTypeEnum.BUY_ANALYTICS,
        minPoints: 10,
        maxPoints: 20,
      },
      {
        name: ActivityTypeEnum.COMPLETE_PROFILE,
        minPoints: 5,
        maxPoints: 10,
      },
      {
        name: ActivityTypeEnum.SHARE_APP,
        minPoints: 10,
        maxPoints: 20,
      },
      {
        name: ActivityTypeEnum.POLL_VOTE,
        minPoints: 1,
        maxPoints: 3,
      },
      {
        name: ActivityTypeEnum.DAILY_ACTIVE_USER,
        minPoints: 5,
        maxPoints: 15,
      },
      {
        name: ActivityTypeEnum.SAVE_POLL,
        minPoints: 2,
        maxPoints: 5,
      },
      {
        name: ActivityTypeEnum.REPOST,
        minPoints: 3,
        maxPoints: 7,
      },
      {
        name: ActivityTypeEnum.FIRST_SIGNUP,
        minPoints: 10,
        maxPoints: 20,
      },
    ];

    // Upsert each activity type
    for (const type of activityTypes) {
      await this.db.activityType.upsert({
        where: { name: type.name },
        update: {},
        create: {
          name: type.name,
          minPoints: type.minPoints,
          maxPoints: type.maxPoints,
          channelsPoints: 10,
        },
      });
    }
  }
}
