import { FollowStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Follow {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  followerId: string;

  @ApiProperty({ type: String })
  followeeId: string;

  @ApiProperty({ enum: FollowStatus, enumName: 'FollowStatus' })
  status: FollowStatus = FollowStatus.PENDING;
}
