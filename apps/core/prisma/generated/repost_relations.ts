import { User } from './user';
import { Post } from './post';
import { Like } from './like';
import { ApiProperty } from '@nestjs/swagger';

export class RepostRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Post })
  post: Post;

  @ApiProperty({ isArray: true, type: () => Like })
  likes: Like[];
}
