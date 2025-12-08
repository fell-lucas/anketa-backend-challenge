import { User } from './user';
import { Post } from './post';
import { PollOption } from './poll_option';
import { Poll } from './poll';
import { ApiProperty } from '@nestjs/swagger';

export class MediaRelations {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];

  @ApiProperty({ isArray: true, type: () => PollOption })
  pollOptions: PollOption[];

  @ApiProperty({ isArray: true, type: () => User })
  userProfilePicture: User[];

  @ApiProperty({ isArray: true, type: () => Poll })
  polls: Poll[];
}
