import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Like {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  postId?: string;

  @ApiPropertyOptional({ type: String })
  repostId?: string;

  @ApiPropertyOptional({ type: String })
  commentId?: string;
}
