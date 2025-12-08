import { Post } from './post';
import { Poll } from './poll';
import { ApiProperty } from '@nestjs/swagger';

export class PostSectionRelations {
  @ApiProperty({ type: () => Post })
  post: Post;

  @ApiProperty({ isArray: true, type: () => Poll })
  linkResponsePolls: Poll[];

  @ApiProperty({ isArray: true, type: () => Poll })
  polls: Poll[];
}
