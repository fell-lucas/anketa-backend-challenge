import { User } from './user';
import { Poll } from './poll';
import { ApiProperty } from '@nestjs/swagger';

export class PollRatingRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Poll })
  poll: Poll;
}
