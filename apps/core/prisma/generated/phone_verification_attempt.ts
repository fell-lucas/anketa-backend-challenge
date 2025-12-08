import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PhoneVerificationAttempt {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  otp: string;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  snsMessageId: string;

  @ApiProperty({ type: Date })
  expiresAt: Date;

  @ApiPropertyOptional({ type: String })
  sessionId?: string;

  @ApiProperty({ type: String })
  userId: string;
}
