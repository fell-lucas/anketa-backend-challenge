import { PostSection } from './post_section';
import { Poll } from './poll';
import { Post } from './post';
import { Media } from './media';
import { PollOption } from './poll_option';
import { PollAnswer } from './poll_answer';
import { PollResult } from './poll_result';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class PollRelations {
  @ApiPropertyOptional({ type: () => PostSection })
  section?: PostSection;

  @ApiPropertyOptional({ type: () => PostSection })
  linkResponseSection?: PostSection;

  @ApiPropertyOptional({ type: () => Poll })
  linkResponsePoll?: Poll;

  @ApiProperty({ isArray: true, type: () => Poll })
  linkResponseFromPolls: Poll[];

  @ApiProperty({ type: () => Post })
  post: Post;

  @ApiProperty({ isArray: true, type: () => Media })
  media: Media[];

  @ApiProperty({ isArray: true, type: () => PollOption })
  options: PollOption[];

  @ApiProperty({ isArray: true, type: () => PollAnswer })
  answers: PollAnswer[];

  @ApiProperty({ isArray: true, type: () => PollResult })
  results: PollResult[];
}
