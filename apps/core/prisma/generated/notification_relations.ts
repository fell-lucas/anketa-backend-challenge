import { User } from './user';
import { Post } from './post';
import { Comment } from './comment';
import { Vote } from './vote';
import { Follow } from './follow';
import { Like } from './like';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationRelations {
  @ApiProperty({ type: () => User })
  recipient: User;

  @ApiPropertyOptional({ type: () => User })
  sender?: User;

  @ApiPropertyOptional({ type: () => Post })
  post?: Post;

  @ApiPropertyOptional({ type: () => Comment })
  comment?: Comment;

  @ApiPropertyOptional({ type: () => Vote })
  vote?: Vote;

  @ApiPropertyOptional({ type: () => Follow })
  follow?: Follow;

  @ApiPropertyOptional({ type: () => Like })
  like?: Like;
}
