import { ApiProperty } from '@nestjs/swagger';

export class ActivityType {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  minPoints: number;

  @ApiProperty({ type: Number })
  maxPoints: number;

  @ApiProperty({ type: Number })
  channelsPoints: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
