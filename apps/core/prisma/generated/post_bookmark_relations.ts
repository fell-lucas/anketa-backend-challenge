import { User } from './user';
import { Post } from './post';
import { ApiProperty } from '@nestjs/swagger';

export class PostBookmarkRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Post })
  post: Post;
}
