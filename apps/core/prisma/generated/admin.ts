import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Admin {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  firebaseUid: string;

  @ApiProperty({ type: String })
  role: string;

  @ApiPropertyOptional({ type: Date })
  lastSeenAt?: Date;
}
