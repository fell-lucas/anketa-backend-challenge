import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Session {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Date })
  lastSeenAt?: Date;

  @ApiPropertyOptional({ type: Date })
  expiresAt?: Date;

  @ApiProperty({ type: String })
  deviceId: string;

  @ApiPropertyOptional({ type: String })
  userId?: string;

  @ApiPropertyOptional({ type: String })
  adminId?: string;
}
