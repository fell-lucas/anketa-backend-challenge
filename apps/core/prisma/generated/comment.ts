import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  postId: string;

  @ApiPropertyOptional({ type: String })
  parentCommentId?: string;

  @ApiProperty({ type: Number })
  likesCount: number;

  @ApiProperty({ type: Number })
  repliesCount: number;

  @ApiPropertyOptional({ type: Date })
  hiddenAt?: Date;

  @ApiPropertyOptional({ type: Date })
  hiddenUntil?: Date;

  @ApiPropertyOptional({ type: String })
  hiddenReason?: string;
}
