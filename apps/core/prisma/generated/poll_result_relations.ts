import { Poll } from './poll';
import { ApiProperty } from '@nestjs/swagger';

export class PollResultRelations {
  @ApiProperty({ type: () => Poll })
  poll: Poll;
}
