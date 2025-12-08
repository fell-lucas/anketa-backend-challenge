import { User } from './user';
import { Post } from './post';
import { ApiProperty } from '@nestjs/swagger';

export class PostMuteRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Post })
  post: Post;
}
