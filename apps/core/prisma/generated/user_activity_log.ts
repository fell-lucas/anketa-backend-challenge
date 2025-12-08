import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserActivityLog {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  entityId?: string;

  @ApiProperty({ type: String })
  activity: string;

  @ApiProperty({ type: Number })
  points: number;

  @ApiProperty({ type: Object })
  channelsPoints: object = {};

  @ApiProperty({ type: Date })
  createdAt: Date;
}
