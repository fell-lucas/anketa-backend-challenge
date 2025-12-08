import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Device {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Boolean })
  isDisabled: boolean;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiProperty({ type: String })
  userAgent: string;

  @ApiProperty({ type: String })
  platformDeviceId: string;

  @ApiPropertyOptional({ type: String })
  fcmToken?: string;

  @ApiPropertyOptional({ type: Date })
  lastSeenAt?: Date;

  @ApiPropertyOptional({ type: Date })
  lastSeenViaHttpAt?: Date;

  @ApiPropertyOptional({ type: Date })
  lastSeenViaWebsocketAt?: Date;

  @ApiPropertyOptional({ type: String })
  userId?: string;

  @ApiPropertyOptional({ type: String })
  adminId?: string;
}
