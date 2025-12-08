import { ApiProperty } from '@nestjs/swagger';

export class PostRating {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  rating: number;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  postId: string;
}
