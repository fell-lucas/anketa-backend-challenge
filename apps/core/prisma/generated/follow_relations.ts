import { User } from './user';
import { Notification } from './notification';
import { ApiProperty } from '@nestjs/swagger';

export class FollowRelations {
  @ApiProperty({ type: () => User })
  follower: User;

  @ApiProperty({ type: () => User })
  followee: User;

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
