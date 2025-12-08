import { ApiProperty } from '@nestjs/swagger';

export class TokenMinting {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Object })
  winners: object;

  @ApiProperty({ type: Object })
  errors: object;

  @ApiProperty({ type: Number })
  amount: number;

  @ApiProperty({ type: Object })
  details: object = {};

  @ApiProperty({ type: Date })
  createdAt: Date;
}
