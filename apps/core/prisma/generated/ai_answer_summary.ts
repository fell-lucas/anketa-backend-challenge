import { ApiProperty } from '@nestjs/swagger';

export class AIAnswerSummary {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: String })
  topics: string[];

  @ApiProperty({ type: String })
  sentiment: string;

  @ApiProperty({ type: Object })
  extractedEntities: object = [];

  @ApiProperty({ type: String })
  pollAnswerId: string;

  @ApiProperty({ type: String })
  voteId: string;
}
