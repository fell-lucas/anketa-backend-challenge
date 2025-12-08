import { Poll } from './poll';
import { Vote } from './vote';
import { AIAnswerSummary } from './ai_answer_summary';
import { ApiProperty } from '@nestjs/swagger';

export class PollAnswerRelations {
  @ApiProperty({ type: () => Poll })
  poll: Poll;

  @ApiProperty({ type: () => Vote })
  vote: Vote;

  @ApiProperty({ isArray: true, type: () => AIAnswerSummary })
  aiSummaries: AIAnswerSummary[];
}
