import { PollAnswer } from './poll_answer';
import { Vote } from './vote';
import { ApiProperty } from '@nestjs/swagger';

export class AIAnswerSummaryRelations {
  @ApiProperty({ type: () => PollAnswer })
  pollAnswer: PollAnswer;

  @ApiProperty({ type: () => Vote })
  vote: Vote;
}
