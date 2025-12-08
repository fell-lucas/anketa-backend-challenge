import { PollAnswer } from './poll_answer';
import { Post } from './post';
import { User } from './user';
import { Notification } from './notification';
import { AIAnswerSummary } from './ai_answer_summary';
import { ApiProperty } from '@nestjs/swagger';

export class VoteRelations {
  @ApiProperty({ isArray: true, type: () => PollAnswer })
  answers: PollAnswer[];

  @ApiProperty({ type: () => Post })
  post: Post;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];

  @ApiProperty({ isArray: true, type: () => AIAnswerSummary })
  aiSummaries: AIAnswerSummary[];
}
