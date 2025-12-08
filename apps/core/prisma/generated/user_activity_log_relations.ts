import { User } from './user';
import { ActivityType } from './activity_type';
import { ApiProperty } from '@nestjs/swagger';

export class UserActivityLogRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => ActivityType })
  activityType: ActivityType;
}
