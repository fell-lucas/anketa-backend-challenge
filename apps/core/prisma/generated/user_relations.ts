import { Media } from './media';
import { UserStats } from './user_stats';
import { UserSettings } from './user_settings';
import { Checkmark } from './checkmark';
import { CircleMembership } from './circle_membership';
import { Circle } from './circle';
import { Comment } from './comment';
import { Device } from './device';
import { Follow } from './follow';
import { Like } from './like';
import { Post } from './post';
import { Repost } from './repost';
import { Session } from './session';
import { UserBlock } from './user_block';
import { UserMute } from './user_mute';
import { Wallet } from './wallet';
import { PhoneVerificationAttempt } from './phone_verification_attempt';
import { Channel } from './channel';
import { PostMute } from './post_mute';
import { Vote } from './vote';
import { PostBookmark } from './post_bookmark';
import { UserProfileInformation } from './user_profile_information';
import { Notification } from './notification';
import { UserActivityLog } from './user_activity_log';
import { PostSearch } from './post_search';
import { PostRating } from './post_rating';
import { UserAwardedTokens } from './user_awarded_tokens';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UserRelations {
  @ApiPropertyOptional({ type: () => Media })
  profilePicture?: Media;

  @ApiPropertyOptional({ type: () => UserStats })
  userStats?: UserStats;

  @ApiPropertyOptional({ type: () => UserSettings })
  userSettings?: UserSettings;

  @ApiProperty({ isArray: true, type: () => Checkmark })
  checkmarks: Checkmark[];

  @ApiProperty({ isArray: true, type: () => CircleMembership })
  circleMemberships: CircleMembership[];

  @ApiProperty({ isArray: true, type: () => Circle })
  circles: Circle[];

  @ApiProperty({ isArray: true, type: () => Comment })
  comments: Comment[];

  @ApiProperty({ isArray: true, type: () => Device })
  devices: Device[];

  @ApiProperty({ isArray: true, type: () => Follow })
  followers: Follow[];

  @ApiProperty({ isArray: true, type: () => Follow })
  following: Follow[];

  @ApiProperty({ isArray: true, type: () => Like })
  likes: Like[];

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];

  @ApiProperty({ isArray: true, type: () => Repost })
  reposts: Repost[];

  @ApiProperty({ isArray: true, type: () => Session })
  sessions: Session[];

  @ApiProperty({ isArray: true, type: () => UserBlock })
  blockedBy: UserBlock[];

  @ApiProperty({ isArray: true, type: () => UserBlock })
  blocking: UserBlock[];

  @ApiProperty({ isArray: true, type: () => UserMute })
  mutedBy: UserMute[];

  @ApiProperty({ isArray: true, type: () => UserMute })
  muting: UserMute[];

  @ApiProperty({ isArray: true, type: () => Wallet })
  wallets: Wallet[];

  @ApiProperty({ isArray: true, type: () => Media })
  media: Media[];

  @ApiProperty({ isArray: true, type: () => PhoneVerificationAttempt })
  phoneVerificationAttempts: PhoneVerificationAttempt[];

  @ApiProperty({ isArray: true, type: () => Channel })
  channels: Channel[];

  @ApiProperty({ isArray: true, type: () => PostMute })
  postMutes: PostMute[];

  @ApiProperty({ isArray: true, type: () => Vote })
  votes: Vote[];

  @ApiProperty({ isArray: true, type: () => PostBookmark })
  bookmarks: PostBookmark[];

  @ApiProperty({ isArray: true, type: () => UserProfileInformation })
  userProfileInformation: UserProfileInformation[];

  @ApiProperty({ isArray: true, type: () => Notification })
  receivedNotifications: Notification[];

  @ApiProperty({ isArray: true, type: () => Notification })
  sentNotifications: Notification[];

  @ApiProperty({ isArray: true, type: () => UserActivityLog })
  userActivityLogs: UserActivityLog[];

  @ApiProperty({ isArray: true, type: () => PostSearch })
  postSearches: PostSearch[];

  @ApiProperty({ isArray: true, type: () => PostRating })
  postRatings: PostRating[];

  @ApiProperty({ isArray: true, type: () => UserAwardedTokens })
  userAwardedTokens: UserAwardedTokens[];
}
