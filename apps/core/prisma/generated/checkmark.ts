import { ApiProperty } from '@nestjs/swagger';

export class Checkmark {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  userId: string;
}
