import { User } from './user';
import { Post } from './post';
import { Repost } from './repost';
import { Comment } from './comment';
import { Notification } from './notification';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LikeRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiPropertyOptional({ type: () => Post })
  post?: Post;

  @ApiPropertyOptional({ type: () => Repost })
  repost?: Repost;

  @ApiPropertyOptional({ type: () => Comment })
  comment?: Comment;

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
