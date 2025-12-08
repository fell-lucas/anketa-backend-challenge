import { ApiProperty } from '@nestjs/swagger';

export class UserProfileInformation {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Object })
  data: object = {};
}
