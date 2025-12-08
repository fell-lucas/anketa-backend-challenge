import { ApiProperty } from '@nestjs/swagger';

export class PostBookmark {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  postId: string;
}
