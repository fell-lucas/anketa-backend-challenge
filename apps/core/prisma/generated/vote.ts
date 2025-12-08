import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Vote {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  blockchainAddress?: string;

  @ApiPropertyOptional({ type: String })
  transactionHash?: string;

  @ApiProperty({ type: String })
  postId: string;

  @ApiProperty({ type: String })
  userId: string;
}
