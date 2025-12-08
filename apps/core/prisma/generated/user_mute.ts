import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserMute {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  notes?: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  targetUserId: string;
}
