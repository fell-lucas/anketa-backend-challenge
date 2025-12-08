import { Media } from './media';
import { Poll } from './poll';
import { ApiProperty } from '@nestjs/swagger';

export class PollOptionRelations {
  @ApiProperty({ isArray: true, type: () => Media })
  media: Media[];

  @ApiProperty({ type: () => Poll })
  poll: Poll;
}
