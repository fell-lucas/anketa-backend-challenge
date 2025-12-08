import { FollowStatus } from '@prisma/client';
import { User } from 'prisma/generated/user';
import { UserStats } from 'prisma/generated/user_stats';

export class UserWithFollowsDto extends User {
  userStats: UserStats;
  walletBalance: number;
  followedByCurrentUser: { id: string; status: FollowStatus };
  followsCurrentUser: { id: string; status: FollowStatus };
  isBlockedByCurrentUser: boolean;
  hasBlockedCurrentUser: boolean;
}
