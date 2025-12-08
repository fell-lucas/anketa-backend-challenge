import { ApiProperty } from '@nestjs/swagger';

export class CircleMembership {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  role: string;

  @ApiProperty({ type: String })
  circleId: string;

  @ApiProperty({ type: String })
  userId: string;
}
