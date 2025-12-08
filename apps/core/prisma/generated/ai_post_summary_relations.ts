import { Post } from './post';
import { ApiProperty } from '@nestjs/swagger';

export class AIPostSummaryRelations {
  @ApiProperty({ type: () => Post })
  post: Post;
}
