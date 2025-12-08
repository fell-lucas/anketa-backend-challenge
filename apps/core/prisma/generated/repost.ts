import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Repost {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  comment?: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  postId: string;
}
