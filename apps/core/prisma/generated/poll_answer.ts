import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PollAnswer {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  content?: string;

  @ApiPropertyOptional({ type: String })
  optionIds?: string;

  @ApiProperty({ type: String })
  pollId: string;

  @ApiProperty({ type: String })
  voteId: string;
}
