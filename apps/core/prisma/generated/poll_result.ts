import { ApiProperty } from '@nestjs/swagger';

export class PollResult {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  votesCount: number;

  @ApiProperty({ isArray: true, type: String })
  optionIds: string[];

  @ApiProperty({ type: String })
  pollId: string;
}
